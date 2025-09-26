import connectToDatabase from "@/lib/mongoose";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import User from "@/lib/models/user.model";
import Thread from "@/lib/models/thread.model";

export async function DELETE(
  req: Request,
  { params }: { params: { id: string; commentId: string } }
) {
   const { userId } = await auth();
  //const userId = "user_329ZC1gP0BLPxdsTTKeK4eAJDKv";
  //const resolvedParams = await params; 
  
  if (!userId) {
    return NextResponse.json(
      { success: false, message: "unauthorized: This user is not authorized" },
      { status: 401 }
    );
  }
  
  try {
    await connectToDatabase();
    const mongoUser = await User.findOne({ id: userId });
    
    if (!mongoUser) {
      return NextResponse.json(
        { success: false, message: "User not found in database." },
        { status: 404 }
      );
    }

    const comment = await Thread.findById(params.commentId);
    if (
      !comment ||
      !comment.parentId ||
      comment.parentId.toString() !== params.id
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Comment not found or does not belong to this thread.",
        },
        { status: 404 }
      );
    }

    if (comment.author.toString() !== mongoUser._id.toString()) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized: You can only delete your own comments.",
        },
        { status: 403 }
      );
    }

    await Thread.findByIdAndDelete(params.commentId); 
    await Thread.findByIdAndUpdate(params.id, {
      $pull: { children: params.commentId }, 
    });

    return NextResponse.json(
      {
        success: true,
        message: "Comment deleted successfully.",
      },
      { status: 200 }
    );
  } catch (error) {
    console.log("Error deleting comment", error);
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
      },
      { status: 500 }
    );
  }
}

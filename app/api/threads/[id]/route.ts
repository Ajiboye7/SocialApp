import connectToDatabase from "@/lib/mongoose";
import { auth } from "@clerk/nextjs/server";
import User from "@/lib/models/user.model";
import { NextResponse } from "next/server";
import Thread from "@/lib/models/thread.model";

{
  /*export async function PUT(request: Request, {params} :{params: {id: string}}) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json(
      { success: false, message: "Unauthorized: No user session found" },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();
    const {  thread } = body;

    if (!thread) {
      return NextResponse.json(
        { success: false, message: "Thread is required." },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const mongoUser = await User.findOne({ id: userId });
    if (!mongoUser) {
      return NextResponse.json(
        { success: false, message: "User not found in database." },
        { status: 404 }
      );
    }

    const existingThread = await Thread.findById(params.id);
    if (!existingThread) {
      return NextResponse.json(
        { success: false, message: "Thread not found." },
        { status: 404 }
      );
    }

    // Check if the user is the author
    if (existingThread.author.toString() !== mongoUser._id.toString()) {
      return NextResponse.json(
        { success: false, message: "Unauthorized: You can only edit your own threads." },
        { status: 403 }
      );
    }

    // Update the thread
    existingThread.thread = thread;
    await existingThread.save();

    return NextResponse.json(
      {
        success: true,
        data: {
          _id: existingThread._id,
          thread: existingThread.thread,
          author: existingThread.author,
          createdAt: existingThread.createdAt,
          parentId: existingThread.parentId || null,
          children: existingThread.children,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.log("Error updating thread", error);
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
      },
      { status: 500 }
    );
  }
}*/
}

export async function DELETE(
  req: Request,

  { params }: { params: { id: string } }
) {
  const { userId } = await auth();
  //const userId = "user_329ZC1gP0BLPxdsTTKeK4eAJDKv"
  //  const resolvedParams = await params
  if (!userId) {
    return NextResponse.json(
      { success: false, message: "unauthorized: No user session found" },
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
    const existingThread = await Thread.findById(params.id);
    if (!existingThread) {
      return NextResponse.json(
        { success: false, message: "Thread not found." },
        { status: 404 }
      );
    }

    // Check if the user is the author
    if (existingThread.author.toString() !== mongoUser._id.toString()) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized: You can only delete your own threads.",
        },
        { status: 403 }
      );
    }

    // Delete the thread and its children (comments)
    await Thread.deleteMany({
      _id: { $in: [params.id, ...existingThread.children] },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Thread deleted successfully.",
      },
      { status: 200 }
    );
  } catch (error) {
    console.log("Error deleting thread", error);
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
      },
      { status: 500 }
    );
  }
}

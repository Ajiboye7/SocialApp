import connectToDatabase from "@/lib/mongoose";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import User from "@/lib/models/user.model";
import Thread from "@/lib/models/thread.model";

export async function POST(
  request: Request,
   { params }: { params: Promise<{ id: string }> }
) {
  const { userId } = await auth();
   const resolvedParams = await params;
   //const userId = "user_329ZC1gP0BLPxdsTTKeK4eAJDKv";
  if (!userId) {
    return NextResponse.json(
      { success: false, message: "unauthorized: No user session found" },
      { status: 401 }
    );
  }
  try {
    const body = await request.json();
    const { thread } = body;

    if (!thread) {
      return NextResponse.json(
        { success: false, message: "comment required" },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const user = await User.findOne({ id: userId });
    if (!user) {
      return NextResponse.json({ success: false, message: "user not found" });
    }

    const parentThread = await Thread.findById(resolvedParams.id);
    if (!parentThread)
      return NextResponse.json(
        { message: "Parent thread not found" },
        { status: 404 }
      );

    const comment = await Thread.create({
      author: user._id,
      parentId: parentThread._id,
      thread,
    });

    

    parentThread.children.push(comment._id);
    await parentThread.save();

    const populatedComment = await Thread.findById(comment._id)
  .populate({
    path: "author",
    select: "username profile_picture" 
  })
  

    {/*return NextResponse.json(
      {
        success: true,
        data: {
          _id: comment._id,
          thread: comment.thread,
          author: comment.author,
          parentId: comment.parentId,
          children: [],
        },
      },
      { status: 201 }
    );*/}
    return NextResponse.json(
  {
    success: true,
    data: {
      _id: populatedComment._id,
      thread: populatedComment.thread,
      author: populatedComment.author,   
      parentId: populatedComment.parentId,
      children: [],
    },
  },
  { status: 201 }
);
  } catch (error) {
    console.error("Error adding comment", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
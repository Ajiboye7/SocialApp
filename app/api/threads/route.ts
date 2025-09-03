import Thread from "@/lib/models/thread.model";
import connectToDatabase from "@/lib/mongoose";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import User from "@/lib/models/user.model";

export async function POST(request: Request) {
  const { userId } = await auth();

  console.log('User id', userId)

  if (!userId) {
    return NextResponse.json(
      { success: false, message: "Unauthorized: No user session found" },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();
    const { thread } = body;

    if (!thread) {
      return NextResponse.json(
        { success: false, message: "Thread content is required." },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const mongoUser = await User.findOne({ userId });
    if (!mongoUser) {
      return NextResponse.json(
        { success: false, message: "User not found in database." },
        { status: 404 }
      );
    }

    const newThread = await Thread.create({
      thread,
      author: mongoUser._id,
    });

    return NextResponse.json(
      {
        success: true,
        data: {
          thread: newThread.thread,
          author: newThread.author,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.log("Error creating thread", error);
    return NextResponse.json(
      {
        success: false,
        message: "Internal server Error",
      },
      { status: 500 }
    );
  }
}

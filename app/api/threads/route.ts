import Thread from "@/lib/models/thread.model";
import connectToDatabase from "@/lib/mongoose";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import User from "@/lib/models/user.model";
import { success } from "zod";

export async function POST(request: Request) {
  const { userId } = await auth();

  //const userId = "user_329ZC1gP0BLPxdsTTKeK4eAJDKv";

  //console.log("User id", userId);

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

    const mongoUser = await User.findOne({ id: userId });
    if (!mongoUser) {
      return NextResponse.json(
        { success: false, message: "User not found in database."},
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

export async function GET() {
  const { userId } = await auth();

  //const userId = "user_329ZC1gP0BLPxdsTTKeK4eAJDKv";

  if (!userId) {
    return NextResponse.json(
      { success: false, message: "unauthorized" },
      { status: 401 }
    );
  }

  try {
    await connectToDatabase();
    const author = await User.findOne({ id: userId });
    //console.log('author of post', author)

    if (!author) {
      return NextResponse.json(
        { success: false, message: "no author for this thread" },
        { status: 401 }
      );
    }
    const threads = await Thread.find({ author: author._id });
    //const threads = await Thread.find({ author: author._id }).populate('author');
    /*
     if (!threads || threads.length === 0) {
      return NextResponse.json({
        success: false,
        message: "Threads not found",
      });
    }
     */

    if (!threads) {
      return NextResponse.json({
        success: false,
        message: "Threads not found",
      });
    }

    return NextResponse.json(
      {
        success: true,
        data: {
          threads,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.log("error fetching threads", error);

    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}

/*export async function POST(request: Request) {
  const { userId } = await auth();

  //const userId = "user_329ZC1gP0BLPxdsTTKeK4eAJDKv";

  if (!userId) {
    return NextResponse.json(
      { success: false, message: "unauthorized" },
      { status: 401 }
    );
  }

  try{

   const body = await request.json();
    const { thread } = body;

  }catch(error){
      console.log("error fetching threads", error);

    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );

  }

}*/

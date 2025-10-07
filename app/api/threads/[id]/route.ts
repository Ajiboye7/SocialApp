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

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { userId } = await auth();
  const resolvedParams = await params;

  if (!userId) {
    return NextResponse.json(
      { success: false, message: "unauthorized" },
      { status: 401 }
    );
  }

  try {
    await connectToDatabase();
    const user = await User.findOne({ id: userId });
    if (!user) {
      return NextResponse.json(
        { success: false, message: "no user found" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "5", 10);
    const skip = (page - 1) * limit;

    const thread = await Thread.findById(resolvedParams.id).populate({
      path: "author",
      select: "username profile_picture",
    });

    if (!thread) {
      return NextResponse.json(
        { success: false, message: "Thread not found" },
        { status: 404 }
      );
    }

    const comments = await Thread.find({ parentId: thread._id })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate({
        path: "author",
        select: "username profile_picture",
      });

    const totalComment = await Thread.countDocuments({ parentId: thread._id });
    const totalPages = Math.ceil(totalComment / limit);

    const transformedThread = {
      thread: {
        _id: thread._id,
        thread: thread.thread,
        author: {
          id: thread.author._id.toString(),
          username: thread.author.username,
          profile_picture: thread.author.profile_picture,
        },
        createdAt: thread.createdAt,
        parentId: thread.parentId ? thread.parentId.toString() : null,
      },

      children: comments.map((comment) => ({
        _id: comment._id.toString(),
        thread: comment.thread,
        author: {
          id: comment.author._id.toString(),
          username: comment.author.username,
          profile_picture: comment.author.profile_picture,
        },
        createdAt: comment.createdAt,
        parentId: comment.parentId ? comment.parentId.toString() : null,
        children: [],
      })),

      pagination: {
        totalComment,
        totalPages,
        currentPage: page,
        limit,
      },
    };

    return NextResponse.json(
      {
        success: true,
        data: transformedThread,
      },
      { status: 200 }
    );
  } catch (error) {
    console.log("error fetching thread", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}

//NEXT TASK

/*
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";
import connectToDatabase from "@/lib/database";
import Thread from "@/models/Thread";
import User from "@/models/User";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  try {
    await connectToDatabase();

    const thread = await Thread.findById(params.id)
      .populate({
        path: "children",
        populate: {
          path: "author",
          select: "username profile_picture",
        },
      })
      .populate({
        path: "author",
        select: "username profile_picture",
      })
      .lean();

    if (!thread) {
      return NextResponse.json({ success: false, message: "Thread not found" }, { status: 404 });
    }

    const transformedThread = {
      _id: thread._id.toString(),
      thread: thread.thread,
      author: {
        id: thread.author._id.toString(),
        username: thread.author.username,
        profile_picture: thread.author.profile_picture,
      },
      createdAt: thread.createdAt,
      parentId: thread.parentId ? thread.parentId.toString() : null,
      children: thread.children.map((child: any) => ({
        _id: child._id.toString(),
        thread: child.thread,
        author: {
          id: child.author._id.toString(),
          username: child.author.username,
          profile_picture: child.author.profile_picture,
        },
        createdAt: child.createdAt,
        parentId: child.parentId ? child.parentId.toString() : null,
        children: [], // You can make this recursive if needed
      })),
    };

    return NextResponse.json({ success: true, data: transformedThread }, { status: 200 });
  } catch (error) {
    console.error("Error fetching thread", error);
    return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
  }
}

*/

import Thread from "@/lib/models/thread.model";
import connectToDatabase from "@/lib/mongoose";
import { auth, currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import User from "@/lib/models/user.model";
import Community from "@/lib/models/community.model";

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
    const { thread, communityId } = body;

    if (!thread) {
      return NextResponse.json(
        { success: false, message: "Thread content is required."},
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
    
    const mongoCommunity = await Community.findOne({id : communityId})
    if(!mongoCommunity){
      return NextResponse.json(
        { success: false, message: "Organization not found in database." },
        { status: 404 }
      )
    }

    const newThread = await Thread.create({
      thread,
      author: mongoUser._id,
      community: mongoCommunity._id
    });

    mongoUser.threads.push(newThread._id);
    await mongoUser.save();

    return NextResponse.json(
      {
        success: true,
        data: {
          thread: newThread.thread,
          author: newThread.author,
          _id: newThread._id,
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

export async function GET(req: Request) {
  //const { userId } = await auth();
  const userId = "user_329ZC1gP0BLPxdsTTKeK4eAJDKv";
  if (!userId) {
    return NextResponse.json(
      { success: false, message: "unauthorized" },
      { status: 401 }
    );
  }

  try {
    await connectToDatabase();
    const currentUser = await User.findOne({ id: userId });
    if (!currentUser) {
      return NextResponse.json(
        { success: false, message: "no user found" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const topLevelOnly = searchParams.get("topLevelOnly") === "true";
    const userOnly = searchParams.get("userOnly") === "true";
    const userComment = searchParams.get("UserCommentsOnly") === "true";
    const authorId = searchParams.get("authorId");
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);
    const skip = (page - 1) * limit;

    let effectiveAuthorId;

    if (authorId) {
      const targetUser = await User.findById(authorId);

      if (!targetUser) {
        return NextResponse.json(
          { success: false, message: "Target user not found" },
          { status: 404 }
        );
      }
      effectiveAuthorId = authorId;
    } else if (userOnly) {
      effectiveAuthorId = currentUser._id;
    }

    const query: any = {};
    if (topLevelOnly) {
      query.parentId = null;
    } else if (userComment) {
      query.parentId = { $ne: null };
    }
    if (effectiveAuthorId) {
      query.author = effectiveAuthorId;
    }

    const threads = await Thread.find(query)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 })
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
      .populate({
        path : 'community',
        model: Community
      })
      .lean();
    const totalThreads = await Thread.countDocuments(query); // Use same query for total
    const totalUserThreadQuery: any = { ...query }; // Reuse for user-specific count
    const totalUserThread = await Thread.countDocuments(totalUserThreadQuery);

    const transformedThreads = threads.map((thread) => ({
      _id: thread._id,
      thread: thread.thread,
      author: {
        id: thread.author._id.toString(),
        username: thread.author.username,
        profile_picture: thread.author.profile_picture,
      },
      community: {
        _id: thread.community._id.toString(),
        picture: thread.community.community_picture,
        name: thread.community.name,
        slug: thread.community.slug,
        bio: thread.community.bio,

      },
      createdAt: thread.createdAt,
      parentId: thread.parentId ? thread.parentId.toString() : null,
      children: thread.children.map((child: any) => ({
        _id: child._id.toString(),
        thread: child.thread,
        author: {
          id: child._id.toString(),
          username: child.author.username,
          profile_picture: child.author.profile_picture,
        },
        createdAt: child.createdAt,
        parentId: child.parentId ? child.parentId.toString() : null,
        children: [],
      })),
    }));

    return NextResponse.json(
      {
        success: true,
        data: {
          threads: transformedThreads,
          totalThreads,
          totalUserThread,
          totalPages: Math.ceil(totalThreads / limit),
          currentPage: page,
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

{
  /**
   
  export async function GET(req: Request) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json(
      { success: false, message: "unauthorized" },
      { status: 401 }
    );
  }

  try {
    await connectToDatabase();
    const currentUser = await User.findOne({ id: userId });
    if (!currentUser) {
      return NextResponse.json(
        { success: false, message: "no user found" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const topLevelOnly = searchParams.get("topLevelOnly") === "true";
    const userOnly = searchParams.get("userOnly") === "true";
    const userComment = searchParams.get("UserCommentsOnly") === "true";
    const authorId = searchParams.get("authorId");
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);
    const skip = (page - 1) * limit;

    let effectiveAuthorId;

    if (authorId) {
      const targetUser = await User.findById(authorId);
      if (!targetUser) {
        return NextResponse.json(
          { success: false, message: "Target user not found" },
          { status: 404 }
        );
      }
      effectiveAuthorId = authorId;
    } else if (userOnly) {
      effectiveAuthorId = currentUser._id;
    }

    const query: any = {};
    if (topLevelOnly) {
      query.parentId = null;
    } else if (userComment) {
      query.parentId = { $ne: null };
    }
    if (effectiveAuthorId) {
      query.author = effectiveAuthorId;
    }

    const threads = await Thread.find(query)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 })
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

    const totalThreads = await Thread.countDocuments(query);
    const totalUserThread = await Thread.countDocuments(query);

    const transformedThreads = threads
      .filter(thread => thread.author) // Filter out threads with no author
      .map((thread) => ({
        _id: thread._id,
        thread: thread.thread,
        author: {
          id: thread.author._id.toString(),
          username: thread.author.username,
          profile_picture: thread.author.profile_picture,
        },
        createdAt: thread.createdAt,
        parentId: thread.parentId ? thread.parentId.toString() : null,
        children: thread.children
          .filter((child: any) => child.author) // Filter children with no author
          .map((child: any) => ({
            _id: child._id.toString(),
            thread: child.thread,
            author: {
              id: child.author._id.toString(),
              username: child.author.username,
              profile_picture: child.author.profile_picture,
            },
            createdAt: child.createdAt,
            parentId: child.parentId ? child.parentId.toString() : null,
            children: [],
          })),
      }));

    return NextResponse.json(
      {
        success: true,
        data: {
          threads: transformedThreads,
          totalThreads,
          totalUserThread,
          totalPages: Math.ceil(totalThreads / limit),
          currentPage: page,
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
   */
}

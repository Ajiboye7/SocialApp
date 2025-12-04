import connectToDatabase from "@/lib/mongoose";
import { auth } from "@clerk/nextjs/server";
import User from "@/lib/models/user.model";
import { NextResponse } from "next/server";
import Thread from "@/lib/models/thread.model";
import Community from "@/lib/models/community.model";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  //const { userId } = await auth();
  const userId = "user_329ZC1gP0BLPxdsTTKeK4eAJDKv";
  const resolvedParams = await params;

  if (!userId) {
    return NextResponse.json(
      { success: false, message: "unauthorized" },
      { status: 401 }
    );
  }

  try {
    await connectToDatabase();

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "5", 10);
    const skip = (page - 1) * limit;

    const community = await Community.findById(resolvedParams.id)
      .sort({ createdAt: -1 })
      //.skip(skip)
      //.limit(limit)
      .populate({
        path: "createdBy",
        model: User,
        select: "username profile_picture",
      })
      .populate([
        {
          path: "members",
          model: User,
          select: "name username profile_picture _id id",
        },
      ])

      .populate({
        path: "threads",
        model: Thread,
        select: "thread parentId createdAt children author", // <-- ADD THIS
        populate: [
          {
            path: "author",
            model: User,
            select: "name username profile_picture",
          },
          {
            path: "children",
            model: Thread,
            select: "thread parentId createdAt author", // <-- ADD THIS TOO
            populate: {
              path: "author",
              model: User,
              select: "username profile_picture",
            },
          },
        ],
      });
      
      /**
       .populate({
        path: "threads",
        model: Thread,
        populate: [
          {
            path: "author",
            model: User,
            select: "name image id",
          },
          {
            path: "children",
            model: Thread,
            populate: {
              path: "author",
              model: User,
              select: "image _id",
            },
          },
        ],
      });
       */

    const transformedCommunity = {
      community: {
        _id: community._id,
        id: community.id,
        name: community.name,
        slug: community.slug,
        bio: community.bio,
        community_picture: community.community_picture,

        createdBy: {
          _id: community.createdBy._id,
          username: community.createdBy.username,
          profile_picture: community.createdBy.profile_picture,
        },

        members: community.members.map((member: any) => ({
          _id: member._id,
          username: member.username,
          profile_picture: member.profile_picture,
        })),

        threads: community.threads.map((thread: any) => ({
          _id: thread._id,
          thread: thread.thread,
          parentId: thread.parentId ? thread.parentId.toString() : null,
          author: {
            id: thread.author._id,
            username: thread.author.username,
            profile_picture: thread.author.profile_picture,
          },
          createdAt: thread.createdAt,
          children: thread.children.map((child: any) => ({
            _id: child._id,
            author: {
              _id: child.author._id,
              username: child.author.username,
              profile_picture: child.author.profile_picture,
            },
            parentId: child.parentId ? child.parentId.toString() : null,
            thread: child.thread,
            createdAt: child.createdAt,
            children: [],
          })),
        })),
      },

      pagination: {
        // totalComment,
        //totalPages,
        currentPage: page,
        limit,
      },
    };

    return NextResponse.json(
      {
        success: true,
        data: transformedCommunity,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Community fetch error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}

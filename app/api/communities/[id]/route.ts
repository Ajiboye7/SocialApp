import connectToDatabase from "@/lib/mongoose";
import { auth } from "@clerk/nextjs/server";
import User from "@/lib/models/user.model";
import { NextResponse } from "next/server";
import Thread from "@/lib/models/thread.model";
import Community from "@/lib/models/community.model";
import { clerkClient } from "@clerk/nextjs/server";

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
        select: "thread parentId createdAt children author",
        populate: [
          {
            path: "author",
            model: User,
            select: "name username profile_picture",
          },
          {
            path: "children",
            model: Thread,
            select: "thread parentId createdAt author",
            populate: {
              path: "author",
              model: User,
              select: "username profile_picture",
            },
          },
        ],
      });

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

export async function POST(
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
    const community = await Community.findById(resolvedParams.id);
    if (!community) {
      return NextResponse.json(
        { success: false, message: "community not found" },
        { status: 404 }
      );
    }
    const user = await User.findOne({ id: userId });
    const mongoUserId = user._id;

    const clerkCommunityId = community.id;

    if (
      community.requests.includes(mongoUserId) ||
      community.members.includes(mongoUserId)
    ) {
      return NextResponse.json(
        { success: false, message: "Already applied or already a member" },
        { status: 400 }
      );
    }

    community.requests.push(mongoUserId);
    await community.save();

    return NextResponse.json(
      {
        success: true,
        message: "Join request submitted",
        data: { requests: community.requests },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Community fetch error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}

/*try {
      const clerkResponse = await fetch(
        `https://api.clerk.com/v1/organizations/${clerkCommunityId}/memberships`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${process.env.CLERK_SECRET_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            user_id: userId,
            role: "org:member",
          }),
        }
      );

      if (!clerkResponse.ok) {
        const errorData = await clerkResponse.json();
        console.error("Clerk API error:", errorData);
        
        // Rollback MongoDB change if Clerk fails
        community.requests.pull(mongoUserId);
        await community.save();
        
        return NextResponse.json(
          { success: false, message: "Failed to add member to Clerk organization" },
          { status: 500 }
        );
      }

      //const clerkData = await clerkResponse.json();
      //console.log("User added to Clerk organization:", clerkData);
      
    } catch (clerkError) {
      console.error("Clerk membership error:", clerkError);
      
      // Rollback MongoDB change
      community.requests.pull(mongoUserId);
      await community.save();
      
      return NextResponse.json(
        { success: false, message: "Failed to sync with Clerk" },
        { status: 500 }
      );
    }*/
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string, userId: string }> }
) {
  const userId = "user_329ZC1gP0BLPxdsTTKeK4eAJDKv";
  const resolvedParams = await params;

  if (!userId) {
    return NextResponse.json(
      { success: false, message: "unauthorized" },
      { status: 401 }
    );
  }

  const url = new URL(req.url);
  const action = url.searchParams.get("action");
  if (!action || !["accept", "reject"].includes(action)) {
    return NextResponse.json(
      { success: false, message: "Invalid or missing action" },
      { status: 400 }
    );
  }

  try {
    await connectToDatabase();
    const mongoUserId = resolvedParams.userId
    const community = await Community.findById(resolvedParams.id);
    if (!community) {
      return NextResponse.json(
        { success: false, message: "Community not found" },
        { status: 404 }
      );
    }

    if (!community.requests.includes(mongoUserId)) {
      return NextResponse.json(
        { success: false, message: "User not in request list" },
        { status: 400 }
      );
    }

    community.requests = community.requests.filter(
      (id: any) => id.toString() !== mongoUserId
    );

    if (action === "accept") {
      community.members.push(mongoUserId);
    }

    return NextResponse.json(
      {
        success: true,
        message: action === "accept" ? "User accepted" : "User rejected",
        data: {
          requests: community.requests,
          members: community.members,
        },
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

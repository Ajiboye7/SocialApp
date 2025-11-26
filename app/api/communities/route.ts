import Community from "@/lib/models/community.model";
import connectToDatabase from "@/lib/mongoose";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import User from "@/lib/models/user.model";

export async function POST(req: Request) {
  const { userId } = await auth();
  //const userId = "user_329ZC1gP0BLPxdsTTKeK4eAJDKv";

  if (!userId) {
    return NextResponse.json(
      { success: false, message: "Unauthorized: No user session found" },
      { status: 401 }
    );
  }

  try {
    const body = await req.json();
    const { id, name, slug, bio, community_picture } = body;

    if (!id || !name || !slug || !bio || !community_picture) {
      return NextResponse.json(
        {
          success: false,
          message: "Please provide all necessary community details.",
        },
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

    const newCommunity = await Community.create({
      id,
      name,
      slug,
      bio,
      community_picture,
      createdBy: mongoUser._id,
    });

    const createdCommunity = await newCommunity.save();

    mongoUser.communities.push(createdCommunity._id);
    await mongoUser.save();

    createdCommunity.members.push(mongoUser._id);
    await createdCommunity.save();

    return NextResponse.json(
      {
        success: true,
        data: {
          _id: createdCommunity._id,
          name: createdCommunity.name,
          slug: createdCommunity.slug,
          bio: createdCommunity.bio,
          community_picture: createdCommunity.community_picture,
          createdBy: createdCommunity.createdBy,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.log("Error creating community", error);
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

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);
    const skip = (page - 1) * limit;

    const communities = await Community.find({})
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 })
      .populate("members");

    if (!communities) {
      return NextResponse.json(
        { success: false, message: "No community found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: communities,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Communities fetch error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}

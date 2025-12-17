import connectToDatabase from "@/lib/mongoose";
import { auth } from "@clerk/nextjs/server";
import User from "@/lib/models/user.model";
import { NextResponse } from "next/server";
import Thread from "@/lib/models/thread.model";
import Community from "@/lib/models/community.model";
import { clerkClient } from "@clerk/nextjs/server";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string; userId: string }> }
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
    const mongoUserId = resolvedParams.userId;
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

    await community.save();

    const populatedCommunity = await Community.findById(resolvedParams.id)
      .populate("requests", "_id username profile_picture")
      .populate("members", "_id username profile_picture");

       const totalRequests = community.requests.length;
    const totalMembers = community.members.length;
    const totalThreads = community.threads?.length || 0;

    return NextResponse.json(
      {
        success: true,
        message: action === "accept" ? "User accepted" : "User rejected",
        data: {
          requests: populatedCommunity.requests,
          members: populatedCommunity.members,
          totalRequests,
          totalMembers,
          totalThreads
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

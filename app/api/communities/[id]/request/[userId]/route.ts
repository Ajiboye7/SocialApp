import connectToDatabase from "@/lib/mongoose";
import { auth } from "@clerk/nextjs/server";
import User from "@/lib/models/user.model";
import { NextResponse } from "next/server";
import Community from "@/lib/models/community.model";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string; userId: string }> }
) {
  const { userId: authUserId } = await auth();
  const resolvedParams = await params;

  if (!authUserId) {
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

    const requestUserMongoId = resolvedParams.userId;
    const mongoCommunityId = resolvedParams.id;

    const authUser = await User.findOne({ id: authUserId });

    if (!authUser) {
      return NextResponse.json(
        { success: false, message: "Auth User not found" },
        { status: 404 }
      );
    }

    const requestUser = await User.findById(requestUserMongoId);
    if (!requestUser) {
      return NextResponse.json(
        { success: false, message: "Request user not found" },
        { status: 404 }
      );
    }

    const community = await Community.findById(mongoCommunityId);
    if (!community) {
      return NextResponse.json(
        { success: false, message: "Community not found" },
        { status: 404 }
      );
    }

    console.log("Community created by:", community.createdBy.toString());
    console.log("Auth user (admin):", authUser._id.toString());
    console.log("Request user being processed:", requestUserMongoId);

    if (community.createdBy.toString() !== authUser._id.toString()) {
      return NextResponse.json(
        {
          success: false,
          message: "Only community admins can accept/reject requests",
        },
        { status: 403 }
      );
    }

    if (!community.requests.includes(requestUserMongoId)) {
      return NextResponse.json(
        { success: false, message: "User not in request list" },
        { status: 400 }
      );
    }

    community.requests = community.requests.filter(
      (id: any) => id.toString() !== requestUserMongoId
    );

    if (action === "accept") {
      community.members.push(requestUserMongoId);
      requestUser.communities.push(mongoCommunityId);

      await Promise.all([community.save(), requestUser.save()]);

      const clerkCommunityId = community.id;
      const clerkUserId = requestUser.id;

      try {
        const clerkResponse = await fetch(
          `https://api.clerk.com/v1/organizations/${clerkCommunityId}/memberships`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${process.env.CLERK_SECRET_KEY}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              user_id: clerkUserId,
              role: "org:member",
            }),
          }
        );

        if (!clerkResponse.ok) {
          const errorData = await clerkResponse.json();
          console.error("Clerk API error:", errorData);

          community.members = community.members.filter(
            (id: any) => id.toString() !== requestUserMongoId
          );
          community.requests.push(requestUserMongoId);
          requestUser.communities = requestUser.communities.filter(
            (id: any) => id.toString() !== mongoCommunityId
          );

          await Promise.all([community.save(), requestUser.save()]);

          return NextResponse.json(
            {
              success: false,
              message: "Failed to add member to Clerk organization",
            },
            { status: 500 }
          );
        }
      } catch (clerkError) {
        console.error("Clerk membership error:", clerkError);

        community.members = community.members.filter(
          (id: any) => id.toString() !== requestUserMongoId
        );
        community.requests.push(requestUserMongoId);
        requestUser.communities = requestUser.communities.filter(
          (id: any) => id.toString() !== mongoCommunityId
        );

        await Promise.all([community.save(), requestUser.save()]);

        return NextResponse.json(
          { success: false, message: "Failed to sync with Clerk" },
          { status: 500 }
        );
      }
    } else {
      await community.save();
    }

    const populatedCommunity = await Community.findById(mongoCommunityId)
      .populate("requests", "_id username profile_picture")
      .populate("members", "_id username profile_picture");

    const totalRequests = populatedCommunity.requests.length;
    const totalMembers = populatedCommunity.members.length;
    const totalThreads = populatedCommunity.threads?.length || 0;

    return NextResponse.json(
      {
        success: true,
        message: action === "accept" ? "User accepted" : "User rejected",
        data: {
          requests: populatedCommunity.requests,
          members: populatedCommunity.members,
          totalRequests,
          totalMembers,
          totalThreads,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Community request handling error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}

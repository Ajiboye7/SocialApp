import connectToDatabase from "@/lib/mongoose";
import { auth } from "@clerk/nextjs/server";
import User from "@/lib/models/user.model";
import { NextResponse } from "next/server";
import Community from "@/lib/models/community.model";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string; userId: string }> }
) {
  const { userId: authUserId } = await auth(); // Logged-in user (admin)
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
    
    // Request user ID from URL params (user being accepted/rejected)
    const requestUserMongoId = resolvedParams.userId;
    const mongoCommunityId = resolvedParams.id;
    
    // Get the logged-in user (admin)
    const authUser = await User.findOne({ id: authUserId });

    if (!authUser) {
      return NextResponse.json(
        { success: false, message: "Auth User not found" },
        { status: 404 }
      );
    }

    // Get the user being accepted/rejected
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

    console.log('Community created by:', community.createdBy.toString());
    console.log('Auth user (admin):', authUser._id.toString());
    console.log('Request user being processed:', requestUserMongoId);

    // FIXED: Check if the LOGGED-IN user is the admin, not the request user
    if (community.createdBy.toString() !== authUser._id.toString()) {
      return NextResponse.json(
        { success: false, message: "Only community admins can accept/reject requests" },
        { status: 403 }
      );
    }

    // FIXED: Check if the REQUEST USER is in the request list
    if (!community.requests.includes(requestUserMongoId)) {
      return NextResponse.json(
        { success: false, message: "User not in request list" },
        { status: 400 }
      );
    }

    // Remove the REQUEST USER from requests list
    community.requests = community.requests.filter(
      (id: any) => id.toString() !== requestUserMongoId
    );

    if (action === "accept") {
      // Add REQUEST USER to members in MongoDB
      community.members.push(requestUserMongoId);
      requestUser.communities.push(mongoCommunityId);

      // Save MongoDB changes first
      await Promise.all([community.save(), requestUser.save()]);

      // Then sync with Clerk
      const clerkCommunityId = community.id; // Clerk org ID
      const clerkUserId = requestUser.id; // Clerk user ID of request user

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

          // Rollback MongoDB changes if Clerk fails
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

        // Rollback MongoDB changes
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
      // action === "reject" - just remove from requests, don't add to members
      await community.save();
    }

    // Populate for response
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
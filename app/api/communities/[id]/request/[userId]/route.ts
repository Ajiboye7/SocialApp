/*import connectToDatabase from "@/lib/mongoose";
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
    const mongoCommunityId = resolvedParams.id;
    const user = await User.findById(resolvedParams.userId);
    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }
    const community = await Community.findById(resolvedParams.id);
    const clerkCommunityId = community.id
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
      user.communities.push(mongoCommunityId);
    }

    await community.save();
    await user.save();

    const populatedCommunity = await Community.findById(resolvedParams.id)
      .populate("requests", "_id username profile_picture")
      .populate("members", "_id username profile_picture");

    const totalRequests = community.requests.length;
    const totalMembers = community.members.length;
    const totalThreads = community.threads?.length || 0;

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
    }

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
    console.error("Community fetch error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}*/



 import connectToDatabase from "@/lib/mongoose";
import { auth } from "@clerk/nextjs/server";
import User from "@/lib/models/user.model";
import { NextResponse } from "next/server";
import Thread from "@/lib/models/thread.model";
import Community from "@/lib/models/community.model";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string; userId: string }> }
) {
  const { userId } = await auth();
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
    const mongoCommunityId = resolvedParams.id;
    
    /*const authUser = await User.findOne({ id: userId });

    if(!authUser){
      return NextResponse.json(
        { success: false, message: "Auth User not found" },
        { status: 404 }
      );
    }*/

    const user = await User.findById(mongoUserId);
    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
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

    // Check if requesting user is admin/creator of the community
    if (community.createdBy.toString() !== mongoUserId) {
      return NextResponse.json(
        { success: false, message: "Only community admins can accept/reject requests" },
        { status: 403 }
      );
    }

    if (!community.requests.includes(mongoUserId)) {
      return NextResponse.json(
        { success: false, message: "User not in request list" },
        { status: 400 }
      );
    }

    // Remove from requests list
    community.requests = community.requests.filter(
      (id: any) => id.toString() !== mongoUserId
    );

    if (action === "accept") {
      // Add to members in MongoDB
      community.members.push(mongoUserId);
      user.communities.push(mongoCommunityId);

      // Save MongoDB changes first
      await Promise.all([community.save(), user.save()]);

      // Then sync with Clerk
      const clerkCommunityId = community.id; // Clerk org ID
      const clerkUserId = user.id; // Clerk user ID

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
              user_id: clerkUserId, // Use the Clerk user ID from the user document
              role: "org:member",
            }),
          }
        );

        if (!clerkResponse.ok) {
          const errorData = await clerkResponse.json();
          console.error("Clerk API error:", errorData);

          // Rollback MongoDB changes if Clerk fails
          community.members = community.members.filter(
            (id: any) => id.toString() !== mongoUserId
          );
          community.requests.push(mongoUserId);
          user.communities = user.communities.filter(
            (id: any) => id.toString() !== mongoCommunityId
          );

          await Promise.all([community.save(), user.save()]);

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
          (id: any) => id.toString() !== mongoUserId
        );
        community.requests.push(mongoUserId);
        user.communities = user.communities.filter(
          (id: any) => id.toString() !== mongoCommunityId
        );

        await Promise.all([community.save(), user.save()]);

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
 
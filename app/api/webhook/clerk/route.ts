import { verifyWebhook } from "@clerk/nextjs/webhooks";
import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongoose";
import User from "@/lib/models/user.model";
import Community from "@/lib/models/community.model";

export async function POST(req: NextRequest) {
  try {
    const evt = await verifyWebhook(req);

    await connectToDatabase();

    if (evt.type === "user.created") {
      const userData = evt.data;

      const user = {
        id: userData.id,
        email: userData.email_addresses?.[0]?.email_address || "",
        name: userData.first_name || userData.last_name || "Unknown",
        username: userData.username || `user_${userData.id.slice(-8)}`,
        profile_picture: userData.image_url || "",
      };

      await User.findOneAndUpdate(
        { id: user.id },
        {
          id: user.id,
          email: user.email,
          name: user.name,
          username: user.username,
          $setOnInsert: { profile_picture: user.profile_picture },
        },
        { upsert: true, new: true }
      );
      console.log("User data saved:", user);
      return NextResponse.json(
        { message: "Webhook processed" },
        { status: 200 }
      );
    }
if (evt.type === "organization.updated") {
  console.log("Processing organization.updated");
  
  const communityData = evt.data;
  const creatorClerkId = communityData.created_by;
  
  try {
    // Find the creator user
    const creatorUser = await User.findOne({ id: creatorClerkId });

    if (!creatorUser) {
      console.log("Creator user not found in DB");
      return NextResponse.json(
        { error: "Creator user not found in DB" },
        { status: 400 }
      );
    }

    const creatorMongoId = creatorUser._id;

    // Upsert: create if doesn't exist, update if exists
    const community = await Community.findOneAndUpdate(
      { id: communityData.id },
      {
        id: communityData.id,
        name: communityData.name,
        slug: communityData.slug,
        community_picture: communityData.image_url ?? "",
        bio: "organization bio",
        createdBy: creatorMongoId,
        $setOnInsert: { 
          members: [creatorMongoId],
          threads: []
        }
      },
      { upsert: true, new: true }
    );

    console.log("Community saved/updated:", community);
    
    return NextResponse.json(
      { message: "Community processed", data: community },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error processing community:", error);
    return NextResponse.json(
      { error: "Failed to process community" },
      { status: 500 }
    );
  }
}

    return NextResponse.json({ message: "Webhook received" }, { status: 200 });
  } catch (err) {
    console.error("Webhook error:", err);
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 400 }
    );
  }
}

import { verifyWebhook } from "@clerk/nextjs/webhooks";
import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongoose";
import User from "@/lib/models/user.model";
import Community from "@/lib/models/community.model";

export async function POST(req: NextRequest) {
  try {
    // Verify the webhook signature
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

    if (evt.type === "organization.created") {
      console.log("Processing organization.created");

      const communityData = evt.data;

      const creatorClerkId = communityData.created_by;
      const creatorUser = await User.findOne({ id: creatorClerkId });

      if (!creatorUser) {
        console.log("creator not found in the database", creatorClerkId);

        return NextResponse.json(
          { error: "Creator user not found in DB" },
          { status: 400 }
        );
      }
      const creatorMongoId = creatorUser._id

      const community = {
        id: communityData.id,
        name: communityData.name,
        slug: communityData.slug,
        community_picture: communityData.image_url ?? "",
        bio: "organization bio",
       
        createdBy: creatorMongoId,
        members : [creatorMongoId],
        threads : []
      };

     try {
  const savedCommunity = await Community.findOneAndUpdate(
    { id: community.id },
    { ...community },
    { upsert: true, new: true }
  );

  console.log("✅ Community saved:", savedCommunity);
  return NextResponse.json(
    { message: "Community created" },
    { status: 200 }
  );
} catch (dbError : any) {
  console.error("❌ MongoDB save failed:");
  console.error("Error name:", dbError.name);
  console.error("Error message:", dbError.message);
  console.error("Error code:", dbError.code);
  console.error("Full error:", JSON.stringify(dbError, null, 2));
  
  return NextResponse.json(
    { 
      error: "DB save failed",
      details: dbError.message
    }, 
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

{
  /*if (evt.type === "organization.created") {
      console.log("Processing organization.created");

      const org = evt.data;

      const communityData = {
        id: org.id,
        name: org.name,
        slug: org.slug || `org-${org.id.slice(-8)}`,
        community_picture: org.image_url || "",
        bio: org.public_metadata?.bio || "A new community",
        createdBy: org.created_by, // ← critical!
      };

      try {
        const community = await Community.findOneAndUpdate(
          { id: communityData.id },
          {
            $set: {
              name: communityData.name,
              slug: communityData.slug,
              community_picture: communityData.community_picture,
              bio: communityData.bio,
              createdBy: communityData.createdBy,
            },
            $setOnInsert: {
              id: communityData.id,
              threads: [],
              members: [],
            },
          },
          { upsert: true, new: true, setDefaultsOnInsert: true }
        );

        console.log("Community saved:", community._id);
        return NextResponse.json(
          { message: "Community created" },
          { status: 200 }
        );
      } catch (dbError) {
        console.error("MongoDB save failed:", dbError);
        return NextResponse.json({ error: "DB save failed" }, { status: 500 });
      }
    }

    return NextResponse.json({ message: "Webhook received" }, { status: 200 });
    }*/
}

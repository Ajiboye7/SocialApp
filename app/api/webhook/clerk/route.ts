import { verifyWebhook } from "@clerk/nextjs/webhooks";
import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongoose";
import User from "@/lib/models/user.model";
import Community from "@/lib/models/community.model";

export async function POST(req: NextRequest) {
try {
    const evt = await verifyWebhook(req);

    await connectToDatabase();

    if (evt.type === "organization.created") {
      console.log("🏢 === ORGANIZATION.CREATED ===");
      
      const communityData = evt.data;
      
      // Log EVERYTHING about the image
      console.log("📸 Full communityData object:");
      console.log(JSON.stringify(communityData, null, 2));
      
      console.log("📸 image_url from Clerk:", communityData.image_url);
      console.log("📸 image_url type:", typeof communityData.image_url);
      console.log("📸 image_url length:", communityData.image_url?.length);
      console.log("📸 has_image:", communityData.has_image);

      const creatorClerkId = communityData.created_by;
      const creatorUser = await User.findOne({ id: creatorClerkId });

      if (!creatorUser) {
        console.log("❌ Creator not found");
        return NextResponse.json(
          { error: "Creator user not found in DB" },
          { status: 400 }
        );
      }

      const creatorMongoId = creatorUser._id;

      // DON'T modify the URL yet - just save what Clerk sends
      const community = {
        id: communityData.id,
        name: communityData.name,
        slug: communityData.slug,
        community_picture: communityData.image_url ?? "",
        bio: "organization bio",
        createdBy: creatorMongoId,
        members: [creatorMongoId],
        threads: []
      };

      console.log("💾 About to save community with image_url:");
      console.log(community.community_picture);

      const savedCommunity = await Community.findOneAndUpdate(
        { id: community.id },
        { ...community },
        { upsert: true, new: true }
      );

      console.log("✅ Saved to MongoDB:");
      console.log("📸 Saved image_url:", savedCommunity.community_picture);

      return NextResponse.json(
        { message: "Community created" },
        { status: 200 }
      );
    }

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
      console.log("✅ User data saved:", user);
      return NextResponse.json(
        { message: "Webhook processed" },
        { status: 200 }
      );
    }

    return NextResponse.json({ message: "Webhook received" }, { status: 200 });
  }catch (err) {
    console.error("Webhook error:", err);
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 400 }
    );
  }
}

{
  /**
  
  import { verifyWebhook } from "@clerk/nextjs/webhooks";
import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongoose";
import User from "@/lib/models/user.model";
import Community from "@/lib/models/community.model";
import { uploadImageToUploadThing } from "@/lib/utils";

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
      const creatorMongoId = creatorUser._id;

      //let communityPicture = communityData.image_url || "";
     let communityPicture = "https://img.clerk.com/eyJ0eXBlIjoicHJveHkiLCJzcmMiOiJodHRwczovL2ltYWdlcy5jbGVyay5kZXYvdXBsb2FkZWQvaW1nXzM1azZuZmhNS2k4eDJsM21MZzNTMG9VZDZJZyJ9"

      // Upload to UploadThing if image exists
      /*if (communityData.image_url) {
        console.log("Uploading organization image to UploadThing...");
        communityPicture = await uploadImageToUploadThing(
          communityData.image_url
        );
      }

       communityPicture = await uploadImageToUploadThing(
          "https://img.clerk.com/eyJ0eXBlIjoicHJveHkiLCJzcmMiOiJodHRwczovL2ltYWdlcy5jbGVyay5kZXYvdXBsb2FkZWQvaW1nXzM1azZuZmhNS2k4eDJsM21MZzNTMG9VZDZJZyJ9"
        );

      const community = {
        id: communityData.id,
        name: communityData.name,
        slug: communityData.slug,
        community_picture: communityPicture,
        bio: "organization bio",

        createdBy: creatorMongoId,
        members: [creatorMongoId],
        threads: [],
      };

      try {
        await Community.findOneAndUpdate(
          { id: community.id },
          { ...community },
          { upsert: true, new: true }
        );

        console.log("Community saved:", community);
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
  } catch (err) {
    console.error("Webhook error:", err);
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 400 }
    );
  }
}
 */
}


import { verifyWebhook } from "@clerk/nextjs/webhooks";
import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongoose";
import User from "@/lib/models/user.model";
import Community from "@/lib/models/community.model";
import { imageUrlToBase64 } from "@/lib/utils";

export async function POST(req: NextRequest) {
  try {
    const evt = await verifyWebhook(req);
    await connectToDatabase();

    /* -------------------- USER CREATED -------------------- */
    if (evt.type === "user.created") {
      const userData = evt.data;

      // Convert Clerk image → Base64
      const base64Image = await imageUrlToBase64(userData.image_url);

      const user = {
        id: userData.id,
        email: userData.email_addresses?.[0]?.email_address || "",
        name: userData.first_name || userData.last_name || "Unknown",
        username: userData.username || `user_${userData.id.slice(-8)}`,
        profile_picture: base64Image, 
      };

      await User.findOneAndUpdate(
        { id: user.id },
        { ...user },
        { upsert: true, new: true }
      );

      console.log("User saved:", user);
      return NextResponse.json({ message: "User created" }, { status: 200 });
    }

    /* ---------------- ORGANIZATION CREATED ---------------- */
    if (evt.type === "organization.created") {
      const communityData = evt.data;

      const creatorUser = await User.findOne({ id: communityData.created_by });
      if (!creatorUser)
        return NextResponse.json(
          { error: "Creator not found" },
          { status: 400 }
        );

      const base64Image = await imageUrlToBase64(communityData.image_url ?? "");


      const community = {
        id: communityData.id,
        name: communityData.name,
        slug: communityData.slug,
        community_picture: base64Image,
        bio: "organization bio",
        createdBy: creatorUser._id,
        members: [creatorUser._id],
        threads: [],
      };

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
    }

    return NextResponse.json({ message: "Ignored event" }, { status: 200 });
  } catch (err) {
    console.error("Webhook error:", err);
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 400 }
    );
  }
}



/*import { verifyWebhook } from "@clerk/nextjs/webhooks";
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
}*/



{/**
  
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
 */}

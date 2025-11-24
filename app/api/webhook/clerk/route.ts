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

    if (evt.type === "organization.created") {
      console.log("Processing organization.created");

      const communityData = evt.data;
      const creatorClerkId = communityData.created_by;

      const creatorUser = await User.findOne({ id: creatorClerkId });

      if (!creatorUser) {
        return NextResponse.json(
          { error: "Creator user not found in DB" },
          { status: 400 }
        );
      }

      const creatorMongoId = creatorUser._id;

      // Fetch fresh organization data from Clerk API
      const clerkOrgData = await fetch(
        `https://api.clerk.com/v1/organizations/${communityData.id}`,
        {
          headers: {
            Authorization: `Bearer ${process.env.CLERK_SECRET_KEY}`,
          },
        }
      ).then((res) => res.json());

      //console.log("Fresh Clerk data:", clerkOrgData);

      const community = {
        id: clerkOrgData.id,
        name: clerkOrgData.name,
        slug: clerkOrgData.slug,
        community_picture: clerkOrgData.image_url ?? "", 
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

        //console.log("Community saved:", community);
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

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
  const communityData = evt.data;
  
  // Only update if image_url exists and is not the default
  if (communityData.image_url && !communityData.image_url.includes('"type":"default"')) {
    await Community.findOneAndUpdate(
      { id: communityData.id },
      { 
        community_picture: communityData.image_url,
        name: communityData.name,
        slug: communityData.slug
      },
      { new: true }
    );
  }

  return NextResponse.json({ message: "Community updated" }, { status: 200 });
}
  } catch (err) {
    console.error("Webhook error:", err);
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 400 }
    );
  }
}

/*import React from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'md',
  className = '' 
}) => {
  const sizeClasses = {
    sm: 'w-6 h-6 border-2',
    md: 'w-10 h-10 border-4',
    lg: 'w-16 h-16 border-4'
  };

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div 
        className={`${sizeClasses[size]} border-[#877eff]/20 border-t-[#877eff] rounded-full animate-spin`}
      />
    </div>
  );
};

export default LoadingSpinner;*/


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
    return NextResponse.json({ message: "Community created" }, { status: 200 });
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

{
  /*if (evt.type === "organization.created") {
      const communityData = evt.data;

      const community = {
        id: communityData.id,
        name: communityData.name,
        slug: communityData.slug,
        community_picture: communityData.image_url ?? "",
        bio: "organization bio",
        //createdBy: communityData.created_by || "system",
      };

      await Community.findOneAndUpdate(
        { id: community.id },
        { ...community },
        { upsert: true, new: true }
      );

      console.log("✅ Community saved:", community);
      return NextResponse.json({ message: "Community processed" }, { status: 200 });
    }*/
}

{
  /**

  import { verifyWebhook } from "@clerk/nextjs/webhooks";
import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongoose";
import User from "@/lib/models/user.model";

import Community from "@/lib/models/community.model";
import { headers } from "next/headers";
import { IncomingHttpHeaders } from "http";
import { Webhook, WebhookRequiredHeaders } from "svix";

type EventType =
  | "organization.created"
  | "organizationInvitation.created"
  | "organizationMembership.created"
  | "organizationMembership.deleted"
  | "organization.updated"
  | "organization.deleted";

type Event = {
  data: Record<string, string | number | Record<string, string>[]>;
  object: "event";
  type: EventType;
};

export async function POST(req: NextRequest) {

  const payload = await req.json();
  const header = await headers();

  const heads = {
    "svix-id": header.get("svix-id"),
    "svix-timestamp": header.get("svix-timestamp"),
    "svix-signature": header.get("svix-signature"),
  };

  

  // Activitate Webhook in the Clerk Dashboard.
  // After adding the endpoint, you'll see the secret on the right side.
  const wh = new Webhook(process.env.NEXT_CLERK_WEBHOOK_SECRET || "");

  let evnt: Event | null = null;

  try {
    evnt = wh.verify(
      JSON.stringify(payload),
      heads as IncomingHttpHeaders & WebhookRequiredHeaders
    ) as Event;
  } catch (err) {
    return NextResponse.json({ message: err }, { status: 400 });
  }

  const eventType: EventType = evnt?.type!;


  
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

    if (eventType === "organization.created") {
      const { id, name, slug, logo_url, image_url, created_by } =
      evnt?.data ?? {};

      const community = {
        id: id,
        name: name,
        slug: slug,
        community_picture: image_url ?? "",
        bio: "organization bio",
        //createdBy: created_by || "system",
      };

      await Community.findOneAndUpdate(
        { id: community.id },
        { ...community },
        { upsert: true, new: true }
      );

      console.log("✅ Community saved:", community);
      return NextResponse.json(
        { message: "Community processed" },
        { status: 200 }
      );
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

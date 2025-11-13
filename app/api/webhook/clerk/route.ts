// ─────────────────────────────────────────────────────────────────────────────
//  CLERK WEBHOOK → MongoDB (organization.created)
//  Next.js 15 App Router
// ─────────────────────────────────────────────────────────────────────────────
import { verifyWebhook } from "@clerk/nextjs/webhooks";
import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongoose";
import Community from "@/lib/models/community.model";
import mongoose from "mongoose";

export const dynamic = "force-dynamic"; // <-- important for Vercel

export async function POST(req: NextRequest) {
  // ───── 1. LOG THATURL & HEADERS (prove the request reached your code) ─────
  const svixId = req.headers.get("svix-id") ?? "no-svix-id";
  console.log("\nWEBHOOK RECEIVED → svix-id:", svixId);
  console.log("URL:", req.url);
  console.log("Method:", req.method);

  // ───── 2. VERIFY CLERK SIGNATURE ─────
  let evt;
  try {
    evt = await verifyWebhook(req);
    console.log("Signature OK – event type:", evt.type);
  } catch (e: any) {
    console.error("CLERK SIGNATURE FAILED:", e.message);
    return NextResponse.json(
      { error: "Invalid signature" },
      { status: 401 }
    );
  }

  // ───── 3. CONNECT TO MONGO ─────
  try {
    await connectToDatabase();
    const ready = mongoose.connection.readyState === 1 ? "YES" : "NO";
    console.log("MongoDB connected? →", ready);
  } catch (e: any) {
    console.error("MongoDB CONNECTION ERROR:", e.message);
    return NextResponse.json(
      { error: "DB connection failed" },
      { status: 500 }
    );
  }

  // ───── 4. HANDLE USER (optional, keep it) ─────
  if (evt.type === "user.created") {
    const d = evt.data;
    console.log("user.created →", d.id);
    // …your user logic…
    return NextResponse.json({ message: "user ok" });
  }

  // ───── 5. HANDLE ORGANIZATION.CREATED ─────
  if (evt.type === "organization.created") {
    const org = evt.data;
    console.log("organization.created payload →", JSON.stringify(org, null, 2));

    try {
      const saved = await Community.findOneAndUpdate(
        { id: org.id }, // query
        {
          $set: {
            name: org.name ?? "Unnamed Org",
            slug: org.slug ?? `org-${org.id.slice(-8)}`,
            community_picture: org.image_url ?? "",
            bio: org.public_metadata?.bio ?? "A new community",
            createdBy: org.created_by, // <-- user who created the org
          },
          $setOnInsert: {
            id: org.id,
            threads: [],
            members: [],
          },
        },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );

      console.log("COMMUNITY SAVED → _id:", saved._id, "slug:", saved.slug);
      return NextResponse.json(
        { message: "org ok", mongoId: saved._id?.toString() },
        { status: 200 }
      );
    } catch (dbErr: any) {
      console.error("MONGO SAVE ERROR:", dbErr.message);
      return NextResponse.json(
        { error: "Mongo save failed", details: dbErr.message },
        { status: 500 }
      );
    }
  }

  // ───── 6. ANY OTHER EVENT ─────
  console.log("Ignored event:", evt.type);
  return NextResponse.json({ message: "ignored" });
}
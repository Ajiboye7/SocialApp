import { NextResponse } from "next/server";
import User from "../../../lib/models/user.model";
import connectToDatabase from "@/lib/mongoose";
import { auth } from "@clerk/nextjs/server";

export async function PUT(request: Request) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json(
      { success: false, message: "Unauthorized: No user session found"},
      { status: 401 }
    );
  }

  try {
    const body = await request.json();
    const { bio, name, username, profile_picture } = body;

    if (!bio || !name || !username) {
      return NextResponse.json(
        { success: false, message: "Bio, name, and username are required" },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const updatedUser = await User.findOneAndUpdate(
      { id: userId },
      {
        bio,
        name,
        username,
        profile_picture,
        onboarded: true,
      },
      { new: true }
    );

    if (!updatedUser) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "User updated successfully",
        data: updatedUser,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("User update error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error during user update" },
      { status: 500 }
    );
  }
}

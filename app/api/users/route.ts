import { NextResponse } from "next/server";
import User from "../../../lib/models/user.model";
import connectToDatabase from "@/lib/mongoose";
import { auth } from "@clerk/nextjs/server";

export async function PUT(request: Request) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json(
      { success: false, message: "Unauthorized: No user session found" },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();
    const { bio, name, userName, profile_picture } = body;

    if (!bio || !name || !userName) {
      return NextResponse.json(
        { success: false, message: "Bio, name, and username are required"},
        { status: 400 }
      );
    }

    await connectToDatabase();

    const updatedUser = await User.findOneAndUpdate(
      { id: userId },
      {
        bio,
        name,
        username: userName,
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
        data: {
          name: updatedUser.name,
          userName: updatedUser.username,
          bio: updatedUser.bio,
          profile_picture: updatedUser.profile_picture,
          onboarded: updatedUser.onboarded,
        },
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

export async function GET() {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    await connectToDatabase();
    const user = await User.findOne({ id: userId });

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: {
          name: user.name,
          userName: user.username,
          bio: user.bio,
          profile_picture: user.profile_picture,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("User fetch error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}

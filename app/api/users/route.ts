import { NextResponse } from "next/server";
import User from "../../../lib/models/user.model";
import connectToDatabase from "@/lib/mongoose";
import { auth } from "@clerk/nextjs/server";

export async function PUT(request: Request) {
  const { userId } = await auth();

  //Ajiibs
  //const userId = "user_329ZC1gP0BLPxdsTTKeK4eAJDKv";

  //Imam

  //const userId = "user_31uxzj4iC5fXhBxWeNhmTAi6IjL"

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
          id: updatedUser.id,
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

export async function GET(request: Request) {
  const { userId } = await auth();

  //const userId = "user_31uxzj4iC5fXhBxWeNhmTAi6IjL";

  if (!userId) {
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    await connectToDatabase();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const skip = (page - 1) * limit;

    const users = await User.find({})
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const totalUsers = await User.countDocuments();

    if (!users) {
      return NextResponse.json(
        { success: false, message: "Users not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: {
          users,
          totalUsers,
          totalPages: Math.ceil(totalUsers / limit),
          currentPage: page,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Users fetch error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}

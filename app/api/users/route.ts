/*import { NextResponse } from "next/server";
import User from "../../../lib/models/user.model";
import { currentUser } from "@clerk/nextjs/server";
import { auth } from "@clerk/nextjs/server";
import connectToDatabase from "@/lib/mongoose";

export async function PUT(request: Request) {
  try {
    const user = await currentUser();
    const userId = 'user_30bENXpLy7NmUoGNEu4Kavjrurn';
    // console.log(userId)

    if (!userId) {
      return NextResponse.json(
        { success: false, message: "Unauthorized: No user session found" },
        { status: 401 }
      );
    }

    await connectToDatabase();

    const { bio, name, username, profile_picture } = await request.json();

    // Validate required fields
    if (!bio || !name || !username) {
      return NextResponse.json(
        { success: false, message: "Bio, name, and username are required" },
        { status: 400 }
      );
    }

    // Check if username already exists (excluding current user)
   const existingUser = await User.findOne({ 
      username, 
      _id: { $ne: userId } 
    });
    
    if (existingUser) {
      return NextResponse.json(
        { success: false, message: "Username already taken" },
        { status: 409 }
      );
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { 
        bio, 
        name, 
        username, 
        profile_picture, 
        id: userId, 
        onboarded: true 
      },
      { new: true, runValidators: true }
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
        data: updatedUser
      },
      { status: 200 }
    );
  } catch (error) {
    console.log('User update error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error during user update' },
      { status: 500 }
    );
  }
}*/



import { NextResponse } from "next/server";
import User from "../../../lib/models/user.model";
import { currentUser } from "@clerk/nextjs/server";
import connectToDatabase from "@/lib/mongoose";
import { auth } from "@clerk/nextjs/server";

export async function POST(request: Request) {
  //const user = await currentUser();
    const userId = 'user_30bENXpLy7NmUoGNEu4Kavjrurn';
  //const userId = user?.id


  try {
   
    if (!userId) {
      return NextResponse.json(
        { success: false, message: "Unauthorized: No user session found" },
        { status: 401 }
      );
    }

    await connectToDatabase();

    const { bio, name, username, profile_picture } = await request.json();

    if (!bio || !name || !username) {
      return NextResponse.json(
        { success: false, message: "Bio, name, and username are required" },
        { status: 400 }
      );
    }

    const createdUser = await User.create({
      id: userId, 
      bio,
      name, 
      username, 
      profile_picture,
      onboarded: true
    });

    return NextResponse.json(
      {
        success: true,
        message: "User created successfully",
        data: createdUser
      },
      { status: 201 }
    );
  } catch (error) {
    console.log('User creation error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error during user creation' },
      { status: 500 }
    );
  }
}
 

/*import { NextResponse } from "next/server";
import User from "../../../lib/models/user.model";
import { currentUser } from "@clerk/nextjs/server";
import connectToDatabase from "@/lib/mongoose";

export async function PUT(request: Request) {
  const user = await currentUser();
  //const userId = user?.id;
  const userId = 'user_30bENXpLy7NmUoGNEu4Kavjrurn';
  //console.log(user)

  try {
    if (!userId) {
      return NextResponse.json(
        { success: false, message: "Unauthorized: No user session found" },
        { status: 401 }
      );
    }

    await connectToDatabase();

    const { bio, name, username, profile_picture } = await request.json();

    if (!bio || !name || !username || profile_picture) {
      return NextResponse.json(
        { success: false, message: "All fields are required" },
        { status: 400 }
      );
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { bio, name, username, profile_picture, id: userId, onboarded: true },
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
        message: "user updated successfully",
        data: {
          bio,
          name,
          username,
          profile_picture,
          id: userId,
          onboarded: true,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.log('User update error:', error)
    return NextResponse.json(
        {success:false, message: 'Internal server error during user update'},
        {status: 500}
    )
  }
};*/
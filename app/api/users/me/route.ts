import { NextResponse } from "next/server";
import User from "@/lib/models/user.model";
import connectToDatabase from "@/lib/mongoose";
import { auth } from "@clerk/nextjs/server";
import Thread from "@/lib/models/thread.model";

export async function GET(
  req: Request,
  
) {
  //const { userId } = await auth();
  const userId = "user_329ZC1gP0BLPxdsTTKeK4eAJDKv";
  //const  userId = 'user_31uxzj4iC5fXhBxWeNhmTAi6IjL'
  //const userId = 'user_35QSrRZm9wI1YNGWc1mBjEmVBb9'
  //const { username } = params;
  
    

  if (!userId) {
    return NextResponse.json(
      { success: false, message: "Unauthorized"},
      { status: 401 }
    );
  }

  try {
    await connectToDatabase();

    const userData = await User.findOne({ id : userId }).populate({
      path: "threads",
      model: Thread,
      populate: [
        
        {
          path: "children",
          model: Thread,
          populate: {
            path: "author",
            model: User,
            select: "username profile_picture id",  
          },
        },
      ],
    });

    if (!userData) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }
    const populatedUser = {
      _id: userData._id,
      id: userData.id,
      name: userData.name,
      profile_picture: userData.profile_picture,
      username: userData.username,
      bio: userData.bio,
      onboarded: userData.onboarded,

      threads: userData.threads.map((thread: any) => ({
        _id: thread._id,
        thread: thread.thread,
        parentId: thread.parentId ? thread.parentId.toString() : null,
        author: {
          id: thread.author._id,
          username: thread.author.username,
          profile_picture: thread.author.profile_picture,
        },
        createdAt: thread.createdAt,
        children: thread.children.map((child: any) => ({
          _id: child._id,
          author: {
            _id: child.author._id,
            username: child.author.username,
            profile_picture: child.author.profile_picture,
          },
          parentId: child.parentId ? child.parentId.toString() : null,
          thread: child.thread,
          createdAt: child.createdAt,
          children: [],
        })),
      })),
    };

    return NextResponse.json(
      {
        success: true,
        data: {
          currentUser: populatedUser,
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

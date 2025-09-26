"use client";
import ThreadCard from "@/cards/ThreadCard";
import React, { useState, useEffect } from "react";
import { SignOutButton } from "@clerk/nextjs";
<<<<<<< HEAD
import { useSelector, useDispatch } from "react-redux";
import { redirect } from "next/navigation";
import LoadingThread from "@/components/LoadingThread";
import { Skeleton } from "@/components/ui/skeleton";
import { getThreads } from "@/store/slices/threadSlice";
import { RootState, AppDispatch } from "@/store/store";
 
=======
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { redirect } from "next/navigation";
import LoadingThread from "@/components/LoadingThread";
import { Skeleton } from "@/components/ui/skeleton";
>>>>>>> 6914f654efe59dfef0a22ab0e1bf2c2e604114fe

const page = () => {
  const { user, status: userStatus } = useSelector(
    (state: RootState) => state.user
  );
  const { threads, status: threadStatus } = useSelector(
    (state: RootState) => state.thread
  );

<<<<<<< HEAD
  const dispatch = useDispatch<AppDispatch>();

=======
>>>>>>> 6914f654efe59dfef0a22ab0e1bf2c2e604114fe
  console.log("user fetched ", user);

  const userName = user?.name;

  {/*if (userStatus === "loading" || threadStatus === "loading") {
    return (
      <div className="mx-auto flex max-w-3xl flex-col justify-center items-center px-10 py-20 min-h-[100vh]">
        <LoadingSpinner />
        <p className="text-light-2 mt-4">Loading post</p>
      </div>
    );
  }*/}

<<<<<<< HEAD
  useEffect(() => {
    dispatch(getThreads({ topLevelOnly: true }));
  }, [dispatch]);

=======
>>>>>>> 6914f654efe59dfef0a22ab0e1bf2c2e604114fe
  if (userStatus === "loading" || threadStatus === "loading") {
  return (
    <LoadingThread/>
  );
}


  return (
    <section className="">
      <h1 className="text-[30px] leading-[140%] font-[600] text-light-1">
        Home
      </h1>

      {threads.length > 0 ? (
        threads.map((t) => (
          <ThreadCard
<<<<<<< HEAD
           parentId={t._id}
           threadId={t._id}
           _id={t._id}
            key={t._id}
            image={t.author.profile_picture || "/assets/profile.svg"}
            username={t.author.username || "Unknown User"}
=======
           //parentId={t._id}
           threadId={t._id}
           childId={t._id}
            key={t._id}
            image={user?.profile_picture || "/assets/profile.svg"}
            username={user?.name || "Unknown User"}
>>>>>>> 6914f654efe59dfef0a22ab0e1bf2c2e604114fe
            thread={t.thread}
            comments={t.children}
          />
        ))
      ) : (
        <p className="text-white text-2xl">No posts yet</p>
      )}

      <SignOutButton redirectUrl="/sign-in">
        <button className="text-white mt-10">Sign Out</button>
      </SignOutButton>
    </section>
  );
};

export default page;

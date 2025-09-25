"use client";
import ThreadCard from "@/cards/ThreadCard";
import React, { useState, useEffect } from "react";
import { SignOutButton } from "@clerk/nextjs";
import { useSelector, useDispatch } from "react-redux";
import { redirect } from "next/navigation";
import LoadingThread from "@/components/LoadingThread";
import { Skeleton } from "@/components/ui/skeleton";
import { getThreads } from "@/store/slices/threadSlice";
import { RootState, AppDispatch } from "@/store/store";
 

const page = () => {
  const { user, status: userStatus } = useSelector(
    (state: RootState) => state.user
  );
  const { threads, status: threadStatus } = useSelector(
    (state: RootState) => state.thread
  );

  const dispatch = useDispatch<AppDispatch>();

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

  useEffect(() => {
    dispatch(getThreads({ topLevelOnly: true }));
  }, [dispatch]);

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
           parentId={t._id}
           threadId={t._id}
           _id={t._id}
            key={t._id}
            image={t.author.profile_picture || "/assets/profile.svg"}
            username={t.author.username || "Unknown User"}
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

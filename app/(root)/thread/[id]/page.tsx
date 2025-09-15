"use client";
import ThreadCard from "@/cards/ThreadCard";
import React, { useState, useEffect } from "react";
import { SignOutButton } from "@clerk/nextjs";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { redirect } from "next/navigation";
import LoadingSpinner from "@/components/LoadingThread";
import Comment from "@/components/forms/Comment";

const ThreadDetails = ({ params }: { params: Promise<{ id: string }> }) => {
  const { user, status: userStatus } = useSelector(
    (state: RootState) => state.user
  );
  const { threads, status: threadStatus } = useSelector(
    (state: RootState) => state.thread
  );
  console.log("Thread fetch", threads);
  //console.log("user fetched ", user);
  const { id } = React.use(params);

  if (threadStatus === "loading") {
    return <LoadingSpinner />;
  }

  const thread = threads.find((t) => t._id === id);

  if (!thread) {
    return <p className="text-light-2 mt-4">Thread not found</p>;
  }

  return (
    <section className="">
      <ThreadCard
        key={thread._id}
         threadId={thread._id}
         childId={thread._id}
        //parentId={thread.parentId || ""}
        image={user?.profile_picture || "/assets/profile.svg"}
        username={user?.name || "Unknown User"}
        thread={thread.thread}
        comments={thread.children}
      />

      <Comment
        parentId={id}
        user={user?.profile_picture || "/assets/profile.svg"}
      />

      {thread.children?.map((child) => (
        <ThreadCard
          key={child._id}
          childId={child._id}
          threadId={child._id}
          parentId={child.parentId}
          image={child.author.profile_picture || "/assets/profile.svg"}
          username={child.author.username || "Anonymous"}
          thread={child.thread}
          comments={child.children}
          isComment={true}
        />
      ))}
    </section>
  );
};

export default ThreadDetails;

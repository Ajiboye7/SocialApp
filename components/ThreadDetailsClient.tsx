// components/ThreadDetailsClient.tsx
"use client";
import ThreadCard from "@/cards/ThreadCard";
import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/store/store";
import LoadingSpinner from "@/components/LoadingThread";
import Comment from "@/components/forms/Comment";
import { getThreadById } from "@/store/slices/threadSlice";

interface Props {
  id: string;
}

const ThreadDetailsClient = ({ id }:Props) => {
  const dispatch = useDispatch<AppDispatch>();
  const { user, status: userStatus } = useSelector(
    (state: RootState) => state.user
  );
  const { threads, status: threadStatus, pagination, thread: singleThread, comments } = useSelector(
    (state: RootState) => state.thread
  );

  console.log("Thread ID:", id);

  useEffect(() => {
    dispatch(getThreadById({ threadId: id, page: pagination.currentPage, limit: 5 }));
  }, [dispatch, id, pagination.currentPage]);

  if (userStatus === "loading" || threadStatus === "loading") {
    return <LoadingSpinner />;
  }

  if (!singleThread) {
    return <p className="text-light-2 mt-4">Thread not found</p>;
  }

  return (
    <section className="">
      <ThreadCard
        key={singleThread._id}
        threadId={singleThread._id}
        _id={singleThread._id}
        parentId={singleThread.parentId || ""}
        image={singleThread.author.profile_picture || "/assets/profile.svg"}
        username={singleThread.author.username || "Unknown User"}
        thread={singleThread.thread}
        comments={singleThread.children}
      />

      <Comment
        parentId={id}
        user={user?.profile_picture || "/assets/profile.svg"}
      />

      {comments?.map((child) => (
        <ThreadCard
          key={child._id}
          _id={child._id}
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

export default ThreadDetailsClient;
{/*"use client";
import ThreadCard from "@/cards/ThreadCard";
import React, { useState, useEffect } from "react";
import { SignOutButton } from "@clerk/nextjs";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/store/store";
import { redirect } from "next/navigation";
import LoadingSpinner from "@/components/LoadingThread";
import Comment from "@/components/forms/Comment";
import { getThreadById } from "@/store/slices/threadSlice";

const ThreadDetails = ({ params }: { params: Promise<{ id: string }> }) => {
  
  const dispatch = useDispatch<AppDispatch>();
  const { user, status: userStatus } = useSelector(
    (state: RootState) => state.user
  );
  const { threads, status: threadStatus, pagination, thread: singleThread, comments} = useSelector(
    (state: RootState) => state.thread
  );

  console.log('This is one thread data', singleThread)
  console.log('This is thread data', threads)
  const { id } = React.use(params);

  useEffect(() => {
    dispatch(getThreadById({ threadId: id, page: pagination.currentPage , limit: 5 }));
  }, [dispatch, id]);

  if (userStatus === "loading" || threadStatus === "loading") {
    return <LoadingSpinner />;
  }

  //const thread = threads.find((t) => t._id === id);

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

export default ThreadDetails;*/}

/**
 
"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import ThreadCard from "@/cards/ThreadCard";
import LoadingSpinner from "@/components/LoadingThread";
import Comment from "@/components/forms/Comment";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

const ThreadDetails = ({ params }: { params: { id: string } }) => {
  const { user } = useSelector((state: RootState) => state.user);
  const [thread, setThread] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchThread = async () => {
      try {
        const res = await axios.get(`/api/threads/${params.id}`);
        setThread(res.data.data);
      } catch (error) {
        console.error("Error fetching thread", error);
      } finally {
        setLoading(false);
      }
    };

    fetchThread();
  }, [params.id]);

  if (loading) return <LoadingSpinner />;

  if (!thread) return <p className="text-white">Thread not found</p>;

  return (
    <section className="">
      <ThreadCard
        key={thread._id}
        threadId={thread._id}
        _id={thread._id}
        parentId={thread.parentId || ""}
        image={thread.author.profile_picture}
        username={thread.author.username}
        thread={thread.thread}
        comments={thread.children}
      />

      <Comment
        parentId={thread._id}
        user={user?.profile_picture || "/assets/profile.svg"}
      />

      {thread.children?.map((child: any) => (
        <ThreadCard
          key={child._id}
          threadId={child._id}
          _id={child._id}
          parentId={child.parentId}
          image={child.author.profile_picture}
          username={child.author.username}
          thread={child.thread}
          comments={child.children}
          isComment
        />
      ))}
    </section>
  );
};

export default ThreadDetails;

 */

// app/threads/[id]/page.tsx
//import ThreadDetailsClient from "@/components/ThreadDetailsClient";
import ThreadDetailsClient from "@/components/ThreadDetailsClient";
export default async function ThreadDetails({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return <ThreadDetailsClient id={id} />;
}
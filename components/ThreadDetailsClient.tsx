
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
  const { status: threadStatus, pagination, thread, comments } = useSelector(
    (state: RootState) => state.thread
  );

  useEffect(() => {
    dispatch(getThreadById({ threadId: id, page: pagination.currentPage, limit: 5 }));
  }, [dispatch, id, pagination.currentPage]);

  if (userStatus === "loading" || threadStatus === "loading") {
    return <LoadingSpinner />;
  }

  if (!thread) {
    return <p className="text-light-2 mt-4">Thread not found</p>;
  }

  return (
    <section className="">
      <ThreadCard
        key={thread._id}
        threadId={thread._id}
        _id={thread._id}
        parentId={thread.parentId || ""}
        image={thread.author.profile_picture || "/assets/profile.svg"}
        username={thread.author.username || "Unknown User"}
        thread={thread.thread}
        comments={thread.children}
      />

      <Comment
        parentId={id}
        user={user?.profile_picture || "/assets/profile.svg"}
      />

      {comments?.map((comment) => (
        <ThreadCard
          key={comment._id}
          _id={comment._id}
          threadId={comment._id}
          parentId={comment.parentId}
          image={comment.author.profile_picture || "/assets/profile"}
          username={comment.author.username || "Anonymous"}
          thread={comment.thread}
          comments={comment.children}
          isComment={true}
        />
      ))}
    </section>
  );
};

export default ThreadDetailsClient;
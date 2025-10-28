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

  const {
    threads,
    status: threadStatus,
    currentPage,
    totalPages,
  } = useSelector((state: RootState) => state.thread);

  const dispatch = useDispatch<AppDispatch>();

   

  useEffect(() => {
    dispatch(getThreads({ topLevelOnly: true, page: currentPage, limit: 5 }));
  }, [dispatch]);

  if (userStatus === "loading" || threadStatus === "loading") {
    return <LoadingThread />;
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

      {/* Pagination */}
      <div className="flex justify-center gap-4 mt-6">
        <button
          disabled={currentPage <= 1}
          onClick={() =>
            dispatch(
              getThreads({
                topLevelOnly: true,
                page: currentPage - 1,
                limit: 5,
              })
            )
          }
          className="px-4 py-2 bg-gray-600 text-white rounded disabled:opacity-50"
        >
          Prev
        </button>
        <span className="text-white">
          Page {currentPage} of {totalPages}
        </span>
        <button
          disabled={currentPage >= totalPages}
          onClick={() =>
            dispatch(
              getThreads({
                topLevelOnly: true,
                page: currentPage + 1,
                limit: 5,
              })
            )
          }
          className="px-4 py-2 bg-gray-600 text-white rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>

      {/*<SignOutButton redirectUrl="/sign-in">
        <button className="text-white mt-10 cursor-pointer">Sign Out</button>
      </SignOutButton>*/}
    </section>
  );
};

export default page;

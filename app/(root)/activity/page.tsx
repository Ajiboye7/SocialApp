"use client";

import React, { useEffect } from "react";
import { getThreads, clearThreads } from "@/store/slices/threadSlice";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/store/store";
import LoadingThread from "@/components/ContentSkeleton";
import ContentSkeleton from "@/components/ContentSkeleton";

const Page = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { threads, currentPage, status } = useSelector(
    (state: RootState) => state.thread
  );

  useEffect(() => {
    dispatch(clearThreads());
    dispatch(
      getThreads({
        topLevelOnly: true,
        userOnly: true,
        page: currentPage,
        limit: 5,
      })
    );
  }, [dispatch, currentPage]);
  console.log('My Threads', threads)

  if (status === "loading") {
     return <ContentSkeleton items={1} avatar title lines={1}/>
  }

  return (
    <div className="p-4">
      <h1 className="text-white text-2xl font-bold mb-4">Activity</h1>

      {threads?.length === 0 && (
        <p className="text-gray-400">No recent activity yet.</p>
      )}

      {threads?.map((thread) =>
        thread.children?.map((comment) => (
          <div
            key={comment._id}
            className="flex items-center gap-2 rounded-md bg-dark-2 px-7 py-4 shadow-md"
          >
            <img
              src={comment.author?.profile_picture || "/default-avatar.png"}
              alt={comment.author?.username}
              className="w-10 h-10 rounded-full mr-3 object-cover"
            />
            <div>
              <p className="text-white">
                <span className="font-semibold text-primary-500">
                  {comment.author?.username}
                </span>{" "}
                commented on your post
              </p>
              <p className="text-gray-400 text-xs">
                {new Date(comment.createdAt).toLocaleString()}
              </p>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default Page;

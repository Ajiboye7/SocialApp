"use client";

import React, { useEffect } from "react";
import { getThreads, clearThreads } from "@/store/slices/threadSlice";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/store/store";
import LoadingThread from "@/components/ContentSkeleton";
import ContentSkeleton from "@/components/ContentSkeleton";
import { currentUser } from "@/store/slices/userSlice";
import UserCardSkeleton from "@/components/UserCardSkeleton";

const Page = () => {
  const dispatch = useDispatch<AppDispatch>();

  const { item, status } = useSelector(
    (state: RootState) => state.user.currentUser
  );

  const threads = item?.threads;

  useEffect(() => {
    if (!item && status === "idle") {
      dispatch(currentUser());
    }
  }, [dispatch, item, status]);

  if (status === "loading" && !item) {
    return Array.from({ length: 3 }).map((_, index) => (
      <UserCardSkeleton key={index} button={true} />
    ));
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
            className="flex items-center gap-2 rounded-md bg-dark-2 px-7 py-4 shadow-md my-2"
          >
            <img
              src={comment.author?.profile_picture || "/default-avatar.png"}
              className="w-10 h-10 rounded-full object-cover"
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

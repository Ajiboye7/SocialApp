"use client";

import React, { useEffect } from "react";
import { getThreads } from "@/store/slices/threadSlice";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/store/store";
import { clearThreads } from "@/store/slices/threadSlice";

const page = () => {
  const dispatch = useDispatch<AppDispatch>();

  const {
    threads,
    status: threadStatus,
    currentPage,
    totalPages,
    totalUserThread: totalPost,
  } = useSelector((state: RootState) => state.thread);

  const { currentUser } = useSelector((state: RootState) => state.user);

  const userId = currentUser?._id;

  useEffect(() => {
    dispatch(clearThreads())
    dispatch(
      getThreads({
        topLevelOnly: true,
        userOnly : true,
        //authorId: userId,
        page: currentPage,
        limit: 5,
      })
    );
  }, []);

  console.log('Activity Threads', threads)



  return (
    <div>
      <h1 className="text-white">Activity</h1>

     
    </div>
  );
};

export default page;

{/**
  "use client";

import React, { useEffect } from "react";
import { getThreads, clearThreads } from "@/store/slices/threadSlice";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/store/store";

const Page = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { threads, currentPage } = useSelector((state: RootState) => state.thread);
  const { currentUser } = useSelector((state: RootState) => state.user);

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
            className="flex items-center bg-gray-800 rounded-md p-3 mb-3 shadow-md"
          >
            <img
              src={comment.author?.profile_picture || "/default-avatar.png"}
              alt={comment.author?.username}
              className="w-10 h-10 rounded-full mr-3 object-cover"
            />
            <div>
              <p className="text-white">
                <span className="font-semibold">{comment.author?.username}</span>{" "}
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

  */}

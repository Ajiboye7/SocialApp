"use client";
import React, { useEffect } from "react";

import Image from "next/image";
import Link from "next/link";
import { profileTabs } from "@/constants";
import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import ProfileHeader from "@/components/shared/ProfileHeader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ThreadCard from "@/cards/ThreadCard";
import { getThreads } from "@/store/slices/threadSlice";
import { RootState, AppDispatch } from "@/store/store";
import { clearThreads } from "@/store/slices/threadSlice";
import { currentUser, fetchUser } from "@/store/slices/userSlice";
import { useParams } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { clearCurrentUser } from "@/store/slices/userSlice";


const page = () => {
  const [lastFetchedUsername, setLastFetchedUsername] = useState<string | null>(
    null
  );

  
  
  const dispatch = useDispatch<AppDispatch>();
  const [activeTab, setActiveTab] = useState("threads");

  const {
    user,
    status: userStatus,
    currentUser: loggedInUser,
  } = useSelector((state: RootState) => state.user);

  const viewedUserId = user?._id as string;

  const {
    threads,
    status: threadStatus,
    currentPage,
    totalPages,
    totalUserThread: totalPost,
  } = useSelector((state: RootState) => state.thread);
  const params = useParams();
  const username = params.username as string;

  useEffect(() => {
    dispatch(clearThreads());
   
    setLastFetchedUsername(username);
    
    if (username) dispatch(fetchUser(username as string));
    //console.log('first use effect render',viewedUserId)
    
  }, [dispatch, username]);

  // console.log('views user id number 1', viewedUserId)

  useEffect(() => {
    
    setLastFetchedUsername(username);
    
    if (
      userStatus === "succeeded" && 
      viewedUserId &&
      username === lastFetchedUsername
    ) {
      dispatch(
        
        getThreads({
          topLevelOnly: true,
          authorId: viewedUserId,
          page: currentPage,
          limit: 5,
        })
      );
       //console.log('second use effect render',viewedUserId)
    }
  }, [dispatch, viewedUserId, currentPage, lastFetchedUsername, username, userStatus]);
  //console.log('views user id number 2', viewedUserId)
  
 
  const isOwnProfile = loggedInUser?.id === user?.id;

  const handlePrev = () => {
    if (currentPage > 1) {
      dispatch(
        getThreads({
          topLevelOnly: true,
          authorId: viewedUserId,
          page: currentPage - 1,
          limit: 5,
        })
      );
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      dispatch(
        getThreads({
          topLevelOnly: true,
          authorId: viewedUserId,
          page: currentPage + 1,
          limit: 5,
        })
      );
    }
  };

  {
    /*threads.map((t) => (
    console.log('author id',t.author.id)
   ))

  console.log('show button',isOwnProfile, loggedInUser?.id  )*/
  }
  if (userStatus === "loading" || threadStatus === "loading") {
    return <p className="text-white text-center mt-10">Loading...</p>;
  }

  if (!user || userStatus === "failed") {
    return (
      <p className="text-white text-center mt-10 text-2xl">User not found</p>
    );
  }

  return (
    <section className="w-full">
      <ProfileHeader />
      <div className="mt-9">
        <Tabs defaultValue="threads" className="w-full">
          <TabsList className="w-full flex min-h-[50px] flex-1 items-center gap-3 bg-dark-2 text-light-2 data-[state=active]:bg-[#0e0e12] data-[state=active]:text-light-2 !important">
            {profileTabs.map((tab) => (
              <TabsTrigger
                key={tab.label}
                value={tab.value}
                className="flex min-h-[50px] flex-1 items-center gap-3 bg-dark-2 text-light-2 data-[state=active]:bg-[#0e0e12] data-[state=active]:text-light-2 !important"
              >
                <Image
                  src={tab.icon}
                  alt={tab.label}
                  width={24}
                  height={24}
                  className="object-contain"
                />
                <p className="max-sm:hidden">{tab.label}</p>

                {tab.label === "Threads" && (
                  <p className="ml-1 rounded-sm bg-light-4 px-2 py-1 !text-tiny-medium text-light-2">
                    {totalPost}
                  </p>
                )}
              </TabsTrigger>
            ))}
          </TabsList>
          {profileTabs.map((tab) => (
            <TabsContent
              key={`content-${tab.label}`}
              value={tab.value}
              className="w-full text-light-1"
            >
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
                    showDeleteButton={
                      isOwnProfile && t.author.id === loggedInUser?._id
                    }
                  />
                ))
              ) : (
                <p className="text-white text-2xl">No posts yet</p>
              )}

              {/*<ThreadsTab
                currentUserId={user.id}
                accountId={userInfo.id}
                accountType="User"
              />*/}
            </TabsContent>
          ))}
        </Tabs>
      </div>

      {/* Pagination */}
      <div className="flex justify-center gap-4 mt-6">
        <button
          disabled={currentPage <= 1}
          onClick={handlePrev}
          className="px-4 py-2 bg-gray-600 text-white rounded disabled:opacity-50"
        >
          Prev
        </button>
        <span className="text-white">
          Page {currentPage} of {totalPages}
        </span>
        <button
          disabled={currentPage >= totalPages}
          onClick={handleNext}
          className="px-4 py-2 bg-gray-600 text-white rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </section>
  );
};

export default page;

/**
 useEffect(() => {
  if (
    userStatus === "succeeded" &&
    viewedUserId &&
    username === lastFetchedUsername
  ) {
    let queryOptions: any = {
      authorId: viewedUserId,
      page: currentPage,
      limit: 5,
    };

    if (activeTab === "threads") {
      queryOptions.topLevelOnly = true;
    } else if (activeTab === "replies") {
      queryOptions.userComment = true;
    }

    dispatch(getThreads(queryOptions));
  }
}, [dispatch, viewedUserId, currentPage, lastFetchedUsername, activeTab]);

<Tabs
  value={activeTab}
  onValueChange={(val) => setActiveTab(val)}
  className="w-full"
>


useEffect(() => {
  // Reset to first page when switching tabs
  dispatch(
    getThreads({
      authorId: viewedUserId,
      page: 1,
      limit: 5,
      topLevelOnly: activeTab === "threads",
      userComment: activeTab === "replies",
    })
  );
}, [activeTab]);



 */


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
const page = () => {
  const dispatch = useDispatch<AppDispatch>();

  const { user, status: userStatus } = useSelector(
    (state: RootState) => state.user
  );

  const { threads, status: threadStatus } = useSelector(
    (state: RootState) => state.thread
  );
  //console.log('New version of thread', threads)

  useEffect(() => {
    dispatch(getThreads({ topLevelOnly: true, userOnly: true }));
  }, [dispatch]);

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
                     {threads.length}
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
                    image={user?.profile_picture || "/assets/profile.svg"}
                    username={user?.name || "Unknown User"}
                    thread={t.thread}
                    comments={t.children}
                    showDeleteButton={true}
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

      {/*<div className="w-full">
        <div className="flex  items-center justify-around w-full  bg-dark-2 h-[50px] rounded-lg">
          {profileTabs.map((tab) => {
            const isTabActive = isActive === tab.value;
            return (
              <div
                key={tab.value}
                className={`flex items-center gap-3 px-5 cursor-pointer rounded-lg h-[50px] ${
                  isTabActive && "bg-[#0e0e12]   "
                }`}
                onClick={() => setIsActive(tab.value)}
              >
                <Image src={tab.icon} alt={tab.value} width={25} height={25} />
                <p className="text-white">{tab.label}</p>
                <p className="text-white bg-dark-4">1</p>
              </div>
            );
          })}
        </div>
      </div>

      {/*<ThreadCard/>*/}
    </section>
  );
};

export default page;

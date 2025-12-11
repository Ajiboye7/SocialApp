"use client";
import React, { useEffect } from "react";

import Image from "next/image";
import Link from "next/link";
import { communityTabs, profileTabs } from "@/constants";
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
import { getCommunityById } from "@/store/slices/communitySlice";
import { string } from "zod";
import UserCard from "@/cards/UserCard";
import JoinRequestCard from "@/cards/RequestCard";
import { joinRequestDecision } from "@/store/slices/communitySlice";
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

  const { status, community } = useSelector(
    (state: RootState) => state.community
  );

  const {
    threads,
    status: threadStatus,
    currentPage,
    totalPages,
    totalUserThread: totalPost,
  } = useSelector((state: RootState) => state.thread);
  const params = useParams();
  const communityId = params.id as string;

  useEffect(() => {
    if (communityId) dispatch(getCommunityById(communityId as string));
  }, [dispatch, communityId]);


  const handlePrev = () => {
    if (currentPage > 1) {
      dispatch(
        getThreads({
          topLevelOnly: true,
          //authorId: viewedUserId,
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
          //authorId: viewedUserId,
          page: currentPage + 1,
          limit: 5,
        })
      );
    }
  };

  const handleAccept = () => {
    if (!community?._id || !loggedInUser?._id) return;

    dispatch(
      joinRequestDecision({
        id: community._id,
        userId: loggedInUser._id,
        action: "accept",
      })
    );
     alert('Request accepted');
  };

  const handleReject = () => {
    if (!community?._id || !loggedInUser?._id) return;

    dispatch(
      joinRequestDecision({
        id: community._id,
        userId: loggedInUser._id,
        action: "reject",
      })
    );
     alert('Request rejected');
  };

  {
    /*threads.map((t) => (
    console.log('author id',t.author.id)
   ))

  console.log('show button',isOwnProfile, loggedInUser?.id  )*/
  }
  if (status === "loading") {
    return <p className="text-white text-center mt-10">Loading...</p>;
  }

  return (
    <section className="w-full">
      <ProfileHeader
        userId={community?.id ?? ""}
        name={community?.name ?? ""}
        username={community?.slug ?? ""}
        bio={community?.bio ?? ""}
        imgUrl={community?.community_picture ?? ""}
        type="Community"
      />
      <div className="mt-9">
        <Tabs defaultValue="threads" className="w-full">
          <TabsList className="w-full flex min-h-[50px] flex-1 items-center gap-3 bg-dark-2 text-light-2 data-[state=active]:bg-[#0e0e12] data-[state=active]:text-light-2 !important">
            {communityTabs.map((tab) => (
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

          <TabsContent value="threads">
            {community?.threads.length === 0 ? (
              <p>No threads yet.</p>
            ) : (
              community?.threads.map((t) => (
                <ThreadCard
                  parentId={t._id}
                  threadId={t._id}
                  _id={t._id}
                  key={t._id}
                  image={t.author.profile_picture || "/assets/profile.svg"}
                  username={t.author.username || "Unknown User"}
                  thread={t.thread}
                  comments={t.children}
                  createdAt={t.createdAt}
                  community={
                    community
                      ? {
                          id: community._id,
                          name: community.name,
                          image: community.community_picture,
                        }
                      : null
                  }
                />
              ))
            )}
          </TabsContent>

          <TabsContent value="members">
            <section className="mt-9 flex flex-col gap-10">
              {community?.members.length === 0 ? (
                <p className="text-white">No members yet</p>
              ) : (
                community?.members.map((member) => (
                  <UserCard
                    key={member._id}
                    id={member._id}
                    name={member.username}
                    imgUrl={member.profile_picture}
                    username={member.username}
                    personType="User"
                  />
                ))
              )}
            </section>
          </TabsContent>

          <TabsContent value="requests">
            <section className="mt-9 flex flex-col gap-10">
              {community?.requests?.length === 0 ? (
                <p className="text-white">No requests yet</p>
              ) : (
                community?.requests?.map((req) => (
                  <JoinRequestCard
                    key={req._id}
                    id={req._id}
                    name={req.username}
                    username={req.username}
                    imgUrl={req.profile_picture}
                    onAccept={handleAccept}
                    onReject={handleReject}
                  />
                ))
              )}
            </section>
          </TabsContent>
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

"use client";
import ThreadCard from "@/cards/ThreadCard";
import React, { useState, useEffect } from "react";
import { SignOutButton } from "@clerk/nextjs";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import LoadingThread from "@/components/ContentSkeleton";
import { Skeleton } from "@/components/ui/skeleton";
import { clearThreads, getThreads } from "@/store/slices/threadSlice";
import { RootState, AppDispatch } from "@/store/store";
import ContentSkeleton from "@/components/ContentSkeleton";
import LoadingSpinner from "@/components/Spinner";
import { useUser } from "@clerk/nextjs";

const Page = () => {
  const router = useRouter();
  const { isLoaded, isSignedIn } = useUser();
  const { status: userStatus } = useSelector(
    (state: RootState) => state.user.users
  );
  const {
    threads,
    status: threadStatus,
    currentPage,
    totalPages,
  } = useSelector((state: RootState) => state.thread);

  const { item: user, status: currentUserStatus } = useSelector(
    (state: RootState) => state.user.currentUser
  );

  const dispatch = useDispatch<AppDispatch>();

  // Handle authentication and onboarding redirects
  useEffect(() => {
    if (!isLoaded) return;

    if (!isSignedIn) {
      router.replace("/sign-in");
      return;
    }

    // Wait for user data to load
    if (currentUserStatus === "loading") return;

    // If user data loaded but user doesn't exist or not onboarded
    if (currentUserStatus === "succeeded") {
      if (!user) {
        router.replace("/sign-in");
        return;
      }
      if (!user.onboarded) {
        router.replace("/onboarding");
        return;
      }
    }
  }, [isLoaded, isSignedIn, currentUserStatus, user, router]);

  // Load threads only when user is ready
  useEffect(() => {
    if (
      currentUserStatus === "succeeded" &&
      user?.onboarded &&
      threads.length === 0
    ) {
      dispatch(clearThreads());
      dispatch(getThreads({ topLevelOnly: true, page: currentPage, limit: 5 }));
    }
  }, [currentUserStatus, user?.onboarded, dispatch]);

  // Show loading while checking auth or user status
  if (
    !isLoaded ||
    currentUserStatus === "loading" ||
    !user ||
    !user.onboarded
  ) {
    return <ContentSkeleton items={5} avatar lines={3} title />;
  }

  if (userStatus === "loading" || threadStatus === "loading") {
    return <ContentSkeleton items={5} avatar lines={3} title />;
  }

  return (
    <section className="w-full max-w-4xl mx-auto px-3 xs:px-4 sm:px-6 md:px-8 py-4 xs:py-5 sm:py-6">
      <h1 className="text-2xl xs:text-[26px] sm:text-[28px] md:text-[30px] leading-[140%] font-semibold md:font-semibold text-light-1 mb-4 xs:mb-5 sm:mb-6">
        Home
      </h1>

      {threads.length > 0 ? (
        <div className="space-y-0">
          {threads.map((t) => (
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
                t.community
                  ? {
                      id: t.community._id,
                      name: t.community.name,
                      image: t.community.community_picture,
                    }
                  : null
              }
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-12 xs:py-16 sm:py-20">
          <p className="text-light-2 text-base xs:text-lg sm:text-xl md:text-2xl font-medium text-center">
            No posts yet
          </p>
          <p className="text-gray-1 text-xs xs:text-sm mt-2 text-center">
            Be the first to create a thread
          </p>
        </div>
      )}

      {/* Pagination */}
      {threads.length > 0 && (
        <div className="flex flex-col xs:flex-row items-center justify-center gap-3 xs:gap-4 mt-6 xs:mt-8 sm:mt-10 pb-4">
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
            className="w-full xs:w-auto px-4 xs:px-5 sm:px-6 py-2 xs:py-2.5 bg-gray-600 text-white text-sm xs:text-base rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-500 active:scale-95 transition-all font-medium"
          >
            Previous
          </button>
          
          <span className="text-white text-sm xs:text-base font-medium whitespace-nowrap">
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
            className="w-full xs:w-auto px-4 xs:px-5 sm:px-6 py-2 xs:py-2.5 bg-gray-600 text-white text-sm xs:text-base rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-500 active:scale-95 transition-all font-medium"
          >
            Next
          </button>
        </div>
      )}
    </section>
  );
};

export default Page;
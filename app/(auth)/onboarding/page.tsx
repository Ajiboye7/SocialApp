"use client";

import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { useRouter } from "next/navigation";
import LoadingSpinner from "@/components/Spinner";
import AccountProfile from "@/components/forms/AccountProfile";
import { useUser } from "@clerk/nextjs";

const page = () => {
  const router = useRouter();
  const {  isLoaded, isSignedIn } = useUser();
  const { item: user, status } = useSelector(
    (state: RootState) => state.user.currentUser
  );

  /*useEffect(() => {
    if (!isLoaded) return;

    if (!isSignedIn) {
      router.replace("/sign-in");
      return;
    }

    if (status === "succeeded" && user?.onboarded) {
      router.replace("/");
    }
  }, [isLoaded, isSignedIn, status, user, router]);*/

  console.log('my user,', user)

  if (status === "loading" || !isLoaded) {
    return (
      <div className="mx-auto flex min-h-screen items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (status === "failed") {
    return (
      <div className="mx-auto flex min-h-[60vh] flex-col items-center justify-center">
        <h2 className="text-red-500 text-xl">Error loading user data</h2>
        <p className="text-light-2 mt-2">
          Please refresh the page to try again.
        </p>
      </div>
    );
  }

  const userData = {
    id: user?._id ?? "",
    username: user?.username ?? "",
    name: user?.name ?? "",
    bio: user?.bio ?? "",
    image: user?.profile_picture ?? "",
  };

  return (
    <div className="mx-auto flex max-w-3xl flex-col px-10 py-20">
      <h1 className="text-light-1 text-[30px] font-[600] mb-5">
        Onboarding
      </h1>
      <p className="text-light-2 text-[16px]">
        Complete your profile now, to use Threads.
      </p>

      <section className="mt-9 bg-dark-2 p-10">
        <AccountProfile user={userData} btnTitle="Continue" />
      </section>
    </div>
  );
};

export default page;

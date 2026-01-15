"use client";

import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { useRouter } from "next/navigation";
import LoadingSpinner from "@/components/Spinner";
import AccountProfile from "@/components/forms/AccountProfile";
import { useUser } from "@clerk/nextjs";

const Page = () => {
  const router = useRouter();
  const { isLoaded, isSignedIn, user: clerkUser } = useUser();
  const [mounted, setMounted] = useState(false);
  
  const reduxUser = useSelector(
    (state: RootState) => state.user?.currentUser?.item
  );
  const status = useSelector(
    (state: RootState) => state.user?.currentUser?.status
  );

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || !isLoaded) return;

    if (!isSignedIn) {
      router.replace("/sign-in");
      return;
    }

    if (status === "succeeded" && reduxUser?.onboarded) {
      router.replace("/");
    }
  }, [mounted, isLoaded, isSignedIn, status, reduxUser?.onboarded, router]);

  // Wait for client-side mount
  if (!mounted || !isLoaded || status === "loading") {
    return (
      <div className="mx-auto flex min-h-screen items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!isSignedIn || (status === "succeeded" && reduxUser?.onboarded)) {
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
    id: reduxUser?._id ?? clerkUser?.id ?? "",
    username: reduxUser?.username ?? "",
    name: reduxUser?.name ?? clerkUser?.fullName ?? "",
    bio: reduxUser?.bio ?? "",
    image: reduxUser?.profile_picture ?? clerkUser?.imageUrl ?? "",
  };

  return (
    <div className="mx-auto flex max-w-3xl flex-col px-10 py-20">
      <h1 className="text-light-1 text-[30px] font-[600] mb-5">Onboarding</h1>
      <p className="text-light-2 text-[16px]">
        Complete your profile now, to use Threads.
      </p>

      <section className="mt-9 bg-dark-2 p-10">
        <AccountProfile user={userData} btnTitle="Continue" />
      </section>
    </div>
  );
};

export default Page;
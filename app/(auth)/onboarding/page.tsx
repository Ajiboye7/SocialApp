"use client";
import React, { useEffect } from "react";
import Image from "next/image";
import Button from "@/components/shared/Button";
import AccountProfile from "@/components/forms/AccountProfile";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { redirect } from "next/navigation";
import { useRouter } from "next/navigation";
import LoadingSpinner from "@/components/ContentSkeleton";

const page = () => {
  const router = useRouter();
  const { currentUser: user, status } = useSelector((state: RootState) => state.user);

  const userData = {
    id: user?._id ?? "",
    username: user?.username ?? "",
    name: user?.name ?? "",
    bio: user?.bio ?? "",
    image: user?.profile_picture ?? "",
  };

  console.log( 'user Data onboarded', user)


  useEffect(() => {
    if (status === "succeeded" && user?.onboarded) {
      redirect("/");
    }
  }, [status, user]);

  if (status === "loading" || !user) {
    return (
      <div className="mx-auto flex max-w-3xl flex-col justify-center items-center px-10 py-20 min-h-[100vh]">
        <LoadingSpinner />
        <p className="text-light-2 mt-4">Loading your profile...</p>
      </div>
    );
  }

  if (status === "failed") {
    return (
      <div className="mx-auto flex max-w-3xl flex-col justify-center items-center px-10 py-20 min-h-[60vh]">
        <h2 className="text-red-500 text-xl">Error loading user data</h2>
        <p className="text-light-2 mt-2">
          Please refresh the page to try again.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto flex max-w-3xl flex-col justify-start px-10 py-20">
      <h1 className="text-light-1 text-[30px] leading-[140%] font-[600] mb-5">
        Onboarding
      </h1>
      <p className="text-light-2 text-[16px] leading-[140%] font-[400]">
        Complete your profile now, to use Threads.
      </p>
      <section className="mt-9 bg-dark-2 p-10">
       <AccountProfile user={userData} btnTitle="Continue" />
      </section>
    </div>
  );
};

export default page;

/*"use client";
import React from "react";
import { currentUser } from "@clerk/nextjs/server";
import Image from "next/image";
import { SignOutButton, SignedIn, useAuth } from "@clerk/nextjs";
import { usePathname, useRouter } from "next/navigation";

const page = () => {
  const router = useRouter();
  return (
    <div>
      <h1 className="text-white">ONBOARDING</h1>
      <SignOutButton>
        <div className="flex cursor-pointer gap-4 p-4">
          <Image src="/assets/logout.svg" alt="logout" width={24} height={24} />

          <p className="text-light-2 max-lg:hidden">Logout</p>
        </div>
      </SignOutButton>
    </div>
  );
};

export default page;*/

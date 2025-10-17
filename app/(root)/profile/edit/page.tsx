"use client";
import React from "react";
import Image from "next/image";
import Button from "@/components/shared/Button";
import AccountProfile from "@/components/forms/AccountProfile";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
const page = () => {
  const { currentUser: user } = useSelector((state: RootState) => state.user);
  const state = useSelector((state: RootState) => state);
  //console.log("Full Redux state:", state);
  

  const userData = {
    id: user?._id ?? "",
    username: user?.username ?? "",
    name: user?.name ?? "",
    bio: user?.bio ?? "",
    image: user?.profile_picture ?? "",
  };

  console.log('userData edit' , userData)

  return (
    <div>
      <h1 className="text-light-1 text-[30px] leading-[140%] font-[600] mb-5">
        Edit profile
      </h1>
      <p className="text-light-2 text-[16px] leading-[140%] font-[400]">
        Make any changes
      </p>
      <AccountProfile user={userData} btnTitle="Continue" />
    </div>
  );
};

export default page;

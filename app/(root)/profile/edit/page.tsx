"use client";
import React from "react";
import Image from "next/image";
import Button from "@/components/shared/Button";
import AccountProfile from "@/components/forms/AccountProfile";

const page = () => {
  return (
    <div>
      <h1 className="text-light-1 text-[30px] leading-[140%] font-[600] mb-5">
        Edit profile
      </h1>
      <p className="text-light-2 text-[16px] leading-[140%] font-[400]">
        Make any changes
      </p>
      <AccountProfile btnTitle="Continue" />
    </div>
  );
};

export default page;

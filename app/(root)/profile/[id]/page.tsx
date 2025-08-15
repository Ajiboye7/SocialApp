"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { profileTabs } from "@/constants";
import { useState } from "react";
import ThreadCard from "@/cards/ThreadCard";

const page = () => {
  const [isActive, setIsActive] = useState("threads");
  return (
    <section className="w-full">
      <div className="flex justify-between items-center">
        <div className="flex gap-3 items-center">
          <div className="relative h-20 w-20 object-cover">
            <Image
              src="/assets/profile.svg"
              alt="logo"
              fill
              className="rounded-full object-cover shadow-2xl"
            />
          </div>

          <div className="flex flex-col gap-2">
            <h2 className="text-light-1 text-[24px] leading-[140%] font-[700]">
              Username
            </h2>
            <p className="text-gray-1 text-[16px] leading-[140%] font-[500]">
              @user
            </p>
          </div>
        </div>
        <Link href="/app/(root)/search">
          <div className="flex items-center gap-2 bg-dark-3 rounded-lg py-2 px-4">
            <Image src="/assets/edit.svg" alt="edit" width={16} height={16} />
            <p className="text-white">Edit</p>
          </div>
        </Link>
      </div>

      <p className="text-white pt-10 pb-20 ">
       
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolorem, cum.
      </p>

      <div className="w-full">
        <div className="flex  items-center justify-around w-full  bg-dark-2 h-[50px] rounded-lg">
          {profileTabs.map((tab) => {
            const isTabActive = isActive === tab.value
            return (
              <div
                key={tab.value}
                className= {`flex items-center gap-3 px-5 cursor-pointer rounded-lg h-[50px] ${isTabActive && 'bg-[#0e0e12]   ' }` }
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

      <ThreadCard/>
    </section>
  );
};

export default page;

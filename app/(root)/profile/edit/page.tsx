'use client'
import React from "react";
import Image from "next/image";
import Button from "@/components/shared/Button";

const page = () => {
  return (
    <div>
      <h1 className="text-light-1 text-[30px] leading-[140%] font-[600] mb-5">Edit profile</h1>
      <p className="text-light-2 text-[16px] leading-[140%] font-[400]">Make any changes</p>
      <div className="flex gap-5 items-center mt-10">
        <div className="">
          <Image
            src="/assets/profile.svg"
            alt="profile"
            width={96}
            height={96}
          />
        </div>
        <div className="flex gap-3">
          <p className="text-primary-500 font-medium">Choose file</p>
          <p className="text-light-2 font-medium">No file chosen</p>
        </div>
      </div>

      <div>
        <p className="text-white pb-3 pt-5">Name</p>
        <input
          id="text"
          type="text"
          className=" w-full h-10 rounded-lg bg-dark-3 text-white placeholder-gray-400  "
        />
      </div>

      <div>
        <p className="text-white pb-5 pt-10">Username</p>

        <input
          id="text"
          type="text"
          className=" w-full h-10 rounded-lg bg-dark-3 text-white placeholder-gray-400  "
        />
      </div>

      <div>
        <p className="text-white pb-5 pt-10">Bio</p>
        <textarea className="w-full h-70 p-3 mb-8 border border-gray-300 dark:border-gray-600 bg-dark-3 dark:text-white rounded-md shadow-sm resize-y"></textarea>
      </div>
      <Button 
      children="continue"
      onclick={()=>{}}
      />
    </div>
  );
};

export default page;

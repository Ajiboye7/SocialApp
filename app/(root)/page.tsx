import ThreadCard from "@/cards/ThreadCard";
import React from "react";
import { SignOutButton } from "@clerk/nextjs";

const page = () => {
  return <section className="">
    <h1 className="text-[30px] leading-[140%] font-[600] text-light-1">Home</h1>
    <ThreadCard/>
   <SignOutButton redirectUrl="/sign-in">
  <button className="text-white mt-10">Sign Out</button>
</SignOutButton>
  </section>;
};

export default page;

import ThreadCard from "@/cards/ThreadCard";
import React from "react";
import { currentUser } from "@clerk/nextjs/server";

const page = () => {
  return <section className="">
    <h1 className="text-[30px] leading-[140%] font-[600] text-light-1">Home</h1>
    <ThreadCard/>
  </section>;
};

export default page;

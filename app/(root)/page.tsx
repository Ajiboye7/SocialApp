'use client'
import ThreadCard from "@/cards/ThreadCard";
import React from "react";
import { SignOutButton } from "@clerk/nextjs";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { redirect } from "next/navigation";

const page = () => {
  

  const {user} = useSelector((state: RootState)=> state.user)
   // const { user, isOnboarded } = useSelector((state: RootState) => state.user);

  //if(!user) return null

//  if(isOnboarded) redirect('/')
  console.log('user fetched ', user)

  const userName  = user?.name
  return <section className="">
    <h1 className="text-[30px] leading-[140%] font-[600] text-light-1">Home</h1>
    <ThreadCard/>
    <p className="text-white text-5xl">{userName || "No user data" }</p>
   <SignOutButton redirectUrl="/sign-in">
  <button className="text-white mt-10">Sign Out</button>
</SignOutButton>
  </section>;
};

export default page;

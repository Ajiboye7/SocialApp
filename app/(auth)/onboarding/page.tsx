
import React from "react";
import Image from "next/image";
import Button from "@/components/shared/Button";
import AccountProfile from "@/components/forms/AccountProfile";

const page = () => {

  const userData ={
    
  }
  return (
    <div className="mx-auto flex max-w-3xl flex-col justify-start px-10 py-20">
      <h1 className="text-light-1 text-[30px] leading-[140%] font-[600] mb-5">
        Onboarding
      </h1>
      <p className="text-light-2 text-[16px] leading-[140%] font-[400]">
        Complete your profile now, to use Threads.
      </p>
     <section className='mt-9 bg-dark-2 p-10'>
        <AccountProfile btnTitle='Continue'/>
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

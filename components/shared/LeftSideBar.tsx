"use client";

import {useSidebarLinks}  from "@/constants";
import Link from "next/link";
import React from "react";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { RootState, AppDispatch } from "@/store/store";
import { useSelector, useDispatch } from "react-redux";

const LeftSideBar = () => {
  const router = useRouter();
  const pathname = usePathname();
   const sidebarLinks = useSidebarLinks();
   const dispatch = useDispatch<AppDispatch>();
    const { currentUser: user, status: userStatus } = useSelector(
       (state: RootState) => state.user
     );
      //console.log('side bar ', user)

      const username = user?.username
  return (
    <div className="bg-dark-2 px-6 sticky w-fit top-0 left-0 pt-30 pb-20 flex flex-col justify-between max-md:hidden custom-scrollbar overflow-auto h-screen">
      <div className="w-full flex flex-col gap-5">
        {sidebarLinks.map((link, index) => {
          const isActive =
            (pathname.includes(link.route) && link.route.length > 1) ||
            pathname === link.route;
            if (link.route === "/profile") link.route = `${link.route}/${username}`;
          return (
            <div  key={link.label}>
              <Link
                href={link.route}
                className={`flex items-center gap-3 rounded-lg p-2 lg:p-4 ${
                  isActive && "bg-primary-500"
                } `}
              >
                <Image
                  src={link.imgURL}
                  alt={link.label}
                  width={24}
                  height={24}
                  
                />
                <p className="text-light-1 hidden lg:block"> {link.label}</p>
              </Link>
            </div>
          );
        })}
      </div>

      <Link href="/app/(auth)/sign-in" className="flex items-center gap-3 p-2 lg:p-4 ">
        <Image src="/assets/logout.svg" alt="logout" width={24} height={24} />
        <p className="text-[#FFFFFF] hidden lg:block ">Logout</p>
      </Link>
    </div>
  );
};

export default LeftSideBar;

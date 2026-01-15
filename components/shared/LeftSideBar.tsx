"use client";

import { useSidebarLinks } from "@/constants";
import Link from "next/link";
import React, { useEffect } from "react";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { RootState, AppDispatch } from "@/store/store";
import { useSelector, useDispatch } from "react-redux";
import { SignOutButton, SignedIn, useAuth } from "@clerk/nextjs";

const LeftSideBar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const sidebarLinks = useSidebarLinks();
  const { item: user, status: userStatus } = useSelector(
    (state: RootState) => state.user.currentUser
  );

  //console.log('current user', user);

  const username = user?.username;
  return (
    <div className='custom-scrollbar leftsidebar px-5'>
      <div className="flex w-full flex-1 flex-col gap-6 px-6'">
        {sidebarLinks.map((link, index) => {
          const isActive =
            (pathname.includes(link.route) && link.route.length > 1) ||
            pathname === link.route;
          const href = link.route === "/profile" ? `/profile/${username}` : link.route;

          return (
            
               <Link
              href={href}
              key={link.label}
              className={`leftsidebar_link ${isActive && "bg-primary-500 "}`}
            >
              <Image
                src={link.imgURL}
                alt={link.label}
                width={24}
                height={24}
              />
             

             <p className='text-light-1 max-lg:hidden'>{link.label}</p>
            </Link>
           
          );
        })}
      </div>

       <div className='mt-10 px-6'>
        <SignedIn>
          <SignOutButton signOutCallback={() => router.push("/sign-in")}>
            <div className='flex cursor-pointer gap-4 p-4'>
              <Image
                src='/assets/logout.svg'
                alt='logout'
                width={24}
                height={24}
              />

              <p className='text-light-2 max-lg:hidden'>Logout</p>
            </div>
          </SignOutButton>
        </SignedIn>
      </div>
    </div>
  );
};

export default LeftSideBar;

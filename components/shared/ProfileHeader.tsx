/*"use client";
import React, { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { RootState, AppDispatch } from "@/store/store";
import { useSelector, useDispatch } from "react-redux";
import { fetchUser } from "@/store/slices/userSlice";

interface Props {
  userId: string;
  name: string;
  username: string;
  imgUrl: string;
  bio: string;
  type?: string;
}

const ProfileHeader = ({
  userId,
  name,
  username,
  imgUrl,
  bio,
  type,
}: Props) => {
  
  const {
    user,
    status: userStatus,
    currentUser,
  } = useSelector((state: RootState) => state.user);

  const {community} = useSelector((state : RootState)=> state.community)

  const dispatch = useDispatch<AppDispatch>();

  return (
    <>
      <div className="flex justify-between items-center">
        <div className="flex gap-3 items-center">
          <div className="relative h-20 w-20 object-cover">
            <Image
              src={imgUrl || "/assets/profile.svg"}
              alt="logo"
              fill
              className="rounded-full object-cover shadow-2xl"
            />
          </div>

          <div className="flex flex-col gap-2">
            <h2 className="text-light-1 text-[24px] leading-[140%] font-[700]">
              {name}
            </h2>
            <p className="text-gray-1 text-[16px] leading-[140%] font-[500]">
              {username}
            </p>
          </div>
        </div>

        {userId === currentUser?._id && type !== "Community" && (
          <Link href="/profile/edit">
            <div className="flex items-center gap-2 bg-dark-3 rounded-lg py-2 px-4">
              <Image src="/assets/edit.svg" alt="edit" width={16} height={16} />
              <p className="text-white">Edit</p>
            </div>
          </Link>
        )}
        
      </div>
      <p className="text-white mt-8">{bio}</p>

      <div className="mt-10 h-0.5 w-full bg-dark-3" />
    </>
  );
};

export default ProfileHeader;*/

"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { RootState, AppDispatch } from "@/store/store";
import { useSelector, useDispatch } from "react-redux";
import { sendJoinRequest } from "@/store/slices/communitySlice";


interface Props {
  userId: string;
  name: string;
  username: string;
  imgUrl: string;
  bio: string;
  type?: string; 
}

const ProfileHeader = ({
  userId,
  name,
  username,
  imgUrl,
  bio,
  type,
}: Props) => {
  const { currentUser } = useSelector((state: RootState) => state.user);
  const { community } = useSelector((state: RootState) => state.community);
  const dispatch = useDispatch<AppDispatch>();

  const handleJoinCommunity = () =>{
    if(!community?._id) return

    dispatch (sendJoinRequest(community._id))
  }
  

  return (
    <>
      <div className="flex justify-between items-center">
        <div className="flex gap-3 items-center">
          <div className="relative h-20 w-20 object-cover">
            <Image
              src={imgUrl || "/assets/profile.svg"}
              alt="logo"
              fill
              className="rounded-full object-cover shadow-2xl"
            />
          </div>

          <div className="flex flex-col gap-2">
            <h2 className="text-light-1 text-[24px] leading-[140%] font-[700]">
              {name}
            </h2>
            <p className="text-gray-1 text-[16px] leading-[140%] font-[500]">
              {username}
            </p>
          </div>
        </div>

        {userId === currentUser?._id && type !== "Community" && (
          <Link href="/profile/edit">
            <div className="flex items-center gap-2 bg-dark-3 rounded-lg py-2 px-4">
              <Image src="/assets/edit.svg" alt="edit" width={16} height={16} />
              <p className="text-white">Edit</p>
            </div>
          </Link>
        )}

        {type === "Community" &&
          currentUser?._id !== community?.createdBy._id && (
            <button
              onClick={handleJoinCommunity}
              className="flex items-center gap-2 bg-primary-500 hover:bg-primary-600 transition rounded-lg py-2 px-4 text-white"
            >
              <p>Join</p>
            </button>
          )}
      </div>

      <p className="text-white mt-8">{bio}</p>
      <div className="mt-10 h-0.5 w-full bg-dark-3" />
    </>
  );
};

export default ProfileHeader;

/*
"use client";
import React, { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { RootState, AppDispatch } from "@/store/store";
import { useSelector, useDispatch } from "react-redux";
import { fetchUser } from "@/store/slices/userSlice";

const ProfileHeader = () => {
  const {
    user,
    status: userStatus,
    currentUser,
  } = useSelector((state: RootState) => state.user);

  const dispatch = useDispatch<AppDispatch>();


  return (
    <>
      <div className="flex justify-between items-center">
        <div className="flex gap-3 items-center">
          <div className="relative h-20 w-20 object-cover">
            <Image
              src={user?.profile_picture || "/assets/profile.svg"}
              alt="logo"
              fill
              className="rounded-full object-cover shadow-2xl"
            />
          </div>

          <div className="flex flex-col gap-2">
            <h2 className="text-light-1 text-[24px] leading-[140%] font-[700]">
              {user?.username}
            </h2>
            <p className="text-gray-1 text-[16px] leading-[140%] font-[500]">
              {user?.username}
            </p>
          </div>
        </div>

        {user?.id === currentUser?.id && (
            <Link href='/profile/edit'>
            <div className="flex items-center gap-2 bg-dark-3 rounded-lg py-2 px-4">
              <Image src="/assets/edit.svg" alt="edit" width={16} height={16} />
              <p className="text-white">Edit</p>
            </div>
          </Link>
        )}
      </div>
      <p className="text-white mt-8">{user?.bio}</p>

      <div className="mt-10 h-0.5 w-full bg-dark-3"/>
    </>
  );
};

export default ProfileHeader;

 */

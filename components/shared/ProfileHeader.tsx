import React from "react";
import Image from "next/image";
import Link from "next/link";
import { RootState } from "@/store/store";
import { useSelector } from "react-redux";

const ProfileHeader = () => {
  const { user, status: userStatus } = useSelector(
    (state: RootState) => state.user
  );
  console.log('User data', user)

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
              {user?.name}
            </h2>
            <p className="text-gray-1 text-[16px] leading-[140%] font-[500]">
              {user?.userName}
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
      <p className="text-white mt-8">{user?.bio}</p>

      <div className="mt-10 h-0.5 w-full bg-dark-3" />
    </>
  );
};

export default ProfileHeader;

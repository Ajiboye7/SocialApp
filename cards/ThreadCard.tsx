import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

const ThreadCard = () => {

  const {user} = useSelector((state: RootState)=> state.user)

  //const profilePicture = user?.profile_picture
  return (
    <div className="relative w-full bg-dark-2 p-7 mt-7 rounded-xl flex justify-between">
      <div className="flex flex-col gap-3 ">
        <div className="flex gap-4 ">
          <div className="">
            <Image
              src={user?.profile_picture || "/assets/profile.svg"}
              alt="profile"
              width={50}
              height={50}
              className="rounded-full"
            />
          </div>
          {/*<div className="relative mt-2 w-0.5 grow rounded-full bg-neutral-800"/>*/}

          <div className="flex flex-col gap-2">
            <p className="text-light-1 text-[16px] leading-[140%] font-[600]">
              Username
            </p>
            <p className="text-light-2 text-[14px] leading-[140%] font-[400]">
              Lorem ipsum dolor sit amet.
            </p>
            <div className="flex items-center gap-3">
              <Image
                src="/assets/heart-gray.svg"
                alt="heart"
                width={24}
                height={24}
                className="cursor-pointer object-contain"
              />
              <Link href={`/thread/${123}`}>
                <Image
                  src="/assets/reply.svg"
                  alt="heart"
                  width={24}
                  height={24}
                  className="cursor-pointer object-contain"
                />
              </Link>
              <Image
                src="/assets/repost.svg"
                alt="heart"
                width={24}
                height={24}
                className="cursor-pointer object-contain"
              />
              <Image
                src="/assets/share.svg"
                alt="heart"
                width={24}
                height={24}
                className="cursor-pointer object-contain"
              />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div>
            <Image
              src="/assets/profile.svg"
              alt="profile"
              width={30}
              height={30}
            />
          </div>

          <p className="text-gray-1 text-[12px] leading-[16px] font-[500]">
            1 reply
          </p>
        </div>
      </div>

      <div>
        <Image src="/assets/delete.svg" alt="delete" width={18} height={18} />
      </div>
    </div>
  );
};

export default ThreadCard;

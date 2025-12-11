"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { useOrganization } from "@clerk/nextjs";

interface Props {
  id: string;
  name: string;
  username: string;
  imgUrl: string;
  personType: string;
}

const UserCard = ({ id, name, username, imgUrl, personType }: Props) => {
  const router = useRouter();

  const isCommunity = personType === "Community";
   const { organization } = useOrganization();
  
  // This will give you a proper, accessible image URL
  //const imageUrl = organization?.imageUrl;
  return (
    <article className="flex justify-between gap-4 max-xs:rounded-xl max-xs:bg-dark-3 max-xs:p-4 xs:flex-row xs:items-center">
      <div className="flex flex-1 items-start justify-start gap-3 xs:items-center">
        <div className="relative h-12 w-12">
          <Image
            src={imgUrl || "/assets/profile.svg"}
            alt="user_logo"
            fill
            className="rounded-full object-cover"
          />
        </div>

        <div className="flex-1 text-ellipsis">
          <h4 className="text-[16px] leading-[140%] font-[600] text-light-1">
            {name}
          </h4>
          <p className="text-[14px] leading-[140%] font-[500] text-gray-1">
            @{username}
          </p>
        </div>
      </div>

      <Button
        className="h-auto min-w-[74px] rounded-lg bg-primary-500 text-[12px] text-light-1"
        onClick={() => {
          if (isCommunity) {
            router.push(`/communities/${id}`);
          } else {
            router.push(`/profile/${username}`);
          }
        }}
      >
        View
      </Button>
    </article>
  );
};

export default UserCard;

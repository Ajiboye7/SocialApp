import React from "react";
import Image from "next/image";
import Link from "next/link";



interface CommentAuthor {
  username: string;
  profile_picture: string;
}

interface Comment {
  _id: string;
  author: CommentAuthor;
  thread: string;
  createdAt: string;
  parentId: string;
  children: Comment[];
}

interface Props {
  image: string;
  username: string;
  thread: string;
  parentId: string;
  comments: Comment[];
}

const ThreadCard = ({image, username, thread, parentId, comments}: Props) => {
  //const {user} = useSelector((state: RootState)=> state.user)

  //const profilePicture = user?.profile_picture

  return (
    <div className="relative w-full bg-dark-2 p-7 mt-7 rounded-xl flex justify-between">
      <div className="flex flex-col gap-3 ">
        <div className="flex gap-4 ">
          <div className="">
            <Image
             src={image|| "/assets/profile.svg"}
              //src="/assets/profile.svg"
              alt="profile"
              width={50}
              height={50}
              className="rounded-full"
            />
          </div>
          {/*<div className="relative mt-2 w-0.5 grow rounded-full bg-neutral-800"/>*/}

          <div className="flex flex-col gap-2">
            <p className="text-light-1 text-[16px] leading-[140%] font-[600]">
              {username}
            </p>
            <p className="text-light-2 text-[14px] leading-[140%] font-[400]">
             {thread}
            </p>
            <div className="flex items-center gap-3">
              <Image
                src="/assets/heart-gray.svg"
                alt="like"
                width={24}
                height={24}
                className="cursor-pointer object-contain"
              />
              <Link href={`/thread/${parentId}`}>
                <Image
                  src="/assets/reply.svg"
                  alt="reply"
                  width={24}
                  height={24}
                  className="cursor-pointer object-contain"
                />
              </Link>
              <Image
                src="/assets/repost.svg"
                alt="repost"
                width={24}
                height={24}
                className="cursor-pointer object-contain"
              />
              <Image
                src="/assets/share.svg"
                alt="share"
                width={24}
                height={24}
                className="cursor-pointer object-contain"
              />
            </div>
          </div>
        </div>

       {comments.length > 0 && (
  <div className="flex items-center gap-2 mt-4">
    <div>
      <Image
        src={comments[0].author.profile_picture || "/assets/profile.svg"}
        alt={comments[0].author.username}
        width={30}
        height={30}
        className="rounded-full"
      />
    </div>

    <p className="text-gray-1 text-[12px] leading-[16px] font-[500]">
      {comments.length} {comments.length === 1 ? "comment" : "comments"}
    </p>
  </div>
)}
      </div>

      <div>
        <Image src="/assets/delete.svg" alt="delete" width={18} height={18} />
      </div>
    </div>
  );
};

export default ThreadCard;

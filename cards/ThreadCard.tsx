import React from "react";
import Image from "next/image";
import Link from "next/link";
import { deleteComment } from "@/store/slices/threadSlice";
import { deleteThread } from "@/store/slices/threadSlice";
import { useDispatch, UseDispatch } from "react-redux";
import { AppDispatch } from "@/store/store";
import { threadId } from "worker_threads";

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
  isComment?: boolean;
  showDeleteButton?: boolean;
  _id: string;
  threadId: string;
  comments?: Comment[];
}

const ThreadCard = ({
  image,
  username,
  thread,
  parentId,
  comments = [],
  isComment,
  showDeleteButton,
  _id,
  threadId,
}: Props) => {
  const dispatch = useDispatch<AppDispatch>();

   const handleDelete = async () => {
    if (
      !confirm(
        `Are you sure you want to delete this ${
          isComment ? "comment" : "thread"
        }?`
      )
    ) {
      return;
    }

    try {
      if (isComment && parentId) {
     
        await dispatch(
          deleteComment({ parentId, commentId: _id })
        ).unwrap();
        alert("Comment deleted successfully");
      } else {
        
        await dispatch(deleteThread(threadId)).unwrap();
        alert("Thread deleted successfully");
      }
    } catch (error: any) {
      alert(error || `Failed to delete ${isComment ? "comment" : "thread"}`);
    }
  }; 


  return (
    <div
      className={`relative w-full  mt-7 rounded-xl flex justify-between ${
        isComment ? "px-0 xs-px-7 " : "bg-dark-2 p-7"
      }`}
    >
      <div className="flex flex-col gap-3 ">
        <div className="flex gap-4 ">
          <div className="relative flex flex-col items-center">
            <Image
              src={image || "/assets/profile.svg"}
              alt="profile"
              width={50}
              height={50}
              className="rounded-full z-10"
            />

            <div className="w-px h-full bg-neutral-800 absolute top-9" />
          </div>

        

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
              <Link href={`/thread/${threadId}`}>
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
            <div className="flex -space-x-3 z-10">
              {comments.slice(0, 3).map((comment) => (
                <Image
                  key={comment._id}
                  src={comment.author.profile_picture || "/assets/profile.svg"}
                  alt={comment.author.username}
                  width={30}
                  height={30}
                  className="rounded-full border-2 border-dark-2"
                />
              ))}
            </div>

            <Link href={`/thread/${threadId}`}>
              <p className="text-gray-1 text-[12px] leading-[16px] font-[500]">
                {comments.length} {comments.length === 1 ? "reply" : "replies"}
              </p>
            </Link>
          </div>
        )}
      </div>

      {(isComment || showDeleteButton) && (
        <div onClick={handleDelete} className="cursor-pointer">
          <Image src="/assets/delete.svg" alt="delete" width={18} height={18} />
        </div>
      )}
    </div>
  );
};

export default ThreadCard;

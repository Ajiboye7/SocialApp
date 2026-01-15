import React from "react";
import Image from "next/image";
import Link from "next/link";
import { deleteComment } from "@/store/slices/threadSlice";
import { deleteThread } from "@/store/slices/threadSlice";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store/store";
import { formatDateString } from "@/lib/utils";

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
  community?: {
    id: string;
    name: string;
    image: string;
  } | null;
  createdAt: string;
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
  community,
  createdAt,
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
        await dispatch(deleteComment({ parentId, commentId: _id })).unwrap();
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
      className={`relative w-full mt-4 sm:mt-6 md:mt-7 rounded-xl flex justify-between transition-colors hover:bg-dark-3 ${
        isComment ? "px-2 xs:px-4 sm:px-7" : "bg-dark-2 p-3 xs:p-4 sm:p-6 md:p-7"
      }`}
    >
      <div className="flex flex-col items-start justify-between w-full">
        <div className="flex w-full flex-1 flex-row gap-2 xs:gap-3 sm:gap-4">
          <div className="relative flex flex-col items-center flex-shrink-0">
            <div className="relative h-9 w-9 xs:h-10 xs:w-10 sm:h-11 sm:w-11 md:h-12 md:w-12">
              <Image
                src={image || "/assets/profile.svg"}
                alt="profile"
                fill
                className="rounded-full z-10 object-cover"
              />
            </div>

            {comments.length > 0 && (
              <div className="w-0.5 h-full bg-neutral-800 absolute top-8 xs:top-9 sm:top-10" />
            )}
          </div>

          <div className="flex flex-col gap-1.5 xs:gap-2 flex-1 min-w-0">
            <p className="text-light-1 text-sm xs:text-base sm:text-[15px] md:text-[16px] leading-[140%] font-semibold truncate">
              {username}
            </p>
            <p className="text-light-2 text-xs xs:text-sm sm:text-[13px] md:text-[14px] leading-[140%] font-normal break-words">
              {thread}
            </p>
            <div className="flex items-center gap-2 xs:gap-2.5 sm:gap-3 mt-1">
              <Image
                src="/assets/heart-gray.svg"
                alt="like"
                width={20}
                height={20}
                className="cursor-pointer object-contain w-5 h-5 xs:w-5 xs:h-5 sm:w-6 sm:h-6 hover:opacity-70 transition-opacity"
              />
              <Link href={`/thread/${threadId}`}>
                <Image
                  src="/assets/reply.svg"
                  alt="reply"
                  width={20}
                  height={20}
                  className="cursor-pointer object-contain w-5 h-5 xs:w-5 xs:h-5 sm:w-6 sm:h-6 hover:opacity-70 transition-opacity"
                />
              </Link>
              <Image
                src="/assets/repost.svg"
                alt="repost"
                width={20}
                height={20}
                className="cursor-pointer object-contain w-5 h-5 xs:w-5 xs:h-5 sm:w-6 sm:h-6 hover:opacity-70 transition-opacity"
              />
              <Image
                src="/assets/share.svg"
                alt="share"
                width={20}
                height={20}
                className="cursor-pointer object-contain w-5 h-5 xs:w-5 xs:h-5 sm:w-6 sm:h-6 hover:opacity-70 transition-opacity"
              />
            </div>
          </div>
        </div>

        {comments.length > 0 && (
          <div className="flex items-center gap-2 mt-3 xs:mt-3.5 sm:mt-4 ml-1 xs:ml-1.5 sm:ml-2">
            <div className="flex -space-x-2 xs:-space-x-2.5 sm:-space-x-3 z-10 relative">
              {comments.slice(0, 3).map((comment, index) => (
                <div
                  key={comment._id}
                  className="relative w-5 h-5 xs:w-6 xs:h-6 sm:w-7 sm:h-7"
                  style={{ zIndex: 3 - index }}
                >
                  <Image
                    src={comment.author.profile_picture || "/assets/profile.svg"}
                    alt={comment.author.username}
                    fill
                    className="rounded-full border-2 border-dark-2 object-cover"
                  />
                </div>
              ))}
            </div>

            <Link href={`/thread/${threadId}`}>
              <p className="text-gray-1 text-[11px] xs:text-xs sm:text-[12px] leading-[16px] font-medium hover:underline">
                {comments.length} {comments.length === 1 ? "reply" : "replies"}
              </p>
            </Link>
          </div>
        )}

        {!isComment && community && (
          <Link
            href={`/communities/${community.id}`}
            className="mt-3 xs:mt-4 sm:mt-5 flex items-center space-x-1.5 xs:space-x-2 hover:opacity-80 transition-opacity"
          >
            <p className="text-[11px] xs:text-xs sm:text-[12px] leading-[16px] font-medium text-gray-1 truncate max-w-[200px] xs:max-w-[250px] sm:max-w-full">
              {formatDateString(createdAt)}
              {community && ` - ${community.name} Community`}
            </p>
            <div className="relative w-4 h-4 xs:w-4 xs:h-4 sm:w-5 sm:h-5 flex-shrink-0">
              <Image
                src={community.image || "/assets/profile.svg"}
                alt={community.name}
                fill
                className="rounded-full object-cover"
              />
            </div>
          </Link>
        )}
      </div>

      {(isComment || showDeleteButton) && (
        <div
          onClick={handleDelete}
          className="cursor-pointer flex-shrink-0 ml-2 hover:opacity-70 transition-opacity"
        >
          <Image
            src="/assets/delete.svg"
            alt="delete"
            width={16}
            height={16}
            className="w-4 h-4 xs:w-[17px] xs:h-[17px] sm:w-[18px] sm:h-[18px]"
          />
        </div>
      )}
    </div>
  );
};

export default ThreadCard;
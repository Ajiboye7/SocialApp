"use client";
import React, { useEffect } from "react";
import UserCard from "@/cards/UserCard";
import { clearUser, fetchUsers } from "@/store/slices/userSlice";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/store/store";
import { fetchSidebarUsers } from "@/store/slices/userSlice";
import { getCommunities } from "@/store/slices/communitySlice";
import UserCardSkeleton from "../UserCardSkeleton";
import { getSidebarCommunities } from "@/store/slices/communitySlice";
import { clearCommunity } from "@/store/slices/communitySlice";

const RightSideBar = () => {
  const dispatch = useDispatch<AppDispatch>();
  const {
    items: users,

    status: status,
  } = useSelector((state: RootState) => state.user.sidebar);

  const { items: communities,  } = useSelector((state: RootState) => state.community.sidebar);

  useEffect(() => {
    dispatch(clearUser())
    dispatch(fetchSidebarUsers({ page: 1, limit: 4 }));
    dispatch(clearCommunity())
    dispatch(getSidebarCommunities({page: 1, limit: 4}));
  }, [dispatch,]);

  

  return (
    <section className="custom-scrollbar rightsidebar">
      <div className="flex flex-1 flex-col justify-start">
        <h3 className="text-heading4-medium text-light-1">
          Suggested Communities
        </h3>

        <div className="mt-7 flex w-[350px] flex-col gap-9">
          {status == "loading" ? (
            Array.from({ length: 4 }).map((_, index) => (
              <UserCardSkeleton key={index} button={true} />
            ))
          ) : communities.length > 0 ? (
            communities.map((community) => (
              <UserCard
                key={community._id}
                id={community._id}
                name={community.name}
                username={community.name}
                imgUrl={community.community_picture}
                personType="Community"
              />
            ))
          ) : (
            <p className="!text-base-regular text-light-3">
              No communities yet
            </p>
          )}
        </div>
      </div>

      <div className="flex flex-1 flex-col justify-start">
       <h3 className='text-heading4-medium text-light-1'>Similar Minds</h3>
        <div className="mt-7 flex w-[350px] flex-col gap-10">
          {status == "loading" ? (
            Array.from({ length: 4 }).map((_, index) => (
              <UserCardSkeleton key={index} button={true} />
            ))
          ) : users.length > 0 ? (
            users.map((user) => (
              <UserCard
                key={user.id}
                id={user.id}
                name={user.name}
                username={user.username}
                imgUrl={user.profile_picture}
                personType="User"
              />
            ))
          ) : (
            <p className="!text-base-regular text-light-3">No users yet</p>
          )}
        </div>
      </div>
    </section>
  );
};

export default RightSideBar;

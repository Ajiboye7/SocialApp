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
    dispatch(fetchSidebarUsers({ page: 1, limit: 3 }));
    dispatch(clearCommunity())
    dispatch(getSidebarCommunities({page: 1, limit: 3}));
  }, [dispatch]);

  

  return (
    <section className="custom-scrollbar sticky right-0 top-0 z-20 flex h-screen w-fit flex-col justify-between gap-12 overflow-auto border-l border-l-dark-4 bg-dark-2 px-10 pb-6 pt-28 max-xl:hidden">
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

      {/*<div className="flex flex-col gap-5 w-[350px]">
          <h3 className=" text-[20px] font-[500] leading-[140%] text-light-1">
            Similar minds
          </h3>
          <p className="text-light-3">No user yet</p>
        </div>*/}

      <div className="flex flex-1 flex-col justify-start">
        <h3 className="text-[20px] leading-[140%] font-weight-[500] text-light-1">
          Similar Minds
        </h3>
        <div className="mt-7 flex w-[350px] flex-col gap-10">
          {status == "loading" ? (
            Array.from({ length: 4 }).map((_, index) => (
              <UserCardSkeleton key={index} button={true} />
            ))
          ) : users.length > 0 ? (
            users.map((community) => (
              <UserCard
                key={community.id}
                id={community.id}
                name={community.name}
                username={community.username}
                imgUrl={community.profile_picture}
                personType="Community"
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

{
  /*<section className="bg-dark-2 pt-30 w-fit sticky right-0 top-0 z-20 px-10 max-xl:hidden ">
      <div className=" flex flex-col gap-24 h-1/2 justify-between">
        {/*<div className="flex flex-col gap-5 w-[350px]">
          <h3 className=" text-[20px] font-[500] leading-[140%] text-light-1">
            Suggested communities
          </h3>
          <p className="text-light-3">No community yet</p>
        </div>

        <div className='flex flex-1 flex-col justify-start'>
        <h3 className='text-heading4-medium text-light-1'>
          Suggested Communities
        </h3>

        <div className='mt-7 flex w-[350px] flex-col gap-9'>
          {users.length > 0 ? (
            <>
              {users.map((community) => (
                <UserCard
                  key={community.id}
                  id={community.id}
                  name={community.name}
                  username={community.username}
                  imgUrl={community.profile_picture}
                  personType='Community'
                />
              ))}
            </>
          ) : (
            <p className='!text-base-regular text-light-3'>
              No communities yet
            </p>
          )}
        </div>
      </div>

        {/*<div className="flex flex-col gap-5 w-[350px]">
          <h3 className=" text-[20px] font-[500] leading-[140%] text-light-1">
            Similar minds
          </h3>
          <p className="text-light-3">No user yet</p>
        </div>

         <div className='flex flex-1 flex-col justify-start'>
        <h3 className='text-[20px] leading-[140%] font-weight-[500] text-light-1'>Similar Minds</h3>
        <div className='mt-7 flex w-[350px] flex-col gap-10'>
          {users.length > 0 ? (
            <>
              {users.map((person) => (
                <UserCard
                  key={person.id}
                  id={person.id}
                  name={person.name}
                  username={person.username}
                  imgUrl={person.profile_picture}
                  personType='User'
                />
              ))}
            </>
          ) : (
            <p className='!text-base-regular text-light-3'>No users yet</p>
          )}
        </div>
      </div>

      </div>
    </section>*/
}

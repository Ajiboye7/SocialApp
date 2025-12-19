"use client";
import SearchBar from "@/components/shared/SearchBar";
import React, { useState } from "react";
import { useEffect } from "react";
import { fetchUsers } from "@/store/slices/userSlice";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/store/store";
import UserCard from "@/cards/UserCard";
import { clearUser } from "@/store/slices/userSlice";
import UserCardSkeleton from "@/components/UserCardSkeleton";
import ContentSkeleton from "@/components/ContentSkeleton";
 import { clearCommunity, getCommunities } from "@/store/slices/communitySlice";

const page = () => {
  const dispatch = useDispatch<AppDispatch>();
  /*const {
    users,
    currentPage,
    totalPages,
    usersStatus: status,
  } = useSelector((state: RootState) => state.user);*/

  const {items : communities, status, pagination: { currentPage },  } = useSelector((state : RootState)=> state.community.communities);
  
  const [search, setSearch] = useState("");

  useEffect(() => {
    //dispatch(clearUser());
    //dispatch(fetchUsers({ page: currentPage, limit: 10 })).unwrap();
    dispatch(clearCommunity())
    dispatch(getCommunities({page: currentPage, limit: 3}));
  }, [dispatch]);

  //console.log("This is user listed", users);

  const filteredCommunities = communities.filter((community) => {
    const query = search.toLowerCase();
    return (
      community.name.toLowerCase().includes(query) 
      //|| user.username.toLowerCase().includes(query)
    );
  });

  return (
    <section className=" ">
      <h1 className={`text-white text-[30px] font-[600] leading-[140%] mb-10 ${status === 'loading' ? 'hidden' : ''}  ` }>
        Search
      </h1>

      {status === "loading" ? (
        <ContentSkeleton
          lines={0}
          items={1}
          avatar={false}
          className="py-0"
        />
      ) : (
        <SearchBar routeType="/search" search={search} setSearch={setSearch} />
      )}

      <div className="mt-14 flex flex-col gap-9">
        {status == "loading" ? (
          Array.from({ length: 4 }).map((_, index) => (
            <UserCardSkeleton key={index}  button= {true}/>
          ))
        ) : filteredCommunities.length > 0 ? (
          filteredCommunities.map((community) => (
            <UserCard
              key={community.id}
              id={community.id}
              name={community.name}
              username={community.slug}
              imgUrl={community.community_picture}
              personType="Community"
            />
          ))
        ) : (
          <p className="text-white">No community yet</p>
        )}
      </div>

      {/*<div className={`flex gap-4 mt-6 ${status === 'loading' ? 'hidden' : ''}`}>
        <button
          disabled={currentPage <= 1}
          onClick={() =>
            dispatch(fetchUsers({ page: currentPage - 1, limit: 10 }))
          }
          className="px-4 py-2 bg-gray-600 text-white rounded disabled:opacity-50"
        >
          Prev
        </button>
        <span className="text-white">
          Page {currentPage} of {totalPages}
        </span>
        <button
          disabled={currentPage >= totalPages}
          onClick={() =>
            dispatch(fetchUsers({ page: currentPage + 1, limit: 10 }))
          }
          className="px-4 py-2 bg-gray-600 text-white rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>*/}
     
    </section>
  );
};

export default page;

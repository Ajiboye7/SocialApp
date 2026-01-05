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
 

const page = () => {
  const dispatch = useDispatch<AppDispatch>();
  const {
    items:users,
    pagination: {currentPage},
    pagination: {totalPages},
   status,
  } = useSelector((state: RootState) => state.user.users);
  const [search, setSearch] = useState("");

  useEffect(() => {
    dispatch(clearUser());
    dispatch(fetchUsers({ page: currentPage, limit: 10 }));
  }, [dispatch]);

  //console.log("This is user listed", users);

  const filteredUsers = users.filter((user) => {
    const query = search.toLowerCase();
    return (
      user.name.toLowerCase().includes(query) ||
      user.username.toLowerCase().includes(query)
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
        ) : filteredUsers.length > 0 ? (
          filteredUsers.map((user) => (
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
          <p className="text-white">No user yet</p>
        )}
      </div>

      <div className={`flex gap-4 mt-6 ${status === 'loading' ? 'hidden' : ''}`}>
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
      </div>
     
    </section>
  );
};

export default page;

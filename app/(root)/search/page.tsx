"use client";
import SearchBar from "@/components/shared/SearchBar";
import React, {useState} from "react";
import { useEffect } from "react";
import { fetchUsers } from "@/store/slices/userSlice";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/store/store";
import UserCard from "@/cards/UserCard";

const page = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { users, currentPage, totalPages } = useSelector((state: RootState) => state.user);
   const [search, setSearch] = useState("");

  useEffect(() => {
    dispatch(fetchUsers({page: currentPage, limit:10})).unwrap();
  }, [dispatch]);
  console.log("list of users", users);

  const filteredUsers = users.filter((user) => {
    const query = search.toLowerCase();
    return (
      user.name.toLowerCase().includes(query) ||
      user.username.toLowerCase().includes(query)
    );
  });


  return (
    <section className=" ">
      <h1 className="text-white text-[30px] font-[600] leading-[140%] mb-10">
        Search
      </h1>
       <SearchBar routeType="/search" search={search} setSearch={setSearch} />

      <div className="mt-14 flex flex-col gap-9">
        {filteredUsers.length > 0 ? (
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

       {/* Pagination Controls */}

        <div className="flex gap-4 mt-6">
        <button
          disabled={currentPage <= 1}
          onClick={() => dispatch(fetchUsers({ page: currentPage - 1, limit: 10 }))}
          className="px-4 py-2 bg-gray-600 text-white rounded disabled:opacity-50"
        >
          Prev
        </button>
        <span className="text-white">
          Page {currentPage} of {totalPages}
        </span>
        <button
          disabled={currentPage >= totalPages}
          onClick={() => dispatch(fetchUsers({ page: currentPage + 1, limit: 10 }))}
          className="px-4 py-2 bg-gray-600 text-white rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>

      
    </section>
  );
};

export default page;

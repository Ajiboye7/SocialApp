"use client";
import React from "react";
import Image from "next/image";
import { useState } from "react";

const SearchBar = () => {
  return (
    <div className=" h-14 bg-dark-2 flex gap-4 rounded-2xl items-center px-3 ">
      <Image
        src="/assets/search-gray.svg"
        alt="search icon"
        width={25}
        height={25}
      />

      <input
        id="text"
        type="text"
        placeholder="Search for communities"
        className=" w-full h-full rounded-2xl bg-transparent text-white placeholder-gray-400  "
      />
    </div>
  );
};

export default SearchBar;

"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { Input } from "../ui/input";

interface Props {
  routeType: string;
  search: string;
  setSearch: (value: string) => void;
}


const SearchBar = ({ routeType , search, setSearch}: Props) => {
  const router = useRouter();
  //const [search, setSearch] = useState("");
  return (
    <div className=" flex gap-1 rounded-lg bg-dark-3 px-4 py-2">
      <Image
        src="/assets/search-gray.svg"
        alt="search icon"
        width={25}
        height={25}
      />

      <Input
        id="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder={`${
          routeType !== "/search" ? "Search communities" : "Search creators"
        }`}
        className="focus-visible:ring-0 focus-visible:ring-transparent focus-visible:ring-offset-0 !important border-none bg-dark-3 text-base-regular text-light-4 outline-none"
      />
    </div>
  );
};

export default SearchBar;

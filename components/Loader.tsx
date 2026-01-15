"use client";

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store/store";
import { fetchUsers } from "@/store/slices/userSlice";
import { useUser } from "@clerk/nextjs";
import { fetchUser } from "@/store/slices/userSlice";
import { currentUser } from "@/store/slices/userSlice";

import { clearThreads } from "@/store/slices/threadSlice";

export default function Loader() {
  const dispatch = useDispatch<AppDispatch>();
  const { user, isLoaded, isSignedIn } = useUser();

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      dispatch(currentUser());
    }
  }, [dispatch, isLoaded, isSignedIn]);

  return null;
}


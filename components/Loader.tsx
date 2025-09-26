// components/UserLoader.tsx
'use client';

import { useEffect } from 'react';
import { useDispatch} from "react-redux";
import { AppDispatch } from "@/store/store";
import { fetchUser } from '@/store/slices/userSlice';
//import { getThreads } from '@/store/slices/threadSlice';

export default function Loader() {
 const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(fetchUser());
    //dispatch(getThreads())
  }, [dispatch]);

  return null;
}
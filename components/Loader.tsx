// components/UserLoader.tsx
'use client';

import { useEffect } from 'react';
import { useDispatch} from "react-redux";
import { AppDispatch } from "@/store/store";
import { fetchUsers } from '@/store/slices/userSlice';
//import { getThreads } from '@/store/slices/threadSlice';

export default function Loader() {
 const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    //dispatch(fetchUsers());
    //dispatch(getThreads())
  }, [dispatch]);

  return null;
}
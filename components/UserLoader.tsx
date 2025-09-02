// components/UserLoader.tsx
'use client';

import { useEffect } from 'react';
import { useDispatch} from "react-redux";
import { AppDispatch } from "@/store/store";
import { fetchUser } from '@/store/slices/userSlice';

export default function UserLoader() {
 const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(fetchUser());
  }, [dispatch]);

  return null; // This component doesn't render anything
}
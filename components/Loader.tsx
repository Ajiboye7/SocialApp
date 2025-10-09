// components/UserLoader.tsx
'use client';

import { useEffect } from 'react';
import { useDispatch} from "react-redux";
import { AppDispatch } from "@/store/store";
import { fetchUsers } from '@/store/slices/userSlice';
import { useUser } from "@clerk/nextjs";
import { fetchUser } from '@/store/slices/userSlice';
//import { getThreads } from '@/store/slices/threadSlice';

export default function Loader() {
 const dispatch = useDispatch<AppDispatch>();
 const { user, isLoaded, isSignedIn } = useUser();
  const userId = user?.id

  useEffect(() => {
    
    //dispatch(fetchUsers());
    //dispatch(getThreads())
     if (userId) {
         
          dispatch(fetchUser(userId));
          // console.log('userData', singleUser)
           //console.log('User id', userId)
           
        }
  }, [dispatch, userId]);

  return null;
}
'use client'
import Button from '@/components/shared/Button';
import React from 'react';
import PostThreads from '@/forms/PostThreads';

const page = () => {

  
  return (
    <section className="">
      <h1 className="text-[30px] leading-[140%] font-[600] text-light-1 mb-5">Create Thread</h1>
      <PostThreads/>
    </section>
  );
}

export default page;

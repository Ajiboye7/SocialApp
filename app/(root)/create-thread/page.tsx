'use client'
import Button from '@/components/shared/Button';
import React from 'react';

const page = () => {

   const handleClick = () => {
    alert('Button clicked!');
  };

  return (
    <section className="">
      <h1 className="text-[30px] leading-[140%] font-[600] text-light-1 mb-5">Create Thread</h1>
      <p className='text-light-2 mb-4'>Content</p>
      <textarea
  className="w-full h-70 p-3 mb-8 border border-gray-300 dark:border-gray-600 bg-dark-3 dark:text-white rounded-md shadow-sm resize-y"
></textarea>
<Button 
children='Post Thread'
onclick={handleClick}
/>
    </section>
  );
}

export default page;

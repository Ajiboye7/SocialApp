import React from 'react';
import Image from 'next/image';
import Link from 'next/link';


const TopBar = () => {
  return (
    <nav className='fixed bg-dark-2 w-full z-30 py-3 px-4 flex items-center justify-between'>
      <div className='flex items-center gap-3 '>
        <Image 
        src='/assets/logo.svg'
        alt='logo'
        width={28}
        height={28}
        />
         <p className='text-[24px] leading-[140%] font-bold text-white'>Threads </p>
      </div>

      <Link 
      href='/app/(auth)/sign-in'
      >
       <Image
      src='/assets/logout.svg'
      alt='logout'
      width={24}
      height={24}
      className='md:hidden block'
      />
      </Link>
     
     
    </nav>
  );
}

export default TopBar;

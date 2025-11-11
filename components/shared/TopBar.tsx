import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { OrganizationSwitcher, SignedIn, SignOutButton } from "@clerk/nextjs";
import { dark } from '@clerk/themes';


const TopBar = () => {
 return (
    <nav className='fixed top-0 z-30 flex w-full items-center justify-between bg-dark-2 px-6 py-3'>
      <Link href='/' className='flex items-center gap-4'>
        <Image  src='/assets/logo.svg' alt='logo' width={28} height={28} />
        <p className='text-heading3-bold text-light-1 max-xs:hidden'>Threads</p>
      </Link>

      <div className='flex items-center gap-1'>
        <div className='block md:hidden'>
          <SignedIn>
            <SignOutButton>
              <div className='flex cursor-pointer'>
                <Image
                  src='/assets/logout.svg'
                  alt='logout'
                  width={24}
                  height={24}
                />
              </div>
            </SignOutButton>
          </SignedIn>
        </div>

        <OrganizationSwitcher
          appearance={{
            theme: dark,
            elements: {
              organizationSwitcherTrigger: "py-2 px-4",
            },
          }}
        />
      </div>
    </nav>
  );
}

export default TopBar;

{/*const TopBar = () => {
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

export default TopBar;*/}

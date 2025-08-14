'use client'
import { sidebarLinks } from '@/constants';
import React from 'react';
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from 'next/image';

const BottomBar = () => {
   const pathname = usePathname();
  return (
    <section className='bg-dark-2 md:hidden p-4 rounded-xl fixed bottom-0 w-full z-10'>
     <div className='flex justify-between '>
      {sidebarLinks.map((link)=>{
        const isActive =
        (pathname.includes(link.route) && link.route.length > 1 || pathname === link.route)
        return(
          <div key={link.label} className=''>
            <Link 
            href={link.route}
            key={link.label}
           className={`flex flex-col items-center gap-1 rounded-lg p-2 md:p-4 ${
                  isActive && "bg-primary-500"
                } `}
            >
            <Image
            src={link.imgURL} 
            alt ={link.route}
            width={16}
            height={16}
            />
            <p className='text-light-1 text-[12px] leading-[16px] font-[500] hidden sm:block'>{link.label.split(/\s+/)[0]}</p>
            </Link>
          </div>
        )
      })}
     </div>
    </section>
   
  );
}

export default BottomBar;

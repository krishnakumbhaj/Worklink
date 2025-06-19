'use client';

import React, { useState, useEffect } from 'react';
import { Sidebar, SidebarBody, SidebarLink } from '../../components/ui/sidebar';
import {
  IconArrowLeft,
  IconBrandTabler,
  IconSettings,
  IconUserBolt,
  IconNotification,
  IconMeteorFilled,
  IconUserCircle
} from '@tabler/icons-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function SidebarDemo() {
  const [open, setOpen] = useState(false);
  const { data: session, status } = useSession();
   const router = useRouter();
  const handleLogout = () => {
    signOut({ callbackUrl: '/sign-in' }); // or '/login' based on your route
  };
  const handleprofile = () => {
    router.push('/post-profile') // or '/login' based on your route
  };
  const [hasProfile, setHasProfile] = useState(true); // Assume true by default

  useEffect(() => {
   const checkProfile = async () => {
  try {
    const res = await fetch('/api/profile');
    const data = await res.json();

    // If profile exists, set true
    setHasProfile(!!data.profile);
  } catch (error) {
    console.error('Failed to check profile:', error);
  }

};
    checkProfile();

  }, [session]);

  const links = [
    {
      label: 'Dashboard',
      href: '/dashboard',
      icon: (
        <IconBrandTabler className="h-7 w-7 shrink-0 text-[#fefefe] dark:text-neutral-200" />
      ),
    },
    {
      label: 'Notification',
      href: '/joblist',
      icon: (
        <IconNotification className="h-7 w-7 shrink-0 text-[#fefefe] dark:text-neutral-200" />
      ),
    },
    {
      label: 'Profile',
      href: '/profile-page',
      icon: (
        <IconUserBolt className="h-7 w-7 shrink-0 text-[#fefefe] dark:text-neutral-200" />
      ),
    },
    {
      label: 'My Space',
      href: '/My_space',
      icon: (
        <IconMeteorFilled className="h-7 w-7 shrink-0 text-[#fefefe] dark:text-neutral-200" />
      ),
    },
    {
      label: 'Settings',
      href: '/post-profile',
      icon: (
        <IconSettings className="h-7 w-7 shrink-0 text-[#fefefe] dark:text-neutral-200" />
      ),
    },
  ];

  return (
    <div
      className={cn(
        'mx-auto flex h-screen flex-1 flex-col overflow-hidden rounded-md bg-[#333236] md:flex-row dark:border-neutral-100 dark:bg-neutral-800'
      )}
    >
      <Sidebar open={open} setOpen={setOpen}>
        <SidebarBody className="justify-between bg-[#282828] gap-10">
          <div className="flex flex-1 flex-col text-white  overflow-x-hidden overflow-y-auto">
            {open ? <Logo /> : <LogoIcon />}
            <div className="mt-8 flex flex-col text-neutral-100 gap-4">
              {links.map((link, idx) => (
                <SidebarLink key={idx} link={link} className='text-neutral-100' />
              ))}
              {/* Logout as functional button */}
                <button
                onClick={handleLogout}
                className="flex items-center gap-2 rounded-full py-2  text-md w-32 font-medium text-red-600 hover:bg-red-100 dark:hover:bg-red-900 transition-all duration-300 ease-in-out transform hover:px-1 hover:scale-105 hover:translate-x-2 "
                >
                <IconArrowLeft className="h-7 w-7 shrink-0 " />
                {open && <span>Logout</span>}
                </button>
                {!hasProfile && (
                  <button
                          onClick={handleprofile}
                            className="flex items-center gap-2 rounded-full py-2 text-center text-md w-36 font-medium text-purple-600 hover:bg-purple-100 dark:hover:bg-purple-900 transition-all duration-300 ease-in-out transform hover:px-1 hover:scale-105 hover:translate-x-2 "
  >
    {open && <span className='px-3'>Create Profile</span>}
  </button>
)}
            </div>
          </div>
            <div>
            <div className="flex items-center gap-2 py-2 text-sm font-medium text-neutral-700 dark:text-neutral-200">
             <IconUserCircle className="h-8 w-8 shrink-0 text-[#fefefe] dark:text-neutral-200" />
              <span className='text-[#fefefe] text-lg'>{session?.user?.username || session?.user?.name || 'Guest'}</span>
            </div>
            </div>
        </SidebarBody>
      </Sidebar>
      <Dashboard />
    </div>
  );
}

export const Logo = () => {
  return (
    <a
      href="#"
      className="relative z-20 flex items-center space-x-2 py-1 text-sm font-normal text-black"
    >
      <div className="h-5 w-6 shrink-0 rounded-tl-lg rounded-tr-sm rounded-br-lg rounded-bl-sm bg-black dark:bg-white" />
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="font-medium whitespace-pre text-black dark:text-white"
      >
        Acet Labs
      </motion.span>
    </a>
  );
};

export const LogoIcon = () => {
  return (
    <a
      href="#"
      className="relative z-20 flex items-center space-x-2 py-1 text-sm font-normal text-black"
    >
      <div className="h-5 w-6 shrink-0 rounded-tl-lg rounded-tr-sm rounded-br-lg rounded-bl-sm bg-black dark:bg-white" />
    </a>
  );
};
import PostProjectForm from '@/components/PostProjectForm';
import Dev_listing_project from '@/components/Dev_listing_project';
// Dummy dashboard component with content
const Dashboard = () => {
  return (
    <div className="flex-1 bg-[#121212]  overflow-y-auto p-4 py-0">
            <Dev_listing_project />
          </div>
  );
};

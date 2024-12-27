"use client";
import { IoMdLogOut } from "react-icons/io";
import MessagesDashboard from "@/components/MessagesDashboard";
import React, { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { User } from "next-auth";
import { Sidebar, SidebarBody, SidebarLink } from "@/components/ui/sidebar";
import {
  IconArrowLeft,
  IconBrandTabler,
  IconSettings,
  IconUserBolt,
} from "@tabler/icons-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation"; // Import useRouter for navigation
import { Button } from "@/components/ui/button";

export default function SidebarDemo() {
  const [open, setOpen] = useState(false);
  const { data: session, status } = useSession();
  const user: User = session?.user;
  const router = useRouter(); // Initialize the router

  // Ensure that session is fully loaded before rendering
  if (status === "loading") {
    return <div>Loading...</div>;
  }

  // Define the links including the Logout link
  const links = [
    {
      label: "Dashboard",
      href: "#",
      icon: (
        <IconBrandTabler className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "Profile",
      href: "/u/username",
      icon: (
        <IconUserBolt className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "Settings",
      href: "/listen",
      icon: (
        <IconSettings className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "Blogs",
      href: "/blogs",
      icon: (
        <IconArrowLeft className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
  ];

  return (
    <div
      className={cn(
        "flex flex-col md:flex-row bg-gray-100 dark:bg-neutral-800 w-full h-screen"
      )}
    >
      <Sidebar open={open} setOpen={setOpen}>
        <SidebarBody className="justify-between gap-10">
          <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
            {open ? <Logo /> : <LogoIcon />}
            <div className="mt-8 flex flex-col gap-2">
              {/* Display username in sidebar if user is logged in */}
              {/* {session ? (
                <div className="text-indigo-500 mb-4">Welcome, {user.username || user.email}</div>
              ) : null} */}
              {links.map((link, idx) => (
                <SidebarLink key={idx} link={link} />
              ))}
            </div>
          </div>
          <div>
          {session ? (
          <>
            <IoMdLogOut onClick={() => signOut()} className=" md:w-auto h-7 px-1 w-7 mb-3 text-red-700 hover:text-red-700 " />
            
          </>
        ) : (
          <Link href="/sign-in">
            <Button className="w-full md:w-auto border-2 border-solid border-red-500 bg-slate-100 text-black" variant={'outline'}>Login</Button>
          </Link>
        )}
       
            <SidebarLink
              link={{
                label: `${user.email}`,
                href: "#",
                icon: (
                  <img
                    src="https://imgs.search.brave.com/5MUfd-k_MefCcgQxfnruQnH0lKjVqTCKAgkbY_Zd-_o/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly90NC5m/dGNkbi5uZXQvanBn/LzA4LzgxLzExLzQ1/LzM2MF9GXzg4MTEx/NDUwNl9iVUx0bmlw/VzlueXhHSnNmQ2Qy/VlhxVlNjYkc4WU5V/RC5qcGc"
                    className="h-7 w-7 flex-shrink-0 rounded-full"
                    width={50}
                    height={50}
                    alt="Avatar"
                  />
                ),
              }}
            />
          </div>

        </SidebarBody>
      </Sidebar>
      <div className="flex flex-1 h-full">
        {/* <Dashboard />
         */}
         <MessagesDashboard/>
      </div>
    </div>
  );
}

export const Logo = () => {
  return (
    <Link
      href="#"
      className="font-normal flex space-x-2 items-center text-sm text-black py-1 relative z-20"
    >
      <div className="h-5 w-6 bg-black dark:bg-white rounded-br-lg rounded-tr-sm rounded-tl-lg rounded-bl-sm flex-shrink-0" />
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="font-medium text-black dark:text-white whitespace-pre"
      >
        Acet Labs
      </motion.span>
    </Link>
  );
};

export const LogoIcon = () => {
  return (
    <Link
      href="#"
      className="font-normal flex space-x-2 items-center text-sm text-black py-1 relative z-20"
    >
      <div className="h-5 w-6 bg-black dark:bg-white rounded-br-lg rounded-tr-sm rounded-tl-lg rounded-bl-sm flex-shrink-0" />
    </Link>
  );
};

// Dummy dashboard component with content
const Dashboard = () => {
  return (
    <div className="flex flex-1 h-full">
      <div className="p-2 md:p-10 rounded-tl-2xl border border-neutral-200 dark:border-neutral-700 bg-red-100 dark:bg-neutral-900 flex flex-col gap-2 flex-1 w-full h-full">
        <div className="flex gap-2">
          {[...new Array(4)].map((_, i) => (
            <div
              key={`first-array-${i}`} // Unique key for each item
              className="h-20 w-full rounded-lg bg-gray-100 dark:bg-neutral-800 animate-pulse"
            ></div>
          ))}
        </div>
        <div className="flex gap-2 flex-1">
          {[...new Array(2)].map((_, i) => (
            <div
              key={`second-array-${i}`} // Unique key for each item
              className="h-full w-full rounded-lg bg-gray-100 dark:bg-neutral-800 animate-pulse"
            ></div>
          ))}
        </div>
      </div>
    </div>
  );
};

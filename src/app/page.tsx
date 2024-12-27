"use client";
import React from "react";
import { SparklesCore } from "@/components/ui/sparkles";
import Link from "next/link";
import {User} from "next-auth";
import { useSession } from "next-auth/react";

export default function SparklesPreview() {
  const { data: session } = useSession();
  return (
    <div className="h-screen w-full bg-black flex flex-col items-center justify-center overflow-hidden rounded-md relative">
      <h1 className="md:text-7xl text-3xl lg:text-9xl font-bold text-center text-white relative z-20">
      DoItNow
      </h1>
      <div className="w-[40rem] h-40 relative z-10">
        {/* Gradients */}
        <div className="absolute inset-x-20 top-0 bg-gradient-to-r from-transparent via-indigo-500 to-transparent h-[2px] w-3/4 blur-sm" />
        <div className="absolute inset-x-20 top-0 bg-gradient-to-r from-transparent via-indigo-500 to-transparent h-px w-3/4" />
        <div className="absolute inset-x-60 top-0 bg-gradient-to-r from-transparent via-sky-500 to-transparent h-[5px] w-1/4 blur-sm" />
        <div className="absolute inset-x-60 top-0 bg-gradient-to-r from-transparent via-sky-500 to-transparent h-px w-1/4" />

        {/* Core component */}
        <SparklesCore
          background="transparent"
          minSize={0.4}
          maxSize={1}
          particleDensity={1200}
          className="w-full h-full"
          particleColor="#FFFFFF"
        />
        <div className="absolute inset-10 flex flex-col items-center justify-center z-20">
          <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 space-x-0 md:space-x-4">

            <Link href='/sign-in'><button className="w-40 h-10 rounded-xl bg-indigo-600 border dark:border-white border-transparent text-white text-sm transform transition duration-300 hover:scale-110 focus:outline-none z-30">
              Join Now
            </button></Link>
            <Link href="/sign-up"><button className="w-40 h-10 rounded-xl text-white border-2 border-indigo-600 text-sm transform transition duration-300 hover:scale-110 focus:outline-none z-30">
              Signup
            </button></Link>
          </div>
        </div>

        {/* Radial Gradient to prevent sharp edges */}
        <div className="absolute inset-0 w-full h-full bg-black [mask-image:radial-gradient(350px_200px_at_top,transparent_20%,white)]"></div>
      </div>
    </div>
  );
}

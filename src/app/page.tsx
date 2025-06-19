"use client";
import React from "react";
import { motion } from "motion/react";
import { LampContainer } from "../components/ui/lamp";
import { useRouter } from "next/navigation";

export default function page() {
  const router = useRouter();
  // Placeholder for the sign-up button action
  const handleSignUp = () => {
    // Implement sign-up logic here
    router.push("/sign-up"); // Redirect to the sign-up page
    console.log("Sign Up button clicked");
  };
  return (
    <LampContainer>
      <motion.h1
        initial={{ opacity: 0.5, y: 100 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{
          delay: 0.3,
          duration: 0.8,
          ease: "easeInOut",
        }}
        className="mt-8 bg-gradient-to-br from-slate-300 to-slate-500 py-4 bg-clip-text text-center text-4xl font-medium tracking-tight text-transparent md:text-7xl"
      >
        Build lamps <br /> the right way
      </motion.h1>
      
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{
          delay: 0.8,
          duration: 0.6,
          ease: "easeInOut",
        }}
        className="flex flex-col sm:flex-row gap-4 mt-8"
      >
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
        >
          Explore
        </motion.button>
        
        <motion.button
          onClick={handleSignUp}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-8 py-3 border-2 border-slate-300 text-slate-300 font-semibold rounded-lg hover:bg-slate-300 hover:text-slate-900 transition-colors duration-300"
        >
          Sign Up
        </motion.button>
      </motion.div>
    </LampContainer>
  );
}
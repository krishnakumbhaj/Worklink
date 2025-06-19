// components/Navbar.tsx

import React from 'react';
import Link from 'next/link';

type NavbarProps = {
  logo: string; // URL for logo image
  name: string; // Platform name
};

const Navbar: React.FC<NavbarProps> = ({ logo, name }) => {
  return (
    <nav className="flex justify-between items-center p-4 bg-gray-900 text-white">
      {/* Left Side: Logo and Name */}
      <div className="flex items-center gap-2">
        <img src={logo} alt="Logo" className="w-8 h-8" />
        <h1 className="text-xl font-bold">{name}</h1>
      </div>

      {/* Right Side: Login and Signup Links */}
      <div className="flex gap-4">
        <Link href="/sign-in" className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-all">
          Login
        </Link>
        <Link href="/sign-up" className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-all">
          SignUp
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;

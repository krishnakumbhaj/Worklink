'use client';

import React, { useState } from 'react';
import axios from 'axios';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

type Profile = {
  _id: string;
  fullName?: string;
  bio?: string;
  email?: string;
  profileImage?: string;
  phone?: string;
  socialLinks?: {
    linkedin?: string;
    github?: string;
    twitter?: string;
    portfolio?: string;
  };
  skills?: string[];
  location?: string;
};

interface SearchModalProps {
  open: boolean;
  onClose: () => void;
}

const SearchModal: React.FC<SearchModalProps> = ({ open, onClose }) => {
  const [searchInput, setSearchInput] = useState('');
  const [searchResult, setSearchResult] = useState<Profile | null>(null);
  const [searchLoading, setSearchLoading] = useState(false);

  const handleSearch = async () => {
    if (!searchInput) return;
    setSearchLoading(true);
    try {
      const res = await axios.get(`/api/profile/${searchInput}`);
      setSearchResult(res.data.profile);
    } catch (err) {
      console.error(err);
      setSearchResult(null);
      alert('User not found!');
    }
    setSearchLoading(false);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-50 flex items-center justify-center transition-all">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-96 relative">
        <button className="absolute top-2 right-2" onClick={() => { onClose(); setSearchInput(''); setSearchResult(null); }}>
          <X className="w-5 h-5 text-gray-600 dark:text-gray-300" />
        </button>
        <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Search User by Username</h2>
        <div className="flex space-x-2">
          <Input placeholder="Enter username..." value={searchInput} onChange={(e) => setSearchInput(e.target.value)} />
          <Button onClick={handleSearch} disabled={searchLoading}>
            {searchLoading ? 'Searching...' : 'Search'}
          </Button>
        </div>
        {searchResult && (
          <div className="mt-4 p-3 border rounded bg-gray-100 dark:bg-gray-700">
            <p><strong>Full Name:</strong> {searchResult.fullName}</p>
            <p><strong>Email:</strong> {searchResult.email}</p>
            <p><strong>Location:</strong> {searchResult.location}</p>
            {searchResult.bio && <p><strong>Bio:</strong> {searchResult.bio}</p>}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchModal;

'use client';
import React, { useEffect, useState } from "react";
import { User,Mail, Phone, MapPin, Calendar, ExternalLink, Linkedin, Github, Twitter, Globe } from 'lucide-react';
import { signOut, useSession } from 'next-auth/react';
import LoaderShowcase from "@/components/ui/LoaderShowcase";
import axios from "axios";

const UserProfile = () => {
  interface Profile {
    fullName?: string;
    email?: string;
    bio?: string;
    profileImage?: string;
    phone?: string;
    socialLinks?: {
      linkedin?: string;
      github?: string;
      twitter?: string;
      portfolio?: string;
    };
    skills?: string[];
    experience?: string[];
    education?: string[];
    location?: string;
    createdAt?: string;
  }

  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { data: session, status } = useSession();
  
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
  
        const response = await axios.get('http://localhost:3000/api/profile', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
  
        setProfile(response.data.profile);
        console.log(response.data.profile);
      } catch (err) {
        setError("Failed to load profile.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
  
    fetchProfile();
  }, []);
  

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <LoaderShowcase />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 mt-10">
        <p>{error}</p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="text-center mt-10 text-gray-600">
        <p>No profile data found.</p>
      </div>
    );
  }

  const {
    fullName,
    email,
    bio,
    profileImage,
    phone,
    socialLinks,
    skills,
    experience,
    education,
    location,
    createdAt,
  } = profile;
  const renderSocialIcons = () => {
    return (
      <div className="flex space-x-4 mt-4">
        {socialLinks?.linkedin && (
          <a href={socialLinks.linkedin} target="_blank" rel="noopener noreferrer" 
             className="text-blue-600 hover:text-[#894cd1] transition-colors">
            <Linkedin size={20} />
          </a>
        )}
        {socialLinks?.github && (
          <a href={socialLinks.github} target="_blank" rel="noopener noreferrer" 
             className="text-white hover:text-gray-900 transition-colors">
            <Github size={20} />
          </a>
        )}
        {socialLinks?.twitter && (
          <a href={socialLinks.twitter} target="_blank" rel="noopener noreferrer" 
             className="text-blue-400 hover:text-blue-600 transition-colors">
            <Twitter size={20} />
          </a>
        )}
        {socialLinks?.portfolio && (
          <a href={socialLinks.portfolio} target="_blank" rel="noopener noreferrer" 
             className="text-green-600 hover:text-green-800 transition-colors">
            <Globe size={20} />
          </a>
        )}
      </div>
    );
  };
  return (
    <div className="max-w-4xl mx-auto my-1 bg-[#25232a] rounded-xl overflow-hidden shadow-xl">
      {/* Header with background gradient */}
      <div className="bg-[#894cd1] p-8 text-white">
        <div className="flex flex-row md:flex-row items-center md:items-start">
          {/* Profile Image */}
          <div className="relative mb-4 md:mb-0 md:mr-6">
            <div className="w-28 h-28 md:w-32 md:h-32 rounded-full overflow-hidden border-4 border-white shadow-lg">
              <img
                src={profileImage}
                alt={fullName}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          
          {/* User Name and Basic Info */}
          <div className="text-center md:text-left">
            <h1 className="text-3xl font-bold">{fullName || "Anonymous User"}</h1>
            <div className="mt-2 flex flex-wrap items-center justify-center md:justify-start gap-y-1">
              <div className="flex items-center mr-4">
                <Calendar size={16} className="mr-1" />
                <span className="text-sm opacity-90">
                  Joined {createdAt ? new Date(createdAt).toLocaleDateString() : "N/A"}
                </span>
              </div>
              <div className="flex items-center">
                <MapPin size={16} className="mr-1" />
                <span className="text-sm opacity-90">{location || "N/A"}</span>
              </div>
            </div>
            {renderSocialIcons()}
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="p-6 md:p-8">
        {/* Contact Info */}
        <div className="flex flex-wrap gap-4 mb-6 text-white">
          <div className="flex items-center bg-[#3f3f3f] px-4 py-2 rounded-xl shadow-sm">
            <Mail size={18} className="text-blue-500 mr-2" />
            <span>{session?.user?.email || "N/A"}</span>
          </div>
          <div className="flex items-center bg-[#3f3f3f]  px-4 py-2 rounded-xl shadow-sm">
            <User size={18} className="text-blue-500 mr-2" />
            <span>{session?.user?.username || "N/A"}</span>
          </div>
          <div className="flex items-center bg-[#3f3f3f]  px-4 py-2 rounded-xl shadow-sm">
            <Phone size={18} className="text-blue-500 mr-2" />
            <span>{phone || "N/A"}</span>
          </div>
        </div>
        
        {/* Bio */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-white mb-3 border-b border-[#894cd1] pb-2">Bio</h2>
          <p className="text-white leading-relaxed">{bio || "No bio available"}</p>
        </div>
        
        {/* Two column layout for desktop */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Left Column */}
          <div>
            {/* Skills */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-white mb-3 border-b border-[#894cd1] pb-2">Skills</h2>
              {skills && skills.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {skills.map((skill, index) => (
                    <span key={index} className="bg-purple-500 font-mono text-white px-3 py-1 rounded-full text-sm font-medium">
                      {skill}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 italic">No skills listed</p>
              )}
            </div>
            
            {/* Experience */}
            <div>
              <h2 className="text-xl font-semibold text-white mb-3 border-b border-[#894cd1] pb-2">Experience</h2>
              {experience && experience.length > 0 ? (
                <ul className="space-y-2">
                  {experience.map((item, index) => (
                    <li key={index} className="bg-[#3f3f3f]  p-3 rounded-xl shadow-sm">
                      <div className="flex">
                        <div className="mr-3 mt-1">
                          <div className="w-2 h-2 rounded-full bg-[#894cd1]"></div>
                        </div>
                        <span className="text-white">{item}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500 italic">No experience listed</p>
              )}
            </div>
          </div>
          
          {/* Right Column */}
          <div>
            {/* Education */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-white mb-3 border-b border-[#894cd1] pb-2">Education</h2>
              {education && education.length > 0 ? (
                <ul className="space-y-2">
                  {education.map((item, index) => (
                    <li key={index} className="bg-[#3f3f3f]  p-3 rounded-xl shadow-sm">
                      <div className="flex">
                        <div className="mr-3 mt-1">
                          <div className="w-2 h-2 rounded-full bg-[#894cd1]"></div>
                        </div>
                        <span className="text-white">{item}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500 italic">No education listed</p>
              )}
            </div>
            
            {/* Social Links (full displays) */}
            <div>
              <h2 className="text-xl font-semibold text-white mb-3 border-b border-[#894cd1] pb-2">
                Social & Links
              </h2>
              <ul className="space-y-2">
                {socialLinks?.linkedin && (
                  <li className="flex items-center">
                    <Linkedin size={18} className="text-blue-600 mr-2" />
                    <a
                      href={socialLinks.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline flex items-center"
                    >
                      LinkedIn Profile
                      <ExternalLink size={14} className="ml-1" />
                    </a>
                  </li>
                )}
                {socialLinks?.github && (
                  <li className="flex items-center">
                    <Github size={18} className="text-white mr-2" />
                    <a
                      href={socialLinks.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-white hover:underline flex items-center"
                    >
                      GitHub Profile
                      <ExternalLink size={14} className="ml-1" />
                    </a>
                  </li>
                )}
                {socialLinks?.twitter && (
                  <li className="flex items-center">
                    <Twitter size={18} className="text-blue-400 mr-2" />
                    <a
                      href={socialLinks.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:underline flex items-center"
                    >
                      Twitter Profile
                      <ExternalLink size={14} className="ml-1" />
                    </a>
                  </li>
                )}
                {socialLinks?.portfolio && (
                  <li className="flex items-center">
                    <Globe size={18} className="text-green-600 mr-2" />
                    <a
                      href={socialLinks.portfolio}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-green-600 hover:underline flex items-center"
                    >
                      Portfolio Website
                      <ExternalLink size={14} className="ml-1" />
                    </a>
                  </li>
                )}
                {!socialLinks ||
                  (!socialLinks.linkedin &&
                    !socialLinks.github &&
                    !socialLinks.twitter &&
                    !socialLinks.portfolio) && (
                    <li className="text-gray-500 italic">No social links provided</li>
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;

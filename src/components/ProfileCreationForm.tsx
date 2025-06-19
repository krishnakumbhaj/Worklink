'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getSession } from 'next-auth/react';
import { 
  User, Mail, Phone, MapPin, Briefcase, GraduationCap, Link, Plus, Trash2, 
  ImagePlus, CheckCircle2, AlertCircle, Globe 
} from 'lucide-react';

interface UserProfile {
  userId?: string;
  fullName: string;
  bio?: string;
  profileImage?: string;
  phone?: string;
  email: string;
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
}

const ProfileCreationForm: React.FC = () => {
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile>({
    email: '',  // will be fetched from server session
    fullName: '',
    bio: '',
    profileImage: '',
    phone: '',
    socialLinks: {
      linkedin: '',
      github: '',
      twitter: '',
      portfolio: '',
    },
    skills: [],
    experience: [],
    education: [],
    location: ''
  });

  const [newSkill, setNewSkill] = useState('');
  const [newExperience, setNewExperience] = useState('');
  const [newEducation, setNewEducation] = useState('');
  const [submissionStatus, setSubmissionStatus] = useState<string>('');
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
  const [profileImage, setProfileImage] = useState<string | null>(null);

  // Get email from server session on component mount
  useEffect(() => {
    const fetchSession = async () => {
      const session = await getSession();
      if (session?.user?.email) {
        setProfile(prev => ({ ...prev, email: session.user.email }));
      }
    };
    fetchSession();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name.startsWith('socialLinks.')) {
      const key = name.split('.')[1];
      setProfile(prev => ({
        ...prev,
        socialLinks: {
          ...prev.socialLinks,
          [key]: value
        }
      }));
    } else {
      setProfile(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('File is too large. Max 5MB.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result as string);
        setProfile(prev => ({ ...prev, profileImage: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const addSkill = () => {
    const trimmed = newSkill.trim();
    if (trimmed && !profile.skills?.includes(trimmed)) {
      setProfile(prev => ({ ...prev, skills: [...(prev.skills || []), trimmed] }));
      setNewSkill('');
    }
  };

  const removeSkill = (skill: string) => {
    setProfile(prev => ({ ...prev, skills: prev.skills?.filter(s => s !== skill) }));
  };

  const addExperience = () => {
    const trimmed = newExperience.trim();
    if (trimmed && !profile.experience?.includes(trimmed)) {
      setProfile(prev => ({ ...prev, experience: [...(prev.experience || []), trimmed] }));
      setNewExperience('');
    }
  };

  const removeExperience = (exp: string) => {
    setProfile(prev => ({ ...prev, experience: prev.experience?.filter(e => e !== exp) }));
  };

  const addEducation = () => {
    const trimmed = newEducation.trim();
    if (trimmed && !profile.education?.includes(trimmed)) {
      setProfile(prev => ({ ...prev, education: [...(prev.education || []), trimmed] }));
      setNewEducation('');
    }
  };

  const removeEducation = (edu: string) => {
    setProfile(prev => ({ ...prev, education: prev.education?.filter(e => e !== edu) }));
  };

  const validateForm = (): boolean => {
    const errors: { [key: string]: string } = {};
    if (!profile.fullName.trim()) errors.fullName = 'Full name is required';
    if (!profile.email.trim()) errors.email = 'Email is required';
    if (!profile.bio?.trim()) errors.bio = 'Bio is required';
    if (!profile.phone?.trim()) errors.phone = 'Phone is required';
    if (!profile.location?.trim()) errors.location = 'Location is required';
    if (!profile.profileImage) errors.profileImage = 'Profile image is required';
    if (profile.skills?.length === 0) errors.skills = 'Add at least one skill';
    if (profile.experience?.length === 0) errors.experience = 'Add at least one experience';
    if (profile.education?.length === 0) errors.education = 'Add at least one education';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmitApi = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      setSubmissionStatus('Please fix form errors');
      return;
    }
    try {
      const res = await fetch('/api/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profile)
      });
      const result = await res.json();
      if (res.ok) {
        setSubmissionStatus('Profile submitted successfully!');
        router.push('/dashboard');
      } else {
        setSubmissionStatus(result.message || 'Something went wrong');
      }
    } catch (err) {
      setSubmissionStatus('Network error');
    }
  };


  return (
    <div className="min-h-screen flex items-center  justify-center p-4">

      
      <div className="w-full max-w-6xl rounded-3xl bg-[#25232a] shadow-2xl overflow-hidden transform transition-all duration-300 hover:scale-[1.01]">
        {/* Animated Gradient Header */}
        <div className="relative  bg-[#8771d5] p-4 text-center overflow-hidden">
          <div className="absolute inset-0  opacity-75 animate-pulse"></div>
          <div className="relative z-10">
            <h1 className="text-3xl font-bold text-white drop-shadow-lg">
              Create Your Profile
            </h1>
            <p className="text-purple-100 mt-3 text-sm tracking-wide">
              Showcase your professional journey
            </p>
          </div>
        </div>

        {/* Form Container */}
        <form onSubmit={handleSubmitApi} className="p-4 space-y-8">
          {/* Profile Image Upload */}
          <div className="flex justify-center mb-6">
            <div className="relative group">
              <input 
                type="file" 
                id="profileImage"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
              <label 
                htmlFor="profileImage" 
                className="cursor-pointer block"
              >
                {profileImage ? (
                  <div className="relative">
                    <img 
                      src={profileImage} 
                      alt="Profile" 
                      className="w-36 h-36 rounded-full object-cover border-4 border-white shadow-lg group-hover:scale-105 transition-transform"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 rounded-full transition-all flex items-center justify-center">
                      <ImagePlus className="text-white opacity-0 group-hover:opacity-100 transition-opacity" size={40} />
                    </div>
                  </div>
                ) : (
                  <div className="w-36 h-36 rounded-full bg-gradient-to-br from-purple-100 to-purple-100 flex items-center justify-center border-4 border-purple-200 hover:scale-105 transition-transform">
                    <ImagePlus className="text-[#894cd1]" size={50} />
                  </div>
                )}
              </label>
            </div>
          </div>

  {/* Personal Information Section */}
  <div className="bg-[#3f3f3f] p-6 rounded-2xl shadow-md">
            <h2 className="text-xl font-semibold text-neutral-100 border-b-2 border-[#894cd1] pb-3 mb-6 flex items-center">
              <User className="mr-3 text-neutral-100" /> Personal Information
            </h2>
            
            <div className="grid md:grid-cols-2 rounded-full gap-6">
              <div>
                        <label htmlFor="fullName" className=" text-sm font-medium  text-neutral-100 mb-2 flex items-center">
                          Full Name *
                          {formErrors.fullName && (
                                    <AlertCircle className="ml-2 rounded-full text-red-500" size={16} />
                          )}
                        </label>
                        <div className="relative">
                          <input
                                    type="text"
                                    id="fullName"
                                    name="fullName"
                                    value={profile.fullName || ''}
                                    onChange={handleInputChange}
                                    className={`w-full px-4 py-3 border text-white rounded-2xl  bg-[#25232a] focus:outline-none focus:ring-2 transition-all 
                                      ${formErrors.fullName 
                                                ? 'border-red-300 focus:ring-red-300 bg-red-50' 
                                                : 'border-gray-300 focus:ring-[#894cd1] focus:border-[#894cd1]'}`}
                                    required
                                    placeholder="Enter your full name"
                          />
                          {profile.fullName && !formErrors.fullName && (
                                    <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500" size={20} />
                          )}
                        </div>
                        {formErrors.fullName && (
                  <p className="text-red-500 text-sm mt-1">{formErrors.fullName}</p>
                )}
              </div>
              
              <div>
                <label htmlFor="email" className=" text-sm font-medium text-neutral-100 mb-2 flex items-center">
                  Email *
                  {formErrors.email && (
                    <AlertCircle className="ml-2 text-red-500" size={16} />
                  )}
                </label>
                <div className="relative">
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={profile.email || ''}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 text-white border rounded-2xl  bg-[#25232a] focus:outline-none focus:ring-2 transition-all 
                      ${formErrors.email 
                        ? 'border-red-300 focus:ring-red-300 bg-red-50' 
                        : 'border-gray-300 focus:ring-[#894cd1] focus:border-[#894cd1]'}`}
                    required
                    placeholder="Enter your email"
                  />
                  {profile.email && !formErrors.email && (
                    <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500" size={20} />
                  )}
                </div>
                {formErrors.email && (
                  <p className="text-red-500 text-sm mt-1">{formErrors.email}</p>
                )}
              </div>
              <div>
                <label htmlFor="location" className=" text-sm font-medium text-neutral-100 mb-2 flex items-center">
                  location *
                  {formErrors.email && (
                    <AlertCircle className="ml-2 text-red-500" size={16} />
                  )}
                </label>
                <div className="relative">
                  <input
                    type="location"
                    id="location"
                    name="location"
                    value={profile.location || ''}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 text-white  border rounded-2xl  bg-[#25232a] focus:outline-none focus:ring-2 transition-all 
                      ${formErrors.location 
                        ? 'border-red-300 focus:ring-red-300 bg-red-50' 
                        : 'border-gray-300 focus:ring-[#894cd1] focus:border-[#894cd1]'}`}
                    required
                    placeholder="Enter your location"
                  />
                  {profile.location && !formErrors.location && (
                    <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500" size={20} />
                  )}
                </div>
                {formErrors.location && (
                  <p className="text-red-500 text-sm mt-1">{formErrors.location}</p>
                )}
              </div>
              <div>
                <label htmlFor="phone" className=" text-sm font-medium text-neutral-100 mb-2 flex items-center">
                  phone *
                  {formErrors.phone && (
                    <AlertCircle className="ml-2 text-red-500" size={16} />
                  )}
                </label>
                <div className="relative">
                  <input
                    type="phone"
                    id="phone"
                    name="phone"
                    value={profile.phone || ''}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 text-white border rounded-2xl  bg-[#25232a] focus:outline-none focus:ring-2 transition-all 
                      ${formErrors.phone 
                        ? 'border-red-300 focus:ring-red-300 bg-red-50' 
                        : 'border-gray-300 focus:ring-[#894cd1] focus:border-[#894cd1]'}`}
                    required
                    placeholder="Enter your phone"
                  />
                  {profile.phone && !formErrors.phone && (
                    <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500" size={20} />
                  )}
                </div>
                {formErrors.phone && (
                  <p className="text-red-500 text-sm mt-1">{formErrors.phone}</p>
                )}
              </div>
            </div>
            
            <div className="mt-6">
              <label htmlFor="bio" className="block text-sm font-medium text-neutral-100 mb-2">
                Bio *
              </label>
              <textarea
                id="bio"
                name="bio"
                value={profile.bio || ''}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-4 py-3 border text-white  bg-[#25232a] border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#894cd1] transition-all"
                placeholder="Tell us about yourself (optional)"
              />
            </div>
          </div>
            {/* Social Media Links Block */}
<div className="bg-[#3f3f3f] p-6 rounded-2xl shadow-md">
  <h2 className="text-xl font-semibold text-neutral-100 border-b-2 border-[#894cd1] pb-3 mb-6 flex items-center">
    <Globe className="mr-3" /> Social Media Links
  </h2>

  {/* LinkedIn */}
  <div className="mb-4">
    <label className="block text-white mb-1">LinkedIn *</label>
    <input
      type="text"
      value={profile.socialLinks?.linkedin || ''}
      onChange={(e) =>
        setProfile((prev) => ({
          ...prev,
          socialLinks: {
            ...prev.socialLinks,
            linkedin: e.target.value,
          },
        }))
      }
      placeholder="https://linkedin.com/in/yourname"
      className="w-full px-4 py-2 rounded-xl bg-[#25232a] text-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#894cd1]"
    />
  </div>

  {/* GitHub */}
  <div className="mb-4">
    <label className="block text-white mb-1">GitHub *</label>
    <input
      type="text"
      value={profile.socialLinks?.github || ''}
      onChange={(e) =>
        setProfile((prev) => ({
          ...prev,
          socialLinks: {
            ...prev.socialLinks,
            github: e.target.value,
          },
        }))
      }
      placeholder="https://github.com/yourusername"
      className="w-full px-4 py-2 rounded-xl bg-[#25232a] text-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#894cd1]"
    />
  </div>

  {/* Twitter */}
  <div className="mb-4">
    <label className="block text-white mb-1">Twitter *</label>
    <input
      type="text"
      value={profile.socialLinks?.twitter || ''}
      onChange={(e) =>
        setProfile((prev) => ({
          ...prev,
          socialLinks: {
            ...prev.socialLinks,
            twitter: e.target.value,
          },
        }))
      }
      placeholder="https://twitter.com/yourhandle"
      className="w-full px-4 py-2 rounded-xl bg-[#25232a] text-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#894cd1]"
    />
  </div>

  {/* Portfolio */}
  <div className="mb-2">
    <label className="block text-white mb-1">Portfolio *</label>
    <input
      type="text"
      value={profile.socialLinks?.portfolio || ''}
      onChange={(e) =>
        setProfile((prev) => ({
          ...prev,
          socialLinks: {
            ...prev.socialLinks,
            portfolio: e.target.value,
          },
        }))
      }
      placeholder="https://yourportfolio.com"
      className="w-full px-4 py-2 rounded-xl bg-[#25232a] text-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#894cd1]"
    />
  </div>
</div>

          {/* Rest of the form remains similar, with improved styling */}
          {/* Skills Section */}
          <div className="bg-[#3f3f3f]  p-6 rounded-2xl shadow-md">
            <h2 className="text-xl font-semibold text-neutral-100 border-b-2 border-[#894cd1] pb-3 mb-6 flex items-center">
              <Briefcase className="mr-3 text-neutral-100" /> Skills *
            </h2>
            
            <div className="flex mb-6">
              <input
                type="text"
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                className="flex-grow mr-3 px-4 py-3 border  bg-[#25232a] border-gray-300 text-white rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#894cd1] transition-all"
                placeholder="Add a skill"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addSkill();
                  }
                }}
              />
              <button
                type="button"
                onClick={addSkill}
                className="bg-[#894cd1] text-white py-2 px-4 rounded-br-2xl rounded-tl-2xl hover:bg-purple-700 transition-colors flex items-center justify-center"
              >
                <Plus size={24} />
              </button>
            </div>
            
            <div className="flex flex-wrap gap-3">
              {profile.skills?.map((skill) => (
                <div 
                  key={skill} 
                  className="flex items-center bg-purple-100 text-purple-800 px-4 py-2 rounded-xl text-sm group"
                >
                  {skill}
                  <button
                    type="button"
                    onClick={() => removeSkill(skill)}
                    className="ml-2 text-red-500 hover:text-red-700 opacity-70 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>
          {/* Experience Block */}
<div className="bg-[#3f3f3f] p-6 rounded-2xl shadow-md">
  <h2 className="text-xl font-semibold text-neutral-100 border-b-2 border-[#894cd1] pb-3 mb-6 flex items-center">
    <Briefcase className="mr-3" /> Experience *
  </h2>
  <div className="flex gap-3">
    <input
      type="text"
      value={newExperience}
      onChange={(e) => setNewExperience(e.target.value)}
      placeholder="Add experience..."
      className="flex-grow px-4 py-3 rounded-xl bg-[#25232a] text-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#894cd1]"
    />
    <button
      type="button"
      onClick={addExperience}
      className="bg-[#894cd1] px-4 py-2 rounded-br-2xl rounded-tl-2xl text-white hover:bg-purple-700 transition"
    >
      <Plus />
    </button>
  </div>
  <div className="flex flex-wrap gap-2 mt-4">
    {profile.experience?.map((exp, index) => (
      <div key={index} className="bg-[#25232a] text-white px-4 py-2 rounded-xl flex items-center gap-2 shadow">
        {exp}
        <button onClick={() => removeExperience(exp)} type="button">
          <Trash2 size={16} className="text-red-500 hover:scale-110 transition" />
        </button>
      </div>
    ))}
  </div>
</div>


{/* Education Block */}
<div className="bg-[#3f3f3f] p-6 rounded-2xl shadow-md">
  <h2 className="text-xl font-semibold text-neutral-100 border-b-2 border-[#894cd1] pb-3 mb-6 flex items-center">
    <GraduationCap className="mr-3" /> Education *
  </h2>
  <div className="flex gap-3">
    <input
      type="text"
      value={newEducation}
      onChange={(e) => setNewEducation(e.target.value)}
      placeholder="Add education..."
      className="flex-grow px-4 py-3 rounded-xl bg-[#25232a] text-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#894cd1]"
    />
    <button
      type="button"
      onClick={addEducation}
      className="bg-[#894cd1] px-4 py-2 rounded-br-2xl rounded-tl-2xl text-white hover:bg-purple-700 transition"
    >
      <Plus />
    </button>
  </div>
  <div className="flex flex-wrap gap-2 mt-4">
    {profile.education?.map((edu, index) => (
      <div key={index} className="bg-[#575b7a] text-white px-4 py-2 rounded-xl flex items-center gap-2 shadow">
        {edu}
        <button onClick={() => removeEducation(edu)} type="button">
          <Trash2 size={16} className="text-red-500 hover:scale-110 transition" />
        </button>
      </div>
    ))}
  </div>
</div>



          {/* Submit Button */}
          <div className="text-center mt-8">
            <button
              type="submit"
              className="bg-[#894cd1] text-white px-12 py-4 rounded-full text-lg font-semibold 
              hover:from-purple-700 hover:to-purple-700 transition-all transform hover:-translate-y-1 
              shadow-lg hover:shadow-xl active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
            >
              Create Profile
            </button>
          </div>
          {submissionStatus && (
        <div
          className={`p-4 mb-6 rounded-full text-center text-white ${
            submissionStatus.includes('successfully') ? 'bg-green-500' : 'bg-red-500'
          }`}
        >
          {submissionStatus}
        </div>
      )}
        </form>
      </div>
    </div>
  );
};

export default ProfileCreationForm;
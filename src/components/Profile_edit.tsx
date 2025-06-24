'use client';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import EditableField from '@/components/EditableField';
import axios from 'axios';
import { Loader, Camera, Trash2, User, Mail, Phone, MapPin, Linkedin, Github, Twitter, Globe, Award, Briefcase, GraduationCap, Sparkles } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface Profile {
  _id?: string;
  fullName?: string;
  email?: string;
  bio?: string;
  profileImage?: string;
  phone?: string;
  location?: string;
  socialLinks?: {
    linkedin?: string;
    github?: string;
    twitter?: string;
    portfolio?: string;
  };
  skills?: string[];
  experience?: string[];
  education?: string[];
}

const FieldWrapper = ({ children, loading, icon, title }: { children: React.ReactNode, loading?: boolean, icon?: React.ReactNode, title?: string }) => (
  <div className="relative group">
    <div className="absolute inset-0 bg-gradient-to-r from-[#894cd1]/10 to-purple-600/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-500 blur-xl"></div>
    <div className="relative bg-zinc-800/60 backdrop-blur-sm border border-zinc-700/50 rounded-2xl p-6 hover:border-[#894cd1]/30 transition-all duration-300 hover:shadow-lg hover:shadow-[#894cd1]/10">
      {title && (
        <div className="flex items-center gap-3 mb-4">
          {icon && (
            <div className="w-8 h-8 bg-gradient-to-br from-[#894cd1] to-purple-600 rounded-lg flex items-center justify-center shadow-lg">
              {icon}
            </div>
          )}
          <h4 className="text-sm font-medium text-zinc-300 uppercase tracking-wide">{title}</h4>
        </div>
      )}
      <div className="relative">
        {children}
        {loading && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <Loader className="animate-spin text-[#894cd1]" size={16} />
          </div>
        )}
      </div>
    </div>
  </div>
);

export default function EditProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [fieldLoading, setFieldLoading] = useState<Record<string, boolean>>({});
  const [imageUploading, setImageUploading] = useState(false);
  const [deletingProfile, setDeletingProfile] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(`/api/profile`);
        setProfile(res.data.profile);
      } catch (err) {
        console.error('Error fetching profile', err);
      }
    };

    fetchProfile();
  }, []);

  const handleSaveField = async (fieldKey: string, newValue: string | string[]) => {
    setFieldLoading(prev => ({ ...prev, [fieldKey]: true }));
    
    try {
      await axios.patch(`/api/profile`, {
        [fieldKey]: newValue,
      });

      if (fieldKey.startsWith('socialLinks.')) {
        const [, child] = fieldKey.split('.');
        setProfile(prev =>
          prev
            ? {
                ...prev,
                socialLinks: {
                  ...prev.socialLinks,
                  [child]: newValue,
                },
              }
            : prev
        );
      } else {
        setProfile(prev => (prev ? { ...prev, [fieldKey]: newValue } : prev));
      }
    } catch (err) {
      console.error('Error updating field', err);
    } finally {
      setFieldLoading(prev => ({ ...prev, [fieldKey]: false }));
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImageUploading(true);
    
    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64Image = reader.result;
      await handleSaveField('profileImage', base64Image as string);
      setImageUploading(false);
    };

    reader.readAsDataURL(file);
  };

  const handleDeleteProfile = async () => {
    const confirmed = confirm('Are you sure you want to delete your profile? This action cannot be undone.');
    if (!confirmed) return;

    setDeletingProfile(true);
    
    try {
      await axios.delete(`/api/profile`);
      alert('Profile deleted successfully.');
      router.push('/');
    } catch (err) {
      console.error('Error deleting profile:', err);
      alert('Failed to delete profile.');
    } finally {
      setDeletingProfile(false);
    }
  };

  if (!profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center">
        <div className="text-center bg-zinc-800/50 backdrop-blur-lg rounded-3xl p-12 border border-zinc-700 max-w-md">
          <div className="w-16 h-16 bg-gradient-to-br from-[#894cd1] to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <User className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">No Profile Found</h2>
          <p className="text-zinc-400">Create your profile to get started on your journey</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black relative overflow-hidden">
      {/* Enhanced Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-[#894cd1]/20 to-purple-600/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-br from-purple-600/10 to-[#894cd1]/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-[#894cd1]/5 rounded-full blur-3xl animate-pulse delay-2000"></div>
        
        {/* Floating particles */}
        <div className="absolute top-20 left-10 w-2 h-2 bg-[#894cd1]/30 rounded-full animate-ping delay-300"></div>
        <div className="absolute top-40 right-20 w-1 h-1 bg-purple-400/40 rounded-full animate-ping delay-700"></div>
        <div className="absolute bottom-32 left-1/4 w-1.5 h-1.5 bg-[#894cd1]/25 rounded-full animate-ping delay-1100"></div>
      </div>

      <div className="relative py-8 px-4">
        <div className="max-w-5xl mx-auto">
          {/* Stunning Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-[#894cd1]/10 border border-[#894cd1]/20 rounded-full px-6 py-2 mb-6">
              <Sparkles className="w-4 h-4 text-[#894cd1]" />
              <span className="text-[#894cd1] text-sm font-medium">Profile Management</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-white via-zinc-200 to-zinc-400 bg-clip-text text-transparent mb-4">
              Edit Your Profile
            </h1>
            <p className="text-xl text-zinc-400 max-w-2xl mx-auto leading-relaxed">
              Craft your digital identity with precision and style. Every detail matters in your professional journey.
            </p>
          </div>

          {/* Main Profile Container */}
          <div className="bg-zinc-900/40 backdrop-blur-2xl border border-zinc-800/50 rounded-3xl overflow-hidden shadow-2xl">
            {/* Hero Profile Section */}
            <div className="relative bg-gradient-to-r from-[#894cd1]/20 via-purple-600/15 to-[#894cd1]/20 p-12 border-b border-zinc-800/50">
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/20"></div>
              
              <div className="relative flex flex-col lg:flex-row items-center gap-8">
                {/* Enhanced Profile Image */}
                <div className="relative group">
                  <div className="absolute -inset-4 bg-gradient-to-r from-[#894cd1] to-purple-600 rounded-full opacity-20 blur-xl group-hover:opacity-30 transition-all duration-500"></div>
                  <div className="relative w-40 h-40 rounded-full overflow-hidden border-4 border-[#894cd1]/50 shadow-2xl">
                    <Image
                      src={profile.profileImage || '/default-avatar.png'}
                      alt="Profile"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    {imageUploading && (
                      <div className="absolute inset-0 bg-black/80 flex items-center justify-center">
                        <div className="text-center">
                          <Loader className="animate-spin text-[#894cd1] mx-auto mb-2" size={24} />
                          <p className="text-xs text-white">Uploading...</p>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {/* Upload Overlay */}
                  <div className="absolute inset-0 bg-black/60 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 cursor-pointer">
                    <label htmlFor="profileImageUpload" className="cursor-pointer text-center">
                      <Camera className="w-8 h-8 text-white mx-auto mb-1" />
                      <span className="text-xs text-white font-medium">Change Photo</span>
                    </label>
                    <input 
                      type="file" 
                      id="profileImageUpload" 
                      accept="image/*" 
                      onChange={handleImageUpload} 
                      className="hidden"
                      disabled={imageUploading}
                    />
                  </div>
                </div>

                {/* Profile Info */}
                <div className="text-center lg:text-left flex-1">
                  <h2 className="text-4xl font-bold text-white mb-2">
                    {profile.fullName || 'Your Name'}
                  </h2>
                  <p className="text-zinc-300 text-lg mb-4">{profile.email}</p>
                  {profile.bio && (
                    <p className="text-zinc-400 max-w-2xl leading-relaxed">{profile.bio}</p>
                  )}
                  {profile.location && (
                    <div className="flex items-center gap-2 justify-center lg:justify-start mt-4">
                      <MapPin className="w-4 h-4 text-[#894cd1]" />
                      <span className="text-zinc-300">{profile.location}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Form Sections */}
            <div className="p-8 md:p-12 space-y-12">
              {/* Personal Information Section */}
              <section>
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#894cd1] to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                    <User className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white">Personal Information</h3>
                    <p className="text-zinc-400">Your basic details and contact information</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <FieldWrapper loading={fieldLoading.fullName} icon={<User className="w-4 h-4 text-white" />} title="Full Name">
                    <EditableField 
                      label="Full Name" 
                      fieldKey="fullName" 
                      value={profile.fullName} 
                      onSave={handleSaveField}
                    />
                  </FieldWrapper>
                  
                  <FieldWrapper loading={fieldLoading.phone} icon={<Phone className="w-4 h-4 text-white" />} title="Phone">
                    <EditableField 
                      label="Phone" 
                      fieldKey="phone" 
                      value={profile.phone} 
                      onSave={handleSaveField}
                    />
                  </FieldWrapper>
                  
                  <FieldWrapper loading={fieldLoading.location} icon={<MapPin className="w-4 h-4 text-white" />} title="Location">
                    <EditableField 
                      label="Location" 
                      fieldKey="location" 
                      value={profile.location} 
                      onSave={handleSaveField}
                    />
                  </FieldWrapper>
                  
                  <FieldWrapper loading={fieldLoading.bio} icon={<Mail className="w-4 h-4 text-white" />} title="Bio">
                    <EditableField 
                      label="Bio" 
                      fieldKey="bio" 
                      value={profile.bio} 
                      onSave={handleSaveField}
                    />
                  </FieldWrapper>
                </div>
              </section>

              {/* Social Links Section */}
              <section>
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#894cd1] to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                    <Globe className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white">Social Presence</h3>
                    <p className="text-zinc-400">Connect your professional and social profiles</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <FieldWrapper loading={fieldLoading['socialLinks.linkedin']} icon={<Linkedin className="w-4 h-4 text-white" />} title="LinkedIn">
                    <EditableField 
                      label="LinkedIn" 
                      fieldKey="socialLinks.linkedin" 
                      value={profile.socialLinks?.linkedin} 
                      onSave={handleSaveField}
                    />
                  </FieldWrapper>
                  
                  <FieldWrapper loading={fieldLoading['socialLinks.github']} icon={<Github className="w-4 h-4 text-white" />} title="GitHub">
                    <EditableField 
                      label="GitHub" 
                      fieldKey="socialLinks.github" 
                      value={profile.socialLinks?.github} 
                      onSave={handleSaveField}
                    />
                  </FieldWrapper>
                  
                  <FieldWrapper loading={fieldLoading['socialLinks.twitter']} icon={<Twitter className="w-4 h-4 text-white" />} title="Twitter">
                    <EditableField 
                      label="Twitter" 
                      fieldKey="socialLinks.twitter" 
                      value={profile.socialLinks?.twitter} 
                      onSave={handleSaveField}
                    />
                  </FieldWrapper>
                  
                  <FieldWrapper loading={fieldLoading['socialLinks.portfolio']} icon={<Globe className="w-4 h-4 text-white" />} title="Portfolio">
                    <EditableField 
                      label="Portfolio" 
                      fieldKey="socialLinks.portfolio" 
                      value={profile.socialLinks?.portfolio} 
                      onSave={handleSaveField}
                    />
                  </FieldWrapper>
                </div>
              </section>

              {/* Professional Information Section */}
              <section>
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#894cd1] to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                    <Briefcase className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white">Professional Journey</h3>
                    <p className="text-zinc-400">Showcase your skills, experience, and education</p>
                  </div>
                </div>
                
                <div className="space-y-6">
                  <FieldWrapper loading={fieldLoading.skills} icon={<Award className="w-4 h-4 text-white" />} title="Skills & Expertise">
                    <EditableField
                      label="Skills (comma separated)"
                      fieldKey="skills"
                      value={profile.skills?.join(', ')}
                      onSave={(key, val) => handleSaveField(key, (val as string).split(',').map(s => s.trim()))}
                    />
                  </FieldWrapper>
                  
                  <FieldWrapper loading={fieldLoading.experience} icon={<Briefcase className="w-4 h-4 text-white" />} title="Work Experience">
                    <EditableField
                      label="Experience (comma separated)"
                      fieldKey="experience"
                      value={profile.experience?.join(', ')}
                      onSave={(key, val) => handleSaveField(key, (val as string).split(',').map(s => s.trim()))}
                    />
                  </FieldWrapper>
                  
                  <FieldWrapper loading={fieldLoading.education} icon={<GraduationCap className="w-4 h-4 text-white" />} title="Education">
                    <EditableField
                      label="Education (comma separated)"
                      fieldKey="education"
                      value={profile.education?.join(', ')}
                      onSave={(key, val) => handleSaveField(key, (val as string).split(',').map(s => s.trim()))}
                    />
                  </FieldWrapper>
                </div>
              </section>

              {/* Enhanced Danger Zone */}
              <section className="pt-8">
                <div className="bg-gradient-to-r from-red-950/30 to-red-900/20 border border-red-800/30 rounded-3xl p-8 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-red-600/5 to-transparent"></div>
                  <div className="relative">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-12 h-12 bg-gradient-to-br from-red-600 to-red-700 rounded-2xl flex items-center justify-center shadow-lg">
                        <Trash2 className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-red-400">Danger Zone</h3>
                        <p className="text-red-300/80">Irreversible actions require careful consideration</p>
                      </div>
                    </div>
                    
                    <div className="bg-red-950/20 border border-red-800/20 rounded-2xl p-6 mb-6">
                      <p className="text-red-200 leading-relaxed">
                        Once you delete your profile, there is no going back. Please be certain about this action. 
                        All your data, connections, and history will be permanently removed from our systems.
                      </p>
                    </div>
                    
                    <button 
                      onClick={handleDeleteProfile} 
                      disabled={deletingProfile}
                      className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-4 px-8 rounded-2xl transition-all duration-300 flex items-center gap-3 shadow-xl hover:shadow-red-500/25 transform hover:scale-105 disabled:transform-none"
                    >
                      {deletingProfile ? (
                        <>
                          <Loader className="animate-spin" size={20} />
                          <span>Deleting Profile...</span>
                        </>
                      ) : (
                        <>
                          <Trash2 size={20} />
                          <span>Delete Profile Forever</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
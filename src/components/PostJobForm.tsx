'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { XCircle, Calendar, MapPin, Briefcase, DollarSign, Building, Clock } from 'lucide-react';
interface FormData {
  userId?: string;  
  email?: string; // Optional, if you want to include it                
  title: string;
  company: string;
  location: string;
  type: string;
  salary: string;
  description: string;
  requirements: string;
  benefits: string;
  applicationDeadline: string;
  experienceLevel: string;
  remoteOption: string;
  experience: string;
  createdAt?: Date;
}

interface FormErrors {
  [key: string]: string | null;
}

const PostJobForm = () => {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [formData, setFormData] = useState<FormData>({
    email: '',
    title: '',
    company: '',
    location: '',
    type: 'Full-time',
    salary: '',
    description: '',
    requirements: '',
    benefits: '',
    applicationDeadline: '',
    experienceLevel: 'Entry-level',
    remoteOption: 'Office-based',
    experience: 'Fresher',
    createdAt: new Date(),
  });

  const jobTypes = ['Full-time', 'Part-time', 'Contract', 'Freelance', 'Internship'];
  const experienceLevels = ['Entry-level', 'Mid-level', 'Senior', 'Executive', 'Internship'];
  const remoteOptions = ['Office-based', 'Remote', 'Hybrid'];
  const experience = ['Fresher', '1-3 years', '3+ years'];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error for this field when user types
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    const requiredFields = ['title', 'company', 'location', 'description'];
    
    requiredFields.forEach(field => {
      const value = formData[field as keyof FormData];
      if (typeof value !== 'string' || !value.trim()) {
        newErrors[field] = `${field.charAt(0).toUpperCase() + field.slice(1)} is required`;
      }
    });

    if (formData.description.trim().length < 50) {
      newErrors.description = 'Description should be at least 50 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);

    try {
      const response = await fetch('/api/Jobs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        // Show success toast/notification
// Show success toast/notification
const toast = document.createElement('div');
toast.textContent = 'Job posted successfully!';
toast.className =
            'fixed top-6 right-6 z-50 bg-green-700 text-white px-6 py-3 rounded-lg shadow-lg animate-fade-in';
document.body.appendChild(toast);

setTimeout(() => {
            toast.classList.add('animate-fade-out');
            setTimeout(() => {
                        document.body.removeChild(toast);
                        router.push('/dashboard');
            }, 400);
}, 1800);
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to post job');
      }
    } catch (error) {
      console.error('Error posting job:', error);
      setErrors({ form: (error as Error).message || 'Failed to post job. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = (): void => {
    if (confirm('Are you sure you want to cancel? Your changes will be lost.')) {
      router.back();
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-8 mb-16">
      <div className="bg-zinc-900 rounded-xl shadow-xl p-8 border border-zinc-800">
        <h1 className="text-3xl font-bold mb-2 text-white">Post a New Job</h1>
        <p className="text-zinc-400 mb-8">Fill in the details below to create your job listing</p>
        
        {errors.form && (
          <div className="bg-red-900/30 border border-red-500 text-red-200 px-4 py-3 rounded flex items-center mb-6">
            <XCircle className="h-5 w-5 mr-2" />
            <span>{errors.form}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Basic Info Section */}
            <div className="space-y-6 md:col-span-2">
              <h2 className="text-xl font-semibold text-zinc-200 border-b border-zinc-700 pb-2">Basic Information</h2>
              
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-zinc-300 mb-1">
                  Job Title *
                </label>
                <div className="relative">
                  <Briefcase className="absolute left-3 top-3 h-5 w-5 text-purple-700" />
                  <input
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="e.g. Frontend Developer"
                    className={`w-full pl-10 pr-3 py-2 text-white bg-zinc-800 border ${errors.title ? 'border-red-500' : 'border-zinc-700'} rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent`}
                  />
                </div>
                {errors.title && <p className="mt-1 text-sm text-red-500">{errors.title}</p>}
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-zinc-300 mb-1">
                  email *
                </label>
                <div className="relative">
                  <Briefcase className="absolute left-3 top-3 h-5 w-5 text-purple-700" />
                  <input
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="e.g. Frontend Developer"
                    className={`w-full pl-10 pr-3 py-2 text-white bg-zinc-800 border ${errors.email ? 'border-red-500' : 'border-zinc-700'} rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent`}
                  />
                </div>
                {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="company" className="block text-sm font-medium text-zinc-300 mb-1">
                    Company Name *
                  </label>
                  <div className="relative">
                    <Building className="absolute left-3 top-3 h-5 w-5 text-purple-700" />
                    <input
                      id="company"
                      name="company"
                      value={formData.company}
                      onChange={handleChange}
                      placeholder="e.g. Tech Innovations Inc."
                      className={`w-full pl-10 pr-3 py-2 text-white bg-zinc-800 border ${errors.company ? 'border-red-500' : 'border-zinc-700'} rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent`}
                    />
                  </div>
                  {errors.company && <p className="mt-1 text-sm text-red-500">{errors.company}</p>}
                </div>
                
                <div>
                  <label htmlFor="location" className="block text-sm font-medium text-zinc-300 mb-1">
                    Location *
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-5 w-5 text-purple-700" />
                    <input
                      id="location"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      placeholder="e.g. Mumbai, India"
                      className={`w-full pl-10 pr-3 py-2 text-white bg-zinc-800 border ${errors.location ? 'border-red-500' : 'border-zinc-700'} rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent`}
                    />
                  </div>
                  {errors.location && <p className="mt-1 text-sm text-red-500">{errors.location}</p>}
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label htmlFor="type" className="block text-sm font-medium text-zinc-300 mb-1">
                    Job Type
                  </label>
                  <select
                    id="type"
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    className="w-full py-2 px-3 text-white bg-zinc-800 border border-zinc-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    {jobTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label htmlFor="experienceLevel" className="block text-sm font-medium text-zinc-300 mb-1">
                    Experience Level
                  </label>
                  <select
                    id="experienceLevel"
                    name="experienceLevel"
                    value={formData.experienceLevel}
                    onChange={handleChange}
                    className="w-full py-2 px-3 text-white bg-zinc-800 border border-zinc-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    {experienceLevels.map(level => (
                      <option key={level} value={level}>{level}</option>
                    ))}
                  </select>
                </div>
                <div>
                        <label htmlFor="experience" className="block text-sm font-medium text-zinc-300 mb-1">
                          Experience
                        </label>
                        <select
                          id="experience"
                          name="experience"
                          value={formData.experience}
                          onChange={handleChange}
                          className="w-full py-2 px-3 text-white bg-zinc-800 border border-zinc-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        >
                          {experience.map(exp => (
                            <option key={exp} value={exp}>{exp}</option>
                          ))}
                        </select>
                </div>
                <div>
                  <label htmlFor="remoteOption" className="block text-sm font-medium text-zinc-300 mb-1">
                    Work Setting
                  </label>
                  <select
                    id="remoteOption"
                    name="remoteOption"
                    value={formData.remoteOption}
                    onChange={handleChange}
                    className="w-full py-2 px-3 text-white bg-zinc-800 border border-zinc-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    {remoteOptions.map(option => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="salary" className="block text-sm font-medium text-zinc-300 mb-1">
                    Salary Range
                  </label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-3 h-5 w-5 text-purple-700" />
                    <input
                      id="salary"
                      name="salary"
                      value={formData.salary}
                      onChange={handleChange}
                      placeholder="e.g. ₹10,00,000 - ₹15,00,000 per year"
                      className="w-full pl-10 pr-3 py-2 text-white bg-zinc-800 border border-zinc-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="applicationDeadline" className="block text-sm font-medium text-zinc-300 mb-1">
                    Application Deadline
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-3 h-5 w-5 text-purple-700" />
                    <input
                      id="applicationDeadline"
                      name="applicationDeadline"
                      type="date"
                      value={formData.applicationDeadline}
                      onChange={handleChange}
                      className="w-full pl-10 pr-3 py-2 text-white bg-zinc-800 border border-zinc-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>
            </div>
            
            {/* Job Details Section */}
            <div className="space-y-6 md:col-span-2">
              <h2 className="text-xl font-semibold text-zinc-200 border-b border-zinc-700 pb-2">Job Details</h2>
              
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-zinc-300 mb-1">
                  Job Description *
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={5}
                  placeholder="Provide a detailed description of the job role, responsibilities, and day-to-day activities"
                  className={`w-full p-3 text-white bg-zinc-800 border ${errors.description ? 'border-red-500' : 'border-zinc-700'} rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent`}
                />
                <p className="mt-1 text-sm text-purple-700">
                  Characters: {formData.description.length}/2000
                </p>
                {errors.description && <p className="mt-1 text-sm text-red-500">{errors.description}</p>}
              </div>
              
              <div>
                <label htmlFor="requirements" className="block text-sm font-medium text-zinc-300 mb-1">
                  Requirements & Qualifications
                </label>
                <textarea
                  id="requirements"
                  name="requirements"
                  value={formData.requirements}
                  onChange={handleChange}
                  rows={4}
                  placeholder="List required skills, education, certifications, and experience"
                  className="w-full p-3 text-white bg-zinc-800 border border-zinc-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label htmlFor="benefits" className="block text-sm font-medium text-zinc-300 mb-1">
                  Benefits & Perks
                </label>
                <textarea
                  id="benefits"
                  name="benefits"
                  value={formData.benefits}
                  onChange={handleChange}
                  rows={3}
                  placeholder="Describe the benefits package, work environment, growth opportunities, etc."
                  className="w-full p-3 text-white bg-zinc-800 border border-zinc-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>
          
          <div className="pt-6 border-t border-zinc-800 flex justify-between">
            <button
              type="button"
              onClick={handleCancel}
              className="px-6 py-2 border border-zinc-600 rounded-lg text-zinc-300 hover text-white:bg-zinc-800 transition"
            >
              Cancel
            </button>
            
            <div className="space-x-4">
              
              <button
                type="submit"
                disabled={loading}
                className="px-8 py-2 bg-purple-600 hover:bg-purple-700 rounded-tr-2xl rounded-b-lg font-medium text-white transition flex items-center disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <Clock className="animate-spin h-4 w-4 mr-2" />
                    Posting...
                  </>
                ) : (
                  'Post Job'
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PostJobForm;
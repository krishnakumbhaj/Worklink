'use client';

import React, { useEffect, useState } from 'react';
import { Briefcase, MapPin, CalendarDays, DollarSign, Building, Award, X, Eye, Clock, Users, ChevronRight } from 'lucide-react';
import axios from 'axios';

interface Job {
  _id: string;
  userId: string;
  title: string;
  company: string;
  location: string;
  description: string;
  type: 'Full-time' | 'Part-time' | 'Contract' | 'Freelance' | 'Internship';
  salary?: string;
  requirements?: string;
  benefits?: string;
  applicationDeadline?: string;
  experienceLevel: 'Entry-level' | 'Mid-level' | 'Senior-level';
  remoteOption: 'Office-based' | 'Remote' | 'Hybrid';
  experience: 'Fresher' | '1-3 years' | '3+ years';
  createdAt: string;
}

const JobCard = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await axios.get('/api/Jobs');
        // Ensure the response data is an array and has the expected properties
        const jobsData = Array.isArray(response.data)
          ? response.data.filter(
              (job) =>
                job &&
                typeof job._id === 'string' &&
                typeof job.title === 'string' &&
                typeof job.company === 'string'
            )
          : [];
        setJobs(jobsData);
      } catch (error) {
        console.error('Failed to fetch jobs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  const handleApply = async (jobId: string) => {
    try {
      // Add your apply logic here
      // await axios.post('/api/jobs/apply', { jobId });
      console.log('Application submitted for job:', jobId);
    } catch (error) {
      console.error('Failed to submit application:', error);
    }
  };

  // Function to determine what color to use based on job type
  const getTypeColor = (type: Job['type']) => {
    switch (type) {
      case 'Full-time':
        return 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20';
      case 'Part-time':
        return 'bg-purple-500/10 text-purple-300 border-purple-500/20';
      case 'Contract':
        return 'bg-amber-500/10 text-amber-300 border-amber-500/20';
      case 'Freelance':
        return 'bg-cyan-500/10 text-cyan-300 border-cyan-500/20';
      case 'Internship':
        return 'bg-rose-500/10 text-rose-300 border-rose-500/20';
      default:
        return 'bg-slate-500/10 text-slate-300 border-slate-500/20';
    }
  };

  // Function to determine what color to use based on remote option
  const getRemoteColor = (option: Job['remoteOption']) => {
    switch (option) {
      case 'Remote':
        return 'bg-green-500/10 text-green-300 border-green-500/20';
      case 'Hybrid':
        return 'bg-blue-500/10 text-blue-300 border-blue-500/20';
      case 'Office-based':
        return 'bg-orange-500/10 text-orange-300 border-orange-500/20';
      default:
        return 'bg-slate-500/10 text-slate-300 border-slate-500/20';
    }
  };

  // Function to determine what color to use based on experience level
  const getExperienceColor = (level: Job['experienceLevel']) => {
    switch (level) {
      case 'Entry-level':
        return 'bg-indigo-500/10 text-indigo-300 border-indigo-500/20';
      case 'Mid-level':
        return 'bg-violet-500/10 text-violet-300 border-violet-500/20';
      case 'Senior-level':
        return 'bg-pink-500/10 text-pink-300 border-pink-500/20';
      default:
        return 'bg-slate-500/10 text-slate-300 border-slate-500/20';
    }
  };

  // Function to format the date in a more readable way
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const truncateText = (text: string, maxLength: number) => {
    return text && text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400"></div>
          <p className="text-gray-300 text-lg">Loading opportunities...</p>
        </div>
      </div>
    );
  }

  if (jobs.length === 0) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="bg-gray-900 rounded-xl p-8 max-w-md text-center border border-gray-800">
          <Briefcase className="w-16 h-16 text-gray-500 mb-4 mx-auto" />
          <p className="text-xl font-medium text-gray-200 mb-2">No jobs available at the moment</p>
          <p className="text-sm text-gray-400">Check back later for new opportunities</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <div className="bg-gray-900 border-b border-gray-800 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-5xl font-bold text-center bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent mb-4">
            Career Opportunities
          </h1>
          <p className="text-gray-400 text-center text-lg">Discover your next career move with exciting opportunities</p>
        </div>
      </div>

      {/* Jobs Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {jobs.map((job) => (
            <div
              key={job._id}
              className="bg-gray-900 rounded-2xl border border-gray-800 hover:border-gray-700 transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/5 overflow-hidden group hover:scale-[1.02]"
            >
              {/* Card Header */}
              <div className="p-6 pb-4">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h2 className="text-xl font-bold text-white group-hover:text-blue-300 transition-colors mb-2 line-clamp-2">
                      {job.title}
                    </h2>
                    <div className="flex items-center text-gray-300 mb-3">
                      <Building className="w-4 h-4 mr-2 text-blue-400" />
                      <span className="text-sm font-medium">{job.company}</span>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getTypeColor(job.type)}`}>
                    {job.type}
                  </span>
                </div>

                {/* Description with Read More */}
                <div className="mb-4">
                  <p className="text-gray-400 text-sm leading-relaxed">
                    {truncateText(job.description, 120)}
                    {job.description && job.description.length > 120 && (
                      <button
                        onClick={() => setSelectedJob(job)}
                        className="text-blue-400 hover:text-blue-300 ml-2 inline-flex items-center text-xs font-medium transition-colors"
                      >
                        Read more
                        <ChevronRight className="w-3 h-3 ml-1" />
                      </button>
                    )}
                  </p>
                </div>
              </div>

              {/* Card Body */}
              <div className="px-6 pb-4 space-y-3">
                <div className="flex items-center text-gray-300">
                  <MapPin className="w-4 h-4 mr-3 text-green-400" />
                  <span className="text-sm">{job.location}</span>
                </div>

                <div className="flex items-center text-gray-300">
                  <DollarSign className="w-4 h-4 mr-3 text-yellow-400" />
                  <span className="text-sm font-medium">{job.salary || 'Salary not specified'}</span>
                </div>

                <div className="flex items-center text-gray-300">
                  <Award className="w-4 h-4 mr-3 text-purple-400" />
                  <span className="text-sm">{job.experienceLevel}</span>
                </div>

                <div className="flex items-center text-gray-300">
                  <CalendarDays className="w-4 h-4 mr-3 text-orange-400" />
                  <span className="text-sm">Posted {formatDate(job.createdAt)}</span>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 pt-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getRemoteColor(job.remoteOption)}`}>
                    {job.remoteOption}
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getExperienceColor(job.experienceLevel)}`}>
                    {job.experience}
                  </span>
                </div>
              </div>

              {/* Card Footer */}
              <div className="p-6 pt-4 border-t border-gray-800">
                <div className="flex items-center justify-between">
                  {job.applicationDeadline && (
                    <div className="flex items-center text-gray-400 text-xs">
                      <Clock className="w-3 h-3 mr-1" />
                      <span>Deadline: {formatDate(job.applicationDeadline)}</span>
                    </div>
                  )}
                  <div className="flex gap-3 ml-auto">
                    <button
                      onClick={() => setSelectedJob(job)}
                      className="bg-gray-800 hover:bg-gray-700 text-gray-300 px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 border border-gray-700 hover:border-gray-600"
                    >
                      View Details
                    </button>
                    <button
                      onClick={() => handleApply(job._id)}
                      className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 shadow-lg hover:shadow-xl"
                    >
                      Apply Now
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Job Detail Modal */}
      {selectedJob && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-gray-900 rounded-2xl border border-gray-800 max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-8 border-b border-gray-800">
              <div className="flex-1">
                <h2 className="text-3xl font-bold text-white mb-2">{selectedJob.title}</h2>
                <div className="flex items-center text-gray-300">
                  <Building className="w-5 h-5 mr-2 text-blue-400" />
                  <span className="text-lg font-medium">{selectedJob.company}</span>
                </div>
              </div>
              <button
                onClick={() => setSelectedJob(null)}
                className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-gray-800 rounded-lg"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-8 space-y-8">
              {/* Job Description */}
              <div>
                <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                  <Eye className="w-5 h-5 mr-2 text-blue-400" />
                  Job Description
                </h3>
                <p className="text-gray-300 leading-relaxed text-base bg-gray-800/50 p-4 rounded-lg">
                  {selectedJob.description}
                </p>
              </div>

              {/* Job Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div className="flex items-start">
                    <MapPin className="w-5 h-5 mr-3 text-green-400 mt-1" />
                    <div>
                      <p className="text-sm text-gray-400 mb-1">Location</p>
                      <p className="font-semibold text-gray-200">{selectedJob.location}</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <DollarSign className="w-5 h-5 mr-3 text-yellow-400 mt-1" />
                    <div>
                      <p className="text-sm text-gray-400 mb-1">Salary</p>
                      <p className="font-semibold text-gray-200">{selectedJob.salary || 'Not specified'}</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <Award className="w-5 h-5 mr-3 text-purple-400 mt-1" />
                    <div>
                      <p className="text-sm text-gray-400 mb-1">Experience Level</p>
                      <p className="font-semibold text-gray-200">{selectedJob.experienceLevel}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="flex items-start">
                    <Briefcase className="w-5 h-5 mr-3 text-blue-400 mt-1" />
                    <div>
                      <p className="text-sm text-gray-400 mb-1">Job Type</p>
                      <p className="font-semibold text-gray-200">{selectedJob.type}</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <Users className="w-5 h-5 mr-3 text-orange-400 mt-1" />
                    <div>
                      <p className="text-sm text-gray-400 mb-1">Work Mode</p>
                      <p className="font-semibold text-gray-200">{selectedJob.remoteOption}</p>
                    </div>
                  </div>

                  {selectedJob.applicationDeadline && (
                    <div className="flex items-start">
                      <Clock className="w-5 h-5 mr-3 text-red-400 mt-1" />
                      <div>
                        <p className="text-sm text-gray-400 mb-1">Application Deadline</p>
                        <p className="font-semibold text-gray-200">{formatDate(selectedJob.applicationDeadline)}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Requirements */}
              {selectedJob.requirements && (
                <div>
                  <h3 className="text-xl font-semibold text-white mb-4">Requirements</h3>
                  <div className="bg-gray-800/50 p-4 rounded-lg">
                    <p className="text-gray-300 leading-relaxed">{selectedJob.requirements}</p>
                  </div>
                </div>
              )}

              {/* Benefits */}
              {selectedJob.benefits && (
                <div>
                  <h3 className="text-xl font-semibold text-white mb-4">Benefits</h3>
                  <div className="bg-gray-800/50 p-4 rounded-lg">
                    <p className="text-gray-300 leading-relaxed">{selectedJob.benefits}</p>
                  </div>
                </div>
              )}

              {/* Tags and Action */}
              <div className="flex items-center justify-between pt-6 border-t border-gray-800">
                <div className="flex flex-wrap gap-3">
                  <span className={`px-4 py-2 rounded-full text-sm font-medium border ${getTypeColor(selectedJob.type)}`}>
                    {selectedJob.type}
                  </span>
                  <span className={`px-4 py-2 rounded-full text-sm font-medium border ${getRemoteColor(selectedJob.remoteOption)}`}>
                    {selectedJob.remoteOption}
                  </span>
                  <span className={`px-4 py-2 rounded-full text-sm font-medium border ${getExperienceColor(selectedJob.experienceLevel)}`}>
                    {selectedJob.experience}
                  </span>
                </div>
                <button
                  onClick={() => {
                    handleApply(selectedJob._id);
                    setSelectedJob(null);
                  }}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 rounded-lg font-medium transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  Apply Now
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobCard;
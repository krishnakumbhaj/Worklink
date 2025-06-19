'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Loader, Trash2, MapPin, Clock, DollarSign, Building, Calendar, Users, Wifi, X, CheckCircle, AlertCircle } from 'lucide-react';

interface Job {
  _id: string;
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
}

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error';
}

export default function UserPostedJobs() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const showToast = (message: string, type: 'success' | 'error') => {
    const id = Date.now().toString();
    const toast = { id, message, type };
    setToasts(prev => [...prev, toast]);
    
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 5000);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const truncateText = (text: string, maxLength: number = 150) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  const openModal = (job: Job) => {
    setSelectedJob(job);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedJob(null);
    setIsModalOpen(false);
  };

  useEffect(() => {
    const fetchUserJobs = async () => {
      try {
        const res = await axios.get('/api/Jobs/user');
        setJobs(res.data);
      } catch (err) {
        console.error('Error fetching user jobs', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserJobs();
  }, []);

  const handleDelete = async (jobId: string) => {
    

    setDeletingId(jobId);
    try {
      await axios.delete(`/api/Jobs/user/${jobId}`);
      setJobs(prev => prev.filter(job => job._id !== jobId));
      showToast('Job deleted successfully!', 'success');
    } catch (err) {
      console.error('Error deleting job:', err);
      showToast('Failed to delete job. Please try again.', 'error');
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-zinc-900 via-zinc-800 to-purple-900 flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-12 h-12 text-[#894cd1] animate-spin mx-auto mb-4" />
          <p className="text-white text-lg">Loading your posted jobs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-900 via-zinc-800 to-purple-900 relative overflow-hidden">
      {/* Toast notifications */}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`flex items-center gap-3 px-6 py-4 rounded-xl backdrop-blur-sm border transition-all duration-300 transform translate-x-0 ${
              toast.type === 'success'
                ? 'bg-green-500/20 border-green-500/30 text-green-300'
                : 'bg-red-500/20 border-red-500/30 text-red-300'
            }`}
          >
            {toast.type === 'success' ? (
              <CheckCircle className="w-5 h-5" />
            ) : (
              <AlertCircle className="w-5 h-5" />
            )}
            <span className="font-medium">{toast.message}</span>
            <button
              onClick={() => removeToast(toast.id)}
              className="ml-2 hover:opacity-70 transition-opacity"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && selectedJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={closeModal}
          ></div>
          <div className="relative bg-zinc-900/95 backdrop-blur-sm border border-white/10 rounded-2xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
            
            <div className="mb-6">
              <h2 className="text-3xl font-bold text-white mb-2">{selectedJob.title}</h2>
              <div className="flex items-center gap-2 text-gray-300">
                <Building className="w-5 h-5 text-[#894cd1]" />
                <span className="text-lg font-medium">{selectedJob.company}</span>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-[#894cd1]" />
                  <div>
                    <p className="text-gray-400 text-sm">Location</p>
                    <p className="text-white font-medium">{selectedJob.location}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-[#894cd1]" />
                  <div>
                    <p className="text-gray-400 text-sm">Type</p>
                    <p className="text-white font-medium">{selectedJob.type}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <DollarSign className="w-5 h-5 text-[#894cd1]" />
                  <div>
                    <p className="text-gray-400 text-sm">Salary</p>
                    <p className="text-white font-medium">{selectedJob.salary}</p>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Users className="w-5 h-5 text-[#894cd1]" />
                  <div>
                    <p className="text-gray-400 text-sm">Experience Level</p>
                    <p className="text-white font-medium">{selectedJob.experienceLevel}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-[#894cd1]" />
                  <div>
                    <p className="text-gray-400 text-sm">Application Deadline</p>
                    <p className="text-white font-medium">{selectedJob.applicationDeadline}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Wifi className="w-5 h-5 text-[#894cd1]" />
                  <div>
                    <p className="text-gray-400 text-sm">Remote Option</p>
                    <p className="text-white font-medium">{selectedJob.remoteOption}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <h4 className="text-[#894cd1] font-semibold mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 bg-[#894cd1] rounded-full"></span>
                  Description
                </h4>
                <p className="text-gray-300 leading-relaxed">{selectedJob.description}</p>
              </div>

              <div>
                <h4 className="text-[#894cd1] font-semibold mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 bg-[#894cd1] rounded-full"></span>
                  Requirements
                </h4>
                <p className="text-gray-300 leading-relaxed">{selectedJob.requirements}</p>
              </div>

              <div>
                <h4 className="text-[#894cd1] font-semibold mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 bg-[#894cd1] rounded-full"></span>
                  Benefits
                </h4>
                <p className="text-gray-300 leading-relaxed">{selectedJob.benefits}</p>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Ambient background effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-[#894cd1] rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-600 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" style={{animationDelay: '1s'}}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#894cd1] rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse" style={{animationDelay: '0.5s'}}></div>
      </div>

      <div className="relative z-10 py-12 px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-4 bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
            Your Posted Jobs
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-[#894cd1] to-purple-400 mx-auto rounded-full"></div>
          <p className="text-gray-300 mt-4 text-lg">Manage and track your job postings</p>
        </div>

        {jobs.length === 0 ? (
          <div className="text-center">
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-12 max-w-md mx-auto">
              <div className="w-16 h-16 bg-[#894cd1]/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Building className="w-8 h-8 text-[#894cd1]" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">No Jobs Posted Yet</h3>
              <p className="text-gray-400">You haven&apos;t posted any jobs yet. Create your first job posting to get started!</p>
            </div>
          </div>
        ) : (
          <div className="max-w-6xl mx-auto">
            <div className="grid gap-8 lg:grid-cols-1">
              {jobs.map((job) => (
                <div
                  key={job._id}
                  className="group bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 hover:bg-white/10 hover:border-[#894cd1]/30 transition-all duration-500 hover:shadow-2xl hover:shadow-[#894cd1]/10 relative overflow-hidden"
                >
                  {/* Card gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-[#894cd1]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  
                  {/* Content */}
                  <div className="relative z-10">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-6">
                      <div className="flex-1">
                        <h2 className="text-3xl font-bold text-white mb-2 group-hover:text-[#894cd1] transition-colors duration-300">
                          {job.title}
                        </h2>
                        <div className="flex items-center gap-2 text-gray-300 mb-4">
                          <Building className="w-5 h-5 text-[#894cd1]" />
                          <span className="text-lg font-medium">{job.company}</span>
                        </div>
                      </div>
                      
                      {/* Action buttons */}
                      <div className="flex gap-3">
                       
                        <button
                          onClick={() => handleDelete(job._id)}
                          disabled={deletingId === job._id}
                          className="bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 text-red-400 hover:text-red-300 rounded-xl p-3 transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                          title="Delete Job"
                        >
                          {deletingId === job._id ? (
                            <Loader className="w-5 h-5 animate-spin" />
                          ) : (
                            <Trash2 className="w-5 h-5" />
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Job details grid */}
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                      <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                        <div className="flex items-center gap-3">
                          <MapPin className="w-5 h-5 text-[#894cd1]" />
                          <div>
                            <p className="text-gray-400 text-sm">Location</p>
                            <p className="text-white font-medium">{job.location}</p>
                          </div>
                        </div>
                      </div>

                      <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                        <div className="flex items-center gap-3">
                          <Clock className="w-5 h-5 text-[#894cd1]" />
                          <div>
                            <p className="text-gray-400 text-sm">Type</p>
                            <p className="text-white font-medium">{job.type}</p>
                          </div>
                        </div>
                      </div>

                      <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                        <div className="flex items-center gap-3">
                          <DollarSign className="w-5 h-5 text-[#894cd1]" />
                          <div>
                            <p className="text-gray-400 text-sm">Salary</p>
                            <p className="text-white font-medium">{job.salary}</p>
                          </div>
                        </div>
                      </div>

                      <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                        <div className="flex items-center gap-3">
                          <Users className="w-5 h-5 text-[#894cd1]" />
                          <div>
                            <p className="text-gray-400 text-sm">Experience</p>
                            <p className="text-white font-medium">{job.experienceLevel}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Additional info */}
                    <div className="grid md:grid-cols-2 gap-4 mb-6">
                      <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                        <div className="flex items-center gap-3 mb-2">
                          <Calendar className="w-5 h-5 text-[#894cd1]" />
                          <p className="text-gray-400 text-sm">Application Deadline</p>
                        </div>
                        <p className="text-white font-medium">{job.applicationDeadline}</p>
                      </div>

                      <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                        <div className="flex items-center gap-3 mb-2">
                          <Wifi className="w-5 h-5 text-[#894cd1]" />
                          <p className="text-gray-400 text-sm">Remote Option</p>
                        </div>
                        <p className="text-white font-medium">{job.remoteOption}</p>
                      </div>
                    </div>

                    {/* Expandable sections */}
                    <div className="space-y-4">
                      <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                        <h4 className="text-[#894cd1] font-semibold mb-3 flex items-center gap-2">
                          <span className="w-2 h-2 bg-[#894cd1] rounded-full"></span>
                          Description
                        </h4>
                        <p className="text-gray-300 leading-relaxed">
                          {truncateText(job.description)}
                        </p>
                        {job.description.length > 150 && (
                          <button
                            onClick={() => openModal(job)}
                            className="mt-3 text-[#894cd1] hover:text-purple-300 font-medium transition-colors duration-300"
                          >
                            Read more →
                          </button>
                        )}
                      </div>

                      <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                        <h4 className="text-[#894cd1] font-semibold mb-3 flex items-center gap-2">
                          <span className="w-2 h-2 bg-[#894cd1] rounded-full"></span>
                          Requirements
                        </h4>
                        <p className="text-gray-300 leading-relaxed">
                          {truncateText(job.requirements)}
                        </p>
                        {job.requirements.length > 150 && (
                          <button
                            onClick={() => openModal(job)}
                            className="mt-3 text-[#894cd1] hover:text-purple-300 font-medium transition-colors duration-300"
                          >
                            Read more →
                          </button>
                        )}
                      </div>

                      <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                        <h4 className="text-[#894cd1] font-semibold mb-3 flex items-center gap-2">
                          <span className="w-2 h-2 bg-[#894cd1] rounded-full"></span>
                          Benefits
                        </h4>
                        <p className="text-gray-300 leading-relaxed">
                          {truncateText(job.benefits)}
                        </p>
                        {job.benefits.length > 150 && (
                          <button
                            onClick={() => openModal(job)}
                            className="mt-3 text-[#894cd1] hover:text-purple-300 font-medium transition-colors duration-300"
                          >
                            Read more →
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
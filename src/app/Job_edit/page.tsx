'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Loader, Trash2, Edit3, Save, X, Eye, Calendar, MapPin, Building, DollarSign, Clock, Users, CheckCircle, AlertCircle } from 'lucide-react';

interface Job {
  _id: string;
  title: string;
  company: string;
  location: string;
  type: 'Full-time' | 'Part-time' | 'Contract' | 'Freelance' | 'Internship';
  salary?: string;
  description: string;
  requirements?: string;
  benefits?: string;
  applicationDeadline?: string;
  experienceLevel: 'Entry-level' | 'Mid-level' | 'Senior-level';
  remoteOption: 'Office-based' | 'Remote' | 'Hybrid';
  experience: 'Fresher' | '1-3 years' | '3+ years';
  createdAt: Date;
}

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error';
}

export default function UserPostedJobs() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchUserJobs = async () => {
      try {
        const res = await axios.get('/api/Jobs/user');
        setJobs(res.data);
      } catch (err) {
        console.error('Error fetching user jobs', err);
        showToast('Failed to load jobs', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchUserJobs();
  }, []);

  const showToast = (message: string, type: 'success' | 'error') => {
    const id = Math.random().toString(36).substr(2, 9);
    const newToast = { id, message, type };
    setToasts(prev => [...prev, newToast]);
    
    setTimeout(() => {
      setToasts(prev => prev.filter(toast => toast.id !== id));
    }, 4000);
  };

  const handleDelete = async (jobId: string) => {
    try {
      await axios.delete(`/api/Jobs/user/${jobId}`);
      setJobs(prev => prev.filter(job => job._id !== jobId));
      showToast('Job deleted successfully', 'success');
    } catch (err) {
      console.error('Error deleting job:', err);
      showToast('Failed to delete job', 'error');
    }
  };

  const handleSaveField = async (jobId: string, fieldKey: keyof Job, newValue: unknown) => {
    try {
      await axios.patch(`/api/Jobs/user/${jobId}`, {
        [fieldKey]: newValue,
      });
      
      setJobs(prev =>
        prev.map(job =>
          job._id === jobId ? { ...job, [fieldKey]: newValue } : job
        )
      );
      showToast('Field updated successfully', 'success');
    } catch (err) {
      console.error('Error updating field', err);
      showToast('Failed to update field', 'error');
    }
  };

  const openModal = (job: Job) => {
    setSelectedJob(job);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedJob(null);
  };

  return (
    <div className="min-h-screen bg-zinc-800 py-10 px-4 relative">
      {/* Toast Container */}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        {toasts.map(toast => (
          <div
            key={toast.id}
            className={`flex items-center gap-2 px-4 py-3 rounded-lg shadow-lg transform transition-all duration-300 animate-slide-in ${
              toast.type === 'success' 
                ? 'bg-green-600 text-white' 
                : 'bg-red-600 text-white'
            }`}
          >
            {toast.type === 'success' ? (
              <CheckCircle className="w-5 h-5 flex-shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
            )}
            <span className="font-medium">{toast.message}</span>
          </div>
        ))}
      </div>

      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-2 animate-fade-in">Your Posted Jobs</h1>
          <p className="text-zinc-300 text-lg animate-fade-in-delay">Manage and edit your job postings</p>
        </div>

        {loading ? (
          <div className="flex flex-col justify-center items-center h-64 text-white">
            <Loader className="animate-spin w-12 h-12 mb-4 text-[#894cd1]" />
            <p className="text-xl">Loading your jobs...</p>
          </div>
        ) : jobs.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-24 h-24 mx-auto mb-6 bg-[#894cd1] rounded-full flex items-center justify-center">
              <Building className="w-12 h-12  text-white" />
            </div>
            <p className="text-white text-xl mb-2">No jobs posted yet</p>
            <p className="text-zinc-400">Create your first job posting to get started</p>
          </div>
        ) : (
          <div className="grid gap-8">
            {jobs.map((job, index) => (
              <div 
                key={job._id} 
                className="bg-zinc-800 border border-zinc-800 rounded-2xl shadow-2xl text-white relative overflow-hidden transform transition-all duration-300 hover:scale-[1.02] hover:shadow-3xl animate-slide-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Header with gradient */}
                <div className="bg-gradient-to-r from-[#894cd1] to-[#9d5ce6] p-6 relative">
                  <button
                    onClick={() => handleDelete(job._id)}
                    className="absolute top-4 right-4 bg-red-500 hover:bg-red-600 text-white rounded-full p-2 transition-all duration-300 hover:scale-110 shadow-lg"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                  
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 bg-white bg-opacity-20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                      <Building className="w-8 h-8 text-white" />
                    </div>
                    <div className="flex-1">
                      <EditableText 
                        label="" 
                        value={job.title} 
                        onSave={(val) => handleSaveField(job._id, 'title', val)}
                        className="text-2xl font-bold mb-2"
                        placeholder="Job Title"
                      />
                      <EditableText 
                        label="" 
                        value={job.company} 
                        onSave={(val) => handleSaveField(job._id, 'company', val)}
                        className="text-lg opacity-90"
                        placeholder="Company Name"
                      />
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">
                  {/* Quick Info Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="flex items-center gap-3 p-3 bg-zinc-800 rounded-lg">
                      <MapPin className="w-5 h-5 text-[#894cd1] flex-shrink-0" />
                      <EditableText 
                        label="" 
                        value={job.location} 
                        onSave={(val) => handleSaveField(job._id, 'location', val)}
                        className="text-sm"
                        placeholder="Location"
                      />
                    </div>
                    
                    <div className="flex items-center gap-3 p-3 bg-zinc-800 rounded-lg">
                      <DollarSign className="w-5 h-5 text-[#894cd1] flex-shrink-0" />
                      <EditableText 
                        label="" 
                        value={job.salary || 'Not specified'} 
                        onSave={(val) => handleSaveField(job._id, 'salary', val)}
                        className="text-sm"
                        placeholder="Salary Range"
                      />
                    </div>
                    
                    <div className="flex items-center gap-3 p-3 bg-zinc-800 rounded-lg">
                      <Clock className="w-5 h-5 text-[#894cd1] flex-shrink-0" />
                      <EditableSelect
                        label=""
                        value={job.type}
                        options={['Full-time', 'Part-time', 'Contract', 'Freelance', 'Internship']}
                        onSave={(val) => handleSaveField(job._id, 'type', val)}
                        className="text-sm"
                      />
                    </div>
                    
                    <div className="flex items-center gap-3 p-3 bg-zinc-800 rounded-lg">
                      <Users className="w-5 h-5 text-[#894cd1] flex-shrink-0" />
                      <EditableSelect
                        label=""
                        value={job.experienceLevel}
                        options={['Entry-level', 'Mid-level', 'Senior-level']}
                        onSave={(val) => handleSaveField(job._id, 'experienceLevel', val)}
                        className="text-sm"
                      />
                    </div>
                  </div>

                  {/* Description */}
                    <div className="space-y-3">
                    <h3 className="text-lg font-semibold text-[#894cd1] flex items-center gap-2">
                      <Eye className="w-5 h-5" />
                      Description
                    </h3>
                    <div className="bg-zinc-800 rounded-lg p-4 overflow-x-auto">
                      {job.description.length > 200 ? (
                      <div>
                        <p className="text-zinc-300 leading-relaxed mb-3 break-words whitespace-pre-line max-w-full">
                        {job.description.substring(0, 200)}...
                        </p>
                        <button
                        onClick={() => openModal(job)}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-[#894cd1] hover:bg-[#763cc0] rounded-lg transition-all duration-300 hover:scale-105"
                        >
                        <Eye className="w-4 h-4" />
                        Read More
                        </button>
                      </div>
                      ) : (
                      <EditableText 
                        label="" 
                        value={job.description} 
                        onSave={(val) => handleSaveField(job._id, 'description', val)}
                        className="text-zinc-300 leading-relaxed break-words whitespace-pre-line max-w-full"
                        isTextarea={true}
                        placeholder="Job Description"
                      />
                      )}
                    </div>
                    </div>

                  {/* Additional Fields */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <EditableFieldWithIcon
                        icon={<Calendar className="w-5 h-5 text-[#894cd1]" />}
                        label="Application Deadline"
                        value={job.applicationDeadline || ''}
                        onSave={(val) => handleSaveField(job._id, 'applicationDeadline', val)}
                        placeholder="YYYY-MM-DD"
                      />
                      
                      <EditableSelectWithIcon
                        icon={<MapPin className="w-5 h-5 text-[#894cd1]" />}
                        label="Remote Option"
                        value={job.remoteOption}
                        options={['Office-based', 'Remote', 'Hybrid']}
                        onSave={(val) => handleSaveField(job._id, 'remoteOption', val)}
                      />
                    </div>
                    
                    <div className="space-y-4">
                      <EditableFieldWithIcon
                        icon={<Users className="w-5 h-5 text-[#894cd1]" />}
                        label="Requirements"
                        value={job.requirements || ''}
                        onSave={(val) => handleSaveField(job._id, 'requirements', val)}
                        isTextarea={true}
                        placeholder="Job requirements..."
                      />
                      
                      <EditableFieldWithIcon
                        icon={<CheckCircle className="w-5 h-5 text-[#894cd1]" />}
                        label="Benefits"
                        value={job.benefits || ''}
                        onSave={(val) => handleSaveField(job._id, 'benefits', val)}
                        isTextarea={true}
                        placeholder="Employee benefits..."
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && selectedJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm animate-fade-in"
            onClick={closeModal}
          ></div>
          <div className="relative bg-zinc-800 rounded-2xl p-6 max-w-2xl max-h-[80vh] overflow-y-auto m-4 shadow-2xl animate-scale-in border border-zinc-800">
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-zinc-400 hover:text-white transition-colors duration-300"
            >
              <X className="w-6 h-6" />
            </button>
            
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-white mb-2">{selectedJob.title}</h2>
              <p className="text-[#894cd1] text-lg">{selectedJob.company}</p>
            </div>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-[#894cd1] mb-2">Full Description</h3>
                <EditableText 
                  label="" 
                  value={selectedJob.description} 
                  onSave={(val) => handleSaveField(selectedJob._id, 'description', val)}
                  className="text-zinc-300 leading-relaxed"
                  isTextarea={true}
                  placeholder="Job Description"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes slide-in {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes fade-in-delay {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes scale-in {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        
        .animate-slide-in {
          animation: slide-in 0.3s ease-out;
        }
        
        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }
        
        .animate-fade-in-delay {
          animation: fade-in-delay 0.8s ease-out;
        }
        
        .animate-slide-up {
          animation: slide-up 0.6s ease-out;
        }
        
        .animate-scale-in {
          animation: scale-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}

// Enhanced Editable Text Component
function EditableText({ 
  label, 
  value, 
  onSave, 
  className = "", 
  isTextarea = false, 
  placeholder = "" 
}: { 
  label: string; 
  value: string; 
  onSave: (val: string) => void; 
  className?: string;
  isTextarea?: boolean;
  placeholder?: string;
}) {
  const [edit, setEdit] = useState(false);
  const [input, setInput] = useState(value);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    await onSave(input);
    setSaving(false);
    setEdit(false);
  };

  const handleCancel = () => {
    setInput(value);
    setEdit(false);
  };

  if (edit) {
    return (
      <div className={`space-y-2 ${className}`}>
        {label && <label className="font-semibold text-[#894cd1] block">{label}</label>}
        <div className="flex gap-2 items-start">
          {isTextarea ? (
            <textarea
              className="flex-1 bg-zinc-800 text-white p-3 rounded-lg border border-zinc-600 focus:border-[#894cd1] focus:outline-none resize-none"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={placeholder}
              rows={3}
            />
          ) : (
            <input
              className="flex-1 bg-zinc-800 text-white p-3 rounded-lg border border-zinc-600 focus:border-[#894cd1] focus:outline-none"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={placeholder}
            />
          )}
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              disabled={saving}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-lg transition-all duration-300 hover:scale-105 disabled:opacity-50 flex items-center gap-2"
            >
              {saving ? <Loader className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            </button>
            <button
              onClick={handleCancel}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-3 rounded-lg transition-all duration-300 hover:scale-105"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`group ${className}`}>
      {label && <label className="font-semibold text-[#894cd1] block mb-1">{label}</label>}
      <div className="flex items-center justify-between group-hover:bg-zinc-800 rounded-lg p-2 transition-all duration-300">
        <span className="flex-1">{value || placeholder}</span>
        <button
          onClick={() => setEdit(true)}
          className="opacity-0 group-hover:opacity-100 text-[#894cd1] hover:text-[#763cc0] transition-all duration-300 flex items-center gap-1"
        >
          <Edit3 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

// Enhanced Editable Select Component
function EditableSelect({ 
  label, 
  value, 
  options, 
  onSave, 
  className = "" 
}: { 
  label: string; 
  value: string; 
  options: string[]; 
  onSave: (val: string) => void; 
  className?: string;
}) {
  const [edit, setEdit] = useState(false);
  const [selected, setSelected] = useState(value);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    await onSave(selected);
    setSaving(false);
    setEdit(false);
  };

  const handleCancel = () => {
    setSelected(value);
    setEdit(false);
  };

  if (edit) {
    return (
      <div className={`space-y-2 ${className}`}>
        {label && <label className="font-semibold text-[#894cd1] block">{label}</label>}
        <div className="flex gap-2">
          <select
            className="flex-1 bg-zinc-800 text-white p-3 rounded-lg border border-zinc-600 focus:border-[#894cd1] focus:outline-none"
            value={selected}
            onChange={(e) => setSelected(e.target.value)}
          >
            {options.map(opt => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              disabled={saving}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-lg transition-all duration-300 hover:scale-105 disabled:opacity-50 flex items-center gap-2"
            >
              {saving ? <Loader className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            </button>
            <button
              onClick={handleCancel}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-3 rounded-lg transition-all duration-300 hover:scale-105"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`group ${className}`}>
      {label && <label className="font-semibold text-[#894cd1] block mb-1">{label}</label>}
      <div className="flex items-center justify-between group-hover:bg-zinc-800 rounded-lg p-2 transition-all duration-300">
        <span className="flex-1">{value}</span>
        <button
          onClick={() => setEdit(true)}
          className="opacity-0 group-hover:opacity-100 text-[#894cd1] hover:text-[#763cc0] transition-all duration-300 flex items-center gap-1"
        >
          <Edit3 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

// Field with Icon Components
function EditableFieldWithIcon({
  icon,
  label,
  value,
  onSave,
  isTextarea = false,
  placeholder = ""
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  onSave: (val: string) => void;
  isTextarea?: boolean;
  placeholder?: string;
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        {icon}
        <span className="font-semibold text-white">{label}</span>
      </div>
      <EditableText
        label=""
        value={value}
        onSave={onSave}
        isTextarea={isTextarea}
        placeholder={placeholder}
        className="ml-7"
      />
    </div>
  );
}

function EditableSelectWithIcon({
  icon,
  label,
  value,
  options,
  onSave
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  options: string[];
  onSave: (val: string) => void;
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        {icon}
        <span className="font-semibold text-white">{label}</span>
      </div>
      <EditableSelect
        label=""
        value={value}
        options={options}
        onSave={onSave}
        className="ml-7"
      />
    </div>
  );
}
'use client';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSession } from 'next-auth/react';

interface Project {
  _id: string;
  title: string;
  description: string;
  budget: string;
  category: string;
  skillsRequired: string[];
  deadline: string;
  status: string; // e.g. 'pending', 'confirmed', 'completed'
  confirm?: boolean; // freelancer confirmed or not
  selectedFreelancer?: string | null;
  userId: {
    username: string;
    email: string;
  };
}

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

interface ModalProject {
  title: string;
  description: string;
}

const Dev_listing_project = () => {
  const { data: session, status } = useSession();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [modalProject, setModalProject] = useState<ModalProject | null>(null);

  const addToast = (message: string, type: 'success' | 'error' | 'info') => {
    const id = Date.now().toString();
    const newToast = { id, message, type };
    setToasts(prev => [...prev, newToast]);
    
    // Auto remove toast after 5 seconds
    setTimeout(() => {
      setToasts(prev => prev.filter(toast => toast.id !== id));
    }, 5000);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  const truncateText = (text: string, maxLength: number = 120) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  const openModal = (project: Project) => {
    setModalProject({
      title: project.title,
      description: project.description
    });
  };

  const closeModal = () => {
    setModalProject(null);
  };

  useEffect(() => {
    const fetchProjects = async () => {
      if (!session?.user?.email) {
        setLoading(false);
        return;
      }
      try {
        const res = await axios.get(
          `/api/projects/freelancer?email=${encodeURIComponent(session.user.email)}`
        );
        setProjects(res.data);
      } catch (err) {
        console.error('Error fetching freelancer projects:', err);
        addToast('Failed to fetch projects', 'error');
      } finally {
        setLoading(false);
      }
    };

    if (status === 'authenticated') {
      fetchProjects();
    } else {
      setLoading(false);
    }
  }, [session, status]);

  const confirmProject = async (projectId: string, project: Project) => {
    if (!session?.user?.id) {
      addToast('You must be logged in', 'error');
      return;
    }
    setActionLoading(projectId);
    try {
      const res = await axios.put('/api/projects/confirm', {
        projectId,
        freelancerId: session.user.id,
      });
      addToast(res.data.message || 'Project confirmed successfully!', 'success');

      // ✅ Create the chat room immediately after confirmation
      await axios.post('/api/chat/create-room', {
        projectId: project._id
      }, {
        withCredentials: true
      });

      // Update frontend state
      setProjects((prev) =>
        prev.map((p) =>
          p._id === projectId
            ? { ...p, confirm: true, selectedFreelancer: session.user.id }
            : p
        )
      );

    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        addToast(err.response?.data?.message || 'Failed to confirm project', 'error');
      } else {
        addToast('Failed to confirm project', 'error');
      }
    } finally {
      setActionLoading(null);
    }
  };

  const withdrawConfirmation = async (projectId: string) => {
    if (!session?.user?.id) {
      addToast('You must be logged in', 'error');
      return;
    }
    setActionLoading(projectId);
    try {
      const res = await axios.put('/api/projects/withdraw', {
        projectId,
        freelancerId: session.user.id,
      });
      addToast(res.data.message || 'Proposal withdrawn successfully!', 'success');
      // Remove the project from the list after withdrawing (since backend deletes it)
      setProjects((prev) => prev.filter((p) => p._id !== projectId));
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        addToast(err.response?.data?.message || 'Failed to withdraw confirmation', 'error');
      } else {
        addToast('Failed to withdraw confirmation', 'error');
      }
    } finally {
      setActionLoading(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20';
      case 'confirmed':
        return 'text-green-400 bg-green-400/10 border-green-400/20';
      case 'completed':
        return 'text-purple-400 bg-purple-400/10 border-purple-400/20';
      default:
        return 'text-zinc-400 bg-zinc-400/10 border-zinc-400/20';
    }
  };

  const getToastStyles = (type: 'success' | 'error' | 'info') => {
    switch (type) {
      case 'success':
        return 'bg-green-500/90 border-green-400/50 text-white';
      case 'error':
        return 'bg-red-500/90 border-red-400/50 text-white';
      case 'info':
        return 'bg-purple-500/90 border-purple-400/50 text-white';
      default:
        return 'bg-zinc-500/90 border-zinc-400/50 text-white';
    }
  };

  const getToastIcon = (type: 'success' | 'error' | 'info') => {
    switch (type) {
      case 'success':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        );
      case 'error':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        );
      case 'info':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      default:
        return null;
    }
  };
 const LoadingOverlay = () => (
    <div className={`fixed inset-0 bg-[#121212] backdrop-blur-sm z-50 flex items-center justify-center transition-all duration-500`}>
      <div className="text-center">
        <div className="relative mb-6">
          {/* Animated circles */}
          <div className="w-20 h-20 mx-auto relative">
            <div className="absolute inset-0 border-4 border-purple-500/20 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-transparent border-t-purple-500 rounded-full animate-spin"></div>
            <div className="absolute inset-2 border-4 border-transparent border-t-purple-400 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '0.8s' }}></div>
          </div>
        </div>
        <div className="space-y-2">
          <p className="text-xl font-medium text-white">Loading...</p>
          <p className="text-purple-400 text-sm">Assigned Projects</p>
        </div>
        {/* Progress bar */}
        <div className="w-64 h-1 bg-zinc-800 rounded-full mt-6 mx-auto overflow-hidden">
          <div className="h-full bg-gradient-to-r from-purple-500 to-purple-400 rounded-full animate-pulse" style={{ width: '70%' }}></div>
        </div>
      </div>
    </div>
  );
  if (loading) {
    return (
      <LoadingOverlay />
    );
  }

  return (
    <div className="w-full overflow-y-auto bg-gradient-to-br  py-8 px-4 sm:px-6 lg:px-8">
      {/* Toast Notifications */}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`${getToastStyles(toast.type)} backdrop-blur-sm border rounded-xl px-6 py-4 shadow-2xl transform transition-all duration-500 ease-out animate-in slide-in-from-right-full`}
          >
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0">
                {getToastIcon(toast.type)}
              </div>
              <p className="text-sm font-medium flex-1">{toast.message}</p>
              <button
                onClick={() => removeToast(toast.id)}
                className="flex-shrink-0 ml-4 hover:bg-white/20 rounded-full p-1 transition-colors duration-200"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-10 opacity-0 animate-[fadeIn_0.8s_ease-out_forwards]">
          <h1 className="text-4xl md:text-4xl font-bold bg-gradient-to-r from-purple-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-5">
            Assigned Projects
          </h1>
          <div className="w-32 h-1 bg-gradient-to-r from-purple-400 to-purple-400 mx-auto rounded-full"></div>
        </div>

        {/* Projects Grid */}
        {projects.length === 0 ? (
          <div className="text-center py-20 opacity-0 animate-[fadeIn_0.8s_ease-out_forwards]">
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-r from-zinc-700 to-zinc-600 flex items-center justify-center">
              <svg className="w-12 h-12 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-2xl font-semibold text-zinc-300 mb-2">No Projects Yet</h3>
            <p className="text-zinc-500 text-lg">Your assigned projects will appear here once available.</p>
          </div>
        ) : (
          <div className="grid gap-8 md:gap-10">
            {projects.map((project, index) => (
              <div
                key={project._id}
                className="group relative bg-zinc-800/50 backdrop-blur-sm border border-zinc-700/50 rounded-2xl p-8 hover:bg-zinc-800/70 transition-all duration-500 hover:shadow-2xl hover:shadow-purple-500/10 opacity-0 translate-y-10"
                style={{ 
                  animation: `slideUp 0.6s ease-out ${index * 150}ms forwards`
                }}
              >
                {/* Gradient Border Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-purple-500/10 to-pink-500/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10"></div>
                
                {/* Project Header */}
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between mb-6">
                  <div className="flex-1">
                    <h2 className="text-2xl md:text-3xl font-bold text-white mb-3 group-hover:text-purple-400 transition-colors duration-300">
                      {project.title}
                    </h2>
                    <div className="text-zinc-300 text-lg leading-relaxed mb-4">
                      <p>{truncateText(project.description)}</p>
                      {project.description.length > 120 && (
                        <button
                          onClick={() => openModal(project)}
                          className="text-purple-400 hover:text-purple-300 text-sm font-medium mt-2 flex items-center space-x-1 transition-colors duration-200"
                        >
                          <span>Read More</span>
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </button>
                      )}
                    </div>
                  </div>
                  
                  {/* Status Badge */}
                  <div className={`px-4 py-2 rounded-full border text-sm font-semibold ${getStatusColor(project.status)} animate-pulse`} style={{ animationDuration: '2s' }}>
                    {project.status.toUpperCase()}
                  </div>
                </div>

                {/* Project Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                        <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-zinc-400 text-sm">Budget</p>
                        <p className="text-white font-semibold text-lg">{project.budget}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                        <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-zinc-400 text-sm">Category</p>
                        <p className="text-white font-semibold">{project.category}</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-orange-500/20 rounded-lg flex items-center justify-center">
                        <svg className="w-5 h-5 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-zinc-400 text-sm">Deadline</p>
                        <p className="text-white font-semibold">
                          {new Date(project.deadline).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <div className="w-10 h-10 bg-cyan-500/20 rounded-lg flex items-center justify-center">
                        <svg className="w-5 h-5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-zinc-400 text-sm">Client</p>
                        <p className="text-white font-semibold">{project.userId?.username}</p>
                        <p className="text-zinc-400 text-sm">{project.userId?.email}</p>
                      </div>
                    </div>
                  </div>

                  <div className="md:col-span-2 lg:col-span-1">
                    <div className="flex items-start space-x-3">
                      <div className="w-10 h-10 bg-pink-500/20 rounded-lg flex items-center justify-center">
                        <svg className="w-5 h-5 text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-zinc-400 text-sm mb-2">Required Skills</p>
                        <div className="flex flex-wrap gap-2">
                          {project.skillsRequired.map((skill, i) => (
                            <span
                              key={i}
                              className="px-3 py-1 bg-gradient-to-r from-purple-500/20 to-purple-500/20 text-purple-300 text-sm rounded-full border border-purple-500/30 hover:from-purple-500/30 hover:to-purple-500/30 transition-all duration-300"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-zinc-700/50">
                  {!project.confirm ? (
                    <>
                      <button
                        disabled={actionLoading === project._id}
                        onClick={() => confirmProject(project._id, project)}
                        className="relative overflow-hidden bg-gradient-to-r from-green-500 to-emerald-500 text-white px-8 py-3 rounded-xl font-semibold hover:from-green-600 hover:to-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-green-500/25 group/btn"
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-emerald-400 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"></div>
                        <span className="relative flex items-center justify-center space-x-2">
                          {actionLoading === project._id ? (
                            <>
                              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                              <span>Confirming...</span>
                            </>
                          ) : (
                            <>
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                              <span>Confirm Project</span>
                            </>
                          )}
                        </span>
                      </button>

                      <button
                        disabled={actionLoading === project._id}
                        onClick={() => withdrawConfirmation(project._id)}
                        className="relative overflow-hidden bg-gradient-to-r from-red-500 to-rose-500 text-white px-8 py-3 rounded-xl font-semibold hover:from-red-600 hover:to-rose-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-red-500/25 group/btn"
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-red-400 to-rose-400 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"></div>
                        <span className="relative flex items-center justify-center space-x-2">
                          {actionLoading === project._id ? (
                            <>
                              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                              <span>Withdrawing...</span>
                            </>
                          ) : (
                            <>
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                              <span>Withdraw Proposal</span>
                            </>
                          )}
                        </span>
                      </button>
                    </>
                  ) : (
                    <div className="flex items-center space-x-3 px-6 py-4 bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 rounded-xl">
                      <div className="w-8 h-8 bg-green-500/30 rounded-full flex items-center justify-center">
                        <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-green-400 font-semibold text-lg">Project Confirmed</p>
                        <p className="text-green-300 text-sm">You have successfully accepted this project</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Description Modal */}
      {modalProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="relative w-full max-w-2xl max-h-[90vh] bg-zinc-800 rounded-2xl border border-zinc-700/50 shadow-2xl animate-in zoom-in-95 duration-300">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-zinc-700/50">
              <h3 className="text-xl md:text-2xl font-bold text-white pr-8">
                {modalProject.title}
              </h3>
              <button
                onClick={closeModal}
                className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-zinc-700 hover:bg-zinc-600 text-zinc-300 hover:text-white transition-all duration-200"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            {/* Modal Body */}
            <div className="p-6 max-h-[60vh] overflow-y-auto">
              <div className="prose prose-invert max-w-none">
                <p className="text-zinc-300 text-base md:text-lg leading-relaxed whitespace-pre-wrap">
                  {modalProject.description}
                </p>
              </div>
            </div>
            
            {/* Modal Footer */}
            <div className="flex justify-end p-6 border-t border-zinc-700/50">
              <button
                onClick={closeModal}
                className="px-6 py-2 bg-gradient-to-r from-purple-500 to-purple-500 text-white font-medium rounded-lg hover:from-purple-600 hover:to-purple-600 transition-all duration-200 focus:ring-2 focus:ring-purple-500/50 focus:outline-none"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default Dev_listing_project;
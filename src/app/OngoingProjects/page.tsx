'use client';

import { useEffect, useState } from 'react';

interface User {
  username: string;
  email: string;
}

interface Project {
  _id: string;
  title: string;
  description: string;
  budget: string;
  category: string;
  skillsRequired: string[];
  deadline: string;
  status: string;
  userId: User;
  createdAt: string;
  chatId?: string | null;
  chatStatus?: 'active' | 'closed';
  clientCloseFlag?: boolean;
  freelancerCloseFlag?: boolean;
}

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

const OngoingProjects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [expandedDescriptions, setExpandedDescriptions] = useState<Set<string>>(new Set());

  const freelancerEmail = 'freelancer@example.com';
  const currentUserRole: 'freelancer' = 'freelancer';

  const addToast = (message: string, type: 'success' | 'error' | 'info') => {
    const id = Date.now().toString();
    const newToast = { id, message, type };
    setToasts(prev => [...prev, newToast]);
    
    setTimeout(() => {
      setToasts(prev => prev.filter(toast => toast.id !== id));
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  const fetchProjects = async () => {
    try {
      setLoading(true);
      // Your actual API call
      const res = await fetch(`/api/projects/freelancer/ongoing-project?email=${encodeURIComponent(freelancerEmail)}`);
      if (!res.ok) throw new Error('Failed to fetch projects');
      const data = await res.json();
      setProjects(data);
    } catch (error) {
      console.error('Error fetching ongoing projects:', error);
      addToast('Failed to fetch projects', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleCompletionRequest = async (chatId: string) => {
    if (!chatId) return;

    try {
      setActionLoading(chatId);
      const res = await fetch('/api/chat/closed-status', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chatId,
          userId: freelancerEmail,
          role: currentUserRole,
        }),
      });

      if (!res.ok) throw new Error('Failed to update status');
      
      const data = await res.json();
      console.log('Toggle completion request sent:', data);
      addToast('Status updated successfully', 'success');
      fetchProjects();
    } catch (err) {
      console.error('Error sending completion request:', err);
      addToast('Failed to update status', 'error');
    } finally {
      setActionLoading(null);
    }
  };

  const openModal = (project: Project) => {
    setSelectedProject(project);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedProject(null);
  };

  const toggleDescription = (projectId: string) => {
    setExpandedDescriptions(prev => {
      const newSet = new Set(prev);
      if (newSet.has(projectId)) {
        newSet.delete(projectId);
      } else {
        newSet.add(projectId);
      }
      return newSet;
    });
  };

  const truncateText = (text: string, maxLength: number) => {
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#121212]">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
          <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-purple-400 rounded-full animate-spin" style={{animationDelay: '150ms'}}></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#121212] p-4 md:p-6">
      {/* Toast Container */}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`transform transition-all duration-500 ease-in-out translate-x-0 opacity-100 ${
              toast.type === 'success' 
                ? 'bg-lime-600' 
                : toast.type === 'error' 
                ? 'bg-red-600' 
                : 'bg-purple-600'
            } text-white px-4 py-3 rounded-lg shadow-lg max-w-sm animate-pulse`}
            style={{animation: 'slideInRight 0.3s ease-out'}}
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">{toast.message}</span>
              <button
                onClick={() => removeToast(toast.id)}
                className="ml-3 text-white hover:text-gray-200 transition-colors duration-200 transform hover:scale-110"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Header */}
      <div className="mb-8 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-2 animate-pulse">
          My Ongoing Projects
        </h2>
        <div className="w-24 h-1 bg-gradient-to-r from-purple-500 to-purple-700 mx-auto rounded-full"></div>
      </div>

      {projects.length === 0 ? (
        <div className="text-center py-16">
          <div className="bg-zinc-800 rounded-lg p-8 max-w-md mx-auto transform hover:scale-105 transition-transform duration-300">
            <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <p className="text-gray-300 text-lg">No ongoing projects found</p>
            <p className="text-gray-500 text-sm mt-2">Check back later for new opportunities</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {projects.map((project, index) => {
            const hasRequested = project.freelancerCloseFlag;
            const bothClosed = project.clientCloseFlag && project.freelancerCloseFlag;
            const isChatClosed = project.chatStatus === 'closed' || bothClosed;
            const isExpanded = expandedDescriptions.has(project._id);
            const description = isExpanded ? project.description : truncateText(project.description, 120);

            return (
              <div
                key={project._id}
                className="bg-zinc-800 rounded-xl shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 ease-in-out border border-gray-700 hover:border-purple-500 overflow-hidden opacity-0 animate-pulse"
                style={{ 
                  animationDelay: `${index * 100}ms`,
                  animation: `fadeInUp 0.6s ease-out ${index * 100}ms forwards`
                }}
              >
                <div className="p-6">
                  {/* Project Header */}
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-white mb-2 hover:text-purple-400 transition-colors duration-200 cursor-pointer">
                        {project.title}
                      </h3>
                      <div className="flex items-center space-x-2 mb-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium transition-all duration-200 ${
                          project.status === 'active' 
                            ? 'bg-lime-600 text-white animate-pulse' 
                            : 'bg-zinc-600 text-gray-200'
                        }`}>
                          {project.status}
                        </span>
                        <span className="px-3 py-1 bg-purple-600 text-white rounded-full text-xs font-medium hover:bg-purple-700 transition-colors duration-200">
                          {project.category}
                        </span>
                      </div>
                    </div>
                    
                    {isChatClosed && (
                      <div className="flex items-center space-x-2 bg-lime-600 px-3 py-1 rounded-full">
                        <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                        <span className="text-white text-xs font-medium">Completed</span>
                      </div>
                    )}
                  </div>

                  {/* Project Description */}
                  <div className="mb-4">
                    <p className="text-gray-300 text-sm leading-relaxed">
                      {description}
                    </p>
                    {project.description.length > 120 && (
                      <button
                        onClick={() => toggleDescription(project._id)}
                        className="mt-2 text-purple-400 hover:text-purple-300 text-xs font-medium transition-all duration-200 transform hover:scale-105"
                      >
                        {isExpanded ? 'Show Less' : 'Read More'}
                      </button>
                    )}
                  </div>

                  {/* Project Details Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4 text-sm">
                    <div className="flex items-center space-x-2 group">
                      <div className="w-2 h-2 bg-purple-500 rounded-full group-hover:animate-pulse"></div>
                      <span className="text-gray-400">Budget:</span>
                      <span className="text-white font-medium">{project.budget}</span>
                    </div>
                    <div className="flex items-center space-x-2 group">
                      <div className="w-2 h-2 bg-purple-500 rounded-full group-hover:animate-pulse"></div>
                      <span className="text-gray-400">Deadline:</span>
                      <span className="text-white font-medium">
                        {new Date(project.deadline).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  {/* Client Info */}
                  <div className="bg-zinc-700 rounded-lg p-3 mb-4 hover:bg-zinc-600 transition-colors duration-200">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center hover:bg-purple-700 transition-colors duration-200">
                        <span className="text-white text-sm font-bold">
                          {project.userId.username.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <p className="text-white font-medium text-sm">{project.userId.username}</p>
                        <p className="text-gray-400 text-xs">{project.userId.email}</p>
                      </div>
                    </div>
                  </div>

                  {/* Status Indicators */}
                  <div className="grid grid-cols-2 gap-2 mb-4">
                    <div className="bg-zinc-700 rounded-lg p-2 hover:bg-zinc-600 transition-colors duration-200">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-400 text-xs">Client Status</span>
                        <div className={`w-3 h-3 rounded-full transition-all duration-200 ${
                          project.clientCloseFlag ? 'bg-lime-500 animate-pulse' : 'bg-zinc-500'
                        }`}></div>
                      </div>
                    </div>
                    <div className="bg-zinc-700 rounded-lg p-2 hover:bg-zinc-600 transition-colors duration-200">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-400 text-xs">Your Status</span>
                        <div className={`w-3 h-3 rounded-full transition-all duration-200 ${
                          hasRequested ? 'bg-lime-500 animate-pulse' : 'bg-zinc-500'
                        }`}></div>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-3">
                    <button
                      onClick={() => openModal(project)}
                      className="flex-1 bg-sky-600 hover:bg-sky-700 text-white py-2 px-4 rounded-3xl font-medium transition-all duration-200 transform hover:scale-105 active:scale-95 hover:shadow-lg"
                    >
                      View Details
                    </button>
                    
                    {project.chatId && (
                      <a
                        href={`/chat/${project.chatId}`}
                        className="flex-1 bg-purple-700 hover:bg-purple-700 text-white py-2 px-4 rounded-3xl font-medium text-center transition-all duration-200 transform hover:scale-105 active:scale-95 hover:shadow-lg"
                      >
                        Open Chat
                      </a>
                    )}
                  </div>

                  {/* Completion Request Button */}
                  {project.chatId && !isChatClosed && (
                    <button
                      onClick={() => handleCompletionRequest(project.chatId!)}
                      disabled={actionLoading === project.chatId}
                      className={`w-full mt-3 py-2 px-4 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 active:scale-95 hover:shadow-lg ${
                        actionLoading === project.chatId
                          ? 'bg-zinc-600 cursor-not-allowed text-gray-300'
                          : hasRequested
                          ? 'bg-red-600 hover:bg-red-700 text-white'
                          : 'bg-lime-600 hover:bg-lime-700 text-white'
                      }`}
                    >
                      {actionLoading === project.chatId ? (
                        <div className="flex items-center justify-center space-x-2">
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          <span>Processing...</span>
                        </div>
                      ) : hasRequested ? (
                        'Cancel Completion Request'
                      ) : (
                        'Request Project Completion'
                      )}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal */}
      {showModal && selectedProject && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 backdrop-blur-sm"
          onClick={closeModal}
        >
          <div 
            className="bg-zinc-800 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto transform transition-all duration-300 ease-in-out scale-100 opacity-100"
            onClick={(e) => e.stopPropagation()}
            style={{animation: 'modalFadeIn 0.3s ease-out'}}
          >
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <h3 className="text-2xl font-bold text-white pr-4">{selectedProject.title}</h3>
                <button
                  onClick={closeModal}
                  className="text-gray-400 hover:text-white transition-colors duration-200 transform hover:scale-110 hover:rotate-90 flex-shrink-0"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="space-y-6">
                <div className="bg-zinc-700 rounded-lg p-4 hover:bg-zinc-600 transition-colors duration-200">
                  <h4 className="text-lg font-semibold text-purple-400 mb-3">Description</h4>
                  <p className="text-gray-300 leading-relaxed">{selectedProject.description}</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-zinc-700 rounded-lg p-4 hover:bg-zinc-600 transition-colors duration-200">
                    <h4 className="text-lg font-semibold text-purple-400 mb-3">Project Details</h4>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Budget:</span>
                        <span className="text-white font-medium">{selectedProject.budget}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Category:</span>
                        <span className="text-white font-medium">{selectedProject.category}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Status:</span>
                        <span className="text-white font-medium">{selectedProject.status}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Deadline:</span>
                        <span className="text-white font-medium">{new Date(selectedProject.deadline).toLocaleDateString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Posted:</span>
                        <span className="text-white font-medium">{new Date(selectedProject.createdAt).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-zinc-700 rounded-lg p-4 hover:bg-zinc-600 transition-colors duration-200">
                    <h4 className="text-lg font-semibold text-purple-400 mb-3">Client Information</h4>
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center hover:bg-purple-700 transition-colors duration-200">
                        <span className="text-white font-bold">
                          {selectedProject.userId.username.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <p className="text-white font-medium">{selectedProject.userId.username}</p>
                        <p className="text-gray-400 text-sm">{selectedProject.userId.email}</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                {selectedProject.skillsRequired && selectedProject.skillsRequired.length > 0 && (
                  <div className="bg-zinc-700 rounded-lg p-4 hover:bg-zinc-600 transition-colors duration-200">
                    <h4 className="text-lg font-semibold text-purple-400 mb-3">Required Skills</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedProject.skillsRequired.map((skill, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-zinc-800 text-gray-300 rounded-full text-sm hover:bg-purple-600 hover:text-white transition-all duration-200 transform hover:scale-105"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(100px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes modalFadeIn {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        
        .animation-delay-150 {
          animation-delay: 150ms;
        }
      `}</style>
    </div>
  );
};

export default OngoingProjects;
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface User {
  username: string;
  email: string;
}

interface Project {
  _id: string;
  title: string;
  description: string;
  createdAt: string;
  userId: User;
  selectedFreelancer: User | null;
  chatId: string | null;
  chatStatus?: 'active' | 'closed';
  clientCloseFlag?: boolean;
  freelancerCloseFlag?: boolean;
}

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

export default function ClientOngoingProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [showDetailModal, setShowDetailModal] = useState<Project | null>(null);

  const currentUserEmail = 'client@example.com';
  const currentUserRole = 'client' as const;

  const showToast = (message: string, type: 'success' | 'error' | 'info') => {
    const id = Math.random().toString(36).substr(2, 9);
    const newToast = { id, message, type };
    setToasts(prev => [...prev, newToast]);
    
    setTimeout(() => {
      setToasts(prev => prev.filter(toast => toast.id !== id));
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await fetch('/api/projects/client/ongoing_project_client');
        const data = await res.json();
        setProjects(data);
        // showToast('Projects loaded successfully', 'success');
      } catch (error) {
        console.error('Failed to fetch projects:', error);
        showToast('Failed to load projects', 'error');
      } finally {
        setLoading(false);
      }
    };

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
          userId: currentUserEmail,
          role: currentUserRole,
        }),
      });

      const data = await res.json();
      console.log('Request successful:', data);
      showToast('Request sent successfully', 'success');
      
      // Refetch to update UI
      const updatedRes = await fetch('/api/projects/client/ongoing_project_client');
      const updatedData = await updatedRes.json();
      setProjects(updatedData);
    } catch (err) {
      console.error('Error sending completion request:', err);
      showToast('Failed to send request', 'error');
    } finally {
      setActionLoading(null);
    }
  };

  const truncateText = (text: string, maxLength: number) => {
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'from-emerald-500 to-teal-600';
      case 'closed': return 'from-gray-500 to-gray-600';
      default: return 'from-amber-500 to-orange-600';
    }
  };

  const getCompletionStatus = (project: Project) => {
    if (project.clientCloseFlag && project.freelancerCloseFlag) {
      return { text: 'Ready to Close', color: 'from-lime-500 to-emerald-600', pulse: true };
    } else if (project.clientCloseFlag) {
      return { text: 'Awaiting Freelancer', color: 'from-purple-500 to-violet-600', pulse: false };
    } else if (project.freelancerCloseFlag) {
      return { text: 'Freelancer Ready', color: 'from-purple-500 to-violet-600', pulse: false };
    }
    return { text: 'In Progress', color: 'from-gray-500 to-gray-600', pulse: false };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br bg-[#121212] flex justify-center items-center">
        <div className="text-center">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mb-6"></div>
            <div className="absolute inset-0 w-20 h-20 border-4 border-transparent border-t-purple-500 rounded-full animate-spin animation-delay-150"></div>
          </div>
          <div className="space-y-2">
            <p className="text-gray-200 text-xl font-semibold animate-pulse">Loading Your Projects</p>
            <div className="flex justify-center space-x-1">
              <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce animation-delay-75"></div>
              <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce animation-delay-150"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br bg-[#121212] text-gray-100">
      {/* Toast Container */}
      <div className="fixed top-6 right-6 z-50 space-y-3">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`transform transition-all duration-500 ease-out animate-slide-in-right px-6 py-4 rounded-2xl shadow-2xl backdrop-blur-lg border max-w-sm ${
              toast.type === 'success' 
                ? 'bg-lime-500 bg-opacity-90 border-lime-400 text-white' 
                : toast.type === 'error' 
                ? 'bg-red-500 bg-opacity-90 border-red-400 text-white' 
                : 'bg-purple-500 bg-opacity-90 border-purple-400 text-white'
            }`}
          >
            <div className="flex items-center justify-between">
              <p className="font-medium">{toast.message}</p>
              <button
                onClick={() => removeToast(toast.id)}
                className="ml-4 text-white text-opacity-80 hover:text-opacity-100 text-xl font-bold transition-all duration-200 hover:scale-110"
              >
                ✕
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Header Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r opacity-10"></div>
        <div className="relative max-w-3xl mx-auto px-6 py-4">
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-400 via-purple-500 to-purple-600 bg-clip-text text-transparent mb-4 animate-fade-in">
              Your Projects
            </h1>
            <p className="text-md text-gray-400 max-w-2xl mx-auto animate-fade-in-delay">
              Manage and track your ongoing collaborations
            </p>
            <div className="mt-8 w-32 h-1 bg-gradient-to-r from-purple-500 to-purple-500 mx-auto rounded-full animate-scale-in"></div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 pb-16">
        {projects.length === 0 ? (
          <div className="text-center py-20 animate-fade-in">
            <div className="bg-gradient-to-br bg-zinc-800 rounded-3xl p-12 max-w-lg mx-auto shadow-2xl border border-gray-700">
              <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
                <span className="text-3xl">📋</span>
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">No Active Projects</h3>
              <p className="text-gray-400 leading-relaxed">
                Ready to start your next collaboration? Create a new project to begin working with talented freelancers.
              </p>
            </div>
          </div>
        ) : (
          <div className="grid gap-8 py-3 grid-cols-1 xl:grid-cols-2">
            {projects.map((project, index) => {
              const completionStatus = getCompletionStatus(project);
              
              return (
                <div
                  key={project._id}
                  className="group bg-gradient-to-br  bg-zinc-800 rounded-2xl p-6 shadow-xl hover:shadow-purple-500/10 transform hover:scale-103 transition-all duration-400 ease-out border border-gray-700 hover:border-purple-500/50 animate-fade-in-up relative overflow-hidden"
                  style={{ animationDelay: `${index * 0.12}s`, maxWidth: 520, margin: "0 auto" }}
                >
                  {/* Background Gradient Effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  
                  <div className="relative z-2">
                    {/* Project Header */}
                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between mb-1">
                      <div className="flex-1 mb-4 lg:mb-0">
                        <div className="flex items-center mb-2">
                          <div className="w-2 h-2 bg-gradient-to-r from-purple-500 to-purple-500 rounded-full mr-2 animate-pulse"></div>
                          <span className="text-xs font-medium text-zinc-400 uppercase tracking-wider">
                            Project 
                          </span>
                        </div>
                        <h2 className="text-lg lg:text-xl font-bold text-white mb-2 group-hover:text-purple-300 transition-colors duration-300">
                          {project.title}
                        </h2>
                        <div className="flex items-center text-xs text-gray-400">
                          <div className="bg-zinc-700 px-2 py-0.5 rounded-3xl mr-2">
                            {new Date(project.createdAt).toLocaleDateString('en-US', { 
                              month: 'short', 
                              day: 'numeric',
                              year: 'numeric'
                            })}
                          </div>
                        </div>
                      </div>
                      
                      {/* Status Badge */}
                      <div className={`px-3 py-1.5 rounded-xl bg-gradient-to-r ${completionStatus.color} text-white font-medium text-xs shadow-lg ${completionStatus.pulse ? 'animate-pulse' : ''}`}>
                        {completionStatus.text}
                      </div>
                    </div>

                    {/* Description */}
                    <div className="mb-4">
                      <p className="text-gray-300 leading-relaxed text-base">
                        {truncateText(project.description, 90)}
                      </p>
                      {project.description.length > 90 && (
                        <button
                          onClick={() => setShowDetailModal(project)}
                          className="text-purple-400 hover:text-purple-300 font-medium mt-1 transition-all duration-200 hover:underline decoration-2 underline-offset-4 text-sm"
                        >
                          Read full description
                        </button>
                      )}
                    </div>

                    {/* Freelancer Section */}
                    <div className="bg-gradient-to-r from-gray-700 to-gray-800 rounded-xl p-4 mb-4 transform hover:scale-104 transition-transform duration-200">
                      {project.selectedFreelancer ? (
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-500 rounded-xl flex items-center justify-center mr-3 shadow-lg">
                            <span className="text-white font-bold text-lg">
                              {project.selectedFreelancer.username.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <p className="text-white font-semibold text-base">
                              {project.selectedFreelancer.username}
                            </p>
                            <p className="text-gray-400 text-xs">
                              {project.selectedFreelancer.email}
                            </p>
                            <div className="flex items-center mt-0.5">
                              <div className="w-1.5 h-1.5 bg-lime-500 rounded-full mr-1 animate-pulse"></div>
                              <span className="text-lime-400 text-xs font-medium">Active Freelancer</span>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="text-center py-2">
                          <div className="w-8 h-8 bg-gray-600 rounded-xl flex items-center justify-center mx-auto mb-2">
                            <span className="text-lg">👤</span>
                          </div>
                          <p className="text-gray-400 font-medium text-xs">No freelancer assigned yet</p>
                        </div>
                      )}
                    </div>

                    {/* Status Grid */}
                    <div className="grid grid-cols-3 gap-2 mb-4">
                      <div className="bg-gray-700 bg-opacity-50 rounded-lg p-2 text-center transform hover:scale-104 transition-transform duration-150">
                        <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${getStatusColor(project.chatStatus || 'unknown')} flex items-center justify-center mx-auto mb-1`}>
                          <span className="text-white font-bold text-base">💬</span>
                        </div>
                        <p className="text-[10px] text-gray-400 mb-0.5">Chat Status</p>
                        <p className="text-white font-medium capitalize text-xs">{project.chatStatus || 'Unknown'}</p>
                      </div>
                      
                      <div className="bg-gray-700 bg-opacity-50 rounded-lg p-2 text-center transform hover:scale-104 transition-transform duration-150">
                        <div className={`w-8 h-8 rounded-lg ${project.clientCloseFlag ? 'bg-gradient-to-br from-lime-500 to-emerald-600' : 'bg-gray-600'} flex items-center justify-center mx-auto mb-1`}>
                          <span className="text-white font-bold text-base">👤</span>
                        </div>
                        <p className="text-[10px] text-gray-400 mb-0.5">Your Request</p>
                        <p className={`font-medium text-xs ${project.clientCloseFlag ? 'text-lime-400' : 'text-gray-400'}`}>
                          {project.clientCloseFlag ? 'Submitted' : 'Pending'}
                        </p>
                      </div>
                      
                      <div className="bg-gray-700 bg-opacity-50 rounded-lg p-2 text-center transform hover:scale-104 transition-transform duration-150">
                        <div className={`w-8 h-8 rounded-lg ${project.freelancerCloseFlag ? 'bg-gradient-to-br from-purple-500 to-violet-600' : 'bg-gray-600'} flex items-center justify-center mx-auto mb-1`}>
                          <span className="text-white font-bold text-base">🎯</span>
                        </div>
                        <p className="text-[10px] text-gray-400 mb-0.5">Freelancer</p>
                        <p className={`font-medium text-xs ${project.freelancerCloseFlag ? 'text-purple-400' : 'text-gray-400'}`}>
                          {project.freelancerCloseFlag ? 'Ready' : 'Working'}
                        </p>
                      </div>
                    </div>

                    {/* Completion Alert */}
                    {project.clientCloseFlag && project.freelancerCloseFlag && (
                      <div className="bg-gradient-to-r from-lime-500 to-emerald-600 rounded-xl p-2 mb-4 animate-pulse">
                        <div className="flex items-center justify-center">
                          <span className="text-lg mr-2">🎉</span>
                          <p className="text-white font-bold text-center text-sm">
                            Project ready for completion! Both parties have agreed.
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-2">
                      {project.chatId ? (
                        <>
                            <Link
                            href={`/chat/${project.chatId}`}
                            className={`flex-1 bg-gradient-to-r from-purple-600 to-violet-700 hover:from-purple-700 hover:to-violet-800 text-white font-semibold py-3 px-3 rounded-xl text-center transform hover:scale-104 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center text-sm ${
                              actionLoading === `chat-link-${project.chatId}` ? 'opacity-60 cursor-not-allowed' : ''
                            }`}
                            onClick={() => setActionLoading(`chat-link-${project.chatId}`)}
                            >
                            {actionLoading === `chat-link-${project.chatId}` ? (
                              <span className="flex items-center">
                              <span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-1"></span>
                              Loading...
                              </span>
                            ) : (
                              <>
                              <span className="mr-1">💬</span>
                              Open Chat
                              </>
                            )}
                            </Link>

                          {project.chatStatus !== 'closed' && (
                            <>
                              {!project.clientCloseFlag ? (
                                <button
                                  onClick={() => handleCompletionRequest(project.chatId!)}
                                  disabled={actionLoading === project.chatId}
                                  className={`flex-1 font-semibold py-2 px-3 rounded-xl transform transition-all duration-200 shadow-lg hover:shadow-xl text-sm ${
                                    actionLoading === project.chatId
                                      ? 'bg-gray-600 cursor-not-allowed text-gray-300'
                                      : 'bg-gradient-to-r bg-lime-600 hover:from-lime-700 hover:to-emerald-800 text-white hover:scale-104'
                                  }`}
                                >
                                  {actionLoading === project.chatId ? (
                                    <div className="flex items-center justify-center">
                                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-1"></div>
                                      Processing...
                                    </div>
                                  ) : (
                                    <div className="flex items-center justify-center">
                                      <span className="mr-1">🚀</span>
                                      Request Completion
                                    </div>
                                  )}
                                </button>
                              ) : (
                                !project.freelancerCloseFlag && (
                                  <button
                                    onClick={() => handleCompletionRequest(project.chatId!)}
                                    disabled={actionLoading === project.chatId}
                                    className={`flex-1 font-semibold py-2 px-3 rounded-xl transform transition-all duration-200 shadow-lg hover:shadow-xl text-sm ${
                                      actionLoading === project.chatId
                                        ? 'bg-gray-600 cursor-not-allowed text-gray-300'
                                        : 'bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-700 hover:to-rose-800 text-white hover:scale-104'
                                    }`}
                                  >
                                    {actionLoading === project.chatId ? (
                                      <div className="flex items-center justify-center">
                                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-1"></div>
                                        Canceling...
                                      </div>
                                    ) : (
                                      <div className="flex items-center justify-center">
                                        <span className="mr-1">🔄</span>
                                        Cancel Request
                                      </div>
                                    )}
                                  </button>
                                )
                              )}
                            </>
                          )}
                        </>
                      ) : (
                        <div className="flex-1 bg-gray-700 bg-opacity-50 text-gray-400 py-2 px-3 rounded-xl text-center font-medium text-sm">
                          <span className="mr-1">⏳</span>
                          Chat will be available soon
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Enhanced Detail Modal */}
      {showDetailModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto transform animate-scale-in border border-gray-700 shadow-2xl">
            <div className="flex justify-between items-start mb-8">
              <div>
                <h3 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-purple-500 bg-clip-text text-transparent">
                  {showDetailModal.title}
                </h3>
                <p className="text-gray-400 mt-2">Complete project details</p>
              </div>
              <button
                onClick={() => setShowDetailModal(null)}
                className="w-10 h-10 bg-gray-700 hover:bg-gray-600 rounded-full flex items-center justify-center text-gray-400 hover:text-white transition-all duration-200 transform hover:scale-110"
              >
                <span className="text-xl">✕</span>
              </button>
            </div>
            
            <div className="space-y-8">
              <div className="bg-gradient-to-r from-gray-700 to-gray-800 rounded-2xl p-6">
                <h4 className="text-xl font-semibold text-purple-400 mb-4 flex items-center">
                  <span className="mr-2">📝</span>
                  Project Description
                </h4>
                <p className="text-gray-200 leading-relaxed text-lg">{showDetailModal.description}</p>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-gradient-to-br from-purple-600 to-purple-800 bg-opacity-20 rounded-2xl p-6 border border-purple-500 border-opacity-30">
                  <h4 className="text-lg font-semibold text-purple-300 mb-4 flex items-center">
                    <span className="mr-2">👨‍💻</span>
                    Assigned Freelancer
                  </h4>
                  {showDetailModal.selectedFreelancer ? (
                    <div className="space-y-2">
                      <p className="text-white font-semibold text-xl">{showDetailModal.selectedFreelancer.username}</p>
                      <p className="text-purple-200">{showDetailModal.selectedFreelancer.email}</p>
                    </div>
                  ) : (
                    <p className="text-gray-400">No freelancer assigned yet</p>
                  )}
                </div>
                
                <div className="bg-gradient-to-br from-purple-600 to-purple-800 bg-opacity-20 rounded-2xl p-6 border border-purple-500 border-opacity-30">
                  <h4 className="text-lg font-semibold text-purple-300 mb-4 flex items-center">
                    <span className="mr-2">📅</span>
                    Project Timeline
                  </h4>
                  <div className="space-y-2">
                    <p className="text-white font-semibold">
                      {new Date(showDetailModal.createdAt).toLocaleDateString('en-US', { 
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                    <p className="text-purple-200 text-sm">
                      {new Date(showDetailModal.createdAt).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-gray-700 to-gray-800 rounded-2xl p-6">
                <h4 className="text-lg font-semibold text-lime-400 mb-4 flex items-center">
                  <span className="mr-2">📊</span>
                  Project Status Overview
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-gray-600 bg-opacity-50 rounded-xl">
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${getStatusColor(showDetailModal.chatStatus || 'unknown')} flex items-center justify-center mx-auto mb-3`}>
                      <span className="text-white text-2xl">💬</span>
                    </div>
                    <p className="text-white font-semibold">Chat Status</p>
                    <p className="text-gray-300 capitalize">{showDetailModal.chatStatus || 'Unknown'}</p>
                  </div>
                  <div className="text-center p-4 bg-gray-600 bg-opacity-50 rounded-xl">
                    <div className={`w-16 h-16 rounded-2xl ${showDetailModal.clientCloseFlag ? 'bg-gradient-to-br from-lime-500 to-emerald-600' : 'bg-gray-600'} flex items-center justify-center mx-auto mb-3`}>
                      <span className="text-white text-2xl">👤</span>
                    </div>
                    <p className="text-white font-semibold">Your Request</p>
                    <p className={`${showDetailModal.clientCloseFlag ? 'text-lime-400' : 'text-gray-400'}`}>
                      {showDetailModal.clientCloseFlag ? 'Submitted' : 'Not Submitted'}
                    </p>
                  </div>
                  <div className="text-center p-4 bg-gray-600 bg-opacity-50 rounded-xl">
                    <div className={`w-16 h-16 rounded-2xl ${showDetailModal.freelancerCloseFlag ? 'bg-gradient-to-br from-purple-500 to-violet-600' : 'bg-gray-600'} flex items-center justify-center mx-auto mb-3`}>
                      <span className="text-white text-2xl">🎯</span>
                    </div>
                    <p className="text-white font-semibold">Freelancer Status</p>
                    <p className={`${showDetailModal.freelancerCloseFlag ? 'text-purple-400' : 'text-gray-400'}`}>
                      {showDetailModal.freelancerCloseFlag ? 'Ready to Close' : 'Still Working'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes fade-in-up {
          from { 
            opacity: 0; 
            transform: translateY(30px); 
          }
          to { 
            opacity: 1; 
            transform: translateY(0); 
          }
        }
        
        @keyframes fade-in-delay {
          from { 
            opacity: 0; 
            transform: translateY(20px); 
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
        
        @keyframes slide-in-right {
          from { 
            opacity: 0; 
            transform: translateX(100%); 
          }
          to { 
            opacity: 1; 
            transform: translateX(0); 
          }
        }
        
        .animate-fade-in {
          animation: fade-in 0.8s ease-out;
        }
        
        .animate-fade-in-delay {
          animation: fade-in-delay 1s ease-out 0.3s both;
        }
        
        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out;
        }
        
        .animate-scale-in {
          animation: scale-in 0.6s ease-out;

        }
        .animate-slide-in-right {

          animation: slide-in-right 0.5s ease-out;
        }
      `}</style>
    </div>
  );
}
'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import axios, { AxiosError } from 'axios';
import { toast } from 'react-hot-toast';

interface User {
  _id: string;
  username: string;
}

interface Applicant {
  _id: string;
  username: string;
}


type ProjectStatus = 'Open' | 'Pending' | 'In Progress' | 'Completed' | 'Cancelled' | 'Dispute';

interface Project {
  _id: string;
  title: string;
  description: string;
  budget: string;
  skillsRequired: string[];
  deadline: string;
  category: string;
  status: ProjectStatus;
  userId: User;
  applicants: Applicant[];
  selectedFreelancer?: Applicant | string;
  confirm: boolean;
}

interface ApiError {
  message: string;
}

// Modal Component for Read More
const DescriptionModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description: string;
}> = ({ isOpen, onClose, title, description }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div 
          className="fixed inset-0 transition-opacity bg-gray-900 bg-opacity-75"
          onClick={onClose}
        ></div>

        {/* Modal panel */}
        <div className="inline-block align-bottom bg-gray-300 rounded-lg border border-gray-700 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
          <div className="bg-zinc-800 px-6 pt-5 pb-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">
                {title}
              </h3>
              <button
                onClick={onClose}
                className="text-zinc-400 hover:text-zinc-200 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="max-h-96 overflow-y-auto">
              <p className="text-zinc-300 leading-relaxed whitespace-pre-wrap">
                {description}
              </p>
            </div>
          </div>
          <div className="bg-zinc-700 flex justify-end px-6 py-3">
            <button
              onClick={onClose}
              className="w-1/5 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-xl font-medium transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Description Component with Read More functionality
const ProjectDescription: React.FC<{
  description: string;
  title: string;
  maxLength?: number;
}> = ({ description, title, maxLength = 150 }) => {
  const [showModal, setShowModal] = useState(false);
  
  const shouldTruncate = description.length > maxLength;
  const truncatedDescription = shouldTruncate 
    ? description.substring(0, maxLength) + '...' 
    : description;

  return (
    <>
      <div className="text-gray-300 leading-relaxed">
        <p>{truncatedDescription}</p>
        {shouldTruncate && (
          <button
            onClick={() => setShowModal(true)}
            className="text-zinc-300 hover:text-purple-300 text-sm font-medium mt-2 inline-flex items-center gap-1 transition-colors"
          >
            Read More
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        )}
      </div>
      
      <DescriptionModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={title}
        description={description}
      />
    </>
  );
};

const Accepthing_project_list: React.FC = () => {
  const { data: session } = useSession();
  const currentUser = session?.user as User | undefined;

  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [processingStates, setProcessingStates] = useState<Record<string, boolean>>({});

  // Enhanced error handling
  const handleApiError = useCallback((err: unknown): string => {
    if (axios.isAxiosError(err)) {
      const axiosError = err as AxiosError<ApiError>;
      return axiosError.response?.data?.message || axiosError.message || 'An unexpected error occurred';
    }
    return err instanceof Error ? err.message : 'An unexpected error occurred';
  }, []);

  // Enhanced fetch function with better error handling
  const fetchMyProjects = useCallback(async () => {
    if (!currentUser) return;

    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`/api/projects/client?username=${currentUser.username}`);
      setProjects(response.data);
    } catch (err) {
      const errorMessage = handleApiError(err);
      setError(errorMessage);
      console.error('Error fetching projects:', err);
    } finally {
      setLoading(false);
    }
  }, [currentUser, handleApiError]);

  useEffect(() => {
    fetchMyProjects();
  }, [fetchMyProjects]);

  // Enhanced status update with loading states
  const updateProjectStatus = useCallback(
    async (
      projectId: string,
      status: ProjectStatus,
      selectedFreelancer?: string
    ) => {
      setProcessingStates(prev => ({ ...prev, [projectId]: true }));

      try {
        await axios.post('/api/projects/accept', {
          projectId,
          status,
          selectedFreelancer,
        });

        // Success notification with better UX
        const statusMessage = `Project status updated to "${status}"`;
        toast.success(statusMessage);
        setProjects((prev) =>
          prev.map((proj) => {
            if (proj._id !== projectId) return proj;

            let updatedFreelancer: Applicant | undefined =
              typeof proj.selectedFreelancer === 'object' && proj.selectedFreelancer !== null
                ? (proj.selectedFreelancer as Applicant)
                : undefined;

            if (status === 'In Progress' && selectedFreelancer) {
              const freelancer = proj.applicants.find((a) => a._id === selectedFreelancer);
              updatedFreelancer = freelancer;
            } else if (status === 'Open') {
              updatedFreelancer = undefined;
            }

            return {
              ...proj,
              status,
              selectedFreelancer: updatedFreelancer,
            };
          })
        );
      } catch (err) {
        const errorMessage = handleApiError(err);
        toast.error(`Error updating project status: ${errorMessage}`);
      } finally {
        setProcessingStates(prev => ({ ...prev, [projectId]: false }));
      }
    },
    [handleApiError, setProjects, setProcessingStates]
  );

  const deleteProject = async (projectId: string) => {
    setProcessingStates(prev => ({ ...prev, [projectId]: true }));

    try {
      await axios.delete(`/api/projects/delete?projectId=${projectId}`);
      toast.success('Project deleted successfully!');
      setProjects((prev) => prev.filter((proj) => proj._id !== projectId));
    } catch (err) {
      const errorMessage = handleApiError(err);
      toast.error(`Error deleting project: ${errorMessage}`);
    } finally {
      setProcessingStates(prev => ({ ...prev, [projectId]: false }));
    }
  };

  const acceptApplicant = useCallback((projectId: string, applicantId: string) => {
    updateProjectStatus(projectId, 'In Progress', applicantId);
  }, [updateProjectStatus]);

  const reassignApplicant = useCallback((projectId: string, newApplicantId: string) => {
    updateProjectStatus(projectId, 'In Progress', newApplicantId);
  }, [updateProjectStatus]);

  // Status badge component with enhanced styling
  const StatusBadge: React.FC<{ status: ProjectStatus }> = ({ status }) => {
    const getStatusStyles = (status: ProjectStatus): string => {
      switch (status) {
        case 'Open':
          return 'bg-blue-900/30 text-blue-300 border-blue-500/50';
        case 'Pending':
          return 'bg-yellow-900/30 text-yellow-300 border-yellow-500/50';
        case 'In Progress':
          return 'bg-purple-900/30 text-purple-300 border-purple-500/50';
        case 'Completed':
          return 'bg-green-900/30 text-green-300 border-green-500/50';
        case 'Cancelled':
          return 'bg-red-900/30 text-red-300 border-red-500/50';
        case 'Dispute':
          return 'bg-orange-900/30 text-orange-300 border-orange-500/50';
        default:
          return 'bg-gray-900/30 text-gray-300 border-gray-500/50';
      }
    };

    return (
      <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusStyles(status)}`}>
        {status}
      </span>
    );
  };

  // Loading spinner component
  const LoadingSpinner: React.FC = () => (
    <div className="flex justify-center items-center p-8">
      <div className="animate-spin rounded-full h-8 w-8 border-b-4 border-purple-500"></div>
      <span className="ml-2 text-gray-400">Loading your projects...</span>
    </div>
  );

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="bg-gray-800 p-8 rounded-lg shadow-xl border border-gray-700">
          <div className="text-center text-gray-300">
            <div className="mb-4">
              <svg className="mx-auto h-12 w-12 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-200 mb-2">Authentication Required</h3>
            <p>Please login to view your projects.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">My Posted Projects</h1>
          <p className="text-gray-400">Manage and track your project listings</p>
        </div>

        {/* Loading State */}
        {loading && <LoadingSpinner />}

        {/* Error State */}
        {error && (
          <div className="bg-blue-900/20 border border-red-500/50 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <svg className="h-5 w-5 text-red-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-red-300 font-medium">Error: {error}</span>
            </div>
            <button
              onClick={fetchMyProjects}
              className="mt-2 text-red-400 hover:text-red-300 underline text-sm"
            >
              Try again
            </button>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && projects.length === 0 && (
          <div className="text-center py-12">
            <div className="bg-gray-800 rounded-lg p-8 border border-gray-700">
              <svg className="mx-auto h-16 w-16 text-gray-600 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <h3 className="text-xl font-medium text-gray-300 mb-2">No Projects Yet</h3>
                <p className="text-gray-500">You haven&apos;t posted any projects yet. Start by creating your first project!</p>
            </div>
          </div>
        )}
        
        {/* Projects Grid */}
        {!loading && !error && projects.length > 0 && (
          <div className="grid gap-6">
            {projects.map((project) => (
              <div
                key={project._id}
                className="bg-zinc-800 border border-purple-700 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-200 hover:border-gray-600"
              >
                
                {/* Project Header */}
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-white mb-2 hover:text-blue-400 transition-colors">
                      {project.title}
                    </h3>
                    <div className="flex items-center gap-3 mb-3">
                      <StatusBadge status={project.status} />
                      <span className="text-gray-400 text-sm">
                        Deadline: {new Date(project.deadline).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </span>
                    </div>
                  </div>
                  
                  {!project.confirm && (
                    <button
                      onClick={() => deleteProject(project._id)}
                      disabled={processingStates[project._id]}
                      className="bg-red-600 hover:bg-red-700 disabled:bg-red-800 disabled:cursor-not-allowed text-white px-4 py-2 rounded-xl text-sm font-medium duration-200 flex items-center gap-2 transform transition-transform hover:scale-105"
                    >
                      {processingStates[project._id] ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        Deleting...
                      </>
                      ) : (
                      'Delete'
                      )}
                    </button>
                  )}
                </div>

                {/* Project Details */}
                <div className="space-y-3 mb-6">
                  <ProjectDescription 
                    description={project.description}
                    title={project.title}
                    maxLength={150}
                  />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <span className="text-gray-400">Budget:</span>
                      <span className="text-green-400 font-medium">{project.budget}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-gray-400">Category:</span>
                      <span className="text-gray-300">{project.category}</span>
                    </div>
                  </div>

                  {project.skillsRequired.length > 0 && (
                    <div>
                      <span className="text-gray-400 text-sm">Skills Required:</span>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {project.skillsRequired.map((skill, index) => (
                          <span
                            key={index}
                            className="bg-blue-900/30 text-blue-300 px-3 py-1 rounded-full text-xs border border-blue-500/30"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Applicants Section */}
                <div className="border-t border-gray-700 pt-4">
                  <h4 className="font-semibold text-gray-200 mb-3 flex items-center gap-2">
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.196-2.196M17 20H7m10 0v-2c0-5.523-4.477-10-10-10s-10 4.477-10 10v2m10 0H7m0 0v-2a3 3 0 015.196-2.196M7 20v-2m0 0v-2c0-5.523 4.477-10 10-10s-10 4.477-10 10v2m0 2h10"
                      />
                    </svg>
                    Applicants ({project.applicants.length})
                  </h4>
                  
                  {project.applicants.length === 0 ? (
                    <p className="text-gray-500 italic">No applicants yet.</p>
                  ) : (
                    <div className="space-y-3">
                      {project.applicants.map((applicant) => (
                        <div key={applicant._id} className="bg-zinc-700 rounded-xl p-4 border border-purple-600">
                          <div className="flex justify-between items-center">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-medium text-sm">
                                {applicant.username.charAt(0).toUpperCase()}
                              </div>
                              <span className="text-gray-200 font-medium">{applicant.username}</span>
                            </div>
                            
                            <div className="flex items-center gap-2">
                              {project.status === 'Open' && (
                                <button
                                  onClick={() => acceptApplicant(project._id, applicant._id)}
                                  disabled={processingStates[project._id]}
                                  className="bg-green-800 hover:bg-green-700 disabled:bg-green-800 disabled:cursor-not-allowed text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors duration-200"
                                >
                                  {processingStates[project._id] ? 'Processing...' : 'Accept'}
                                </button>
                              )}
                              
                              {(project.selectedFreelancer as Applicant)?._id === applicant._id && (
                                <div className="flex items-center gap-2">
                                  <span
                                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                                      project.confirm 
                                        ? 'bg-green-900/30 text-green-300 border border-green-500/50' 
                                        : 'bg-yellow-900/30 text-yellow-300 border border-yellow-500/50'
                                    }`}
                                  >
                                    {project.confirm ? 'Confirmed' : 'Pending Confirmation'}
                                  </span>
                                  
                                  {!project.confirm && (
                                    <button
                                      onClick={() => updateProjectStatus(project._id, 'Open')}
                                      disabled={processingStates[project._id]}
                                      className="bg-red-600 hover:bg-red-700 disabled:bg-red-800 disabled:cursor-not-allowed text-white px-3 py-1 rounded-lg text-sm transition-colors duration-200"
                                    >
                                      Cancel Assignment
                                    </button>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Reassignment Section */}
                {project.status === 'In Progress' && !project.confirm && project.applicants.length > 1 && (
                  <div className="border-t border-gray-700 pt-4 mt-4">
                    <h5 className="font-semibold text-gray-200 mb-3">Reassign to another applicant:</h5>
                    <div className="flex flex-wrap gap-2">
                      {project.applicants
                        .filter((a) => a._id !== (project.selectedFreelancer as Applicant)?._id)
                        .map((applicant) => (
                          <button
                            key={applicant._id}
                            onClick={() => reassignApplicant(project._id, applicant._id)}
                            disabled={processingStates[project._id]}
                            className="bg-purple-600 hover:bg-purple-700 disabled:bg-purple-800 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
                          >
                            {applicant.username}
                          </button>
                        ))}
                    </div>
                  </div>
                )}

                {/* Completion Status */}
                {project.status === 'Completed' && (
                  <div className="border-t border-gray-700 pt-4 mt-4">
                    <div className="flex items-center gap-2 text-green-400 font-semibold">
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Project Completed Successfully
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Accepthing_project_list;
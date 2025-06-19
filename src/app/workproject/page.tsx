'use client';
import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import axios from 'axios';
import { X, Calendar, DollarSign, Tag, User, Clock, CheckCircle, Eye } from 'lucide-react';

interface User {
  username: string;
}

interface Applicant {
  _id: string;
  username: string;
}

interface Project {
  _id: string;
  title: string;
  description: string;
  budget: string;
  skillsRequired: string[];
  deadline: string;
  category: string;
  status: string;
  userId: User;
  applicants: Applicant[];
  assignedTo?: Applicant;
}

const ProjectsList: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const username = useSession().data?.user?.username || '';
  const session = useSession();
  const freelancerId = session.data?.user?.id || '';

  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get('/api/projects');
        setProjects(response.data);
      } catch (err: any) {
        setError(err.response?.data?.message || err.message || 'Error fetching projects');
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const showNotification = (message: string, type: 'success' | 'error') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const applyToProject = async (projectId: string) => {
    try {
      await axios.post('/api/projects/apply', { username, projectId });
      showNotification('Applied successfully!', 'success');
      setProjects((prev) =>
        prev.map((proj) =>
          proj._id === projectId
            ? {
                ...proj,
                applicants: [...proj.applicants, { _id: '', username }],
              }
            : proj
        )
      );
    } catch (err: any) {
      showNotification('Error applying to project: ' + (err.response?.data?.message || err.message), 'error');
    }
  };

  const withdrawFromProject = async (projectId: string) => {
    try {
      if (!freelancerId) {
        showNotification('You must be logged in to withdraw your application.', 'error');
        return;
      }

      await axios.post('/api/projects/unapply', { projectId, freelancerId });
      showNotification('Application withdrawn successfully!', 'success');

      setProjects((prevProjects) =>
        prevProjects.map((proj) => {
          if (proj._id !== projectId) return proj;

          const updatedApplicants = proj.applicants.filter(a => a.username !== username);
          const updatedAssignedTo =
            proj.assignedTo?.username === username ? undefined : proj.assignedTo;

          return {
            ...proj,
            applicants: updatedApplicants,
            assignedTo: updatedAssignedTo,
            status: 'Open',
          };
        })
      );
    } catch (err: any) {
      showNotification('Error withdrawing application: ' + (err.response?.data?.message || err.message), 'error');
    }
  };

  const truncateText = (text: string, maxLength: number) => {
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'open':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'in progress':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'completed':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'closed':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          <p className="text-gray-400 text-lg">Loading projects...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-6 max-w-md">
          <p className="text-red-400 text-center">Error: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-800 text-white">
      {/* Notification */}
      {notification && (
        <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg ${
          notification.type === 'success' 
            ? 'bg-green-500/20 border border-green-500/30 text-green-400' 
            : 'bg-red-500/20 border border-red-500/30 text-red-400'
        }`}>
          {notification.message}
        </div>
      )}

      {/* Header */}
      <div className="bg-zinc-950 border-b border-gray-700 py-8">
        <div className="max-w-6xl mx-auto px-5">
          <h1 className="text-3xl font-bold text-center bg-gradient-to-r from-purple-400 to-purple-500 bg-clip-text text-transparent">
            Project Proposals
          </h1>
          <p className="text-gray-400 text-center mt-2">Discover and apply to exciting projects</p>
        </div>
      </div>

      {/* Projects Grid */}
      <div className="max-w-6xl mx-auto p-6">
        {projects.length === 0 ? (
          <div className="text-center py-20">
            <div className="bg-zinc-700 rounded-lg p-8 max-w-md mx-auto">
              <p className="text-gray-400 text-lg">No projects found.</p>
              <p className="text-gray-500 text-sm mt-2">Check back later for new opportunities!</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => {
              const isOwner = project.userId.username === username;
              const hasApplied = project.applicants.some((a) => a.username === username);

              return (
                <div
                  key={project._id}
                  className="bg-gray-800 rounded-xl border border-gray-700 hover:border-gray-600 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10 overflow-hidden group"
                >
                  {/* Card Header */}
                  <div className="p-6 border-b border-gray-700">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors line-clamp-2">
                        {project.title}
                      </h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(project.status)}`}>
                        {project.status}
                      </span>
                    </div>
                    
                    <p className="text-gray-300 leading-relaxed mb-4">
                      {truncateText(project.description, 120)}
                      {project.description.length > 120 && (
                        <button
                          onClick={() => setSelectedProject(project)}
                          className="text-blue-400 hover:text-blue-300 ml-2 inline-flex items-center text-sm"
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          Read more
                        </button>
                      )}
                    </p>

                    <div className="flex items-center text-gray-400 text-sm mb-2">
                      <User className="w-4 h-4 mr-2" />
                      <span>by {project.userId?.username || 'Unknown'}</span>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-6 space-y-3">
                    <div className="flex items-center text-gray-300">
                      <DollarSign className="w-4 h-4 mr-3 text-green-400" />
                      <span className="font-semibold text-green-400">{project.budget}</span>
                    </div>

                    <div className="flex items-center text-gray-300">
                      <Calendar className="w-4 h-4 mr-3 text-blue-400" />
                      <span>{new Date(project.deadline).toLocaleDateString()}</span>
                    </div>

                    <div className="flex items-center text-gray-300">
                      <Tag className="w-4 h-4 mr-3 text-purple-400" />
                      <span>{project.category}</span>
                    </div>

                    <div className="flex items-center text-gray-300">
                      <Clock className="w-4 h-4 mr-3 text-orange-400" />
                      <span>{project.applicants.length} applicant{project.applicants.length !== 1 ? 's' : ''}</span>
                    </div>

                    {/* Skills */}
                    <div className="pt-2">
                      <div className="flex flex-wrap gap-2">
                        {project.skillsRequired.slice(0, 3).map((skill, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-gray-700 text-gray-300 rounded-full text-xs"
                          >
                            {skill}
                          </span>
                        ))}
                        {project.skillsRequired.length > 3 && (
                          <span className="px-2 py-1 bg-gray-700 text-gray-400 rounded-full text-xs">
                            +{project.skillsRequired.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Card Footer */}
                  {!isOwner && (
                    <div className="p-6 pt-0">
                      {hasApplied ? (
                        <button
                          onClick={() => withdrawFromProject(project._id)}
                          className="w-full bg-red-600 hover:bg-red-700 text-white py-3 px-4 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center"
                        >
                          <X className="w-4 h-4 mr-2" />
                          Withdraw Application
                        </button>
                      ) : (
                        <button
                          onClick={() => applyToProject(project._id)}
                          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center"
                        >
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Apply Now
                        </button>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Project Detail Modal */}
      {selectedProject && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-2xl border border-gray-700 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-700">
              <h2 className="text-2xl font-bold text-white">{selectedProject.title}</h2>
              <button
                onClick={() => setSelectedProject(null)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-white mb-3">Description</h3>
                <p className="text-gray-300 leading-relaxed">{selectedProject.description}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center text-gray-300">
                    <DollarSign className="w-5 h-5 mr-3 text-green-400" />
                    <div>
                      <p className="text-sm text-gray-400">Budget</p>
                      <p className="font-semibold text-green-400">{selectedProject.budget}</p>
                    </div>
                  </div>

                  <div className="flex items-center text-gray-300">
                    <Calendar className="w-5 h-5 mr-3 text-blue-400" />
                    <div>
                      <p className="text-sm text-gray-400">Deadline</p>
                      <p className="font-semibold">{new Date(selectedProject.deadline).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center text-gray-300">
                    <Tag className="w-5 h-5 mr-3 text-purple-400" />
                    <div>
                      <p className="text-sm text-gray-400">Category</p>
                      <p className="font-semibold">{selectedProject.category}</p>
                    </div>
                  </div>

                  <div className="flex items-center text-gray-300">
                    <User className="w-5 h-5 mr-3 text-orange-400" />
                    <div>
                      <p className="text-sm text-gray-400">Posted by</p>
                      <p className="font-semibold">{selectedProject.userId?.username || 'Unknown'}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-white mb-3">Required Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedProject.skillsRequired.map((skill, index) => (
                    <span
                      key={index}
                      className="px-3 py-2 bg-gray-700 text-gray-300 rounded-full text-sm"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-gray-700">
                <span className={`px-4 py-2 rounded-full text-sm font-medium border ${getStatusColor(selectedProject.status)}`}>
                  {selectedProject.status}
                </span>
                <span className="text-gray-400">
                  {selectedProject.applicants.length} applicant{selectedProject.applicants.length !== 1 ? 's' : ''}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectsList;
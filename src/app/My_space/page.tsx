'use client';
import { Briefcase, FolderOpen, ArrowLeft, PenTool, X, Star, Send, Sparkles, MessageCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from 'next-auth/react';
import axios from 'axios';

export default function ClaudeInterface() {
  const [hoveredCard, setHoveredCard] = useState<null | 'back' | 'job' | 'project' | 'blog'>(null);
  const [loaded, setLoaded] = useState(false);
  const [showBlogModal, setShowBlogModal] = useState(false);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [rating, setRating] = useState(5);
  
  const router = useRouter();
  const { data: session } = useSession();
  const userId = session?.user?.id || '';

  useEffect(() => {
    setLoaded(false);
    const timer = setTimeout(() => {
      setLoaded(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const handleBackClick = () => {
    router.push('/dashboard')
  };
  
  const handleJobClick = () => {
    router.push('/Job_verse')
  }
  
  const handleProjectClick = () => {
    router.push('/project_verse')
  }

  const handleBlogSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await axios.post('/api/testimonials', {
        userId,
        message,
        rating,
      });

      if (res.data.success) {
        setSuccess(true);
        setMessage('');
        setRating(5);
        // Auto close after 2 seconds
        setTimeout(() => {
          setShowBlogModal(false);
          setSuccess(false);
        }, 2000);
      } else {
        setError('Something went wrong!');
      }
    } catch (err) {
      setError('Error submitting testimonial');
    } finally {
      setLoading(false);
    }
  };

  const renderStars = () => {
    return (
      <div className="flex items-center justify-center gap-2 mb-6">
        <span className="text-gray-300 text-sm font-medium mr-2">Rating:</span>
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => setRating(star)}
            className={`transition-all duration-300 hover:scale-110 ${
              star <= rating 
                ? 'text-yellow-400 drop-shadow-lg' 
                : 'text-gray-600 hover:text-yellow-400'
            }`}
          >
            <Star className="w-6 h-6" fill={star <= rating ? 'currentColor' : 'none'} />
          </button>
        ))}
        <span className="text-purple-400 text-sm font-medium ml-2">({rating}/5)</span>
      </div>
    );
  };

  return (
    <div className="bg-black min-h-screen md:pt-0 pt-20 text-white flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Ambient Background Effects */}
      {/* <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500 rounded-full blur-3xl opacity-5 animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500 rounded-full blur-3xl opacity-5 animate-pulse delay-1000"></div>
        <div className="absolute top-3/4 left-1/2 w-64 h-64 bg-purple-400 rounded-full blur-2xl opacity-10 animate-pulse delay-500"></div>
      </div> */}

      {/* Back Button */}
      <button
        onClick={handleBackClick}
        className={`absolute top-6 left-6 flex items-center gap-2 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 border border-zinc-800 hover:border-purple-500 rounded-lg px-4 py-2 transition-all duration-300 shadow-lg hover:shadow-xl ${hoveredCard === 'back' ? 'scale-105' : ''} ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'} z-10`}
        aria-label="Back to Dashboard"
        onMouseEnter={() => setHoveredCard('back')}
        onMouseLeave={() => setHoveredCard(null)}
        style={{ transitionDelay: '100ms' }}
      >
        <ArrowLeft size={18} className="text-white" />
        <span className="text-sm font-medium">Dashboard</span>
      </button>

      {/* Blog Posting Button */}
      <button
        onClick={() => setShowBlogModal(true)}
        className={`absolute top-6 right-6 flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 border border-zinc-800 hover:border-emerald-500 rounded-lg px-4 py-2 transition-all duration-300 shadow-lg hover:shadow-xl ${hoveredCard === 'blog' ? 'scale-105' : ''} ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'} z-10`}
        onMouseEnter={() => setHoveredCard('blog')}
        onMouseLeave={() => setHoveredCard(null)}
        style={{ transitionDelay: '150ms' }}
      >
        <PenTool size={18} className="text-white" />
        <span className="text-sm font-medium">Share Review</span>
      </button>

      <div className={`mb-6  flex items-center gap-2 transition-opacity duration-700 ease-in-out ${loaded ? 'opacity-100' : 'opacity-0'} z-10 relative`}>
        <div className="text-purple-500 text-2xl animate-pulse">●</div>
        <h1 className="text-2xl font-medium">WorkLink</h1>
      </div>
      
      <h2 className={`text-4xl font-light mb-12 text-center transition-opacity duration-700 ease-in-out delay-100 ${loaded ? 'opacity-100' : 'opacity-0'} z-10 relative`}>
        How would you like to proceed?
      </h2>
      
      <div className="flex flex-col md:flex-row gap-8 w-full max-w-5xl justify-center z-10 relative">
        <button
          onClick={handleJobClick}
          className={`group bg-gradient-to-br from-zinc-800 via-zinc-900 to-black border border-zinc-700 hover:border-purple-500 rounded-xl p-8 w-full md:w-80 md:h-96 flex flex-col items-center text-center transition-all duration-500 shadow-xl hover:shadow-2xl ${hoveredCard === 'job' ? 'scale-105 -translate-y-2' : ''} ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
          onMouseEnter={() => setHoveredCard('job')}
          onMouseLeave={() => setHoveredCard(null)}
          style={{ transitionDelay: '200ms' }}
        >
          <div className="relative">
            <div className={`absolute -inset-2 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full blur opacity-0 group-hover:opacity-30 transition-all duration-500`}></div>
            <div className="relative flex items-center justify-center h-24 w-24 mb-8">
              <Briefcase size={64} className={`transition-all duration-500 ${hoveredCard === 'job' ? 'text-purple-500 scale-110' : 'text-gray-400'}`} />
            </div>
          </div>
          <h3 className="text-2xl font-semibold mb-4 text-white">Job Verse</h3>
          <p className="text-zinc-400 text-sm leading-relaxed">
            Create job listings, review applications, manage recruitment workflows, and connect with top talent for your organization.
          </p>
        </button>
        
        <button 
          onClick={handleProjectClick}
          className={`group bg-gradient-to-br from-zinc-800 via-zinc-900 to-black border border-zinc-700 hover:border-purple-500 rounded-xl p-8 w-full md:w-80 md:h-96 flex flex-col items-center text-center transition-all duration-500 shadow-xl hover:shadow-2xl ${hoveredCard === 'project' ? 'scale-105 -translate-y-2' : ''} ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
          onMouseEnter={() => setHoveredCard('project')}
          onMouseLeave={() => setHoveredCard(null)}
          style={{ transitionDelay: '400ms' }}
        >
          <div className="relative">
            <div className={`absolute -inset-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full blur opacity-0 group-hover:opacity-30 transition-all duration-500`}></div>
            <div className="relative flex items-center justify-center h-24 w-24 mb-8">
              <FolderOpen size={64} className={`transition-all duration-500 ${hoveredCard === 'project' ? 'text-purple-500 scale-110' : 'text-gray-400'}`} />
            </div>
          </div>
          <h3 className="text-2xl font-semibold mb-4 text-white">Project Verse</h3>
          <p className="text-zinc-400 text-sm leading-relaxed">
            Get higher engagement and better proposals for your project listings. 
            Effortlessly manage submissions, collaborate with contributors, and bring your ideas to life with the right talent.
          </p>
        </button>
      </div>
      
      <div className={`mt-8 text-center text-purple-400 text-sm transition-opacity duration-700 ease-in-out delay-700 ${loaded ? 'opacity-100' : 'opacity-0'} z-10 relative`}>
        <div className="flex items-center justify-center gap-2">
          <Sparkles className="w-4 h-4" />
          <span>Click on an option to continue</span>
          <Sparkles className="w-4 h-4" />
        </div>
      </div>

      {/* Enhanced Blog Modal */}
      {showBlogModal && (
        <div className="fixed inset-0 bg-black bg-opacity-80 backdrop-blur-md z-50 flex items-center justify-center transition-all animate-in fade-in-0 duration-300 p-4">
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-purple-500 via-blue-500 to-emerald-500 rounded-2xl blur opacity-30 animate-pulse"></div>
            <div className="relative bg-gradient-to-br from-zinc-800 via-zinc-900 to-black border border-zinc-700 rounded-2xl shadow-2xl w-[600px] max-w-[95vw] max-h-[90vh] overflow-y-auto">
              {/* Header */}
              <div className="relative p-8 pb-4">
                <button 
                  className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors duration-300 hover:bg-zinc-700 p-2 rounded-full group" 
                  onClick={() => {
                    setShowBlogModal(false);
                    setMessage('');
                    setError(null);
                    setSuccess(false);
                  }}
                >
                  <X className="w-6 h-6" />
                </button>

                <div className="flex items-center mb-4">
                  <div className="relative">
                    <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-3 rounded-xl shadow-lg">
                      <MessageCircle className="w-8 h-8 text-white" />
                    </div>
                    <div className="absolute -inset-1 bg-gradient-to-r from-purple-500 to-emerald-500 rounded-xl blur opacity-20 animate-pulse"></div>
                  </div>
                  <div className="ml-4">
                    <h2 className="text-3xl font-bold text-white">Share Your Experience</h2>
                    <p className="text-gray-400 text-sm">Help others by sharing your thoughts and feedback</p>
                  </div>
                </div>
              </div>

              {/* Form */}
              <form onSubmit={handleBlogSubmit} className="p-8 pt-4 space-y-6">
                {/* Rating Section */}
                {renderStars()}

                {/* Message Input */}
                <div className="space-y-3">
                  <label className="block text-gray-300 text-sm font-medium">
                    Your Review <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <textarea
                      className="w-full bg-gradient-to-r from-zinc-900 to-zinc-800 border border-zinc-600 text-white placeholder-gray-400 rounded-xl p-4 text-base leading-relaxed focus:border-purple-500 focus:ring-2 focus:ring-purple-500 focus:ring-opacity-20 transition-all duration-300 resize-none min-h-[120px]"
                      placeholder="Share your experience, thoughts, or feedback about our platform..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      required
                    />
                    <div className="absolute bottom-3 right-3 text-xs text-gray-500">
                      {message.length}/500
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-purple-600 to-purple-600 hover:from-purple-700 hover:to-purple-700 text-white py-4 rounded-xl font-semibold text-lg transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 group"
                  disabled={loading || !userId || !message.trim()}
                >
                  {loading ? (
                    <>
                      <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full"></div>
                      <span>Submitting...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                      <span>Submit Review</span>
                    </>
                  )}
                </button>

                {/* Status Messages */}
                {success && (
                  <div className="bg-purple-500 text-white p-4 rounded-xl text-center font-medium animate-in slide-in-from-bottom-3 duration-300">
                    <div className="flex items-center justify-center gap-2">
                      <Sparkles className="w-5 h-5" />
                      <span>Review submitted successfully! Thank you for your feedback.</span>
                    </div>
                  </div>
                )}

                {error && (
                  <div className="bg-gradient-to-r from-red-600 to-rose-600 text-white p-4 rounded-xl text-center font-medium animate-in slide-in-from-bottom-3 duration-300">
                    {error}
                  </div>
                )}

                {!userId && (
                  <div className="bg-gradient-to-r from-yellow-600 to-orange-600 text-white p-4 rounded-xl text-center font-medium">
                    <div className="flex items-center justify-center gap-2">
                      <span>⚠️</span>
                      <span>You must be logged in to submit a review.</span>
                    </div>
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import Image from 'next/image';
import { 
  X, 
  Search, 
  MessageCircle, 
  Star, 
  Calendar, 
  User, 
  Quote,
  Filter,
  SortDesc,
  Heart,
  Share2,
  ChevronDown,
  MapPin,
  Mail,
  Phone,
  ExternalLink,
  Github,
  Linkedin,
  Twitter,
  Globe,
  Sparkles,
} from 'lucide-react';

interface Review {
  _id: string;
  username: string;
  profileImage?: string;
  message: string;
  rating?: number;
  createdAt: string;
  likes?: number;
  isVerified?: boolean;
}

interface Profile {
  _id: string;
  fullName?: string;
  bio?: string;
  email?: string;
  profileImage?: string;
  phone?: string;
  socialLinks?: {
    linkedin?: string;
    github?: string;
    twitter?: string;
    portfolio?: string;
  };
  skills?: string[];
  location?: string;
}

const CommunityReviews: React.FC = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [filteredReviews, setFilteredReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const [searchResult, setSearchResult] = useState<Profile | null>(null);
  const [searchLoading, setSearchLoading] = useState(false);
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'rating'>('newest');
  const [filterBy, setFilterBy] = useState<'all' | 'verified' | 'high-rating'>('all');
  const [showFilters, setShowFilters] = useState(false);
  const [expandedReview, setExpandedReview] = useState<string | null>(null);


  const applyFiltersAndSort = useCallback(() => {
    let filtered = [...reviews];

    switch (filterBy) {
      case 'verified':
        filtered = filtered.filter(t => t.isVerified);
        break;
      case 'high-rating':
        filtered = filtered.filter(t => (t.rating || 0) >= 4);
        break;
      default:
        break;
    }

    switch (sortBy) {
      case 'newest':
        filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case 'oldest':
        filtered.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
        break;
      case 'rating':
        filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
    }

    setFilteredReviews(filtered);
  }, [reviews, filterBy, sortBy]);

  useEffect(() => {
    fetchReviews();
  }, []);

  // Removed duplicate applyFiltersAndSort declaration to fix redeclaration error.

  useEffect(() => {
    applyFiltersAndSort();
  }, [applyFiltersAndSort]);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/testimonials');
      if (!response.ok) throw new Error('Failed to fetch reviews');
      const data = await response.json();
      setReviews(data.testimonials || []);
    } catch (err) {
      console.error('Error fetching reviews', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchInput.trim()) return;
    setSearchLoading(true);
    try {
      const response = await fetch(`/api/search/profile/${encodeURIComponent(searchInput)}`);
      if (!response.ok) throw new Error('User not found');
      const data = await response.json();
      setSearchResult(data.profile);
    } catch (err) {
      console.error(err);
      setSearchResult(null);
      alert('User not found!');
    }
    setSearchLoading(false);
  };

  const truncateMessage = (message: string, maxLength: number = 150) => {
    return message.length > maxLength ? `${message.substring(0, maxLength)}...` : message;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const renderStars = (rating: number = 0) => {
    return (
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 transition-all duration-300 ${
              star <= rating 
                ? 'text-yellow-400 fill-current drop-shadow-sm' 
                : 'text-zinc-600'
            }`}
          />
        ))}
      </div>
    );
  };

  const handleLike = async (reviewId: string) => {
    console.log('Like review:', reviewId);
  };

  const handleShare = async (review: Review) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Review by ${review.username}`,
          text: review.message,
          url: window.location.href,
        });
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      navigator.clipboard.writeText(`"${review.message}" - ${review.username}`);
      alert('Review copied to clipboard!');
    }
  };

  const getSocialIcon = (platform: string) => {
    switch (platform) {
      case 'linkedin': return <Linkedin className="w-4 h-4" />;
      case 'github': return <Github className="w-4 h-4" />;
      case 'twitter': return <Twitter className="w-4 h-4" />;
      case 'portfolio': return <Globe className="w-4 h-4" />;
      default: return <ExternalLink className="w-4 h-4" />;
    }
  };

  if (loading) {
    return (
      <div className="w-full bg-gradient-to-br from-black via-zinc-800 to-black min-h-screen flex justify-center items-center">
        <div className="flex flex-col items-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-transparent border-t-[#894cd1] border-r-[#894cd1] shadow-lg"></div>
            <div className="absolute inset-0 animate-ping rounded-full h-16 w-16 border-4 border-[#894cd1] opacity-20"></div>
          </div>
          <div className="mt-6 text-center">
            <p className="text-white text-lg font-medium">Loading community reviews...</p>
            <p className="text-zinc-400 text-sm mt-1">Discovering amazing experiences</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-gradient-to-br h-full  from-zinc-700 via-zinc-800 to-black relative overflow-y-auto">
      {/* Ambient Background Effects */}
      {/* <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#894cd1] rounded-full blur-3xl opacity-5 animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500 rounded-full blur-3xl opacity-5 animate-pulse delay-1000"></div>
        <div className="absolute top-3/4 left-1/2 w-64 h-64 bg-purple-400 rounded-full blur-2xl opacity-10 animate-pulse delay-500"></div>
      </div> */}

      <div className="relative z-10 p-6">
      

        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center mb-6">
              <div className="relative">
               
                <div className="absolute -inset-1 bg-gradient-to-r from-[#894cd1] to-purple-600 rounded-2xl blur opacity-25 animate-pulse"></div>
              </div>
              <div className="ml-6">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-white via-zinc-100 to-zinc-300 bg-clip-text text-transparent">
                   Blogs
                </h1>
                <div className="flex items-center justify-center mt-2">
                  <div className="h-1 w-20 bg-gradient-to-r from-[#894cd1] to-purple-600 rounded-full"></div>
                  <Sparkles className="w-4 h-4 text-[#894cd1] mx-2" />
                  <div className="h-1 w-20 bg-gradient-to-r from-purple-600 to-[#894cd1] rounded-full"></div>
                </div>
              </div>
            </div>
            <p className="text-zinc-300 text-sm max-w-3xl mx-auto leading-relaxed">
              Explore authentic experiences and success stories from our thriving community of creators, developers, and innovators
            </p>
          </div>

         

           

          

          {/* Enhanced Filters and Sort */}
          <div className="flex flex-wrap items-center justify-between mb-10 gap-6">
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="bg-gradient-to-r from-zinc-800 to-zinc-800 border-zinc-700 text-white hover:bg-gradient-to-r hover:from-zinc-700 hover:to-zinc-800 hover:border-[#894cd1] transition-all duration-300 shadow-lg"
              >
                <Filter className="w-4 h-4 mr-2" />
                Filters
                <ChevronDown className={`w-4 h-4 ml-2 transition-transform duration-300 ${showFilters ? 'rotate-180' : ''}`} />
              </Button>

              {showFilters && (
                <div className="flex items-center gap-3 animate-in slide-in-from-left-5 duration-300">
                 

                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="bg-gradient-to-r from-zinc-800 to-zinc-800 border border-zinc-700 text-white rounded-lg px-4 py-2 text-sm hover:border-[#894cd1] focus:border-[#894cd1] transition-all duration-300"
                  >
                    <option className='bg-zinc-800' value="newest">Newest First</option>
                    <option className='bg-zinc-800' value="oldest">Oldest First</option>
                    <option className='bg-zinc-800' value="rating">Highest Rating</option>
                  </select>
                </div>
              )}
            </div>

            <div className="flex items-center text-zinc-400 bg-zinc-800 px-4 py-2 rounded-lg border border-zinc-700">
              <SortDesc className="w-4 h-4 mr-2 text-[#894cd1]" />
              <span className="text-sm font-medium">Showing {filteredReviews.length} reviews</span>
            </div>
          </div>

          {/* Enhanced Reviews Grid */}
          {filteredReviews.length === 0 ? (
            <div className="text-center py-20">
              <div className="relative">
                <div className="bg-gradient-to-r from-zinc-800 to-zinc-800 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6 shadow-2xl">
                  <MessageCircle className="w-12 h-12 text-[#894cd1]" />
                </div>
                <div className="absolute inset-0 bg-[#894cd1] rounded-full w-24 h-24 mx-auto blur-xl opacity-20 animate-pulse"></div>
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">No reviews found</h3>
              <p className="text-zinc-400 text-lg">Be the first to share your amazing experience!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredReviews.map((review, index) => (
                <div key={review._id} className="group relative">
                  {/* Ambient Glow Effect */}
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-[#894cd1] via-purple-600 to-blue-500 rounded-2xl blur opacity-0 group-hover:opacity-20 transition-all duration-500"></div>
                  
                  <Card className="relative bg-gradient-to-br bg-zinc-700 border-zinc-700 hover:border-[#894cd1] transition-all duration-500  hover:shadow-2xl transform hover:-translate-y-2 backdrop-blur-sm">
                    <CardContent className="p-8">
                      {/* Enhanced Header */}
                      <div className="flex items-start justify-between mb-6">
                        <div className="flex items-center">
                          <div className="relative">
                            <div className="absolute -inset-1 bg-gradient-to-r from-[#894cd1] to-purple-600 rounded-full blur opacity-30"></div>
                            <Image
                              src={review.profileImage || '/api/placeholder/56/56'}
                              alt={review.username}
                              className="relative w-14 h-14 rounded-full object-cover border-2 border-zinc-700 shadow-lg"
                            />
                            {review.isVerified && (
                              <div className="absolute -bottom-1 -right-1 bg-gradient-to-r from-[#894cd1] to-purple-600 rounded-full p-1 shadow-lg">
                                <Star className="w-4 h-4 text-white fill-current" />
                              </div>
                            )}
                          </div>
                          <div className="ml-4">
                            <h3 className="font-bold text-white text-lg flex items-center">
                              {review.username}
                              {review.isVerified && (
                                <span className="ml-3 bg-gradient-to-r from-[#894cd1] to-purple-600 text-white px-3 py-1 rounded-full text-xs font-medium shadow-lg">
                                  ✓ Verified
                                </span>
                              )}
                            </h3>
                            <div className="flex items-center mt-2">
                              {renderStars(review.rating || 5)}
                              <span className="text-xs text-zinc-500 ml-3 flex items-center bg-zinc-800 px-2 py-1 rounded-full">
                                <Calendar className="w-3 h-3 mr-1" />
                                {formatDate(review.createdAt)}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="text-[#894cd1] opacity-50 group-hover:opacity-100 transition-opacity duration-300">
                          <Quote className="w-8 h-8" />
                        </div>
                      </div>

                      {/* Enhanced Message */}
                      <div className="mb-6">
                        <div className="bg-gradient-to-r from-zinc-800 to-zinc-800 p-4 rounded-xl border border-zinc-700">
                          <p className="text-zinc-200 leading-relaxed text-base">
                            {expandedReview === review._id 
                              ? review.message 
                              : truncateMessage(review.message)
                            }
                          </p>
                          {review.message.length > 150 && (
                            <button
                              onClick={() => setExpandedReview(
                                expandedReview === review._id ? null : review._id
                              )}
                              className="text-[#894cd1] text-sm hover:text-purple-400 mt-3 font-medium transition-colors duration-300"
                            >
                              {expandedReview === review._id ? 'Show less' : 'Read more'}
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Enhanced Actions */}
                      <div className="flex items-center justify-between pt-4 border-t border-zinc-700">
                        <div className="flex items-center space-x-6">
                         
                          <button 
                            onClick={() => handleShare(review)}
                            className="flex items-center text-zinc-400 hover:text-[#894cd1] transition-all duration-300 hover:scale-110"
                          >
                            <Share2 className="w-5 h-5 mr-2" />
                            <span className="text-sm font-medium">Share</span>
                          </button>
                        </div>
                        <div className="text-xs text-zinc-500 bg-zinc-800 px-3 py-1 rounded-full">
                          #{index + 1}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          )}

          {/* Enhanced Floating Search Button */}
          <div className="fixed bottom-8 right-8 z-40">
            <div className="relative group">
              <div className="absolute -inset-2 bg-gradient-to-r from-[#894cd1] to-purple-600 rounded-full blur opacity-40 group-hover:opacity-70 transition-all duration-300"></div>
              <Button 
                className="relative rounded-full p-5 shadow-2xl bg-gradient-to-r from-[#894cd1] to-purple-600 hover:from-purple-600 hover:to-[#894cd1] border-0 transform hover:scale-110 transition-all duration-300" 
                onClick={() => setSearchOpen(true)}
              >
                <Search className="w-8 h-8" />
              </Button>
            </div>
          </div>

          {/* Enhanced Search Modal */}
          {searchOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-80 backdrop-blur-md z-50 flex items-center justify-center transition-all animate-in fade-in-0 duration-300">
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-[#894cd1] to-purple-600 rounded-2xl blur opacity-30"></div>
                <div className="relative bg-gradient-to-br from-zinc-800 via-zinc-800 to-black border border-zinc-700 p-8 rounded-2xl shadow-2xl w-[500px] max-w-[90vw] max-h-[80vh] overflow-y-auto">
                  <button 
                    className="absolute top-4 right-4 text-zinc-400 hover:text-white transition-colors duration-300 hover:bg-zinc-700 p-2 rounded-full" 
                    onClick={() => {
                      setSearchOpen(false);
                      setSearchInput('');
                      setSearchResult(null);
                    }}
                  >
                    <X className="w-6 h-6" />
                  </button>

                  <div className="mb-8">
                    <div className="flex items-center mb-3">
                      <div className="bg-gradient-to-r from-[#894cd1] to-purple-600 p-2 rounded-lg mr-3">
                        <Search className="w-6 h-6 text-white" />
                      </div>
                      <h2 className="text-2xl font-bold text-white">Discover Profiles</h2>
                    </div>
                    <p className="text-zinc-400">Search for community members and explore their profiles</p>
                  </div>

                  <div className="flex space-x-3 mb-6">
                    <Input 
                      placeholder="Enter username to explore..." 
                      value={searchInput} 
                      onChange={(e) => setSearchInput(e.target.value)}
                      className="bg-gradient-to-r from-zinc-800 to-zinc-800 border-zinc-600 text-white placeholder-zinc-400 focus:border-[#894cd1] focus:ring-[#894cd1] text-sm p-4 rounded-xl"
                      onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                    />
                    <Button 
                      onClick={handleSearch} 
                      disabled={searchLoading || !searchInput.trim()}
                      className="bg-gradient-to-r from-[#894cd1] to-purple-600 hover:from-purple-600 hover:to-[#894cd1] text-white px-6 rounded-xl transition-all duration-300 disabled:opacity-50"
                    >
                      {searchLoading ? (
                        <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full"></div>
                      ) : (
                        'Search'
                      )}
                    </Button>
                  </div>

                  {searchResult && (
                    <div className="bg-gradient-to-br from-zinc-800 to-black p-6 border border-zinc-700 rounded-xl shadow-xl">
                      <div className="flex items-start space-x-4 mb-6">
                        <div className="relative">
                          <div className="absolute -inset-1 bg-gradient-to-r from-[#894cd1] to-purple-600 rounded-full blur opacity-50"></div>
                          <Image
                            src={searchResult.profileImage || '/api/placeholder/80/80'}
                            alt={searchResult.fullName || 'Profile'}
                            className="relative w-20 h-20 rounded-full object-cover border-2 border-zinc-700"
                          />
                        </div>
                        <div className="flex-1">
                          {searchResult.fullName && (
                            <h3 className="text-2xl font-bold text-white mb-1">{searchResult.fullName}</h3>
                          )}
                          <div className="flex items-center text-zinc-400 mb-2">
                            <Mail className="w-4 h-4 mr-2 text-[#894cd1]" />
                            <span className="text-sm">{searchResult.email}</span>
                          </div>
                          {searchResult.location && (
                            <div className="flex items-center text-zinc-400 mb-3">
                              <MapPin className="w-4 h-4 mr-2 text-[#894cd1]" />
                              <span className="text-sm">{searchResult.location}</span>
                            </div>
                          )}
                          {searchResult.phone && (
                            <div className="flex items-center text-zinc-400 mb-3">
                              <Phone className="w-4 h-4 mr-2 text-[#894cd1]" />
                              <span className="text-sm">{searchResult.phone}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {searchResult.bio && (
                        <div className="mb-6">
                          <h4 className="text-lg font-semibold text-white mb-2 flex items-center">
                            <User className="w-5 h-5 mr-2 text-[#894cd1]" />
                            About
                          </h4>
                          <p className="text-zinc-300 leading-relaxed bg-zinc-800 p-4 rounded-lg border border-zinc-700">
                            {searchResult.bio}
                          </p>
                        </div>
                      )}

                      {searchResult.skills && searchResult.skills.length > 0 && (
                        <div className="mb-6">
                          <h4 className="text-lg font-semibold text-white mb-3 flex items-center">
                            <Sparkles className="w-5 h-5 mr-2 text-[#894cd1]" />
                            Skills
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {searchResult.skills.map((skill, index) => (
                              <span
                                key={index}
                                className="bg-gradient-to-r from-[#894cd1] to-purple-600 text-white px-3 py-1 rounded-full text-xs font-medium shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                              >
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {searchResult.socialLinks && Object.keys(searchResult.socialLinks).length > 0 && (
                        <div>
                          <h4 className="text-lg font-semibold text-white mb-3 flex items-center">
                            <Globe className="w-5 h-5 mr-2 text-[#894cd1]" />
                            Connect
                          </h4>
                          <div className="flex flex-wrap gap-3">
                            {Object.entries(searchResult.socialLinks).map(([platform, url]) => (
                              url && (
                                <a
                                  key={platform}
                                  href={url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center bg-zinc-800 hover:bg-gradient-to-r hover:from-[#894cd1] hover:to-purple-600 text-zinc-300 hover:text-white px-4 py-2 rounded-lg transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl border border-zinc-700 hover:border-transparent group"
                                >
                                  {getSocialIcon(platform)}
                                  <span className="ml-2 text-sm font-medium capitalize">{platform}</span>
                                  <ExternalLink className="w-3 h-3 ml-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                </a>
                              )
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CommunityReviews;
'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Settings, User, Briefcase, List, Trash2, Edit3, BookOpen, LogOut, X, AlertTriangle } from 'lucide-react';
import { getSession, signOut } from 'next-auth/react';
import Image from 'next/image';

export default function SettingsPage() {
            const router = useRouter();
            const [username, setUsername] = useState<string>('');
            const [email, setEmail] = useState<string>('');
            const [profileImage, setProfileImage] = useState<string>('');
            const [showDeleteModal, setShowDeleteModal] = useState(false);
            const [isLoading, setIsLoading] = useState(true);
            const [isDeleting, setIsDeleting] = useState(false);

            useEffect(() => {
                        const fetchData = async () => {
                                    try {
                                                const session = await getSession();
                                                if (session?.user) {
                                                            setUsername(session.user.username);
                                                            setEmail(session.user.email);
                                                }

                                                const res = await fetch('/api/profile');
                                                const data = await res.json();
                                                if (data.success) {
                                                            setProfileImage(data.profile.profileImage || '');
                                                }
                                    } catch (err) {
                                                console.error('Failed to fetch profile data', err);
                                    } finally {
                                                setIsLoading(false);
                                    }
                        };

                        fetchData();
            }, []);

            const handleLogout = async () => {
                        await signOut();
            };

            const handleDeleteAccount = async () => {
                        setIsDeleting(true);
                        try {
                                    await fetch('/api/User/delete', { method: 'DELETE' });
                                    alert("Account deleted successfully.");
                                    await signOut();
                                    router.push('/');
                        } catch (err) {
                                    console.error("Failed to delete account", err);
                                    alert("Failed to delete account");
                        } finally {
                                    setIsDeleting(false);
                                    setShowDeleteModal(false);
                        }
            };

            const actionCards = [
                        {
                                    icon: Edit3,
                                    title: "Edit Profile",
                                    action: () => router.push('/profile_edit'),
                                    color: "text-[#894cd1]",
                                    bg: "bg-[#894cd1]/10 hover:bg-[#894cd1]/20"
                        },
                        {
                                    icon: Briefcase,
                                    title: "Edit Job",
                                    action: () => router.push('/job_edit'),
                                    color: "text-[#894cd1]",
                                    bg: "bg-[#894cd1]/10 hover:bg-[#894cd1]/20"
                        },
                        {
                                    icon: List,
                                    title: "Manage Jobs",
                                    action: () => router.push('/job-board'),
                                    color: "text-[#894cd1]",
                                    bg: "bg-[#894cd1]/10 hover:bg-[#894cd1]/20"
                        },
                        {
                                    icon: BookOpen,
                                    title: "View Profile",
                                    action: () => router.push('/profile-page'),
                                    color: "text-[#894cd1]",
                                    bg: "bg-[#894cd1]/10 hover:bg-[#894cd1]/20"
                        }
            ];

            if (isLoading) {
                        return (
                                    <div className="min-h-screen bg-zinc-800 flex items-center justify-center">
                                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#894cd1]"></div>
                                    </div>
                        );
            }

            return (
                        <div className="">
                                    {/* Main Container Card */}
                                    <div className="w-full bg-zinc-900/90 backdrop-blur-sm border-2 border-zinc-700/50 p-4 sm:p-8 shadow-2xl animate-slideUp">
                                                {/* Header Section - Username, Email, Action Buttons */}
                                                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 animate-fadeIn gap-4">
                                                            <div className="flex-1 w-full">
                                                                        <h1 className="text-2xl sm:text-3xl font-light text-white mb-2 animate-slideIn">
                                                                                    {username || 'Loading...'}
                                                                        </h1>
                                                                        <p className="text-zinc-400 text-base sm:text-lg font-light animate-slideIn" style={{animationDelay: '100ms'}}>
                                                                                    {email || 'Loading...'}
                                                                        </p>
                                                            </div>
                                                            {/* Action Buttons */}
                                                            <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 w-full md:w-auto animate-slideIn" style={{animationDelay: '200ms'}}>
                                                                        <button
                                                                                    onClick={() => setShowDeleteModal(true)}
                                                                                    className="w-full sm:w-auto px-3 sm:px-6 py-1.5 sm:py-3 text-sm sm:text-base bg-red-800/80 hover:bg-red-600/20 border border-zinc-600/50 hover:border-red-500/50 rounded-2xl text-zinc-300 hover:text-red-400 font-medium transition-all duration-300 hover:scale-105"
                                                                        >
                                                                                    Delete Account
                                                                        </button>
                                                                        <button
                                                                                    onClick={handleLogout}
                                                                                    className="w-full sm:w-auto px-3 sm:px-6 py-1.5 sm:py-3 text-sm sm:text-base bg-blue-800/80 hover:bg-blue-600/20 border border-zinc-600/50 hover:border-blue-500/50 rounded-2xl text-zinc-300 hover:text-blue-400 font-medium transition-all duration-300 hover:scale-105"
                                                                        >
                                                                                    logout
                                                                        </button>
                                                            </div>
                                                </div>

                                                {/* Divider Line */}
                                                <div className="h-px bg-gradient-to-r from-transparent via-zinc-600 to-transparent mb-8 animate-fadeIn" style={{animationDelay: '300ms'}}></div>

                                                {/* Profile Image Section */}
                                                <div className="mb-8 flex justify-center md:justify-start animate-slideIn" style={{animationDelay: '400ms'}}>
                                                            <div className="relative w-32 h-32 sm:w-56 sm:h-56 rounded-full border-2 border-zinc-600/50 hover:border-[#894cd1]/50 transition-all duration-300 overflow-hidden group cursor-pointer hover:scale-105 mx-auto md:mx-0">
                                                                        {profileImage ? (
                                                                                    <Image 
                                                                                                src={profileImage} 
                                                                                                alt="Profile" 
                                                                                                width={224} 
                                                                                                height={224}
                                                                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" 
                                                                                    />
                                                                        ) : (
                                                                                    <div className="w-full h-full bg-zinc-800/50 flex flex-col items-center justify-center group-hover:bg-[#894cd1]/10 transition-colors duration-300">
                                                                                                <User className="w-12 h-12 text-zinc-500 group-hover:text-[#894cd1] transition-colors duration-300" />
                                                                                                <span className="mt-4 text-xs text-zinc-500 group-hover:text-[#894cd1] transition-colors duration-300">
                                                                                                            profile image
                                                                                                </span>
                                                                                    </div>
                                                                        )}
                                                            </div>
                                                </div>

                                                {/* Bottom Divider Line */}
                                                <div className="h-px bg-gradient-to-r from-transparent via-zinc-600 to-transparent mb-8 animate-fadeIn" style={{animationDelay: '500ms'}}></div>

                                                {/* Action Cards Grid */}
                                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
                                                            {actionCards.map((card, index) => (
                                                                        <div
                                                                                    key={index}
                                                                                    className="animate-slideUp hover:animate-pulse flex justify-center md:justify-start"
                                                                                    style={{ animationDelay: `${600 + index * 100}ms` }}
                                                                        >
                                                                                    <button
                                                                                                onClick={card.action}
                                                                                                className={`w-5/6 aspect-square ${card.bg} border-2 bg-zinc-700/50 hover:border-[#894cd1]/50 rounded-3xl flex flex-col items-center justify-center gap-3 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-[#894cd1]/10 group`}
                                                                                    >
                                                                                                <card.icon className={`w-16 h-16 ${card.color} group-hover:scale-110 transition-transform duration-300`} />
                                                                                                <span className="text-white text-sm font-medium group-hover:text-[#894cd1] transition-colors duration-300">
                                                                                                            {card.title}
                                                                                                </span>
                                                                                    </button>
                                                                        </div>
                                                            ))}
                                                </div>
                                    </div>

                                    {/* Custom Delete Confirmation Modal */}
                                    {showDeleteModal && (
                                                <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4">
                                                            {/* Backdrop */}
                                                            <div 
                                                                        className="absolute inset-0 bg-black/80 backdrop-blur-md animate-fadeIn"
                                                                        onClick={() => setShowDeleteModal(false)}
                                                            ></div>
                                                            
                                                            {/* Modal */}
                                                            <div className="relative bg-zinc-900/95 backdrop-blur-sm rounded-3xl p-4 sm:p-8 w-full max-w-xs sm:max-w-md border-2 border-zinc-700/50 shadow-2xl animate-scaleIn">
                                                                        <button
                                                                                    onClick={() => setShowDeleteModal(false)}
                                                                                    className="absolute top-4 right-4 sm:top-6 sm:right-6 p-2 hover:bg-zinc-800/50 rounded-xl transition-colors duration-200"
                                                                        >
                                                                                    <X className="w-5 h-5 text-zinc-400" />
                                                                        </button>

                                                                        <div className="text-center pt-2">
                                                                                    <div className="w-12 h-12 sm:w-16 sm:h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                                                                                                <AlertTriangle className="w-8 h-8 text-red-400" />
                                                                                    </div>
                                                                                    
                                                                                    <h3 className="text-xl sm:text-2xl font-light text-white mb-2 sm:mb-3">Delete Account</h3>
                                                                                    <p className="text-zinc-400 text-sm sm:text-base leading-relaxed mb-6 sm:mb-8">
                                                                                                Are you sure you want to delete your account? This action cannot be undone and all your data will be permanently removed.
                                                                                    </p>

                                                                                    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                                                                                                <button
                                                                                                            onClick={() => setShowDeleteModal(false)}
                                                                                                            disabled={isDeleting}
                                                                                                            className="flex-1 px-4 sm:px-6 py-2 sm:py-3 bg-zinc-800/80 hover:bg-zinc-700/80 border border-zinc-600/50 text-white rounded-2xl font-medium transition-all duration-200 disabled:opacity-50 hover:scale-105"
                                                                                                >
                                                                                                            Cancel
                                                                                                </button>
                                                                                                <button
                                                                                                            onClick={handleDeleteAccount}
                                                                                                            disabled={isDeleting}
                                                                                                            className="flex-1 px-4 sm:px-6 py-2 sm:py-3 bg-red-600/80 hover:bg-red-500/80 border border-red-500/50 text-white rounded-2xl font-medium transition-all duration-200 disabled:opacity-50 flex items-center justify-center gap-2 hover:scale-105"
                                                                                                >
                                                                                                            {isDeleting ? (
                                                                                                                        <>
                                                                                                                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                                                                                                                    Deleting...
                                                                                                                        </>
                                                                                                            ) : (
                                                                                                                        'Delete Account'
                                                                                                            )}
                                                                                                </button>
                                                                                    </div>
                                                                        </div>
                                                            </div>
                                                </div>
                                    )}

                                    <style jsx>{`
                                                @keyframes fadeIn {
                                                            from { 
                                                                        opacity: 0;
                                                            }
                                                            to { 
                                                                        opacity: 1;
                                                            }
                                                }
                                                
                                                @keyframes slideIn {
                                                            from { 
                                                                        opacity: 0;
                                                                        transform: translateX(-20px);
                                                            }
                                                            to { 
                                                                        opacity: 1;
                                                                        transform: translateX(0);
                                                            }
                                                }
                                                
                                                @keyframes slideUp {
                                                            from { 
                                                                        opacity: 0;
                                                                        transform: translateY(30px);
                                                            }
                                                            to { 
                                                                        opacity: 1;
                                                                        transform: translateY(0);
                                                            }
                                                }
                                                
                                                @keyframes scaleIn {
                                                            from { 
                                                                        opacity: 0;
                                                                        transform: scale(0.9);
                                                            }
                                                            to { 
                                                                        opacity: 1;
                                                                        transform: scale(1);
                                                            }
                                                }
                                                
                                                .animate-fadeIn {
                                                            animation: fadeIn 0.6s ease-out forwards;
                                                }
                                                
                                                .animate-slideIn {
                                                            animation: slideIn 0.6s ease-out forwards;
                                                }
                                                
                                                .animate-slideUp {
                                                            animation: slideUp 0.6s ease-out forwards;
                                                }
                                                
                                                .animate-scaleIn {
                                                            animation: scaleIn 0.3s ease-out;
                                                }
                                    `}</style>
                        </div>
            );
}

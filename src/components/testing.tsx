import { useState } from 'react';
import { Mail, Phone, MapPin, Calendar, ExternalLink, Linkedin, Github, Twitter, Globe } from 'lucide-react';

export default function EnhancedUserProfile() {
  // This is a mock data set - in a real application this would come from props or context
  const [userData] = useState({
    fullName: "Jane Doe",
    email: "jane.doe@example.com",
    phone: "(555) 123-4567",
    location: "San Francisco, CA",
    createdAt: "2023-05-12T09:00:00Z",
    bio: "Passionate full-stack developer with over 5 years of experience building web applications with React, Node.js, and modern cloud technologies.",
    profileImage: "/api/placeholder/150/150",
    skills: ["React", "Node.js", "TypeScript", "AWS", "GraphQL", "Tailwind CSS"],
    experience: [
      "Senior Developer at TechCorp (2020-Present)",
      "Web Developer at StartupXYZ (2018-2020)",
      "Junior Developer at CodeAgency (2016-2018)"
    ],
    education: [
      "M.S. Computer Science, Tech University (2016)",
      "B.S. Software Engineering, State College (2014)"
    ],
    socialLinks: {
      linkedin: "https://linkedin.com/in/janedoe",
      github: "https://github.com/janedoe",
      twitter: "https://twitter.com/janedoe",
      portfolio: "https://janedoe.dev"
    }
  });

  const renderSocialIcons = () => {
    return (
      <div className="flex space-x-4 mt-4">
        {socialLinks?.linkedin && (
          <a href={userData.socialLinks.linkedin} target="_blank" rel="noopener noreferrer" 
             className="text-blue-600 hover:text-blue-800 transition-colors">
            <Linkedin size={20} />
          </a>
        )}
        {userData.socialLinks?.github && (
          <a href={userData.socialLinks.github} target="_blank" rel="noopener noreferrer" 
             className="text-gray-700 hover:text-gray-900 transition-colors">
            <Github size={20} />
          </a>
        )}
        {userData.socialLinks?.twitter && (
          <a href={userData.socialLinks.twitter} target="_blank" rel="noopener noreferrer" 
             className="text-blue-400 hover:text-blue-600 transition-colors">
            <Twitter size={20} />
          </a>
        )}
        {userData.socialLinks?.portfolio && (
          <a href={userData.socialLinks.portfolio} target="_blank" rel="noopener noreferrer" 
             className="text-green-600 hover:text-green-800 transition-colors">
            <Globe size={20} />
          </a>
        )}
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto my-12 bg-gradient-to-br from-white to-blue-50 rounded-xl overflow-hidden shadow-xl">
      {/* Header with background gradient */}
      <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-8 text-white">
        <div className="flex flex-col md:flex-row items-center md:items-start">
          {/* Profile Image */}
          <div className="relative mb-4 md:mb-0 md:mr-6">
            <div className="w-28 h-28 md:w-32 md:h-32 rounded-full overflow-hidden border-4 border-white shadow-lg">
              <img
                src={userData.profileImage}
                alt={userData.fullName}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          
          {/* User Name and Basic Info */}
          <div className="text-center md:text-left">
            <h1 className="text-3xl font-bold">{userData.fullName || "Anonymous User"}</h1>
            <div className="mt-2 flex flex-wrap items-center justify-center md:justify-start gap-y-1">
              <div className="flex items-center mr-4">
                <Calendar size={16} className="mr-1" />
                <span className="text-sm opacity-90">
                  Joined {userData.createdAt ? new Date(userData.createdAt).toLocaleDateString() : "N/A"}
                </span>
              </div>
              <div className="flex items-center">
                <MapPin size={16} className="mr-1" />
                <span className="text-sm opacity-90">{userData.location || "N/A"}</span>
              </div>
            </div>
            {renderSocialIcons()}
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="p-6 md:p-8">
        {/* Contact Info */}
        <div className="flex flex-wrap gap-4 mb-6 text-gray-700">
          <div className="flex items-center bg-white px-4 py-2 rounded-lg shadow-sm">
            <Mail size={18} className="text-blue-500 mr-2" />
            <span>{userData.email || "N/A"}</span>
          </div>
          <div className="flex items-center bg-white px-4 py-2 rounded-lg shadow-sm">
            <Phone size={18} className="text-blue-500 mr-2" />
            <span>{userData.phone || "N/A"}</span>
          </div>
        </div>
        
        {/* Bio */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-3 border-b border-gray-200 pb-2">Bio</h2>
          <p className="text-gray-700 leading-relaxed">{userData.bio || "No bio available"}</p>
        </div>
        
        {/* Two column layout for desktop */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Left Column */}
          <div>
            {/* Skills */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-3 border-b border-gray-200 pb-2">Skills</h2>
              {userData.skills && userData.skills.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {userData.skills.map((skill, index) => (
                    <span key={index} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                      {skill}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 italic">No skills listed</p>
              )}
            </div>
            
            {/* Experience */}
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-3 border-b border-gray-200 pb-2">Experience</h2>
              {userData.experience && userData.experience.length > 0 ? (
                <ul className="space-y-2">
                  {userData.experience.map((item, index) => (
                    <li key={index} className="bg-white p-3 rounded-lg shadow-sm">
                      <div className="flex">
                        <div className="mr-3 mt-1">
                          <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                        </div>
                        <span className="text-gray-700">{item}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500 italic">No experience listed</p>
              )}
            </div>
          </div>
          
          {/* Right Column */}
          <div>
            {/* Education */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-3 border-b border-gray-200 pb-2">Education</h2>
              {userData.education && userData.education.length > 0 ? (
                <ul className="space-y-2">
                  {userData.education.map((item, index) => (
                    <li key={index} className="bg-white p-3 rounded-lg shadow-sm">
                      <div className="flex">
                        <div className="mr-3 mt-1">
                          <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                        </div>
                        <span className="text-gray-700">{item}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500 italic">No education listed</p>
              )}
            </div>
            
            {/* Social Links (full displays) */}
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-3 border-b border-gray-200 pb-2">
                Social & Links
              </h2>
              <ul className="space-y-2">
                {userData.socialLinks?.linkedin && (
                  <li className="flex items-center">
                    <Linkedin size={18} className="text-blue-600 mr-2" />
                    <a
                      href={userData.socialLinks.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline flex items-center"
                    >
                      LinkedIn Profile
                      <ExternalLink size={14} className="ml-1" />
                    </a>
                  </li>
                )}
                {userData.socialLinks?.github && (
                  <li className="flex items-center">
                    <Github size={18} className="text-gray-700 mr-2" />
                    <a
                      href={userData.socialLinks.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-700 hover:underline flex items-center"
                    >
                      GitHub Profile
                      <ExternalLink size={14} className="ml-1" />
                    </a>
                  </li>
                )}
                {userData.socialLinks?.twitter && (
                  <li className="flex items-center">
                    <Twitter size={18} className="text-blue-400 mr-2" />
                    <a
                      href={userData.socialLinks.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:underline flex items-center"
                    >
                      Twitter Profile
                      <ExternalLink size={14} className="ml-1" />
                    </a>
                  </li>
                )}
                {userData.socialLinks?.portfolio && (
                  <li className="flex items-center">
                    <Globe size={18} className="text-green-600 mr-2" />
                    <a
                      href={userData.socialLinks.portfolio}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-green-600 hover:underline flex items-center"
                    >
                      Portfolio Website
                      <ExternalLink size={14} className="ml-1" />
                    </a>
                  </li>
                )}
                {!userData.socialLinks ||
                  (!userData.socialLinks.linkedin &&
                    !userData.socialLinks.github &&
                    !userData.socialLinks.twitter &&
                    !userData.socialLinks.portfolio) && (
                    <li className="text-gray-500 italic">No social links provided</li>
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
'use client';
import { 
  Search, 
  Users, 
  Briefcase, 
  Star, 
  ArrowRight, 
  CheckCircle, 
  Globe, 
  Shield, 
  Zap,
  Menu,
  X,
  Mail,
  Phone,
  MapPin,
  Facebook,
  Twitter,
  Linkedin,
  Instagram,
  Github,
  ExternalLink
} from 'lucide-react';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import {useRouter} from 'next/navigation';
import work_link_logo from '../Images/work_link_logo.png' // Adjust the path as necessary   
import worklink_name_logo from '../Images/worklink_name_logo.png'; // Adjust the path as necessary
const WorkLink = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [clickedElement, setClickedElement] = useState<string | null>(null);
  const router = useRouter();
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  function handleClick(elementId: string) {
    setClickedElement(elementId);
    setTimeout(() => setClickedElement(null), 200);
  }

  const stats = [
    { number: '50K+', label: 'Active Users' },
    { number: '10K+', label: 'Jobs Posted' },
    { number: '5K+', label: 'Freelancers' },
    { number: '98%', label: 'Success Rate' }
  ];

  const features = [
    {
      icon: <Search className="w-8 h-8" />,
      title: 'Smart Job Matching',
      description: 'AI-powered algorithm matches you with perfect opportunities based on your skills and preferences.'
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: 'Secure Payments',
      description: 'End-to-end encrypted payment system with escrow protection for all transactions.'
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: 'Real-time Collaboration',
      description: 'Built-in tools for seamless communication and project management with clients.'
    },
    {
      icon: <Globe className="w-8 h-8" />,
      title: 'Global Reach',
      description: 'Connect with opportunities and talent from around the world, breaking geographical barriers.'
    }
  ];

  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Full-stack Developer',
      image: '👩‍💻',
      text: 'WorkLink transformed my freelancing career. The platform is intuitive and the payment system is incredibly reliable.'
    },
    {
      name: 'Michael Chen',
      role: 'Startup Founder',
      image: '👨‍💼',
      text: 'Found amazing talent through WorkLink. The quality of freelancers and the project management tools are outstanding.'
    },
    {
      name: 'Emily Rodriguez',
      role: 'UI/UX Designer',
      image: '🎨',
      text: 'The best platform for creative professionals. Love the seamless workflow and professional community.'
    }
  ];

  return (
    <div className="min-h-screen bg-zinc-800 text-white overflow-x-hidden">
      {/* Navigation */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled ? 'bg-zinc-900/95 backdrop-blur-md shadow-lg' : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-2">
                <Image 
                  src={work_link_logo} 
                  alt="WorkLink Logo"
                  width={32}
                  height={32}
                  className="w-16 h-10"
                  />
                  <Image 
                    src={worklink_name_logo}
                    alt="WorkLink Name Logo"
                    width={150} 
                    height={50}
                    className="h-10"
                  />
              {/* <span className="text-3xl font-extrabold text-white bg-clip-text text-transparent">
                WorkLink
              </span> */}
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-8">
              <a 
                href="#home" 
                onClick={() => handleClick('nav-home')}
                className={`hover:text-[#894cd1] transition-all duration-200 ${
                  clickedElement === 'nav-home' ? 'scale-95 text-[#894cd1]' : ''
                }`}
              >
                Home
              </a>
              <a 
                href="#features" 
                onClick={() => handleClick('nav-features')}
                className={`hover:text-[#894cd1] transition-all duration-200 ${
                  clickedElement === 'nav-features' ? 'scale-95 text-[#894cd1]' : ''
                }`}
              >
                Features
              </a>
              <a 
                href="#about" 
                onClick={() => handleClick('nav-about')}
                className={`hover:text-[#894cd1] transition-all duration-200 ${
                  clickedElement === 'nav-about' ? 'scale-95 text-[#894cd1]' : ''
                }`}
              >
                About
              </a>
              <a 
                href="#testimonials" 
                onClick={() => handleClick('nav-testimonials')}
                className={`hover:text-[#894cd1] transition-all duration-200 ${
                  clickedElement === 'nav-testimonials' ? 'scale-95 text-[#894cd1]' : ''
                }`}
              >
                Reviews
              </a>
              <a 
                href="#contact" 
                onClick={() => handleClick('nav-contact')}
                className={`hover:text-[#894cd1] transition-all duration-200 ${
                  clickedElement === 'nav-contact' ? 'scale-95 text-[#894cd1]' : ''
                }`}
              >
                Contact
              </a>
            </div>

            {/* Auth Buttons */}
            <div className="hidden md:flex items-center space-x-4">
              <button 
                onClick={() => {handleClick('signin'),
                  router.push('/sign-in')}
                }
                className={`px-4 py-2 text-gray-300 hover:text-white transition-all duration-200 ${
                  clickedElement === 'signin' ? 'scale-95 text-white' : ''
                }`}
              >
                Sign In
              </button>
                <button 
                onClick={() => {
                  handleClick('getstarted');
                  router.push('/sign-up');
                }}
                className={`px-6 py-2 bg-gradient-to-r from-[#894cd1] to-purple-600 rounded-full hover:from-purple-600 hover:to-[#894cd1] transition-all duration-300 transform hover:scale-105 shadow-lg ${
                  clickedElement === 'getstarted' ? 'scale-95' : ''
                }`}
                >
                Get Started
                </button>
            </div>

            {/* Mobile Menu Button */}
            <button 
              className={`md:hidden transition-all duration-200 ${
                clickedElement === 'mobile-menu' ? 'scale-95' : ''
              }`}
              onClick={() => {
                setIsMenuOpen(!isMenuOpen);
                handleClick('mobile-menu');
              }}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="md:hidden bg-zinc-900/95 backdrop-blur-md rounded-lg mt-2 p-4 space-y-4 animate-in slide-in-from-top-2 duration-200">
              <a 
                href="#home" 
                onClick={() => handleClick('mobile-home')}
                className={`block hover:text-[#894cd1] transition-all duration-200 ${
                  clickedElement === 'mobile-home' ? 'scale-95 text-[#894cd1] translate-x-2' : ''
                }`}
              >
                Home
              </a>
              <a 
                href="#features" 
                onClick={() => handleClick('mobile-features')}
                className={`block hover:text-[#894cd1] transition-all duration-200 ${
                  clickedElement === 'mobile-features' ? 'scale-95 text-[#894cd1] translate-x-2' : ''
                }`}
              >
                Features
              </a>
              <a 
                href="#about" 
                onClick={() => handleClick('mobile-about')}
                className={`block hover:text-[#894cd1] transition-all duration-200 ${
                  clickedElement === 'mobile-about' ? 'scale-95 text-[#894cd1] translate-x-2' : ''
                }`}
              >
                About
              </a>
              <a 
                href="#testimonials" 
                onClick={() => handleClick('mobile-testimonials')}
                className={`block hover:text-[#894cd1] transition-all duration-200 ${
                  clickedElement === 'mobile-testimonials' ? 'scale-95 text-[#894cd1] translate-x-2' : ''
                }`}
              >
                Reviews
              </a>
              <a 
                href="#contact" 
                onClick={() => handleClick('mobile-contact')}
                className={`block hover:text-[#894cd1] transition-all duration-200 ${
                  clickedElement === 'mobile-contact' ? 'scale-95 text-[#894cd1] translate-x-2' : ''
                }`}
              >
                Contact
              </a>
              <div className="pt-4 border-t border-zinc-700 space-y-2">
                <button 
                  onClick={() => {handleClick('mobile-signin')
                    router.push('/sign-in');
                  }}
                  className={`block w-full text-left px-4 py-2 text-gray-300 hover:text-white transition-all duration-200 rounded ${
                    clickedElement === 'mobile-signin' ? 'scale-95 bg-zinc-800 text-white' : ''
                  }`}
                >
                  Sign In
                </button>
                <button 
                  onClick={() => {
                  handleClick('mobile-getstarted');
                  router.push('/sign-up');
                  }}
                  className={`block w-full px-4 py-2 rounded-full bg-gradient-to-r from-[#894cd1] to-purple-600 hover:from-purple-600 hover:to-[#894cd1] transition-all duration-300 ${
                  clickedElement === 'mobile-getstarted' ? 'scale-95' : ''
                  }`}
                >
                  Get Started
                </button>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" className="relative min-h-screen flex items-center justify-center pt-20">
        <div className="absolute inset-0 bg-gradient-to-br from-[#894cd1]/20 via-transparent to-purple-900/20"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#894cd1]/10 via-transparent to-transparent"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="mb-8 animate-pulse">
            <span className="inline-block px-4 py-2 bg-gradient-to-r from-[#894cd1]/20 to-purple-600/20 rounded-full text-sm font-medium border border-[#894cd1]/30">
               Join 50,000+ professionals worldwide
            </span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            Connect.{' '}
            <span className="bg-gradient-to-r from-[#894cd1] to-purple-400 bg-clip-text text-transparent">
              Work.
            </span>{' '}
            Succeed.
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
            The ultimate platform where talent meets opportunity. Find your dream job or hire the perfect freelancer with our AI-powered matching system.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <button 
              onClick={() => {handleClick('hero-findwork')
                router.push('/sign-up');
              }}
              className={`px-8 py-4 bg-gradient-to-r from-[#894cd1] to-purple-600 rounded-xl text-lg font-semibold hover:from-purple-600 hover:to-[#894cd1] transition-all duration-300 transform hover:scale-105 shadow-2xl ${
                clickedElement === 'hero-findwork' ? 'scale-95' : ''
              }`}
              
            >
              Find Work <ArrowRight className="inline w-5 h-5 ml-2" />
            </button>
            <button 
              onClick={() => handleClick('hero-hiretalent')}
              className={`px-8 py-4 border-2 border-[#894cd1] rounded-xl text-lg font-semibold hover:bg-[#894cd1]/10 transition-all duration-300 transform hover:scale-105 ${
                clickedElement === 'hero-hiretalent' ? 'scale-95 bg-[#894cd1]/20' : ''
              }`}
            >
              Hire Talent
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            {stats.map((stat, index) => (
              <div key={index} className="text-center transform hover:scale-105 transition-transform duration-300">
                <div className="text-2xl md:text-4xl font-bold bg-gradient-to-r from-[#894cd1] to-purple-400 bg-clip-text text-transparent mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-400 text-sm md:text-base">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-zinc-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Why Choose{' '}
              <span className="bg-gradient-to-r from-[#894cd1] to-purple-400 bg-clip-text text-transparent">
                WorkLink?
              </span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Powerful features designed to make your work life easier and more productive.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index} 
                onClick={() => handleClick(`feature-${index}`)}
                className={`group bg-zinc-800/50 backdrop-blur-sm p-8 rounded-2xl border border-zinc-700/50 hover:border-[#894cd1]/50 transition-all duration-300 transform hover:-translate-y-2 hover:shadow-2xl hover:shadow-[#894cd1]/20 cursor-pointer ${
                  clickedElement === `feature-${index}` ? 'scale-95 border-[#894cd1]/70 shadow-xl shadow-[#894cd1]/30' : ''
                }`}
              >
                <div className={`text-[#894cd1] mb-4 group-hover:scale-110 transition-transform duration-300 ${
                  clickedElement === `feature-${index}` ? 'scale-110' : ''
                }`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3 group-hover:text-[#894cd1] transition-colors">
                  {feature.title}
                </h3>
                <p className="text-gray-400 group-hover:text-gray-300 transition-colors">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                Revolutionizing the{' '}
                <span className="bg-gradient-to-r from-[#894cd1] to-purple-400 bg-clip-text text-transparent">
                  Future of Work
                </span>
              </h2>
              <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                WorkLink is more than just a platform – it&apos;s a community where ambition meets opportunity. 
                We&apos;re building the bridge between exceptional talent and visionary companies.
              </p>
              
              <div className="space-y-4 mb-8">
                {[
                  'AI-powered job matching algorithm',
                  'Secure escrow payment system',
                  '24/7 customer support',
                  'Global talent network'
                ].map((item, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <CheckCircle className="w-6 h-6 text-[#894cd1] flex-shrink-0" />
                    <span className="text-gray-300">{item}</span>
                  </div>
                ))}
              </div>
              
              <button 
                onClick={() => handleClick('about-learn-more')}
                className={`px-8 py-4 bg-gradient-to-r from-[#894cd1] to-purple-600 rounded-xl font-semibold hover:from-purple-600 hover:to-[#894cd1] transition-all duration-300 transform hover:scale-105 shadow-lg ${
                  clickedElement === 'about-learn-more' ? 'scale-95' : ''
                }`}
              >
                Learn More About Us
              </button>
            </div>
            
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-[#894cd1]/20 to-purple-600/20 rounded-3xl blur-3xl"></div>
              <div className="relative bg-zinc-800/50 backdrop-blur-sm p-8 rounded-3xl border border-zinc-700/50">
                <div className="grid grid-cols-2 gap-6">
                  {[
                    { icon: <Users className="w-8 h-8" />, title: 'Community', desc: 'Global network' },
                    { icon: <Shield className="w-8 h-8" />, title: 'Security', desc: 'Bank-grade' },
                    { icon: <Zap className="w-8 h-8" />, title: 'Speed', desc: 'Lightning fast' },
                    { icon: <Star className="w-8 h-8" />, title: 'Quality', desc: 'Top-rated' }
                  ].map((item, index) => (
                    <div 
                      key={index} 
                      onClick={() => handleClick(`about-feature-${index}`)}
                      className={`text-center p-4 bg-zinc-900/50 rounded-xl hover:bg-zinc-900/70 transition-all duration-300 cursor-pointer transform hover:scale-105 ${
                        clickedElement === `about-feature-${index}` ? 'scale-95 bg-zinc-900/80' : ''
                      }`}
                    >
                      <div className={`text-[#894cd1] mb-2 flex justify-center transition-transform duration-300 ${
                        clickedElement === `about-feature-${index}` ? 'scale-110' : ''
                      }`}>
                        {item.icon}
                      </div>
                      <h4 className="font-semibold mb-1">{item.title}</h4>
                      <p className="text-sm text-gray-400">{item.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 bg-zinc-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              What Our{' '}
              <span className="bg-gradient-to-r from-[#894cd1] to-purple-400 bg-clip-text text-transparent">
                Community
              </span>{' '}
              Says
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Real stories from real professionals who&apos;ve transformed their careers with WorkLink.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div 
                key={index} 
                onClick={() => handleClick(`testimonial-${index}`)}
                className={`bg-zinc-800/50 backdrop-blur-sm p-8 rounded-2xl border border-zinc-700/50 hover:border-[#894cd1]/50 transition-all duration-300 transform hover:-translate-y-2 hover:shadow-2xl hover:shadow-[#894cd1]/10 cursor-pointer ${
                  clickedElement === `testimonial-${index}` ? 'scale-95 border-[#894cd1]/70 shadow-xl shadow-[#894cd1]/20' : ''
                }`}
              >
                <div className="flex items-center mb-6">
                  <div className="text-4xl mr-4">{testimonial.image}</div>
                  <div>
                    <h4 className="font-semibold text-lg">{testimonial.name}</h4>
                    <p className="text-[#894cd1] text-sm">{testimonial.role}</p>
                  </div>
                </div>
                <p className="text-gray-300 leading-relaxed italic">&quot;{testimonial.text}&quot;</p>
                <div className="flex text-yellow-400 mt-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[#894cd1]/10 via-purple-600/10 to-[#894cd1]/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Transform Your{' '}
            <span className="bg-gradient-to-r from-[#894cd1] to-purple-400 bg-clip-text text-transparent">
              Career?
            </span>
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Join thousands of professionals who&apos;ve already discovered their next opportunity on WorkLink.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => {handleClick('cta-start-journey')
                router.push('/sign-up');
              }}
              className={`px-16 py-3 italic bg-gradient-to-r from-[#894cd1] to-purple-600 rounded-full text-lg font-semibold hover:from-purple-600 hover:to-[#894cd1] transition-all duration-300 transform hover:scale-105 shadow-2xl ${
                clickedElement === 'cta-start-journey' ? 'scale-95' : ''
              }`}
            >
              Start Your Journey
            </button>
            
          </div>
        </div>
      </section>

      {/* Awesome Footer */}
      <footer id="contact" className="relative bg-zinc-900 pt-20 pb-8 overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-b from-zinc-800 to-zinc-900"></div>
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#894cd1] to-transparent"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Main Footer Content */}
          <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-12 mb-16">
            {/* Company Info */}
            <div className="lg:col-span-2">
              <div className="flex items-center space-x-3 mb-6">
                 <Image 
                    src={work_link_logo}
                    alt="WorkLink Name Logo"
                    width={48}
                    height={48}
                    className="w-16 h-10"
                  />
                  <Image 
                    src={worklink_name_logo}
                    alt="WorkLink Name Logo"
                    width={150} 
                    height={50}
                    className="h-10"
                  />
                {/* <span className="text-3xl font-bold bg-gradient-to-r from-[#894cd1] to-purple-400 bg-clip-text text-transparent">
                  WorkLink
                </span> */}
              </div>
              <p className="text-gray-300 text-lg mb-8 max-w-md leading-relaxed">
                Connecting talent with opportunity worldwide. Build your career, grow your business, 
                and join the future of work with WorkLink.
              </p>
              
              {/* Social Links */}
              <div className="flex space-x-4">
                {[
                  { icon: <Facebook className="w-5 h-5" />, href: '#', id: 'facebook' },
                  { icon: <Twitter className="w-5 h-5" />, href: '#', id: 'twitter' },
                  { icon: <Linkedin className="w-5 h-5" />, href: '#', id: 'linkedin' },
                  { icon: <Instagram className="w-5 h-5" />, href: '#', id: 'instagram' },
                  { icon: <Github className="w-5 h-5" />, href: '#', id: 'github' }
                ].map((social, index) => (
                  <a 
                    key={index} 
                    href={social.href}
                    onClick={() => handleClick(`social-${social.id}`)}
                    className={`w-12 h-12 bg-zinc-800 hover:bg-gradient-to-br hover:from-[#894cd1] hover:to-purple-600 rounded-xl flex items-center justify-center transition-all duration-300 transform hover:scale-110 hover:shadow-lg hover:shadow-[#894cd1]/20 ${
                      clickedElement === `social-${social.id}` ? 'scale-95 bg-gradient-to-br from-[#894cd1] to-purple-600' : ''
                    }`}
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-xl font-semibold mb-6 text-white">Quick Links</h3>
              <ul className="space-y-4">
                {[
                  'Find Jobs', 'Post a Job', 'Browse Freelancers', 'Success Stories', 
                  'Help Center', 'Community', 'Blog', 'API'
                ].map((link, index) => (
                  <li key={index}>
                    <a href="#" className="text-gray-400 hover:text-[#894cd1] transition-all duration-300 flex items-center group">
                      <ArrowRight className="w-4 h-4 mr-2 opacity-0 group-hover:opacity-100 transform -translate-x-2 group-hover:translate-x-0 transition-all duration-300" />
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h3 className="text-xl font-semibold mb-6 text-white">Get in Touch</h3>
              <div className="space-y-6">
                <div className="flex items-start space-x-3">
                  <div className="w-10 h-10 bg-zinc-800 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                    <Mail className="w-5 h-5 text-[#894cd1]" />
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Email us at</p>
                    <a href="mailto:hello@worklink.com" className="text-white hover:text-[#894cd1] transition-colors">
                      hello@worklink.com
                    </a>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-10 h-10 bg-zinc-800 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                    <Phone className="w-5 h-5 text-[#894cd1]" />
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Call us at</p>
                    <a href="tel:+1234567890" className="text-white hover:text-[#894cd1] transition-colors">
                      +1 (234) 567-890
                    </a>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-10 h-10 bg-zinc-800 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                    <MapPin className="w-5 h-5 text-[#894cd1]" />
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Visit us at</p>
                    <p className="text-white">San Francisco, CA</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

         

          {/* Bottom Bar */}
          <div className="border-t border-zinc-700/50 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              <div className="text-gray-400 text-sm">
                © 2025 WorkLink. All rights reserved. Built with ❤️ for the global workforce.
              </div>
              <div className="flex space-x-6 text-sm">
                <a href="#" className="text-gray-400 hover:text-[#894cd1] transition-colors">Privacy Policy</a>
                <a href="#" className="text-gray-400 hover:text-[#894cd1] transition-colors">Terms of Service</a>
                <a href="#" className="text-gray-400 hover:text-[#894cd1] transition-colors">Cookie Policy</a>
              </div>
            </div>
          </div>
        </div>

        {/* Floating Elements */}
        <div className="absolute top-20 left-10 w-2 h-2 bg-[#894cd1] rounded-full animate-pulse"></div>
        <div className="absolute top-40 right-20 w-3 h-3 bg-purple-500 rounded-full animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 left-1/4 w-1 h-1 bg-[#894cd1] rounded-full animate-pulse delay-2000"></div>
      </footer>
    </div>
  );
};

export default WorkLink;
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDebounce } from "@uidotdev/usehooks";
import { motion, AnimatePresence } from 'framer-motion';
import * as z from 'zod';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import axios, { AxiosError } from 'axios';
import { Loader2, CheckCircle, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { signUpSchema } from '@/schemas/signUpSchema';

export default function SignUpForm() {
  const [username, setUsername] = useState('');
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [usernameValid, setUsernameValid] = useState(false);
  const [mounted, setMounted] = useState(false);
  const debouncedUsername = useDebounce(username, 500);

  const router = useRouter();
  const { toast } = useToast();

  // Fix hydration by ensuring client-side rendering
  useEffect(() => {
    setMounted(true);
  }, []);

  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      username: '',
      email: '',
      password: '',
    },
  });

  useEffect(() => {
  const checkUsernameUnique = async () => {
    if (debouncedUsername && /^[a-zA-Z0-9_]{3,20}$/.test(debouncedUsername)) {
      setIsCheckingUsername(true);
      setUsernameValid(false);
      try {
        const res = await axios.get(`/api/check-username-unique?username=${debouncedUsername}`);
        setUsernameValid(true);
      } catch (error) {
        const axiosError = error as AxiosError;
        setUsernameValid(false);
        toast({
          title: 'Username Error',
          description:
            (axiosError.response?.data as any)?.message || 'Error checking username',
          variant: 'destructive',
          className: 'bg-red-700 text-white',
        });
      } finally {
        setIsCheckingUsername(false);
      }
    }
  };
  checkUsernameUnique();
}, [debouncedUsername, toast]);


 const [isRedirecting, setIsRedirecting] = useState(false);

const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
  setIsSubmitting(true);
  try {
    await axios.post('/api/sign-up', data);
    setIsRedirecting(true);  // 👈 Activate full screen loader
    router.replace('/dashboard');
  } catch (error) {
    const axiosError = error as AxiosError;
    const errorMessage =
      (axiosError.response?.data as any)?.error || 'Sign up failed. Please try again.';

    toast({
      title: 'Sign Up Failed',
      description: errorMessage,
      variant: 'destructive',
    });
  } finally {
    setIsSubmitting(false);
  }
};


  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  // Fixed positions for consistent SSR/CSR rendering
  const floatingElements = [
    { size: 120, left: '10%', top: '20%', delay: 0 },
    { size: 80, left: '85%', top: '10%', delay: 2 },
    { size: 100, left: '20%', top: '80%', delay: 4 },
    { size: 60, left: '90%', top: '70%', delay: 6 },
    { size: 90, left: '5%', top: '60%', delay: 8 },
    { size: 70, left: '75%', top: '85%', delay: 10 }
  ];

  if (!mounted) {
    return null; // Prevent hydration mismatch
  }

  return (
    <div className="relative min-h-screen bg-[#121212] flex items-center justify-center p-4 overflow-hidden">
      {/* Fixed Background Pattern */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.1),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(168,85,247,0.1),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(14,165,233,0.1),transparent_50%)]" />
      </div>

      {/* Animated Background Elements - Only render on client */}
      <div className="absolute inset-0 overflow-hidden">
        {floatingElements.map((element, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-gradient-to-r from-purple-500/10 to-purple-500/10 backdrop-blur-sm border border-white/5"
            style={{
              width: element.size,
              height: element.size,
              left: element.left,
              top: element.top,
            }}
            animate={{
              x: [0, 30, -30, 0],
              y: [0, -20, 20, 0],
              rotate: [0, 180, 360],
              scale: [1, 1.1, 0.9, 1],
            }}
            transition={{
              duration: 20 + element.delay,
              repeat: Infinity,
              repeatType: "loop",
              ease: "linear",
              delay: element.delay
            }}
          />
        ))}
      </div>
      
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative w-full max-w-md z-10"
      >
        {/* Dark Glassmorphism Card */}
        <motion.div 
          className="bg-zinc-900/80 backdrop-blur-xl border border-zinc-700/50 rounded-2xl p-8 shadow-2xl shadow-black/20"
          whileHover={{ scale: 1.01, boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)" }}
          transition={{ duration: 0.3 }}
        >
          {/* Header */}
          <motion.div variants={itemVariants} className="text-center mb-8">
            <motion.h1 
              className="text-5xl font-bold bg-gradient-to-r from-white via-zinc-200 to-zinc-400 bg-clip-text text-transparent mb-4"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5, type: "spring" }}
            >
              Worklink
            </motion.h1>
            <motion.p 
              variants={itemVariants}
              className="text-zinc-400 text-lg"
            >
              Join the future of work
            </motion.p>
          </motion.div>

          <Form {...form}>
            <motion.form 
              onSubmit={form.handleSubmit(onSubmit)} 
              className="space-y-6"
              variants={itemVariants}
            >
              {/* Username Field */}
              <motion.div variants={itemVariants}>
                <FormField
                  name="username"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-zinc-200 font-medium">Username</FormLabel>
                      <div className="relative">
                        <Input
                          {...field}
                          value={field.value ?? ''}
                          onChange={(e) => {
                            field.onChange(e);
                            setUsername(e.target.value);
                          }}
                          className="bg-zinc-800/50 border-zinc-600/50 text-white placeholder:text-zinc-500 focus:border-purple-400 focus:ring-purple-400/20 transition-all duration-300 h-12"
                          placeholder="Enter your username"
                        />
                        <AnimatePresence>
                          {debouncedUsername && (
                            <motion.div
                              initial={{ opacity: 0, x: 10 }}
                              animate={{ opacity: 1, x: 0 }}
                              exit={{ opacity: 0, x: 10 }}
                              className="absolute right-3 top-1/2 transform -translate-y-1/2"
                            >
                              {isCheckingUsername ? (
                                <Loader2 className="h-4 w-4 animate-spin text-purple-400" />
                              ) : usernameValid ? (
                                <CheckCircle className="h-4 w-4 text-green-400" />
                              ) : (
                                <AlertCircle className="h-4 w-4 text-red-400" />
                              )}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                      <AnimatePresence>
                        {isCheckingUsername && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="flex items-center mt-2 gap-2 text-sm text-zinc-400"
                          >
                            <Loader2 className="animate-spin h-3 w-3" />
                            Checking availability...
                          </motion.div>
                        )}
                      </AnimatePresence>
                      <FormMessage className="text-red-400" />
                    </FormItem>
                  )}
                />
              </motion.div>

              {/* Email Field */}
              <motion.div variants={itemVariants}>
                <FormField
                  name="email"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-zinc-200 font-medium">Email</FormLabel>
                      <Input 
                        {...field} 
                        value={field.value ?? ''} 
                        className="bg-zinc-800/50 border-zinc-600/50 text-white placeholder:text-zinc-500 focus:border-purple-400 focus:ring-purple-400/20 transition-all duration-300 h-12"
                        placeholder="Enter your email"
                        type="email"
                      />
                      <p className='text-zinc-500 text-sm mt-1'>
                        We'll send you a verification code
                      </p>
                      <FormMessage className="text-red-400" />
                    </FormItem>
                  )}
                />
              </motion.div>

              {/* Password Field */}
              <motion.div variants={itemVariants}>
                <FormField
                  name="password"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-zinc-200 font-medium">Password</FormLabel>
                      <div className="relative">
                        <Input 
                          type={showPassword ? "text" : "password"} 
                          {...field} 
                          value={field.value ?? ''} 
                          className="bg-zinc-800/50 border-zinc-600/50 text-white placeholder:text-zinc-500 focus:border-purple-400 focus:ring-purple-400/20 transition-all duration-300 h-12 pr-12"
                          placeholder="Create a strong password"
                        />
                        <motion.button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </motion.button>
                      </div>
                      <FormMessage className="text-red-400" />
                    </FormItem>
                  )}
                />
              </motion.div>

              {/* Submit Button */}
              <motion.div variants={itemVariants}>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button 
                    type="submit" 
                    className="w-full bg-gradient-to-r from-purple-600 to-purple-600 hover:from-purple-700 hover:to-purple-700 text-white font-semibold py-4 h-12 rounded-xl shadow-lg hover:shadow-purple-500/25 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed" 
                    disabled={isSubmitting}
                  >
                    <AnimatePresence mode="wait">
                      {isSubmitting ? (
                        <motion.div
                          key="loading"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="flex items-center"
                        >
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Creating your account...
                        </motion.div>
                      ) : (
                        <motion.span
                          key="text"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                        >
                          Create Account
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </Button>
                </motion.div>
              </motion.div>
            </motion.form>
          </Form>

          {/* Footer */}
          <motion.div variants={itemVariants} className="text-center mt-6">
            <p className="text-zinc-400">
              Already have an account?{' '}
              <Link 
                href="/sign-in" 
                className="text-purple-400 hover:text-purple-300 font-medium transition-colors duration-200 hover:underline"
              >
                Sign in
              </Link>
            </p>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
}
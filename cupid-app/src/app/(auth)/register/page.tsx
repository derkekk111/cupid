"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Loader } from 'lucide-react';

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  longq: string;
}

export default function RegisterScreen() {
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    longq: ''
  });

  const longques = [
    "If you were a kitchen appliance, which one would you be and why?", 
    "Would you rather fight a gorilla once a year or always have one seagull following you everywhere?",
    "If your left shoe suddenly gained consciousness, what would it say about your life choices?",
    "What's the strangest object you could confidently beat someone with in a duel?",
    "If you had to replace your hands with something else, what would you choose?",
    "What smell do you think your personality gives off?",
    "If you had to be haunted by a ghost of any historical figure, who would you pick and why?",
    "What animal do you think is secretly plotting against humanity?",
    "If you had to rename the sun, what would you call it?",
    "You're cursed so every time you sneeze, something random happens — what would you want it to be?"
  ];

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    if (error) setError('');
  };

  const validateForm = (): boolean => {
    if (!formData.firstName.trim()) {
      setError('First name is required');
      return false;
    }
    if (!formData.lastName.trim()) {
      setError('Last name is required');
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    setError('');

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const userData = {
        id: Date.now().toString(),
        firstName: formData.firstName,
        lastName: formData.lastName,
        fullName: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        createdAt: new Date().toISOString()
      };
      
      setSuccess(true);
      
      setTimeout(() => {
        router.push('/match');
      }, 1500);
      
    } catch (err) {
      setError('Failed to create account');
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-50 to-blue-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-2xl p-10 text-center max-w-md w-full">
          <div className="text-6xl mb-6">✅</div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent mb-4">
            Account Created!
          </h1>
          <p className="text-gray-600 mb-6">
            Welcome to Cupid, {formData.firstName}! Redirecting you to your dashboard...
          </p>
          <div className="w-8 h-8 mx-auto animate-spin">
            <div className="w-full h-full border-4 border-pink-200 border-t-pink-500 rounded-full"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-50 to-blue-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl p-10 text-center max-w-md w-full">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent mb-2">
          Sign Up
        </h1>
        <p className="text-gray-600 mb-8">Create your account to get started</p>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="text-left">
            <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-pink-500 focus:outline-none transition-colors"
              required
              disabled={isLoading}
              placeholder="Enter your first name"
            />
          </div>
          
          <div className="text-left">
            <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-pink-500 focus:outline-none transition-colors"
              required
              disabled={isLoading}
              placeholder="Enter your last name"
            />
          </div>

          <div className="text-left">
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-pink-500 focus:outline-none transition-colors"
              required
              disabled={isLoading}
              placeholder="Enter your email"
            />
          </div>

          <div className="text-left">
            <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-pink-500 focus:outline-none transition-colors"
              required
              disabled={isLoading}
              minLength={6}
              placeholder="Create a password (6+ characters)"
            />
          </div>

          <div className="text-left">
            <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-pink-500 focus:outline-none transition-colors"
              required
              disabled={isLoading}
              placeholder="Confirm your password"
            />
          </div>

          <div className="text-left">
            <label htmlFor="longq" className="block text-sm font-medium text-gray-700 mb-2">Long Question (max 100 characters)</label>
            <input
              type="text"
              id="longq"
              name="longq"
              value={formData.longq}
              onChange={handleChange}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-pink-500 focus:outline-none transition-colors"
              required
              disabled={isLoading}
              placeholder="Maximum 100 characters"
            />
          </div>

          <button 
            type="submit" 
            className="w-full py-4 bg-gradient-to-r from-pink-500 to-purple-600 text-white font-semibold rounded-xl hover:shadow-lg transform hover:-translate-y-1 transition-all duration-200 disabled:opacity-50 disabled:transform-none"
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <Loader className="animate-spin w-5 h-5 mr-2" />
                Creating Account...
              </span>
            ) : (
              'Create Account'
            )}
          </button>
        </form>

        <p className="text-gray-600 text-sm mt-6 mb-4">
          Already have an account?{' '}
          <Link href="/login" className="text-pink-500 hover:text-pink-600 font-medium">
            Log in
          </Link>
        </p>

        <Link href="/" className="text-gray-500 hover:text-gray-600 text-sm font-medium">
          ← Back to Home
        </Link>
      </div>
    </div>
  );
}
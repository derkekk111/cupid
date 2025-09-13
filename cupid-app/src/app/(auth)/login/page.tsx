"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Loader } from 'lucide-react';

interface LoginFormData {
  email: string;
  password: string;
}

export default function LoginScreen() {
  const router = useRouter();
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    if (error) setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const userData = {
        id: '1',
        firstName: 'Demo',
        lastName: 'User',
        fullName: 'Demo User',
        email: formData.email,
        createdAt: new Date().toISOString()
      };
      
      // Redirect to match page after successful login
      router.push('/match');
      
    } catch (err) {
      setError('Invalid email or password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-50 to-blue-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl p-10 text-center max-w-md w-full">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent mb-2">
          Welcome Back
        </h1>
        <p className="text-gray-600 mb-8">Sign in to your account</p>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-6">
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
              placeholder="Enter your password"
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
                Signing In...
              </span>
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        <p className="text-gray-600 text-sm mt-6 mb-4">
          Don't have an account?{' '}
          <Link href="/register" className="text-pink-500 hover:text-pink-600 font-medium">
            Sign up
          </Link>
        </p>

        <Link href="/" className="text-gray-500 hover:text-gray-600 text-sm font-medium">
          ← Back to Home
        </Link>
      </div>
    </div>
  );
}
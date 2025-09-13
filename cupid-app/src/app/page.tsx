"use client";
import React, { useState, useEffect } from 'react';
import { Heart, X, MapPin, Users, Zap, Loader, ArrowRight } from 'lucide-react';

// Types
interface Profile {
  id: number;
  name: string;
  age: number;
  location: string;
  bio: string;
  photo: string;
  interests?: string[];
  personality?: string[];
  createdAt: string;
  updatedAt: string;
}

interface MatchDecision {
  isMatch: boolean;
  reasons: string[];
}

interface CompatibilityResult {
  score: number;
  reasons: string[];
}

// Sample profiles data
const sampleProfiles: Profile[] = [
  {
    id: 1,
    name: "Emma",
    age: 28,
    location: "San Francisco, CA",
    bio: "Coffee enthusiast ☕ | Love hiking and exploring new places | Looking for genuine connections",
    photo: "https://images.unsplash.com/photo-1494790108755-2616c3e09b02?w=400&h=500&fit=crop",
    interests: ["Photography", "Hiking", "Cooking", "Yoga", "Travel"],
    personality: ["Creative", "Adventurous", "Thoughtful"],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 2,
    name: "Alex",
    age: 31,
    location: "San Francisco, CA",
    bio: "Tech geek 💻 | Weekend warrior | Love good food and better company | Always up for an adventure",
    photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=500&fit=crop",
    interests: ["Rock Climbing", "Gaming", "Cooking", "Movies", "Startups"],
    personality: ["Analytical", "Adventurous", "Ambitious"],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
];

// App Component
export default function CupidDatingApp() {
  const [currentView, setCurrentView] = useState('loading');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  // Loading Screen Component
  const LoadingScreen = () => (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-50 to-blue-100 flex items-center justify-center">
      <div className="text-center">
        <div className="mb-8 animate-pulse">
          <div className="w-24 h-24 mx-auto bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center mb-4">
            <Heart className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
            Cupid
          </h1>
        </div>
        <div className="w-8 h-8 mx-auto animate-spin">
          <div className="w-full h-full border-4 border-pink-200 border-t-pink-500 rounded-full"></div>
        </div>
      </div>
    </div>
  );

  // Home/Landing Screen Component
  const HomeScreen = () => (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-50 to-blue-100">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="text-center mb-16">
          <div className="w-20 h-20 mx-auto bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center mb-6">
            <Heart className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-6xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent mb-6">
            Cupid
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
            Find your perfect match through intelligent compatibility analysis. 
            Swipe smarter, not harder.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => setCurrentView('register')}
              className="px-8 py-4 bg-gradient-to-r from-pink-500 to-purple-600 text-white font-semibold rounded-xl hover:shadow-lg transform hover:-translate-y-1 transition-all duration-200"
            >
              Get Started
              <ArrowRight className="inline w-5 h-5 ml-2" />
            </button>
            <button
              onClick={() => setCurrentView('login')}
              className="px-8 py-4 bg-white text-gray-700 font-semibold rounded-xl border-2 border-gray-200 hover:shadow-lg transform hover:-translate-y-1 transition-all duration-200"
            >
              Sign In
            </button>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white rounded-2xl p-6 shadow-lg text-center">
            <div className="w-16 h-16 mx-auto bg-pink-100 rounded-full flex items-center justify-center mb-4">
              <Users className="w-8 h-8 text-pink-500" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Smart Matching</h3>
            <p className="text-gray-600">Our AI analyzes compatibility based on interests, personality, and lifestyle.</p>
          </div>
          
          <div className="bg-white rounded-2xl p-6 shadow-lg text-center">
            <div className="w-16 h-16 mx-auto bg-purple-100 rounded-full flex items-center justify-center mb-4">
              <Zap className="w-8 h-8 text-purple-500" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Instant Chemistry</h3>
            <p className="text-gray-600">Get detailed compatibility scores and reasons why you might click.</p>
          </div>
          
          <div className="bg-white rounded-2xl p-6 shadow-lg text-center">
            <div className="w-16 h-16 mx-auto bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <Heart className="w-8 h-8 text-blue-500" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Meaningful Connections</h3>
            <p className="text-gray-600">Focus on quality matches that lead to lasting relationships.</p>
          </div>
        </div>
      </div>
    </div>
  );

  // Register Screen Component
  const RegisterScreen = () => {
    const [formData, setFormData] = useState({
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
      // question1: '',
      // question2: '',
      // question3: '',
      // question4: '',
      longq: ''
    });
    const longques = [
      "If you were a kitchen appliance, which one would you be and why?", 
      "Would you rather fight a gorilla once a year or always have one seagull following you everywhere?",
      "If your left shoe suddenly gained consciousness, what would it say about your life choices?",
      "What’s the strangest object you could confidently beat someone with in a duel?",
      "If you had to replace your hands with something else, what would you choose?",
      "What smell do you think your personality gives off?",
      "If you had to be haunted by a ghost of any historical figure, who would you pick and why?",
      "What animal do you think is secretly plotting against humanity?",
      "If you had to rename the sun, what would you call it?",
      "You’re cursed so every time you sneeze, something random happens — what would you want it to be?"
    ]
    let longquesindx = Math.floor(Math.random() * longques.length);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const handleChange = (e) => {
      setFormData({
        ...formData,
        [e.target.name]: e.target.value
      });
      if (error) setError('');
    };

    const validateForm = () => {
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

    const handleSubmit = async (e) => {
      e.preventDefault();
      
      if (!validateForm()) return;
      
      setIsLoading(true);
      setError('');

      try {
        const userData = {
          id: Date.now().toString(),
          firstName: formData.firstName,
          lastName: formData.lastName,
          fullName: `${formData.firstName} ${formData.lastName}`,
          email: formData.email,
          createdAt: new Date().toISOString()
        };
        
        setUser(userData);
        setSuccess(true);
        
        setTimeout(() => {
          setIsAuthenticated(true);
          setCurrentView('match');
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
            <button onClick={() => setCurrentView('login')} className="text-pink-500 hover:text-pink-600 font-medium">
              Log in
            </button>
          </p>

          <button onClick={() => setCurrentView('home')} className="text-gray-500 hover:text-gray-600 text-sm font-medium">
            ← Back to Home
          </button>
        </div>
      </div>
    );
  };

  // Login Screen Component
  const LoginScreen = () => {
    const [formData, setFormData] = useState({
      email: '',
      password: ''
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
      setFormData({
        ...formData,
        [e.target.name]: e.target.value
      });
      if (error) setError('');
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
      setIsLoading(true);
      setError('');

      try {
        setTimeout(() => {
          const userData = {
            id: '1',
            firstName: 'Demo',
            lastName: 'User',
            fullName: 'Demo User',
            email: formData.email,
            createdAt: new Date().toISOString()
          };
          
          setUser(userData);
          setIsAuthenticated(true);
          setCurrentView('match');
        }, 1000);
        
      } catch (err) {
        setError('Invalid email or password');
      } finally {
        setTimeout(() => setIsLoading(false), 1000);
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
            <button onClick={() => setCurrentView('register')} className="text-pink-500 hover:text-pink-600 font-medium">
              Sign up
            </button>
          </p>

          <button onClick={() => setCurrentView('home')} className="text-gray-500 hover:text-gray-600 text-sm font-medium">
            ← Back to Home
          </button>
        </div>
      </div>
    );
  };

  // Match Screen Component
  const MatchScreen = () => {
    const [profiles, setProfiles] = useState(sampleProfiles);
    const [showMatchResult, setShowMatchResult] = useState(false);
    const [matchDecision, setMatchDecision] = useState(null);
    const [matchScore, setMatchScore] = useState(0);
    const [loading, setLoading] = useState(false);
    const [matchId, setMatchId] = useState(null);

    // const calculateCompatibility = () => {
    //   if (profiles.length < 2) return { score: 0, reasons: [] };
      
    //   const [profile1, profile2] = profiles;
    //   let score = 0;
    //   const reasons = [];

    //   const sharedInterests = profile1.interests?.filter(interest => 
    //     profile2.interests?.includes(interest)
    //   ) || [];
      
    //   if (sharedInterests.length > 0) {
    //     score += sharedInterests.length * 20;
    //     reasons.push(`Both love ${sharedInterests.join(' and ')}`);
    //   }

    //   const ageDiff = Math.abs(profile1.age - profile2.age);
    //   if (ageDiff <= 5) {
    //     score += 15;
    //     reasons.push("Similar age range");
    //   }

    //   if (profile1.location === profile2.location) {
    //     score += 25;
    //     reasons.push(`Both in ${profile1.location.split(',')[0]}`);
    //   }

    //   const sharedTraits = profile1.personality?.filter(trait => 
    //     profile2.personality?.includes(trait)
    //   ) || [];
      
    //   if (sharedTraits.length > 0) {
    //     score += sharedTraits.length * 15;
    //     reasons.push(`Both are ${sharedTraits.join(' and ')}`);
    //   }

    //   return { score: Math.min(score, 100), reasons };
    // };

    const handleMatch = async (isMatch) => {
      if (profiles.length < 2) return;

      const compatibility = calculateCompatibility();
      setMatchScore(compatibility.score);
      setMatchDecision({ isMatch, reasons: compatibility.reasons });
      setShowMatchResult(true);
      setMatchId(`match_${Date.now()}`);
    };

    const resetMatch = () => {
      setShowMatchResult(false);
      setMatchDecision(null);
      setMatchScore(0);
      setMatchId(null);
    };

    const ProfileCard = ({ profile, side }) => (
      <div className="bg-white rounded-2xl shadow-2xl overflow-hidden hover:scale-105 transition-transform duration-200">
        <div className="relative h-64 overflow-hidden">
          <img 
            src={profile.photo} 
            alt={profile.name}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-xl font-bold text-gray-900">{profile.name}</h3>
            <span className="text-lg text-gray-600">{profile.age}</span>
          </div>

          <div className="flex items-center gap-1 mb-3 text-gray-600 text-sm">
            <MapPin className="w-3 h-3" />
            <span>{profile.location}</span>
          </div>


          <p className="text-gray-700 text-sm mb-3 line-clamp-3">
            {profile.bio}
          </p>

          {profile.interests && profile.interests.length > 0 && (
            <div className="mb-3">
              <h4 className="text-xs font-semibold text-gray-500 mb-2">INTERESTS</h4>
              <div className="flex flex-wrap gap-1">
                {profile.interests.map((interest, index) => (
                  <span key={index} className="bg-gradient-to-r from-pink-100 to-purple-100 text-gray-700 px-2 py-1 rounded-full text-xs border border-pink-200">
                    {interest}
                  </span>
                ))}
              </div>
            </div>
          )}

          {profile.personality && profile.personality.length > 0 && (
            <div>
              <h4 className="text-xs font-semibold text-gray-500 mb-2">PERSONALITY</h4>
              <div className="flex flex-wrap gap-1">
                {profile.personality.map((trait, index) => (
                  <span key={index} className="bg-gradient-to-r from-blue-100 to-indigo-100 text-gray-700 px-2 py-1 rounded-full text-xs border border-blue-200">
                    {trait}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );

    if (loading) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-50 to-blue-100 flex items-center justify-center">
          <div className="text-center">
            <Loader className="w-8 h-8 animate-spin mx-auto mb-4 text-pink-500" />
            <p className="text-gray-600">Loading profiles...</p>
          </div>
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-50 to-blue-100">
        <div className="max-w-6xl mx-auto p-6">
          {!showMatchResult ? (
            <>
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-3">
                  Are {profiles[0]?.name} and {profiles[1]?.name} a Good Match?
                </h1>
                <p className="text-gray-600 max-w-2xl mx-auto">
                  Review both profiles below and decide if these two people would be compatible. 
                  Consider their interests, personalities, and what they're looking for.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-8 mb-8">
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="inline-block bg-pink-100 text-pink-700 px-4 py-2 rounded-full font-semibold mb-4">
                      Profile 1
                    </div>
                  </div>
                  <ProfileCard profile={profiles[0]} side="left" />
                </div>

                <div className="space-y-4">
                  <div className="text-center">
                    <div className="inline-block bg-blue-100 text-blue-700 px-4 py-2 rounded-full font-semibold mb-4">
                      Profile 2
                    </div>
                  </div>
                  <ProfileCard profile={profiles[1]} side="right" />
                </div>
              </div>

              <div className="flex justify-center gap-8">
                <button 
                  onClick={() => handleMatch(false)}
                  className="flex items-center gap-3 px-8 py-4 bg-white border-2 border-red-200 text-red-600 font-semibold rounded-2xl hover:bg-red-50 hover:shadow-lg transform hover:-translate-y-1 transition-all duration-200"
                >
                  <X className="w-6 h-6" />
                  Not a Match
                </button>
                
                <button 
                  onClick={() => handleMatch(true)}
                  className="flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-pink-500 to-purple-600 text-white font-semibold rounded-2xl hover:shadow-lg transform hover:-translate-y-1 transition-all duration-200"
                >
                  <Heart className="w-6 h-6" />
                  Perfect Match!
                </button>
              </div>
            </>
          ) : (
            <div className="max-w-2xl mx-auto">
              <div className="bg-white rounded-3xl shadow-2xl p-8 text-center">
                <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 ${
                  matchDecision?.isMatch ? 'bg-gradient-to-r from-pink-500 to-purple-600' : 'bg-gradient-to-r from-gray-400 to-gray-500'
                }`}>
                  {matchDecision?.isMatch ? (
                    <Heart className="w-10 h-10 text-white" />
                  ) : (
                    <X className="w-10 h-10 text-white" />
                  )}
                </div>

                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  {matchDecision?.isMatch ? "You Think They're a Match!" : "You Think They're Not Compatible"}
                </h2>

                <div className="bg-gradient-to-r from-pink-100 to-purple-100 rounded-2xl p-6 mb-6">
                  <div className="flex items-center justify-center gap-2 mb-3">
                    <Zap className="w-5 h-5 text-purple-600" />
                    <h3 className="text-lg font-semibold text-gray-900">Compatibility Analysis</h3>
                  </div>
                  
                  <div className="text-4xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent mb-3">
                    {matchScore}%
                  </div>

                  {matchDecision && matchDecision.reasons.length > 0 && (
                    <div className="mt-4">
                      <h4 className="font-medium text-gray-700 mb-2">Why they could work:</h4>
                      {matchDecision.reasons.map((reason, index) => (
                        <div key={index} className="text-sm text-gray-600 bg-white bg-opacity-50 rounded-lg p-3 mb-2">
                          • {reason}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="text-gray-600 mb-6">
                  {matchDecision?.isMatch 
                    ? "Great eye for compatibility! These profiles show several areas of potential connection."
                    : "Everyone has different preferences. Maybe they're better as friends, or perhaps you see something that would make them incompatible."
                  }
                </div>

                {matchId && (
                  <div className="text-xs text-gray-400 mb-6">
                    Match ID: {matchId}
                  </div>
                )}

                <button 
                  onClick={resetMatch}
                  className="px-8 py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white font-semibold rounded-xl hover:shadow-lg transform hover:-translate-y-1 transition-all duration-200"
                >
                  Try New Profiles
                </button>

                <div className="mt-6">
                  <button 
                    onClick={() => {
                      setIsAuthenticated(false);
                      setUser(null);
                      setCurrentView('home');
                    }}
                    className="text-gray-500 hover:text-gray-600 text-sm font-medium"
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  // Main app logic with loading effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentView('home');
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  // Check authentication status
  useEffect(() => {
    if (isAuthenticated && (currentView === 'register' || currentView === 'login')) {
      setCurrentView('match');
    }
  }, [isAuthenticated, currentView]);

  // Prevent authenticated users from accessing auth pages
  if (isAuthenticated && (currentView === 'register' || currentView === 'login' || currentView === 'home')) {
    return <MatchScreen />;
  }

  // Render current view
  switch (currentView) {
    case 'loading':
      return <LoadingScreen />;
    case 'home':
      return <HomeScreen />;
    case 'register':
      return <RegisterScreen />;
    case 'login':
      return <LoginScreen />;
    case 'match':
      return <MatchScreen />;
    default:
      return <HomeScreen />;
  }
}
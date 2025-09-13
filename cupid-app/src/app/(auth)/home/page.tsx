"use client";

import Link from 'next/link';
import { Heart, Users, Zap, ArrowRight } from 'lucide-react';

export default function HomeScreen() {
  return (
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
            <Link
              href="/register"
              className="px-8 py-4 bg-gradient-to-r from-pink-500 to-purple-600 text-white font-semibold rounded-xl hover:shadow-lg transform hover:-translate-y-1 transition-all duration-200 inline-flex items-center justify-center"
            >
              Get Started
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
            <Link
              href="/login"
              className="px-8 py-4 bg-white text-gray-700 font-semibold rounded-xl border-2 border-gray-200 hover:shadow-lg transform hover:-translate-y-1 transition-all duration-200 inline-flex items-center justify-center"
            >
              Sign In
            </Link>
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
}
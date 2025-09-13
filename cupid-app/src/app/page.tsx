"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function RootPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to home page
    router.replace('/home');
  }, [router]);

  // Show loading while redirecting
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-50 to-blue-100 flex items-center justify-center">
      <div className="w-8 h-8 animate-spin">
        <div className="w-full h-full border-4 border-pink-200 border-t-pink-500 rounded-full"></div>
      </div>
    </div>
  );
}
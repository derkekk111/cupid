"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Heart, User, Trophy, LogOut, Menu, X } from "lucide-react";
import { useState, useEffect } from "react";

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  cupidRank?: number;
  cupidScore?: number;
}

const Navbar = () => {
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    // Get user from localStorage (in a real app, use proper auth)
    const userData = localStorage.getItem('currentUser');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    setUser(null);
    window.location.href = '/';
  };

  const isActive = (path: string) => pathname === path;

  // Don't show navbar on auth pages and home page
  if (pathname === '/' || pathname === '/home' || pathname === '/login' || pathname === '/register') {
    return null;
  }

  return (
    <nav className="bg-white border-b-2 border-gray-100 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center">
              <Heart className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
              Cupid
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              href="/dashboard"
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg font-medium transition-colors ${
                isActive('/dashboard')
                  ? 'bg-pink-100 text-pink-700'
                  : 'text-gray-700 hover:text-pink-600'
              }`}
            >
              <Heart className="w-5 h-5" />
              <span>Match</span>
            </Link>

            <Link
              href="/leaderboard"
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg font-medium transition-colors ${
                isActive('/leaderboard')
                  ? 'bg-purple-100 text-purple-700'
                  : 'text-gray-700 hover:text-purple-600'
              }`}
            >
              <Trophy className="w-5 h-5" />
              <span>Leaderboard</span>
            </Link>

            <Link
              href="/profile"
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg font-medium transition-colors ${
                isActive('/profile')
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-700 hover:text-blue-600'
              }`}
            >
              <User className="w-5 h-5" />
              <span>Profile</span>
            </Link>
          </div>

          {/* User Info & Logout */}
          {user && (
            <div className="hidden md:flex items-center space-x-4">
              {/* Cupid Score */}
              <div className="flex items-center space-x-2 bg-gradient-to-r from-pink-100 to-purple-100 px-3 py-2 rounded-lg">
                <Trophy className="w-4 h-4 text-purple-600" />
                <span className="text-sm font-medium text-purple-700">
                  Rank #{user.cupidRank || 'Unranked'}
                </span>
              </div>

              {/* User Menu */}
              <div className="flex items-center space-x-3">
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">
                    {user.firstName} {user.lastName}
                  </p>
                  <p className="text-xs text-gray-500">
                    {user.cupidScore || 0} Cupid Points
                  </p>
                </div>
                
                <button
                  onClick={handleLogout}
                  className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Logout"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4">
            <div className="space-y-2">
              <Link
                href="/dashboard"
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg font-medium transition-colors ${
                  isActive('/dashboard')
                    ? 'bg-pink-100 text-pink-700'
                    : 'text-gray-700 hover:text-pink-600 hover:bg-gray-50'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                <Heart className="w-5 h-5" />
                <span>Match</span>
              </Link>

              <Link
                href="/leaderboard"
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg font-medium transition-colors ${
                  isActive('/leaderboard')
                    ? 'bg-purple-100 text-purple-700'
                    : 'text-gray-700 hover:text-purple-600 hover:bg-gray-50'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                <Trophy className="w-5 h-5" />
                <span>Leaderboard</span>
              </Link>

              <Link
                href="/profile"
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg font-medium transition-colors ${
                  isActive('/profile')
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                <User className="w-5 h-5" />
                <span>Profile</span>
              </Link>

              {user && (
                <>
                  <div className="px-4 py-3 bg-gradient-to-r from-pink-50 to-purple-50 rounded-lg mx-4 mt-4">
                    <p className="text-sm font-medium text-gray-900">
                      {user.firstName} {user.lastName}
                    </p>
                    <p className="text-xs text-gray-600">
                      Rank #{user.cupidRank || 'Unranked'} • {user.cupidScore || 0} Points
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                    className="flex items-center space-x-3 px-4 py-3 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg font-medium transition-colors w-full"
                  >
                    <LogOut className="w-5 h-5" />
                    <span>Logout</span>
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
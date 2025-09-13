"use client";

import { useState, useEffect } from 'react';
import { Trophy, Medal, Crown, Heart, TrendingUp, Calendar, Star } from 'lucide-react';

interface LeaderboardUser {
  user_id: string;
  name: string;
  cupid_score: number;
  total_matches: number;
  success_rate: number;
  rank: number;
  joined_date: string;
}

interface LeaderboardData {
  leaderboard: LeaderboardUser[];
}

const LeaderboardPage = () => {
  const [leaderboard, setLeaderboard] = useState<LeaderboardUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    // Get current user
    const userData = localStorage.getItem('currentUser');
    if (userData) {
      setCurrentUser(JSON.parse(userData));
    }

    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      setLoading(true);
      // In a real app, this would call your FastAPI backend
      // const response = await fetch('http://localhost:8000/leaderboard');
      // const data = await response.json();
      
      // Mock data for demonstration
      const mockData: LeaderboardData = {
        leaderboard: [
          {
            user_id: "1",
            name: "Sarah Johnson",
            cupid_score: 2450,
            total_matches: 98,
            success_rate: 0.87,
            rank: 1,
            joined_date: "2024-01-15T00:00:00Z"
          },
          {
            user_id: "2", 
            name: "Michael Chen",
            cupid_score: 2280,
            total_matches: 85,
            success_rate: 0.82,
            rank: 2,
            joined_date: "2024-02-01T00:00:00Z"
          },
          {
            user_id: "3",
            name: "Emily Rodriguez",
            cupid_score: 2150,
            total_matches: 76,
            success_rate: 0.89,
            rank: 3,
            joined_date: "2024-01-20T00:00:00Z"
          },
          {
            user_id: "4",
            name: "David Kim",
            cupid_score: 1980,
            total_matches: 71,
            success_rate: 0.78,
            rank: 4,
            joined_date: "2024-02-10T00:00:00Z"
          },
          {
            user_id: "5",
            name: "Jessica Wang",
            cupid_score: 1850,
            total_matches: 63,
            success_rate: 0.85,
            rank: 5,
            joined_date: "2024-01-28T00:00:00Z"
          },
          {
            user_id: "6",
            name: "Alex Thompson",
            cupid_score: 1720,
            total_matches: 58,
            success_rate: 0.79,
            rank: 6,
            joined_date: "2024-02-15T00:00:00Z"
          },
          {
            user_id: "7",
            name: "Maria Garcia",
            cupid_score: 1650,
            total_matches: 55,
            success_rate: 0.84,
            rank: 7,
            joined_date: "2024-02-05T00:00:00Z"
          },
          {
            user_id: "8",
            name: "James Wilson",
            cupid_score: 1580,
            total_matches: 52,
            success_rate: 0.81,
            rank: 8,
            joined_date: "2024-02-20T00:00:00Z"
          }
        ]
      };

      setLeaderboard(mockData.leaderboard);
    } catch (err) {
      setError('Failed to load leaderboard data');
      console.error('Error fetching leaderboard:', err);
    } finally {
      setLoading(false);
    }
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="w-6 h-6 text-yellow-500" />;
      case 2:
        return <Medal className="w-6 h-6 text-gray-400" />;
      case 3:
        return <Medal className="w-6 h-6 text-amber-600" />;
      default:
        return <span className="w-6 h-6 flex items-center justify-center text-sm font-bold text-gray-600">#{rank}</span>;
    }
  };

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1:
        return 'from-yellow-100 to-yellow-200 border-yellow-300';
      case 2:
        return 'from-gray-100 to-gray-200 border-gray-300';
      case 3:
        return 'from-amber-100 to-amber-200 border-amber-300';
      default:
        return 'from-white to-gray-50 border-gray-200';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      year: 'numeric'
    });
  };

  const formatSuccessRate = (rate: number) => {
    return `${Math.round(rate * 100)}%`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
          <p className="text-gray-600">Loading leaderboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <Trophy className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Oops!</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={fetchLeaderboard}
            className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const currentUserRank = leaderboard.find(user => user.user_id === currentUser?.id);

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <Trophy className="w-10 h-10 text-purple-600" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Cupid Leaderboard
            </h1>
            <Trophy className="w-10 h-10 text-pink-600" />
          </div>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            See how the top matchmakers are spreading love and earning their Cupid wings!
          </p>
        </div>

        {/* Current User Stats (if logged in and ranked) */}
        {currentUserRank && (
          <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-xl p-6 mb-8 border border-purple-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="flex items-center justify-center w-12 h-12 bg-purple-600 rounded-full">
                  <span className="text-white font-bold">#{currentUserRank.rank}</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Your Ranking</h3>
                  <p className="text-gray-600">Keep making great matches to climb higher!</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-purple-600">{currentUserRank.cupid_score}</div>
                <div className="text-sm text-gray-600">Cupid Points</div>
              </div>
            </div>
          </div>
        )}

        {/* Leaderboard */}
        <div className="space-y-4">
          {leaderboard.map((user, index) => {
            const isCurrentUser = user.user_id === currentUser?.id;
            
            return (
              <div
                key={user.user_id}
                className={`
                  bg-gradient-to-r ${getRankColor(user.rank)} rounded-xl p-6 border-2 shadow-sm
                  ${isCurrentUser ? 'ring-4 ring-purple-300 ring-opacity-50' : ''}
                  hover:shadow-md transition-all duration-200
                `}
              >
                <div className="flex items-center justify-between">
                  {/* Rank and User Info */}
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      {getRankIcon(user.rank)}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {user.name}
                          {isCurrentUser && (
                            <span className="ml-2 bg-purple-600 text-white text-xs px-2 py-1 rounded-full">
                              You
                            </span>
                          )}
                        </h3>
                        {user.rank <= 3 && (
                          <Star className="w-4 h-4 text-yellow-500 fill-current" />
                        )}
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-4 h-4" />
                          <span>Joined {formatDate(user.joined_date)}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="flex items-center space-x-8">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">
                        {user.cupid_score}
                      </div>
                      <div className="text-xs text-gray-600">Points</div>
                    </div>
                    
                    <div className="text-center">
                      <div className="text-lg font-semibold text-gray-900 flex items-center">
                        <Heart className="w-4 h-4 text-pink-500 mr-1" />
                        {user.total_matches}
                      </div>
                      <div className="text-xs text-gray-600">Matches</div>
                    </div>
                    
                    <div className="text-center">
                      <div className="text-lg font-semibold text-green-600 flex items-center">
                        <TrendingUp className="w-4 h-4 mr-1" />
                        {formatSuccessRate(user.success_rate)}
                      </div>
                      <div className="text-xs text-gray-600">Success</div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Call to Action */}
        <div className="text-center mt-12 bg-white rounded-xl p-8 border border-gray-200">
          <Heart className="w-12 h-12 text-pink-500 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-gray-900 mb-2">Ready to Climb the Ranks?</h3>
          <p className="text-gray-600 mb-6">
            Start making matches and earn your place among the top Cupids!
          </p>
          <a
            href="/dashboard"
            className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-8 py-3 rounded-lg font-medium hover:shadow-lg transform hover:scale-105 transition-all duration-200 inline-block"
          >
            Start Matching
          </a>
        </div>

        {/* Legend */}
        <div className="mt-8 bg-gray-50 rounded-lg p-6">
          <h4 className="font-semibold text-gray-900 mb-4">How Cupid Points Work</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span>5 points per match attempt</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>10 bonus points for successful matches</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <span>15 bonus points for positive feedback</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeaderboardPage;
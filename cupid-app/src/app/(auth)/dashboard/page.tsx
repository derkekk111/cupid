"use client";

import { useState, useEffect } from 'react';
import { Heart, X, ThumbsUp, ThumbsDown, Sparkles, Users, TrendingUp, Star } from 'lucide-react';

interface UserProfile {
  id: string;
  name: string;
  age: number;
  bio: string;
  interests: string[];
  photos: string[];
}

interface MatchCandidate {
  user1: UserProfile;
  user2: UserProfile;
  compatibility_score: number;
  shared_interests: string[];
  personality_match: number;
  recommendation: string;
}

const DashboardPage = () => {
  const [currentMatch, setCurrentMatch] = useState<MatchCandidate | null>(null);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    todayMatches: 0,
    totalMatches: 0,
    successRate: 0,
    cupidScore: 0
  });
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    // Get current user
    const userData = localStorage.getItem('currentUser');
    if (userData) {
      setCurrentUser(JSON.parse(userData));
    }

    // Load initial match
    loadNextMatch();
    
    // Load user stats
    setStats({
      todayMatches: 8,
      totalMatches: 45,
      successRate: 84,
      cupidScore: 1720
    });
  }, []);

  const loadNextMatch = async () => {
    setLoading(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock match data
    const mockMatches: MatchCandidate[] = [
      {
        user1: {
          id: "user1",
          name: "Emily Chen",
          age: 28,
          bio: "Software engineer who loves hiking and photography. Looking for someone to explore the city with!",
          interests: ["Photography", "Hiking", "Coffee", "Technology", "Travel"],
          photos: ["/api/placeholder/300/400"]
        },
        user2: {
          id: "user2", 
          name: "Marcus Rodriguez",
          age: 30,
          bio: "Adventure photographer and weekend hiker. Always up for trying new restaurants and exploring hidden gems.",
          interests: ["Photography", "Hiking", "Food", "Art", "Music"],
          photos: ["/api/placeholder/300/400"]
        },
        compatibility_score: 0.89,
        shared_interests: ["Photography", "Hiking"],
        personality_match: 0.87,
        recommendation: "Excellent match! These users have great compatibility and shared passions."
      },
      {
        user1: {
          id: "user3",
          name: "Sarah Johnson",
          age: 26,
          bio: "Yoga instructor and wellness enthusiast. Love cooking healthy meals and reading good books.",
          interests: ["Yoga", "Cooking", "Reading", "Wellness", "Nature"],
          photos: ["/api/placeholder/300/400"]
        },
        user2: {
          id: "user4",
          name: "Alex Kim",
          age: 29,
          bio: "Chef who's passionate about healthy eating and mindful living. Enjoy quiet evenings and good conversations.",
          interests: ["Cooking", "Wellness", "Reading", "Meditation", "Gardens"],
          photos: ["/api/placeholder/300/400"]
        },
        compatibility_score: 0.82,
        shared_interests: ["Cooking", "Reading", "Wellness"],
        personality_match: 0.85,
        recommendation: "Great match! Both value wellness and have complementary lifestyles."
      },
      {
        user1: {
          id: "user5",
          name: "David Park",
          age: 32,
          bio: "Music producer and vinyl collector. Love discovering new artists and going to live shows.",
          interests: ["Music", "Vinyl", "Concerts", "Art", "Coffee"],
          photos: ["/api/placeholder/300/400"]
        },
        user2: {
          id: "user6",
          name: "Luna Martinez",
          age: 27,
          bio: "Graphic designer with a passion for indie music and art galleries. Always hunting for the perfect playlist.",
          interests: ["Music", "Art", "Design", "Coffee", "Museums"],
          photos: ["/api/placeholder/300/400"]
        },
        compatibility_score: 0.78,
        shared_interests: ["Music", "Art", "Coffee"],
        personality_match: 0.81,
        recommendation: "Good match! They share creative interests and aesthetic sensibilities."
      }
    ];
    
    const randomMatch = mockMatches[Math.floor(Math.random() * mockMatches.length)];
    setCurrentMatch(randomMatch);
    setLoading(false);
  };

  const handleMatchDecision = async (isMatch: boolean) => {
    if (!currentMatch) return;
    
    // Simulate API call to record the match decision
    console.log(`Match decision: ${isMatch ? 'YES' : 'NO'}`, currentMatch);
    
    // Update stats
    setStats(prev => ({
      ...prev,
      todayMatches: prev.todayMatches + 1,
      totalMatches: prev.totalMatches + 1,
      cupidScore: prev.cupidScore + (isMatch ? 15 : 5)
    }));
    
    // Show brief feedback
    const feedback = isMatch ? 'Great match!' : 'Thanks for your input!';
    
    // Load next match
    await loadNextMatch();
  };

  const getCompatibilityColor = (score: number) => {
    if (score >= 0.8) return 'text-green-600 bg-green-100';
    if (score >= 0.6) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getCompatibilityText = (score: number) => {
    if (score >= 0.8) return 'Excellent';
    if (score >= 0.6) return 'Good';
    return 'Fair';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Today's Matches</p>
                <p className="text-3xl font-bold text-pink-600">{stats.todayMatches}</p>
              </div>
              <Heart className="w-8 h-8 text-pink-500" />
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Matches</p>
                <p className="text-3xl font-bold text-purple-600">{stats.totalMatches}</p>
              </div>
              <Users className="w-8 h-8 text-purple-500" />
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Success Rate</p>
                <p className="text-3xl font-bold text-green-600">{stats.successRate}%</p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-500" />
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Cupid Score</p>
                <p className="text-3xl font-bold text-yellow-600">{stats.cupidScore}</p>
              </div>
              <Star className="w-8 h-8 text-yellow-500" />
            </div>
          </div>
        </div>

        {/* Main Matching Interface */}
        <div className="max-w-5xl mx-auto">
          {loading ? (
            <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-pink-600 mx-auto mb-6"></div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Finding the perfect match...</h3>
              <p className="text-gray-600">Our AI is analyzing compatibility factors</p>
            </div>
          ) : currentMatch ? (
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              {/* Compatibility Header */}
              <div className="bg-gradient-to-r from-pink-500 to-purple-600 text-white p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Sparkles className="w-6 h-6" />
                    <h2 className="text-2xl font-bold">Potential Match</h2>
                  </div>
                  <div className={`px-4 py-2 rounded-full text-sm font-medium ${getCompatibilityColor(currentMatch.compatibility_score)}`}>
                    {Math.round(currentMatch.compatibility_score * 100)}% {getCompatibilityText(currentMatch.compatibility_score)} Match
                  </div>
                </div>
                <p className="mt-2 opacity-90">{currentMatch.recommendation}</p>
              </div>

              {/* User Profiles */}
              <div className="grid md:grid-cols-2 gap-8 p-8">
                {/* User 1 */}
                <div className="space-y-4">
                  <div className="aspect-w-3 aspect-h-4 bg-gray-200 rounded-xl overflow-hidden">
                    <div className="w-full h-80 bg-gradient-to-br from-pink-200 to-purple-300 flex items-center justify-center">
                      <span className="text-6xl">👤</span>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">{currentMatch.user1.name}</h3>
                    <p className="text-gray-600 text-lg">Age {currentMatch.user1.age}</p>
                    <p className="text-gray-700 mt-3 leading-relaxed">{currentMatch.user1.bio}</p>
                    
                    <div className="mt-4">
                      <h4 className="font-semibold text-gray-900 mb-2">Interests:</h4>
                      <div className="flex flex-wrap gap-2">
                        {currentMatch.user1.interests.map((interest) => (
                          <span
                            key={interest}
                            className={`px-3 py-1 rounded-full text-sm font-medium ${
                              currentMatch.shared_interests.includes(interest)
                                ? 'bg-pink-100 text-pink-800 ring-2 ring-pink-300'
                                : 'bg-gray-100 text-gray-700'
                            }`}
                          >
                            {interest}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* User 2 */}
                <div className="space-y-4">
                  <div className="aspect-w-3 aspect-h-4 bg-gray-200 rounded-xl overflow-hidden">
                    <div className="w-full h-80 bg-gradient-to-br from-blue-200 to-purple-300 flex items-center justify-center">
                      <span className="text-6xl">👤</span>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">{currentMatch.user2.name}</h3>
                    <p className="text-gray-600 text-lg">Age {currentMatch.user2.age}</p>
                    <p className="text-gray-700 mt-3 leading-relaxed">{currentMatch.user2.bio}</p>
                    
                    <div className="mt-4">
                      <h4 className="font-semibold text-gray-900 mb-2">Interests:</h4>
                      <div className="flex flex-wrap gap-2">
                        {currentMatch.user2.interests.map((interest) => (
                          <span
                            key={interest}
                            className={`px-3 py-1 rounded-full text-sm font-medium ${
                              currentMatch.shared_interests.includes(interest)
                                ? 'bg-pink-100 text-pink-800 ring-2 ring-pink-300'
                                : 'bg-gray-100 text-gray-700'
                            }`}
                          >
                            {interest}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Compatibility Analysis */}
              <div className="border-t border-gray-200 p-6 bg-gray-50">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">AI Analysis</h3>
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">
                      {Math.round(currentMatch.personality_match * 100)}%
                    </div>
                    <div className="text-sm text-gray-600">Personality Match</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-pink-600">
                      {currentMatch.shared_interests.length}
                    </div>
                    <div className="text-sm text-gray-600">Shared Interests</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {Math.round(currentMatch.compatibility_score * 100)}%
                    </div>
                    <div className="text-sm text-gray-600">Overall Score</div>
                  </div>
                </div>
                
                {currentMatch.shared_interests.length > 0 && (
                  <div className="mt-4 text-center">
                    <p className="text-sm text-gray-600 mb-2">Common Interests:</p>
                    <div className="flex flex-wrap justify-center gap-2">
                      {currentMatch.shared_interests.map((interest) => (
                        <span
                          key={interest}
                          className="bg-pink-100 text-pink-800 px-3 py-1 rounded-full text-sm font-medium"
                        >
                          {interest}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Decision Buttons */}
              <div className="p-6 bg-white border-t border-gray-200">
                <div className="flex justify-center space-x-6">
                  <button
                    onClick={() => handleMatchDecision(false)}
                    className="flex items-center space-x-3 bg-gray-100 hover:bg-gray-200 text-gray-700 px-8 py-4 rounded-xl font-medium transition-colors"
                  >
                    <X className="w-6 h-6" />
                    <span>Not a Match</span>
                  </button>
                  
                  <button
                    onClick={() => handleMatchDecision(true)}
                    className="flex items-center space-x-3 bg-gradient-to-r from-pink-500 to-purple-600 hover:shadow-lg text-white px-8 py-4 rounded-xl font-medium transition-all transform hover:scale-105"
                  >
                    <Heart className="w-6 h-6" />
                    <span>It's a Match!</span>
                  </button>
                </div>
                
                <p className="text-center text-gray-500 text-sm mt-4">
                  Trust your instincts - you know what makes a great connection!
                </p>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
              <Heart className="w-16 h-16 text-gray-400 mx-auto mb-6" />
              <h3 className="text-2xl font-bold text-gray-900 mb-2">No more matches right now</h3>
              <p className="text-gray-600 mb-6">Check back soon for more potential connections!</p>
              <button
                onClick={loadNextMatch}
                className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:shadow-lg transition-all"
              >
                Refresh Matches
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
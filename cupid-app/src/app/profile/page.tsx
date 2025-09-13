"use client"

import React, { useState } from 'react';
import { Heart, Edit3, Camera, MessageCircle, Star, Calendar, MapPin, Users, Trophy, ThumbsUp, ThumbsDown, Settings, Share2 } from 'lucide-react';

const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState('about');
  const [isEditing, setIsEditing] = useState(false);

  // Mock user data - in real app, this would come from props or API
  const user = {
    id: 1,
    name: "Alex Rivera",
    age: 28,
    gender: "Non-binary",
    sexuality: "Pansexual",
    intent: "Long-term relationship",
    photos: [
      "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop&crop=face",
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face",
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face",
    ],
    contact: "alex.rivera@email.com",
    joinDate: "March 2024",
    location: "San Francisco, CA"
  };

  const questionAnswers = [
    {
      id: 1,
      question: "If you could have dinner with any fictional character, who would it be and what would you order?",
      answer: "Definitely Hermione Granger! We'd order fish and chips while discussing the ethics of house-elf labor and the best study techniques for mastering complex spells.",
      type: "open-ended"
    },
    {
      id: 2,
      question: "Your ideal first date is:",
      answer: "Mini golf followed by ice cream",
      type: "multiple-choice",
      options: ["Coffee shop conversation", "Mini golf followed by ice cream", "Art museum tour", "Cooking class together"]
    },
    {
      id: 3,
      question: "How do you handle disagreements in relationships?",
      answer: "I believe in open communication and taking time to understand each other's perspectives. Sometimes I need a moment to collect my thoughts, but I always come back to discuss things calmly.",
      type: "open-ended"
    },
    {
      id: 4,
      question: "Your communication style is:",
      answer: "Direct but empathetic",
      type: "multiple-choice",
      options: ["Direct but empathetic", "Gentle and indirect", "Humorous and light", "Analytical and detailed"]
    }
  ];

  const matches = [
    {
      id: 1,
      name: "Jordan Kim",
      age: 26,
      photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=face",
      matchDate: "2 days ago",
      compatibility: 87,
      status: "pending",
      cupidName: "Sam Wilson"
    },
    {
      id: 2,
      name: "Taylor Chen",
      age: 30,
      photo: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face",
      matchDate: "1 week ago",
      compatibility: 92,
      status: "liked",
      cupidName: "Maya Patel"
    },
    {
      id: 3,
      name: "Casey Rodriguez",
      age: 27,
      photo: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face",
      matchDate: "2 weeks ago",
      compatibility: 84,
      status: "chatting",
      cupidName: "Alex Johnson"
    }
  ];

  const cupidStats = {
    matchesMade: 23,
    successRate: 78,
    thumbsUp: 18,
    thumbsDown: 5,
    rank: 12
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-rose-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Heart className="w-8 h-8 text-pink-500" />
            <h1 className="text-2xl font-bold text-gray-900">Cupid</h1>
          </div>
          <div className="flex items-center space-x-3">
            <button className="p-2 text-gray-600 hover:text-pink-500 transition-colors">
              <Share2 className="w-5 h-5" />
            </button>
            <button className="p-2 text-gray-600 hover:text-pink-500 transition-colors">
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column - Profile Info */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              {/* Photo Gallery */}
              <div className="relative">
                <div className="aspect-square bg-gradient-to-br from-pink-100 to-rose-100 flex items-center justify-center">
                  {user.photos[0] ? (
                    <img 
                      src={user.photos[0]} 
                      alt={user.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Camera className="w-16 h-16 text-gray-400" />
                  )}
                </div>
                <button className="absolute top-4 right-4 bg-white rounded-full p-2 shadow-lg hover:shadow-xl transition-shadow">
                  <Edit3 className="w-4 h-4 text-gray-600" />
                </button>
              </div>

              {/* Additional Photos */}
              <div className="p-4">
                <div className="grid grid-cols-3 gap-2 mb-4">
                  {user.photos.slice(1, 4).map((photo, index) => (
                    <div key={index} className="aspect-square rounded-lg overflow-hidden bg-gray-100">
                      <img src={photo} alt={`Photo ${index + 2}`} className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>

                {/* Basic Info */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-gray-900">{user.name}</h2>
                    <span className="text-lg text-gray-600">{user.age}</span>
                  </div>
                  
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-center space-x-2">
                      <Users className="w-4 h-4" />
                      <span>{user.gender} • {user.sexuality}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Heart className="w-4 h-4" />
                      <span>{user.intent}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-4 h-4" />
                      <span>{user.location}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4" />
                      <span>Joined {user.joinDate}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Cupid Stats */}
            <div className="mt-6 bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center space-x-2 mb-4">
                <Trophy className="w-5 h-5 text-yellow-500" />
                <h3 className="text-lg font-semibold text-gray-900">Cupid Stats</h3>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="text-center p-3 bg-pink-50 rounded-lg">
                  <div className="text-2xl font-bold text-pink-600">{cupidStats.matchesMade}</div>
                  <div className="text-gray-600">Matches Made</div>
                </div>
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{cupidStats.successRate}%</div>
                  <div className="text-gray-600">Success Rate</div>
                </div>
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">#{cupidStats.rank}</div>
                  <div className="text-gray-600">Leaderboard</div>
                </div>
                <div className="text-center p-3 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">{cupidStats.thumbsUp}</div>
                  <div className="text-gray-600">Thumbs Up</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Tabs Content */}
          <div className="lg:col-span-2">
            {/* Tab Navigation */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="border-b border-gray-200">
                <nav className="flex">
                  {[
                    { id: 'about', label: 'About Me', icon: Users },
                    { id: 'matches', label: 'Matches', icon: Heart },
                    { id: 'activity', label: 'Cupid Activity', icon: Trophy }
                  ].map((tab) => {
                    const Icon = tab.icon;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex-1 flex items-center justify-center space-x-2 px-6 py-4 text-sm font-medium transition-colors ${
                          activeTab === tab.id
                            ? 'text-pink-600 border-b-2 border-pink-600 bg-pink-50'
                            : 'text-gray-500 hover:text-gray-700'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        <span>{tab.label}</span>
                      </button>
                    );
                  })}
                </nav>
              </div>

              <div className="p-6">
                {/* About Me Tab */}
                {activeTab === 'about' && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xl font-semibold text-gray-900">My Answers</h3>
                      <button 
                        onClick={() => setIsEditing(!isEditing)}
                        className="flex items-center space-x-2 text-pink-600 hover:text-pink-700 transition-colors"
                      >
                        <Edit3 className="w-4 h-4" />
                        <span>Edit</span>
                      </button>
                    </div>

                    <div className="space-y-4">
                      {questionAnswers.map((qa) => (
                        <div key={qa.id} className="bg-gray-50 rounded-xl p-4">
                          <h4 className="font-medium text-gray-900 mb-2">{qa.question}</h4>
                          <div className="text-gray-700">
                            {qa.type === 'multiple-choice' && (
                              <div className="mb-2">
                                <span className="inline-block bg-pink-100 text-pink-700 px-3 py-1 rounded-full text-sm font-medium">
                                  {qa.answer}
                                </span>
                              </div>
                            )}
                            {qa.type === 'open-ended' && (
                              <p className="leading-relaxed">{qa.answer}</p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Matches Tab */}
                {activeTab === 'matches' && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xl font-semibold text-gray-900">My Matches</h3>
                      <span className="text-sm text-gray-500">{matches.length} matches</span>
                    </div>

                    <div className="space-y-4">
                      {matches.map((match) => (
                        <div key={match.id} className="bg-gray-50 rounded-xl p-4 hover:shadow-md transition-shadow">
                          <div className="flex items-center space-x-4">
                            <img 
                              src={match.photo} 
                              alt={match.name}
                              className="w-16 h-16 rounded-full object-cover"
                            />
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-1">
                                <h4 className="font-semibold text-gray-900">{match.name}, {match.age}</h4>
                                <div className="flex items-center space-x-2">
                                  <span className="text-xs text-gray-500">{match.compatibility}% match</span>
                                  <div className={`w-3 h-3 rounded-full ${
                                    match.status === 'pending' ? 'bg-yellow-400' :
                                    match.status === 'liked' ? 'bg-green-400' :
                                    'bg-blue-400'
                                  }`}></div>
                                </div>
                              </div>
                              <p className="text-sm text-gray-600">Matched by {match.cupidName} • {match.matchDate}</p>
                              <div className="flex items-center space-x-2 mt-2">
                                {match.status === 'pending' && (
                                  <>
                                    <button className="flex items-center space-x-1 bg-green-100 hover:bg-green-200 text-green-700 px-3 py-1 rounded-full text-xs transition-colors">
                                      <ThumbsUp className="w-3 h-3" />
                                      <span>Like</span>
                                    </button>
                                    <button className="flex items-center space-x-1 bg-red-100 hover:bg-red-200 text-red-700 px-3 py-1 rounded-full text-xs transition-colors">
                                      <ThumbsDown className="w-3 h-3" />
                                      <span>Pass</span>
                                    </button>
                                  </>
                                )}
                                {match.status === 'liked' && (
                                  <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs">
                                    Waiting for response
                                  </span>
                                )}
                                {match.status === 'chatting' && (
                                  <button className="flex items-center space-x-1 bg-blue-100 hover:bg-blue-200 text-blue-700 px-3 py-1 rounded-full text-xs transition-colors">
                                    <MessageCircle className="w-3 h-3" />
                                    <span>Chat</span>
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Activity Tab */}
                {activeTab === 'activity' && (
                  <div className="space-y-6">
                    <h3 className="text-xl font-semibold text-gray-900">Recent Cupid Activity</h3>
                    
                    <div className="space-y-4">
                      <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                        <div className="flex items-center space-x-3">
                          <div className="bg-green-100 p-2 rounded-full">
                            <Heart className="w-4 h-4 text-green-600" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">Successful match!</p>
                            <p className="text-xs text-gray-600">You matched Sarah and Mike - they both liked each other! +1 point</p>
                            <p className="text-xs text-gray-500">2 hours ago</p>
                          </div>
                        </div>
                      </div>

                      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                        <div className="flex items-center space-x-3">
                          <div className="bg-blue-100 p-2 rounded-full">
                            <Star className="w-4 h-4 text-blue-600" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">Positive feedback received!</p>
                            <p className="text-xs text-gray-600">Emma thanked you for matching her with David</p>
                            <p className="text-xs text-gray-500">1 day ago</p>
                          </div>
                        </div>
                      </div>

                      <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                        <div className="flex items-center space-x-3">
                          <div className="bg-yellow-100 p-2 rounded-full">
                            <Trophy className="w-4 h-4 text-yellow-600" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">Leaderboard update!</p>
                            <p className="text-xs text-gray-600">You moved up to #12 on the Cupid leaderboard</p>
                            <p className="text-xs text-gray-500">3 days ago</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-8 text-center">
                      <button className="bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 transform hover:scale-105">
                        Continue Matchmaking
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
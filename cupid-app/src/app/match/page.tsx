"use client";

import { useState, useEffect } from 'react';
import { Heart, X, MapPin, Briefcase, GraduationCap, Loader, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';

interface User {
  id: string;
  firstName: string;
  lastName: string;
  name: string;
  age: number;
  location: string;
  occupation: string;
  education: string;
  bio: string;
  photos: string[];
  interests: string[];
  questionAnswers: { [key: string]: string };
  cupidScore?: number;
}

interface MatchPair {
  id: string;
  user1: User;
  user2: User;
  compatibilityScore?: number;
  aiAnalysis?: string;
}

// Mock data for demo purposes
const mockUsers: User[] = [
  {
    id: '1',
    firstName: 'Emma',
    lastName: 'Chen',
    name: 'Emma Chen',
    age: 24,
    location: 'Pittsburgh, PA',
    occupation: 'UX Designer',
    education: 'Carnegie Mellon University',
    bio: 'Love hiking, coffee, and creating beautiful digital experiences. Looking for someone who appreciates both adventure and cozy nights in.',
    photos: ['/api/placeholder/300/400'],
    interests: ['Design', 'Hiking', 'Coffee', 'Travel'],
    questionAnswers: {
      'q4': 'Probably that I talk to them like they understand my work problems and relationship drama equally.'
    }
  },
  {
    id: '2',
    firstName: 'Marcus',
    lastName: 'Thompson',
    name: 'Marcus Thompson',
    age: 26,
    location: 'Pittsburgh, PA',
    occupation: 'Software Engineer',
    education: 'University of Pittsburgh',
    bio: 'Full-stack developer by day, amateur chef by night. Always up for trying new restaurants or cooking together.',
    photos: ['/api/placeholder/300/400'],
    interests: ['Coding', 'Cooking', 'Basketball', 'Travel'],
    questionAnswers: {
      'q4': 'That I practice pickup lines in the mirror and rate them on a spreadsheet.'
    }
  },
  {
    id: '3',
    firstName: 'Sarah',
    lastName: 'Kim',
    name: 'Sarah Kim',
    age: 23,
    location: 'Pittsburgh, PA',
    occupation: 'Graduate Student',
    education: 'CMU Robotics Institute',
    bio: 'Building robots that might take over the world someday. When not in the lab, I love rock climbing and board games.',
    photos: ['/api/placeholder/300/400'],
    interests: ['Robotics', 'Rock Climbing', 'Board Games', 'Science'],
    questionAnswers: {
      'q4': 'That I name all my robots and talk to them like they are my children.'
    }
  },
  {
    id: '4',
    firstName: 'David',
    lastName: 'Rodriguez',
    name: 'David Rodriguez',
    age: 25,
    location: 'Pittsburgh, PA',
    occupation: 'Marketing Manager',
    education: 'Penn State University',
    bio: 'Creative marketer with a passion for storytelling. Love exploring new neighborhoods, live music, and weekend farmer markets.',
    photos: ['/api/placeholder/300/400'],
    interests: ['Marketing', 'Music', 'Photography', 'Food'],
    questionAnswers: {
      'q4': 'That I have full conversations with them about my dating life and they give surprisingly good advice.'
    }
  }
];

export default function Dashboard() {
  const [currentPair, setCurrentPair] = useState<MatchPair | null>(null);
  const [loading, setLoading] = useState(true);
  const [showResult, setShowResult] = useState(false);
  const [matchDecision, setMatchDecision] = useState<boolean | null>(null);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState({ user1: 0, user2: 0 });
  const [aiAnalysis, setAiAnalysis] = useState<string>('');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [matchesCreated, setMatchesCreated] = useState(0);

  useEffect(() => {
    // Get current user
    const userData = localStorage.getItem('currentUser');
    if (userData) {
      setCurrentUser(JSON.parse(userData));
    }

    // Load first pair
    loadNewPair();
  }, []);

  const loadNewPair = async () => {
    setLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Generate random pair
    const shuffled = [...mockUsers].sort(() => Math.random() - 0.5);
    const pair: MatchPair = {
      id: `pair_${Date.now()}`,
      user1: shuffled[0],
      user2: shuffled[1]
    };
    
    setCurrentPair(pair);
    setCurrentPhotoIndex({ user1: 0, user2: 0 });
    setLoading(false);
  };

  const generateAIAnalysis = async (user1: User, user2: User, isMatch: boolean) => {
    // Simulate AI analysis
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const commonInterests = user1.interests.filter(interest => 
      user2.interests.includes(interest)
    );
    
    const score = Math.floor(Math.random() * 30) + 70; // 70-100 score
    
    let analysis = `Compatibility Score: ${score}%\n\n`;
    
    if (commonInterests.length > 0) {
      analysis += `✨ Shared interests: ${commonInterests.join(', ')}\n`;
    }
    
    analysis += `🏠 Both located in Pittsburgh area\n`;
    
    if (isMatch) {
      analysis += `💫 Their personalities complement each other well based on their question responses. Both show humor and self-awareness.`;
    } else {
      analysis += `🤔 While they have some things in common, their communication styles and life goals may not be perfectly aligned.`;
    }
    
    return { score, analysis };
  };

  const handleMatch = async (isMatch: boolean) => {
    if (!currentPair) return;
    
    setMatchDecision(isMatch);
    setShowResult(true);
    
    // Generate AI analysis
    const analysis = await generateAIAnalysis(currentPair.user1, currentPair.user2, isMatch);
    setAiAnalysis(analysis.analysis);
    
    // Save match decision (in real app, this would go to your backend)
    const matchData = {
      pair: currentPair,
      decision: isMatch,
      cupidId: currentUser?.id,
      timestamp: new Date().toISOString(),
      aiAnalysis: analysis.analysis,
      compatibilityScore: analysis.score
    };
    
    // Store in localStorage for demo
    const existingMatches = JSON.parse(localStorage.getItem('matches') || '[]');
    existingMatches.push(matchData);
    localStorage.setItem('matches', JSON.stringify(existingMatches));
    
    // Update user's cupid score
    if (currentUser) {
      const newScore = (currentUser.cupidScore || 0) + (isMatch ? 10 : 5);
      const updatedUser = { ...currentUser, cupidScore: newScore };
      localStorage.setItem('currentUser', JSON.stringify(updatedUser));
      setCurrentUser(updatedUser);
    }
    
    setMatchesCreated(prev => prev + 1);
    
    // Auto-advance after showing result
    setTimeout(() => {
      setShowResult(false);
      setMatchDecision(null);
      setAiAnalysis('');
      loadNewPair();
    }, 4000);
  };

  const nextPhoto = (user: 'user1' | 'user2') => {
    if (!currentPair) return;
    const userPhotos = currentPair[user].photos;
    setCurrentPhotoIndex(prev => ({
      ...prev,
      [user]: (prev[user] + 1) % userPhotos.length
    }));
  };

  const prevPhoto = (user: 'user1' | 'user2') => {
    if (!currentPair) return;
    const userPhotos = currentPair[user].photos;
    setCurrentPhotoIndex(prev => ({
      ...prev,
      [user]: prev[user] === 0 ? userPhotos.length - 1 : prev[user] - 1
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-12 h-12 animate-spin text-pink-500 mx-auto mb-4" />
          <p className="text-gray-600 font-medium">Finding the perfect pair to evaluate...</p>
        </div>
      </div>
    );
  }

  if (!currentPair) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">No pairs available</p>
          <button
            onClick={loadNewPair}
            className="mt-4 px-6 py-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-lg font-medium"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Play Cupid! 💘
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Help these two people find love! Review their profiles and decide if they'd make a great match.
          </p>
          <div className="flex justify-center items-center space-x-4 mt-4">
            <div className="bg-white px-4 py-2 rounded-lg shadow">
              <span className="text-sm text-gray-600">Matches Made: </span>
              <span className="font-bold text-pink-600">{matchesCreated}</span>
            </div>
            {currentUser && (
              <div className="bg-white px-4 py-2 rounded-lg shadow">
                <span className="text-sm text-gray-600">Your Score: </span>
                <span className="font-bold text-purple-600">{currentUser.cupidScore || 0}</span>
              </div>
            )}
          </div>
        </div>

        {showResult ? (
          /* Match Result Display */
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
              <div className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-6 ${
                matchDecision ? 'bg-gradient-to-br from-pink-500 to-purple-600' : 'bg-gradient-to-br from-gray-400 to-gray-600'
              }`}>
                {matchDecision ? (
                  <Heart className="w-10 h-10 text-white" />
                ) : (
                  <X className="w-10 h-10 text-white" />
                )}
              </div>
              
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                {matchDecision ? "It's a Match! 🎉" : "Not This Time 😊"}
              </h2>
              
              <p className="text-gray-600 mb-6">
                {matchDecision 
                  ? `You think ${currentPair.user1.firstName} and ${currentPair.user2.firstName} would be perfect together!`
                  : `You don't see ${currentPair.user1.firstName} and ${currentPair.user2.firstName} as a match, and that's okay!`
                }
              </p>

              {aiAnalysis && (
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6 mb-6">
                  <div className="flex items-center justify-center mb-3">
                    <Sparkles className="w-5 h-5 text-purple-600 mr-2" />
                    <h3 className="font-semibold text-purple-900">AI Analysis</h3>
                  </div>
                  <pre className="text-sm text-purple-800 whitespace-pre-wrap text-left">
                    {aiAnalysis}
                  </pre>
                </div>
              )}

              <div className="text-sm text-gray-500">
                Loading next pair...
              </div>
            </div>
          </div>
        ) : (
          /* Profile Comparison View */
          <div className="grid lg:grid-cols-2 gap-8 mb-8">
            {/* User 1 */}
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              <div className="relative">
                <img
                  src={currentPair.user1.photos[currentPhotoIndex.user1]}
                  alt={currentPair.user1.name}
                  className="w-full h-80 object-cover"
                />
                {currentPair.user1.photos.length > 1 && (
                  <>
                    <button
                      onClick={() => prevPhoto('user1')}
                      className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => nextPhoto('user1')}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </>
                )}
                <div className="absolute bottom-4 left-4 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm">
                  Person 1
                </div>
              </div>
              
              <div className="p-6">
                <div className="flex items-center space-x-2 mb-2">
                  <h2 className="text-2xl font-bold text-gray-900">{currentPair.user1.firstName}</h2>
                  <span className="text-xl text-gray-600">{currentPair.user1.age}</span>
                </div>
                
                <div className="flex items-center text-gray-600 mb-2">
                  <MapPin className="w-4 h-4 mr-1" />
                  <span className="text-sm">{currentPair.user1.location}</span>
                </div>
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-gray-600">
                    <Briefcase className="w-4 h-4 mr-2" />
                    <span className="text-sm">{currentPair.user1.occupation}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <GraduationCap className="w-4 h-4 mr-2" />
                    <span className="text-sm">{currentPair.user1.education}</span>
                  </div>
                </div>
                
                <p className="text-gray-700 mb-4 text-sm leading-relaxed">
                  {currentPair.user1.bio}
                </p>
                
                <div className="mb-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Interests</h3>
                  <div className="flex flex-wrap gap-2">
                    {currentPair.user1.interests.map((interest, index) => (
                      <span
                        key={index}
                        className="bg-pink-100 text-pink-700 px-3 py-1 rounded-full text-sm"
                      >
                        {interest}
                      </span>
                    ))}
                  </div>
                </div>

                {currentPair.user1.questionAnswers.q4 && (
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Fun Question</h3>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-xs text-gray-600 mb-1">
                        "If your pet could talk for one day, what would be the most embarrassing thing they could reveal about you?"
                      </p>
                      <p className="text-sm text-gray-800 italic">
                        "{currentPair.user1.questionAnswers.q4}"
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* User 2 */}
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              <div className="relative">
                <img
                  src={currentPair.user2.photos[currentPhotoIndex.user2]}
                  alt={currentPair.user2.name}
                  className="w-full h-80 object-cover"
                />
                {currentPair.user2.photos.length > 1 && (
                  <>
                    <button
                      onClick={() => prevPhoto('user2')}
                      className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => nextPhoto('user2')}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </>
                )}
                <div className="absolute bottom-4 left-4 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm">
                  Person 2
                </div>
              </div>
              
              <div className="p-6">
                <div className="flex items-center space-x-2 mb-2">
                  <h2 className="text-2xl font-bold text-gray-900">{currentPair.user2.firstName}</h2>
                  <span className="text-xl text-gray-600">{currentPair.user2.age}</span>
                </div>
                
                <div className="flex items-center text-gray-600 mb-2">
                  <MapPin className="w-4 h-4 mr-1" />
                  <span className="text-sm">{currentPair.user2.location}</span>
                </div>
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-gray-600">
                    <Briefcase className="w-4 h-4 mr-2" />
                    <span className="text-sm">{currentPair.user2.occupation}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <GraduationCap className="w-4 h-4 mr-2" />
                    <span className="text-sm">{currentPair.user2.education}</span>
                  </div>
                </div>
                
                <p className="text-gray-700 mb-4 text-sm leading-relaxed">
                  {currentPair.user2.bio}
                </p>
                
                <div className="mb-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Interests</h3>
                  <div className="flex flex-wrap gap-2">
                    {currentPair.user2.interests.map((interest, index) => (
                      <span
                        key={index}
                        className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm"
                      >
                        {interest}
                      </span>
                    ))}
                  </div>
                </div>

                {currentPair.user2.questionAnswers.q4 && (
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Fun Question</h3>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-xs text-gray-600 mb-1">
                        "If your pet could talk for one day, what would be the most embarrassing thing they could reveal about you?"
                      </p>
                      <p className="text-sm text-gray-800 italic">
                        "{currentPair.user2.questionAnswers.q4}"
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Match Decision Buttons */}
        {!showResult && (
          <div className="flex justify-center space-x-8">
            <button
              onClick={() => handleMatch(false)}
              className="flex items-center space-x-3 px-8 py-4 bg-white border-2 border-gray-300 text-gray-700 rounded-2xl font-semibold hover:border-red-400 hover:text-red-600 hover:shadow-lg transform hover:-translate-y-1 transition-all duration-200"
            >
              <X className="w-6 h-6" />
              <span>Not a Match</span>
            </button>
            
            <button
              onClick={() => handleMatch(true)}
              className="flex items-center space-x-3 px-8 py-4 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-2xl font-semibold hover:shadow-lg transform hover:-translate-y-1 transition-all duration-200"
            >
              <Heart className="w-6 h-6" />
              <span>It's a Match!</span>
            </button>
          </div>
        )}

        {/* Skip Button */}
        {!showResult && (
          <div className="text-center mt-6">
            <button
              onClick={loadNewPair}
              className="text-gray-500 hover:text-gray-700 text-sm font-medium"
            >
              Skip this pair
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
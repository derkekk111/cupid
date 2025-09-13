"use client";

import { useState, useEffect } from 'react';
import { User, Mail, Calendar, Heart, Trophy, Star, Edit3, Save, X, Camera, MapPin, Briefcase, GraduationCap, Phone } from 'lucide-react';

interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  bio?: string;
  location?: string;
  occupation?: string;
  education?: string;
  interests: string[];
  cupidRank?: number;
  cupidScore?: number;
  joinDate: string;
  totalMatches: number;
  successfulMatches: number;
  successRate: number;
  profileImage?: string;
}

const ProfilePage = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    // In a real app, fetch from your API
    // For now, create a mock profile based on localStorage data
    const userData = localStorage.getItem('currentUser');
    if (userData) {
      const user = JSON.parse(userData);
      const mockProfile: UserProfile = {
        ...user,
        phone: "+1 (555) 123-4567",
        bio: "Passionate about bringing people together and creating meaningful connections. I believe that everyone deserves to find their perfect match, and I love using my intuition and experience to help make that happen. When I'm not busy being Cupid, you can find me exploring new coffee shops, hiking local trails, or planning my next adventure!",
        location: "San Francisco, CA",
        occupation: "UX Designer at Tech Startup",
        education: "Stanford University - Psychology",
        interests: ["Photography", "Hiking", "Coffee", "Travel", "Music", "Art", "Psychology", "Cooking"],
        joinDate: "2024-01-15",
        totalMatches: 127,
        successfulMatches: 98,
        successRate: 0.84,
        profileImage: "/api/placeholder/150/150"
      };
      setProfile(mockProfile);
      setEditedProfile(mockProfile);
    }
    setLoading(false);
  }, []);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    if (editedProfile) {
      setProfile(editedProfile);
      // In a real app, save to backend
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        localStorage.setItem('currentUser', JSON.stringify({
          id: editedProfile.id,
          firstName: editedProfile.firstName,
          lastName: editedProfile.lastName,
          email: editedProfile.email,
          cupidRank: editedProfile.cupidRank,
          cupidScore: editedProfile.cupidScore
        }));
        
        // Show success message (you could use a toast notification)
        console.log('Profile updated successfully!');
      } catch (error) {
        console.error('Error updating profile:', error);
      }
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedProfile(profile);
    setIsEditing(false);
  };

  const updateInterests = (interest: string) => {
    if (!editedProfile) return;
    
    const currentInterests = editedProfile.interests;
    const updatedInterests = currentInterests.includes(interest)
      ? currentInterests.filter(i => i !== interest)
      : [...currentInterests, interest];
    
    setEditedProfile({
      ...editedProfile,
      interests: updatedInterests
    });
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && editedProfile) {
      // In a real app, you'd upload to your server
      const reader = new FileReader();
      reader.onload = (e) => {
        setEditedProfile({
          ...editedProfile,
          profileImage: e.target?.result as string
        });
      };
      reader.readAsDataURL(file);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="text-gray-600">Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <User className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Profile Not Found</h2>
          <p className="text-gray-600">Please log in to view your profile.</p>
        </div>
      </div>
    );
  }

  const availableInterests = [
    "Photography", "Hiking", "Cooking", "Travel", "Music", "Art", "Reading", "Gaming",
    "Sports", "Movies", "Dancing", "Yoga", "Coffee", "Wine", "Theater", "Technology",
    "Psychology", "Fitness", "Fashion", "Writing", "Gardening", "Meditation"
  ];

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'stats', label: 'Statistics' },
    { id: 'activity', label: 'Activity' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Profile Header */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
          {/* Cover Photo */}
          <div className="h-48 bg-gradient-to-r from-blue-500 via-purple-600 to-pink-500"></div>
          
          {/* Profile Info */}
          <div className="px-8 py-6">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between -mt-20 md:-mt-16">
              {/* Profile Image and Basic Info */}
              <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-6">
                <div className="relative">
                  <div className="w-32 h-32 rounded-full border-4 border-white shadow-lg overflow-hidden bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                    {profile.profileImage ? (
                      <img
                        src={profile.profileImage}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User className="w-16 h-16 text-white" />
                    )}
                  </div>
                  
                  {isEditing && (
                    <label className="absolute bottom-2 right-2 bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full cursor-pointer shadow-lg transition-colors">
                      <Camera className="w-4 h-4" />
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
                
                <div className="text-center md:text-left">
                  {isEditing ? (
                    <div className="space-y-2">
                      <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2">
                        <input
                          type="text"
                          value={editedProfile?.firstName || ''}
                          onChange={(e) => setEditedProfile(prev => prev ? { ...prev, firstName: e.target.value } : null)}
                          className="border border-gray-300 rounded px-3 py-2 text-lg font-semibold"
                          placeholder="First Name"
                        />
                        <input
                          type="text"
                          value={editedProfile?.lastName || ''}
                          onChange={(e) => setEditedProfile(prev => prev ? { ...prev, lastName: e.target.value } : null)}
                          className="border border-gray-300 rounded px-3 py-2 text-lg font-semibold"
                          placeholder="Last Name"
                        />
                      </div>
                      <input
                        type="email"
                        value={editedProfile?.email || ''}
                        onChange={(e) => setEditedProfile(prev => prev ? { ...prev, email: e.target.value } : null)}
                        className="border border-gray-300 rounded px-3 py-2 text-gray-600 w-full"
                        placeholder="Email"
                      />
                    </div>
                  ) : (
                    <>
                      <h1 className="text-3xl font-bold text-gray-900">
                        {profile.firstName} {profile.lastName}
                      </h1>
                      <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4 text-gray-600 mt-2">
                        <div className="flex items-center space-x-1">
                          <Mail className="w-4 h-4" />
                          <span>{profile.email}</span>
                        </div>
                        {profile.phone && (
                          <div className="flex items-center space-x-1">
                            <Phone className="w-4 h-4" />
                            <span>{profile.phone}</span>
                          </div>
                        )}
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-4 h-4" />
                          <span>Joined {new Date(profile.joinDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
                        </div>
                      </div>
                      
                      {/* Additional Info */}
                      <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4 text-gray-600 mt-3">
                        {profile.location && (
                          <div className="flex items-center space-x-1">
                            <MapPin className="w-4 h-4" />
                            <span>{profile.location}</span>
                          </div>
                        )}
                        {profile.occupation && (
                          <div className="flex items-center space-x-1">
                            <Briefcase className="w-4 h-4" />
                            <span>{profile.occupation}</span>
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </div>
              </div>
              
              {/* Edit Button */}
              <div className="flex items-center space-x-2 mt-4 md:mt-0">
                {isEditing ? (
                  <>
                    <button
                      onClick={handleSave}
                      className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                    >
                      <Save className="w-4 h-4" />
                      <span>Save</span>
                    </button>
                    <button
                      onClick={handleCancel}
                      className="flex items-center space-x-2 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
                    >
                      <X className="w-4 h-4" />
                      <span>Cancel</span>
                    </button>
                  </>
                ) : (
                  <button
                    onClick={handleEdit}
                    className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Edit3 className="w-4 h-4" />
                    <span>Edit Profile</span>
                  </button>
                )}
              </div>
            </div>

            {/* Cupid Stats Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 pt-6 border-t border-gray-200">
              <div className="bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg p-4 text-center">
                <Trophy className="w-6 h-6 text-purple-600 mx-auto mb-2" />
                <div className="text-xl font-bold text-purple-600">#{profile.cupidRank || 'Unranked'}</div>
                <div className="text-xs text-gray-600">Rank</div>
              </div>
              
              <div className="bg-gradient-to-br from-yellow-100 to-orange-100 rounded-lg p-4 text-center">
                <Star className="w-6 h-6 text-yellow-600 mx-auto mb-2" />
                <div className="text-xl font-bold text-yellow-600">{profile.cupidScore || 0}</div>
                <div className="text-xs text-gray-600">Points</div>
              </div>
              
              <div className="bg-gradient-to-br from-pink-100 to-red-100 rounded-lg p-4 text-center">
                <Heart className="w-6 h-6 text-pink-600 mx-auto mb-2" />
                <div className="text-xl font-bold text-pink-600">{profile.totalMatches}</div>
                <div className="text-xs text-gray-600">Matches</div>
              </div>
              
              <div className="bg-gradient-to-br from-green-100 to-emerald-100 rounded-lg p-4 text-center">
                <div className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="text-white text-xs font-bold">✓</span>
                </div>
                <div className="text-xl font-bold text-green-600">{Math.round(profile.successRate * 100)}%</div>
                <div className="text-xs text-gray-600">Success</div>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-xl shadow-lg mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-8">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-8">
            {activeTab === 'overview' && (
              <div className="space-y-8">
                {/* Bio Section */}
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">About Me</h3>
                  {isEditing ? (
                    <textarea
                      value={editedProfile?.bio || ''}
                      onChange={(e) => setEditedProfile(prev => prev ? { ...prev, bio: e.target.value } : null)}
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-700 resize-none"
                      rows={4}
                      placeholder="Tell others about yourself and your approach to matchmaking..."
                    />
                  ) : (
                    <p className="text-gray-700 leading-relaxed">
                      {profile.bio || "No bio available yet. Click edit to add one!"}
                    </p>
                  )}
                </div>

                {/* Additional Info */}
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Details</h3>
                    <div className="space-y-3">
                      {isEditing ? (
                        <>
                          <div className="flex items-center space-x-3">
                            <MapPin className="w-5 h-5 text-gray-400" />
                            <input
                              type="text"
                              value={editedProfile?.location || ''}
                              onChange={(e) => setEditedProfile(prev => prev ? { ...prev, location: e.target.value } : null)}
                              className="border border-gray-300 rounded px-3 py-2 flex-1"
                              placeholder="Location"
                            />
                          </div>
                          <div className="flex items-center space-x-3">
                            <Briefcase className="w-5 h-5 text-gray-400" />
                            <input
                              type="text"
                              value={editedProfile?.occupation || ''}
                              onChange={(e) => setEditedProfile(prev => prev ? { ...prev, occupation: e.target.value } : null)}
                              className="border border-gray-300 rounded px-3 py-2 flex-1"
                              placeholder="Occupation"
                            />
                          </div>
                          <div className="flex items-center space-x-3">
                            <GraduationCap className="w-5 h-5 text-gray-400" />
                            <input
                              type="text"
                              value={editedProfile?.education || ''}
                              onChange={(e) => setEditedProfile(prev => prev ? { ...prev, education: e.target.value } : null)}
                              className="border border-gray-300 rounded px-3 py-2 flex-1"
                              placeholder="Education"
                            />
                          </div>
                          <div className="flex items-center space-x-3">
                            <Phone className="w-5 h-5 text-gray-400" />
                            <input
                              type="tel"
                              value={editedProfile?.phone || ''}
                              onChange={(e) => setEditedProfile(prev => prev ? { ...prev, phone: e.target.value } : null)}
                              className="border border-gray-300 rounded px-3 py-2 flex-1"
                              placeholder="Phone number"
                            />
                          </div>
                        </>
                      ) : (
                        <>
                          {profile.location && (
                            <div className="flex items-center space-x-3 text-gray-700">
                              <MapPin className="w-5 h-5 text-gray-400" />
                              <span>{profile.location}</span>
                            </div>
                          )}
                          {profile.occupation && (
                            <div className="flex items-center space-x-3 text-gray-700">
                              <Briefcase className="w-5 h-5 text-gray-400" />
                              <span>{profile.occupation}</span>
                            </div>
                          )}
                          {profile.education && (
                            <div className="flex items-center space-x-3 text-gray-700">
                              <GraduationCap className="w-5 h-5 text-gray-400" />
                              <span>{profile.education}</span>
                            </div>
                          )}
                          {profile.phone && (
                            <div className="flex items-center space-x-3 text-gray-700">
                              <Phone className="w-5 h-5 text-gray-400" />
                              <span>{profile.phone}</span>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  </div>

                  {/* Interests */}
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Interests</h3>
                    {isEditing ? (
                      <div>
                        <p className="text-gray-600 mb-3 text-sm">Select your interests (click to add/remove):</p>
                        <div className="flex flex-wrap gap-2 max-h-64 overflow-y-auto">
                          {availableInterests.map((interest) => {
                            const isSelected = editedProfile?.interests.includes(interest);
                            return (
                              <button
                                key={interest}
                                onClick={() => updateInterests(interest)}
                                className={`px-3 py-2 rounded-full text-sm font-medium transition-colors ${
                                  isSelected
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                }`}
                              >
                                {interest}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-wrap gap-2">
                        {profile.interests.length > 0 ? (
                          profile.interests.map((interest) => (
                            <span
                              key={interest}
                              className="bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 px-3 py-2 rounded-full text-sm font-medium"
                            >
                              {interest}
                            </span>
                          ))
                        ) : (
                          <p className="text-gray-500 italic">No interests added yet. Click edit to add some!</p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'stats' && (
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-gray-900">Detailed Statistics</h3>
                
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6">
                    <h4 className="font-semibold text-blue-900 mb-2">Total Matches Made</h4>
                    <div className="text-3xl font-bold text-blue-600">{profile.totalMatches}</div>
                    <p className="text-blue-700 text-sm mt-1">Connections facilitated</p>
                  </div>
                  
                  <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-6">
                    <h4 className="font-semibold text-green-900 mb-2">Successful Matches</h4>
                    <div className="text-3xl font-bold text-green-600">{profile.successfulMatches}</div>
                    <p className="text-green-700 text-sm mt-1">Led to dates/relationships</p>
                  </div>
                  
                  <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-6">
                    <h4 className="font-semibold text-purple-900 mb-2">Success Rate</h4>
                    <div className="text-3xl font-bold text-purple-600">{Math.round(profile.successRate * 100)}%</div>
                    <p className="text-purple-700 text-sm mt-1">Above average!</p>
                  </div>
                  
                  <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg p-6">
                    <h4 className="font-semibold text-yellow-900 mb-2">Cupid Points</h4>
                    <div className="text-3xl font-bold text-yellow-600">{profile.cupidScore}</div>
                    <p className="text-yellow-700 text-sm mt-1">Total points earned</p>
                  </div>
                  
                  <div className="bg-gradient-to-br from-pink-50 to-pink-100 rounded-lg p-6">
                    <h4 className="font-semibold text-pink-900 mb-2">Current Rank</h4>
                    <div className="text-3xl font-bold text-pink-600">#{profile.cupidRank}</div>
                    <p className="text-pink-700 text-sm mt-1">Out of all Cupids</p>
                  </div>
                  
                  <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-lg p-6">
                    <h4 className="font-semibold text-indigo-900 mb-2">Days Active</h4>
                    <div className="text-3xl font-bold text-indigo-600">
                      {Math.floor((Date.now() - new Date(profile.joinDate).getTime()) / (1000 * 60 * 60 * 24))}
                    </div>
                    <p className="text-indigo-700 text-sm mt-1">Since joining</p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'activity' && (
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-gray-900">Recent Activity</h3>
                
                <div className="space-y-4">
                  <div className="flex items-center space-x-4 p-4 bg-green-50 rounded-lg border border-green-200">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <Heart className="w-5 h-5 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">Successful match created!</p>
                      <p className="text-sm text-gray-600">Connected Sarah and Mike - they're going on their first date tomorrow</p>
                    </div>
                    <div className="text-sm text-gray-500">2 days ago</div>
                  </div>

                  <div className="flex items-center space-x-4 p-4 bg-purple-50 rounded-lg border border-purple-200">
                    <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                      <Trophy className="w-5 h-5 text-purple-600" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">Rank improved!</p>
                      <p className="text-sm text-gray-600">Moved up 3 positions on the leaderboard</p>
                    </div>
                    <div className="text-sm text-gray-500">1 week ago</div>
                  </div>

                  <div className="flex items-center space-x-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <Star className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">Positive feedback received!</p>
                      <p className="text-sm text-gray-600">Emma loved your match suggestion and left great feedback</p>
                    </div>
                    <div className="text-sm text-gray-500">1 week ago</div>
                  </div>

                  <div className="flex items-center space-x-4 p-4 bg-orange-50 rounded-lg border border-orange-200">
                    <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                      <Heart className="w-5 h-5 text-orange-600" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">Match milestone reached!</p>
                      <p className="text-sm text-gray-600">Celebrated your 100th match - keep up the great work!</p>
                    </div>
                    <div className="text-sm text-gray-500">2 weeks ago</div>
                  </div>

                  <div className="flex items-center space-x-4 p-4 bg-pink-50 rounded-lg border border-pink-200">
                    <div className="w-10 h-10 bg-pink-100 rounded-full flex items-center justify-center">
                      <Trophy className="w-5 h-5 text-pink-600" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">Achievement unlocked!</p>
                      <p className="text-sm text-gray-600">Earned the "Love Guru" badge for exceptional success rate</p>
                    </div>
                    <div className="text-sm text-gray-500">3 weeks ago</div>
                  </div>
                </div>

                <div className="text-center py-8">
                  <p className="text-gray-500 italic">That's all your recent activity!</p>
                  <button className="mt-3 text-blue-600 hover:text-blue-700 font-medium">
                    Load more activity
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Achievements Section */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Achievements & Badges</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-yellow-100 to-yellow-200 rounded-lg p-6 border border-yellow-300">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center">
                  <Trophy className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="font-bold text-yellow-800">Top 10 Cupid</h4>
                  <p className="text-sm text-yellow-700">Rank in top 10</p>
                </div>
              </div>
              <p className="text-xs text-yellow-600">Achieved for maintaining a top 10 position for 30+ days</p>
            </div>

            <div className="bg-gradient-to-br from-pink-100 to-pink-200 rounded-lg p-6 border border-pink-300">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-12 h-12 bg-pink-500 rounded-full flex items-center justify-center">
                  <Heart className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="font-bold text-pink-800">Love Guru</h4>
                  <p className="text-sm text-pink-700">80%+ success rate</p>
                </div>
              </div>
              <p className="text-xs text-pink-600">Exceptional matchmaking skills with high success rate</p>
            </div>

            <div className="bg-gradient-to-br from-purple-100 to-purple-200 rounded-lg p-6 border border-purple-300">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center">
                  <Star className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="font-bold text-purple-800">Century Maker</h4>
                  <p className="text-sm text-purple-700">100+ matches</p>
                </div>
              </div>
              <p className="text-xs text-purple-600">Reached the impressive milestone of 100 successful matches</p>
            </div>

            <div className="bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg p-6 border border-blue-300">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="font-bold text-blue-800">Community Favorite</h4>
                  <p className="text-sm text-blue-700">50+ positive reviews</p>
                </div>
              </div>
              <p className="text-xs text-blue-600">Beloved by the community for excellent matchmaking</p>
            </div>

            <div className="bg-gradient-to-br from-green-100 to-green-200 rounded-lg p-6 border border-green-300">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="font-bold text-green-800">Consistent Cupid</h4>
                  <p className="text-sm text-green-700">30+ day streak</p>
                </div>
              </div>
              <p className="text-xs text-green-600">Active matchmaking for 30+ consecutive days</p>
            </div>

            <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg p-6 border border-gray-300 opacity-50">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-12 h-12 bg-gray-400 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold">?</span>
                </div>
                <div>
                  <h4 className="font-bold text-gray-600">Mystery Achievement</h4>
                  <p className="text-sm text-gray-500">Keep going to unlock!</p>
                </div>
              </div>
              <p className="text-xs text-gray-500">Continue your excellent work to discover this achievement</p>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="bg-gradient-to-r from-pink-500 to-purple-600 rounded-xl shadow-xl p-8 text-center text-white mt-8">
          <Heart className="w-16 h-16 mx-auto mb-4 opacity-90" />
          <h3 className="text-2xl font-bold mb-2">Ready to Make More Matches?</h3>
          <p className="text-pink-100 mb-6 max-w-2xl mx-auto">
            Your profile is looking great! Time to get back out there and help more people find love. 
            Every connection you make brings you closer to the top of the leaderboard.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/dashboard"
              className="bg-white text-purple-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors inline-flex items-center justify-center space-x-2"
            >
              <Heart className="w-5 h-5" />
              <span>Start Matching</span>
            </a>
            <a
              href="/leaderboard"
              className="bg-purple-700 text-white px-8 py-3 rounded-lg font-semibold hover:bg-purple-800 transition-colors inline-flex items-center justify-center space-x-2"
            >
              <Trophy className="w-5 h-5" />
              <span>View Leaderboard</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
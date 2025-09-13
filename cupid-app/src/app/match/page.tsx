"use client"

import { useState, useEffect } from 'react';
import { GetServerSideProps } from 'next';
import { Heart, X, MapPin, Briefcase, GraduationCap, Users, Zap, Loader } from 'lucide-react';
import { Profile, MatchDecision, CompatibilityResult } from '@/types/index.ts';
import styles from './match.module.css';

interface DatingAppProps {
  initialProfiles?: Profile[];
}

export default function Match({ initialProfiles }: DatingAppProps) {
  const [profilePairs, setProfilePairs] = useState<Profile[][]>([]);
  const [currentPairIndex, setCurrentPairIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showMatchResult, setShowMatchResult] = useState<boolean>(false);
  const [matchDecision, setMatchDecision] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [matchId, setMatchId] = useState<string | null>(null);

  // Load profiles from API if not provided via SSR
  useEffect(() => {
    initializeProfiles();
  }, []);

  const initializeProfiles = async (): Promise<void> => {
    setLoading(true);
    try {
      // Generate multiple profile pairs for infinite flow
      const pairs: Profile[][] = [];
      for (let i = 0; i < 5; i++) {
        const pairData = await getServerSideProps();
        pairs.push(pairData);
      }
      setProfilePairs(pairs);
    } catch (error) {
      console.error('Error fetching profiles:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMatch = async (isMatch: boolean): Promise<void> => {
    if (!profilePairs[currentPairIndex] || profilePairs[currentPairIndex].length < 2) return;

    setIsAnimating(true);
    setMatchDecision(isMatch);

    const currentProfiles = profilePairs[currentPairIndex];

    // Save match decision to database
    try {
      const response = await fetch('/api/matches', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          profile1Id: currentProfiles[0].id,
          profile2Id: currentProfiles[1].id,
          isMatch,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setMatchId(data.matchId);
      }
    } catch (error) {
      console.error('Error saving match:', error);
    }

    // Show result for 2 seconds, then move to next pair
    setShowMatchResult(true);
    
    setTimeout(() => {
      setShowMatchResult(false);
      moveToNextPair();
    }, 2000);
  };

  const moveToNextPair = async (): Promise<void> => {
    // Move to next pair
    const nextIndex = currentPairIndex + 1;
    
    // If we're running low on pairs, fetch more
    if (nextIndex >= profilePairs.length - 2) {
      const newPair = await getServerSideProps();
      setProfilePairs(prev => [...prev, newPair]);
    }
    
    setCurrentPairIndex(nextIndex);
    setIsAnimating(false);
    setMatchId(null);
  };

  const resetToFirstPair = async (): Promise<void> => {
    setCurrentPairIndex(0);
    setShowMatchResult(false);
    setIsAnimating(false);
    setMatchId(null);
  };

  interface ProfileCardProps {
    profile: Profile;
    side: 'left' | 'right';
    zIndex: number;
    isActive: boolean;
    animationClass?: string;
  }

  const ProfileCard = ({ profile, side, zIndex, isActive, animationClass }: ProfileCardProps) => (
    <div 
      className={`${styles.profileCard} ${animationClass || ''}`}
      style={{ 
        zIndex,
        opacity: isActive ? 1 : 0.3,
        transform: `scale(${isActive ? 1 : 0.95}) translateY(${isActive ? 0 : 10}px)`,
        transition: 'all 0.3s ease-in-out'
      }}
    >
      {/* Photo */}
      <div className={styles.photoContainer}>
        <img 
          src={profile.photo || '/api/placeholder/400/500'} 
          alt={profile.name}
          className={styles.photo}
        />
        <div className={styles.distanceBadge}>
          {profile.distance || 'Unknown distance'}
        </div>
      </div>

      {/* Profile Info */}
      <div className={styles.profileInfo}>
        {/* Name and Age */}
        <div className={styles.nameAge}>
          <h3 className={styles.name}>{profile.name}</h3>
          <span className={styles.age}>{profile.age}</span>
        </div>

        {/* Location */}
        <div className={styles.location}>
          <MapPin className={styles.locationIcon} />
          <span>{profile.location}</span>
        </div>

        {/* Work and Education */}
        <div className={styles.workEducation}>
          <div className={styles.workEducationItem}>
            <Briefcase className={styles.workEducationIcon} />
            <span>{profile.occupation}</span>
          </div>
          <div className={styles.workEducationItem}>
            <GraduationCap className={styles.workEducationIcon} />
            <span>{profile.education}</span>
          </div>
        </div>

        {/* Bio */}
        <p className={styles.bio}>
          {profile.bio}
        </p>

        {/* Interests */}
        {profile.interests && profile.interests.length > 0 && (
          <div className={styles.section}>
            <h4 className={styles.sectionTitle}>INTERESTS</h4>
            <div className={styles.tags}>
              {profile.interests.map((interest, index) => (
                <span key={index} className={styles.interestTag}>
                  {interest}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Personality */}
        {profile.personality && profile.personality.length > 0 && (
          <div className={styles.section}>
            <h4 className={styles.sectionTitle}>PERSONALITY</h4>
            <div className={styles.tags}>
              {profile.personality.map((trait, index) => (
                <span key={index} className={styles.personalityTag}>
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
      <div className={styles.loading}>
        <div className={styles.loadingContent}>
          <Loader className={styles.spinner} />
          <p className={styles.loadingText}>Loading profiles...</p>
        </div>
      </div>
    );
  }

  if (!profilePairs || profilePairs.length === 0) {
    return (
      <div className={styles.noProfiles}>
        <div className={styles.noProfilesContent}>
          <p className={styles.loadingText}>No profiles available</p>
          <button 
            onClick={initializeProfiles}
            className={styles.resetButton}
            style={{ marginTop: '1rem' }}
          >
            Load Profiles
          </button>
        </div>
      </div>
    );
  }

  const currentProfiles = profilePairs[currentPairIndex] || [];
  const nextProfiles = profilePairs[currentPairIndex + 1] || [];

  return (
    <div className={styles.container}>
      <div className={styles.main}>
        {!showMatchResult ? (
          <>
            {/* Instructions */}
            <div className={styles.instructions}>
              <h1 className={styles.instructionsTitle}>
                Are {currentProfiles[0]?.name} and {currentProfiles[1]?.name} a Good Match?
              </h1>
              <p className={styles.instructionsText}>
                Review both profiles below and decide if these two people would be compatible. 
                Consider their interests, personalities, and what they're looking for.
              </p>
            </div>

            {/* Profile Cards Stack */}
            <div className={styles.cardStackContainer}>
              {/* Left Profile Stack */}
              <div className={styles.profileStack}>
                <div className={styles.profileHeader}>
                  <div className={`${styles.profileBadge} ${styles.profileBadge1}`}>
                    Profile 1
                  </div>
                </div>
                
                {/* Background cards */}
                {nextProfiles[0] && (
                  <ProfileCard 
                    profile={nextProfiles[0]} 
                    side="left" 
                    zIndex={1}
                    isActive={false}
                  />
                )}
                
                {/* Active card */}
                {currentProfiles[0] && (
                  <ProfileCard 
                    profile={currentProfiles[0]} 
                    side="left" 
                    zIndex={2}
                    isActive={true}
                    animationClass={isAnimating ? styles.slideOut : ''}
                  />
                )}
              </div>

              {/* Center Match Buttons */}
              <div className={styles.centerButtons}>
                <button 
                  onClick={() => handleMatch(false)}
                  className={`${styles.button} ${styles.rejectButton}`}
                  disabled={isAnimating}
                >
                  <X className={styles.buttonIcon} />
                  Pass
                </button>
                
                <button 
                  onClick={() => handleMatch(true)}
                  className={`${styles.button} ${styles.matchButton}`}
                  disabled={isAnimating}
                >
                  <Heart className={styles.buttonIcon} />
                  Match
                </button>
              </div>

              {/* Right Profile Stack */}
              <div className={styles.profileStack}>
                <div className={styles.profileHeader}>
                  <div className={`${styles.profileBadge} ${styles.profileBadge2}`}>
                    Profile 2
                  </div>
                </div>
                
                {/* Background cards */}
                {nextProfiles[1] && (
                  <ProfileCard 
                    profile={nextProfiles[1]} 
                    side="right" 
                    zIndex={1}
                    isActive={false}
                  />
                )}
                
                {/* Active card */}
                {currentProfiles[1] && (
                  <ProfileCard 
                    profile={currentProfiles[1]} 
                    side="right" 
                    zIndex={2}
                    isActive={true}
                    animationClass={isAnimating ? styles.slideOut : ''}
                  />
                )}
              </div>
            </div>
          </>
        ) : (
          /* Quick Match Result Overlay */
          <div className={styles.quickResultOverlay}>
            <div className={styles.quickResultContent}>
              <div className={`${styles.quickResultIcon} ${
                matchDecision ? styles.quickMatchIcon : styles.quickNoMatchIcon
              }`}>
                {matchDecision ? (
                  <Heart className={styles.quickResultIconSvg} />
                ) : (
                  <X className={styles.quickResultIconSvg} />
                )}
              </div>
              <div className={styles.quickResultText}>
                {matchDecision ? "It's a Match!" : "No Match"}
              </div>
            </div>
          </div>
        )}

        {/* Counter */}
        <div className={styles.counter}>
          Pair {currentPairIndex + 1} of {profilePairs.length}
        </div>
      </div>
    </div>
  );
}
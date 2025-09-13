"use client"

import { useState, useEffect } from 'react';
import { GetServerSideProps } from 'next';
import { Heart, X, MapPin, Briefcase, GraduationCap, Users, Zap, Loader } from 'lucide-react';
import { Profile, MatchDecision, CompatibilityResult } from '@/types/index.ts';
import styles from './match.module.css';

interface DatingAppProps {
  initialProfiles?: Profile[];
}

export default function match({ initialProfiles }: DatingAppProps) {

  const [profiles, setProfiles] = useState<Profile[]>(initialProfiles || []);
  const [showMatchResult, setShowMatchResult] = useState<boolean>(false);
  const [matchDecision, setMatchDecision] = useState<boolean>(false);
  const [matchScore, setMatchScore] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [matchId, setMatchId] = useState<string | null>(null);

  // Load profiles from API if not provided via SSR
  useEffect(() => {
    if (!initialProfiles) {
      fetchProfiles();
    }
  }, [initialProfiles]);

  const fetchProfiles = async (): Promise<void> => {
    setLoading(true);
    try {
      // const response = await fetch('/api/profiles/random-pair');
      const response = await getServerSideProps();
      // if (!response.ok) {
      //   throw new Error('Failed to fetch profiles');
      // }
      if(!response){
        throw new Error('Failed to fetch profiles!')
      }
      // const data: Profile[] = await response.json();
      // const data: Profile[] = response;
      // setProfiles(data);
      setProfiles(response);
    } catch (error) {
      console.error('Error fetching profiles:', error);
    } finally {
      setLoading(false);
    }
  };

  
  const handleMatch = async (isMatch: boolean): Promise<void> => {
    if (profiles.length < 2) return;

    setMatchDecision(isMatch);
    setShowMatchResult(true);

    // Save match decision to database
    try {
      const response = await fetch('/api/matches', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          profile1Id: profiles[0].id,
          profile2Id: profiles[1].id,
          isMatch,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save match');
      }

      const data = await response.json();
      setMatchId(data.matchId);
    } catch (error) {
      console.error('Error saving match:', error);
    }
  };

  const resetMatch = async (): Promise<void> => {
    setShowMatchResult(false);
    setMatchDecision(false);
    setMatchId(null);
    
    // Fetch new profiles
    await fetchProfiles();
  };

  interface ProfileCardProps {
    profile: Profile;
    side: 'left' | 'right';
  }

  const ProfileCard = ({ profile, side }: ProfileCardProps) => (
    <div className={styles.profileCard}>
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

  if (!profiles || profiles.length < 2) {
    return (
      <div className={styles.noProfiles}>
        <div className={styles.noProfilesContent}>
          <p className={styles.loadingText}>No profiles available</p>
          <button 
            onClick={fetchProfiles}
            className={styles.resetButton}
            style={{ marginTop: '1rem' }}
          >
            Load Profiles
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* Header */}
      {/* <div className={styles.header}>
        <div className={styles.headerContent}>
          <div className={styles.title}>
            Cupid Dating App
          </div>
          <div className={styles.subtitle}>
            <Users className={styles.subtitleIcon} />
            <span className={styles.subtitleText}>Profile Compatibility</span>
          </div>
        </div>
      </div> */}

      <div className={styles.main}>
        {!showMatchResult ? (
          <>
            {/* Instructions */}
            <div className={styles.instructions}>
              <h1 className={styles.instructionsTitle}>
                Are {profiles[0]?.name} and {profiles[1]?.name} a Good Match?
              </h1>
              <p className={styles.instructionsText}>
                Review both profiles below and decide if these two people would be compatible. 
                Consider their interests, personalities, and what they're looking for.
              </p>
            </div>

            {/* Profile Cards Side by Side */}
            <div className={styles.profilesContainer}>
              <div className={styles.profileSection}>
                <div className={styles.profileHeader}>
                  <div className={`${styles.profileBadge} ${styles.profileBadge1}`}>
                    Profile 1
                  </div>
                </div>
                <ProfileCard profile={profiles[0]} side="left" />
              </div>

              <div className={styles.profileSection}>
                <div className={styles.profileHeader}>
                  <div className={`${styles.profileBadge} ${styles.profileBadge2}`}>
                    Profile 2
                  </div>
                </div>
                <ProfileCard profile={profiles[1]} side="right" />
              </div>
            </div>

            {/* Match Decision Buttons */}
            <div className={styles.buttonsContainer}>
              <button 
                onClick={() => handleMatch(false)}
                className={`${styles.button} ${styles.rejectButton}`}
              >
                <X className={styles.buttonIcon} />
                Not a Match
              </button>
              
              <button 
                onClick={() => handleMatch(true)}
                className={`${styles.button} ${styles.matchButton}`}
              >
                <Heart className={styles.buttonIcon} />
                Perfect Match!
              </button>
            </div>
          </>
        ) : (
          /* Match Result */
          <div className={styles.resultContainer}>
            <div className={styles.resultCard}>
              <div className={`${styles.resultIcon} ${
                matchDecision ? styles.matchIcon : styles.noMatchIcon
              }`}>
                {matchDecision ? (
                  <Heart className={styles.resultIconSvg} />
                ) : (
                  <X className={styles.resultIconSvg} />
                )}
              </div>

              <h2 className={styles.resultTitle}>
                {matchDecision? "You Think They're a Match!" : "You Think They're Not Compatible"}
              </h2>

              <div className={styles.resultMessage}>
                {matchDecision?
                  "Great eye for compatibility! These profiles show several areas of potential connection."
                  : "Everyone has different preferences. Maybe they're better as friends, or perhaps you see something that would make them incompatible."
                }
              </div>

              {matchId && (
                <div className={styles.matchId}>
                  Match ID: {matchId}
                </div>
              )}

              <button 
                onClick={resetMatch}
                className={styles.resetButton}
              >
                Try New Profiles
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Server-side rendering to pre-load profiles
// const getServerSideProps: GetServerSideProps<DatingAppProps> = async () => {
const getServerSideProps = async () => {
  try {

    //temporary
    const profiles: Profile[] = [
      {
        id: 1,
        name: "Emma",
        age: 28,
        location: "San Francisco, CA",
        occupation: "UX Designer",
        education: "Stanford University",
        bio: "Coffee enthusiast ☕ | Love hiking and exploring new places | Looking for genuine connections",
        photo: "https://images.unsplash.com/photo-1494790108755-2616c3e09b02?w=400&h=500&fit=crop",
        interests: ["Photography", "Hiking", "Cooking", "Yoga", "Travel"],
        personality: ["Creative", "Adventurous", "Thoughtful"],
        distance: "2 miles away",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 2,
        name: "Alex",
        age: 31,
        location: "San Francisco, CA",
        occupation: "Software Engineer",
        education: "UC Berkeley",
        bio: "Tech geek 💻 | Weekend warrior | Love good food and better company | Always up for an adventure",
        photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=500&fit=crop",
        interests: ["Rock Climbing", "Gaming", "Cooking", "Movies", "Startups"],
        personality: ["Analytical", "Adventurous", "Ambitious"],
        distance: "1 mile away",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
    ];

    // return {
    //   props: {
    //     initialProfiles: profiles,
    //   },
    // };
    return profiles;
  } catch (error) {
    console.error('Error fetching profiles:', error);
    return {
      props: {
        initialProfiles: [],
      },
    };
  }
};
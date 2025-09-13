export interface Profile {
  id: number;
  name: string;
  age: number;
  location: string;
  occupation: string;
  education: string;
  bio: string;
  photo?: string;
  interests?: string[];
  personality?: string[];
  distance?: string;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}
  
export interface Match {
    id?: number;
    profile1Id: number;
    profile2Id: number;
    isMatch: boolean;
    compatibilityScore?: number;
    reasons?: string[];
    matchedAt?: string;
}
  
export interface CompatibilityResult {
  score: number;
  reasons: string[];
}

export interface MatchDecision {
  isMatch: boolean;
  reasons: string[];
}

export interface ApiResponse<T = any> {
  success?: boolean;
  data?: T;
  error?: string;
  message?: string;
}
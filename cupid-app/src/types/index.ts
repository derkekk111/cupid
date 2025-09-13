export interface Profile {
  firstName: string;
  lastName: string;
  age: number;
  email: string;
  password: '',
  confirmPassword: '',
  question1: '',
  question2: '',
  question3: '',
  question4: '',
  longq: ''
  photo?: string;
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

export interface ApiResponse<T = any> {
  success?: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface Option {
  id: number;
  text: string;
}

export interface Question {
  id: number;
  text: string;
  options: Option[];
}
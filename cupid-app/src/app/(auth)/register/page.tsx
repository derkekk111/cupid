"use client"

import { useState } from 'react';
// import supabase from 
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import styles from './register.module.css';

export default function SignUp() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    // question1: '',
    // question2: '',
    // question3: '',
    // question4: '',
    longq: ''
  });
  const longques = [
    "If you were a kitchen appliance, which one would you be and why?", 
    "Would you rather fight a gorilla once a year or always have one seagull following you everywhere?",
    "If your left shoe suddenly gained consciousness, what would it say about your life choices?",
    "What’s the strangest object you could confidently beat someone with in a duel?",
    "If you had to replace your hands with something else, what would you choose?",
    "What smell do you think your personality gives off?",
    "If you had to be haunted by a ghost of any historical figure, who would you pick and why?",
    "What animal do you think is secretly plotting against humanity?",
    "If you had to rename the sun, what would you call it?",
    "You’re cursed so every time you sneeze, something random happens — what would you want it to be?"
  ]
  let longquesindx = Math.floor(Math.random() * longques.length);
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    // Clear error when user starts typing
    if (error) setError('');
  };

  const validateForm = () => {
    if (!formData.firstName.trim()) {
      setError('First name is required');
      return false;
    }
    if (!formData.lastName.trim()) {
      setError('Last name is required');
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    setError('');

    try {
      // Save user data to localStorage (temporary solution)
      const userData = {
        id: Date.now().toString(),
        firstName: formData.firstName,
        lastName: formData.lastName,
        fullName: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        createdAt: new Date().toISOString()
      };
      
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('isAuthenticated', 'true');
      
      console.log('User saved to localStorage:', userData);
      setSuccess(true);
      
      setTimeout(() => {
        router.push('/dashboard');
      }, 1500);
      
    } catch (err) {
      setError('Failed to create account');
    } finally {
      setIsLoading(false);
    }
  };

  // Success state
  if (success) {
    return (
      <div className={styles.container}>
        <div className={styles.card}>
          <div className={styles.successState}>
            <div className={styles.successIcon}>✅</div>
            <h1 className={styles.successTitle}>Account Created!</h1>
            <p className={styles.successMessage}>
              Welcome to Cupid, {formData.firstName}! Redirecting you to your dashboard...
            </p>
            <div className={styles.loadingSpinner}></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>Sign Up</h1>
        <p className={styles.subtitle}>Create your account to get started</p>
        
        {error && (
          <div className={styles.errorMessage}>
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputGroup}>
            <label htmlFor="firstName" className={styles.label}>First Name</label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              className={styles.input}
              required
              disabled={isLoading}
              placeholder="Enter your first name"
            />
          </div>
          
          <div className={styles.inputGroup}>
            <label htmlFor="lastName" className={styles.label}>Last Name</label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              className={styles.input}
              required
              disabled={isLoading}
              placeholder="Enter your last name"
            />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="email" className={styles.label}>Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={styles.input}
              required
              disabled={isLoading}
              placeholder="Enter your email"
            />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="password" className={styles.label}>Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={styles.input}
              required
              disabled={isLoading}
              minLength={6}
              placeholder="Create a password (6+ characters)"
            />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="confirmPassword" className={styles.label}>Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className={styles.input}
              required
              disabled={isLoading}
              placeholder="Confirm your password"
            />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="longq" className={styles.label}>Long Question (max 100 characters)</label>
            <input
              type="text"
              id="longq"
              name="longq"
              value={formData.longq}
              onChange={handleChange}
              className={styles.input}
              required
              disabled={isLoading}
              placeholder="Maximum 100 characters"
            />
          </div>

          <button 
            type="submit" 
            className={`${styles.button} ${styles.primaryButton}`}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span className={styles.spinner}></span>
                Creating Account...
              </>
            ) : (
              'Create Account'
            )}
          </button>
        </form>

        <p className={styles.linkText}>
          Already have an account? <Link href="/login" className={styles.link}>Log in</Link>
        </p>

        <Link href="/" className={styles.backLink}>← Back to Home</Link>
      </div>
    </div>
  );
}
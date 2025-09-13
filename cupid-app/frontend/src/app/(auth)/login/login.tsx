"use client"

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import styles from '@/(auth)/Auth.module.css';

export default function LogIn() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle log in logic here
    console.log('Log in data:', formData);
    
    // For demo purposes, redirect to the dating app after "login"
    router.push('/app');
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>Log In</h1>
        <p className={styles.subtitle}>Welcome back! Please enter your details</p>
        
        <form onSubmit={handleSubmit} className={styles.form}>
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
            />
          </div>

          <button type="submit" className={`${styles.button} ${styles.primaryButton}`}>
            Log In
          </button>
        </form>

        <p className={styles.linkText}>
          Don't have an account? <Link href="/signup" className={styles.link}>Sign up</Link>
        </p>

        <Link href="/" className={styles.backLink}>← Back to Home</Link>
      </div>
    </div>
  );
}
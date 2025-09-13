import Link from 'next/link';
import styles from './home.module.css';

export default function Home() {
  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>Cupid</h1>
        <p className={styles.subtitle}>
          Find your perfect match through meaningful connections
        </p>
        
        <div className={styles.buttonsContainer}>
          <Link href="/signup" className={`${styles.button} ${styles.signupButton}`}>
            Sign Up
          </Link>
          
          <Link href="/login" className={`${styles.button} ${styles.loginButton}`}>
            Log In
          </Link>
        </div>
      </div>
    </div>
  );
}
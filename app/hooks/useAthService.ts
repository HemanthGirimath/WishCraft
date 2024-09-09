import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut as firebaseSignOut, User } from 'firebase/auth';
import { useState, useEffect } from 'react';

// Firebase configuration
const firebaseConfig = {
  apiKey:"AIzaSyA8T0Tq6We22T6i8y-PXrn2kq7FGvMmZ_8",
  authDomain: process.env.authDomain,
  projectId: process.env.projectId,
  storageBucket: process.env.storageBucket,
  messagingSenderId: process.env.messagingSenderId,
  appId: process.env.appId,
  measurementId: process.env.measurementId
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Hook to manage authentication
export function useAuth() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
    });
    return unsubscribe;
  }, []);

  const signUpWithEmail = (email: string, password: string) => {
    return createUserWithEmailAndPassword(auth, email, password);
  };

  const signInWithEmail = (email: string, password: string) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  const signOut = () => {
    return firebaseSignOut(auth);
  };

  return {
    user,
    signUpWithEmail,
    signInWithEmail,
    signOut,
  };
}

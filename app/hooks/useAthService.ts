import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut as firebaseSignOut, User } from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore'; 
import { useState, useEffect } from 'react';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA8T0Tq6We22T6i8y-PXrn2kq7FGvMmZ_8",
  authDomain: "expo-react-native-b3b53.firebaseapp.com",
  projectId: "expo-react-native-b3b53",
  storageBucket: "expo-react-native-b3b53.appspot.com",
  messagingSenderId: "467133198832",
  appId: "1:467133198832:web:adc29d63f8e5dd1f0a6d35",
  measurementId: "G-KT3YE17DMF"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app); 

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

  const getUserDetails = async (uid: string) => {
    try {
      const userDoc = await getDoc(doc(db, "users", uid));
      if (userDoc.exists()) {
        return userDoc.data();
      }
      return null;
    } catch (error) {
      console.error("Error fetching user details:", error);
      return null;
    }
  };

  return {
    user,
    signUpWithEmail,
    signInWithEmail,
    signOut,
    getUserDetails,
  };
}

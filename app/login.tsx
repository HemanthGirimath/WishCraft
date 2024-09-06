import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, StyleSheet, Alert, Text } from 'react-native';
import { useAuth } from '../app/hooks/useAthService';
import { useRouter } from 'expo-router';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userDetails, setUserDetails] = useState<any>(null);
  const { signInWithEmail, signUpWithEmail, user, getUserDetails } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // console.log("User state changed:", user);
    const fetchUserDetails = async () => {
      if (user && getUserDetails) {
        try {
          const details = await getUserDetails(user.uid);
        //   console.log("Fetched user details:", details);

          setUserDetails(details);
        } catch (error) {
          console.error("Error fetching user details:", error);
        }
      }
    };
    fetchUserDetails();
  }, [user, getUserDetails]);

  const handleEmailSignIn = async () => {
    console.log("Attempting sign in with:", email);

    try {
      await signInWithEmail(email, password);
      console.log("Sign in successful");
      router.replace('/');
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert('Sign In Error', error.message);
      } else {
        Alert.alert('Sign In Error', 'An unexpected error occurred');
      }
    }
  };

  const handleEmailSignUp = async () => {
    try {
      await signUpWithEmail(email, password);
      router.replace('/wish');
    } catch (error) {
      Alert.alert('Sign Up Error', error instanceof Error ? error.message : 'An unexpected error occurred');
    }
  };

  return (
    <View style={styles.container}>
      {userDetails ? (
        <View style={styles.profile}>
          <Text style={styles.profileText}>Welcome, {userDetails.email}</Text>
          <Text style={styles.profileText}>Last login: {userDetails.lastLogin}</Text>
          <Button title="Go to Home" onPress={() => router.replace('/')} />
        </View>
      ) : (
        <>
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
          <Button title="Sign In" onPress={handleEmailSignIn} />
          <Button title="Sign Up" onPress={handleEmailSignUp} />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  profile: {
    alignItems: 'center',
  },
  profileText: {
    fontSize: 16,
    marginBottom: 10,
  },
});
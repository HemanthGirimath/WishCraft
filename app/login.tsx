import React, { useState } from 'react';
import { Alert, TouchableWithoutFeedback, Keyboard, KeyboardAvoidingView, Platform } from 'react-native';
import { useAuth } from '../app/hooks/useAthService';
import { useRouter } from 'expo-router';
import { YStack, XStack, Button, Text, Input } from 'tamagui';
import { MaterialIcons } from '@expo/vector-icons';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userDetails, setUserDetails] = useState<any>(null);
  const { signInWithEmail, signUpWithEmail, user } = useAuth();
  const router = useRouter();

  const handleEmailSignIn = async () => {
    if (!email || !password) {
      Alert.alert('Required Fields', 'Please fill in all fields');
      return;
    }

    try {
      await signInWithEmail(email, password);
      router.replace('/');
    } catch (error) {
      Alert.alert('Sign In Error', 
        error instanceof Error ? error.message : 'An unexpected error occurred'
      );
    }
  };

  const handleEmailSignUp = async () => {
    if (!email || !password) {
      Alert.alert('Required Fields', 'Please fill in all fields');
      return;
    }

    try {
      await signUpWithEmail(email, password);
      router.replace('/wish');
    } catch (error) {
      Alert.alert('Sign Up Error', 
        error instanceof Error ? error.message : 'An unexpected error occurred'
      );
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <YStack f={1} backgroundColor="$background" padding="$4">
          <YStack f={1} justifyContent="center" space="$4">
            {userDetails ? (
              <YStack space="$4" alignItems="center">
                <MaterialIcons name="auto-awesome" size={32} color="#7c3aed" />
                <Text fontSize="$6" color="$color" textAlign="center">
                  Welcome back, {userDetails.email}
                </Text>
                <Text fontSize="$4" color="$color" opacity={0.8}>
                  Last login: {userDetails.lastLogin}
                </Text>
                <Button
                  theme="active"
                  onPress={() => router.replace('/')}
                  width={250}
                  size="$5"
                  borderRadius="$6"
                >
                  Continue Your Journey
                </Button>
              </YStack>
            ) : (
              <YStack space="$5">
                <YStack alignItems="center" space="$3">
                  <MaterialIcons name="auto-awesome" size={40} color="#7c3aed" />
                  <Text 
                    fontSize="$9" 
                    fontWeight="bold" 
                    textAlign="center" 
                    color="$color"
                    letterSpacing={1}
                  >
                    WishCraft
                  </Text>
                </YStack>
                
                <YStack space="$4" marginTop="$4">
                  <XStack
                    backgroundColor="$background"
                    borderColor="$borderColor"
                    borderWidth={2}
                    borderRadius="$6"
                    padding="$2"
                    alignItems="center"
                  >
                    <MaterialIcons name="email" size={20} color="gray" />
                    <Input
                      flex={1}
                      size="$4"
                      placeholder="Email"
                      value={email}
                      onChangeText={setEmail}
                      autoCapitalize="none"
                      keyboardType="email-address"
                      borderWidth={0}
                      paddingLeft="$2"
                      placeholderTextColor="$placeholderColor"
                      returnKeyType="next"
                    />
                  </XStack>
                  
                  <XStack
                    backgroundColor="$background"
                    borderColor="$borderColor"
                    borderWidth={2}
                    borderRadius="$6"
                    padding="$2"
                    alignItems="center"
                  >
                    <MaterialIcons name="lock" size={20} color="gray" />
                    <Input
                      flex={1}
                      size="$4"
                      placeholder="Password"
                      value={password}
                      onChangeText={setPassword}
                      secureTextEntry
                      borderWidth={0}
                      paddingLeft="$2"
                      placeholderTextColor="$placeholderColor"
                      returnKeyType="done"
                      onSubmitEditing={Keyboard.dismiss}
                    />
                  </XStack>
                </YStack>

                <YStack space="$4" marginTop="$4">
                  <Button 
                    size="$5"
                    onPress={handleEmailSignIn}
                    backgroundColor="$blue10"
                    theme="accent"
                    borderRadius="$6"
                  >
                    <Text color="white" fontWeight="bold" fontSize="$5">
                      Enter the Realm
                    </Text>
                  </Button>
                  
                  <Button 
                    size="$5"
                    theme="accent"
                    onPress={handleEmailSignUp}
                    borderRadius="$6"
                    borderWidth={2}
                  >
                    <Text fontWeight="bold" fontSize="$5">
                      Begin Your Journey
                    </Text>
                  </Button>
                </YStack>

                <XStack justifyContent="center" marginTop="$3">
                  <Text 
                    fontSize="$4" 
                    color="$color" 
                    opacity={0.8}
                    fontStyle="italic"
                  >
                    Where wishes transform into reality
                  </Text>
                </XStack>
              </YStack>
            )}
          </YStack>
        </YStack>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}
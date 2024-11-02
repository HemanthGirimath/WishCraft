import React, { useState, useEffect } from 'react';
import { TouchableWithoutFeedback, Keyboard, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { interpretWish } from '../app/hooks/useAIServices';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Audio } from 'expo-av';
import { speechToText } from '../app/hooks/useAIServices';
import AdPlaceholder from '../app/AdPlaceholder';
import { YStack, XStack, Button, Text, Input } from 'tamagui';
import { auditWish } from '../app/hooks/useAIServices';
import { MaterialIcons } from '@expo/vector-icons';

export default function WishScreen() {
  const [wish, setWish] = useState('');
  const [wishCount, setWishCount] = useState(0);
  const router = useRouter();
  const [recording, setRecording] = useState<Audio.Recording | undefined>(undefined);
  const [permissionResponse, requestPermission] = Audio.usePermissions();
  const [showAd, setShowAd] = useState(false);
  const [hasAudited, setHasAudited] = useState(false);
  const [isAuditMode, setIsAuditMode] = useState(false);
  const [auditCount, setAuditCount] = useState(0);

  useEffect(() => {
    const initializeScreen = async () => {
      await loadWishCount();
      await loadAuditStatus();
      await loadAuditMode();
    };
    
    initializeScreen();
  }, []); 

  useEffect(() => {
    if (!isAuditMode && wishCount >= 3) {
      setShowAd(true);

    }
  }, [wishCount, isAuditMode]); 

    const loadAuditMode = async () => {
    try {
      const storedAuditMode = await AsyncStorage.getItem('isAuditMode');
      if (storedAuditMode !== null) {
        setIsAuditMode(storedAuditMode === 'true');
      }
    } catch (error) {
      console.error('Failed to load audit mode:', error);
    }
  };


  const saveAuditMode = async (isAudit: boolean) => {
    try {
      await AsyncStorage.setItem('isAuditMode', isAudit.toString());
    } catch (error) {
      console.error('Failed to save audit mode:', error);
    }
  };

  const loadWishCount = async () => {
    try {
      const storedCount = await AsyncStorage.getItem('wishCount');
      if (storedCount !== null) {
        setWishCount(parseInt(storedCount, 10));
      }
    } catch (error) {
      console.error('Failed to load wish count:', error);
    }
  };


  async function startRecording() {
    try {
      if (permissionResponse?.status !== 'granted') {
        console.log('Requesting permission..');
        await requestPermission();
      }
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      console.log('Starting recording..');
      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      setRecording(recording);
      console.log('Recording started');
    } catch (err) {
      console.error('Failed to start recording', err);
    }
  }

  async function stopRecording() {
    console.log('Stopping recording..');
    setRecording(undefined);
    await recording?.stopAndUnloadAsync();
    await Audio.setAudioModeAsync(
      {
        allowsRecordingIOS: false,
      }
    );
    const uri = recording?.getURI();
    if (uri) {
      console.log('Recording stopped and stored at', uri);
      const transcribedText = await speechToText(uri);
      console.log('Transcription:', transcribedText);
      setWish(transcribedText);
      
      if (!isAuditMode && transcribedText.toLowerCase().includes('audit')) {
        setIsAuditMode(true);
        await saveAuditMode(true);
        setWish('');
        return;
      }

      if (transcribedText.trim()) {
        if (isAuditMode) {
          // Handle audit mode
          const response = await interpretWish(transcribedText);
          router.push({ 
            pathname: '/result', 
            params: { 
              wish: transcribedText, 
              response,
              isAudit: '1'
            } 
          });
        } else if (wishCount < 3) {
          // Handle normal wish
          const response = await interpretWish(transcribedText);
          const newCount = wishCount + 1;
          await saveWishCount(newCount); 
          router.push({ 
            pathname: '/result', 
            params: { 
              wish: transcribedText, 
              response,
              isAudit: '0'
            } 
          });
        }
      }
    }
  }

  const loadAuditStatus = async () => {
    try {
      const storedAuditCount = await AsyncStorage.getItem('auditCount');
      if (storedAuditCount !== null) {
        setAuditCount(parseInt(storedAuditCount, 10));
      }
    } catch (error) {
      console.error('Failed to load audit count:', error);
    }
  };

  const saveWishCount = async (count: number) => {
    try {
      await AsyncStorage.setItem('wishCount', count.toString());
      setWishCount(count); // Update state immediately after saving
    } catch (error) {
      console.error('Failed to save wish count:', error);
    }
  };


  const handleSubmit = async () => {
    if (wish.trim()) {
      try {
        if (!isAuditMode && wish.toLowerCase().includes('audit')) {
          setIsAuditMode(true);
          setWish('');
          return;
        }
        
        if (isAuditMode) {
          const response = await auditWish(wish);
          router.push({ 
            pathname: '/result', 
            params: { wish, response, isAudit: '1' }
          });
        } else {
          const response = await interpretWish(wish);
          const newCount = wishCount + 1;
          setWishCount(newCount);
          await AsyncStorage.setItem('wishCount', newCount.toString());
          router.push({ 
            pathname: '/result', 
            params: { wish, response, isAudit: '0' }
          });
        }
        setWish('');
      } catch (error) {
        console.error('Error processing wish:', error);
      }
    }
  };

  const handleDoneAuditing = async () => {
    setIsAuditMode(false);
    await saveAuditMode(false);  
    setWish('');
  };
  const handleAdClose = async () => {
    setShowAd(false);
    await saveWishCount(0); // Use saveWishCount instead of separate AsyncStorage and setState calls
  };

  const resetWishCount = async () => {
    setWishCount(0);
    await AsyncStorage.setItem('wishCount', '0');
  };

// resetWishCount();

return (
  <KeyboardAvoidingView 
    behavior={Platform.OS === "ios" ? "padding" : "height"}
    style={{ flex: 1 }}
  >
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <YStack f={1} padding="$4" backgroundColor="$background">
        {showAd ? (
          <AdPlaceholder onClose={handleAdClose} />
        ) : isAuditMode ? (
          <YStack space="$4">
            <YStack alignItems="center" space="$3">
              <MaterialIcons name="analytics" size={32} color="#7c3aed" />
              <Text fontSize="$6" fontWeight="bold" textAlign="center">
                Wish Audit Mode
              </Text>
              <Text fontSize="$4" color="$gray10" textAlign="center">
                Test your wishes to see how they might be interpreted
              </Text>
            </YStack>

            <Input
              placeholder="Enter a test wish..."
              value={wish}
              onChangeText={setWish}
              multiline
              minHeight={100}
              fontSize={20}
              borderWidth={2}
              borderRadius="$6"
              padding="$3"
            />
            <Button
              onPress={handleSubmit}
              backgroundColor="$blue10"
              size="$5"
              borderRadius="$6"
            >
              <Text color="white" fontWeight="bold">Analyze Wish</Text>
            </Button>
            
            <Button 
              onPress={handleDoneAuditing}
              size="$5"
              borderRadius="$6"
              borderWidth={2}
            >
              <Text fontWeight="bold">Exit Audit Mode</Text>
            </Button>
          </YStack>
        ) : (
          <YStack space="$4">
            <Input
              placeholder="Enter your wish..."
              value={wish}
              onChangeText={setWish}
              multiline
              minHeight={200}
              fontSize={20}
              borderWidth={2}
              borderRadius="$6"
              padding="$3"
            />
            <Button
              onPress={handleSubmit}
              disabled={wishCount >= 3}
              backgroundColor="$purple10"
              size="$5"
              borderRadius="$6"
              opacity={wishCount >= 3 ? 0.5 : 1}
              theme={'accent'}
            >
              <Text color="white" fontWeight="bold">Submit Wish</Text>
            </Button>
            
            <Text fontSize="$4" textAlign="center" opacity={0.8}>
              Wishes Remaining: {3 - wishCount}/3
            </Text>

            {recording ? (
              <Button
                onPress={stopRecording}
                backgroundColor="$purple10"
                size="$5"
                borderRadius="$6"
                icon={<MaterialIcons name="mic-off" size={24} color="white" />}
              >
                <Text color="white" fontWeight="bold">Stop Recording</Text>
              </Button>
            ) : (
              <Button
                onPress={startRecording}
                backgroundColor="$purple10"
                size="$5"
                borderRadius="$6"
                icon={<MaterialIcons name="mic" size={24} color="white" />}
                theme={'accent'}
              >
                <Text color="white" fontWeight="bold">Start Recording</Text>
              </Button>
            )}
          </YStack>
        )}
      </YStack>
    </TouchableWithoutFeedback>
  </KeyboardAvoidingView>
);
}
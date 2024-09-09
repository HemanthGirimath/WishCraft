import React, { useState, useEffect } from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity, Text, Button } from 'react-native';
import { useRouter } from 'expo-router';
import { interpretWish } from '../app/hooks/useAIServices';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Audio } from 'expo-av';
import { speechToText } from '../app/hooks/useAIServices';

export default function WishScreen() {
  const [wish, setWish] = useState('');
  const [wishCount, setWishCount] = useState(0);
  const router = useRouter();
  const [recording, setRecording] = useState<Audio.Recording | undefined>(undefined);
  const [permissionResponse, requestPermission] = Audio.usePermissions();


  useEffect(() => {
    // Load the wish count from AsyncStorage when the component mounts
    loadWishCount();
  }, []);

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
      const text = await speechToText(uri);
      console.log('Transcription:', text);
      setWish(text); // Set the transcribed text as the wish
      if (text.trim() && wishCount < 3) {
        const response = await interpretWish(text);
        const newCount = wishCount + 1;
        setWishCount(newCount);
        saveWishCount(newCount);
        router.push({ pathname: '/result', params: { wish: text, response } });
      }
    }
  }

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

  const saveWishCount = async (count: number) => {
    try {
      await AsyncStorage.setItem('wishCount', count.toString());
    } catch (error) {
      console.error('Failed to save wish count:', error);
    }
  };

  const handleSubmit = async () => {
    if (wish.trim() && wishCount < 3) {
      const response = await interpretWish(wish);
      const newCount = wishCount + 1;
      setWishCount(newCount);
      saveWishCount(newCount);
      router.push({ pathname: '/result', params: { wish, response } });
    }
  };

  return (
    <View style={styles.container}>
      {wishCount >= 3 ? (
        <View style={styles.fullScreenMessage}>
          <Text style={styles.fullScreenText}>Wish limit reached</Text>
        </View>
      ) : (
        <><View>
            <TextInput
              style={styles.input}
              placeholder="Enter your wish..."
              value={wish}
              onChangeText={setWish}
              multiline />
            <TouchableOpacity
              style={styles.button}
              onPress={handleSubmit}
              disabled={wishCount >= 3}
            >
              <Text style={styles.buttonText}>Submit Wish</Text>
            </TouchableOpacity>
            <Text style={styles.wishCount}>Wishes: {wishCount}/3</Text>
          </View><View style={styles.container}>
              <Button
                title={recording ? 'Stop Recording' : 'Start Recording'}
                onPress={recording ? stopRecording : startRecording} />
            </View></>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f0f0f0',
  },
  input: {
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
    minHeight: 100,
  },
  button: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
  },
  fullScreenMessage: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullScreenText: {
    fontSize: 24,
    color: 'red',
  },
  wishCount: {
    fontSize: 18,
    color: 'gray',
    marginBottom: 20,
  },
});
import React from 'react';
import { useRouter } from 'expo-router';
import { ScrollView, YStack, XStack, Text, Button } from 'tamagui';
import { MaterialIcons } from '@expo/vector-icons';

export default function HomeScreen() {
  const router = useRouter();
  const bulletPoints = [
    "Make wishes and see them come true, but be careful!",
    "Our AI genie is clever and mischievous",
    "Poorly structured wishes may result in unexpected outcomes",
    "The AI looks for loopholes in your wish phrasing",
    "You might get what you asked for, but not what you wanted",
    "Challenge yourself to craft precise, well-thought-out wishes",
    "Learn the art of careful wording and clear intentions",
    "Enjoy the surprise and humor in each wish interpretation"
  ];

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <YStack alignItems="center" padding="$5" space="$4">
        <MaterialIcons name="auto-awesome" size={48} color="#7c3aed" />
        <Text 
          fontSize="$8" 
          fontWeight="bold" 
          textAlign="center"
          color="$color"
          letterSpacing={1}
        >
          Welcome to WishCraft
        </Text>
        
        <Button
          theme="accent"
          size="$5"
          borderRadius="$6"
          paddingHorizontal="$6"
          marginTop="$2"
          pressStyle={{ scale: 0.97 }}
          onPress={() => router.push('/wish')}
          icon={<MaterialIcons name="stars" size={24} color="white" />}
        >
          <Text color="white" fontSize="$6" fontWeight="bold">
            Make a Wish
          </Text>
        </Button>
      </YStack>

      <YStack 
        padding="$4"
        margin="$4"
        borderRadius="$6"
        borderWidth={2}
        borderColor="$borderColor"
        backgroundColor="$background"
        space="$4"
      >
        <Text
          fontSize="$6"
          fontWeight="bold"
          textAlign="center"
          color="$color"
        >
          Guide to WishCraft
        </Text>
        
        {bulletPoints.map((point, index) => (
          <XStack key={index} space="$2" alignItems="flex-start">
            <MaterialIcons name="auto-awesome" size={16} color="#7c3aed" />
            <Text 
              fontSize="$4" 
              flex={1} 
              color="$color"
              opacity={0.9}
            >
              {point}
            </Text>
          </XStack>
        ))}
      </YStack>
    </ScrollView>
  );
}
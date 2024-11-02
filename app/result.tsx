import React from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { YStack, Button, Text, XStack } from 'tamagui';
import { MaterialIcons } from '@expo/vector-icons';

export default function ResultScreen() {
  const router = useRouter();
  const { wish, response, isAudit } = useLocalSearchParams();
  
  const handleMakeAnotherWish = () => router.replace('/wish');

  return (
    <YStack f={1} padding="$4" backgroundColor="$background">
      <YStack 
        borderWidth={2}
        borderColor={isAudit === '1' ? '$blue8' : '$purple8'}
        borderRadius="$6"
        padding="$4"
        marginBottom="$4"
      >
        {/* Header Section */}
        <XStack alignItems="center" space="$2" marginBottom="$4">
          <MaterialIcons 
            name={isAudit === '1' ? 'analytics' : 'auto-awesome'} 
            size={24} 
            color={isAudit === '1' ? '#60a5fa' : '#7c3aed'} 
          />
          <Text fontSize="$6" fontWeight="bold" color={isAudit === '1' ? '$blue10' : '$purple10'}>
            {isAudit === '1' ? 'Wish Analysis' : 'Wish Result'}
          </Text>
        </XStack>

        {/* Wish Section */}
        <YStack space="$2" marginBottom="$4">
          <Text fontSize="$5" fontWeight="bold" color="$color">
            Your wish:
          </Text>
          <Text fontSize="$4" color="$color" opacity={0.8}>
            {wish?.toString() || ''}
          </Text>
        </YStack>
        
        {/* Response Section */}
        <YStack space="$2">
          <Text fontSize="$5" fontWeight="bold" color="$color">
            {isAudit === '1' ? 'Analysis:' : 'Genie\'s response:'}
          </Text>
          <Text fontSize="$4" color="$color" opacity={0.8}>
            {response?.toString() || ''}
          </Text>
        </YStack>
      </YStack>

      {/* Action Button */}
      <Button 
        onPress={handleMakeAnotherWish}
        backgroundColor={isAudit === '1' ? '$blue10' : '$purple10'}
        size="$5"
        borderRadius="$6"
      >
        <MaterialIcons 
          name={isAudit === '1' ? 'science' : 'amp-stories'} 
          size={24} 
          color="white" 
        />
        <Text color="white" fontWeight="bold">
          {isAudit === '1' ? 'Analyze Another Wish' : 'Make Another Wish'}
        </Text>
      </Button>
    </YStack>
  );
}
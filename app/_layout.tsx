import React, { useEffect } from 'react';
import { useColorScheme, SafeAreaView } from 'react-native';
import { useRouter, useSegments, Link, Slot } from 'expo-router';
import { TamaguiProvider, Theme, Button, Text, XStack, YStack } from 'tamagui';
import { MaterialIcons } from '@expo/vector-icons';
import config from '../app/tamagi.config';
import { useAuth } from '../app/hooks/useAthService';
import { Provider } from './provider';

interface NavbarProps {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

function Navbar({ theme, toggleTheme }: NavbarProps) {
  const { signOut, user } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await signOut();
      router.replace('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <YStack width="100%" backgroundColor="$background">
      <XStack 
        width="100%"
        height={60}
        paddingHorizontal={16}
        alignItems="center"
        borderBottomWidth={1}
        borderColor="$borderColor"
        justifyContent="space-between"
      >
        {/* Unified button group */}
        <XStack flex={1} space={16} alignItems="center">
          <Link href="/" asChild>
            <Button size="$3" theme="accent">
              <MaterialIcons name="home" size={20} color="white" />
              <Text color="white" marginLeft={4}>Home</Text>
            </Button>
          </Link>
          {user && (
            <Link href="/wish" asChild>
              <Button size="$3" theme="accent">
                <MaterialIcons name="auto-awesome" size={20} color="white" />
                <Text color="white" marginLeft={4}>Wish</Text>
              </Button>
            </Link>
          )}
          {user && (
            <Button 
              size="$3"
              theme="accent"
              onPress={handleLogout}
            >
              <MaterialIcons name="logout" size={20} color="white" />
              <Text color="white" marginLeft={4}>Logout</Text>
            </Button>
          )}
        </XStack>
        <Button
          size="$3"
          theme="accent"
          onPress={toggleTheme}
        >
          <MaterialIcons 
            name={theme === 'light' ? 'dark-mode' : 'light-mode'} 
            size={20} 
            color="white"
          />
        </Button>
      </XStack>
    </YStack>
  );
}


export default function RootLayout() {
  const { user } = useAuth();
  const segments = useSegments();
  const router = useRouter();
  const colorScheme = useColorScheme();
  const [theme, setTheme] = React.useState<'light' | 'dark'>(colorScheme || 'light');

  useEffect(() => {
    if (!user && segments[0] !== 'login') {
      router.replace('/login');
    } else if (user && segments[0] === 'login') {
      router.replace('/');
    }
  }, [user, segments]);

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  return (
    <Provider>
      <TamaguiProvider config={config}>
        <Theme name={theme}>
          <YStack f={1} backgroundColor="$background">
            <SafeAreaView style={{ flex: 1 }}>
              {user && segments[0] !== 'login' && (
                <Navbar theme={theme} toggleTheme={toggleTheme} />
              )}
              <YStack f={1} backgroundColor="$background">
                <Slot />
              </YStack>
            </SafeAreaView>
          </YStack>
        </Theme>
      </TamaguiProvider>
    </Provider>
  );
}

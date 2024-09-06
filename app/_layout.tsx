import { Stack } from 'expo-router';
import { useAuth } from '../app/hooks/useAthService';
import { useEffect } from 'react';
import { useRouter, useSegments } from 'expo-router';

export default function Layout() {
  const { user } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    const inAuthGroup = segments[0] === '(auth)' as string;

    if (!user && !inAuthGroup) {
      router.replace('/login');
    } else if (user && inAuthGroup) {
      router.replace('/');
    }
  }, [user, segments]);

  return <Stack />;
}
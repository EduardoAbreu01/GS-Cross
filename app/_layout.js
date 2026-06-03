import { Stack } from 'expo-router';
import { View } from 'react-native';
import { MissionProvider } from '../context/MissaoContext';

export default function RootLayout() {
  return (
    <MissionProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
    </MissionProvider>
  );
}
import React, { useEffect } from 'react';
import { Stack } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import { StyleSheet } from 'react-native';
import { Colors } from '../src/utils/colors';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  useEffect(() => {
    // Hide splash screen after a short delay
    const timer = setTimeout(() => {
      SplashScreen.hideAsync();
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <GestureHandlerRootView style={styles.root}>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: Colors.background },
          animation: 'fade',
        }}
      >
        <Stack.Screen name="(tabs)" />
        <Stack.Screen
          name="game/classic"
          options={{ animation: 'slide_from_right' }}
        />
        <Stack.Screen
          name="game/level"
          options={{ animation: 'slide_from_right' }}
        />
        <Stack.Screen
          name="game/daily"
          options={{ animation: 'slide_from_right' }}
        />
        <Stack.Screen
          name="game/result"
          options={{ animation: 'fade', presentation: 'transparentModal' }}
        />
        <Stack.Screen
          name="level-select/index"
          options={{ animation: 'slide_from_right' }}
        />
        <Stack.Screen
          name="wagara/[id]"
          options={{ animation: 'slide_from_bottom' }}
        />
      </Stack>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Colors.background,
  },
});

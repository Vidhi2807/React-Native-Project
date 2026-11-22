import React from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ThemeProvider, useTheme } from '../context/ThemeContext';
import { AppProvider } from '../context/AppContext';

function RootNavigation() {
  const { isDarkMode, colors } = useTheme();

  return (
    <>
      <StatusBar style={isDarkMode ? 'light' : 'dark'} translucent backgroundColor="transparent" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.background },
          animation: 'slide_from_right',
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="home" />
        <Stack.Screen name="tasks" />
        <Stack.Screen name="add-task" options={{ presentation: 'modal' }} />
        <Stack.Screen name="edit-task" options={{ presentation: 'modal' }} />
        <Stack.Screen name="health" />
        <Stack.Screen name="water" />
        <Stack.Screen name="exercise" />
        <Stack.Screen name="sleep" />
        <Stack.Screen name="steps" />
        <Stack.Screen name="meals" />
        <Stack.Screen name="habits" />
        <Stack.Screen name="add-habit" options={{ presentation: 'modal' }} />
        <Stack.Screen name="habit-details" />
        <Stack.Screen name="mood" />
        <Stack.Screen name="mood-history" />
        <Stack.Screen name="journal" />
        <Stack.Screen name="add-journal" options={{ presentation: 'modal' }} />
        <Stack.Screen name="journal-details" />
        <Stack.Screen name="camera" />
        <Stack.Screen name="location" />
        <Stack.Screen name="saved-places" />
        <Stack.Screen name="routine" />
        <Stack.Screen name="add-routine" options={{ presentation: 'modal' }} />
        <Stack.Screen name="progress" />
        <Stack.Screen name="daily-summary" />
        <Stack.Screen name="profile" />
        <Stack.Screen name="settings" />
        <Stack.Screen name="theme" />
        <Stack.Screen name="notification" />
        <Stack.Screen name="onboarding" />
        <Stack.Screen name="login" />
        <Stack.Screen name="register" />
      </Stack>
    </>
  );
}

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <AppProvider>
          <RootNavigation />
        </AppProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}

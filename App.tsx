import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Navigator } from './src/Navigator';
import { StoreProvider } from './src/store';

export default function App() {
  return (
    <SafeAreaProvider>
      <StoreProvider>
        <Navigator />
        <StatusBar style="auto" />
      </StoreProvider>
    </SafeAreaProvider>
  );
}

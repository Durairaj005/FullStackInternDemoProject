// ─── Feedants Mobile App Entry ────────────────────────────────────────────────
// Mounts the Competition Details Module with full state management & theme support.

import React from 'react';
import { StyleSheet, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { CompetitionDetailsScreen } from './src/screens/CompetitionDetailsScreen';
import { Colors } from './src/theme/tokens';

export default function App() {
  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <CompetitionDetailsScreen />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bg.base,
  },
});

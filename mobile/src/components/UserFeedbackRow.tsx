// ─── UserFeedbackRow Component ───────────────────────────────────────────────
// Matches the "Hear From Our Users" row from design reference (media_1790197997127.jpg).

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Colors, Typography, Spacing, Radius, Shadows } from '../theme/tokens';

export const UserFeedbackRow: React.FC = () => {
  const handlePress = () => {
    Alert.alert(
      'User Testimonials',
      'Over 50,000+ creators and dancers compete and win on Feedants every month!',
      [{ text: 'Great' }],
    );
  };

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={handlePress}
      activeOpacity={0.7}
      accessibilityRole="button"
      accessibilityLabel="Hear from our users"
    >
      <View style={styles.leftContent}>
        <Text style={styles.chatIcon}>💬</Text>
        <View style={styles.textContainer}>
          <Text style={styles.title}>Hear From Our Users</Text>
          <Text style={styles.subtitle}>See what participants say about Feedants</Text>
        </View>
      </View>
      <Text style={styles.chevron}>›</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.bg.card,
    borderRadius: Radius.lg,
    padding: Spacing.base,
    marginHorizontal: Spacing.screen,
    marginBottom: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#EEF2F6',
    ...Shadows.card,
  },
  leftContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    flex: 1,
  },
  chatIcon: {
    fontSize: 20,
    color: Colors.text.primary,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: Typography.size.sm,
    fontWeight: Typography.weight.bold,
    color: Colors.text.primary,
    marginBottom: 2,
  },
  subtitle: {
    fontSize: Typography.size.xs,
    color: Colors.text.tertiary,
  },
  chevron: {
    fontSize: 22,
    color: Colors.text.muted,
    fontWeight: Typography.weight.bold,
    marginLeft: Spacing.sm,
  },
});

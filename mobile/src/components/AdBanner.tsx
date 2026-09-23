// ─── AdBanner Component ───────────────────────────────────────────────────────
// Matches the "📢 Ad Here" banner slot from design reference (media_1790197997127.jpg).

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, Typography, Spacing, Radius } from '../theme/tokens';

export const AdBanner: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.speakerIcon}>📢</Text>
      <Text style={styles.adText}>Ad Here</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FAFAFA',
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderStyle: 'dashed',
    paddingVertical: Spacing.sm + 2,
    marginHorizontal: Spacing.screen,
    marginBottom: Spacing.base,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  speakerIcon: {
    fontSize: 14,
    opacity: 0.6,
  },
  adText: {
    fontSize: Typography.size.xs,
    color: Colors.text.muted,
    fontWeight: Typography.weight.medium,
  },
});

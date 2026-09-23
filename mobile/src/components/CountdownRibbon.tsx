// ─── CountdownRibbon Component ────────────────────────────────────────────────
// Faithfully matches the countdown bar in design reference (media_1790197997127.jpg):
// "⏳ Registration closes in"  "01d : 06h : 28m : 32s"  "⏱ Hurry up!"

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, Typography, Spacing, Radius } from '../theme/tokens';
import { formatSegmentedCountdown } from '../utils/dateUtils';

interface CountdownRibbonProps {
  countdownSeconds: number;
  isUpcoming?: boolean;
  hasEnded?: boolean;
}

export const CountdownRibbon: React.FC<CountdownRibbonProps> = ({
  countdownSeconds,
  isUpcoming,
  hasEnded,
}) => {
  if (hasEnded) {
    return (
      <View style={[styles.container, styles.endedContainer]}>
        <Text style={styles.icon}>⏱</Text>
        <Text style={styles.endedText}>Registration has ended for this competition</Text>
      </View>
    );
  }

  if (isUpcoming) {
    return (
      <View style={[styles.container, styles.upcomingContainer]}>
        <Text style={styles.icon}>🔔</Text>
        <Text style={styles.labelText}>Registration starts soon</Text>
      </View>
    );
  }

  const formattedCountdown = formatSegmentedCountdown(countdownSeconds);

  return (
    <View style={styles.container}>
      {/* Left: Hourglass icon and label */}
      <View style={styles.leftSection}>
        <Text style={styles.icon}>⌛</Text>
        <Text style={styles.labelText}>Registration closes in</Text>
      </View>

      {/* Center: Segmented live ticking countdown */}
      <View style={styles.countdownSection}>
        <Text style={styles.countdownText}>{formattedCountdown}</Text>
      </View>

      {/* Right: Hurry up badge */}
      <View style={styles.rightSection}>
        <Text style={styles.stopwatchIcon}>⏱</Text>
        <Text style={styles.hurryUpText}>Hurry up!</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#EBF5F3',
    borderRadius: Radius.md,
    paddingVertical: Spacing.sm + 2,
    paddingHorizontal: Spacing.md,
    marginHorizontal: Spacing.screen,
    marginBottom: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#D5ECE6',
  },
  endedContainer: {
    backgroundColor: '#F3F4F6',
    borderColor: '#E5E7EB',
    justifyContent: 'center',
    gap: Spacing.xs,
  },
  upcomingContainer: {
    backgroundColor: '#E0F2FE',
    borderColor: '#BAE6FD',
    justifyContent: 'center',
    gap: Spacing.xs,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  icon: {
    fontSize: 13,
  },
  labelText: {
    fontSize: Typography.size.xs,
    color: Colors.text.secondary,
    fontWeight: Typography.weight.medium,
  },
  endedText: {
    fontSize: Typography.size.xs,
    color: Colors.text.tertiary,
    fontWeight: Typography.weight.medium,
  },
  countdownSection: {
    paddingHorizontal: Spacing.xs,
  },
  countdownText: {
    fontSize: Typography.size.sm,
    fontWeight: Typography.weight.bold,
    color: Colors.brand.primary,
    letterSpacing: 0.5,
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  stopwatchIcon: {
    fontSize: 12,
  },
  hurryUpText: {
    fontSize: Typography.size.xs,
    fontWeight: Typography.weight.bold,
    color: Colors.brand.primary,
  },
});

// ─── RewardsCard Component ────────────────────────────────────────────────────
// Displays the rewards breakdown table matching the design reference:
// 1st to 6th rank with icons (trophy, medals, stars) and prize amounts in INR.

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, Typography, Spacing, Radius, Shadows } from '../theme/tokens';
import { Reward } from '../types/competition';
import { formatCurrency } from '../utils/dateUtils';

interface RewardsCardProps {
  rewards: Reward[];
  currency?: string;
}

export const RewardsCard: React.FC<RewardsCardProps> = ({ rewards, currency = 'INR' }) => {
  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return '🏆';
      case 2:
        return '🥈';
      case 3:
        return '🥉';
      default:
        return '⭐';
    }
  };

  return (
    <View style={styles.card}>
      <Text style={styles.title}>Rewards <Text style={styles.subtitle}>(All Positions)</Text></Text>

      <View style={styles.list}>
        {rewards.map((reward, index) => (
          <View
            key={index}
            style={[
              styles.row,
              index !== rewards.length - 1 && styles.rowBorder,
            ]}
          >
            {/* Left: Icon and Rank Label */}
            <View style={styles.rankContainer}>
              <Text style={styles.rankIcon}>{getRankIcon(reward.rank)}</Text>
              <Text style={styles.rankLabel}>{reward.label}</Text>
            </View>

            {/* Right: Reward Amount */}
            <Text style={styles.rewardAmount}>
              {formatCurrency(reward.amount, currency)}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.bg.card,
    borderRadius: Radius.lg,
    padding: Spacing.base,
    marginHorizontal: Spacing.screen,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: '#EEF2F6',
    ...Shadows.card,
  },
  title: {
    fontSize: Typography.size.base,
    fontWeight: Typography.weight.bold,
    color: Colors.text.primary,
    marginBottom: Spacing.sm,
  },
  subtitle: {
    fontSize: Typography.size.xs,
    fontWeight: Typography.weight.regular,
    color: Colors.text.tertiary,
  },
  list: {
    marginTop: Spacing.xs,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.sm + 2,
  },
  rowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  rankContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  rankIcon: {
    fontSize: 16,
  },
  rankLabel: {
    fontSize: Typography.size.sm,
    fontWeight: Typography.weight.medium,
    color: Colors.text.primary,
  },
  rewardAmount: {
    fontSize: Typography.size.base,
    fontWeight: Typography.weight.bold,
    color: Colors.brand.primary,
  },
});

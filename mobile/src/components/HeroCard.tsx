// ─── HeroCard Component ───────────────────────────────────────────────────────
// Displays the top card from design reference (media_1790197997127.jpg):
// Title, status pill, category chips, prize pool, entry fee, and spots indicator.

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, Typography, Spacing, Radius, Shadows } from '../theme/tokens';
import { Competition } from '../types/competition';
import { formatCurrency } from '../utils/dateUtils';

interface HeroCardProps {
  competition: Competition;
}

export const HeroCard: React.FC<HeroCardProps> = ({ competition }) => {
  const { title, tags, prizePool, entryFee, currency, spots, userState, lifecycle } = competition;

  const isRegistered = userState.isRegistered;
  const isFull = spots.isFull;

  return (
    <View style={styles.card}>
      {/* Title & Status Row */}
      <View style={styles.headerRow}>
        <Text style={styles.title} numberOfLines={2}>
          {title}
        </Text>

        {isRegistered ? (
          <View style={styles.registeredBadge}>
            <Text style={styles.checkIcon}>✓</Text>
            <Text style={styles.registeredText}>Registered</Text>
          </View>
        ) : isFull ? (
          <View style={[styles.statusBadge, styles.fullBadge]}>
            <Text style={styles.fullText}>Full</Text>
          </View>
        ) : !lifecycle.canRegister ? (
          <View style={[styles.statusBadge, styles.closedBadge]}>
            <Text style={styles.closedText}>Closed</Text>
          </View>
        ) : null}
      </View>

      {/* Tags & Certificate Row */}
      <View style={styles.tagsRow}>
        {tags.map((tag, idx) => (
          <View key={idx} style={styles.tagChip}>
            {tag.toLowerCase().includes('certificate') ? (
              <Text style={styles.trophyIcon}>🏆 </Text>
            ) : null}
            <Text
              style={[
                styles.tagText,
                tag.toLowerCase().includes('certificate') && styles.tagTextTeal,
              ]}
            >
              {tag}
            </Text>
          </View>
        ))}
      </View>

      {/* Stats & Spots Section */}
      <View style={styles.statsSection}>
        {/* Left: Prize Pool & Entry Fee */}
        <View style={styles.priceColumn}>
          <View style={styles.priceRow}>
            <View style={styles.priceItem}>
              <Text style={styles.priceLabel}>Prize Pool</Text>
              <Text style={[styles.priceValue, styles.prizePoolValue]}>
                {formatCurrency(prizePool, currency)}
              </Text>
            </View>

            <View style={styles.priceItem}>
              <Text style={styles.priceLabel}>Entry Fee</Text>
              <Text style={styles.priceValue}>
                {entryFee === 0 ? 'Free' : formatCurrency(entryFee, currency)}
              </Text>
            </View>
          </View>
        </View>

        {/* Right: Remaining Spots & Progress */}
        <View style={styles.spotsColumn}>
          <View style={styles.spotsHeader}>
            <Text style={styles.usersIcon}>👥 </Text>
            <Text style={styles.spotsLabel}>
              {spots.remaining === 0
                ? 'No spots left'
                : `Only ${spots.remaining} ${spots.remaining === 1 ? 'spot' : 'spots'} left`}
            </Text>
          </View>

          {/* Progress Bar */}
          <View style={styles.progressBarTrack}>
            <View
              style={[
                styles.progressBarFill,
                { width: `${Math.min(spots.progressPercentage, 100)}%` },
              ]}
            />
          </View>

          {/* Booked Fraction */}
          <Text style={styles.bookedText}>
            {spots.registered} / {spots.total} Booked
          </Text>
        </View>
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
    marginTop: Spacing.xs,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: '#EEF2F6',
    ...Shadows.card,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.sm,
  },
  title: {
    flex: 1,
    fontSize: Typography.size.xl,
    fontWeight: Typography.weight.bold,
    color: Colors.text.primary,
    marginRight: Spacing.sm,
    lineHeight: 26,
  },
  registeredBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E6F4F1',
    paddingHorizontal: Spacing.md,
    paddingVertical: 5,
    borderRadius: Radius.full,
    borderWidth: 1,
    borderColor: '#B2DFDB',
  },
  checkIcon: {
    fontSize: Typography.size.xs,
    color: Colors.brand.primary,
    fontWeight: Typography.weight.bold,
    marginRight: 4,
  },
  registeredText: {
    fontSize: Typography.size.xs,
    color: Colors.brand.primary,
    fontWeight: Typography.weight.semibold,
  },
  statusBadge: {
    paddingHorizontal: Spacing.md,
    paddingVertical: 4,
    borderRadius: Radius.full,
  },
  fullBadge: {
    backgroundColor: Colors.status.dangerBg,
  },
  fullText: {
    fontSize: Typography.size.xs,
    color: Colors.status.danger,
    fontWeight: Typography.weight.semibold,
  },
  closedBadge: {
    backgroundColor: '#F3F4F6',
  },
  closedText: {
    fontSize: Typography.size.xs,
    color: Colors.text.tertiary,
    fontWeight: Typography.weight.semibold,
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.xs,
    marginBottom: Spacing.base,
  },
  tagChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: Radius.full,
  },
  trophyIcon: {
    fontSize: 11,
  },
  tagText: {
    fontSize: Typography.size.xs,
    color: Colors.text.secondary,
    fontWeight: Typography.weight.medium,
  },
  tagTextTeal: {
    color: Colors.brand.primary,
    fontWeight: Typography.weight.semibold,
  },
  statsSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingTop: Spacing.xs,
  },
  priceColumn: {
    flex: 1.1,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.lg,
  },
  priceItem: {
    gap: 2,
  },
  priceLabel: {
    fontSize: Typography.size.xs,
    color: Colors.text.tertiary,
    fontWeight: Typography.weight.medium,
  },
  priceValue: {
    fontSize: Typography.size['2xl'],
    fontWeight: Typography.weight.bold,
    color: Colors.text.primary,
  },
  prizePoolValue: {
    color: Colors.brand.primary,
  },
  spotsColumn: {
    flex: 0.9,
    alignItems: 'flex-end',
  },
  spotsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  usersIcon: {
    fontSize: 12,
  },
  spotsLabel: {
    fontSize: Typography.size.xs,
    fontWeight: Typography.weight.semibold,
    color: Colors.brand.primary,
  },
  progressBarTrack: {
    width: '100%',
    height: 4,
    backgroundColor: '#E5E7EB',
    borderRadius: Radius.full,
    overflow: 'hidden',
    marginBottom: 4,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: Colors.brand.primary,
    borderRadius: Radius.full,
  },
  bookedText: {
    fontSize: Typography.size.xs,
    color: Colors.text.tertiary,
    fontWeight: Typography.weight.regular,
  },
});

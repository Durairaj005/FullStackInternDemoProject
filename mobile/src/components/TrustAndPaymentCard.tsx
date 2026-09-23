// ─── TrustAndPaymentCard Component ───────────────────────────────────────────
// Matches the Trust & Security section from design reference:
// "How will you receive prize money? Watch video to know more" + Refund policy + Razorpay badge.

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Colors, Typography, Spacing, Radius, Shadows } from '../theme/tokens';

export const TrustAndPaymentCard: React.FC = () => {
  const handlePrizeVideoPress = () => {
    Alert.alert(
      'Prize Distribution',
      'Winnings are transferred directly to your verified UPI ID or Bank Account within 24 hours of result declaration.',
      [{ text: 'OK' }],
    );
  };

  const handleRefundPress = () => {
    Alert.alert(
      'Refund Policy',
      '100% refund is initiated automatically if a competition is cancelled or rescheduled by Feedants.',
      [{ text: 'Got it' }],
    );
  };

  return (
    <View style={styles.card}>
      {/* Left: Video explanation */}
      <TouchableOpacity
        style={styles.leftSection}
        onPress={handlePrizeVideoPress}
        activeOpacity={0.7}
      >
        <View style={styles.playIconContainer}>
          <Text style={styles.playIcon}>▶</Text>
        </View>
        <View style={styles.videoTextContainer}>
          <Text style={styles.videoTitle}>How will you receive prize money?</Text>
          <Text style={styles.videoSubtitle}>Watch video to know more</Text>
        </View>
      </TouchableOpacity>

      {/* Vertical Divider */}
      <View style={styles.divider} />

      {/* Right: Trust badges */}
      <View style={styles.rightSection}>
        <TouchableOpacity
          style={styles.trustItem}
          onPress={handleRefundPress}
          activeOpacity={0.7}
        >
          <Text style={styles.shieldIcon}>🛡️</Text>
          <Text style={styles.trustText}>Refund policy</Text>
        </TouchableOpacity>

        <View style={styles.trustItem}>
          <Text style={styles.shieldIcon}>🔒</Text>
          <Text style={styles.trustText}>
            Secure payments powered by{' '}
            <Text style={styles.razorpayBrand}>Razorpay</Text>
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
    padding: Spacing.md,
    marginHorizontal: Spacing.screen,
    marginBottom: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#EEF2F6',
    ...Shadows.card,
  },
  leftSection: {
    flex: 1.1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  playIconContainer: {
    width: 36,
    height: 36,
    borderRadius: Radius.full,
    backgroundColor: '#E6F4F1',
    justifyContent: 'center',
    alignItems: 'center',
  },
  playIcon: {
    fontSize: 12,
    color: Colors.brand.primary,
    marginLeft: 2,
  },
  videoTextContainer: {
    flex: 1,
  },
  videoTitle: {
    fontSize: Typography.size.xs,
    fontWeight: Typography.weight.bold,
    color: Colors.text.primary,
    lineHeight: 16,
  },
  videoSubtitle: {
    fontSize: Typography.size['2xs'],
    color: Colors.text.tertiary,
    marginTop: 2,
  },
  divider: {
    width: 1,
    height: '80%',
    backgroundColor: '#E5E7EB',
    marginHorizontal: Spacing.sm,
  },
  rightSection: {
    flex: 0.9,
    justifyContent: 'center',
    gap: Spacing.sm,
    paddingLeft: Spacing.xs,
  },
  trustItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  shieldIcon: {
    fontSize: 12,
  },
  trustText: {
    fontSize: Typography.size['2xs'],
    color: Colors.text.secondary,
    lineHeight: 14,
    flex: 1,
  },
  razorpayBrand: {
    fontWeight: Typography.weight.bold,
    color: '#0C2340',
  },
});

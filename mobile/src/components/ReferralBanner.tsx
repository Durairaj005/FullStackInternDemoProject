// ─── ReferralBanner Component ────────────────────────────────────────────────
// Faithfully matches the Referral Banner from design reference (media_1790197997127.jpg):
// "Refer & Earn more discount", referral URL input with "Copy Link", and "Refer Now" CTA.

import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Share, Alert } from 'react-native';
import { Colors, Typography, Spacing, Radius } from '../theme/tokens';

interface ReferralBannerProps {
  referralLink?: string | null;
  referralEarning?: number;
}

export const ReferralBanner: React.FC<ReferralBannerProps> = ({
  referralLink = 'https://feedants.com/r/referral123',
  referralEarning = 10,
}) => {
  const [copied, setCopied] = useState(false);
  const link = referralLink || 'https://feedants.com/r/referral123';

  const handleCopyLink = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
    Alert.alert('Link Copied', 'Referral link copied to clipboard!');
  };

  const handleReferNow = async () => {
    try {
      await Share.share({
        message: `Join me on Feedants for exciting talent competitions and earn rewards! Use my invite link: ${link}`,
        url: link,
      });
    } catch (error) {
      // User cancelled share
    }
  };

  return (
    <View style={styles.container}>
      {/* Top Row: Icon + Title & Refer Button */}
      <View style={styles.topRow}>
        <View style={styles.titleWithIcon}>
          <Text style={styles.megaphoneIcon}>📢</Text>
          <Text style={styles.title}>Refer & Earn more discount</Text>
        </View>

        <TouchableOpacity
          style={styles.referNowButton}
          onPress={handleReferNow}
          activeOpacity={0.8}
        >
          <Text style={styles.referNowText}>Refer Now</Text>
        </TouchableOpacity>
      </View>

      {/* Bottom Row: Link Box & Subtitle */}
      <View style={styles.bottomRow}>
        <View style={styles.linkBox}>
          <Text style={styles.linkText} numberOfLines={1}>
            {link}
          </Text>
          <TouchableOpacity
            style={styles.copyButton}
            onPress={handleCopyLink}
            activeOpacity={0.7}
          >
            <Text style={styles.copyButtonText}>
              {copied ? 'Copied!' : 'Copy Link'}
            </Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.earningText}>
          You earn <Text style={styles.earningHighlight}>₹{referralEarning}</Text> for every signup
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#E8F8F5',
    borderRadius: Radius.lg,
    padding: Spacing.md,
    marginHorizontal: Spacing.screen,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: '#BFE7DE',
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  titleWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: Spacing.sm,
    gap: Spacing.xs,
  },
  megaphoneIcon: {
    fontSize: 18,
  },
  title: {
    fontSize: Typography.size.sm,
    fontWeight: Typography.weight.bold,
    color: Colors.text.primary,
  },
  referNowButton: {
    backgroundColor: Colors.brand.primary,
    paddingHorizontal: Spacing.md,
    paddingVertical: 7,
    borderRadius: Radius.full,
  },
  referNowText: {
    fontSize: Typography.size.xs,
    fontWeight: Typography.weight.bold,
    color: Colors.white,
  },
  bottomRow: {
    gap: 4,
  },
  linkBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: Radius.sm,
    borderWidth: 1,
    borderColor: '#C2E5DD',
    paddingLeft: Spacing.sm,
    paddingVertical: 2,
    paddingRight: 2,
  },
  linkText: {
    flex: 1,
    fontSize: Typography.size['2xs'],
    color: Colors.text.secondary,
  },
  copyButton: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: Spacing.sm,
    paddingVertical: 5,
    borderRadius: Radius.xs,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  copyButtonText: {
    fontSize: Typography.size['2xs'],
    fontWeight: Typography.weight.semibold,
    color: Colors.text.primary,
  },
  earningText: {
    fontSize: Typography.size['2xs'],
    color: Colors.brand.primary,
    alignSelf: 'flex-end',
    marginTop: 2,
  },
  earningHighlight: {
    fontWeight: Typography.weight.bold,
  },
});

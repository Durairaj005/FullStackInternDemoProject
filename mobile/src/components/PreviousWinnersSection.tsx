// ─── PreviousWinnersSection Component ─────────────────────────────────────────
// Displays horizontal carousel of previous winners matching the design reference:
// Thumbnail with play overlay, winner name, and rank title (e.g. "1st Winner").

import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Alert } from 'react-native';
import { Colors, Typography, Spacing, Radius, Shadows } from '../theme/tokens';
import { PreviousWinner } from '../types/competition';

interface PreviousWinnersSectionProps {
  winners: PreviousWinner[];
}

// Fallback sample winners matching the design reference if API returns empty list
const DEFAULT_WINNERS: PreviousWinner[] = [
  {
    name: 'Riya Shah',
    rankTitle: '1st Winner',
    imageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&q=80',
    videoUrl: 'https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4',
  },
  {
    name: 'Aarav Mehta',
    rankTitle: '1st Winner',
    imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&q=80',
    videoUrl: 'https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4',
  },
  {
    name: 'Neha Verma',
    rankTitle: '2nd Winner',
    imageUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300&q=80',
    videoUrl: 'https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4',
  },
  {
    name: 'Ishita Chouhan',
    rankTitle: '3rd Winner',
    imageUrl: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=300&q=80',
    videoUrl: 'https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4',
  },
];

export const PreviousWinnersSection: React.FC<PreviousWinnersSectionProps> = ({ winners }) => {
  const displayWinners = winners && winners.length > 0 ? winners : DEFAULT_WINNERS;

  const handlePlayWinner = (winner: PreviousWinner) => {
    Alert.alert(
      `${winner.name} (${winner.rankTitle})`,
      'Playing winner submission performance video.',
      [{ text: 'Close', style: 'cancel' }],
    );
  };

  return (
    <View style={styles.card}>
      <Text style={styles.title}>Previous Winners</Text>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollList}
      >
        {displayWinners.map((winner, index) => (
          <TouchableOpacity
            key={index}
            style={styles.winnerCard}
            onPress={() => handlePlayWinner(winner)}
            activeOpacity={0.8}
            accessibilityRole="button"
            accessibilityLabel={`Watch ${winner.name}'s winning performance`}
          >
            {/* Image Thumbnail with circular play button overlay */}
            <View style={styles.thumbnailWrapper}>
              <Image
                source={{ uri: winner.imageUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&q=80' }}
                style={styles.thumbnail}
                resizeMode="cover"
              />
              <View style={styles.playOverlay}>
                <Text style={styles.playIcon}>▶</Text>
              </View>
            </View>

            {/* Winner Info */}
            <View style={styles.winnerInfo}>
              <Text style={styles.winnerName} numberOfLines={1}>
                {winner.name}
              </Text>
              <Text style={styles.rankTitle}>
                {winner.rankTitle}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.bg.card,
    borderRadius: Radius.lg,
    paddingVertical: Spacing.base,
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
    marginBottom: Spacing.md,
    paddingHorizontal: Spacing.base,
  },
  scrollList: {
    paddingHorizontal: Spacing.base,
    gap: Spacing.md,
  },
  winnerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FAFAFA',
    borderRadius: Radius.md,
    padding: Spacing.xs + 2,
    borderWidth: 1,
    borderColor: '#EEF2F6',
    width: 175,
  },
  thumbnailWrapper: {
    position: 'relative',
    width: 60,
    height: 60,
    borderRadius: Radius.sm,
    overflow: 'hidden',
  },
  thumbnail: {
    width: '100%',
    height: '100%',
  },
  playOverlay: {
    position: 'absolute',
    bottom: 3,
    right: 3,
    width: 20,
    height: 20,
    borderRadius: Radius.full,
    backgroundColor: '#00665C',
    justifyContent: 'center',
    alignItems: 'center',
  },
  playIcon: {
    fontSize: 9,
    color: Colors.white,
    marginLeft: 1,
  },
  winnerInfo: {
    flex: 1,
    marginLeft: Spacing.sm,
    justifyContent: 'center',
  },
  winnerName: {
    fontSize: Typography.size.xs,
    fontWeight: Typography.weight.bold,
    color: Colors.text.primary,
    marginBottom: 2,
  },
  rankTitle: {
    fontSize: Typography.size['2xs'],
    fontWeight: Typography.weight.semibold,
    color: Colors.brand.primary,
  },
});

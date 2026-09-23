// ─── JudgeCard Component ──────────────────────────────────────────────────────
// Faithfully matches the Judge card from design reference (media_1790197997127.jpg):
// Avatar, Judge label, Name, Designation, Experience, and Intro Video play button.

import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Alert } from 'react-native';
import { Colors, Typography, Spacing, Radius, Shadows } from '../theme/tokens';
import { Judge } from '../types/competition';

interface JudgeCardProps {
  judge: Judge;
}

export const JudgeCard: React.FC<JudgeCardProps> = ({ judge }) => {
  const handlePlayIntro = () => {
    Alert.alert(
      'Intro Video',
      `Watching judge introduction for ${judge.name} (${judge.designation}).`,
      [{ text: 'Close', style: 'cancel' }],
    );
  };

  return (
    <View style={styles.card}>
      {/* Left: Avatar with circular ring */}
      <View style={styles.avatarContainer}>
        {judge.imageUrl ? (
          <Image
            source={{ uri: judge.imageUrl }}
            style={styles.avatar}
            resizeMode="cover"
          />
        ) : (
          <View style={styles.avatarFallback}>
            <Text style={styles.avatarInitial}>
              {judge.name.charAt(0).toUpperCase()}
            </Text>
          </View>
        )}
      </View>

      {/* Center: Judge Details */}
      <View style={styles.detailsContainer}>
        <Text style={styles.judgeLabel}>Judge</Text>
        <Text style={styles.judgeName}>{judge.name}</Text>
        <Text style={styles.designationText}>{judge.designation}</Text>
        <Text style={styles.experienceText}>{judge.experience}</Text>
      </View>

      {/* Right: Intro Video Action */}
      <TouchableOpacity
        style={styles.introVideoAction}
        onPress={handlePlayIntro}
        activeOpacity={0.7}
        accessibilityRole="button"
        accessibilityLabel="Play judge intro video"
      >
        <View style={styles.playCircle}>
          <Text style={styles.playIcon}>▶</Text>
        </View>
        <Text style={styles.introVideoText}>Intro Video</Text>
      </TouchableOpacity>
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
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#EEF2F6',
    ...Shadows.card,
  },
  avatarContainer: {
    marginRight: Spacing.md,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: Radius.full,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    backgroundColor: '#F1F5F9',
  },
  avatarFallback: {
    width: 64,
    height: 64,
    borderRadius: Radius.full,
    backgroundColor: Colors.brand.primaryTint,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarInitial: {
    fontSize: Typography.size['2xl'],
    fontWeight: Typography.weight.bold,
    color: Colors.brand.primary,
  },
  detailsContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  judgeLabel: {
    fontSize: Typography.size.xs,
    color: Colors.text.tertiary,
    fontWeight: Typography.weight.regular,
    marginBottom: 2,
  },
  judgeName: {
    fontSize: Typography.size.lg,
    fontWeight: Typography.weight.bold,
    color: Colors.text.primary,
    marginBottom: 2,
  },
  designationText: {
    fontSize: Typography.size.xs,
    color: Colors.text.secondary,
    marginBottom: 2,
  },
  experienceText: {
    fontSize: Typography.size.xs,
    color: Colors.text.tertiary,
  },
  introVideoAction: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingLeft: Spacing.sm,
  },
  playCircle: {
    width: 44,
    height: 44,
    borderRadius: Radius.full,
    backgroundColor: '#E6F4F1',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  playIcon: {
    fontSize: 14,
    color: Colors.brand.primary,
    marginLeft: 2,
  },
  introVideoText: {
    fontSize: Typography.size['2xs'],
    color: Colors.text.secondary,
    fontWeight: Typography.weight.medium,
  },
});

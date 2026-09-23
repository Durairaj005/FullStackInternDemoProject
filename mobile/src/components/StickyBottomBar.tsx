// ─── StickyBottomBar Component ────────────────────────────────────────────────
// Faithfully matches the sticky primary CTA bar from design reference (media_1790197997127.jpg):
// "Upload Submission / Registered" or "Register Now / ₹99 Entry Fee"
// Fully dynamic: handles registration state, spots availability, loading spinners, and error alerts.

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Colors, Typography, Spacing, Radius, Shadows } from '../theme/tokens';
import { Competition } from '../types/competition';
import { formatCurrency } from '../utils/dateUtils';

interface StickyBottomBarProps {
  competition: Competition;
  loading: boolean;
  registering: boolean;
  onRegister: () => Promise<void>;
  onCancel: () => Promise<void>;
  onUploadSubmission?: () => void;
}

export const StickyBottomBar: React.FC<StickyBottomBarProps> = ({
  competition,
  registering,
  onRegister,
  onCancel,
  onUploadSubmission,
}) => {
  const { spots, lifecycle, userState, entryFee, currency } = competition;
  const isRegistered = userState.isRegistered;
  const canRegister = lifecycle.canRegister;
  const isFull = spots.isFull;

  const handlePress = async () => {
    if (registering) return;

    if (isRegistered) {
      if (onUploadSubmission) {
        onUploadSubmission();
      } else {
        Alert.alert(
          'Upload Submission',
          'Select your 2–5 min classical dance video file from your device to submit for evaluation.',
          [
            { text: 'Select Video', onPress: () => Alert.alert('Success', 'Video selected successfully!') },
            {
              text: 'Cancel Registration',
              style: 'destructive',
              onPress: () => {
                Alert.alert(
                  'Cancel Registration',
                  'Are you sure you want to cancel your registration? Your spot will be freed for other participants.',
                  [
                    { text: 'Keep Registration', style: 'cancel' },
                    { text: 'Yes, Cancel', style: 'destructive', onPress: onCancel },
                  ],
                );
              },
            },
            { text: 'Dismiss', style: 'cancel' },
          ],
        );
      }
      return;
    }

    if (!canRegister) {
      if (isFull) {
        Alert.alert('Competition Full', 'All spots have been booked for this competition.');
      } else {
        Alert.alert('Registration Closed', 'Registration is no longer open for this competition.');
      }
      return;
    }

    // Trigger registration
    try {
      await onRegister();
      Alert.alert('🎉 Success!', 'You have successfully registered for Feedants Classical Dance!');
    } catch (err: any) {
      Alert.alert('Registration Failed', err?.message || 'Could not complete registration.');
    }
  };

  // Determine button label and subtext
  let mainText = 'Register Now';
  let subText: string | null = formatCurrency(entryFee, currency) + ' Entry Fee';
  let isButtonDisabled = false;
  let buttonBg: string = Colors.brand.primary;

  if (isRegistered) {
    mainText = 'Upload Submission';
    subText = 'Registered';
    buttonBg = Colors.brand.primary; // Dark teal matching screenshot
  } else if (!canRegister) {
    isButtonDisabled = true;
    if (isFull) {
      mainText = 'Competition Full';
      subText = 'All spots are booked';
      buttonBg = '#9CA3AF';
    } else if (lifecycle.isUpcoming) {
      mainText = 'Registration Not Open';
      subText = 'Check back soon';
      buttonBg = '#9CA3AF';
    } else {
      mainText = 'Registration Closed';
      subText = 'Deadline has passed';
      buttonBg = '#9CA3AF';
    }
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[
          styles.ctaButton,
          { backgroundColor: buttonBg },
          isButtonDisabled && styles.ctaDisabled,
        ]}
        onPress={handlePress}
        disabled={isButtonDisabled || registering}
        activeOpacity={0.85}
        accessibilityRole="button"
        accessibilityLabel={`${mainText}, ${subText ?? ''}`}
      >
        {registering ? (
          <ActivityIndicator color={Colors.white} size="small" />
        ) : (
          <View style={styles.textStack}>
            <Text style={styles.mainText}>{mainText}</Text>
            {subText ? <Text style={styles.subText}>{subText}</Text> : null}
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    paddingHorizontal: Spacing.screen,
    paddingTop: Spacing.sm,
    paddingBottom: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  ctaButton: {
    borderRadius: Radius.md,
    paddingVertical: Spacing.sm + 4,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 52,
    ...Shadows.cta,
  },
  ctaDisabled: {
    opacity: 0.65,
    shadowOpacity: 0,
    elevation: 0,
  },
  textStack: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  mainText: {
    fontSize: Typography.size.base,
    fontWeight: Typography.weight.bold,
    color: Colors.white,
    letterSpacing: 0.2,
  },
  subText: {
    fontSize: Typography.size['2xs'],
    color: 'rgba(255, 255, 255, 0.85)',
    fontWeight: Typography.weight.medium,
    marginTop: 2,
  },
});

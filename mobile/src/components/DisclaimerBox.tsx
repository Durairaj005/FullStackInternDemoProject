// ─── DisclaimerBox Component ──────────────────────────────────────────────────
// Displays the disclaimer alert box matching the design reference:
// "ⓘ Disclaimer: Only contributions from paid participants will be considered for judging."

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, Typography, Spacing, Radius } from '../theme/tokens';

interface DisclaimerBoxProps {
  disclaimer: string | null;
}

export const DisclaimerBox: React.FC<DisclaimerBoxProps> = ({ disclaimer }) => {
  if (!disclaimer) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.infoIcon}>ⓘ</Text>
      <Text style={styles.text}>
        <Text style={styles.boldLabel}>Disclaimer: </Text>
        {disclaimer}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#EBF6F5',
    borderRadius: Radius.md,
    padding: Spacing.md,
    marginHorizontal: Spacing.screen,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: '#C7E8E2',
    gap: Spacing.xs + 2,
  },
  infoIcon: {
    fontSize: 14,
    color: Colors.brand.primary,
    lineHeight: 18,
  },
  text: {
    flex: 1,
    fontSize: Typography.size.xs,
    color: Colors.text.secondary,
    lineHeight: 18,
  },
  boldLabel: {
    fontWeight: Typography.weight.bold,
    color: Colors.text.primary,
  },
});

// ─── ImportantDatesCard Component ─────────────────────────────────────────────
// Faithfully matches the 2x2 Important Dates card in design reference:
// Register Before, Submission Starts, Submission Ends, Result Date with icons and date/time.

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, Typography, Spacing, Radius, Shadows } from '../theme/tokens';
import { Timeline } from '../types/competition';
import { formatDateTimeParts } from '../utils/dateUtils';

interface ImportantDatesCardProps {
  timeline: Timeline;
}

export const ImportantDatesCard: React.FC<ImportantDatesCardProps> = ({ timeline }) => {
  const regBefore = formatDateTimeParts(timeline.registrationEnd);
  const subStart = formatDateTimeParts(timeline.submissionStart);
  const subEnd = formatDateTimeParts(timeline.submissionEnd);
  const resultDate = formatDateTimeParts(timeline.resultDate);

  return (
    <View style={styles.card}>
      <Text style={styles.title}>Important Dates</Text>

      <View style={styles.gridContainer}>
        {/* Row 1 */}
        <View style={styles.gridRow}>
          {/* Item 1: Register Before */}
          <View style={[styles.gridItem, styles.itemRightBorder]}>
            <View style={styles.itemHeader}>
              <Text style={styles.itemIcon}>📅</Text>
              <Text style={styles.itemLabel}>Register Before</Text>
            </View>
            <Text style={styles.itemDate}>{regBefore.date}</Text>
            <Text style={styles.itemTime}>{regBefore.time}</Text>
          </View>

          {/* Item 2: Submission Starts */}
          <View style={styles.gridItem}>
            <View style={styles.itemHeader}>
              <Text style={styles.itemIcon}>🚀</Text>
              <Text style={styles.itemLabel}>Submission Starts</Text>
            </View>
            <Text style={styles.itemDate}>{subStart.date}</Text>
            <Text style={styles.itemTime}>{subStart.time}</Text>
          </View>
        </View>

        {/* Horizontal Divider */}
        <View style={styles.rowDivider} />

        {/* Row 2 */}
        <View style={styles.gridRow}>
          {/* Item 3: Submission Ends */}
          <View style={[styles.gridItem, styles.itemRightBorder]}>
            <View style={styles.itemHeader}>
              <Text style={styles.itemIcon}>📤</Text>
              <Text style={styles.itemLabel}>Submission Ends</Text>
            </View>
            <Text style={styles.itemDate}>{subEnd.date}</Text>
            <Text style={styles.itemTime}>{subEnd.time}</Text>
          </View>

          {/* Item 4: Result Date */}
          <View style={styles.gridItem}>
            <View style={styles.itemHeader}>
              <Text style={styles.itemIcon}>🏆</Text>
              <Text style={styles.itemLabel}>Result Date</Text>
            </View>
            <Text style={styles.itemDate}>{resultDate.date}</Text>
            <Text style={styles.itemTime}>{resultDate.time}</Text>
          </View>
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
  },
  gridContainer: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: Radius.md,
    overflow: 'hidden',
  },
  gridRow: {
    flexDirection: 'row',
  },
  rowDivider: {
    height: 1,
    backgroundColor: '#E5E7EB',
  },
  gridItem: {
    flex: 1,
    padding: Spacing.md,
  },
  itemRightBorder: {
    borderRightWidth: 1,
    borderRightColor: '#E5E7EB',
  },
  itemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 4,
  },
  itemIcon: {
    fontSize: 13,
  },
  itemLabel: {
    fontSize: Typography.size.xs,
    color: Colors.text.tertiary,
    fontWeight: Typography.weight.regular,
  },
  itemDate: {
    fontSize: Typography.size.sm,
    fontWeight: Typography.weight.bold,
    color: Colors.brand.primary,
    marginBottom: 2,
  },
  itemTime: {
    fontSize: Typography.size.xs,
    color: Colors.text.primary,
    fontWeight: Typography.weight.medium,
  },
});

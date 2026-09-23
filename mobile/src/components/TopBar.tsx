// ─── TopBar Component ────────────────────────────────────────────────────────
// Matches header in design reference: "← Go back" with ENG / हिंदी language toggle.

import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors, Typography, Spacing, Radius } from '../theme/tokens';

interface TopBarProps {
  onBackPress?: () => void;
  onLanguageChange?: (lang: 'ENG' | 'HI') => void;
}

export const TopBar: React.FC<TopBarProps> = ({ onBackPress, onLanguageChange }) => {
  const [selectedLang, setSelectedLang] = useState<'ENG' | 'HI'>('ENG');

  const handleSelectLang = (lang: 'ENG' | 'HI') => {
    setSelectedLang(lang);
    onLanguageChange?.(lang);
  };

  return (
    <View style={styles.container}>
      {/* Back Button */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={onBackPress}
        activeOpacity={0.7}
        accessibilityRole="button"
        accessibilityLabel="Go back"
      >
        <Text style={styles.backArrow}>←</Text>
        <Text style={styles.backText}>Go back</Text>
      </TouchableOpacity>

      {/* Language Toggle Pill */}
      <View style={styles.langPillContainer}>
        <TouchableOpacity
          style={[
            styles.langOption,
            selectedLang === 'ENG' && styles.langOptionActive,
          ]}
          onPress={() => handleSelectLang('ENG')}
          activeOpacity={0.8}
        >
          <Text
            style={[
              styles.langText,
              selectedLang === 'ENG' && styles.langTextActive,
            ]}
          >
            ENG
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.langOption,
            selectedLang === 'HI' && styles.langOptionActive,
          ]}
          onPress={() => handleSelectLang('HI')}
          activeOpacity={0.8}
        >
          <Text
            style={[
              styles.langText,
              selectedLang === 'HI' && styles.langTextActive,
            ]}
          >
            हिंदी
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.screen,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.sm,
    backgroundColor: Colors.bg.base,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.xs,
  },
  backArrow: {
    fontSize: 20,
    fontWeight: Typography.weight.bold,
    color: Colors.text.primary,
    marginRight: Spacing.xs,
  },
  backText: {
    fontSize: Typography.size.base,
    fontWeight: Typography.weight.bold,
    color: Colors.text.primary,
  },
  langPillContainer: {
    flexDirection: 'row',
    backgroundColor: '#E5E9EB',
    borderRadius: Radius.full,
    padding: 2,
    alignItems: 'center',
  },
  langOption: {
    paddingHorizontal: Spacing.md,
    paddingVertical: 5,
    borderRadius: Radius.full,
  },
  langOptionActive: {
    backgroundColor: Colors.brand.primary, // #00665C dark teal
  },
  langText: {
    fontSize: Typography.size.xs,
    fontWeight: Typography.weight.semibold,
    color: Colors.text.tertiary,
  },
  langTextActive: {
    color: Colors.white,
    fontWeight: Typography.weight.bold,
  },
});

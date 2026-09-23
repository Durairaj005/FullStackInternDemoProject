// ─── TabsSection Component ───────────────────────────────────────────────────
// Faithfully matches the 3-tab section from design reference:
// Tabs: About Competition, Judging Parameters, Rules & Eligibility.
// Features expandable "View more ∨" toggle and weightage badges.

import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors, Typography, Spacing, Radius, Shadows } from '../theme/tokens';
import { JudgingParameter } from '../types/competition';

interface TabsSectionProps {
  about: string;
  judgingParameters: JudgingParameter[];
  rulesAndEligibility: string[];
}

type TabType = 'about' | 'parameters' | 'rules';

export const TabsSection: React.FC<TabsSectionProps> = ({
  about,
  judgingParameters,
  rulesAndEligibility,
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('about');
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  return (
    <View style={styles.card}>
      {/* Tab Navigation Header */}
      <View style={styles.tabsHeader}>
        <TouchableOpacity
          style={[
            styles.tabItem,
            activeTab === 'about' && styles.tabItemActive,
          ]}
          onPress={() => setActiveTab('about')}
          activeOpacity={0.7}
        >
          <Text
            style={[
              styles.tabTitle,
              activeTab === 'about' && styles.tabTitleActive,
            ]}
          >
            About Competition
          </Text>
          {activeTab === 'about' && <View style={styles.activeIndicator} />}
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.tabItem,
            activeTab === 'parameters' && styles.tabItemActive,
          ]}
          onPress={() => setActiveTab('parameters')}
          activeOpacity={0.7}
        >
          <Text
            style={[
              styles.tabTitle,
              activeTab === 'parameters' && styles.tabTitleActive,
            ]}
          >
            Judging Parameters
          </Text>
          {activeTab === 'parameters' && <View style={styles.activeIndicator} />}
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.tabItem,
            activeTab === 'rules' && styles.tabItemActive,
          ]}
          onPress={() => setActiveTab('rules')}
          activeOpacity={0.7}
        >
          <Text
            style={[
              styles.tabTitle,
              activeTab === 'rules' && styles.tabTitleActive,
            ]}
          >
            Rules & Eligibility
          </Text>
          {activeTab === 'rules' && <View style={styles.activeIndicator} />}
        </TouchableOpacity>
      </View>

      {/* Tab Content Container */}
      <View style={styles.contentContainer}>
        {/* Tab 1: About Competition */}
        {activeTab === 'about' && (
          <View>
            <Text
              style={styles.bodyText}
              numberOfLines={isExpanded ? undefined : 4}
            >
              {about}
            </Text>

            <TouchableOpacity
              style={styles.expandToggle}
              onPress={() => setIsExpanded((prev) => !prev)}
              activeOpacity={0.6}
            >
              <Text style={styles.expandToggleText}>
                {isExpanded ? 'View less ∧' : 'View more ∨'}
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Tab 2: Judging Parameters */}
        {activeTab === 'parameters' && (
          <View style={styles.parameterList}>
            {judgingParameters.map((param, index) => (
              <View key={index} style={styles.parameterCard}>
                <View style={styles.parameterHeader}>
                  <Text style={styles.parameterTitle}>{param.title}</Text>
                  <View style={styles.weightageBadge}>
                    <Text style={styles.weightageText}>{param.weightage}</Text>
                  </View>
                </View>
                <Text style={styles.parameterDescription}>{param.description}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Tab 3: Rules & Eligibility */}
        {activeTab === 'rules' && (
          <View style={styles.rulesList}>
            {rulesAndEligibility.map((rule, index) => (
              <View key={index} style={styles.ruleRow}>
                <Text style={styles.ruleBullet}>•</Text>
                <Text style={styles.ruleText}>{rule}</Text>
              </View>
            ))}
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.bg.card,
    borderRadius: Radius.lg,
    marginHorizontal: Spacing.screen,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: '#EEF2F6',
    overflow: 'hidden',
    ...Shadows.card,
  },
  tabsHeader: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    backgroundColor: '#FAFAFA',
  },
  tabItem: {
    flex: 1,
    paddingVertical: Spacing.md,
    alignItems: 'center',
    position: 'relative',
  },
  tabItemActive: {
    backgroundColor: Colors.bg.card,
  },
  tabTitle: {
    fontSize: Typography.size.xs,
    fontWeight: Typography.weight.medium,
    color: Colors.text.tertiary,
    textAlign: 'center',
  },
  tabTitleActive: {
    color: Colors.brand.primary,
    fontWeight: Typography.weight.bold,
  },
  activeIndicator: {
    position: 'absolute',
    bottom: 0,
    left: 12,
    right: 12,
    height: 2.5,
    backgroundColor: Colors.brand.primary,
    borderRadius: Radius.full,
  },
  contentContainer: {
    padding: Spacing.base,
  },
  bodyText: {
    fontSize: Typography.size.sm,
    color: Colors.text.secondary,
    lineHeight: 22,
  },
  expandToggle: {
    alignSelf: 'center',
    marginTop: Spacing.sm,
    paddingVertical: 4,
  },
  expandToggleText: {
    fontSize: Typography.size.xs,
    fontWeight: Typography.weight.bold,
    color: Colors.brand.primary,
  },
  parameterList: {
    gap: Spacing.sm,
  },
  parameterCard: {
    backgroundColor: '#F8FAFA',
    padding: Spacing.sm + 2,
    borderRadius: Radius.sm,
    borderWidth: 1,
    borderColor: '#E6ECEB',
  },
  parameterHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  parameterTitle: {
    fontSize: Typography.size.sm,
    fontWeight: Typography.weight.bold,
    color: Colors.text.primary,
  },
  weightageBadge: {
    backgroundColor: '#E6F4F1',
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: Radius.full,
    borderWidth: 1,
    borderColor: '#B2DFDB',
  },
  weightageText: {
    fontSize: Typography.size['2xs'],
    fontWeight: Typography.weight.bold,
    color: Colors.brand.primary,
  },
  parameterDescription: {
    fontSize: Typography.size.xs,
    color: Colors.text.secondary,
    lineHeight: 18,
  },
  rulesList: {
    gap: Spacing.xs + 2,
  },
  ruleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  ruleBullet: {
    fontSize: 16,
    color: Colors.brand.primary,
    marginRight: Spacing.xs,
    lineHeight: 20,
  },
  ruleText: {
    flex: 1,
    fontSize: Typography.size.xs,
    color: Colors.text.secondary,
    lineHeight: 20,
  },
});

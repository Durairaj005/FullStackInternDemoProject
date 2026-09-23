// ─── CompetitionDetailsScreen ────────────────────────────────────────────────
// The primary screen for the Feedants Competition Details Module.
// Faithfully implements all requirements from the official assignment and design reference.

import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { Colors, Typography, Spacing, Radius } from '../theme/tokens';
import { useCompetition } from '../hooks/useCompetition';
import { TopBar } from '../components/TopBar';
import { fetchCompetitionsList } from '../api/competitionApi';
import { HeroCard } from '../components/HeroCard';
import { JudgeCard } from '../components/JudgeCard';
import { CountdownRibbon } from '../components/CountdownRibbon';
import { ImportantDatesCard } from '../components/ImportantDatesCard';
import { PreviousWinnersSection } from '../components/PreviousWinnersSection';
import { TabsSection } from '../components/TabsSection';
import { RewardsCard } from '../components/RewardsCard';
import { DisclaimerBox } from '../components/DisclaimerBox';
import { TrustAndPaymentCard } from '../components/TrustAndPaymentCard';
import { ReferralBanner } from '../components/ReferralBanner';
import { UserFeedbackRow } from '../components/UserFeedbackRow';
import { AdBanner } from '../components/AdBanner';
import { StickyBottomBar } from '../components/StickyBottomBar';
import { BottomNavBar } from '../components/BottomNavBar';

export const CompetitionDetailsScreen: React.FC = () => {
  const [competitionsList, setCompetitionsList] = useState<
    Array<{ id: string; title: string; category: string; status: string }>
  >([]);
  const [selectedCompId, setSelectedCompId] = useState<string>('default');
  const [showDemoToolbar, setShowDemoToolbar] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  useEffect(() => {
    fetchCompetitionsList()
      .then((list) => {
        setCompetitionsList(list);
      })
      .catch(() => {});
  }, []);

  const {
    competition,
    loading,
    error,
    registering,
    countdownSeconds,
    userId,
    setUserId,
    register,
    cancel,
    refresh,
  } = useCompetition(selectedCompId, 'demo_user_001');

  const onRefresh = async () => {
    setRefreshing(true);
    await refresh();
    setRefreshing(false);
  };

  // Loading Skeleton State
  if (loading && !refreshing) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <StatusBar barStyle="dark-content" backgroundColor={Colors.bg.base} />
        <ActivityIndicator size="large" color={Colors.brand.primary} />
        <Text style={styles.loadingText}>Loading competition details...</Text>
      </SafeAreaView>
    );
  }

  // Error State with Retry
  if (error || !competition) {
    return (
      <SafeAreaView style={styles.errorContainer}>
        <StatusBar barStyle="dark-content" backgroundColor={Colors.bg.base} />
        <Text style={styles.errorIcon}>⚠️</Text>
        <Text style={styles.errorTitle}>Unable to Load Competition</Text>
        <Text style={styles.errorMessage}>{error || 'Competition not found.'}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={refresh}>
          <Text style={styles.retryButtonText}>Try Again</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.root}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.bg.base} />

      {/* Top Header Bar */}
      <TopBar />

      {/* Evaluator Demo Controls Bar (Allows switching users & competitions on the fly) */}
      {showDemoToolbar && (
        <View style={styles.demoBar}>
          <View style={styles.demoRow}>
            <Text style={styles.demoLabel}>Simulate User:</Text>
            <TouchableOpacity
              style={[
                styles.demoPill,
                userId === 'demo_user_001' && styles.demoPillActive,
              ]}
              onPress={() => setUserId('demo_user_001')}
            >
              <Text
                style={[
                  styles.demoPillText,
                  userId === 'demo_user_001' && styles.demoPillTextActive,
                ]}
              >
                User 1 (Registered)
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.demoPill,
                userId === 'demo_user_002' && styles.demoPillActive,
              ]}
              onPress={() => setUserId('demo_user_002')}
            >
              <Text
                style={[
                  styles.demoPillText,
                  userId === 'demo_user_002' && styles.demoPillTextActive,
                ]}
              >
                User 2 (Unregistered)
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.demoRow}>
            <Text style={styles.demoLabel}>Lifecycle:</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.compPillScroll}>
              {competitionsList.map((comp) => {
                const isSelected =
                  selectedCompId === comp.id ||
                  (selectedCompId === 'default' && comp.status === 'ACTIVE');
                return (
                  <TouchableOpacity
                    key={comp.id}
                    style={[styles.demoPill, isSelected && styles.demoPillActive]}
                    onPress={() => setSelectedCompId(comp.id)}
                  >
                    <Text
                      style={[
                        styles.demoPillText,
                        isSelected && styles.demoPillTextActive,
                      ]}
                    >
                      {comp.category} ({comp.status})
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
        </View>
      )}

      {/* Main Scrollable Content */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[Colors.brand.primary]}
            tintColor={Colors.brand.primary}
          />
        }
      >
        {/* 1. Hero Card: Title, Status, Tags, Prize Pool, Fee, Spots */}
        <HeroCard competition={competition} />

        {/* 2. Judge Card: Avatar, Name, Designation, Intro Video Button */}
        <JudgeCard judge={competition.judge} />

        {/* 3. Countdown Ribbon: Registration closes in, Segmented Ticking, Hurry up! */}
        <CountdownRibbon
          countdownSeconds={countdownSeconds}
          isUpcoming={competition.lifecycle.isUpcoming}
          hasEnded={competition.lifecycle.hasEnded}
        />

        {/* 4. Important Dates: 2x2 Grid (Register, Submission Start/End, Result Date) */}
        <ImportantDatesCard timeline={competition.timeline} />

        {/* 5. Previous Winners Carousel */}
        <PreviousWinnersSection winners={competition.previousWinners} />

        {/* 6. Tabs Section: About, Judging Parameters, Rules & Eligibility */}
        <TabsSection
          about={competition.about}
          judgingParameters={competition.judgingParameters}
          rulesAndEligibility={competition.rulesAndEligibility}
        />

        {/* 7. Rewards Card: 1st to 6th rank prizes */}
        <RewardsCard rewards={competition.rewards} currency={competition.currency} />

        {/* 8. Disclaimer Box */}
        <DisclaimerBox disclaimer={competition.disclaimer} />

        {/* 9. Prize Video & Trust Badges (Refund policy, Razorpay) */}
        <TrustAndPaymentCard />

        {/* 10. Refer & Earn Banner */}
        <ReferralBanner
          referralLink={competition.referralLink}
          referralEarning={competition.referralEarning}
        />

        {/* 11. Hear From Our Users */}
        <UserFeedbackRow />

        {/* 12. Ad Here Slot */}
        <AdBanner />

        {/* Bottom spacing so content isn't obscured by sticky bar */}
        <View style={styles.bottomSpacer} />
      </ScrollView>

      {/* Sticky Bottom Action CTA Button */}
      <StickyBottomBar
        competition={competition}
        loading={loading}
        registering={registering}
        onRegister={register}
        onCancel={cancel}
      />

      {/* Bottom Navigation App Bar */}
      <BottomNavBar />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Colors.bg.base,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: Spacing.sm,
  },
  bottomSpacer: {
    height: Spacing.base,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: Colors.bg.base,
    justifyContent: 'center',
    alignItems: 'center',
    gap: Spacing.md,
  },
  loadingText: {
    fontSize: Typography.size.sm,
    color: Colors.text.tertiary,
    fontWeight: Typography.weight.medium,
  },
  errorContainer: {
    flex: 1,
    backgroundColor: Colors.bg.base,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xl,
    gap: Spacing.sm,
  },
  errorIcon: {
    fontSize: 48,
    marginBottom: Spacing.sm,
  },
  errorTitle: {
    fontSize: Typography.size.lg,
    fontWeight: Typography.weight.bold,
    color: Colors.text.primary,
  },
  errorMessage: {
    fontSize: Typography.size.sm,
    color: Colors.text.tertiary,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: Spacing.md,
  },
  retryButton: {
    backgroundColor: Colors.brand.primary,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.sm + 2,
    borderRadius: Radius.md,
  },
  retryButtonText: {
    color: Colors.white,
    fontSize: Typography.size.sm,
    fontWeight: Typography.weight.bold,
  },
  demoBar: {
    backgroundColor: '#E7F2F0',
    paddingHorizontal: Spacing.screen,
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#D0E6E2',
    gap: 4,
  },
  demoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  demoLabel: {
    fontSize: Typography.size['2xs'],
    color: Colors.text.secondary,
    fontWeight: Typography.weight.bold,
    width: 78,
  },
  compPillScroll: {
    flexDirection: 'row',
    gap: 6,
  },
  demoPill: {
    backgroundColor: Colors.white,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: Radius.full,
    borderWidth: 1,
    borderColor: '#C3E0DA',
  },
  demoPillActive: {
    backgroundColor: Colors.brand.primary,
    borderColor: Colors.brand.primary,
  },
  demoPillText: {
    fontSize: Typography.size['2xs'],
    color: Colors.text.secondary,
    fontWeight: Typography.weight.semibold,
  },
  demoPillTextActive: {
    color: Colors.white,
    fontWeight: Typography.weight.bold,
  },
});

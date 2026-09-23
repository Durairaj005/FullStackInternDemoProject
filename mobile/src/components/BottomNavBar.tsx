// ─── BottomNavBar Component ───────────────────────────────────────────────────
// Faithfully matches the 5-tab bottom navigation bar from design reference (media_1790197997127.jpg):
// [Home] [Explore] [ (+) Center FAB ] [Competitions (Active)] [Profile]

import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Colors, Typography, Spacing, Radius } from '../theme/tokens';

export const BottomNavBar: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'home' | 'explore' | 'competitions' | 'profile'>('competitions');

  return (
    <View style={styles.navBar}>
      {/* 1. Home */}
      <TouchableOpacity
        style={styles.navItem}
        onPress={() => setActiveTab('home')}
        activeOpacity={0.7}
      >
        <Text style={[styles.navIcon, activeTab === 'home' && styles.activeIcon]}>🏠</Text>
        <Text style={[styles.navLabel, activeTab === 'home' && styles.activeLabel]}>Home</Text>
      </TouchableOpacity>

      {/* 2. Explore */}
      <TouchableOpacity
        style={styles.navItem}
        onPress={() => setActiveTab('explore')}
        activeOpacity={0.7}
      >
        <Text style={[styles.navIcon, activeTab === 'explore' && styles.activeIcon]}>🔍</Text>
        <Text style={[styles.navLabel, activeTab === 'explore' && styles.activeLabel]}>Explore</Text>
      </TouchableOpacity>

      {/* 3. Center Create Action (+) */}
      <TouchableOpacity
        style={styles.centerFabContainer}
        onPress={() => {}}
        activeOpacity={0.85}
        accessibilityRole="button"
        accessibilityLabel="Create submission"
      >
        <View style={styles.centerFab}>
          <Text style={styles.centerFabIcon}>+</Text>
        </View>
      </TouchableOpacity>

      {/* 4. Competitions (Active) */}
      <TouchableOpacity
        style={styles.navItem}
        onPress={() => setActiveTab('competitions')}
        activeOpacity={0.7}
      >
        <Text style={[styles.navIcon, activeTab === 'competitions' && styles.activeIcon]}>🏆</Text>
        <Text style={[styles.navLabel, activeTab === 'competitions' && styles.activeLabel]}>Competitions</Text>
      </TouchableOpacity>

      {/* 5. Profile */}
      <TouchableOpacity
        style={styles.navItem}
        onPress={() => setActiveTab('profile')}
        activeOpacity={0.7}
      >
        <Image
          source={{ uri: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&q=80' }}
          style={[styles.profileAvatar, activeTab === 'profile' && styles.activeAvatar]}
        />
        <Text style={[styles.navLabel, activeTab === 'profile' && styles.activeLabel]}>Profile</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  navBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: Colors.white,
    paddingVertical: 6,
    paddingBottom: 10,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    gap: 2,
  },
  navIcon: {
    fontSize: 18,
    color: Colors.text.tertiary,
  },
  navLabel: {
    fontSize: Typography.size['2xs'],
    color: Colors.text.tertiary,
    fontWeight: Typography.weight.medium,
  },
  activeIcon: {
    color: Colors.brand.primary,
  },
  activeLabel: {
    color: Colors.brand.primary,
    fontWeight: Typography.weight.bold,
  },
  centerFabContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  centerFab: {
    width: 44,
    height: 44,
    borderRadius: Radius.full,
    backgroundColor: Colors.brand.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.brand.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  centerFabIcon: {
    fontSize: 26,
    fontWeight: Typography.weight.regular,
    color: Colors.white,
    lineHeight: 28,
  },
  profileAvatar: {
    width: 22,
    height: 22,
    borderRadius: Radius.full,
    borderWidth: 1,
    borderColor: '#D1D5DB',
  },
  activeAvatar: {
    borderColor: Colors.brand.primary,
    borderWidth: 1.5,
  },
});

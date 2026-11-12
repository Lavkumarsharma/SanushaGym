import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import { supabase, getCurrentMember, getMembership } from '@/services/supabase';
import { impactAsync, ImpactFeedbackStyle } from 'expo-haptics';

interface Member {
  id: string;
  name: string;
  phone: string;
  current_streak: number;
  total_check_ins: number;
}

interface Membership {
  plan_name: string;
  plan_type: string;
  expiry_date: string;
  base_price: number;
  discount: number;
  final_amount: number;
  is_active: boolean;
}

export default function MemberHomeScreen() {
  const router = useRouter();
  const [member, setMember] = useState<Member | null>(null);
  const [membership, setMembership] = useState<Membership | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const { data: memberData, error: memberError } = await getCurrentMember();
      if (memberError) throw memberError;
      setMember(memberData);

      if (memberData) {
        const { data: memData, error: memError } = await getMembership(memberData.id);
        if (memError) throw memError;
        setMembership(memData);
      }
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const daysUntilExpiry = membership
    ? Math.ceil((new Date(membership.expiry_date).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
    : 0;

  const handleCheckIn = () => {
    impactAsync(ImpactFeedbackStyle.Light);
    router.push('/(member)/check-in');
  };

  const handleRenew = () => {
    router.push('/(member)/renewal');
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#10B981" />
      </View>
    );
  }

  if (!member) {
    return null;
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.greetingContainer}>
            <Text style={styles.greeting}>
              Namaste, {member.name.split(' ')[0]}
            </Text>
            <Text style={styles.subtitle}>Ready for today's workout?</Text>
          </View>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{member.name.charAt(0).toUpperCase()}</Text>
          </View>
        </View>

        {/* Membership Section (Image Matched) */}
        {membership && (
          <View style={styles.membershipSection}>
            <Text style={styles.membershipLabel}>Active Membership</Text>
            <View style={styles.membershipNameRow}>
              <Text style={styles.membershipName}>{membership.plan_name}</Text>
              <View style={styles.membershipDaysContainer}>
                <Text style={styles.membershipDaysNumber}>{Math.max(0, daysUntilExpiry)}</Text>
                <Text style={styles.membershipDaysLabel}>Days Left</Text>
              </View>
            </View>
            <View style={styles.membershipPriceRow}>
              <Text style={styles.membershipPrice}>
                ₹{Math.round(membership.final_amount)}
              </Text>
              <Text style={styles.membershipOriginal}>
                ₹{Math.round(membership.base_price)}
              </Text>
            </View>
            <Text style={styles.membershipExpiry}>Expires {membership.expiry_date}</Text>
            <TouchableOpacity style={styles.btnRenew} onPress={handleRenew}>
              <Text style={styles.btnRenewText}>Renew</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Streak Section */}
        <View style={styles.streakCard}>
          <View style={styles.streakHeader}>
            <Text style={styles.streakEmoji}>🔥</Text>
            <Text style={styles.streakTitle}>Your Streak</Text>
          </View>
          <Text style={styles.streakNumber}>{member.current_streak}</Text>
          <Text style={styles.streakHint}>Keep it going! Every check-in counts.</Text>
        </View>

        {/* Weekly Goal */}
        <View style={styles.weeklyGoalCard}>
          <View style={styles.goalHeader}>
            <View style={styles.goalLabelRow}>
              <View style={styles.goalIcon}>
                <Text style={styles.goalIconText}>📅</Text>
              </View>
              <Text style={styles.goalTitleText}>Weekly Goal</Text>
            </View>
            <Text style={styles.goalCount}>4 / 4 this week</Text>
          </View>
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: '100%' }]} />
          </View>
          <View style={styles.dayCircles}>
            {[1, 2, 3, 4].map((day) => (
              <View key={day} style={styles.dayCircle}>
                <Text style={styles.dayText}>{day}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActionsCard}>
          <View style={styles.quickActionsTitle}>
            <Text style={styles.quickIconEmoji}>⚡</Text>
            <Text style={styles.quickActionsTitleText}>Quick Actions</Text>
          </View>
          <View style={styles.quickGrid}>
            <TouchableOpacity style={styles.quickCard} onPress={handleCheckIn}>
              <View style={styles.quickIconBox}>
                <Text style={styles.quickIcon}>📱</Text>
              </View>
              <Text style={styles.quickTitleText}>Check-In</Text>
              <Text style={styles.quickSubtitleText}>Scan QR</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.quickCard} onPress={handleRenew}>
              <View style={styles.quickIconBox}>
                <Text style={styles.quickIcon}>💳</Text>
              </View>
              <Text style={styles.quickTitleText}>Renewal</Text>
              <Text style={styles.quickSubtitleText}>Plan ahead</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.quickCard} onPress={() => router.push('/(member)/add-ons')}>
              <View style={styles.quickIconBox}>
                <Text style={styles.quickIcon}>🏋️</Text>
              </View>
              <Text style={styles.quickTitleText}>Add-Ons</Text>
              <Text style={styles.quickSubtitleText}>PT • Diet • Supplements</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Recent Attendance */}
        <View style={styles.recentAttendanceSection}>
          <View style={styles.recentTitle}>
            <Text style={styles.recentIcon}>📊</Text>
            <Text style={styles.recentTitleText}>Recent Check-Ins</Text>
          </View>
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>📅</Text>
            <Text style={styles.emptyTitle}>No check-ins yet</Text>
            <Text style={styles.emptySubtitle}>Scan the gym QR to start your streak.</Text>
          </View>
        </View>

        <View style={styles.spacer} />
      </ScrollView>

      {/* Bottom Tab Bar */}
      <View style={styles.tabBar}>
        <TouchableOpacity style={[styles.tabItem, styles.tabActive]} onPress={() => {}}>
          <Text style={[styles.tabLabel, { color: '#10B981' }]}>🏠 Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tabItem} onPress={handleCheckIn}>
          <Text style={styles.tabLabel}>📱 Check-In</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tabItem} onPress={() => router.push('/(member)/history')}>
          <Text style={styles.tabLabel}>📊 History</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tabItem} onPress={() => router.push('/(member)/add-ons')}>
          <Text style={styles.tabLabel}>🏋️ Add-Ons</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tabItem} onPress={() => router.push('/(member)/renewal')}>
          <Text style={styles.tabLabel}>💳 Renewal</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tabItem} onPress={() => router.push('/(member)/settings')}>
          <Text style={styles.tabLabel}>⚙️ Settings</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000000',
  },
  container: {
    flex: 1,
    backgroundColor: '#000000',
    paddingHorizontal: 20,
    paddingBottom: 80,
  },
  scrollContent: {
    paddingTop: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 12,
  },
  greetingContainer: {
    flex: 1,
  },
  greeting: {
    fontSize: 26,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: -1,
  },
  subtitle: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.6)',
    marginTop: 2,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 17,
    fontWeight: '800',
    color: '#10B981',
  },
  // Membership Section
  membershipSection: {
    marginBottom: 16,
  },
  membershipLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: 'rgba(255,255,255,0.6)',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  membershipNameRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 12,
    marginBottom: 4,
  },
  membershipName: {
    fontSize: 19,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  membershipDaysContainer: {
    alignItems: 'flex-end',
    gap: 2,
  },
  membershipDaysNumber: {
    fontSize: 32,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  membershipDaysLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: 'rgba(255,255,255,0.6)',
    textTransform: 'uppercase',
  },
  membershipPriceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 8,
    marginBottom: 10,
  },
  membershipPrice: {
    fontSize: 20,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  membershipOriginal: {
    fontSize: 14,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.5)',
    textDecorationLine: 'line-through',
  },
  membershipExpiry: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FBBF24',
  },
  btnRenew: {
    width: '100%',
    padding: 14,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
  },
  btnRenewText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  // Streak
  streakCard: {
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
    borderLeftWidth: 3,
    borderLeftColor: '#10B981',
  },
  streakHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  streakEmoji: {
    fontSize: 18,
  },
  streakTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  streakNumber: {
    fontSize: 48,
    fontWeight: '900',
    color: '#FFFFFF',
    marginBottom: 6,
  },
  streakHint: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.5)',
  },
  // Weekly Goal
  weeklyGoalCard: {
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
  },
  goalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  goalLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  goalIcon: {
    width: 16,
    height: 16,
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  goalIconText: {
    fontSize: 10,
    color: '#10B981',
  },
  goalTitleText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  goalCount: {
    fontSize: 15,
    fontWeight: '900',
    color: '#10B981',
  },
  progressTrack: {
    width: '100%',
    height: 6,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 12,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#10B981',
  },
  dayCircles: {
    flexDirection: 'row',
    gap: 10,
  },
  dayCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayText: {
    color: '#FFFFFF',
    fontWeight: '900',
    fontSize: 14,
  },
  // Quick Actions
  quickActionsCard: {
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
  },
  quickActionsTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  quickIconEmoji: {
    fontSize: 18,
  },
  quickActionsTitleText: {
    fontSize: 16,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  quickGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  quickCard: {
    flex: 1,
    minWidth: 100,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
  },
  quickIconBox: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  quickIcon: {
    fontSize: 24,
  },
  quickTitleText: {
    fontSize: 13,
    fontWeight: '900',
    color: '#FFFFFF',
    marginBottom: 4,
    lineHeight: 1.2,
  },
  quickSubtitleText: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.5)',
    lineHeight: 1.3,
  },
  // Recent Attendance
  recentAttendanceSection: {
    marginBottom: 20,
  },
  recentTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    fontSize: 16,
    fontWeight: '900',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  recentIcon: {
    fontSize: 18,
  },
  recentTitleText: {
    fontSize: 16,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 30,
  },
  emptyIcon: {
    fontSize: 40,
    marginBottom: 10,
    opacity: 0.3,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  emptySubtitle: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.5)',
    marginTop: 6,
  },
  spacer: {
    height: 20,
  },
  tabBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.1)',
    backgroundColor: '#000000',
  },
  tabItem: {
    alignItems: 'center',
    paddingVertical: 6,
  },
  tabActive: {
    // active state handled by color
  },
  tabLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: 'rgba(255,255,255,0.5)',
  },
});

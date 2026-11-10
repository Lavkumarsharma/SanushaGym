import { View, Text, StyleSheet, ScrollView, FlatList, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import { supabase, getAttendanceHistory } from '@/services/supabase';
import { useSocket } from '@/services/socket';

interface Attendance {
  id: string;
  member_id: string;
  check_in_time: string;
  source: string;
}

export default function HistoryScreen() {
  const { socket } = useSocket();
  const [attendances, setAttendances] = useState<Attendance[]>([]);
  const [filter, setFilter] = useState<'all' | 'week' | 'month'>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadHistory();

    // Listen for real-time attendance updates
    const channel = socket;
    if (channel) {
      channel.on('attendance:updated', (data: any) => {
        loadHistory();
      });
    }

    return () => {
      if (channel) channel.off('attendance:updated');
    };
  }, [socket, filter]);

  const loadHistory = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await getAttendanceHistory(user.id);
      if (error) throw error;

      let filtered = data || [];
      const now = new Date();

      if (filter === 'week') {
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        filtered = filtered.filter((a: any) => new Date(a.check_in_time) >= weekAgo);
      } else if (filter === 'month') {
        const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        filtered = filtered.filter((a: any) => new Date(a.check_in_time) >= monthAgo);
      }

      setAttendances(filtered);
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#10B981" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Attendance History</Text>

        {/* Filter chips */}
        <View style={styles.filterRow}>
          {[['All', 'all'], ['This Week', 'week'], ['This Month', 'month']] as const}.map(([label, value]) => (
            <TouchableOpacity
              key={value}
              style={[styles.filterChip, filter === value && styles.filterChipActive]}
              onPress={() => setFilter(value)}
            >
              <Text style={[styles.filterText, filter === value && styles.filterTextActive]}>{label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Summary */}
        <View style={styles.summaryRow}>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryValue}>{attendances.length}</Text>
            <Text style={styles.summaryLabel}>Total Check-Ins</Text>
          </View>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryValue}>{attendances.filter((a) => a.source === 'qr').length}</Text>
            <Text style={styles.summaryLabel}>QR Check-Ins</Text>
          </View>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryValue}>{attendances.filter((a) => a.source === 'assisted').length}</Text>
            <Text style={styles.summaryLabel}>Assisted</Text>
          </View>
        </View>

        {/* List */}
        {attendances.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>No check-ins yet</Text>
            <Text style={styles.emptySubtitle}>Scan the gym QR to start building your history.</Text>
          </View>
        ) : (
          <FlatList
            data={attendances}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={styles.row}>
                <View style={[styles.dot, { backgroundColor: item.source === 'qr' ? '#10B981' : item.source === 'assisted' ? '#3B82F6' : '#F59E0B' }]} />
                <View style={styles.rowInfo}>
                  <Text style={styles.rowTime}>{formatTime(item.check_in_time)}</Text>
                  <Text style={styles.rowDate}>{formatDate(item.check_in_time)}</Text>
                  <Text style={styles.rowSource}>
                    {item.source === 'qr' ? 'QR Check-In' : item.source === 'assisted' ? 'Assisted (Staff)' : 'Offline (Sync Pending)'}
                  </Text>
                </View>
              </View>
            )}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
          />
        )}
      </ScrollView>
    </View>
  );
};

const formatTime = (iso: string) => {
  return new Date(iso).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
};

const formatDate = (iso: string) => {
  return new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
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
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingVertical: 16,
  },
  title: {
    fontSize: 26,
    fontWeight: '900',
    color: '#FFFFFF',
    marginBottom: 16,
    letterSpacing: -1,
  },
  filterRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 20,
  },
  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  filterChipActive: {
    backgroundColor: '#10B981',
    borderColor: '#10B981',
  },
  filterText: {
    fontSize: 12,
    fontWeight: '700',
    color: 'rgba(255,255,255,0.6)',
  },
  filterTextActive: {
    color: '#000000',
  },
  summaryRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 20,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: 14,
    padding: 14,
    alignItems: 'center',
  },
  summaryValue: {
    fontSize: 20,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  summaryLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.5)',
    marginTop: 4,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  emptySubtitle: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.5)',
    marginTop: 6,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: 12,
    marginBottom: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 12,
  },
  rowInfo: {
    flex: 1,
  },
  rowTime: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  rowDate: {
    fontSize: 13,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.5)',
    marginTop: 2,
  },
  rowSource: {
    fontSize: 11,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.4)',
    marginTop: 2,
  },
  separator: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.1)',
    marginLeft: 56,
  },
});

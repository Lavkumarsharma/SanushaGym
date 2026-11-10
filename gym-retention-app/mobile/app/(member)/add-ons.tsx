import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import React, { useEffect, useState } from 'react';
import { supabase, getAddOns } from '@/services/supabase';
import { Haptics } from 'expo-haptics';

interface AddOn {
  id: string;
  name: string;
  type: string;
  price: number;
  validity_days: number;
  stock?: number;
  trainer_name?: string;
  trainer_qualification?: string;
  cancellation_terms: string;
  is_available: boolean;
}

export default function AddOnsScreen() {
  const [addOns, setAddOns] = useState<AddOn[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<AddOn | null>(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    loadAddOns();
  }, []);

  const loadAddOns = async () => {
    try {
      const { data, error } = await getAddOns();
      if (error) throw error;
      setAddOns(data || []);
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const typeColor = (type: string) => {
    switch (type) {
      case 'personal-training': return '#3B82F6';
      case 'diet-plan': return '#10B981';
      case 'supplement': return '#F59E0B';
      default: return '#6B7280';
    }
  };

  const typeIcon = (type: string) => {
    switch (type) {
      case 'personal-training': return '🏋️';
      case 'diet-plan': return '🥗';
      case 'supplement': return '💊';
      default: return '📦';
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Add-Ons</Text>
        <Text style={styles.subtitle}>Personal Training • Diet Plans • Supplements</Text>

        {/* Category chips */}
        <View style={styles.chipRow}>
          {['All', 'Personal Training', 'Diet Plan', 'Supplement'].map((label) => (
            <TouchableOpacity key={label} style={styles.chip} onPress={() => {}}>
              <Text style={styles.chipText}>{label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#10B981" />
          </View>
        ) : (
          <>
            {addOns.map((addOn) => (
              <TouchableOpacity
                key={addOn.id}
                style={styles.card}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  setSelected(addOn);
                  setQuantity(1);
                }}
              >
                <View style={styles.cardTop}>
                  <Text style={styles.cardName}>{addOn.name}</div>
                  <Text style={styles.cardValidity}>Valid {addOn.validity_days} days</Text>
                </View>
                <Text style={styles.cardCategory}>{addOn.type.replace('-', ' ').replace(/\b\w/g, (c) => c.toUpperCase())}</Text>
                <View style={styles.priceRow}>
                  <Text style={styles.cardPrice}>₹{Math.round(addOn.price)}</Text>
                  <Text style={[styles.stockBadge, addOn.stock !== undefined && (addOn.stock > 5 ? styles.stockOk : styles.stockLow)]}>
                    {addOn.stock !== undefined ? (addOn.stock > 5 ? 'In Stock' : 'Low Stock') : 'Unlimited'}
                  </Text>
                </View>
                <View style={styles.divider} />
                <View style={styles.trainerRow}>
                  <Text style={styles.trainerIcon}>{addOn.trainer_name ? '👤' : '-'}</Text>
                  <View style={styles.trainerInfo}>
                    <Text style={styles.trainerName}>{addOn.trainer_name || '-'}</Text>
                    <Text style={styles.trainerQual}>{addOn.trainer_qualification || '-'}</Text>
                  </View>
                </View>
                <Text style={styles.cardTerms}>{addOn.cancellation_terms}</Text>
              </TouchableOpacity>
            ))}

            {/* Purchase Section */}
            {selected && (
              <View style={styles.purchaseSection}>
                <View style={styles.purchaseHeader}>
                  <Text style={styles.purchaseTitle}>Add to Membership</Text>
                  <Text style={styles.purchasePrice}>₹{Math.round(selected.price * quantity)}</Text>
                </View>

                <View style={styles.quantityControls}>
                  <TouchableOpacity style={styles.qtyBtn} onPress={() => setQuantity((q) => Math.max(1, q - 1))}>
                    <Text style={styles.qtyText}>−</Text>
                  </TouchableOpacity>
                  <Text style={styles.qtyValue}>{quantity}</Text>
                  <TouchableOpacity style={styles.qtyBtn} onPress={() => setQuantity((q) => q + 1)}>
                    <Text style={styles.qtyText}>+</Text>
                  </TouchableOpacity>
                </View>

                <View style={styles.cancellationReminder}>
                  <Text style={styles.cancellationText}>{selected.cancellation_terms}</Text>
                </View>

                <TouchableOpacity style={styles.addBtn} onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Success);
                  setSelected(null);
                }}>
                  <Text style={styles.addBtnText}>Add {selected.name}</Text>
                </TouchableOpacity>
              </View>
            )}
          </>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
    paddingHorizontal: 16,
    paddingBottom: 100,
  },
  scrollContent: {
    paddingTop: 8,
  },
  title: {
    fontSize: 22,
    fontWeight: '900',
    color: '#FFFFFF',
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.5)',
    marginBottom: 20,
  },
  chipRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 16,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  chipText: {
    fontSize: 12,
    fontWeight: '700',
    color: 'rgba(255,255,255,0.7)',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    borderRadius: 18,
    padding: 16,
    marginBottom: 16,
  },
  cardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  cardName: {
    fontSize: 18,
    fontWeight: '900',
    color: '#FFFFFF',
    lineHeight: 1.2,
  },
  cardValidity: {
    fontSize: 12,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.6)',
    textAlign: 'right',
  },
  cardCategory: {
    fontSize: 11,
    fontWeight: '800',
    color: 'rgba(255,255,255,0.5)',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginTop: 4,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    margin: 10,
    marginVertical: 8,
  },
  cardPrice: {
    fontSize: 24,
    fontWeight: '900',
    color: '#10B981',
  },
  stockBadge: {
    fontSize: 11,
    fontWeight: '800',
  },
  stockOk: {
    color: '#10B981',
  },
  stockLow: {
    color: '#F59E0B',
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.1)',
    marginVertical: 12,
  },
  trainerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  trainerIcon: {
    fontSize: 14,
  },
  trainerInfo: {
    flex: 1,
  },
  trainerName: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  trainerQual: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.5)',
    marginTop: 2,
  },
  cardTerms: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.5)',
    lineHeight: 1.5,
    marginTop: 10,
  },
  purchaseSection: {
    backgroundColor: '#000000',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.1)',
  },
  purchaseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  purchaseTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  purchasePrice: {
    fontSize: 18,
    fontWeight: '800',
    color: '#10B981',
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  qtyBtn: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  qtyText: {
    fontSize: 18,
    color: '#10B981',
    fontWeight: '800',
  },
  qtyValue: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FFFFFF',
    marginHorizontal: 12,
  },
  cancellationReminder: {
    marginBottom: 12,
  },
  cancellationText: {
    fontSize: 11,
    color: '#FBBF24',
    fontWeight: '600',
  },
  addBtn: {
    backgroundColor: '#10B981',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 8,
  },
  addBtnText: {
    color: '#000000',
    fontSize: 16,
    fontWeight: '800',
  },
});

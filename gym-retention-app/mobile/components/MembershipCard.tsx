import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import React from 'react';
import { DaysCounter } from '@/components/DaysCounter';

interface MembershipCardProps {
  planName: string;
  planType: string;
  expiryDate: string;
  basePrice: number;
  discount: number;
  finalAmount: number;
  daysUntilExpiry: number;
  isActive: boolean;
  onRenewPress: () => void;
}

export const MembershipCard: React.FC<MembershipCardProps> = ({
  planName,
  planType,
  expiryDate,
  basePrice,
  discount,
  finalAmount,
  daysUntilExpiry,
  isActive,
  onRenewPress,
}) => {
  const isExpiringSoon = daysUntilExpiry <= 7 && daysUntilExpiry > 0;

  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <View>
          <Text style={styles.label}>Active Membership</Text>
          <Text style={styles.planName}>{planName}</Text>
        </View>
        <View style={styles.expiryInfo}>
          <Text style={styles.label}>Expires</Text>
          <Text style={[styles.expiryDate, { color: isExpiringSoon ? '#FBBF24' : '#FFFFFF' }]}>
            {expiryDate}
          </Text>
        </View>
      </View>

      <View style={styles.divider} />

      <View style={styles.bottomRow}>
        <DaysCounter count={daysUntilExpiry} label="Days Left" accentColor={isExpiringSoon ? '#FBBF24' : '#10B981'} showMilestonePulse={false} />

        <View style={styles.priceInfo}>
          <Text style={styles.price}>₹{Math.round(finalAmount)}</Text>
          <Text style={styles.originalPrice}>₹{Math.round(basePrice)}</Text>
          <Text style={styles.planTypeText}>{planType}</Text>
        </View>

        {isActive && daysUntilExpiry <= 7 && (
          <TouchableOpacity style={styles.renewButton} onPress={onRenewPress}>
            <Text style={styles.renewButtonText}>Renew</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
    padding: 16,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  label: {
    fontSize: 12,
    fontWeight: '700',
    color: 'rgba(255,255,255,0.6)',
  },
  planName: {
    fontSize: 20,
    fontWeight: '800',
    color: '#FFFFFF',
    marginTop: 4,
  },
  expiryInfo: {
    alignItems: 'flex-end',
  },
  expiryDate: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    marginTop: 4,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.2)',
    marginVertical: 12,
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  priceInfo: {
    flex: 1,
    marginHorizontal: 16,
  },
  price: {
    fontSize: 18,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  originalPrice: {
    fontSize: 12,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.5)',
    textDecorationLine: 'line-through',
    marginTop: 2,
  },
  planTypeText: {
    fontSize: 12,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.6)',
    marginTop: 6,
  },
  renewButton: {
    backgroundColor: '#10B981',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 10,
  },
  renewButtonText: {
    color: '#000000',
    fontWeight: '800',
    fontSize: 14,
  },
});

import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import React, { useEffect, useState } from 'react';
import { supabase, getMembership, createPayment, verifyPayment } from '@/services/supabase';
import { impactAsync, ImpactFeedbackStyle } from 'expo-haptics';

interface PlanDuration {
  label: string;
  months: number;
  basePrice: number;
  discount: number;
  benefits: string[];
}

const PLANS: PlanDuration[] = [
  {
    label: '3 Months',
    months: 3,
    basePrice: 3999,
    discount: 0,
    benefits: ['Gym access', '1 guest pass/month'],
  },
  {
    label: '6 Months',
    months: 6,
    basePrice: 6999,
    discount: 500,
    benefits: ['Gym access', '2 guest passes/month', '1 free PT session'],
  },
  {
    label: '12 Months',
    months: 12,
    basePrice: 12499,
    discount: 1500,
    benefits: ['Gym access', '4 guest passes/month', '3 free PT sessions', 'Free diet plan'],
  },
];

interface PaymentState {
  type: 'idle' | 'created' | 'pending' | 'paid' | 'failed' | 'refunded' | 'reversed';
  orderId?: string;
  receiptId?: string;
  reason?: string;
}

export default function RenewalScreen() {
  const [selectedPlan, setSelectedPlan] = useState<PlanDuration>(PLANS[1]);
  const [paymentState, setPaymentState] = useState<PaymentState>({ type: 'idle' });
  const [loading, setLoading] = useState(true);

  const basePrice = selectedPlan.basePrice;
  const discount = selectedPlan.discount;
  const finalAmount = basePrice - discount;

  useEffect(() => {
    loadMembership();
  }, []);

  const loadMembership = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data } = await getMembership(user.id);
        // Just load to verify membership exists
      }
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const initiatePayment = async () => {
    setPaymentState({ type: 'pending' });
    impactAsync(ImpactFeedbackStyle.Light);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error, orderId } = await createPayment(user.id, finalAmount, selectedPlan.label);
      if (error) throw error;
      if (!data) throw new Error('Failed to create payment');

      // Simulate payment processing (3 seconds)
      setTimeout(async () => {
        const success = Math.random() < 0.8; // 80% success rate for demo
        if (success) {
          await verifyPayment(data.id);
          setPaymentState({ type: 'paid', receiptId: `RCPT-${Math.floor(Math.random() * 90000 + 10000)}` });
          impactAsync(ImpactFeedbackStyle.Heavy);
        } else {
          setPaymentState({ type: 'failed', reason: 'Payment declined by provider' });
          impactAsync(ImpactFeedbackStyle.Heavy);
        }
      }, 3000);
    } catch (err: any) {
      setPaymentState({ type: 'failed', reason: err.message || 'Payment failed' });
      impactAsync(ImpactFeedbackStyle.Heavy);
    }
  };

  const getStateColor = (type: PaymentState['type']) => {
    switch (type) {
      case 'paid': return '#10B981';
      case 'failed': return '#EF4444';
      case 'refunded': case 'reversed': return '#F59E0B';
      case 'pending': return '#FBBF24';
      default: return '#3B82F6';
    }
  };

  const getStateLabel = (type: PaymentState['type']) => {
    switch (type) {
      case 'idle': case 'created': return `Pay ₹${Math.round(finalAmount)}`;
      case 'pending': return 'Processing…';
      case 'paid': return 'Payment Verified';
      case 'failed': return 'Payment Failed';
      case 'refunded': return 'Refunded';
      case 'reversed': return 'Reversed';
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
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Renew Membership</Text>
        <Text style={styles.subtitle}>Extend your membership before it expires</Text>

        {/* Plan Selector */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Choose Plan</Text>
          <View style={styles.planRow}>
            {PLANS.map((plan) => {
              const isSelected = selectedPlan.label === plan.label;
              return (
                <TouchableOpacity
                  key={plan.label}
                  style={[styles.planCard, isSelected && styles.planCardSelected]}
                  onPress={() => {
                    impactAsync(ImpactFeedbackStyle.Light);
                    setSelectedPlan(plan);
                  }}
                >
                  <Text style={styles.planLabel}>{plan.label}</Text>
                  <Text style={styles.planPrice}>₹{Math.round(plan.basePrice - plan.discount)}</Text>
                  {plan.discount > 0 && (
                    <Text style={styles.planDiscount}>Save ₹{Math.round(plan.discount)}</Text>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Pricing Breakdown */}
        <View style={styles.card}>
          <View style={styles.pricingRow}>
            <Text style={styles.pricingLabel}>Base Price</Text>
            <Text style={styles.pricingValue}>₹{Math.round(basePrice)}</Text>
          </View>
          <View style={styles.pricingRow}>
            <Text style={styles.pricingLabel}>Discount</Text>
            <Text style={styles.pricingValueDiscount}>-₹{Math.round(discount)}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.pricingRow}>
            <Text style={styles.pricingLabelFinal}>Final Amount</Text>
            <Text style={styles.pricingValueFinal}>₹{Math.round(finalAmount)}</Text>
          </View>
        </View>

        {/* Benefits */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Included Benefits</Text>
          {selectedPlan.benefits.map((benefit, i) => (
            <View key={i} style={styles.benefitRow}>
              <Text style={styles.benefitIcon}>✅</Text>
              <Text style={styles.benefitText}>{benefit}</Text>
            </View>
          ))}
        </View>

        {/* Terms */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Terms</Text>
          <Text style={styles.termText}>• Membership activates only after payment is verified by the provider.</Text>
          <Text style={styles.termText}>• Simulated payments until a real provider is connected. No card/UPI details stored.</Text>
          <Text style={styles.termText}>• No refunds once membership is activated, except as per provider policy.</Text>
          <Text style={styles.termText}>• Add-ons are never auto-selected. Cancel within terms for eligible refunds.</Text>
        </View>

        {/* Payment Action */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Secure Payment</Text>
          <TouchableOpacity
            style={[styles.payButton, { backgroundColor: getStateColor(paymentState.type), opacity: paymentState.type === 'pending' ? 0.7 : 1 }]}
            onPress={initiatePayment}
            disabled={paymentState.type === 'pending'}
          >
            {paymentState.type === 'pending' ? (
              <ActivityIndicator size="small" color="#000000" style={{ marginRight: 8 }} />
            ) : (
              <Text style={styles.payIcon}>🔒</Text>
            )}
            <Text style={styles.payText}>{getStateLabel(paymentState.type)}</Text>
          </TouchableOpacity>
          <Text style={styles.payHint}>UPI / Card / Wallet • ₹{Math.round(finalAmount)}</Text>
        </View>

        {/* Payment State Indicator */}
        {paymentState.type !== 'idle' && paymentState.type !== 'created' && (
          <View style={[styles.stateBox, { backgroundColor: `${getStateColor(paymentState.type)}22` }]}>
            <View style={styles.stateRow}>
              <Text style={[styles.stateDot, { color: getStateColor(paymentState.type) }]}>●</Text>
              <Text style={[styles.stateText, { color: getStateColor(paymentState.type) }]}>
                {paymentState.type === 'paid' ? `Receipt: ${paymentState.receiptId}` : paymentState.reason || getStateLabel(paymentState.type)}
              </Text>
            </View>
          </View>
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
    paddingBottom: 30,
  },
  scrollContent: {
    paddingTop: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000000',
  },
  title: {
    fontSize: 26,
    fontWeight: '900',
    color: '#FFFFFF',
    marginBottom: 8,
    letterSpacing: -1,
  },
  subtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.5)',
    marginBottom: 20,
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  planRow: {
    flexDirection: 'row',
    gap: 10,
  },
  planCard: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  planCardSelected: {
    backgroundColor: '#10B981',
    borderColor: '#10B981',
  },
  planLabel: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  planPrice: {
    fontSize: 12,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.7)',
    marginTop: 2,
  },
  planDiscount: {
    fontSize: 10,
    fontWeight: '600',
    color: '#10B981',
    marginTop: 4,
  },
  card: {
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  pricingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 4,
  },
  pricingLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.6)',
  },
  pricingValue: {
    fontSize: 14,
    fontWeight: '700',
    color: 'rgba(255,255,255,0.7)',
  },
  pricingValueDiscount: {
    fontSize: 14,
    fontWeight: '700',
    color: '#10B981',
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.2)',
    marginVertical: 8,
  },
  pricingLabelFinal: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  pricingValueFinal: {
    fontSize: 16,
    fontWeight: '800',
    color: '#10B981',
  },
  benefitRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  benefitIcon: {
    fontSize: 14,
    marginTop: 1,
    marginRight: 8,
  },
  benefitText: {
    fontSize: 13,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  termText: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.7)',
    marginBottom: 4,
  },
  payButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 16,
  },
  payIcon: {
    fontSize: 18,
    marginRight: 8,
  },
  payText: {
    fontSize: 17,
    fontWeight: '800',
    color: '#000000',
  },
  payHint: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.5)',
    marginTop: 6,
    textAlign: 'center',
  },
  stateBox: {
    padding: 12,
    borderRadius: 12,
    marginTop: 12,
  },
  stateRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stateDot: {
    fontSize: 10,
    marginRight: 8,
  },
  stateText: {
    fontSize: 13,
    fontWeight: '600',
  },
});

import { View, Text, StyleSheet, Animated, Easing, Dimensions } from 'react-native';
import React, { useEffect, useState, useRef, useCallback } from 'react';
import { impactAsync, ImpactFeedbackStyle } from 'expo-haptics';

const { width } = Dimensions.get('window');

interface DaysCounterProps {
  count: number;
  label?: string;
  accentColor?: string;
  showMilestonePulse?: boolean;
  style?: any;
}

const MILESTONES = [7, 14, 21, 30, 60, 90, 180, 365];

export const DaysCounter: React.FC<DaysCounterProps> = ({
  count,
  label = 'Days',
  accentColor = '#10B981',
  showMilestonePulse = true,
  style,
}) => {
  const [animatedCount, setAnimatedCount] = useState(count);
  const [isPulsing, setIsPulsing] = useState(false);
  const [prevCount, setPrevCount] = useState(count);
  const pulseAnim = useRef(new Animated.Value(1)).current;

  const milestoneAnim = useRef(new Animated.Value(0)).current;

  const isMilestone = useCallback((val: number) => MILESTONES.includes(val), []);

  useEffect(() => {
    setPrevCount(animatedCount);
    setAnimatedCount(count);

    if (showMilestonePulse && isMilestone(count) && count !== prevCount) {
      // Scale pulse
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.15,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1.0,
          duration: 150,
          useNativeDriver: true,
        }),
      ]).start();

      // Haptic success
      impactAsync(ImpactFeedbackStyle.Heavy);
    } else if (count !== prevCount) {
      impactAsync(ImpactFeedbackStyle.Light);
    }
  }, [count, showMilestonePulse, isMilestone, prevCount, pulseAnim]);

  useEffect(() => {
    if (animatedCount === count) return;

    Animated.timing(milestoneAnim, {
      toValue: 1,
      duration: 400,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start(() => {
      milestoneAnim.setValue(0);
    });
  }, [count, milestoneAnim]);

  const countInterpolate = milestoneAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [animatedCount, prevCount, count],
  });

  return (
    <View style={[styles.container, style]}>
      <Animated.View style={styles.counterWrapper}>
        <Animated.Text
          style={[
            styles.countText,
            {
              color: '#FFFFFF',
              transform: [{ scale: pulseAnim }],
            },
          ]}
        >
          {Math.round(animatedCount)}
        </Animated.Text>
      </Animated.View>

      <Text style={[styles.labelText, { color: 'rgba(255,255,255,0.7)' }]}>
        {label.toUpperCase()}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
  },
  counterWrapper: {
    minHeight: 60,
    justifyContent: 'center',
  },
  countText: {
    fontSize: 48,
    fontWeight: '900',
    fontFamily: 'system-ui',
    letterSpacing: -1,
  },
  labelText: {
    fontSize: 13,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginTop: 6,
  },
});

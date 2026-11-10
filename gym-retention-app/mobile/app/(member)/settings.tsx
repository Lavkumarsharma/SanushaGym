import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch } from 'react-native';
import React, { useState } from 'react';
import { supabase, updateCommunicationPrefs } from '@/services/supabase';
import { Haptics } from 'expo-haptics';

export default function SettingsScreen() {
  const [prefs, setPrefs] = useState({
    push: true,
    sms: true,
    email: true,
    whatsapp: true,
    marketing: true,
  });

  const savePrefs = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      await updateCommunicationPrefs(user.id, {
        communication_opt_in: prefs.marketing,
        whatsapp_opt_in: prefs.whatsapp,
        email_opt_in: prefs.email,
        sms_opt_in: prefs.sms,
        push_opt_in: prefs.push,
      });
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Success);
    } catch (err: any) {
      console.error(err);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Settings</Text>

        {/* Account */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          <SettingsRow
            icon="👤"
            title="Profile"
            subtitle="Update your details"
            onPress={() => {}}
          />
          <SettingsRow
            icon="📱"
            title="Mobile Number"
            subtitle="+91 98765 43210"
            onPress={() => {}}
          />
          <SettingsRow
            icon="✉️"
            title="Email"
            subtitle="rajesh@example.com"
            onPress={() => {}}
          />
        </View>

        {/* Communication Preferences */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Communication Preferences</Text>
          <ToggleRow
            icon="📲"
            title="Push Notifications"
            value={prefs.push}
            onChange={(v) => setPrefs({ ...prefs, push: v })}
          />
          <ToggleRow
            icon="💬"
            title="SMS Alerts"
            value={prefs.sms}
            onChange={(v) => setPrefs({ ...prefs, sms: v })}
          />
          <ToggleRow
            icon="✉️"
            title="Email Updates"
            value={prefs.email}
            onChange={(v) => setPrefs({ ...prefs, email: v })}
          />
          <ToggleRow
            icon="💬"
            title="WhatsApp Messages"
            value={prefs.whatsapp}
            onChange={(v) => setPrefs({ ...prefs, whatsapp: v })}
          />

          <View style={styles.marketingBox}>
            <ToggleRow
              icon="📢"
              title="Marketing Communications"
              subtitle="Offers, add-ons, and promotions from FitLocal Gym"
              value={prefs.marketing}
              onChange={(v) => setPrefs({ ...prefs, marketing: v })}
            />
            <Text style={styles.marketingNote}>
              You can opt out anytime. We never sell your data. Marketing consent is separate from service alerts.
            </Text>
          </View>
        </View>

        {/* App Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>App Settings</Text>
          <SettingsRow
            icon="🌐"
            title="Language"
            subtitle="English / Hinglish"
            onPress={() => {}}
          />
          <SettingsRow
            icon="🔐"
            title="Biometric Auth"
            subtitle="Secure app access"
            onPress={() => {}}
          />
        </View>

        {/* Support & Safety */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Support & Safety</Text>
          <SettingsRow
            icon="🛡️"
            title="Privacy Policy"
            subtitle="How we protect your data"
            onPress={() => {}}
          />
          <SettingsRow
            icon="💬"
            title="Support"
            subtitle="Chat with front desk"
            onPress={() => {}}
          />
          <SettingsRow
            icon="🚪"
            title="Logout"
            subtitle="Sign out of your account"
            onPress={() => {}}
            danger
          />
        </View>

        <TouchableOpacity style={styles.saveBtn} onPress={savePrefs}>
          <Text style={styles.saveBtnText}>Save Preferences</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

interface SettingsRowProps {
  icon: string;
  title: string;
  subtitle?: string;
  onPress: () => void;
  danger?: boolean;
}

const SettingsRow: React.FC<SettingsRowProps> = ({ icon, title, subtitle, onPress, danger }) => (
  <TouchableOpacity style={[styles.row, danger && styles.rowDanger]} onPress={onPress}>
    <Text style={styles.rowIcon}>{icon}</Text>
    <View style={styles.rowText}>
      <Text style={[styles.rowTitle, danger && styles.rowTitleDanger]}>{title}</Text>
      {subtitle && <Text style={styles.rowSubtitle}>{subtitle}</Text>}
    </View>
    <Text style={styles.rowChevron}>›</Text>
  </TouchableOpacity>
);

interface ToggleRowProps {
  icon: string;
  title: string;
  subtitle?: string;
  value: boolean;
  onChange: (v: boolean) => void;
}

const ToggleRow: React.FC<ToggleRowProps> = ({ icon, title, subtitle, value, onChange }) => (
  <View style={styles.toggleRow}>
    <View style={styles.toggleContent}>
      <Text style={styles.toggleIcon}>{icon}</Text>
      <View style={styles.toggleText}>
        <Text style={styles.toggleTitle}>{title}</Text>
        {subtitle && <Text style={styles.toggleSubtitle}>{subtitle}</Text>}
      </View>
    </View>
    <Switch
      value={value}
      onValueChange={onChange}
      trackColor={{ false: 'rgba(255,255,255,0.2)', true: '#10B981' }}
      thumbColor={value ? '#10B981' : '#FFFFFF'}
      ios_backgroundColor="#333333"
    />
  </View>
);

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
  title: {
    fontSize: 26,
    fontWeight: '900',
    color: '#FFFFFF',
    marginBottom: 20,
    letterSpacing: -1,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: 'rgba(255,255,255,0.8)',
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 14,
    marginBottom: 8,
  },
  rowDanger: {
    backgroundColor: 'rgba(239,68,68,0.1)',
  },
  rowIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  rowText: {
    flex: 1,
  },
  rowTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  rowTitleDanger: {
    color: '#EF4444',
  },
  rowSubtitle: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.5)',
    marginTop: 2,
  },
  rowChevron: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.3)',
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 14,
    marginBottom: 8,
  },
  toggleContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  toggleIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  toggleText: {
    flex: 1,
  },
  toggleTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  toggleSubtitle: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.5)',
    marginTop: 2,
  },
  marketingBox: {
    backgroundColor: 'rgba(16,185,129,0.05)',
    borderRadius: 14,
    padding: 14,
    marginTop: 8,
  },
  marketingNote: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.5)',
    marginTop: 8,
    lineHeight: 16,
  },
  saveBtn: {
    backgroundColor: '#10B981',
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 20,
  },
  saveBtnText: {
    color: '#000000',
    fontSize: 16,
    fontWeight: '800',
  },
});

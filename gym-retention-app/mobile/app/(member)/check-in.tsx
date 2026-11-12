import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, TextInput } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Camera } from 'expo-camera';
import { useRouter } from 'expo-router';
import { supabase, recordAttendance } from '@/services/supabase';
import { useSocket } from '@/services/socket';
import { impactAsync, ImpactFeedbackStyle } from 'expo-haptics';

export default function CheckInScreen() {
  const router = useRouter();
  const { socket } = useSocket();
  const [cameraRef, setCameraRef] = useState<any>(null);
  const [isScanning, setIsScanning] = useState(true);
  const [scannedQR, setScannedQR] = useState('');
  const [result, setResult] = useState<{
    type: 'success' | 'duplicate' | 'invalid' | 'expired' | 'offline';
    message: string;
  } | null>(null);
  const [showingResult, setShowingResult] = useState(false);
  const [manualEntry, setManualEntry] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      simulateScan();
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  const simulateScan = async () => {
    if (!isScanning) return;

    const qrCode = `GYM-${Math.floor(Math.random() * 9000 + 1000)}-${Math.floor(Math.random() * 900 + 100)}`;
    setScannedQR(qrCode);

    // Simulate validation (weighted toward success)
    const roll = Math.random();
    let type: 'success' | 'duplicate' | 'invalid' | 'expired' | 'offline';
    if (roll < 0.6) type = 'success';
    else if (roll < 0.75) type = 'duplicate';
    else if (roll < 0.85) type = 'invalid';
    else if (roll < 0.92) type = 'expired';
    else type = 'offline';

    const messages: Record<string, string> = {
      success: 'Attendance recorded. Streak updated!',
      duplicate: 'Already checked in within 10 minutes.',
      invalid: 'Please scan a valid session-bound QR.',
      expired: 'Membership expired. Please renew first.',
      offline: 'Offline. Will sync when back online.',
    };

    setResult({ type, message: messages[type] });
    setIsScanning(false);
    setShowingResult(true);

    if (type === 'success') {
      // Get current member and record attendance
      const { data: member } = await supabase.auth.getUser();
      if (member.user) {
        await recordAttendance(member.user.id, qrCode, 'qr');
        socket?.emit('attendance:updated', { memberId: member.user.id, qrCode, type: 'success' });
        impactAsync(ImpactFeedbackStyle.Heavy);
      }
    } else {
      impactAsync(ImpactFeedbackStyle.Heavy);
    }

    // Auto dismiss and restart
    setTimeout(() => {
      setShowingResult(false);
      setResult(null);
      setIsScanning(true);
      setTimeout(() => simulateScan(), 2000);
    }, 4000);
  };

  const toggleScanning = () => {
    setIsScanning((prev) => {
      if (!prev) {
        setTimeout(() => simulateScan(), 2000);
      }
      return !prev;
    });
  };

  const processManualEntry = () => {
    if (!manualEntry) return;
    setScannedQR(manualEntry);
    setResult({ type: 'success', message: 'Attendance recorded via manual entry.' });
    setShowingResult(true);
    impactAsync(ImpactFeedbackStyle.Heavy);
    setManualEntry('');
  };

  if (showingResult && result) {
    return (
      <View style={styles.resultOverlay}>
        <View style={styles.resultCard}>
          <View style={[styles.iconBox, { backgroundColor: result.type === 'success' ? 'rgba(16,185,129,0.2)' : 'rgba(239,68,68,0.2)' }]}>
            <Text style={styles.icon}>
              {result.type === 'success' ? '✅' : result.type === 'duplicate' ? '⚠️' : result.type === 'invalid' ? '❌' : result.type === 'expired' ? '⏰' : '📴'}
            </Text>
          </View>
          <Text style={styles.resultTitle}>
            {result.type === 'success' ? 'Check-In Successful' : result.type === 'duplicate' ? 'Duplicate Scan' : result.type === 'invalid' ? 'Invalid QR' : result.type === 'expired' ? 'Membership Expired' : 'Offline Mode'}
          </Text>
          <Text style={styles.resultMessage}>{result.message}</Text>
          <TouchableOpacity style={styles.dismissBtn} onPress={() => setShowingResult(false)}>
            <Text style={styles.dismissText}>Got it</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.scannerBox}>
        <Camera style={styles.camera} ref={setCameraRef} />
        <View style={styles.scannerFrame} />
        <View style={styles.scanLine} />
        <View style={styles.scanHint}>
          <Text style={styles.scanHintText}>Position QR code inside the frame</Text>
        </View>
      </View>

      <View style={styles.statusBar}>
        <View style={styles.statusLeft}>
          <Text style={styles.statusLabel}>Session QR</Text>
          <Text style={styles.qrCode}>{scannedQR || 'Waiting to scan…'}</Text>
        </View>
        <TouchableOpacity style={styles.toggleBtn} onPress={toggleScanning}>
          <Text style={styles.toggleText}>{isScanning ? '⏹' : '▶️'}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.hintText}>
        QR rotates every 10 minutes • Valid only for current session
      </View>

      <View style={styles.manualEntry}>
        <Text style={styles.fieldLabel}>Manual Entry (Front Desk)</Text>
        <View style={styles.inputRow}>
          <TextInput
            style={styles.manualInput}
            value={manualEntry}
            onChangeText={setManualEntry}
            placeholder="Enter QR code"
            keyboardType="numeric"
          />
          <TouchableOpacity style={styles.verifyBtn} onPress={processManualEntry}>
            <Text style={styles.verifyText}>Verify</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  scannerBox: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  camera: {
    flex: 1,
  },
  scannerFrame: {
    width: 280,
    height: 280,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(16,185,129,0.3)',
  },
  scanLine: {
    position: 'absolute',
    width: 240,
    height: 3,
    backgroundColor: '#10B981',
    top: 40,
    alignSelf: 'center',
  },
  scanHint: {
    position: 'absolute',
    bottom: 80,
    alignItems: 'center',
  },
  scanHintText: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.6)',
    fontWeight: '600',
  },
  statusBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderRadius: 16,
    marginHorizontal: 20,
    marginBottom: 20,
  },
  statusLeft: {
    flex: 1,
  },
  statusLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: 'rgba(255,255,255,0.6)',
  },
  qrCode: {
    fontSize: 16,
    fontWeight: '800',
    color: '#10B981',
    fontFamily: 'monospace',
    marginTop: 4,
  },
  toggleBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(16,185,129,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  toggleText: {
    fontSize: 20,
    color: '#10B981',
  },
  hintText: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.4)',
    textAlign: 'center',
    marginHorizontal: 20,
  },
  manualEntry: {
    marginHorizontal: 20,
    marginBottom: 20,
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: 'rgba(255,255,255,0.8)',
    marginBottom: 8,
  },
  inputRow: {
    flexDirection: 'row',
    gap: 10,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    overflow: 'hidden',
  },
  manualInput: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 14,
  },
  verifyBtn: {
    backgroundColor: '#10B981',
    paddingHorizontal: 16,
    paddingVertical: 14,
    alignItems: 'center',
  },
  verifyText: {
    color: '#000000',
    fontWeight: '800',
    fontSize: 14,
  },
  resultOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 100,
  },
  resultCard: {
    width: '85%',
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  iconBox: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  icon: {
    fontSize: 28,
  },
  resultTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#000000',
    marginBottom: 8,
  },
  resultMessage: {
    fontSize: 14,
    color: 'rgba(0,0,0,0.7)',
    textAlign: 'center',
    marginBottom: 20,
  },
  dismissBtn: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 12,
  },
  dismissText: {
    color: '#000000',
    fontWeight: '800',
    fontSize: 16,
  },
});

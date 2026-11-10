import axios from 'axios';
import { io, Socket } from 'socket.io-client';

const API_URL = process.env.EXPO_PUBLIC_API_URL!;
const SOCKET_URL = process.env.EXPO_PUBLIC_SOCKET_URL!;

// REST API client
export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Socket.io client (singleton)
let socketInstance: Socket | null = null;

export const getSocket = (): Socket | null => {
  return socketInstance;
};

export const connectSocket = (token?: string): Socket => {
  if (!socketInstance) {
    socketInstance = io(SOCKET_URL, {
      transports: ['websocket', 'polling'],
      autoConnect: true,
      ...(token ? { auth: { token } } : {}),
    });
  }
  return socketInstance;
};

export const disconnectSocket = (): void => {
  if (socketInstance) {
    socketInstance.disconnect();
    socketInstance = null;
  }
};

// ============================================
// MEMBER APIs
// ============================================

export const getCurrentMember = async () => {
  const response = await api.get('/api/members/me');
  return response.data;
};

export const getMembership = async (memberId: string) => {
  const response = await api.get(`/api/members/${memberId}/membership`);
  return response.data;
};

export const getAttendanceHistory = async (memberId: string) => {
  const response = await api.get(`/api/members/${memberId}/attendance`);
  return response.data;
};

export const getAddOns = async () => {
  const response = await api.get('/api/add-ons');
  return response.data;
};

export const getPlans = async () => {
  const response = await api.get('/api/plans');
  return response.data;
};

// ============================================
// PAYMENT APIs
// ============================================

export const createPayment = async (memberId: string, amount: number, planType: string) => {
  const response = await api.post('/api/payments', {
    member_id: memberId,
    amount,
    plan_type: planType,
  });
  return response.data;
};

export const verifyPayment = async (paymentId: string) => {
  const response = await api.post(`/api/payments/${paymentId}/verify`);
  return response.data;
};

// ============================================
// ATTENDANCE APIs
// ============================================

export const recordAttendance = async (memberId: string, qrSessionId: string, source: string = 'qr') => {
  const response = await api.post('/api/attendance', {
    member_id: memberId,
    qr_session_id: qrSessionId,
    source,
  });
  return response.data;
};

// ============================================
// EMAIL APIs (via Resend)
// ============================================

export const sendEmail = async (to: string, subject: string, html: string) => {
  const response = await api.post('/api/email/send', { to, subject, html });
  return response.data;
};

// ============================================
// RED LIST APIs
// ============================================

export const getRedList = async () => {
  const response = await api.get('/api/red-list');
  return response.data;
};

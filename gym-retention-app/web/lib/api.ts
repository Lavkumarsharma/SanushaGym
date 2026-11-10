import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL!;

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ============================================
// DASHBOARD APIs
// ============================================

export const getDashboardStats = async () => {
  const response = await api.get('/api/dashboard/stats');
  return response.data;
};

export const getRedList = async () => {
  const response = await api.get('/api/red-list');
  return response.data;
};

export const getFollowUps = async () => {
  const response = await api.get('/api/follow-ups');
  return response.data;
};

export const getRenewals = async () => {
  const response = await api.get('/api/renewals');
  return response.data;
};

export const getAddOns = async () => {
  const response = await api.get('/api/add-ons');
  return response.data;
};

export const getMembers = async () => {
  const response = await api.get('/api/members');
  return response.data;
};

export const getPayments = async () => {
  const response = await api.get('/api/payments');
  return response.data;
};

// ============================================
// MEMBER APIs
// ============================================

export const getMember = async (memberId: string) => {
  const response = await api.get(`/api/members/${memberId}`);
  return response.data;
};

export const updateMember = async (memberId: string, data: any) => {
  const response = await api.put(`/api/members/${memberId}`, data);
  return response.data;
};

// ============================================
// PAYMENT APIs
// ============================================

export const verifyPayment = async (paymentId: string) => {
  const response = await api.post(`/api/payments/${paymentId}/verify`);
  return response.data;
};

export const refundPayment = async (paymentId: string) => {
  const response = await api.post(`/api/payments/${paymentId}/refund`);
  return response.data;
};

// ============================================
// EMAIL APIs
// ============================================

export const sendEmail = async (to: string, subject: string, html: string) => {
  const response = await api.post('/api/email/send', { to, subject, html });
  return response.data;
};

// ============================================
// AUTOMATION APIs
// ============================================

export const runNoShowScan = async () => {
  const response = await api.post('/api/automation/no-show-scan');
  return response.data;
};

export const runRenewalReminders = async () => {
  const response = await api.post('/api/automation/renewal-reminders');
  return response.data;
};

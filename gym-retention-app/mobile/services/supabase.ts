import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/database';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

// Auth helpers
export const signInWithPhone = async (phone: string) => {
  const { data, error } = await supabase.auth.signInWithOtp({
    phone,
    options: {
      channel: 'sms',
    },
  });
  return { data, error };
};

export const verifyOtp = async (phone: string, token: string) => {
  const { data, error } = await supabase.auth.verifyOtp({
    phone,
    token,
    type: 'sms',
  });
  return { data, error };
};

export const getCurrentMember = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from('members')
    .select('*')
    .eq('phone', user.phone ?? user.email ?? '')
    .single();

  return { data, error };
};

export const getMemberProfile = async (memberId: string) => {
  const { data, error } = await supabase
    .from('members')
    .select('*')
    .eq('id', memberId)
    .single();

  return { data, error };
};

export const recordAttendance = async (memberId: string, qrSessionId: string, source: string = 'qr') => {
  const { data, error } = await supabase
    .from('attendance')
    .insert({
      member_id: memberId,
      qr_session_id: qrSessionId,
      source,
    })
    .select()
    .single();

  return { data, error };
};

export const getAttendanceHistory = async (memberId: string) => {
  const { data, error } = await supabase
    .from('attendance')
    .select('*')
    .eq('member_id', memberId)
    .order('check_in_time', { ascending: false });

  return { data, error };
};

export const getMembership = async (memberId: string) => {
  const { data, error } = await supabase
    .from('memberships')
    .select('*')
    .eq('member_id', memberId)
    .eq('is_active', true)
    .single();

  return { data, error };
};

export const createPayment = async (memberId: string, amount: number, planType: string) => {
  const orderId = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  const { data, error } = await supabase
    .from('payments')
    .insert({
      member_id: memberId,
      order_id: orderId,
      amount,
      status: 'created',
      provider: 'simulated',
    })
    .select()
    .single();

  return { data, error, orderId };
};

export const verifyPayment = async (paymentId: string) => {
  const { data, error } = await supabase
    .from('payments')
    .update({ status: 'paid', paid_at: new Date().toISOString() })
    .eq('id', paymentId)
    .select()
    .single();

  return { data, error };
};

export const getAddOns = async () => {
  const { data, error } = await supabase
    .from('add_ons')
    .select('*')
    .eq('is_available', true);

  return { data, error };
};

export const getPlans = async () => {
  const { data, error } = await supabase
    .from('plans')
    .select('*');

  return { data, error };
};

export const updateCommunicationPrefs = async (
  memberId: string,
  prefs: {
    communication_opt_in?: boolean;
    whatsapp_opt_in?: boolean;
    email_opt_in?: boolean;
    sms_opt_in?: boolean;
    push_opt_in?: boolean;
  }
) => {
  const { data, error } = await supabase
    .from('members')
    .update({ ...prefs, updated_at: new Date().toISOString() })
    .eq('id', memberId)
    .select()
    .single();

  return { data, error };
};

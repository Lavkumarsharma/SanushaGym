-- Gym Retention App - Supabase Schema
-- Enable extensions
create extension if not exists "uuid-ossp";

-- ============================================
-- 1. MEMBERS
-- ============================================
create table members (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  phone text not null unique,
  email text,
  join_date timestamptz default now(),
  current_streak integer default 0,
  total_check_ins integer default 0,
  communication_opt_in boolean default true,
  whatsapp_opt_in boolean default true,
  email_opt_in boolean default true,
  sms_opt_in boolean default true,
  push_opt_in boolean default true,
  language text default 'English/Hinglish',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ============================================
-- 2. PLANS
-- ============================================
create table plans (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  type text check (type in ('monthly', 'quarterly', 'half-yearly', 'yearly')),
  base_price numeric(10,2) not null,
  duration_days integer not null,
  benefits text[],
  created_at timestamptz default now()
);

-- ============================================
-- 3. MEMBERSHIPS
-- ============================================
create table memberships (
  id uuid primary key default uuid_generate_v4(),
  member_id uuid references members(id) on delete cascade,
  plan_id uuid references plans(id),
  plan_name text not null,
  plan_type text,
  start_date timestamptz not null,
  expiry_date timestamptz not null,
  base_price numeric(10,2) not null,
  discount numeric(10,2) default 0,
  final_amount numeric(10,2) not null,
  is_active boolean default true,
  auto_renew boolean default false,
  pause_until timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ============================================
-- 4. ATTENDANCE
-- ============================================
create table attendance (
  id uuid primary key default uuid_generate_v4(),
  member_id uuid references members(id) on delete cascade,
  check_in_time timestamptz default now(),
  check_out_time timestamptz,
  qr_session_id text not null,
  source text check (source in ('qr', 'assisted', 'offline')),
  reason text,
  recorded_by uuid references staff(id),
  synced boolean default false,
  created_at timestamptz default now()
);

-- ============================================
-- 5. STREAKS
-- ============================================
create table streaks (
  id uuid primary key default uuid_generate_v4(),
  member_id uuid references members(id) on delete cascade,
  streak_type text check (streak_type in ('planned_visit', 'weekly_goal')),
  current_streak integer default 0,
  longest_streak integer default 0,
  last_visit_date date,
  rest_days_used integer default 0,
  approved_pauses integer default 0,
  updated_at timestamptz default now()
);

-- ============================================
-- 6. NOSHOW CASES
-- ============================================
create table no_show_cases (
  id uuid primary key default uuid_generate_v4(),
  member_id uuid references members(id) on delete cascade,
  opened_at timestamptz default now(),
  threshold_crossed_days integer default 10,
  is_resolved boolean default false,
  resolved_at timestamptz,
  resolved_by uuid references staff(id)
);

-- ============================================
-- 7. FOLLOW UPS
-- ============================================
create table follow_ups (
  id uuid primary key default uuid_generate_v4(),
  member_id uuid references members(id) on delete cascade,
  outcome text check (outcome in ('will_return', 'injured', 'travelling', 'timing_issue', 'unhappy', 'no_response', 'cancelled')),
  next_action_date timestamptz,
  notes text,
  created_by uuid references staff(id),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ============================================
-- 8. PAYMENTS
-- ============================================
create table payments (
  id uuid primary key default uuid_generate_v4(),
  member_id uuid references members(id) on delete cascade,
  order_id text not null unique,
  amount numeric(10,2) not null,
  status text check (status in ('created', 'pending', 'paid', 'failed', 'refunded', 'reversed')),
  provider text default 'simulated',
  paid_at timestamptz,
  receipt_url text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ============================================
-- 9. RENEWAL ORDERS
-- ============================================
create table renewal_orders (
  id uuid primary key default uuid_generate_v4(),
  member_id uuid references members(id) on delete cascade,
  plan_type text,
  duration_months integer,
  base_price numeric(10,2),
  discount numeric(10,2),
  final_amount numeric(10,2),
  payment_id uuid references payments(id),
  status text default 'pending',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ============================================
-- 10. ADD ONS
-- ============================================
create table add_ons (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  type text check (type in ('personal-training', 'diet-plan', 'supplement')),
  price numeric(10,2) not null,
  validity_days integer not null,
  stock integer,
  trainer_name text,
  trainer_qualification text,
  cancellation_terms text,
  is_available boolean default true,
  created_at timestamptz default now()
);

-- ============================================
-- 11. ADD ON ORDERS
-- ============================================
create table add_on_orders (
  id uuid primary key default uuid_generate_v4(),
  member_id uuid references members(id) on delete cascade,
  add_on_id uuid references add_ons(id),
  quantity integer default 1,
  total_price numeric(10,2) not null,
  status text default 'pending',
  created_at timestamptz default now(),
  fulfilled_at timestamptz
);

-- ============================================
-- 12. NOTIFICATIONS
-- ============================================
create table notifications (
  id uuid primary key default uuid_generate_v4(),
  member_id uuid references members(id) on delete cascade,
  type text check (type in ('renewal_reminder', 'payment_success', 'payment_failed', 'check_in', 'add_on_promo', 'follow_up')),
  title text not null,
  message text not null,
  channel text check (channel in ('push', 'sms', 'email', 'whatsapp')),
  sent_at timestamptz,
  read_at timestamptz,
  created_at timestamptz default now()
);

-- ============================================
-- 13. SETTINGS
-- ============================================
create table settings (
  id uuid primary key default uuid_generate_v4(),
  key text not null unique,
  value text not null,
  description text,
  updated_at timestamptz default now()
);

-- ============================================
-- 14. STAFF
-- ============================================
create table staff (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  phone text not null unique,
  role text check (role in ('owner', 'manager', 'front-desk')),
  is_active boolean default true,
  created_at timestamptz default now()
);

-- ============================================
-- 15. AUDIT LOGS
-- ============================================
create table audit_logs (
  id uuid primary key default uuid_generate_v4(),
  actor_id uuid references staff(id),
  actor_type text check (actor_type in ('staff', 'member', 'system')),
  action text not null,
  table_name text,
  record_id uuid,
  old_values jsonb,
  new_values jsonb,
  created_at timestamptz default now()
);

-- ============================================
-- INDEXES
-- ============================================
create index idx_members_phone on members(phone);
create index idx_memberships_member on memberships(member_id);
create index idx_memberships_expiry on memberships(expiry_date);
create index idx_attendance_member on attendance(member_id);
create index idx_attendance_checkin on attendance(check_in_time);
create index idx_noshow_resolved on no_show_cases(is_resolved);
create index idx_followups_member on follow_ups(member_id);
create index idx_payments_member on payments(member_id);
create index idx_payments_status on payments(status);
create index idx_renewal_orders_member on renewal_orders(member_id);
create index idx_addon_orders_member on add_on_orders(member_id);
create index idx_notifications_member on notifications(member_id);
create index idx_audit_logs_actor on audit_logs(actor_id, actor_type);

-- ============================================
-- SAMPLE DATA: PLANS
-- ============================================
insert into plans (name, type, base_price, duration_days, benefits) values
('Gym Unlimited', 'monthly', 1499, 30, ARRAY['Gym access', '1 guest pass/month']),
('Fitness Pro', 'quarterly', 3999, 90, ARRAY['Gym access', '2 guest passes/month', '1 free PT session']),
('Strength+', 'half-yearly', 6999, 180, ARRAY['Gym access', '3 guest passes/month', '2 free PT sessions']),
('Elite Year', 'yearly', 12499, 365, ARRAY['Gym access', '4 guest passes/month', '3 free PT sessions', 'Free diet plan']);

-- ============================================
-- SAMPLE DATA: ADD ONS
-- ============================================
insert into add_ons (name, type, price, validity_days, stock, trainer_name, trainer_qualification, cancellation_terms) values
('Personal Training - 8 Sessions', 'personal-training', 4999, 30, null, 'Arjun Patel', 'NASM-CPT, ACE', '7-day notice, refund for unused sessions'),
('Custom Diet Plan', 'diet-plan', 2499, 30, null, 'Neha Sharma', 'ISSN Sports Nutritionist', 'Non-refundable once generated'),
('Whey Protein 1kg', 'supplement', 2999, 60, 12, null, null, 'Unopened only, 48-hour window'),
('Pre-Workout 30 Servings', 'supplement', 1499, 90, 3, null, null, 'Unopened only, 48-hour window');

-- ============================================
-- SAMPLE DATA: STAFF
-- ============================================
insert into staff (name, phone, role) values
('Suresh Rao', '+919000000001', 'owner'),
('Priya Mehta', '+919000000002', 'manager'),
('Amit Singh', '+919000000003', 'front-desk');

-- ============================================
-- SAMPLE DATA: SETTINGS
-- ============================================
insert into settings (key, value, description) values
('no_show_threshold_days', '10', 'Days absent before opening no-show case'),
('renewal_reminder_days', '14,7,3,0', 'Renewal reminder windows'),
('duplicate_scan_window_minutes', '10', 'Window to prevent duplicate QR scans'),
('qr_session_validity_minutes', '10', 'QR session validity');

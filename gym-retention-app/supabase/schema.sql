-- ============================================
-- Gym Retention App - Supabase Schema
-- Run this in Supabase SQL Editor
-- ============================================

-- Enable extensions
create extension if not exists "uuid-ossp";

-- ============================================
-- 1. STAFF (Owners, Managers, Front Desk)
-- ============================================
create table staff (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  phone text not null unique,
  role text check (role in ('owner', 'manager', 'front-desk')) default 'front-desk',
  is_active boolean default true,
  created_at timestamptz default now()
);

-- ============================================
-- 2. MEMBERS
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
-- 3. PLANS
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
-- 4. MEMBERSHIPS
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
-- 5. ATTENDANCE
-- ============================================
create table attendance (
  id uuid primary key default uuid_generate_v4(),
  member_id uuid references members(id) on delete cascade,
  check_in_time timestamptz default now(),
  check_out_time timestamptz,
  qr_session_id text not null,
  source text check (source in ('qr', 'assisted', 'offline')) default 'qr',
  reason text,
  recorded_by uuid references staff(id),
  synced boolean default false,
  created_at timestamptz default now()
);

-- ============================================
-- 6. STREAKS
-- ============================================
create table streaks (
  id uuid primary key default uuid_generate_v4(),
  member_id uuid references members(id) on delete cascade,
  streak_type text check (streak_type in ('planned_visit', 'weekly_goal')) default 'weekly_goal',
  current_streak integer default 0,
  longest_streak integer default 0,
  last_visit_date date,
  rest_days_used integer default 0,
  approved_pauses integer default 0,
  updated_at timestamptz default now()
);

-- ============================================
-- 7. NOSHOW CASES
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
-- 8. FOLLOW UPS
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
-- 9. PAYMENTS
-- ============================================
create table payments (
  id uuid primary key default uuid_generate_v4(),
  member_id uuid references members(id) on delete cascade,
  order_id text not null unique,
  amount numeric(10,2) not null,
  status text check (status in ('created', 'pending', 'paid', 'failed', 'refunded', 'reversed')) default 'created',
  provider text default 'simulated',
  paid_at timestamptz,
  receipt_url text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ============================================
-- 10. RENEWAL ORDERS
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
-- 11. ADD ONS
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
-- 12. ADD ON ORDERS
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
-- 13. NOTIFICATIONS
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
-- 14. SETTINGS
-- ============================================
create table settings (
  id uuid primary key default uuid_generate_v4(),
  key text not null unique,
  value text not null,
  description text,
  updated_at timestamptz default now()
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
-- SAMPLE DATA: STAFF
-- ============================================
insert into staff (name, phone, role) values
('Suresh Rao', '+919000000001', 'owner'),
('Priya Mehta', '+919000000002', 'manager'),
('Amit Singh', '+919000000003', 'front-desk');

-- ============================================
-- SAMPLE DATA: PLANS
-- ============================================
insert into plans (name, type, base_price, duration_days, benefits) values
('Gym Unlimited', 'monthly', 1499, 30, ARRAY['Gym access', '1 guest pass/month']),
('Fitness Pro', 'quarterly', 3999, 90, ARRAY['Gym access', '2 guest passes/month', '1 free PT session']),
('Strength+', 'half-yearly', 6999, 180, ARRAY['Gym access', '3 guest passes/month', '2 free PT sessions']),
('Elite Year', 'yearly', 12499, 365, ARRAY['Gym access', '4 guest passes/month', '3 free PT sessions', 'Free diet plan']);

-- ============================================
-- SAMPLE DATA: MEMBERS (30 members with Indian names)
-- ============================================
insert into members (name, phone, email, join_date, current_streak, total_check_ins, communication_opt_in, whatsapp_opt_in) values
('Aarav Sharma', '+91 98765 43210', 'aarav.sharma@example.com', now() - interval '45 days', 23, 67, true, true),
('Vihaan Singh', '+91 98765 43211', 'vihaan.singh@example.com', now() - interval '120 days', 15, 45, true, true),
('Kabir Mehta', '+91 98765 43212', 'kabir.mehta@example.com', now() - interval '200 days', 8, 32, false, true),
('Ishaan Reddy', '+91 98765 43213', 'ishaan.reddy@example.com', now() - interval '60 days', 12, 54, true, false),
('Reyansh Gupta', '+91 98765 43214', 'reyansh.gupta@example.com', now() - interval '180 days', 5, 28, true, true),
('Aryan Yadav', '+91 98765 43215', 'aryan.yadav@example.com', now() - interval '90 days', 20, 78, true, true),
('Saanvi Joshi', '+91 98765 43216', 'saanvi.joshi@example.com', now() - interval '150 days', 3, 22, false, false),
('Ananya Rao', '+91 98765 43217', 'ananya.rao@example.com', now() - interval '30 days', 10, 34, true, true),
('Diya Menon', '+91 98765 43218', 'diya.menon@example.com', now() - interval '210 days', 0, 15, true, false),
('Myra Desai', '+91 98765 43219', 'myra.desi@example.com', now() - interval '75 days', 18, 52, true, true),
('Kavya Iyer', '+91 98765 43220', 'kavya.iyer@example.com', now() - interval '100 days', 6, 31, false, true),
('Aditi Khan', '+91 98765 43221', 'aditi.khan@example.com', now() - interval '160 days', 9, 41, true, true),
('Rohan Verma', '+91 98765 43222', 'rohan.verma@example.com', now() - interval '50 days', 14, 48, true, false),
('Karthik Nair', '+91 98765 43223', 'karthik.nair@example.com', now() - interval '190 days', 2, 18, false, false),
('Siddharth Das', '+91 98765 43224', 'siddharth.das@example.com', now() - interval '25 days', 25, 89, true, true),
('Arjun Malhotra', '+91 98765 43225', 'arjun.malhotra@example.com', now() - interval '110 days', 7, 35, true, false),
('Vikram Joshi', '+91 98765 43226', 'vikram.joshi@example.com', now() - interval '170 days', 4, 24, false, true),
('Rajesh Kumar', '+91 98765 43227', 'rajesh.kumar@example.com', now() - interval '45 days', 23, 67, true, true),
('Sunita Devi', '+91 98765 43228', 'sunita.devi@example.com', now() - interval '130 days', 5, 29, true, true),
('Manoj Bhai', '+91 98765 43229', 'manoj.bhai@example.com', now() - interval '220 days', 0, 12, true, false),
('Pooja Agarwal', '+91 98765 43230', 'pooja.agarwal@example.com', now() - interval '80 days', 16, 44, true, true),
('Rahul Sharma', '+91 98765 43231', 'rahul.sharma@example.com', now() - interval '140 days', 3, 21, false, false),
('Kiran Bala', '+91 98765 43232', 'kiran.bala@example.com', now() - interval '200 days', 1, 14, true, false),
('Deepak Tiwari', '+91 98765 43233', 'deepak.tiwari@example.com', now() - interval '95 days', 11, 38, true, true),
('Geeta Rani', '+91 98765 43234', 'geeta.rani@example.com', now() - interval '155 days', 6, 27, false, true),
('Suresh Rao', '+91 98765 43235', 'suresh.rao@example.com', now() - interval '180 days', 0, 10, true, true),
('Lata Kumari', '+91 98765 43236', 'lata.kumari@example.com', now() - interval '70 days', 19, 55, true, false),
('Vijay Singh', '+91 98765 43237', 'vijay.singh@example.com', now() - interval '115 days', 8, 33, true, true),
('Meera Bai', '+91 98765 43238', 'meera.bai@example.com', now() - interval '205 days', 2, 16, false, false),
('Ramesh Chand', '+91 98765 43239', 'ramesh.chand@example.com', now() - interval '105 days', 13, 46, true, true);

-- ============================================
-- SAMPLE DATA: MEMBERSHIPS
-- ============================================
insert into memberships (member_id, plan_id, plan_name, plan_type, start_date, expiry_date, base_price, discount, final_amount, is_active, auto_renew, pause_until, created_at)
select 
  m.id,
  p.id,
  p.name,
  p.type,
  m.join_date,
  m.join_date + (p.duration_days || ' days')::interval,
  p.base_price,
  case when random() < 0.3 then 200 else 0 end,
  p.base_price - case when random() < 0.3 then 200 else 0 end,
  true,
  false,
  null,
  m.join_date
from members m
cross join plans p
where m.id = (select id from members limit 1 offset floor(random() * 30)::int)
limit 30;

-- Set some memberships as expired or expiring soon for testing
update memberships set expiry_date = now() - interval '5 days' where id in (
  select id from memberships order by random() limit 3
);

update memberships set expiry_date = now() + interval '3 days' where id in (
  select id from memberships where expiry_date > now() order by random() limit 5
);

update memberships set pause_until = now() + interval '7 days' where id in (
  select id from memberships order by random() limit 2
);

-- ============================================
-- SAMPLE DATA: ADD ONS
-- ============================================
insert into add_ons (name, type, price, validity_days, stock, trainer_name, trainer_qualification, cancellation_terms) values
('Personal Training - 8 Sessions', 'personal-training', 4999, 30, null, 'Arjun Patel', 'NASM-CPT, ACE', '7-day notice, refund for unused sessions'),
('Custom Diet Plan', 'diet-plan', 2499, 30, null, 'Neha Sharma', 'ISSN Sports Nutritionist', 'Non-refundable once generated'),
('Whey Protein 1kg', 'supplement', 2999, 60, 12, null, null, 'Unopened only, 48-hour window'),
('Pre-Workout 30 Servings', 'supplement', 1499, 90, 3, null, null, 'Unopened only, 48-hour window');

-- ============================================
-- SAMPLE DATA: SETTINGS
-- ============================================
insert into settings (key, value, description) values
('no_show_threshold_days', '10', 'Days absent before opening no-show case'),
('renewal_reminder_days', '14,7,3,0', 'Renewal reminder windows'),
('duplicate_scan_window_minutes', '10', 'Window to prevent duplicate QR scans'),
('qr_session_validity_minutes', '10', 'QR session validity');

-- ============================================
-- SAMPLE DATA: ATTENDANCE (Some recent check-ins)
-- ============================================
insert into attendance (member_id, check_in_time, qr_session_id, source)
select 
  id,
  now() - (random() * interval '7 days'),
  'GYM-' || floor(random() * 9000 + 1000)::int || '-' || floor(random() * 900 + 100)::int,
  'qr'
from members
where random() < 0.6
limit 50;

-- ============================================
-- SAMPLE DATA: NOSHOW CASES (Members absent for 10+ days)
-- ============================================
insert into no_show_cases (member_id, opened_at, threshold_crossed_days, is_resolved)
select 
  m.id,
  now() - interval '2 days',
  14,
  false
from members m
where m.current_streak = 0
limit 6;

-- ============================================
-- SUCCESS MESSAGE
-- ============================================
select 'Database setup complete! Tables created and sample data inserted.' as status;

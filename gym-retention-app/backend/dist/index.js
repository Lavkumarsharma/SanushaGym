"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.io = void 0;
const express_1 = __importDefault(require("express"));
const http_1 = require("http");
const socket_io_1 = require("socket.io");
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const resend_1 = require("resend");
const uuid_1 = require("uuid");
const supabase_js_1 = require("@supabase/supabase-js");
const ws_1 = __importDefault(require("ws"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const httpServer = (0, http_1.createServer)(app);
const io = new socket_io_1.Server(httpServer, {
    cors: {
        origin: process.env.FRONTEND_URL || '*',
        methods: ['GET', 'POST'],
    },
});
exports.io = io;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
const supabase = (0, supabase_js_1.createClient)(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY, {
    realtime: {
        transport: ws_1.default,
    },
});
const resend = new resend_1.Resend(process.env.RESEND_API_KEY);
const PORT = process.env.PORT || 3001;
// ============================================
// SOCKET.IO - Real-time attendance & notifications
// ============================================
io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);
    socket.on('join:member', (memberId) => {
        socket.join(`member:${memberId}`);
        console.log(`Socket ${socket.id} joined member:${memberId}`);
    });
    socket.on('leave:member', (memberId) => {
        socket.leave(`member:${memberId}`);
    });
});
// ============================================
// REST API ROUTES
// ============================================
// Health check
app.get('/health', (_req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});
// Get member profile
app.get('/api/members/:id', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('members')
            .select('*')
            .eq('id', req.params.id)
            .single();
        if (error)
            throw error;
        res.json({ data });
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
});
// Record attendance
app.post('/api/attendance', async (req, res) => {
    try {
        const { member_id, qr_session_id, source = 'qr' } = req.body;
        const { data, error } = await supabase
            .from('attendance')
            .insert({ member_id, qr_session_id, source })
            .select()
            .single();
        if (error)
            throw error;
        // Emit real-time update
        io.to(`member:${member_id}`).emit('attendance:updated', {
            memberId: member_id,
            qrCode: qr_session_id,
            type: 'success',
            timestamp: new Date().toISOString(),
        });
        res.json({ data });
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
});
// Create payment order
app.post('/api/payments', async (req, res) => {
    try {
        const { member_id, amount, plan_type } = req.body;
        const orderId = `ORD-${Date.now()}-${(0, uuid_1.v4)().slice(0, 8)}`;
        const { data, error } = await supabase
            .from('payments')
            .insert({
            member_id,
            order_id: orderId,
            amount,
            status: 'created',
            provider: 'simulated',
        })
            .select()
            .single();
        if (error)
            throw error;
        res.json({ data, orderId });
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
});
// Verify payment (called by payment provider webhook)
app.post('/api/payments/:id/verify', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('payments')
            .update({ status: 'paid', paid_at: new Date().toISOString() })
            .eq('id', req.params.id)
            .select()
            .single();
        if (error)
            throw error;
        // Extend membership
        const { data: payment } = await supabase
            .from('payments')
            .select('member_id, amount')
            .eq('id', req.params.id)
            .single();
        if (payment) {
            // Get active membership and extend
            const { data: membership } = await supabase
                .from('memberships')
                .select('*')
                .eq('member_id', payment.member_id)
                .eq('is_active', true)
                .single();
            if (membership) {
                const newExpiry = new Date(membership.expiry_date);
                newExpiry.setDate(newExpiry.getDate() + 30); // Extend by 30 days
                await supabase
                    .from('memberships')
                    .update({ expiry_date: newExpiry.toISOString(), updated_at: new Date().toISOString() })
                    .eq('id', membership.id);
            }
        }
        // Emit real-time update
        io.to(`member:${data.member_id}`).emit('payment:verified', {
            paymentId: data.id,
            receiptId: `RCPT-${Math.floor(Math.random() * 90000 + 10000)}`,
        });
        res.json({ data });
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
});
// Get add-ons
app.get('/api/add-ons', async (_req, res) => {
    try {
        const { data, error } = await supabase
            .from('add_ons')
            .select('*')
            .eq('is_available', true);
        if (error)
            throw error;
        res.json({ data });
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
});
// Get red-list members
app.get('/api/red-list', async (_req, res) => {
    try {
        const { data: members, error } = await supabase
            .from('members')
            .select('*, memberships(*)')
            .eq('memberships.is_active', true);
        if (error)
            throw error;
        // Filter members absent > threshold (simplified)
        const redList = members.filter((m) => {
            const lastCheckIn = new Date(m.memberships?.[0]?.expiry_date || Date.now());
            const daysAbsent = Math.ceil((Date.now() - lastCheckIn.getTime()) / (1000 * 60 * 60 * 24));
            return daysAbsent >= 10;
        });
        res.json({ data: redList });
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
});
// Send email via Resend
app.post('/api/email/send', async (req, res) => {
    try {
        const { to, subject, html, text } = req.body;
        const { data, error } = await resend.emails.send({
            from: 'FitLocal Gym <notifications@fitlocal.gym>',
            to: [to],
            subject,
            html,
            text,
        });
        if (error)
            throw error;
        res.json({ data });
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
});
// ============================================
// AUTOMATION WORKERS (Daily Cron)
// ============================================
// Daily no-show scan
async function dailyNoShowScan() {
    console.log('Running daily no-show scan...');
    try {
        const thresholdDays = 10;
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - thresholdDays);
        const { data: members } = await supabase
            .from('members')
            .select('*, memberships(*), attendance(*)')
            .eq('memberships.is_active', true);
        if (!members)
            return;
        for (const member of members) {
            let lastAttendance = undefined;
            if (member.attendance && member.attendance.length > 0) {
                lastAttendance = [...member.attendance]
                    .sort((a, b) => new Date(b.check_in_time).getTime() - new Date(a.check_in_time).getTime())[0];
            }
            const lastCheckIn = lastAttendance ? new Date(lastAttendance.check_in_time) : new Date(member.join_date);
            const daysAbsent = Math.ceil((Date.now() - lastCheckIn.getTime()) / (1000 * 60 * 60 * 24));
            if (daysAbsent >= thresholdDays) {
                // Check if case already open
                const { data: existingCase } = await supabase
                    .from('no_show_cases')
                    .select('*')
                    .eq('member_id', member.id)
                    .eq('is_resolved', false)
                    .single();
                if (!existingCase) {
                    await supabase.from('no_show_cases').insert({
                        member_id: member.id,
                        threshold_crossed_days: daysAbsent,
                        opened_at: new Date().toISOString(),
                    });
                    // Notify owner via socket
                    io.emit('no-show:case', {
                        memberId: member.id,
                        memberName: member.name,
                        absentDays: daysAbsent,
                    });
                }
            }
        }
    }
    catch (err) {
        console.error('No-show scan error:', err.message);
    }
}
// Daily renewal reminders
async function dailyRenewalReminders() {
    console.log('Running daily renewal reminders...');
    const reminderDays = [14, 7, 3, 0];
    try {
        const { data: memberships } = await supabase
            .from('memberships')
            .select('*, members(*)')
            .eq('is_active', true);
        if (!memberships)
            return;
        for (const membership of memberships) {
            const expiryDate = new Date(membership.expiry_date);
            const today = new Date();
            const daysUntilExpiry = Math.ceil((expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
            if (reminderDays.includes(daysUntilExpiry) && daysUntilExpiry >= 0) {
                // Check if reminder already sent today
                const { data: existing } = await supabase
                    .from('notifications')
                    .select('*')
                    .eq('member_id', membership.member_id)
                    .eq('type', 'renewal_reminder')
                    .gte('created_at', new Date(today.setHours(0, 0, 0, 0)).toISOString())
                    .single();
                if (!existing) {
                    await supabase.from('notifications').insert({
                        member_id: membership.member_id,
                        type: 'renewal_reminder',
                        title: 'Membership Expiring Soon',
                        message: `Your ${membership.plan_name} membership expires in ${daysUntilExpiry} days. Renew now to keep your streak!`,
                        channel: 'push',
                        created_at: new Date().toISOString(),
                    });
                    // Send email
                    const member = membership.members;
                    if (member.email && member.email_opt_in) {
                        await resend.emails.send({
                            from: 'FitLocal Gym <notifications@fitlocal.gym>',
                            to: [member.email],
                            subject: 'Membership Expiring Soon - Renew Now',
                            html: `<p>Hi ${member.name}, your membership expires in ${daysUntilExpiry} days. Renew now to keep your streak!</p>`,
                        });
                    }
                    // Socket notification
                    io.to(`member:${membership.member_id}`).emit('notification:new', {
                        type: 'renewal_reminder',
                        title: 'Membership Expiring Soon',
                        message: `Renew in ${daysUntilExpiry} days`,
                    });
                }
            }
        }
    }
    catch (err) {
        console.error('Renewal reminder error:', err.message);
    }
}
// Run automations every hour
setInterval(dailyNoShowScan, 60 * 60 * 1000);
setInterval(dailyRenewalReminders, 60 * 60 * 1000);
// Run once on startup
dailyNoShowScan();
dailyRenewalReminders();
httpServer.listen(PORT, () => {
    console.log(`Backend server running on port ${PORT}`);
});

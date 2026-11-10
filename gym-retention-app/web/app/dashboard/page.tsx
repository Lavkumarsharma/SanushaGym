import { createServerComponent } from 'react';

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gym-black text-white">
      <nav className="border-b border-white/10 bg-gym-dark/80 backdrop-blur sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-gym-green" />
              <span className="font-bold text-xl tracking-tight">FitLocal Gym</span>
            </div>
            <div className="hidden md:flex items-center gap-6">
              <a href="/dashboard" className="text-gym-green font-semibold">Dashboard</a>
              <a href="/red-list" className="text-white/70 hover:text-white transition">Red List</a>
              <a href="/follow-ups" className="text-white/70 hover:text-white transition">Follow-Ups</a>
              <a href="/renewals" className="text-white/70 hover:text-white transition">Renewals</a>
              <a href="/add-ons" className="text-white/70 hover:text-white transition">Add-Ons</a>
            </div>
            <div className="flex items-center gap-3">
              <button className="text-white/70 hover:text-white transition">
                <span className="sr-only">Notifications</span>
                🔔
              </button>
              <button className="bg-gym-green text-black px-4 py-2 rounded-lg font-semibold hover:bg-green-400 transition">
                Owner
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6 mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-gym-gray mt-1">
              Welcome back. Here's what's happening at your gym today.
            </p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          <StatCard title="Active Members" value="1,234" change="+12" trend="up" color="gym-green" icon="👥" />
          <StatCard title="Today's Check-Ins" value="89" change="+5" trend="up" color="gym-blue" icon="✅" />
          <StatCard title="7-Day Active" value="456" change="-2" trend="down" color="gym-blue" icon="📅" />
          <StatCard title="No-Show Cases" value="23" change="+8" trend="up" color="gym-orange" icon="⚠️" />
          <StatCard title="Renewals Due" value="14" change="+3" trend="up" color="gym-yellow" icon="💳" />
          <StatCard title="Add-On Revenue" value="₹45,000" change="+12%" trend="up" color="gym-green" icon="💰" />
        </div>

        {/* Red List Preview */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <RedListPreview />
          </div>
          <div>
            <QuickActions />
          </div>
        </section>
      </main>
    </div>
  );
}

function StatCard({
  title,
  value,
  change,
  trend,
  color,
  icon,
}: {
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down';
  color: string;
  icon: string;
}) {
  const trendColor = trend === 'up' ? 'text-gym-green' : 'text-gym-red';
  return (
    <div className="bg-gym-card border border-white/10 rounded-2xl p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gym-gray text-sm font-medium">{title}</p>
          <h3 className="text-2xl font-bold mt-1">{value}</h3>
        </div>
        <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-lg">
          {icon}
        </div>
      </div>
      <div className="mt-4 flex items-center gap-1">
        <span className={`text-xs font-semibold ${trendColor}`}>
          {trend === 'up' ? '↑' : '↓'} {change}
        </span>
        <span className="text-xs text-gym-gray">vs last week</span>
      </div>
    </div>
  );
}

function RedListPreview() {
  const redListMembers = [
    { name: 'Rajesh Kumar', phone: '+91 98765 43210', plan: 'Monthly', absentDays: 14, trainer: 'Arjun Patel' },
    { name: 'Sunita Devi', phone: '+91 98765 43211', plan: 'Quarterly', absentDays: 11, trainer: 'Neha Sharma' },
    { name: 'Manoj Bhai', phone: '+91 98765 43212', plan: 'Half-Yearly', absentDays: 18, trainer: 'Ravi Kumar' },
    { name: 'Pooja Agarwal', phone: '+91 98765 43213', plan: 'Monthly', absentDays: 12, trainer: 'Arjun Patel' },
  ];

  return (
    <div className="bg-gym-card border border-white/10 rounded-2xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold">Red List</h2>
        <a href="/red-list" className="text-gym-green text-sm font-semibold hover:text-green-400 transition">
          View All →
        </a>
      </div>

      <div className="space-y-3">
        {redListMembers.map((member, idx) => (
          <div key={idx} className="flex items-center gap-3 p-3 rounded-xl bg-white/5">
            <div className="w-8 h-8 rounded-full bg-gym-orange/20 flex items-center justify-center text-xs font-bold text-gym-orange">
              {idx + 1}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold truncate">{member.name}</p>
              <p className="text-xs text-gym-gray truncate">{member.phone}</p>
            </div>
            <div className="hidden md:flex flex-col items-end gap-1">
              <p className="text-xs text-gym-gray">{member.plan}</p>
              <p className="text-xs font-bold text-gym-orange">{member.absentDays} days absent</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function QuickActions() {
  const actions = [
    { label: 'Assisted Check-In', icon: '📱', color: 'gym-green' },
    { label: 'Manage Plans', icon: '📋', color: 'gym-blue' },
    { label: 'Verify Payments', icon: '💳', color: 'gym-purple' },
    { label: 'Call Member', icon: '📞', color: 'gym-red' },
    { label: 'Daily Summary', icon: '📊', color: 'gym-gray' },
  ];

  return (
    <div className="bg-gym-card border border-white/10 rounded-2xl p-6">
      <h2 className="text-lg font-bold mb-6">Quick Actions</h2>
      <div className="grid grid-cols-1 gap-3">
        {actions.map((action) => (
          <button
            key={action.label}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl border border-white/10 bg-white/5 text-left hover:bg-white/10 transition text-sm font-medium`}
          >
            <span className="text-lg">{action.icon}</span>
            <span className="text-white">{action.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

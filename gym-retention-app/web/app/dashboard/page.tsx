import Link from 'next/link';

export default function DashboardPage() {
  const stats = [
    { title: 'Active Members', value: '1,234', change: '+12', trend: 'up', color: 'text-gym-green', icon: '👥', bg: 'bg-gym-green/10' },
    { title: "Today's Check-Ins", value: '89', change: '+5', trend: 'up', color: 'text-gym-blue', icon: '✅', bg: 'bg-gym-blue/10' },
    { title: '7-Day Active', value: '456', change: '-2', trend: 'down', color: 'text-gym-blue', icon: '📅', bg: 'bg-gym-blue/10' },
    { title: 'No-Show Cases', value: '23', change: '+8', trend: 'up', color: 'text-gym-orange', icon: '⚠️', bg: 'bg-gym-orange/10' },
    { title: 'Renewals Due', value: '14', change: '+3', trend: 'up', color: 'text-gym-yellow', icon: '💳', bg: 'bg-gym-yellow/10' },
    { title: 'Add-On Revenue', value: '₹45,000', change: '+12%', trend: 'up', color: 'text-gym-green', icon: '💰', bg: 'bg-gym-green/10' },
  ];

  const redListMembers = [
    { name: 'Rajesh Kumar', phone: '+91 98765 43210', plan: 'Monthly', absentDays: 14, trainer: 'Arjun Patel' },
    { name: 'Sunita Devi', phone: '+91 98765 43211', plan: 'Quarterly', absentDays: 11, trainer: 'Neha Sharma' },
    { name: 'Manoj Bhai', phone: '+91 98765 43212', plan: 'Half-Yearly', absentDays: 18, trainer: 'Ravi Kumar' },
    { name: 'Pooja Agarwal', phone: '+91 98765 43213', plan: 'Monthly', absentDays: 12, trainer: 'Arjun Patel' },
  ];

  return (
    <div className="min-h-screen bg-gym-black text-white">
      <nav className="border-b border-white/10 bg-gym-dark/90 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-gym-green flex items-center justify-center text-xl font-bold shadow-lg shadow-green/20">
                💪
              </div>
              <div>
                <span className="font-bold text-xl tracking-tight">FitLocal Gym</span>
                <p className="text-xs text-gray-400 mt-0.5">Owner Dashboard</p>
              </div>
            </div>
            <div className="hidden md:flex items-center gap-6">
              <Link href="/dashboard" className="text-gym-green font-semibold px-3 py-2 rounded-lg hover:bg-white/5 transition">
                Dashboard
              </Link>
              <Link href="/red-list" className="text-white/70 hover:text-white px-3 py-2 rounded-lg hover:bg-white/5 transition">
                Red List
              </Link>
              <Link href="/follow-ups" className="text-white/70 hover:text-white px-3 py-2 rounded-lg hover:bg-white/5 transition">
                Follow-Ups
              </Link>
              <Link href="/renewals" className="text-white/70 hover:text-white px-3 py-2 rounded-lg hover:bg-white/5 transition">
                Renewals
              </Link>
              <Link href="/add-ons" className="text-white/70 hover:text-white px-3 py-2 rounded-lg hover:bg-white/5 transition">
                Add-Ons
              </Link>
            </div>
            <div className="flex items-center gap-3">
              <button className="text-white/70 hover:text-white p-2 rounded-lg hover:bg-white/5 transition">
                <span className="sr-only">Notifications</span>
                🔔
              </button>
              <div className="bg-white/10 px-4 py-2 rounded-lg font-semibold border border-white/10">
                Owner
              </div>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6 mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-gray-400 mt-1">
              Welcome back. Here&apos;s what&apos;s happening at your gym today.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button className="bg-gym-green text-black px-4 py-2 rounded-lg font-semibold hover:bg-green-400 transition flex items-center gap-2">
              📊 Export Report
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          {stats.map((stat) => (
            <div key={stat.title} className="bg-gym-card border border-white/10 rounded-2xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm font-medium">{stat.title}</p>
                  <h3 className="text-2xl font-bold mt-1">{stat.value}</h3>
                </div>
                <div className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center text-lg`}>
                  {stat.icon}
                </div>
              </div>
              <div className="mt-4 flex items-center gap-1">
                <span className={`text-xs font-semibold ${stat.color}`}>
                  {stat.trend === 'up' ? '↑' : '↓'} {stat.change}
                </span>
                <span className="text-xs text-gray-500">vs last week</span>
              </div>
            </div>
          ))}
        </div>

        {/* Red List Preview & Quick Actions */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-gym-card border border-white/10 rounded-2xl p-6 mb-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold">Red List</h2>
                <Link href="/red-list" className="text-gym-green text-sm font-semibold hover:text-gym-green/80 transition">
                  View All →
                </Link>
              </div>
              <div className="overflow-hidden rounded-xl border border-white/10">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-white/5 bg-white/5">
                      <th className="px-4 py-3 text-xs font-semibold text-gray-400 uppercase">Member</th>
                      <th className="px-4 py-3 text-xs font-semibold text-gray-400 uppercase">Phone</th>
                      <th className="px-4 py-3 text-xs font-semibold text-gray-400 uppercase">Plan</th>
                      <th className="px-4 py-3 text-xs font-semibold text-gray-400 uppercase text-right">Absent</th>
                    </tr>
                  </thead>
                  <tbody>
                    {redListMembers.map((member, idx) => (
                      <tr key={idx} className="border-b border-white/5 hover:bg-white/5 transition">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-gym-orange/20 flex items-center justify-center text-xs font-bold text-gym-orange">
                              {idx + 1}
                            </div>
                            <div>
                              <p className="text-sm font-semibold">{member.name}</p>
                              <p className="text-xs text-gray-500">{member.phone}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-400">{member.plan}</td>
                        <td className="px-4 py-3 text-sm text-right text-gray-300">{member.absentDays}</td>
                        <td className="px-4 py-3 text-sm text-right">
                          <span className="px-2 py-1 rounded bg-gym-orange/10 text-gym-orange text-xs font-bold">
                            {member.absentDays} days
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="bg-gym-card border border-white/10 rounded-2xl p-6">
              <h2 className="text-lg font-bold mb-6">Quick Actions</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {[
                  { label: 'Assisted Check-In', icon: '📱', color: 'gym-green' },
                  { label: 'Manage Plans', icon: '📋', color: 'gym-blue' },
                  { label: 'Verify Payments', icon: '💳', color: 'gym-purple' },
                  { label: 'Call Member', icon: '📞', color: 'gym-red' },
                  { label: 'Daily Summary', icon: '📊', color: 'gym-gray' },
                  { label: 'Send Reminders', icon: '✉️', color: 'gym-yellow' },
                ].map((action) => (
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
          </div>
          <div className="lg:col-span-1">
            <div className="bg-gym-card border border-white/10 rounded-2xl p-6 sticky top-24">
              <h2 className="text-lg font-bold mb-6">Today&apos;s Summary</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 rounded-lg bg-white/5">
                  <span className="text-sm text-gray-400">Check-ins today</span>
                  <span className="font-semibold text-white">89</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-white/5">
                  <span className="text-sm text-gray-400">No-show cases</span>
                  <span className="font-semibold text-gym-orange">23</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-white/5">
                  <span className="text-sm text-gray-400">Renewals due</span>
                  <span className="font-semibold text-gym-yellow">14</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-white/5">
                  <span className="text-sm text-gray-400">Add-on revenue</span>
                  <span className="font-semibold text-gym-green">₹45,000</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

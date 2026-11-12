export default function RedListPage() {
  const members = [
    { id: 1, name: 'Rajesh Kumar', phone: '+91 98765 43210', plan: 'Monthly', expiry: 'Mar 15, 2025', lastCheckIn: 'Feb 28, 2025', absentDays: 14, trainer: 'Arjun Patel', status: 'At Risk' },
    { id: 2, name: 'Sunita Devi', phone: '+91 98765 43211', plan: 'Quarterly', expiry: 'Mar 18, 2025', lastCheckIn: 'Feb 25, 2025', absentDays: 11, trainer: 'Neha Sharma', status: 'At Risk' },
    { id: 3, name: 'Manoj Bhai', phone: '+91 98765 43212', plan: 'Half-Yearly', expiry: 'Mar 20, 2025', lastCheckIn: 'Feb 20, 2025', absentDays: 18, trainer: 'Ravi Kumar', status: 'Critical' },
    { id: 4, name: 'Pooja Agarwal', phone: '+91 98765 43213', plan: 'Monthly', expiry: 'Mar 10, 2025', lastCheckIn: 'Feb 26, 2025', absentDays: 12, trainer: 'Arjun Patel', status: 'At Risk' },
    { id: 5, name: 'Kiran Bala', phone: '+91 98765 43232', plan: 'Monthly', expiry: 'Mar 5, 2025', lastCheckIn: 'Feb 22, 2025', absentDays: 15, trainer: 'Neha Sharma', status: 'Critical' },
    { id: 6, name: 'Deepak Tiwari', phone: '+91 98765 43233', plan: 'Quarterly', expiry: 'Mar 12, 2025', lastCheckIn: 'Feb 24, 2025', absentDays: 13, trainer: 'Arjun Patel', status: 'At Risk' },
  ];

  return (
    <div className="min-h-screen bg-gym-black text-white p-6">
      <nav className="mb-8 flex items-center gap-2">
        <button className="text-gym-gray hover:text-white transition p-2 rounded-lg hover:bg-white/5">
          ← Back
        </button>
        <span className="text-gray-400 text-xs mx-1">/</span>
        <h1 className="text-2xl font-bold tracking-tight">Red List</h1>
      </nav>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filters */}
        <aside className="w-full lg:w-72 shrink-0">
          <div className="bg-gym-card border border-white/10 rounded-2xl p-6">
            <h2 className="text-lg font-bold mb-6">Filters</h2>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">No-Show Threshold</label>
                <select className="w-full bg-gym-black border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-gym-green transition">
                  <option>10 days</option>
                  <option>7 days</option>
                  <option>14 days</option>
                  <option>21 days</option>
                  <option>30 days</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Trainer</label>
                <select className="w-full bg-gym-black border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-gym-green transition">
                  <option>All Trainers</option>
                  <option>Arjun Patel</option>
                  <option>Neha Sharma</option>
                  <option>Ravi Kumar</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Status</label>
                <select className="w-full bg-gym-black border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-gym-green transition">
                  <option>All Statuses</option>
                  <option>At Risk</option>
                  <option>Critical</option>
                </select>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1">
          <div className="bg-gym-card border border-white/10 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-sm text-gray-400 font-medium uppercase tracking-wider">Members requiring attention</p>
                <h2 className="text-xl font-bold text-white">{members.length} members on red list</h2>
              </div>
              <div className="flex gap-2">
                <button className="px-4 py-2 bg-gym-green text-black rounded-lg font-semibold hover:bg-green-400 transition flex items-center gap-2">
                  📞 Call All
                </button>
                <button className="px-4 py-2 bg-white/10 text-white border border-white/10 rounded-lg font-semibold hover:bg-white/20 transition flex items-center gap-2">
                  📱 WhatsApp
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="px-4 py-4 text-xs font-semibold text-gray-400 uppercase">Member</th>
                    <th className="px-4 py-4 text-xs font-semibold text-gray-400 uppercase">Phone</th>
                    <th className="px-4 py-4 text-xs font-semibold text-gray-400 uppercase">Plan</th>
                    <th className="px-4 py-4 text-xs font-semibold text-gray-400 uppercase">Expiry</th>
                    <th className="px-4 py-4 text-xs font-semibold text-gray-400 uppercase">Last Check-In</th>
                    <th className="px-4 py-4 text-xs font-semibold text-gray-400 uppercase text-right">Absent Days</th>
                    <th className="px-4 py-4 text-xs font-semibold text-gray-400 uppercase">Trainer</th>
                    <th className="px-4 py-4 text-xs font-semibold text-gray-400 uppercase text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {members.map((m) => (
                    <tr key={m.id} className="border-b border-white/5 hover:bg-white/5 transition group">
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gym-orange/20 flex items-center justify-center text-xs font-bold text-gym-orange">
                            {m.id}
                          </div>
                          <div>
                            <p className="text-sm font-semibold">{m.name}</p>
                            <p className="text-xs text-gray-500">ID: MEM-{m.id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-400">{m.phone}</td>
                      <td className="px-4 py-4 text-sm text-gray-300">{m.plan}</td>
                      <td className="px-4 py-4 text-sm text-gray-300">{m.expiry}</td>
                      <td className="px-4 py-4 text-sm text-gray-400">{m.lastCheckIn}</td>
                      <td className="px-4 py-4 text-sm font-bold text-right">
                        <span className={m.absentDays >= 15 ? 'text-gym-red' : 'text-gym-orange'}>
                          {m.absentDays} days
                        </span>
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-400">{m.trainer}</td>
                      <td className="px-4 py-4 text-right">
                        <div className="flex gap-2 justify-end">
                          <button className="px-3 py-1.5 text-xs font-medium bg-gym-green/10 text-gym-green rounded-lg hover:bg-gym-green/20 transition">
                            Call
                          </button>
                          <button className="px-3 py-1.5 text-xs font-medium bg-gym-blue/10 text-gym-blue rounded-lg hover:bg-gym-blue/20 transition">
                            WhatsApp
                          </button>
                          <button className="px-3 py-1.5 text-xs font-medium bg-white/10 text-white border border-white/10 rounded-lg hover:bg-white/20 transition">
                            Follow-up
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {members.length === 0 && (
              <div className="py-12 text-center">
                <p className="text-gray-400 text-lg">🎉 No members on the red list. All members are active!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

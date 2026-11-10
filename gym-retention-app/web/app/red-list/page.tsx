export default function RedListPage() {
  return (
    <div className="min-h-screen bg-gym-black text-white p-6">
      <nav className="mb-8 flex items-center gap-2">
        <button className="text-gym-gray hover:text-white transition">← Back</button>
        <span className="text-gym-gray text-xs">/</span>
        <h1 className="text-2xl font-bold">Red List</h1>
      </nav>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filters */}
        <aside className="w-full lg:w-64 shrink-0">
          <div className="bg-gym-card border border-white/10 rounded-2xl p-6">
            <h2 className="text-lg font-bold mb-6">Filters</h2>

            <div className="space-y-4">
              <label className="text-sm font-medium text-gray-400">No-Show Threshold</label>
              <select className="w-full bg-gym-black border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-gym-green">
                <option>10 days</option>
                <option>7 days</option>
                <option>14 days</option>
                <option>21 days</option>
                <option>30 days</option>
              </select>
            </div>

            <div className="space-y-4">
              <label className="text-sm font-medium text-gray-400">Trainer</label>
              <select className="w-full bg-gym-black border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-gym-green">
                <option>All Trainers</option>
                <option>Arjun Patel</option>
                <option>Neha Sharma</option>
                <option>Ravi Kumar</option>
              </select>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1">
          <div className="bg-gym-card border border-white/10 rounded-2xl p-6">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/10 text-gym-gray text-sm font-medium">
                    <th className="pb-4">Member</th>
                    <th className="pb-4">Phone</th>
                    <th className="pb-4">Plan</th>
                    <th className="pb-4">Expiry</th>
                    <th className="pb-4">Last Check-In</th>
                    <th className="pb-4">Absent Days</th>
                    <th className="pb-4">Trainer</th>
                    <th className="pb-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <tr key={i} className="border-b border-white/5 hover:bg-white/5 transition">
                      <td className="py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gym-gray/20 flex items-center justify-center text-xs font-bold">
                            R{i}
                          </div>
                          <div>
                            <p className="text-sm font-semibold">Member {i}</p>
                            <p className="text-xs text-gym-gray">ID: MEM-{i}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 text-sm text-gray-400">+91 98765 4321{i}</td>
                      <td className="py-4 text-sm">Monthly</td>
                      <td className="py-4 text-sm text-gym-yellow">Mar 15, 2025</td>
                      <td className="py-4 text-sm text-gray-400">Feb 28, 2025</td>
                      <td className="py-4 text-sm font-bold text-gym-orange">10 days</td>
                      <td className="py-4 text-sm text-gray-400">Arjun Patel</td>
                      <td className="py-4">
                        <div className="flex gap-2">
                          <button className="px-3 py-1.5 text-xs font-medium bg-gym-green/10 text-gym-green rounded-lg hover:bg-gym-green/20 transition">
                            Call
                          </button>
                          <button className="px-3 py-1.5 text-xs font-medium bg-gym-blue/10 text-gym-blue rounded-lg hover:bg-gym-blue/20 transition">
                            WhatsApp
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

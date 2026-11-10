export default function RenewalsPage() {
  return (
    <div className="min-h-screen bg-gym-black text-white p-6">
      <nav className="mb-8 flex items-center gap-2">
        <button className="text-gym-gray hover:text-white transition">← Back</button>
        <span className="text-gym-gray text-xs">/</span>
        <h1 className="text-2xl font-bold">Renewals</h1>
      </nav>

      <div className="bg-gym-card border border-white/10 rounded-2xl p-6">
        <h2 className="text-lg font-bold mb-6">Renewals Due (≤ 7 Days)</h2>
        <p className="text-gym-gray text-sm mb-6">
          Members whose membership expires within 7 days. Send reminders and payment links.
        </p>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10 text-gym-gray text-sm font-medium">
                <th className="pb-4">Member</th>
                <th className="pb-4">Plan</th>
                <th className="pb-4">Expiry</th>
                <th className="pb-4">Days Left</th>
                <th className="pb-4">Amount</th>
                <th className="pb-4">Status</th>
                <th className="pb-4">Action</th>
              </tr>
            </thead>
            <tbody>
              {[
                { member: 'Rajesh Kumar', plan: 'Monthly', expiry: 'Mar 15, 2025', days: 5, amount: '₹1,499', status: 'Pending' },
                { member: 'Sunita Devi', plan: 'Quarterly', expiry: 'Mar 18, 2025', days: 8, amount: '₹3,999', status: 'Pending' },
                { member: 'Manoj Bhai', plan: 'Half-Yearly', expiry: 'Mar 20, 2025', days: 10, amount: '₹6,999', status: 'Pending' },
              ].map((row, i) => (
                <tr key={i} className="border-b border-white/5 hover:bg-white/5 transition">
                  <td className="py-4 text-sm font-semibold">{row.member}</td>
                  <td className="py-4 text-sm">{row.plan}</td>
                  <td className="py-4 text-sm">{row.expiry}</td>
                  <td className="py-4 text-sm font-bold text-gym-yellow">{row.days} days</td>
                  <td className="py-4 text-sm">{row.amount}</td>
                  <td className="py-4 text-sm">
                    <span className="px-2 py-1 rounded-full bg-gym-yellow/10 text-gym-yellow text-xs font-bold">
                      {row.status}
                    </span>
                  </td>
                  <td className="py-4">
                    <button className="px-4 py-2 text-sm font-medium bg-gym-green text-black rounded-lg hover:bg-green-400 transition">
                      Send Reminder
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

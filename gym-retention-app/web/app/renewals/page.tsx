export default function RenewalsPage() {
  const renewals = [
    { member: 'Rajesh Kumar', plan: 'Monthly', expiry: 'Mar 15, 2025', days: 5, amount: '₹1,499', status: 'Pending' },
    { member: 'Sunita Devi', plan: 'Quarterly', expiry: 'Mar 18, 2025', days: 8, amount: '₹3,999', status: 'Pending' },
    { member: 'Manoj Bhai', plan: 'Half-Yearly', expiry: 'Mar 20, 2025', days: 10, amount: '₹6,999', status: 'Pending' },
    { member: 'Pooja Agarwal', plan: 'Monthly', expiry: 'Mar 10, 2025', days: 2, amount: '₹1,499', status: 'Urgent' },
    { member: 'Kiran Bala', plan: 'Quarterly', expiry: 'Mar 7, 2025', days: 0, amount: '₹3,999', status: 'Expired' },
  ];

  return (
    <div className="min-h-screen bg-gym-black text-white p-6">
      <nav className="mb-8 flex items-center gap-2">
        <button className="text-gym-gray hover:text-white transition p-2 rounded-lg hover:bg-white/5">
          ← Back
        </button>
        <span className="text-gray-400 text-xs mx-1">/</span>
        <h1 className="text-2xl font-bold tracking-tight">Renewals</h1>
      </nav>

      <div className="bg-gym-card border border-white/10 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-bold">Renewals Due (≤ 7 Days)</h2>
            <p className="text-gray-400 text-sm mt-1">
              Members whose membership expires within 7 days. Send reminders and payment links.
            </p>
          </div>
          <span className="px-3 py-1 rounded-full bg-red-900/30 text-red-400 text-xs font-bold border border-red-400/20">
            {renewals.filter(r => r.status === 'Expired' || r.status === 'Urgent').length} Urgent
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10">
                <th className="px-4 py-4 text-xs font-semibold text-gray-400 uppercase">Member</th>
                <th className="px-4 py-4 text-xs font-semibold text-gray-400 uppercase">Plan</th>
                <th className="px-4 py-4 text-xs font-semibold text-gray-400 uppercase">Expiry</th>
                <th className="px-4 py-4 text-xs font-semibold text-gray-400 uppercase text-right">Days Left</th>
                <th className="px-4 py-4 text-xs font-semibold text-gray-400 uppercase text-right">Amount</th>
                <th className="px-4 py-4 text-xs font-semibold text-gray-400 uppercase">Status</th>
                <th className="px-4 py-4 text-xs font-semibold text-gray-400 uppercase text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {renewals.map((row, i) => {
                const isUrgent = row.days <= 3;
                return (
                  <tr key={i} className={`border-b border-white/5 hover:bg-white/5 transition ${isUrgent ? 'bg-red-900/10' : ''}`}>
                    <td className="px-4 py-4 text-sm font-semibold">{row.member}</td>
                    <td className="px-4 py-4 text-sm text-gray-300">{row.plan}</td>
                    <td className="px-4 py-4 text-sm text-gray-300">{row.expiry}</td>
                    <td className="px-4 py-4 text-sm font-bold text-right">
                      <span className={isUrgent ? 'text-red-400' : 'text-yellow-400'}>
                        {row.days} days
                      </span>
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-300 text-right">{row.amount}</td>
                    <td className="px-4 py-4 text-sm">
                      <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                        row.status === 'Expired' ? 'bg-red-100 text-red-800' :
                        row.status === 'Urgent' ? 'bg-orange-100 text-orange-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {row.status}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-right">
                      <button className="px-4 py-2 text-sm font-medium bg-gym-green text-black rounded-lg hover:bg-green-400 transition flex items-center gap-2">
                        📧 Send Reminder
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

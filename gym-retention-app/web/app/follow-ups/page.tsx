export default function FollowUpsPage() {
  const followUps = [
    { member: 'Rajesh Kumar', outcome: 'will_return', nextAction: 'Mar 20, 2025', notes: 'Spoke to member, will return next week', created: 'Mar 15, 2025' },
    { member: 'Sunita Devi', outcome: 'injured', nextAction: 'Mar 25, 2025', notes: 'Knee pain, advised rest', created: 'Mar 14, 2025' },
    { member: 'Manoj Bhai', outcome: 'travelling', nextAction: 'Apr 1, 2025', notes: 'Out of town for work', created: 'Mar 13, 2025' },
    { member: 'Pooja Agarwal', outcome: 'unhappy', nextAction: 'Mar 18, 2025', notes: 'Complained about equipment', created: 'Mar 12, 2025' },
    { member: 'Kiran Bala', outcome: 'no_response', nextAction: '-', notes: '3 call attempts, no response', created: 'Mar 10, 2025' },
    { member: 'Deepak Tiwari', outcome: 'cancelled', nextAction: '-', notes: 'Moved to different city', created: 'Mar 8, 2025' },
  ];

  const outcomeLabels: Record<string, string> = {
    will_return: 'Will Return',
    injured: 'Injured',
    travelling: 'Travelling',
    timing_issue: 'Timing Issue',
    unhappy: 'Unhappy',
    no_response: 'No Response',
    cancelled: 'Cancelled',
  };

  const outcomeStyles: Record<string, string> = {
    will_return: 'bg-green-100 text-green-800',
    injured: 'bg-blue-100 text-blue-800',
    travelling: 'bg-blue-100 text-blue-800',
    timing_issue: 'bg-yellow-100 text-yellow-800',
    unhappy: 'bg-orange-100 text-orange-800',
    no_response: 'bg-gray-100 text-gray-800',
    cancelled: 'bg-red-100 text-red-800',
  };

  return (
    <div className="min-h-screen bg-gym-black text-white p-6">
      <nav className="mb-8 flex items-center gap-2">
        <button className="text-gym-gray hover:text-white transition p-2 rounded-lg hover:bg-white/5">
          ← Back
        </button>
        <span className="text-gray-400 text-xs mx-1">/</span>
        <h1 className="text-2xl font-bold tracking-tight">Follow-Ups</h1>
      </nav>

      <div className="bg-gym-card border border-white/10 rounded-2xl p-6">
        <div className="mb-6">
          <h2 className="text-lg font-bold">Member Follow-Up Outcomes</h2>
          <p className="text-gray-400 text-sm mt-1">
            Track outcomes for red-list members. Next action date required for: Will Return, Injured, Travelling, Timing Issue, Unhappy.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10">
                <th className="px-4 py-4 text-xs font-semibold text-gray-400 uppercase">Member</th>
                <th className="px-4 py-4 text-xs font-semibold text-gray-400 uppercase">Outcome</th>
                <th className="px-4 py-4 text-xs font-semibold text-gray-400 uppercase">Next Action</th>
                <th className="px-4 py-4 text-xs font-semibold text-gray-400 uppercase">Notes</th>
                <th className="px-4 py-4 text-xs font-semibold text-gray-400 uppercase">Created</th>
                <th className="px-4 py-4 text-xs font-semibold text-gray-400 uppercase text-right">Status</th>
              </tr>
            </thead>
            <tbody>
              {followUps.map((row, i) => {
                const needsNextAction = row.nextAction !== '-';
                return (
                  <tr key={i} className="border-b border-white/5 hover:bg-white/5 transition">
                    <td className="px-4 py-4 text-sm font-semibold">{row.member}</td>
                    <td className="px-4 py-4 text-sm">
                      <span className={`px-2 py-1 rounded-full text-xs font-bold ${outcomeStyles[row.outcome] || 'bg-blue-100 text-blue-800'}`}>
                        {outcomeLabels[row.outcome] || row.outcome}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-400">{row.nextAction}</td>
                    <td className="px-4 py-4 text-sm text-gray-400 truncate max-w-xs">{row.notes}</td>
                    <td className="px-4 py-4 text-sm text-gray-400">{row.created}</td>
                    <td className="px-4 py-4 text-right">
                      <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                        needsNextAction ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {needsNextAction ? 'Scheduled' : 'Pending'}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="mt-6 pt-6 border-t border-white/10">
          <h3 className="text-sm font-semibold text-gray-400 uppercase mb-3">Outcome Legend</h3>
          <div className="flex flex-wrap gap-4">
            {[
              { label: 'Will Return', color: 'text-green-800 bg-green-100' },
              { label: 'Injured', color: 'text-blue-800 bg-blue-100' },
              { label: 'Travelling', color: 'text-blue-800 bg-blue-100' },
              { label: 'Timing Issue', color: 'text-yellow-800 bg-yellow-100' },
              { label: 'Unhappy', color: 'text-orange-800 bg-orange-100' },
              { label: 'No Response', color: 'text-gray-800 bg-gray-100' },
              { label: 'Cancelled', color: 'text-red-800 bg-red-100' },
            ].map((item) => (
              <span key={item.label} className={`px-2 py-1 rounded text-xs font-bold ${item.color}`}>
                {item.label}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function FollowUpsPage() {
  return (
    <div className="min-h-screen bg-gym-black text-white p-6">
      <nav className="mb-8 flex items-center gap-2">
        <button className="text-gym-gray hover:text-white transition">← Back</button>
        <span className="text-gym-gray text-xs">/</span>
        <h1 className="text-2xl font-bold">Follow-Ups</h1>
      </nav>

      <div className="bg-gym-card border border-white/10 rounded-2xl p-6">
        <h2 className="text-lg font-bold mb-6">Member Follow-Up Outcomes</h2>
        <p className="text-gym-gray text-sm mb-6">
          Track outcomes for red-list members. Next action date required for: Will Return, Injured, Travelling, Timing Issue, Unhappy.
        </p>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10 text-gym-gray text-sm font-medium">
                <th className="pb-4">Member</th>
                <th className="pb-4">Outcome</th>
                <th className="pb-4">Next Action</th>
                <th className="pb-4">Notes</th>
                <th className="pb-4">Created</th>
                <th className="pb-4">Status</th>
              </tr>
            </thead>
            <tbody>
              {[
                { member: 'Rajesh Kumar', outcome: 'Will Return', nextAction: 'Mar 20, 2025', notes: 'Spoke to member, will return next week', created: 'Mar 15, 2025' },
                { member: 'Sunita Devi', outcome: 'Injured', nextAction: 'Mar 25, 2025', notes: 'Knee pain, advised rest', created: 'Mar 14, 2025' },
                { member: 'Manoj Bhai', outcome: 'Travelling', nextAction: 'Apr 1, 2025', notes: 'Out of town for work', created: 'Mar 13, 2025' },
                { member: 'Pooja Agarwal', outcome: 'Unhappy', nextAction: 'Mar 18, 2025', notes: 'Complained about equipment', created: 'Mar 12, 2025' },
                { member: 'Kiran Bala', outcome: 'No Response', nextAction: '-', notes: '3 call attempts, no response', created: 'Mar 10, 2025' },
                { member: 'Deepak Tiwari', outcome: 'Cancelled', nextAction: '-', notes: 'Moved to different city', created: 'Mar 8, 2025' },
              ].map((row, i) => (
                <tr key={i} className="border-b border-white/5 hover:bg-white/5 transition">
                  <td className="py-4 text-sm font-semibold">{row.member}</td>
                  <td className="py-4 text-sm">
                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                      row.outcome === 'Will Return' ? 'bg-gym-green/10 text-gym-green' :
                      row.outcome === 'Cancelled' ? 'bg-gym-red/10 text-gym-red' :
                      row.outcome === 'No Response' ? 'bg-gym-gray/10 text-gym-gray' :
                      'bg-gym-blue/10 text-gym-blue'
                    }`}>
                      {row.outcome}
                    </span>
                  </td>
                  <td className="py-4 text-sm text-gray-400">{row.nextAction}</td>
                  <td className="py-4 text-sm text-gray-400 truncate max-w-xs">{row.notes}</td>
                  <td className="py-4 text-sm text-gray-400">{row.created}</td>
                  <td className="py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                      row.nextAction === '-' ? 'bg-gym-red/10 text-gym-red' : 'bg-gym-green/10 text-gym-green'
                    }`}>
                      {row.nextAction === '-' ? 'Pending' : 'Scheduled'}
                    </span>
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

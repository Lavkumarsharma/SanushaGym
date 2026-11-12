export default function AddOnsPage() {
  const addOns = [
    {
      name: 'Personal Training - 8 Sessions',
      type: 'Personal Training',
      price: '₹4,999',
      validity: '30 days',
      trainer: 'Arjun Patel',
      qual: 'NASM-CPT, ACE',
      stock: 'Unlimited',
      terms: '7-day notice, refund for unused sessions',
    },
    {
      name: 'Custom Diet Plan',
      type: 'Diet Plan',
      price: '₹2,499',
      validity: '30 days',
      trainer: 'Neha Sharma',
      qual: 'ISSN Sports Nutritionist',
      stock: 'Unlimited',
      terms: 'Non-refundable once generated',
    },
    {
      name: 'Whey Protein 1kg',
      type: 'Supplement',
      price: '₹2,999',
      validity: '60 days',
      trainer: '-',
      qual: '-',
      stock: '12 left',
      terms: 'Unopened only, 48-hour window',
    },
    {
      name: 'Pre-Workout 30 Servings',
      type: 'Supplement',
      price: '₹1,499',
      validity: '90 days',
      trainer: '-',
      qual: '-',
      stock: '3 left',
      terms: 'Unopened only, 48-hour window',
    },
  ];

  return (
    <div className="min-h-screen bg-gym-black text-white p-6">
      <nav className="mb-8 flex items-center gap-2">
        <button className="text-gym-gray hover:text-white transition p-2 rounded-lg hover:bg-white/5">
          ← Back
        </button>
        <span className="text-gray-400 text-xs mx-1">/</span>
        <h1 className="text-2xl font-bold tracking-tight">Add-On Marketplace</h1>
      </nav>

      <div className="bg-gym-card border border-white/10 rounded-2xl p-6 mb-6">
        <h2 className="text-lg font-bold">Available Add-Ons</h2>
        <p className="text-gray-400 text-sm mt-1">
          Personal Training, Diet Plans, and Supplements. Never auto-selected in member app.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {addOns.map((item, i) => (
          <div key={i} className="bg-gym-black border border-white/10 rounded-2xl p-6 hover:border-gym-green/50 transition">
            <div className="w-12 h-12 rounded-xl bg-blue-900/30 flex items-center justify-center text-xl mb-4">
              🏋️
            </div>
            <h3 className="text-lg font-bold mb-2">{item.name}</h3>
            <p className="text-xs text-gray-400 uppercase tracking-wider mb-3">{item.type}</p>
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-2xl font-bold text-gym-green">{item.price}</p>
                <p className="text-xs text-gray-500">Valid {item.validity}</p>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                item.stock === 'Unlimited' ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'
              }`}>
                {item.stock}
              </span>
            </div>
            {item.trainer !== '-' && (
              <div className="mb-4">
                <p className="text-xs text-gray-500 mb-1 uppercase tracking-wider">Trainer</p>
                <p className="text-sm font-medium text-white">{item.trainer}</p>
                <p className="text-xs text-gray-500">{item.qual}</p>
              </div>
            )}
            <p className="text-xs text-gray-500 mb-4 italic">{item.terms}</p>
            <button className="w-full py-3 text-sm font-medium bg-gym-green text-black rounded-xl hover:bg-green-400 transition flex items-center justify-center gap-2">
              Manage Stock
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

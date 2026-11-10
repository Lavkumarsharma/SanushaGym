export default function AddOnsPage() {
  return (
    <div className="min-h-screen bg-gym-black text-white p-6">
      <nav className="mb-8 flex items-center gap-2">
        <button className="text-gym-gray hover:text-white transition">← Back</button>
        <span className="text-gym-gray text-xs">/</span>
        <h1 className="text-2xl font-bold">Add-On Marketplace</h1>
      </nav>

      <div className="bg-gym-card border border-white/10 rounded-2xl p-6">
        <h2 className="text-lg font-bold mb-6">Available Add-Ons</h2>
        <p className="text-gym-gray text-sm mb-6">
          Personal Training, Diet Plans, and Supplements. Never auto-selected in member app.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
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
          ].map((item, i) => (
            <div key={i} className="bg-gym-black border border-white/10 rounded-2xl p-6">
              <div className="w-12 h-12 rounded-xl bg-gym-blue/20 flex items-center justify-center text-lg mb-4">
                🏋️
              </div>
              <h3 className="text-lg font-bold mb-2">{item.name}</h3>
              <p className="text-xs text-gym-gray mb-3">{item.type}</p>
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-xl font-bold text-gym-green">{item.price}</p>
                  <p className="text-xs text-gray-400">Valid {item.validity}</p>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                  item.stock === 'Unlimited' ? 'bg-gym-green/10 text-gym-green' : 'bg-gym-orange/10 text-gym-orange'
                }`}>
                  {item.stock}
                </span>
              </div>
              {item.trainer !== '-' && (
                <div className="mb-4">
                  <p className="text-xs text-gray-400 mb-1">Trainer</p>
                  <p className="text-sm font-medium">{item.trainer}</p>
                  <p className="text-xs text-gray-500">{item.qual}</p>
                </div>
              )}
              <p className="text-xs text-gray-400 mb-4">{item.terms}</p>
              <button className="w-full py-3 text-sm font-medium bg-gym-green text-black rounded-xl hover:bg-green-400 transition">
                Manage Stock
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

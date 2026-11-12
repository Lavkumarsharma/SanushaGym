import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Login | FitLocal Gym',
};

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gym-black text-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="w-16 h-16 rounded-2xl bg-green-500/20 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-green-500/20">
            <span className="text-2xl">💪</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight">FitLocal Gym</h1>
          <p className="text-gray-400 mt-2">Staff Login</p>
        </div>

        <form className="space-y-6 bg-gym-card border border-white/10 rounded-3xl p-8 shadow-xl shadow-black/50">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Mobile Number</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">+91</span>
              <input
                type="tel"
                className="w-full pl-12 pr-4 py-3 bg-gym-black border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-gym-green transition"
                placeholder="98765 43210"
                maxLength={10}
              />
            </div>
          </div>

          <button
            type="button"
            className="w-full bg-gym-green text-black font-semibold py-4 rounded-xl hover:bg-green-400 transition shadow-lg shadow-green-500/20 hover:shadow-green-500/40"
          >
            Send OTP
          </button>

          <p className="text-center text-sm text-gray-400 mt-6">
            Don&apos;t have access? Contact the gym owner.
          </p>
        </form>
      </div>
    </div>
  );
}

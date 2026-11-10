import SwiftUI

/// Member Login — verified lookup using mobile number
struct MemberLoginView: View {
    @State private var phoneNumber = ""
    @State private var isVerifying = false
    @State private var verifyError: String?

    @EnvironmentObject var memberStore: MemberStore

    var body: some View {
        ZStack {
            Color.black.ignoresSafeArea()

            ScrollView {
                VStack(spacing: 30) {
                    Spacer(minLength: 60)

                    // Logo / brand
                    VStack(spacing: 12) {
                        Image(systemName: "dumbbell.fill")
                            .font(.system(size: 56, weight: .medium))
                            .foregroundColor(.green)
                        Text("FitLocal Gym")
                            .font(.system(size: 32, weight: .bold, design: .rounded))
                            .foregroundColor(.white)
                        Text("Your neighbourhood gym, closer than ever")
                            .font(.system(size: 15, weight: .medium, design: .rounded))
                            .foregroundColor(.white.opacity(0.5))
                    }

                    VStack(alignment: .leading, spacing: 12) {
                        Text("Mobile Number")
                            .font(.system(size: 14, weight: .semibold, design: .rounded))
                            .foregroundColor(.white.opacity(0.8))

                        HStack(spacing: 10) {
                            Text("+91")
                                .font(.system(size: 18, weight: .semibold, design: .rounded))
                                .foregroundColor(.white)
                                .frame(width: 48, alignment: .leading)

                            TextField("98765 43210", text: $phoneNumber)
                                .font(.system(size: 18, weight: .medium, design: .rounded))
                                .foregroundColor(.white)
                                .keyboardType(.phonePad)
                                .padding()
                                .background(
                                    RoundedRectangle(cornerRadius: 14, style: .continuous)
                                        .fill(Color.white.opacity(0.1))
                                )
                        }

                        if let error = verifyError {
                            Text(error)
                                .font(.system(size: 13, weight: .medium, design: .rounded))
                                .foregroundColor(.red)
                        }
                    }

                    Button(action: verify) {
                        HStack {
                            if isVerifying {
                                ProgressView()
                                    .scaleEffect(0.8)
                                    .foregroundColor(.white)
                            } else {
                                Text("Verify & Continue")
                                    .font(.system(size: 18, weight: .semibold, design: .rounded))
                            }
                        }
                        .foregroundColor(.black)
                        .frame(maxWidth: .infinity)
                        .padding(.vertical, 16)
                        .background(
                            RoundedRectangle(cornerRadius: 16, style: .continuous)
                                .fill(Color.green)
                        )
                        .disabled(isVerifying || phoneNumber.isEmpty)
                        .opacity((isVerifying || phoneNumber.isEmpty) ? 0.5 : 1.0)
                    }

                    VStack(spacing: 8) {
                        Divider().background(Color.white.opacity(0.2))
                        Text("Or continue as guest")
                            .font(.system(size: 13, weight: .medium, design: .rounded))
                            .foregroundColor(.white.opacity(0.5))
                    }

                    Spacer(minLength: 40)
                }
                .padding(.horizontal, 24)
            }
        }
        .navigationTitle("")
        .navigationBarHidden(true)
    }

    private func verify() {
        isVerifying = true
        Haptics.lightImpact()

        // Simulate OTP verification via Supabase Auth
        DispatchQueue.main.asyncAfter(deadline: .now() + 1.5) {
            isVerifying = false
            memberStore.currentMember = Member.sample
        }
    }
}

import SwiftUI

/// Displays the member's active membership, expiry date, and days until expiry
/// with the DaysCounter motion applied to the days-remaining count.
struct MembershipCardView: View {
    let membership: Membership
    let daysUntilExpiry: Int

    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            HStack {
                VStack(alignment: .leading, spacing: 4) {
                    Text("Active Membership")
                        .font(.system(size: 13, weight: .semibold, design: .rounded))
                        .foregroundColor(.white.opacity(0.6))
                    Text(membership.planName)
                        .font(.system(size: 20, weight: .bold, design: .rounded))
                        .foregroundColor(.white)
                }
                Spacer()
                VStack(alignment: .trailing, spacing: 4) {
                    Text("Expires")
                        .font(.system(size: 13, weight: .semibold, design: .rounded))
                        .foregroundColor(.white.opacity(0.6))
                    Text(formattedExpiryDate)
                        .font(.system(size: 16, weight: .semibold, design: .rounded))
                        .foregroundColor(daysUntilExpiry <= 7 ? .yellow : .white)
                }
            }

            Divider()
                .background(Color.white.opacity(0.2))

            HStack(spacing: 16) {
                DaysCounter(
                    count: daysUntilExpiry,
                    label: "Days Left",
                    accentColor: daysUntilExpiry <= 7 ? .yellow : .green,
                    showMilestonePulse: false
                )

                VStack(alignment: .leading, spacing: 4) {
                    HStack(spacing: 6) {
                        Text("₹\(membership.finalAmount, specifier: "%.0f")")
                            .font(.system(size: 16, weight: .bold, design: .rounded))
                            .foregroundColor(.white)
                        Text("₹\(membership.basePrice, specifier: "%.0f")")
                            .font(.system(size: 12, weight: .medium, design: .rounded))
                            .foregroundColor(.white.opacity(0.5))
                            .strikethrough()
                    }
                    Text(membership.planType.displayName)
                        .font(.system(size: 12, weight: .medium, design: .rounded))
                        .foregroundColor(.white.opacity(0.6))
                }

                Spacer()

                if membership.isActive && daysUntilExpiry <= 7 {
                    Button(action: {}) {
                        Text("Renew")
                            .font(.system(size: 14, weight: .semibold, design: .rounded))
                            .foregroundColor(.black)
                            .padding(.horizontal, 16)
                            .padding(.vertical, 8)
                            .background(Color.green)
                            .cornerRadius(10)
                    }
                }
            }
        }
        .padding(16)
        .background(
            RoundedRectangle(cornerRadius: 20, style: .continuous)
                .fill(Color.white.opacity(0.08))
                .overlay(
                    RoundedRectangle(cornerRadius: 20, style: .continuous)
                        .stroke(Color.white.opacity(0.15), lineWidth: 1)
                )
        )
    }

    private var formattedExpiryDate: String {
        let formatter = DateFormatter()
        formatter.dateStyle = .medium
        return formatter.string(from: membership.expiryDate)
    }
}

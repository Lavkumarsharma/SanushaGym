import SwiftUI

/// Renewal Screen — 3 / 6 / 12-month options with base price, discount,
/// final amount, benefits, terms and secure payment action.
///
/// Payment states: created → pending → paid/failed/refunded/reversed.
/// Membership extends ONLY after provider payment is verified.
struct RenewalView: View {
    @EnvironmentObject var memberStore: MemberStore
    @State private var selectedPlanDuration: PlanDuration = .sixMonths
    @State private var paymentState: PaymentState = .idle
    @State private var showingPaymentResult = false
    @State private var paymentResult: PaymentResult?

    enum PlanDuration: String, CaseIterable {
        case three = "3 Months"
        case six = "6 Months"
        case twelve = "12 Months"

        var months: Int {
            switch self {
            case .three: return 3
            case .six: return 6
            case .twelve: return 12
            }
        }

        var basePrice: Double {
            switch self {
            case .three: return 3999
            case .six: return 6999
            case .twelve: return 12499
            }
        }

        var discount: Double {
            switch self {
            case .three: return 0
            case .six: return 500
            case .twelve: return 1500
            }
        }

        var benefits: [String] {
            switch self {
            case .three:
                return ["Gym access", "1 guest pass/month"]
            case .six:
                return ["Gym access", "2 guest passes/month", "1 free personal training session"]
            case .twelve:
                return ["Gym access", "4 guest passes/month", "3 free personal training sessions", "Free diet plan"]
            }
        }
    }

    enum PaymentState: Equatable {
        case idle
        case created(orderId: String)
        case pending
        case paid(receiptId: String)
        case failed(reason: String)
        case refunded
        case reversed
    }

    enum PaymentResult {
        case success(receipt: String)
        case failed(reason: String)
        case refunded
        case reversed
    }

    var member: Member {
        memberStore.currentMember ?? Member.sample
    }

    var basePrice: Double {
        selectedPlanDuration.basePrice
    }
    var discount: Double {
        selectedPlanDuration.discount
    }
    var finalAmount: Double {
        basePrice - discount
    }

    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: 20) {
                Text("Renew Membership")
                    .font(.system(size: 28, weight: .bold, design: .rounded))
                    .foregroundColor(.white)
                Text("Your current plan expires on \(formatted(member.membership.expiryDate))")
                    .font(.system(size: 15, weight: .medium, design: .rounded))
                    .foregroundColor(.white.opacity(0.5))

                // Plan selector
                planSelectorSection

                // Pricing breakdown
                pricingBreakdownSection

                // Benefits
                benefitsSection

                // Terms
                termsSection

                // Payment action
                paymentActionSection

                // Payment state indicator
                if paymentState != .idle {
                    paymentStateSection
                }
            }
            .padding(16)
            .padding(.bottom, 30)
        }
        .background(Color.black.ignoresSafeArea())
        .navigationTitle("Renewal")
        .navigationBarTitleDisplayMode(.inline)
        .sheet(isPresented: $showingPaymentResult) {
            PaymentResultSheet(result: paymentResult!) {
                showingPaymentResult = false
                paymentResult = nil
                if case .success = paymentResult {
                    paymentState = .idle
                }
            }
        }
    }

    // MARK: - Plan Selector

    private var planSelectorSection: some View {
        VStack(alignment: .leading, spacing: 12) {
            Text("Choose Plan")
                .font(.system(size: 16, weight: .semibold, design: .rounded))
                .foregroundColor(.white)

            HStack(spacing: 10) {
                ForEach(PlanDuration.allCases, id: \.self) { duration in
                    PlanButton(
                        duration: duration,
                        isSelected: selectedPlanDuration == duration
                    ) {
                        withAnimation(.spring(response: 0.3, dampingFraction: 0.8)) {
                            selectedPlanDuration = duration
                        }
                        Haptics.lightImpact()
                    }
                }
            }
        }
    }

    // MARK: - Pricing Breakdown

    private var pricingBreakdownSection: some View {
        VStack(alignment: .leading, spacing: 10) {
            Text("Pricing")
                .font(.system(size: 16, weight: .semibold, design: .rounded))
                .foregroundColor(.white)

            PricingRow(label: "Base Price", value: "₹\(Int(basePrice))", color: .white.opacity(0.7))
            PricingRow(label: "Discount", value: "-₹\(Int(discount))", color: .green)
            Divider().background(Color.white.opacity(0.2))
            PricingRow(label: "Final Amount", value: "₹\(Int(finalAmount))", color: .green, isBold: true)
        }
        .padding(16)
        .background(
            RoundedRectangle(cornerRadius: 16, style: .continuous)
                .fill(Color.white.opacity(0.06))
        )
    }

    // MARK: - Benefits

    private var benefitsSection: some View {
        VStack(alignment: .leading, spacing: 10) {
            Text("Included Benefits")
                .font(.system(size: 16, weight: .semibold, design: .rounded))
                .foregroundColor(.white)

            ForEach(selectedPlanDuration.benefits, id: \.self) { benefit in
                BenefitRow(text: benefit)
            }
        }
        .padding(16)
        .background(
            RoundedRectangle(cornerRadius: 16, style: .continuous)
                .fill(Color.white.opacity(0.06))
        )
    }

    // MARK: - Terms

    private var termsSection: some View {
        VStack(alignment: .leading, spacing: 10) {
            Text("Terms")
                .font(.system(size: 16, weight: .semibold, design: .rounded))
                .foregroundColor(.white)

            VStack(alignment: .leading, spacing: 6) {
                TermRow(text: "Membership activates only after payment is verified by the provider.")
                TermRow(text: "Simulated payments until a real provider is connected. No card/UPI details stored.")
                TermRow(text: "No refunds once membership is activated, except as per provider policy.")
                TermRow(text: "Add-ons are never auto-selected. Cancel within terms for eligible refunds.")
            }
        }
        .padding(16)
        .background(
            RoundedRectangle(cornerRadius: 16, style: .continuous)
                .fill(Color.white.opacity(0.04))
                .overlay(
                    RoundedRectangle(cornerRadius: 16, style: .continuous)
                        .stroke(Color.white.opacity(0.1), lineWidth: 1)
                )
        )
    }

    // MARK: - Payment Action

    private var paymentActionSection: some View {
        VStack(alignment: .leading, spacing: 12) {
            Text("Secure Payment")
                .font(.system(size: 16, weight: .semibold, design: .rounded))
                .foregroundColor(.white)

            Button(action: initiatePayment) {
                HStack(spacing: 10) {
                    if paymentState == .pending {
                        ProgressView()
                            .scaleEffect(0.8)
                            .foregroundColor(.white)
                    } else {
                        Image(systemName: "lock.fill")
                            .font(.system(size: 18, weight: .medium))
                    }
                    Text(paymentButtonTitle)
                        .font(.system(size: 17, weight: .semibold, design: .rounded))
                }
                .foregroundColor(.black)
                .frame(maxWidth: .infinity)
                .padding(.vertical, 16)
                .background(
                    RoundedRectangle(cornerRadius: 16, style: .continuous)
                        .fill(Color.green)
                )
                .disabled(paymentState == .pending)
                .opacity(paymentState == .pending ? 0.7 : 1.0)
            }
            .buttonStyle(PlainButtonStyle())

            Text("UPI / Card / Wallet • ₹\(Int(finalAmount))")
                .font(.system(size: 12, weight: .medium, design: .rounded))
                .foregroundColor(.white.opacity(0.5))
        }
    }

    // MARK: - Payment State

    private var paymentStateSection: some View {
        VStack(alignment: .leading, spacing: 10) {
            HStack(spacing: 8) {
                Image(systemName: stateIcon)
                    .foregroundColor(stateColor)
                Text(stateTitle)
                    .font(.system(size: 14, weight: .semibold, design: .rounded))
                    .foregroundColor(stateColor)
            }

            if case .created(let orderId) = paymentState {
                Text("Order ID: \(orderId)")
                    .font(.system(size: 12, weight: .medium, design: .rounded))
                    .foregroundColor(.white.opacity(0.5))
            }
        }
        .padding(12)
        .background(
            RoundedRectangle(cornerRadius: 12, style: .continuous)
                .fill(stateColor.opacity(0.1))
        )
    }

    // MARK: - Actions

    private func initiatePayment() {
        paymentState = .pending
        Haptics.lightImpact()

        // Simulate payment provider (3 seconds)
        DispatchQueue.main.asyncAfter(deadline: .now() + 3) {
            let success = Bool.random() // Simulate success/failure
            if success {
                let receiptId = "RCPT-\(Int.random(in: 10000...99999))"
                paymentState = .paid(receiptId: receiptId)
                paymentResult = .success(receipt: receiptId)
                showingPaymentResult = true
                Haptics.success()
            } else {
                paymentState = .failed(reason: "Payment declined by provider")
                paymentResult = .failed(reason: "Payment declined by provider")
                showingPaymentResult = true
                Haptics.error()
            }
        }
    }

    // MARK: - Helpers

    private var paymentButtonTitle: String {
        switch paymentState {
        case .idle, .created, .failed: return "Pay ₹\(Int(finalAmount))"
        case .pending: return "Processing…"
        case .paid: return "Payment Verified"
        case .refunded, .reversed: return "Payment Reversed"
        }
    }

    private var stateIcon: String {
        switch paymentState {
        case .idle, .created: return "lock.fill"
        case .pending: return "clock.fill"
        case .paid: return "checkmark.circle.fill"
        case .failed: return "xmark.circle.fill"
        case .refunded, .reversed: return "arrow.uturn.backward.circle"
        }
    }

    private var stateColor: Color {
        switch paymentState {
        case .idle, .created: return .blue
        case .pending: return .yellow
        case .paid: return .green
        case .failed: return .red
        case .refunded, .reversed: return .orange
        }
    }

    private func formatted(_ date: Date) -> String {
        let f = DateFormatter()
        f.dateStyle = .medium
        return f.string(from: date)
    }
}

// MARK: - Supporting Views

private struct PlanButton: View {
    let duration: RenewalView.PlanDuration
    let isSelected: Bool
    let action: () -> Void

    var body: some View {
        Button(action: action) {
            VStack(spacing: 8) {
                Text(duration.rawValue)
                    .font(.system(size: 14, weight: .bold, design: .rounded))
                Text("₹\(Int(duration.finalAmount))")
                    .font(.system(size: 12, weight: .medium, design: .rounded))
                if duration.discount > 0 {
                    Text("Save ₹\(Int(duration.discount))")
                        .font(.system(size: 9, weight: .medium, design: .rounded))
                        .foregroundColor(.green)
                }
            }
            .foregroundColor(isSelected ? .black : .white)
            .padding(.vertical, 12)
            .frame(maxWidth: .infinity)
            .background(
                RoundedRectangle(cornerRadius: 14, style: .continuous)
                    .fill(isSelected ? Color.green : Color.white.opacity(0.06))
                    .overlay(
                        RoundedRectangle(cornerRadius: 14, style: .continuous)
                            .stroke(isSelected ? Color.green : Color.white.opacity(0.1), lineWidth: 1)
                    )
            )
        }
        .buttonStyle(PlainButtonStyle())
    }
}

private struct PricingRow: View {
    let label: String
    let value: String
    let color: Color
    var isBold: Bool = false

    var body: some View {
        HStack {
            Text(label)
                .font(.system(size: 13, weight: .medium, design: .rounded))
                .foregroundColor(.white.opacity(0.6))
            Spacer()
            Text(value)
                .font(.system(size: 14, weight: isBold ? .bold : .medium, design: .rounded))
                .foregroundColor(color)
        }
    }
}

private struct BenefitRow: View {
    let text: String

    var body: some View {
        HStack(spacing: 8) {
            Image(systemName: "checkmark.circle.fill")
                .font(.system(size: 14))
                .foregroundColor(.green)
            Text(text)
                .font(.system(size: 13, weight: .medium, design: .rounded))
                .foregroundColor(.white)
        }
    }
}

private struct TermRow: View {
    let text: String

    var body: some View {
        HStack(alignment: .top, spacing: 6) {
            Text("•")
                .font(.system(size: 12, weight: .bold))
                .foregroundColor(.white.opacity(0.3))
            Text(text)
                .font(.system(size: 12, weight: .medium, design: .rounded))
                .foregroundColor(.white.opacity(0.7))
        }
    }
}

// MARK: - Payment Result Sheet

struct PaymentResultSheet: View {
    let result: RenewalView.PaymentResult
    let onDismiss: () -> Void

    var body: some View {
        ZStack {
            Color.black.ignoresSafeArea()

            VStack(spacing: 20) {
                Image(systemName: iconName)
                    .font(.system(size: 56, weight: .medium))
                    .foregroundColor(iconColor)

                Text(title)
                    .font(.system(size: 22, weight: .bold, design: .rounded))
                    .foregroundColor(.white)

                Text(message)
                    .font(.system(size: 15, weight: .medium, design: .rounded))
                    .foregroundColor(.white.opacity(0.8))
                    .multilineTextAlignment(.center)

                if case .success(let receipt) = result {
                    Text("Receipt: \(receipt)")
                        .font(.system(size: 13, weight: .medium, design: .rounded))
                        .foregroundColor(.white.opacity(0.5))
                }

                Button("Done") {
                    onDismiss()
                }
                .font(.system(size: 16, weight: .semibold, design: .rounded))
                .foregroundColor(.black)
                .frame(maxWidth: .infinity)
                .padding(.vertical, 14)
                .background(Color.white)
                .cornerRadius(12)
            }
            .padding(30)
        }
    }

    private var iconName: String {
        switch result {
        case .success: return "checkmark.circle.fill"
        case .failed: return "xmark.circle.fill"
        case .refunded: return "arrow.uturn.backward.circle"
        case .reversed: return "arrow.uturn.backward.circle"
        }
    }

    private var iconColor: Color {
        switch result {
        case .success: return .green
        case .failed: return .red
        case .refunded, .reversed: return .orange
        }
    }

    private var title: String {
        switch result {
        case .success: return "Payment Successful"
        case .failed: return "Payment Failed"
        case .refunded: return "Refunded"
        case .reversed: return "Reversed"
        }
    }

    private var message: String {
        switch result {
        case .success: return "Your membership has been activated. Receipt issued."
        case .failed(let reason): return "\(reason). Membership not extended."
        case .refunded: return "Payment refunded. Membership unchanged."
        case .reversed: return "Payment reversed. Membership unchanged."
        }
    }
}

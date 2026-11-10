import SwiftUI

/// A gym-themed days counter with spring-animated number transitions
/// and milestone celebration pulses.
///
/// Motion behavior:
/// - Number morphs with a spring (response: 0.35s, damping: 0.8)
/// - Milestone values (7, 14, 21, 30, 60, 90, 180, 365) trigger a brief
///   scale pulse (1.0 → 1.15 → 1.0, 0.3s ease-out) + success haptic
/// - Regular increments trigger a light impact haptic
/// - Respects Reduce Motion (falls back to static number)
/// - Accessibility-labeled for VoiceOver
public struct DaysCounter: View {
    public let count: Int
    public let label: String
    public let accentColor: Color
    public let showMilestonePulse: Bool

    @State private var animatedCount: Int = 0
    @State private var isPulsing = false
    @State private var previousCount: Int = 0

    public init(
        count: Int,
        label: String = "Days",
        accentColor: Color = .green,
        showMilestonePulse: Bool = true
    ) {
        self.count = count
        self.label = label
        self.accentColor = accentColor
        self.showMilestonePulse = showMilestonePulse
    }

    public var body: some View {
        VStack(spacing: 6) {
            ZStack {
                if Accessibility.reduceMotionEnabled {
                    Text("\(count)")
                        .font(.system(size: 48, weight: .bold, design: .rounded))
                        .foregroundColor(.white)
                } else {
                    Text("\(animatedCount)")
                        .font(.system(size: 48, weight: .bold, design: .rounded))
                        .foregroundColor(.white)
                        .scaleEffect(isPulsing ? 1.15 : 1.0)
                        .animation(
                            .spring(response: 0.35, dampingFraction: 0.8, blendDuration: 0.1),
                            value: animatedCount
                        )
                        .animation(
                            .easeOut(duration: 0.3).repeatCount(1, autoreverses: true),
                            value: isPulsing
                        )
                }
            }
            .frame(minHeight: 60)

            Text(label.uppercased())
                .font(.system(size: 14, weight: .semibold, design: .rounded))
                .foregroundColor(.white.opacity(0.7))
                .tracking(1)
        }
        .padding(.vertical, 12)
        .padding(.horizontal, 16)
        .background(
            RoundedRectangle(cornerRadius: 16, style: .continuous)
                .fill(Color.white.opacity(0.1))
                .overlay(
                    RoundedRectangle(cornerRadius: 16, style: .continuous)
                        .stroke(accentColor.opacity(0.3), lineWidth: 1)
                )
        )
        .contentShape(RoundedRectangle(cornerRadius: 16, style: .continuous))
        .onChange(of: count) { newValue in
            previousCount = animatedCount
            animatedCount = newValue

            if showMilestonePulse && isMilestone(newValue) {
                withAnimation {
                    isPulsing = true
                }
                DispatchQueue.main.asyncAfter(deadline: .now() + 0.3) {
                    withAnimation {
                        isPulsing = false
                    }
                }
                Haptics.success()
            } else if newValue != previousCount {
                Haptics.lightImpact()
            }
        }
        .onAppear {
            animatedCount = count
        }
        .accessibilityElement(children: .ignore)
        .accessibilityLabel("\(label): \(count)")
        .accessibilityValue(Text("\(count) \(label.lowercased())"))
        .accessibilityAddTraits(.updatesFrequently)
    }

    private func isMilestone(_ value: Int) -> Bool {
        [7, 14, 21, 30, 60, 90, 180, 365].contains(value)
    }
}

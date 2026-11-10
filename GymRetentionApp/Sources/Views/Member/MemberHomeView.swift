import SwiftUI

/// Member Home Screen — Gym Retention App
///
/// Features the DaysCounter motion for both the attendance streak and
/// days-until-expiry counter, plus QR check-in, weekly goal, and quick actions.
struct MemberHomeView: View {
    @EnvironmentObject var memberStore: MemberStore
    @EnvironmentObject var attendanceStore: AttendanceStore

    @State private var showingCheckIn = false
    @State private var checkInResult: CheckInResult?
    @State private var animateCheckIn = false
    @State private var showingQRScanner = false
    @State private var selectedTab: HomeTab = .home

    enum HomeTab: String, CaseIterable {
        case home = "Home"
        case checkIn = "Check-In"
        case history = "History"
        case addOns = "Add-Ons"
        case renewal = "Renewal"
        case settings = "Settings"
    }

    enum CheckInResult {
        case success, duplicate, invalid, expired, offline
    }

    var member: Member {
        memberStore.currentMember ?? Member.sample
    }

    var body: some View {
        NavigationView {
            ZStack {
                Color.black.ignoresSafeArea()

                TabView(selection: $selectedTab) {
                    // Home tab
                    homeContent
                        .tabItem {
                            Image(systemName: "house.fill")
                            Text("Home")
                        }
                        .tag(HomeTab.home)

                    // Check-In tab (QR scanner)
                    NavigationView {
                        QRCheckInView()
                    }
                    .tabItem {
                        Image(systemName: "qrcode.viewfinder")
                        Text("Check-In")
                    }
                    .tag(HomeTab.checkIn)

                    // History tab
                    NavigationView {
                        AttendanceHistoryView()
                    }
                    .tabItem {
                        Image(systemName: "clock.fill")
                        Text("History")
                    }
                    .tag(HomeTab.history)

                    // Add-Ons tab
                    NavigationView {
                        AddOnsView()
                    }
                    .tabItem {
                        Image(systemName: "plus.circle.fill")
                        Text("Add-Ons")
                    }
                    .tag(HomeTab.addOns)

                    // Renewal tab
                    NavigationView {
                        RenewalView()
                    }
                    .tabItem {
                        Image(systemName: "arrow.clockwise")
                        Text("Renewal")
                    }
                    .tag(HomeTab.renewal)

                    // Settings tab
                    NavigationView {
                        SettingsView()
                    }
                    .tabItem {
                        Image(systemName: "gearshape.fill")
                        Text("Settings")
                    }
                    .tag(HomeTab.settings)
                }
                .tint(.green)

                // Check-in result overlay
                if let result = checkInResult {
                    CheckInResultOverlay(result: result) {
                        withAnimation(.spring(response: 0.4, dampingFraction: 0.8)) {
                            checkInResult = nil
                        }
                    }
                    .transition(.opacity.combined(with: .scale(scale: 0.9)))
                    .zIndex(100)
                }
            }
        }
        .onAppear {
            Task {
                await memberStore.loadMember()
            }
        }
    }

    // MARK: - Home Content (original scrollable home screen)

    private var homeContent: some View {
        ScrollView {
            VStack(spacing: 20) {
                // Header
                headerSection

                // Membership card with DaysCounter (days until expiry)
                MembershipCardView(
                    membership: member.membership,
                    daysUntilExpiry: member.daysUntilExpiry
                )

                // Streak counter with DaysCounter motion
                streakSection

                // Weekly attendance goal
                weeklyGoalSection

                // Quick actions
                quickActionsSection

                // Recent attendance
                recentAttendanceSection

                Spacer(minLength: 40)
            }
            .padding(.horizontal, 20)
            .padding(.top, 8)
        }
    }

    // MARK: - Header

    private var headerSection: some View {
        HStack {
            VStack(alignment: .leading, spacing: 4) {
                Text("Namaste, \(member.name.components(separatedBy: " ").first ?? member.name)")
                    .font(.system(size: 24, weight: .bold, design: .rounded))
                    .foregroundColor(.white)
                Text("Ready for today's workout?")
                    .font(.system(size: 14, weight: .medium, design: .rounded))
                    .foregroundColor(.white.opacity(0.6))
            }
            Spacer()
            Circle()
                .fill(Color.green.opacity(0.2))
                .frame(width: 48, height: 48)
                .overlay(
                    Text(String(member.name.prefix(1)).uppercased())
                        .font(.system(size: 18, weight: .bold, design: .rounded))
                        .foregroundColor(.green)
                )
        }
    }

    // MARK: - Streak

    private var streakSection: some View {
        VStack(alignment: .leading, spacing: 12) {
            HStack {
                Text("Your Streak")
                    .font(.system(size: 16, weight: .semibold, design: .rounded))
                    .foregroundColor(.white)
                Spacer()
                Text("\(member.totalCheckIns) total check-ins")
                    .font(.system(size: 13, weight: .medium, design: .rounded))
                    .foregroundColor(.white.opacity(0.5))
            }

            DaysCounter(
                count: member.currentStreak,
                label: "Days",
                accentColor: .green,
                showMilestonePulse: true
            )
            .onTapGesture {
                Haptics.lightImpact()
            }

            Text("Keep it going! Every check-in counts.")
                .font(.system(size: 13, weight: .medium, design: .rounded))
                .foregroundColor(.white.opacity(0.5))
        }
        .padding(16)
        .background(
            RoundedRectangle(cornerRadius: 20, style: .continuous)
                .fill(Color.white.opacity(0.08))
                .overlay(
                    RoundedRectangle(cornerRadius: 20, style: .continuous)
                        .stroke(Color.green.opacity(0.3), lineWidth: 1)
                )
        )
    }

    // MARK: - Weekly Goal

    private var weeklyGoalSection: some View {
        VStack(alignment: .leading, spacing: 12) {
            HStack {
                Text("Weekly Goal")
                    .font(.system(size: 16, weight: .semibold, design: .rounded))
                    .foregroundColor(.white)
                Spacer()
                Text("4 / 4 this week")
                    .font(.system(size: 14, weight: .semibold, design: .rounded))
                    .foregroundColor(.green)
            }

            // Progress visualization
            GeometryReader { geometry in
                ZStack(alignment: .leading) {
                    RoundedRectangle(cornerRadius: 6)
                        .fill(Color.white.opacity(0.15))
                        .frame(height: 8)

                    RoundedRectangle(cornerRadius: 6)
                        .fill(Color.green)
                        .frame(width: geometry.size.width, height: 8)
                        .animation(.spring(response: 0.5, dampingFraction: 0.8), value: 4)
                }
            }
            .frame(height: 8)

            HStack(spacing: 20) {
                ForEach(1...4, id: \.self) { day in
                    DayCircle(day: day, isCompleted: day <= 4)
                }
            }
        }
        .padding(16)
        .background(
            RoundedRectangle(cornerRadius: 20, style: .continuous)
                .fill(Color.white.opacity(0.08))
        )
    }

    // MARK: - Check-in

    private var checkInSection: some View {
        VStack(alignment: .leading, spacing: 12) {
            HStack {
                Text("Check-In")
                    .font(.system(size: 16, weight: .semibold, design: .rounded))
                    .foregroundColor(.white)
                Spacer()
            }

            Button(action: {
                showingCheckIn = true
                Task {
                    await attendanceStore.recordCheckIn()
                    withAnimation(.spring(response: 0.4, dampingFraction: 0.8)) {
                        animateCheckIn.toggle()
                    }
                    Haptics.success()
                }
            }) {
                HStack(spacing: 12) {
                    Image(systemName: "qrcode.viewfinder")
                        .font(.system(size: 22, weight: .medium))
                    Text("Scan QR to Check-In")
                        .font(.system(size: 18, weight: .semibold, design: .rounded))
                    Spacer()
                    Image(systemName: "chevron.right")
                        .font(.system(size: 16, weight: .medium))
                }
                .foregroundColor(.black)
                .padding(.horizontal, 20)
                .padding(.vertical, 16)
                .background(
                    RoundedRectangle(cornerRadius: 16, style: .continuous)
                        .fill(Color.green)
                )
                .scaleEffect(animateCheckIn ? 0.95 : 1.0)
                .animation(.spring(response: 0.3, dampingFraction: 0.7), value: animateCheckIn)
            }
            .buttonStyle(PlainButtonStyle())

            Text("Session-bound QR • Valid for 10 minutes")
                .font(.system(size: 12, weight: .medium, design: .rounded))
                .foregroundColor(.white.opacity(0.4))
        }
        .padding(16)
        .background(
            RoundedRectangle(cornerRadius: 20, style: .continuous)
                .fill(Color.white.opacity(0.08))
        )
    }

    // MARK: - Quick Actions

    private var quickActionsSection: some View {
        LazyVGrid(columns: [
            GridItem(.flexible()),
            GridItem(.flexible()),
            GridItem(.flexible())
        ], spacing: 12) {
            QuickActionCard(
                icon: "calendar",
                title: "Attendance",
                subtitle: "View history",
                color: .blue
            )
            QuickActionCard(
                icon: "creditcard",
                title: "Renewal",
                subtitle: member.isExpiringSoon ? "Expires soon" : "Plan ahead",
                color: member.isExpiringSoon ? .yellow : .purple
            )
            QuickActionCard(
                icon: "dumbbell.fill",
                title: "Add-Ons",
                subtitle: "PT • Diet • Supplements",
                color: .orange
            )
        }
    }

    // MARK: - Recent Attendance

    private var recentAttendanceSection: some View {
        VStack(alignment: .leading, spacing: 12) {
            HStack {
                Text("Recent Check-Ins")
                    .font(.system(size: 16, weight: .semibold, design: .rounded))
                    .foregroundColor(.white)
                Spacer()
                Text("See all")
                    .font(.system(size: 13, weight: .medium, design: .rounded))
                    .foregroundColor(.green)
            }

            if attendanceStore.recentAttendances.isEmpty {
                EmptyStateView(
                    icon: "clock.fill",
                    title: "No check-ins yet",
                    subtitle: "Scan the gym QR to start your streak."
                )
            } else {
                ForEach(Array(attendanceStore.recentAttendances.prefix(5).enumerated()), id: \.element.id) { index, attendance in
                    AttendanceRow(attendance: attendance)
                    if index < min(attendanceStore.recentAttendances.count, 5) - 1 {
                        Divider().background(Color.white.opacity(0.1))
                    }
                }
            }
        }
        .padding(16)
        .background(
            RoundedRectangle(cornerRadius: 20, style: .continuous)
                .fill(Color.white.opacity(0.08))
        )
    }
}

// MARK: - Supporting Views

private struct DayCircle: View {
    let day: Int
    let isCompleted: Bool

    var body: some View {
        ZStack {
            Circle()
                .fill(isCompleted ? Color.green : Color.white.opacity(0.1))
                .frame(width: 32, height: 32)

            if isCompleted {
                Image(systemName: "checkmark")
                    .font(.system(size: 14, weight: .bold))
                    .foregroundColor(.black)
            } else {
                Text("\(day)")
                    .font(.system(size: 14, weight: .medium, design: .rounded))
                    .foregroundColor(.white.opacity(0.5))
            }
        }
        .scaleEffect(isCompleted ? 1.1 : 1.0)
        .animation(.spring(response: 0.4, dampingFraction: 0.7), value: isCompleted)
    }
}

private struct QuickActionCard: View {
    let icon: String
    let title: String
    let subtitle: String
    let color: Color

    var body: some View {
        VStack(spacing: 10) {
            Image(systemName: icon)
                .font(.system(size: 22, weight: .medium))
                .foregroundColor(color)
            Text(title)
                .font(.system(size: 14, weight: .semibold, design: .rounded))
                .foregroundColor(.white)
            Text(subtitle)
                .font(.system(size: 11, weight: .medium, design: .rounded))
                .foregroundColor(.white.opacity(0.5))
                .multilineTextAlignment(.center)
        }
        .padding(.vertical, 14)
        .frame(maxWidth: .infinity)
        .background(
            RoundedRectangle(cornerRadius: 16, style: .continuous)
                .fill(Color.white.opacity(0.06))
        )
    }
}

private struct AttendanceRow: View {
    let attendance: Attendance

    var body: some View {
        HStack(spacing: 12) {
            Circle()
                .fill(Color.green)
                .frame(width: 8, height: 8)

            VStack(alignment: .leading, spacing: 2) {
                Text(formattedTime)
                    .font(.system(size: 14, weight: .medium, design: .rounded))
                    .foregroundColor(.white)
                Text(sourceLabel)
                    .font(.system(size: 11, weight: .medium, design: .rounded))
                    .foregroundColor(.white.opacity(0.5))
            }

            Spacer()

            Text(formattedDate)
                .font(.system(size: 12, weight: .medium, design: .rounded))
                .foregroundColor(.white.opacity(0.4))
        }
        .padding(.vertical, 4)
    }

    private var formattedTime: String {
        let formatter = DateFormatter()
        formatter.timeStyle = .short
        return formatter.string(from: attendance.checkInTime)
    }

    private var formattedDate: String {
        let formatter = DateFormatter()
        formatter.dateStyle = .medium
        return formatter.string(from: attendance.checkInTime)
    }

    private var sourceLabel: String {
        switch attendance.source {
        case .qr: return "QR Check-In"
        case .assisted: return "Assisted"
        case .offline: return "Offline (sync pending)"
        }
    }
}

private struct EmptyStateView: View {
    let icon: String
    let title: String
    let subtitle: String

    var body: some View {
        VStack(spacing: 10) {
            Image(systemName: icon)
                .font(.system(size: 32, weight: .medium))
                .foregroundColor(.white.opacity(0.3))
            Text(title)
                .font(.system(size: 15, weight: .semibold, design: .rounded))
                .foregroundColor(.white)
            Text(subtitle)
                .font(.system(size: 13, weight: .medium, design: .rounded))
                .foregroundColor(.white.opacity(0.5))
                .multilineTextAlignment(.center)
        }
        .padding(.vertical, 24)
        .frame(maxWidth: .infinity)
    }
}

// MARK: - Check-In Result Overlay

struct CheckInResultOverlay: View {
    let result: MemberHomeView.CheckInResult
    let onDismiss: () -> Void

    var body: some View {
        VStack(spacing: 16) {
            Image(systemName: iconName)
                .font(.system(size: 48, weight: .medium))
                .foregroundColor(iconColor)

            Text(title)
                .font(.system(size: 20, weight: .bold, design: .rounded))
                .foregroundColor(.white)

            Text(message)
                .font(.system(size: 15, weight: .medium, design: .rounded))
                .foregroundColor(.white.opacity(0.8))
                .multilineTextAlignment(.center)

            Button(action: onDismiss) {
                Text("Got it")
                    .font(.system(size: 16, weight: .semibold, design: .rounded))
                    .foregroundColor(.black)
                    .padding(.horizontal, 24)
                    .padding(.vertical, 10)
                    .background(Color.white)
                    .cornerRadius(12)
            }
        }
        .padding(24)
        .background(
            RoundedRectangle(cornerRadius: 24, style: .continuous)
                .fill(Color.white.opacity(0.95))
                .shadow(color: .black.opacity(0.3), radius: 20, x: 0, y: 10)
        )
        .padding(.horizontal, 40)
    }

    private var iconName: String {
        switch result {
        case .success: return "checkmark.circle.fill"
        case .duplicate: return "exclamationmark.triangle.fill"
        case .invalid: return "xmark.circle.fill"
        case .expired: return "clock.fill"
        case .offline: return "wifi.slash"
        }
    }

    private var iconColor: Color {
        switch result {
        case .success: return .green
        case .duplicate, .invalid: return .orange
        case .expired: return .yellow
        case .offline: return .gray
        }
    }

    private var title: String {
        switch result {
        case .success: return "Check-In Successful"
        case .duplicate: return "Duplicate Scan"
        case .invalid: return "Invalid QR"
        case .expired: return "Membership Expired"
        case .offline: return "Offline Mode"
        }
    }

    private var message: String {
        switch result {
        case .success: return "Your attendance has been recorded. Streak updated!"
        case .duplicate: return "You already checked in within the last 10 minutes."
        case .invalid: return "Please scan a valid session-bound QR code."
        case .expired: return "Your membership has expired. Please renew to check in."
        case .offline: return "You're offline. This check-in will sync when you're back online."
        }
    }
}

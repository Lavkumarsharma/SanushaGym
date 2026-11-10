import SwiftUI

/// Owner Dashboard — command center for gym owner/manager/front-desk.
///
/// Actionable lists over decorative charts. Dark, trustworthy gym aesthetic.
/// Hinglish labels, rupee amounts.
struct OwnerDashboardView: View {
    @EnvironmentObject var ownerStore: OwnerStore
    @State private var selectedTab: DashboardTab = .overview
    @State private var showingRedListDetail: RedListMember?
    @State private var showingFollowUp: FollowUp?
    @State private var showingNoShowThreshold = false

    enum DashboardTab: String, CaseIterable {
        case overview = "Overview"
        case redList = "Red List"
        case followUps = "Follow-Ups"
        case renewals = "Renewals"
        case addOns = "Add-Ons"
    }

    var body: some View {
        NavigationView {
            ZStack {
                Color.black.ignoresSafeArea()

                ScrollView {
                    VStack(spacing: 18) {
                        // Header
                        ownerHeader

                        // Dashboard cards (overview tab)
                        if selectedTab == .overview {
                            dashboardCardsSection

                            // Quick actions
                            quickActionsSection

                            // Red-list preview (top 5)
                            redListPreviewSection
                        }

                        // Tab-specific content
                        tabContent
                    }
                    .padding(.horizontal, 16)
                    .padding(.top, 8)
                    .padding(.bottom, 24)
                }

                // Red-list detail sheet
                if let member = showingRedListDetail {
                    RedListDetailSheet(member: member) {
                        showingRedListDetail = nil
                    }
                    .transition(.move(edge: .bottom).combined(with: .opacity))
                    .zIndex(100)
                }

                // Follow-up sheet
                if let followUp = showingFollowUp {
                    FollowUpSheet(followUp: followUp) {
                        showingFollowUp = nil
                    }
                    .transition(.move(edge: .bottom).combined(with: .opacity))
                    .zIndex(101)
                }
            }
            .navigationTitle("Owner Dashboard")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .navigationBarTrailing) {
                    Menu {
                        ForEach(DashboardTab.allCases, id: \.self) { tab in
                            Button(tab.rawValue) {
                                withAnimation(.spring(response: 0.3, dampingFraction: 0.8)) {
                                    selectedTab = tab
                                }
                            }
                        }
                    } label: {
                        Image(systemName: "line.horizontal.3.decrease.circle")
                            .foregroundColor(.white)
                    }
                }
                ToolbarItem(placement: .navigationBarLeading) {
                    Button {
                        showingNoShowThreshold = true
                    } label: {
                        Text("Threshold: \(ownerStore.noShowThresholdDays)d")
                            .font(.system(size: 13, weight: .medium, design: .rounded))
                            .foregroundColor(.yellow)
                    }
                }
            }
            .sheet(isPresented: $showingNoShowThreshold) {
                NoShowThresholdSettingsView(threshold: $ownerStore.noShowThresholdDays)
            }
        }
    }

    // MARK: - Header

    private var ownerHeader: some View {
        HStack {
            VStack(alignment: .leading, spacing: 4) {
                Text("FitLocal Gym")
                    .font(.system(size: 24, weight: .bold, design: .rounded))
                    .foregroundColor(.white)
                Text("Owner Command Center")
                    .font(.system(size: 13, weight: .medium, design: .rounded))
                    .foregroundColor(.white.opacity(0.5))
            }
            Spacer()
            HStack(spacing: 10) {
                StatPill(value: "\(ownerStore.members.count)", label: "Members", color: .blue)
                StatPill(value: "\(ownerStore.staff.count)", label: "Staff", color: .green)
            }
        }
        .padding(.bottom, 4)
    }

    // MARK: - Dashboard Cards

    private var dashboardCardsSection: some View {
        VStack(alignment: .leading, spacing: 12) {
            Text("Today's Pulse")
                .font(.system(size: 16, weight: .semibold, design: .rounded))
                .foregroundColor(.white)

            LazyVGrid(columns: [
                GridItem(.flexible()),
                GridItem(.flexible()),
                GridItem(.flexible())
            ], spacing: 12) {
                if let stats = ownerStore.dashboardStats {
                    DashboardCard(title: "Active Members", value: "\(stats.activeMembers)", subtitle: "Current", color: .green, icon: "person.fill")
                    DashboardCard(title: "Today's Check-Ins", value: "\(stats.todaysCheckIns)", subtitle: "Walk-ins", color: .blue, icon: "checkmark.circle.fill")
                    DashboardCard(title: "7-Day Active", value: "\(stats.sevenDayActiveMembers)", subtitle: "This week", color: .purple, icon: "calendar")
                    DashboardCard(title: "No-Show Cases", value: "\(stats.openNoShowCases)", subtitle: "Open", color: .orange, icon: "exclamationmark.triangle")
                    DashboardCard(title: "Renewals Due", value: "\(stats.renewalsDue)", subtitle: "≤ 7 days", color: .yellow, icon: "arrow.clockwise")
                    DashboardCard(title: "Add-On Revenue", value: "₹\(Int(stats.addOnRevenue))", subtitle: "This month", color: .pink, icon: "rupeesign.circle.fill")
                }
            }
        }
    }

    // MARK: - Quick Actions

    private var quickActionsSection: some View {
        VStack(alignment: .leading, spacing: 10) {
            HStack {
                Text("Quick Actions")
                    .font(.system(size: 16, weight: .semibold, design: .rounded))
                    .foregroundColor(.white)
                Spacer()
            }

            LazyVGrid(columns: [
                GridItem(.flexible()),
                GridItem(.flexible()),
                GridItem(.flexible())
            ], spacing: 12) {
                QuickActionButton(icon: "qrcode.viewfinder", title: "Assisted Check-In", color: .green) {
                    // assisted check-in
                }
                QuickActionButton(icon: "calendar.badge.plus", title: "Manage Plans", color: .blue) {
                    // manage plans
                }
                QuickActionButton(icon: "creditcard", title: "Verify Payments", color: .purple) {
                    // payment verification
                }
                QuickActionButton(icon: "list.bullet", title: "Red List", color: .orange) {
                    selectedTab = .redList
                }
                QuickActionButton(icon: "phone.fill", title: "Call Member", color: .red) {
                    // call
                }
                QuickActionButton(icon: "chart.bar.doc.horizontal", title: "Daily Summary", color: .gray) {
                    // daily summary
                }
            }
        }
    }

    // MARK: - Red List Preview

    private var redListPreviewSection: some View {
        VStack(alignment: .leading, spacing: 10) {
            HStack {
                Text("Red List — Needs Follow-Up")
                    .font(.system(size: 16, weight: .semibold, design: .rounded))
                    .foregroundColor(.white)
                Spacer()
                Button("See All") {
                    selectedTab = .redList
                }
                .font(.system(size: 13, weight: .medium, design: .rounded))
                .foregroundColor(.green)
            }

            if ownerStore.redList.isEmpty {
                EmptyStateView(icon: "checkmark.seal.fill", title: "No red-list cases", subtitle: "All members are active. Great work!")
            } else {
                ForEach(Array(ownerStore.redList.prefix(5).enumerated()), id: \.element.id) { index, redMember in
                    RedListRow(member: redMember) {
                        showingRedListDetail = redMember
                    }
                    if index < min(ownerStore.redList.count, 5) - 1 {
                        Divider().background(Color.white.opacity(0.1))
                    }
                }
                if ownerStore.redList.count > 5 {
                    Button("Show \(ownerStore.redList.count - 5) more") {
                        selectedTab = .redList
                    }
                    .font(.system(size: 13, weight: .medium, design: .rounded))
                    .foregroundColor(.green)
                    .padding(.top, 4)
                }
            }
        }
        .padding(16)
        .background(
            RoundedRectangle(cornerRadius: 18, style: .continuous)
                .fill(Color.white.opacity(0.06))
        )
    }

    // MARK: - Tab Content

    @ViewBuilder
    private var tabContent: some View {
        switch selectedTab {
        case .overview:
            EmptyView() // Already shown above
        case .redList:
            redListFullView
        case .followUps:
            followUpsView
        case .renewals:
            renewalsView
        case .addOns:
            addOnsPreviewView
        }
    }

    // MARK: - Red List Full

    private var redListFullView: some View {
        VStack(alignment: .leading, spacing: 12) {
            Text("Red List Members")
                .font(.system(size: 18, weight: .bold, design: .rounded))
                .foregroundColor(.white)
            Text("Absent ≥ \(ownerStore.noShowThresholdDays) days, active membership")
                .font(.system(size: 13, weight: .medium, design: .rounded))
                .foregroundColor(.white.opacity(0.5))

            if ownerStore.redList.isEmpty {
                EmptyStateView(icon: "checkmark.seal.fill", title: "Clean slate", subtitle: "No members need follow-up right now.")
            } else {
                List {
                    ForEach(ownerStore.redList) { redMember in
                        RedListRow(member: redMember) {
                            showingRedListDetail = redMember
                        }
                        .listRowBackground(Color.white.opacity(0.04))
                        .listRowSeparator(.hidden)
                    }
                }
                .listStyle(PlainListStyle())
            }
        }
        .padding(.top, 8)
    }

    // MARK: - Follow-Ups

    private var followUpsView: some View {
        VStack(alignment: .leading, spacing: 12) {
            Text("Follow-Up Outcomes")
                .font(.system(size: 18, weight: .bold, design: .rounded))
                .foregroundColor(.white)
            Text("Require next action date when needed")
                .font(.system(size: 13, weight: .medium, design: .rounded))
                .foregroundColor(.white.opacity(0.5))

            if ownerStore.followUps.isEmpty {
                EmptyStateView(icon: "phone.fill", title: "No follow-ups", subtitle: "All caught up.")
            } else {
                List {
                    ForEach(ownerStore.followUps) { followUp in
                        FollowUpRow(followUp: followUp) {
                            showingFollowUp = followUp
                        }
                        .listRowBackground(Color.white.opacity(0.04))
                        .listRowSeparator(.hidden)
                    }
                }
                .listStyle(PlainListStyle())
            }
        }
        .padding(.top, 8)
    }

    // MARK: - Renewals Preview

    private var renewalsView: some View {
        VStack(alignment: .leading, spacing: 12) {
            Text("Renewals Due (≤ 7 Days)")
                .font(.system(size: 18, weight: .bold, design: .rounded))
                .foregroundColor(.white)

            let expiring = ownerStore.members.filter {
                let days = Calendar.current.dateComponents([.day], from: Date(), to: $0.membership.expiryDate).day ?? 999
                return days >= 0 && days <= 7 && $0.membership.isActive
            }

            if expiring.isEmpty {
                EmptyStateView(icon: "calendar", title: "No upcoming renewals", subtitle: "All memberships are current.")
            } else {
                List {
                    ForEach(expiring) { member in
                        HStack {
                            VStack(alignment: .leading, spacing: 2) {
                                Text(member.name)
                                    .font(.system(size: 15, weight: .semibold, design: .rounded))
                                    .foregroundColor(.white)
                                Text(member.phone)
                                    .font(.system(size: 12, weight: .medium, design: .rounded))
                                    .foregroundColor(.white.opacity(0.5))
                            }
                            Spacer()
                            VStack(alignment: .trailing, spacing: 2) {
                                Text(member.membership.planName)
                                    .font(.system(size: 13, weight: .medium, design: .rounded))
                                    .foregroundColor(.white)
                                Text("Expires \(formattedDate(member.membership.expiryDate))")
                                    .font(.system(size: 12, weight: .medium, design: .rounded))
                                    .foregroundColor(.yellow)
                            }
                        }
                        .padding(.vertical, 6)
                        .contentShape(Rectangle())
                        .onTapGesture {
                            showingRedListDetail = RedListMember(
                                id: UUID(), memberId: member.id, name: member.name, phone: member.phone,
                                plan: member.membership.planName, expiry: member.membership.expiryDate,
                                lastCheckIn: nil, absentDays: 0, assignedTrainer: "", lastFollowUp: nil,
                                outcome: nil, nextActionDate: nil
                            )
                        }
                        .listRowBackground(Color.white.opacity(0.04))
                        .listRowSeparator(.hidden)
                    }
                }
                .listStyle(PlainListStyle())
            }
        }
        .padding(.top, 8)
    }

    // MARK: - Add-Ons Preview

    private var addOnsPreviewView: some View {
        VStack(alignment: .leading, spacing: 12) {
            Text("Add-On Marketplace")
                .font(.system(size: 18, weight: .bold, design: .rounded))
                .foregroundColor(.white)
            Text("PT • Diet Plans • Supplements")
                .font(.system(size: 13, weight: .medium, design: .rounded))
                .foregroundColor(.white.opacity(0.5))

            List {
                ForEach(ownerStore.addOns) { addOn in
                    HStack {
                        VStack(alignment: .leading, spacing: 2) {
                            Text(addOn.name)
                                .font(.system(size: 14, weight: .semibold, design: .rounded))
                                .foregroundColor(.white)
                            Text(addOn.type.displayName)
                                .font(.system(size: 11, weight: .medium, design: .rounded))
                                .foregroundColor(.white.opacity(0.5))
                        }
                        Spacer()
                        VStack(alignment: .trailing, spacing: 2) {
                            Text("₹\(Int(addOn.price))")
                                .font(.system(size: 14, weight: .bold, design: .rounded))
                                .foregroundColor(.green)
                            if let stock = addOn.stock {
                                Text("Stock: \(stock)")
                                    .font(.system(size: 11, weight: .medium, design: .rounded))
                                    .foregroundColor(stock > 5 ? .green : .orange)
                            }
                        }
                    }
                    .padding(.vertical, 6)
                    .listRowBackground(Color.white.opacity(0.04))
                    .listRowSeparator(.hidden)
                }
            }
            .listStyle(PlainListStyle())
        }
        .padding(.top, 8)
    }

    // MARK: - Helpers

    private func formattedDate(_ date: Date) -> String {
        let f = DateFormatter()
        f.dateStyle = .medium
        return f.string(from: date)
    }
}

// MARK: - Supporting Views

private struct StatPill: View {
    let value: String
    let label: String
    let color: Color

    var body: some View {
        HStack(spacing: 6) {
            Text(value)
                .font(.system(size: 17, weight: .bold, design: .rounded))
                .foregroundColor(color)
            Text(label)
                .font(.system(size: 11, weight: .medium, design: .rounded))
                .foregroundColor(.white.opacity(0.6))
        }
        .padding(.horizontal, 10)
        .padding(.vertical, 8)
        .background(
            RoundedRectangle(cornerRadius: 12, style: .continuous)
                .fill(color.opacity(0.15))
        )
    }
}

private struct DashboardCard: View {
    let title: String
    let value: String
    let subtitle: String
    let color: Color
    let icon: String

    var body: some View {
        VStack(alignment: .leading, spacing: 10) {
            HStack {
                Image(systemName: icon)
                    .font(.system(size: 18, weight: .medium))
                    .foregroundColor(color)
                Spacer()
            }
            Text(value)
                .font(.system(size: 22, weight: .bold, design: .rounded))
                .foregroundColor(.white)
            Text(title)
                .font(.system(size: 13, weight: .semibold, design: .rounded))
                .foregroundColor(.white.opacity(0.8))
            Text(subtitle)
                .font(.system(size: 11, weight: .medium, design: .rounded))
                .foregroundColor(.white.opacity(0.5))
        }
        .padding(14)
        .background(
            RoundedRectangle(cornerRadius: 16, style: .continuous)
                .fill(Color.white.opacity(0.06))
                .overlay(
                    RoundedRectangle(cornerRadius: 16, style: .continuous)
                        .stroke(color.opacity(0.3), lineWidth: 1)
                )
        )
    }
}

private struct QuickActionButton: View {
    let icon: String
    let title: String
    let color: Color
    let action: () -> Void

    var body: some View {
        Button(action: action) {
            VStack(spacing: 8) {
                Image(systemName: icon)
                    .font(.system(size: 22, weight: .medium))
                    .foregroundColor(color)
                Text(title)
                    .font(.system(size: 12, weight: .semibold, design: .rounded))
                    .foregroundColor(.white)
                    .multilineTextAlignment(.center)
            }
            .padding(.vertical, 14)
            .frame(maxWidth: .infinity)
            .background(
                RoundedRectangle(cornerRadius: 14, style: .continuous)
                    .fill(Color.white.opacity(0.06))
            )
        }
        .buttonStyle(PlainButtonStyle())
    }
}

private struct RedListRow: View {
    let member: RedListMember
    let onTap: () -> Void

    var body: some View {
        Button(action: onTap) {
            HStack(spacing: 12) {
                Circle()
                    .fill(Color.orange.opacity(0.2))
                    .frame(width: 44, height: 44)
                    .overlay(
                        Text(String(member.name.prefix(1)).uppercased())
                            .font(.system(size: 15, weight: .bold, design: .rounded))
                            .foregroundColor(.orange)
                    )

                VStack(alignment: .leading, spacing: 3) {
                    HStack {
                        Text(member.name)
                            .font(.system(size: 15, weight: .semibold, design: .rounded))
                            .foregroundColor(.white)
                        Spacer()
                        Text("\(member.absentDays)d")
                            .font(.system(size: 13, weight: .bold, design: .rounded))
                            .foregroundColor(.orange)
                    }
                    HStack(spacing: 6) {
                        Image(systemName: "phone.fill")
                            .font(.system(size: 11))
                            .foregroundColor(.white.opacity(0.5))
                        Text(member.phone)
                            .font(.system(size: 12, weight: .medium, design: .rounded))
                            .foregroundColor(.white.opacity(0.6))
                    }
                    HStack(spacing: 6) {
                        Image(systemName: "calendar")
                            .font(.system(size: 11))
                            .foregroundColor(.white.opacity(0.5))
                        Text(member.plan)
                            .font(.system(size: 12, weight: .medium, design: .rounded))
                            .foregroundColor(.white.opacity(0.6))
                        Text("• Expires \(formatted(member.expiry))")
                            .font(.system(size: 11, weight: .medium, design: .rounded))
                            .foregroundColor(.yellow.opacity(0.8))
                    }
                    HStack(spacing: 6) {
                        Image(systemName: "person.fill")
                            .font(.system(size: 11))
                            .foregroundColor(.white.opacity(0.5))
                        Text(member.assignedTrainer)
                            .font(.system(size: 12, weight: .medium, design: .rounded))
                            .foregroundColor(.white.opacity(0.6))
                    }
                }
                Spacer(minLength: 8)
                Image(systemName: "chevron.right")
                    .font(.system(size: 14, weight: .medium))
                    .foregroundColor(.white.opacity(0.3))
            }
            .padding(12)
            .background(
                RoundedRectangle(cornerRadius: 14, style: .continuous)
                    .fill(Color.white.opacity(0.04))
            )
        }
        .buttonStyle(PlainButtonStyle())
    }

    private func formatted(_ date: Date) -> String {
        let f = DateFormatter()
        f.dateStyle = .medium
        return f.string(from: date)
    }
}

private struct FollowUpRow: View {
    let followUp: FollowUp
    let onTap: () -> Void

    var body: some View {
        Button(action: onTap) {
            HStack(spacing: 12) {
                Circle()
                    .fill(followUpColor.opacity(0.2))
                    .frame(width: 40, height: 40)
                    .overlay(
                        Text(String(followUp.outcome.displayName.prefix(1)).uppercased())
                            .font(.system(size: 14, weight: .bold, design: .rounded))
                            .foregroundColor(followUpColor)
                    )

                VStack(alignment: .leading, spacing: 3) {
                    Text(followUp.outcome.displayName)
                        .font(.system(size: 15, weight: .semibold, design: .rounded))
                        .foregroundColor(.white)
                    Text(followUp.notes)
                        .font(.system(size: 12, weight: .medium, design: .rounded))
                        .foregroundColor(.white.opacity(0.5))
                    if let next = followUp.nextActionDate {
                        HStack(spacing: 6) {
                            Image(systemName: "calendar.badge.clock")
                                .font(.system(size: 11))
                                .foregroundColor(.white.opacity(0.5))
                            Text("Next action: \(formatted(next))")
                                .font(.system(size: 12, weight: .medium, design: .rounded))
                                .foregroundColor(.white.opacity(0.7))
                        }
                    }
                }
                Spacer()
                Image(systemName: "chevron.right")
                    .font(.system(size: 14, weight: .medium))
                    .foregroundColor(.white.opacity(0.3))
            }
            .padding(12)
            .background(
                RoundedRectangle(cornerRadius: 14, style: .continuous)
                    .fill(Color.white.opacity(0.04))
            )
        }
        .buttonStyle(PlainButtonStyle())
    }

    private var followUpColor: Color {
        switch followUp.outcome {
        case .willReturn: return .green
        case .injured, .unhappy: return .red
        case .travelling, .timingIssue: return .blue
        case .noResponse: return .gray
        case .cancelled: return .orange
        }
    }

    private func formatted(_ date: Date) -> String {
        let f = DateFormatter()
        f.dateStyle = .medium
        return f.string(from: date)
    }
}

// MARK: - Sheets

struct RedListDetailSheet: View {
    let member: RedListMember
    let onDismiss: () -> Void

    @State private var selectedOutcome: FollowUp.Outcome?
    @State private var nextActionDate: Date?
    @State private var notes = ""

    var body: some View {
        NavigationView {
            ZStack {
                Color.black.ignoresSafeArea()

                ScrollView {
                    VStack(alignment: .leading, spacing: 16) {
                        // Member info
                        VStack(alignment: .leading, spacing: 8) {
                            Text(member.name)
                                .font(.system(size: 22, weight: .bold, design: .rounded))
                                .foregroundColor(.white)
                            HStack(spacing: 6) {
                                Image(systemName: "phone.fill")
                                    .foregroundColor(.white.opacity(0.5))
                                Text(member.phone)
                                    .foregroundColor(.white.opacity(0.7))
                            }
                            .font(.system(size: 14, weight: .medium, design: .rounded))
                            HStack(spacing: 6) {
                                Image(systemName: "calendar")
                                Text("Absent \(member.absentDays) days")
                            }
                            .foregroundColor(.orange)
                            .font(.system(size: 13, weight: .medium, design: .rounded))
                            HStack(spacing: 6) {
                                Image(systemName: "person.fill")
                                Text("Trainer: \(member.assignedTrainer)")
                            }
                            .foregroundColor(.white.opacity(0.7))
                            .font(.system(size: 13, weight: .medium, design: .rounded))
                        }

                        Divider().background(Color.white.opacity(0.2))

                        // Follow-up outcome
                        VStack(alignment: .leading, spacing: 10) {
                            Text("Follow-Up Outcome")
                                .font(.system(size: 16, weight: .semibold, design: .rounded))
                                .foregroundColor(.white)

                            LazyVGrid(columns: Array(repeating: GridItem(.flexible()), count: 3), spacing: 10) {
                                ForEach(FollowUp.Outcome.allCases, id: \.self) { outcome in
                                    OutcomeButton(
                                        outcome: outcome,
                                        isSelected: selectedOutcome == outcome,
                                        requiresDate: outcome.requiresNextActionDate
                                    ) {
                                        selectedOutcome = outcome
                                        if outcome.requiresNextActionDate {
                                            nextActionDate = Calendar.current.date(byAdding: .day, value: 1, to: Date())
                                        } else {
                                            nextActionDate = nil
                                        }
                                    }
                                }
                            }
                        }

                        // Next action date
                        if selectedOutcome?.requiresNextActionDate == true {
                            VStack(alignment: .leading, spacing: 8) {
                                Text("Next Action Date")
                                    .font(.system(size: 14, weight: .semibold, design: .rounded))
                                    .foregroundColor(.white)
                                DatePicker("Select date", selection: Binding(
                                    get: { nextActionDate ?? Date() },
                                    set: { nextActionDate = $0 }
                                ), displayedComponents: .date)
                                .datePickerStyle(.graphical)
                                .accentColor(.green)
                                .foregroundColor(.white)
                            }
                        }

                        // Notes
                        VStack(alignment: .leading, spacing: 8) {
                            Text("Notes")
                                .font(.system(size: 14, weight: .semibold, design: .rounded))
                                .foregroundColor(.white)
                            TextField("e.g. Spoke to member, will return next week", text: $notes)
                                .font(.system(size: 14, weight: .medium, design: .rounded))
                                .foregroundColor(.white)
                                .padding(12)
                                .background(
                                    RoundedRectangle(cornerRadius: 12, style: .continuous)
                                        .fill(Color.white.opacity(0.08))
                                )
                        }

                        // Actions
                        HStack(spacing: 12) {
                            Button("Call") {
                                // initiate call
                            }
                            .buttonStyle(SecondaryButtonStyle())

                            Button("WhatsApp") {
                                // open WhatsApp
                            }
                            .buttonStyle(SecondaryButtonStyle())

                            Button("Mark Outcome") {
                                // save follow-up
                                let followUp = FollowUp(
                                    id: UUID(),
                                    memberId: member.memberId,
                                    outcome: selectedOutcome ?? .noResponse,
                                    nextActionDate: nextActionDate,
                                    notes: notes,
                                    createdAt: Date()
                                )
                                // Would update OwnerStore here
                                onDismiss()
                            }
                            .buttonStyle(PrimaryButtonStyle())
                        }
                    }
                    .padding(20)
                }
            }
            .navigationTitle(member.name)
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .navigationBarTrailing) {
                    Button("Done") { onDismiss() }
                        .foregroundColor(.white)
                }
            }
        }
    }
}

struct FollowUpSheet: View {
    let followUp: FollowUp
    let onDismiss: () -> Void

    var body: some View {
        NavigationView {
            ZStack {
                Color.black.ignoresSafeArea()

                ScrollView {
                    VStack(alignment: .leading, spacing: 16) {
                        Text(followUp.outcome.displayName)
                            .font(.system(size: 24, weight: .bold, design: .rounded))
                            .foregroundColor(.white)

                        HStack(spacing: 10) {
                            OutcomePill(text: followUp.outcome.displayName, color: followUpColor)
                            if let next = followUp.nextActionDate {
                                OutcomePill(text: "Next: \(formatted(next))", color: .yellow)
                            }
                        }

                        Divider().background(Color.white.opacity(0.2))

                        Text(followUp.notes)
                            .font(.system(size: 15, weight: .medium, design: .rounded))
                            .foregroundColor(.white.opacity(0.8))

                        Text("Created \(formatted(followUp.createdAt))")
                            .font(.system(size: 12, weight: .medium, design: .rounded))
                            .foregroundColor(.white.opacity(0.4))
                    }
                    .padding(20)
                }
            }
            .navigationTitle("Follow-Up")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .navigationBarTrailing) {
                    Button("Done") { onDismiss() }
                        .foregroundColor(.white)
                }
            }
        }
    }

    private var followUpColor: Color {
        switch followUp.outcome {
        case .willReturn: return .green
        case .injured, .unhappy: return .red
        case .travelling, .timingIssue: return .blue
        case .noResponse: return .gray
        case .cancelled: return .orange
        }
    }

    private func formatted(_ date: Date) -> String {
        let f = DateFormatter()
        f.dateStyle = .medium
        return f.string(from: date)
    }
}

struct OutcomeButton: View {
    let outcome: FollowUp.Outcome
    let isSelected: Bool
    let requiresDate: Bool
    let action: () -> Void

    var body: some View {
        Button(action: action) {
            VStack(spacing: 8) {
                Image(systemName: iconFor(outcome))
                    .font(.system(size: 20, weight: .medium))
                    .foregroundColor(isSelected ? .white : outcomeColor)
                Text(outcome.displayName)
                    .font(.system(size: 11, weight: .semibold, design: .rounded))
                    .foregroundColor(isSelected ? .white : outcomeColor)
                    .multilineTextAlignment(.center)
                if requiresDate {
                    Text("+ date")
                        .font(.system(size: 9, weight: .medium, design: .rounded))
                        .foregroundColor(outcomeColor.opacity(0.7))
                }
            }
            .padding(10)
            .frame(maxWidth: .infinity)
            .background(
                RoundedRectangle(cornerRadius: 12, style: .continuous)
                    .fill(isSelected ? outcomeColor : Color.white.opacity(0.05))
                    .overlay(
                        RoundedRectangle(cornerRadius: 12, style: .continuous)
                            .stroke(outcomeColor.opacity(isSelected ? 1 : 0.2), lineWidth: 1.5)
                    )
            )
        }
        .buttonStyle(PlainButtonStyle())
    }

    private var outcomeColor: Color {
        switch outcome {
        case .willReturn: return .green
        case .injured, .unhappy: return .red
        case .travelling, .timingIssue: return .blue
        case .noResponse: return .gray
        case .cancelled: return .orange
        }
    }

    private func iconFor(_ outcome: FollowUp.Outcome) -> String {
        switch outcome {
        case .willReturn: return "arrow.right.circle"
        case .injured: return "bandage"
        case .travelling: return "suitcase"
        case .timingIssue: return "clock"
        case .unhappy: return "face.frown"
        case .noResponse: return "phone.slash"
        case .cancelled: return "xmark.circle"
        }
    }
}

struct PrimaryButtonStyle: ButtonStyle {
    func makeBody(configuration: Configuration) -> some View {
        configuration.label
            .font(.system(size: 16, weight: .semibold, design: .rounded))
            .foregroundColor(.black)
            .frame(maxWidth: .infinity)
            .padding(.vertical, 12)
            .background(Color.green)
            .cornerRadius(12)
            .scaleEffect(configuration.isPressed ? 0.96 : 1.0)
            .animation(.spring(response: 0.2, dampingFraction: 0.8), value: configuration.isPressed)
    }
}

struct SecondaryButtonStyle: ButtonStyle {
    func makeBody(configuration: Configuration) -> some View {
        configuration.label
            .font(.system(size: 14, weight: .semibold, design: .rounded))
            .foregroundColor(.white)
            .frame(maxWidth: .infinity)
            .padding(.vertical, 10)
            .background(Color.white.opacity(0.1))
            .cornerRadius(12)
            .scaleEffect(configuration.isPressed ? 0.96 : 1.0)
            .animation(.spring(response: 0.2, dampingFraction: 0.8), value: configuration.isPressed)
    }
}

struct NoShowThresholdSettingsView: View {
    @Binding var threshold: Int
    @Environment(\.dismiss) var dismiss

    var body: some View {
        NavigationView {
            ZStack {
                Color.black.ignoresSafeArea()

                VStack(spacing: 24) {
                    Text("No-Show Threshold")
                        .font(.system(size: 24, weight: .bold, design: .rounded))
                        .foregroundColor(.white)

                    VStack(alignment: .leading, spacing: 10) {
                        Text("Open a no-show case when a member is absent for:")
                            .font(.system(size: 15, weight: .medium, design: .rounded))
                            .foregroundColor(.white.opacity(0.8))

                        HStack(spacing: 16) {
                            ForEach([7, 10, 14, 21, 30], id: \.self) { days in
                                ThresholdButton(days: days, isSelected: threshold == days) {
                                    threshold = days
                                    dismiss()
                                }
                            }
                        }
                    }

                    Text("Excludes paused, frozen, expired and cancelled memberships.")
                        .font(.system(size: 13, weight: .medium, design: .rounded))
                        .foregroundColor(.white.opacity(0.5))
                        .multilineTextAlignment(.center)

                    Spacer()
                }
                .padding(24)
            }
            .navigationTitle("Settings")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .navigationBarTrailing) {
                    Button("Done") { dismiss() }
                        .foregroundColor(.white)
                }
            }
        }
    }
}

struct ThresholdButton: View {
    let days: Int
    let isSelected: Bool
    let action: () -> Void

    var body: some View {
        Button(action: action) {
            Text("\(days) days")
                .font(.system(size: 14, weight: .semibold, design: .rounded))
                .foregroundColor(isSelected ? .black : .white)
                .padding(.horizontal, 16)
                .padding(.vertical, 10)
                .background(
                    RoundedRectangle(cornerRadius: 10, style: .continuous)
                        .fill(isSelected ? .green : Color.white.opacity(0.1))
                )
        }
        .buttonStyle(PlainButtonStyle())
    }
}

struct EmptyStateView: View {
    let icon: String
    let title: String
    let subtitle: String

    var body: some View {
        VStack(spacing: 12) {
            Image(systemName: icon)
                .font(.system(size: 40, weight: .medium))
                .foregroundColor(.white.opacity(0.3))
            Text(title)
                .font(.system(size: 17, weight: .semibold, design: .rounded))
                .foregroundColor(.white)
            Text(subtitle)
                .font(.system(size: 14, weight: .medium, design: .rounded))
                .foregroundColor(.white.opacity(0.5))
        }
        .frame(maxWidth: .infinity)
        .padding(.vertical, 40)
    }
}

import SwiftUI

/// Attendance History — date and time of each check-in.
struct AttendanceHistoryView: View {
    @EnvironmentObject var attendanceStore: AttendanceStore
    @State private var selectedFilter: AttendanceFilter = .all

    enum AttendanceFilter: String, CaseIterable {
        case all = "All"
        case thisWeek = "This Week"
        case thisMonth = "This Month"
    }

    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: 16) {
                Text("Attendance History")
                    .font(.system(size: 28, weight: .bold, design: .rounded))
                    .foregroundColor(.white)

                // Filter chips
                ScrollView(.horizontal, showsIndicators: false) {
                    HStack(spacing: 10) {
                        ForEach(AttendanceFilter.allCases, id: \.self) { filter in
                            FilterChip(filter: filter, isSelected: selectedFilter == filter) {
                                selectedFilter = filter
                            }
                        }
                    }
                    .padding(.horizontal, 4)
                }

                // Summary
                summarySection

                // List
                let filtered = filterAttendances()
                if filtered.isEmpty {
                    EmptyStateView(
                        icon: "calendar.badge.exclamationmark",
                        title: "No attendance records",
                        subtitle: "Check in at the gym to start building your history."
                    )
                } else {
                    ForEach(Array(filtered.enumerated()), id: \.element.id) { index, attendance in
                        AttendanceHistoryRow(attendance: attendance)
                        if index < filtered.count - 1 {
                            Divider().background(Color.white.opacity(0.1))
                        }
                    }
                }

                Spacer(minLength: 40)
            }
            .padding(16)
        }
        .background(Color.black.ignoresSafeArea())
        .navigationTitle("History")
        .navigationBarTitleDisplayMode(.inline)
    }

    private func filterAttendances() -> [Attendance] {
        let calendar = Calendar.current
        let now = Date()
        return attendanceStore.recentAttendances.filter { attendance in
            switch selectedFilter {
            case .all:
                return true
            case .thisWeek:
                return calendar.isDate(attendance.checkInTime, equalTo: now, toGranularity: .weekOfYear)
            case .thisMonth:
                return calendar.isDate(attendance.checkInTime, equalTo: now, toGranularity: .month)
            }
        }
    }

    private var summarySection: some View {
        let total = attendanceStore.recentAttendances.count
        let thisWeek = filterAttendances().count

        return HStack(spacing: 16) {
            SummaryPill(value: "\(total)", label: "Total Check-Ins", color: .blue)
            SummaryPill(value: "\(thisWeek)", label: "This Week", color: .green)
        }
    }
}

// MARK: - Filter Chip

private struct FilterChip: View {
    let filter: AttendanceHistoryView.AttendanceFilter
    let isSelected: Bool
    let action: () -> Void

    var body: some View {
        Button(action: action) {
            Text(filter.rawValue)
                .font(.system(size: 13, weight: .semibold, design: .rounded))
                .foregroundColor(isSelected ? .black : .white.opacity(0.7))
                .padding(.horizontal, 14)
                .padding(.vertical, 8)
                .background(
                    RoundedRectangle(cornerRadius: 20, style: .continuous)
                        .fill(isSelected ? Color.green : Color.white.opacity(0.05))
                        .overlay(
                            RoundedRectangle(cornerRadius: 20, style: .continuous)
                                .stroke(isSelected ? Color.green : Color.white.opacity(0.1), lineWidth: 1)
                        )
                )
        }
        .buttonStyle(PlainButtonStyle())
    }
}

// MARK: - Summary Pill

private struct SummaryPill: View {
    let value: String
    let label: String
    let color: Color

    var body: some View {
        VStack(alignment: .leading, spacing: 4) {
            Text(value)
                .font(.system(size: 20, weight: .bold, design: .rounded))
                .foregroundColor(color)
            Text(label)
                .font(.system(size: 11, weight: .medium, design: .rounded))
                .foregroundColor(.white.opacity(0.5))
        }
        .padding(.horizontal, 14)
        .padding(.vertical, 12)
        .background(
            RoundedRectangle(cornerRadius: 14, style: .continuous)
                .fill(color.opacity(0.15))
        )
    }
}

// MARK: - Attendance History Row

struct AttendanceHistoryRow: View {
    let attendance: Attendance

    var body: some View {
        HStack(spacing: 14) {
            Circle()
                .fill(sourceColor)
                .frame(width: 10, height: 10)

            VStack(alignment: .leading, spacing: 2) {
                HStack {
                    Text(formattedTime)
                        .font(.system(size: 15, weight: .semibold, design: .rounded))
                        .foregroundColor(.white)
                    Spacer()
                    Text(formattedDate)
                        .font(.system(size: 13, weight: .medium, design: .rounded))
                        .foregroundColor(.white.opacity(0.5))
                }
                Text(sourceLabel)
                    .font(.system(size: 12, weight: .medium, design: .rounded))
                    .foregroundColor(.white.opacity(0.6))
                if let reason = attendance.reason, !reason.isEmpty {
                    Text("Reason: \(reason)")
                        .font(.system(size: 11, weight: .medium, design: .rounded))
                        .foregroundColor(.yellow.opacity(0.8))
                }
            }
        }
        .padding(.vertical, 6)
    }

    private var sourceColor: Color {
        switch attendance.source {
        case .qr: return .green
        case .assisted: return .blue
        case .offline: return .orange
        }
    }

    private var sourceLabel: String {
        switch attendance.source {
        case .qr: return "QR Check-In"
        case .assisted: return "Assisted (Staff)"
        case .offline: return "Offline (Pending Sync)"
        }
    }

    private var formattedTime: String {
        let f = DateFormatter()
        f.timeStyle = .short
        return f.string(from: attendance.checkInTime)
    }

    private var formattedDate: String {
        let f = DateFormatter()
        f.dateStyle = .medium
        return f.string(from: attendance.checkInTime)
    }
}

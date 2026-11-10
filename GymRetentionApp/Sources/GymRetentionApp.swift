import SwiftUI

@main
struct GymRetentionApp: App {
    @StateObject private var memberStore = MemberStore()
    @StateObject private var attendanceStore = AttendanceStore()
    @StateObject private var ownerStore = OwnerStore()

    var body: some Scene {
        WindowGroup {
            ContentView()
                .environmentObject(memberStore)
                .environmentObject(attendanceStore)
                .environmentObject(ownerStore)
        }
    }
}

enum AppRole: String, CaseIterable {
    case member = "member"
    case owner = "owner"

    var displayName: String {
        switch self {
        case .member: return "Member"
        case .owner: return "Owner / Staff"
        }
    }
}

struct ContentView: View {
    @EnvironmentObject var memberStore: MemberStore
    @EnvironmentObject var attendanceStore: AttendanceStore
    @EnvironmentObject var ownerStore: OwnerStore

    @State private var selectedRole: AppRole = .member

    var body: some View {
        Group {
            if memberStore.currentMember != nil {
                MemberHomeView()
            } else if ownerStore.members.isEmpty == false {
                // Owner is "logged in" if sample data loaded — in production this would be a staff session
                OwnerDashboardView()
            } else {
                RoleSelectionView()
            }
        }
    }
}

struct RoleSelectionView: View {
    @State private var selectedRole: AppRole = .member

    var body: some View {
        ZStack {
            Color.black.ignoresSafeArea()

            VStack(spacing: 40) {
                Spacer()

                Image(systemName: "dumbbell.fill")
                    .font(.system(size: 72, weight: .medium))
                    .foregroundColor(.green)

                Text("FitLocal Gym")
                    .font(.system(size: 40, weight: .bold, design: .rounded))
                    .foregroundColor(.white)

                Text("Your neighbourhood gym, closer than ever")
                    .font(.system(size: 15, weight: .medium, design: .rounded))
                    .foregroundColor(.white.opacity(0.5))

                VStack(spacing: 16) {
                    RoleButton(role: .member, isSelected: selectedRole == .member) {
                        selectedRole = .member
                    }
                    RoleButton(role: .owner, isSelected: selectedRole == .owner) {
                        selectedRole = .owner
                    }
                }
                .padding(.horizontal, 40)

                Spacer()

                Button(action: {
                    // In production: authenticate based on selectedRole
                }) {
                    HStack {
                        Image(systemName: selectedRole == .member ? "person.fill" : "person.badge.key.fill")
                        Text("Continue as \(selectedRole.displayName)")
                    }
                    .font(.system(size: 18, weight: .semibold, design: .rounded))
                    .foregroundColor(.black)
                    .frame(maxWidth: .infinity)
                    .padding(.vertical, 16)
                    .background(Color.green)
                    .cornerRadius(16)
                }
                .padding(.horizontal, 40)
                .padding(.bottom, 40)
            }
        }
        .fullScreenCover(isPresented: .constant(selectedRole == .owner && !ownerStore.members.isEmpty)) {
            // Placeholder — owner flow handled by ContentView routing
        }
    }
}

private struct RoleButton: View {
    let role: AppRole
    let isSelected: Bool
    let action: () -> Void

    var body: some View {
        Button(action: action) {
            HStack(spacing: 14) {
                Image(systemName: role == .member ? "person.fill" : "building.2.fill")
                    .font(.system(size: 24, weight: .medium))
                    .foregroundColor(isSelected ? .black : .white.opacity(0.7))
                Text(role.displayName)
                    .font(.system(size: 18, weight: .semibold, design: .rounded))
                    .foregroundColor(isSelected ? .black : .white)
                Spacer()
                if isSelected {
                    Image(systemName: "checkmark.circle.fill")
                        .font(.system(size: 20))
                        .foregroundColor(.green)
                }
            }
            .padding(.horizontal, 20)
            .padding(.vertical, 16)
            .background(
                RoundedRectangle(cornerRadius: 16, style: .continuous)
                    .fill(isSelected ? Color.green : Color.white.opacity(0.06))
                    .overlay(
                        RoundedRectangle(cornerRadius: 16, style: .continuous)
                            .stroke(isSelected ? Color.green : Color.white.opacity(0.1), lineWidth: 1)
                    )
            )
        }
        .buttonStyle(PlainButtonStyle())
    }
}

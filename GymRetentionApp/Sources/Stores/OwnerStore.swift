import Foundation
import Combine

@MainActor
class OwnerStore: ObservableObject {
    @Published var members: [Member] = []
    @Published var plans: [Plan] = []
    @Published var dashboardStats: DashboardStats?
    @Published var redList: [RedListMember] = []
    @Published var noShowCases: [NoShowCase] = []
    @Published var followUps: [FollowUp] = []
    @Published var addOns: [AddOn] = []
    @Published var staff: [StaffMember] = []
    @Published var isLoading = false
    @Published var noShowThresholdDays: Int = 10

    init() {
        loadSampleData()
    }

    func loadSampleData() {
        isLoading = true
        defer { isLoading = false }

        // Plans
        plans = [
            Plan(id: UUID(), name: "Gym Unlimited", type: .monthly, basePrice: 1499, durationDays: 30),
            Plan(id: UUID(), name: "Fitness Pro", type: .quarterly, basePrice: 3999, durationDays: 90),
            Plan(id: UUID(), name: "Strength+" , type: .halfYearly, basePrice: 6999, durationDays: 180),
            Plan(id: UUID(), name: "Elite Year", type: .yearly, basePrice: 12499, durationDays: 365)
        ]

        // Add-ons
        addOns = [
            AddOn(id: UUID(), name: "Personal Training – 8 Sessions", type: .personalTraining,
                  price: 4999, validityDays: 30, stock: nil,
                  trainerName: "Arjun Patel", trainerQualification: "NASM-CPT, ACE",
                  cancellationTerms: "7-day notice, refund for unused sessions",
                  isAvailable: true),
            AddOn(id: UUID(), name: "Custom Diet Plan", type: .dietPlan,
                  price: 2499, validityDays: 30, stock: nil,
                  trainerName: "Neha Sharma", trainerQualification: "ISSN Sports Nutritionist",
                  cancellationTerms: "Non-refundable once generated",
                  isAvailable: true),
            AddOn(id: UUID(), name: "Whey Protein 1kg", type: .supplement,
                  price: 2999, validityDays: 60, stock: 12,
                  trainerName: nil, trainerQualification: nil,
                  cancellationTerms: "Unopened only, 48-hour window",
                  isAvailable: true),
            AddOn(id: UUID(), name: "Pre-Workout 30 Servings", type: .supplement,
                  price: 1499, validityDays: 90, stock: 3,
                  trainerName: nil, trainerQualification: nil,
                  cancellationTerms: "Unopened only, 48-hour window",
                  isAvailable: true)
        ]

        // Staff
        staff = [
            StaffMember(id: UUID(), name: "Suresh Rao", role: .owner),
            StaffMember(id: UUID(), name: "Priya Mehta", role: .manager),
            StaffMember(id: UUID(), name: "Amit Singh", role: .frontDesk)
        ]

        // 30 members with realistic Indian names
        let trainerNames = ["Arjun Patel", "Neha Sharma", "Ravi Kumar"]
        let memberNames = [
            "Aarav Sharma", "Vihaan Singh", "Kabir Mehta", "Ishaan Reddy", "Reyansh Gupta",
            "Aryan Yadav", "Saanvi Joshi", "Ananya Rao", "Diya Menon", "Myra Desai",
            "Kavya Iyer", "Aditi Khan", "Rohan Verma", "Karthik Nair", "Siddharth Das",
            "Arjun Malhotra", "Vikram Joshi", "Rajesh Kumar", "Sunita Devi", "Manoj Bhai",
            "Pooja Agarwal", "Rahul Sharma", "Kiran Bala", "Deepak Tiwari", "Geeta Rani",
            "Suresh Rao", "Lata Kumari", "Vijay Singh", "Meera Bai", "Ramesh Chand"
        ]

        var allMembers: [Member] = []
        var calendar = Calendar.current

        for (index, name) in memberNames.enumerated() {
            let daysSinceJoin = Int.random(in: 30...200)
            let joinDate = calendar.date(byAdding: .day, value: -daysSinceJoin, to: Date())!
            let plan = plans[index % plans.count]
            let expiryDate = calendar.date(byAdding: .day, value: plan.durationDays - daysSinceJoin, to: Date())!
            let isExpired = expiryDate < Date()
            let isExpiringSoon = !isExpired && calendar.dateComponents([.day], from: Date(), to: expiryDate).day! <= 7

            let totalCheckIns = Int.random(in: 5...80)
            let lastCheckIn: Date?
            if totalCheckIns > 0 {
                lastCheckIn = calendar.date(byAdding: .day, value: -Int.random(in: 0...25), to: Date())!
            } else {
                lastCheckIn = nil
            }

            let daysAbsent: Int
            if let last = lastCheckIn {
                daysAbsent = calendar.dateComponents([.day], from: last, to: Date()).day ?? 0
            } else {
                daysAbsent = daysSinceJoin
            }

            let member = Member(
                id: UUID(),
                name: name,
                phone: "+91 \(Int.random(in: 70000...99999)) \(Int.random(in: 10000...99999))",
                email: "\(name.lowercased().replacingOccurrences(of: " ", with: "."))@example.com",
                joinDate: joinDate,
                currentStreak: Int.random(in: 0...15),
                totalCheckIns: totalCheckIns,
                membership: Membership(
                    id: UUID(),
                    memberId: UUID(),
                    planName: plan.name,
                    planType: plan.type,
                    startDate: joinDate,
                    expiryDate: expiryDate,
                    basePrice: Double(plan.basePrice),
                    discount: Double.random(in: 0...500),
                    finalAmount: Double(plan.basePrice) - Double.random(in: 0...500),
                    isActive: !isExpired,
                    autoRenew: false,
                    pauseUntil: nil,
                    createdAt: joinDate
                ),
                communicationOptIn: Bool.random(),
                whatsappOptIn: Bool.random(),
                createdAt: joinDate,
                updatedAt: Date()
            )
            allMembers.append(member)
        }

        // Force 6 members absent 10-20 days
        for i in 0..<6 {
            allMembers[i].membership.expiryDate = calendar.date(byAdding: .day, value: 30, to: Date())!
            allMembers[i].currentStreak = 0
        }

        // Force 5 memberships expiring within 7 days
        for i in 7..<12 {
            allMembers[i].membership.expiryDate = calendar.date(byAdding: .day, value: Int.random(in: 1...7), to: Date())!
        }

        members = allMembers

        // Build red-list: absent >= threshold, not paused/expired/cancelled
        redList = allMembers.filter { m in
            guard let last = lastCheckInFor(member: m) else { return true }
            let absentDays = calendar.dateComponents([.day], from: last, to: Date()).day ?? 0
            return absentDays >= noShowThresholdDays && m.membership.isActive
        }.map { m in
            RedListMember(
                id: UUID(),
                memberId: m.id,
                name: m.name,
                phone: m.phone,
                plan: m.membership.planName,
                expiry: m.membership.expiryDate,
                lastCheckIn: lastCheckInFor(member: m),
                absentDays: calendar.dateComponents([.day], from: lastCheckInFor(member: m) ?? m.joinDate, to: Date()).day ?? 0,
                assignedTrainer: trainerNames.randomElement()!,
                lastFollowUp: nil,
                outcome: nil,
                nextActionDate: nil
            )
        }

        // Dashboard stats
        let activeMembers = allMembers.filter { $0.membership.isActive }.count
        let todayCheckIns = Int.random(in: 15...35)
        let sevenDayActive = allMembers.filter { m in
            guard let last = lastCheckInFor(member: m) else { return false }
            return calendar.isDate(last, inSameDayAs: Date()) ||
                   calendar.dateComponents([.day], from: last, to: Date()).day! <= 7
        }.count
        let renewalsDue = allMembers.filter { m in
            let days = calendar.dateComponents([.day], from: Date(), to: m.membership.expiryDate).day ?? 999
            return days >= 0 && days <= 7
        }.count

        dashboardStats = DashboardStats(
            activeMembers: activeMembers,
            todaysCheckIns: todayCheckIns,
            sevenDayActiveMembers: sevenDayActive,
            openNoShowCases: redList.count,
            returnedMembers: Int.random(in: 2...8),
            renewalsDue: renewalsDue,
            renewalCollection: Double.random(in: 40000...90000),
            addOnRevenue: Double.random(in: 15000...35000)
        )

        // Follow-ups for red-list
        let outcomes: [FollowUp.Outcome] = [.willReturn, .injured, .travelling, .timingIssue, .unhappy, .noResponse, .cancelled]
        followUps = redList.enumerated().map { index, red in
            FollowUp(
                id: UUID(),
                memberId: red.memberId,
                outcome: outcomes[index % outcomes.count],
                nextActionDate: Bool.random() ? calendar.date(byAdding: .day, value: Int.random(in: 1...7), to: Date()) : nil,
                notes: "Follow-up call #\(index + 1)",
                createdAt: calendar.date(byAdding: .day, value: -Int.random(in: 0...5), to: Date())!
            )
        }
    }

    private func lastCheckInFor(member: Member) -> Date {
        return Calendar.current.date(byAdding: .day, value: -Int.random(in: 0...30), to: Date())!
    }

    func recordFollowUp(_ followUp: FollowUp) {
        if let idx = followUps.firstIndex(where: { $0.id == followUp.id }) {
            followUps[idx] = followUp
        } else {
            followUps.append(followUp)
        }
    }

    func togglePause(for memberId: UUID, until date: Date?) {
        guard let idx = members.firstIndex(where: { $0.id == memberId }) else { return }
        members[idx].membership.pauseUntil = date
    }

    func updateNoShowThreshold(_ days: Int) {
        noShowThresholdDays = days
        loadSampleData() // Recompute red-list
    }
}

// MARK: - Models

struct DashboardStats {
    let activeMembers: Int
    let todaysCheckIns: Int
    let sevenDayActiveMembers: Int
    let openNoShowCases: Int
    let returnedMembers: Int
    let renewalsDue: Int
    let renewalCollection: Double
    let addOnRevenue: Double
}

struct Plan: Identifiable {
    let id: UUID
    let name: String
    let type: Membership.PlanType
    let basePrice: Double
    let durationDays: Int
}

struct RedListMember: Identifiable {
    let id: UUID
    let memberId: UUID
    let name: String
    let phone: String
    let plan: String
    let expiry: Date
    let lastCheckIn: Date?
    let absentDays: Int
    let assignedTrainer: String
    var lastFollowUp: Date?
    var outcome: FollowUp.Outcome?
    var nextActionDate: Date?
}

struct NoShowCase: Identifiable {
    let id: UUID
    let memberId: UUID
    let openedAt: Date
    let thresholdCrossedDays: Int
    var isResolved: Bool
    var resolvedAt: Date?
}

struct FollowUp: Identifiable {
    let id: UUID
    let memberId: UUID
    let outcome: Outcome
    let nextActionDate: Date?
    let notes: String
    let createdAt: Date

    enum Outcome: String, CaseIterable, Codable {
        case willReturn = "will_return"
        case injured = "injured"
        case travelling = "travelling"
        case timingIssue = "timing_issue"
        case unhappy = "unhappy"
        case noResponse = "no_response"
        case cancelled = "cancelled"

        var displayName: String {
            switch self {
            case .willReturn: return "Will Return"
            case .injured: return "Injured"
            case .travelling: return "Travelling"
            case .timingIssue: return "Timing Issue"
            case .unhappy: return "Unhappy"
            case .noResponse: return "No Response"
            case .cancelled: return "Cancelled"
            }
        }

        var requiresNextActionDate: Bool {
            switch self {
            case .willReturn, .injured, .travelling, .timingIssue, .unhappy: return true
            case .noResponse, .cancelled: return false
            }
        }
    }
}

struct StaffMember: Identifiable {
    let id: UUID
    let name: String
    let role: Role

    enum Role: String, CaseIterable {
        case owner = "owner"
        case manager = "manager"
        case frontDesk = "front-desk"

        var displayName: String {
            switch self {
            case .owner: return "Owner"
            case .manager: return "Manager"
            case .frontDesk: return "Front Desk"
            }
        }
    }
}

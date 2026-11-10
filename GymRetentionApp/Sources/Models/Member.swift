import Foundation

struct Member: Identifiable, Codable {
    let id: UUID
    let name: String
    let phone: String
    let email: String?
    let joinDate: Date
    let currentStreak: Int
    let totalCheckIns: Int
    let membership: Membership
    let communicationOptIn: Bool
    let whatsappOptIn: Bool
    let createdAt: Date
    let updatedAt: Date

    var daysUntilExpiry: Int {
        Calendar.current.dateComponents([.day], from: Date(), to: membership.expiryDate).day ?? 0
    }

    var isExpiringSoon: Bool {
        daysUntilExpiry <= 7 && daysUntilExpiry > 0
    }

    var isExpired: Bool {
        daysUntilExpiry < 0
    }
}

struct Membership: Identifiable, Codable {
    let id: UUID
    let memberId: UUID
    let planName: String
    let planType: PlanType
    let startDate: Date
    let expiryDate: Date
    let basePrice: Double
    let discount: Double
    let finalAmount: Double
    let isActive: Bool
    let autoRenew: Bool
    let pauseUntil: Date?
    let createdAt: Date

    enum PlanType: String, Codable, CaseIterable {
        case monthly = "monthly"
        case quarterly = "quarterly"
        case halfYearly = "half-yearly"
        case yearly = "yearly"

        var displayName: String {
            switch self {
            case .monthly: return "Monthly"
            case .quarterly: return "Quarterly"
            case .halfYearly: return "Half-Yearly"
            case .yearly: return "Yearly"
            }
        }

        var durationDays: Int {
            switch self {
            case .monthly: return 30
            case .quarterly: return 90
            case .halfYearly: return 180
            case .yearly: return 365
            }
        }
    }
}

struct Attendance: Identifiable, Codable {
    let id: UUID
    let memberId: UUID
    let checkInTime: Date
    let checkOutTime: Date?
    let qrSessionId: String
    let source: CheckInSource
    let reason: String? // for assisted check-in
    let recordedBy: UUID? // staff id for assisted

    enum CheckInSource: String, Codable, CaseIterable {
        case qr = "qr"
        case assisted = "assisted"
        case offline = "offline"
    }
}

struct AddOn: Identifiable, Codable {
    let id: UUID
    let name: String
    let type: AddOnType
    let price: Double
    let validityDays: Int
    let stock: Int?
    let trainerName: String?
    let trainerQualification: String?
    let cancellationTerms: String
    let isAvailable: Bool

    enum AddOnType: String, Codable, CaseIterable {
        case personalTraining = "personal-training"
        case dietPlan = "diet-plan"
        case supplement = "supplement"

        var displayName: String {
            switch self {
            case .personalTraining: return "Personal Training"
            case .dietPlan: return "Diet Plan"
            case .supplement: return "Protein / Supplements"
            }
        }
    }
}

struct Payment: Identifiable, Codable {
    let id: UUID
    let memberId: UUID
    let orderId: String
    let amount: Double
    let status: PaymentStatus
    let provider: String // simulated until real provider connected
    let paidAt: Date?
    let receiptUrl: String?
    let createdAt: Date

    enum PaymentStatus: String, Codable, CaseIterable {
        case created = "created"
        case pending = "pending"
        case paid = "paid"
        case failed = "failed"
        case refunded = "refunded"
        case reversed = "reversed"
    }
}

// MARK: - Sample Data

extension Member {
    static let sample = Member(
        id: UUID(),
        name: "Rajesh Kumar",
        phone: "+91 98765 43210",
        email: "rajesh.kumar@example.com",
        joinDate: Calendar.current.date(byAdding: .day, value: -45, to: Date())!,
        currentStreak: 23,
        totalCheckIns: 67,
        membership: Membership.sample,
        communicationOptIn: true,
        whatsappOptIn: true,
        createdAt: Date(),
        updatedAt: Date()
    )
}

extension Membership {
    static let sample = Membership(
        id: UUID(),
        memberId: UUID(),
        planName: "Gym Unlimited",
        planType: .monthly,
        startDate: Calendar.current.date(byAdding: .day, value: -45, to: Date())!,
        expiryDate: Calendar.current.date(byAdding: .day, value: 5, to: Date())!,
        basePrice: 1499.0,
        discount: 200.0,
        finalAmount: 1299.0,
        isActive: true,
        autoRenew: false,
        pauseUntil: nil,
        createdAt: Date()
    )
}
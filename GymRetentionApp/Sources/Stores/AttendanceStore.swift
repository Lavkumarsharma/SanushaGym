import Foundation

@MainActor
class AttendanceStore: ObservableObject {
    @Published var recentAttendances: [Attendance] = []
    @Published var isCheckingIn = false

    func recordCheckIn() async {
        isCheckingIn = true
        defer { isCheckingIn = false }

        // Simulate QR validation and attendance recording
        try? await Task.sleep(nanoseconds: 800_000_000)

        let newAttendance = Attendance(
            id: UUID(),
            memberId: Member.sample.id,
            checkInTime: Date(),
            checkOutTime: nil,
            qrSessionId: "QR-\(Int.random(in: 1000...9999))",
            source: .qr,
            reason: nil,
            recordedBy: nil
        )
        recentAttendances.insert(newAttendance, at: 0)
    }
}

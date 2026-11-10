import Foundation
import Combine

@MainActor
class MemberStore: ObservableObject {
    @Published var currentMember: Member?
    @Published var isLoading = false
    @Published var error: String?

    func loadMember() async {
        isLoading = true
        defer { isLoading = false }

        // Simulate network delay
        try? await Task.sleep(nanoseconds: 600_000_000)

        // In production, fetch from Supabase
        currentMember = Member.sample
    }

    func updateStreak(by increment: Int = 1) {
        guard var member = currentMember else { return }
        // Streak update logic would go here
        currentMember = member
    }
}

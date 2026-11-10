import SwiftUI

/// QR Check-In screen — validates rotating/session-bound gym QR, active
/// membership, duplicate-scan window. Shows success, duplicate, invalid QR,
/// expired membership, and offline-sync states.
struct QRCheckInView: View {
    @EnvironmentObject var attendanceStore: AttendanceStore
    @State private var isScanning = false
    @State private var scannedQR = ""
    @State private var result: CheckInResult?
    @State private var showingResult = false
    @State private var manualEntry = ""

    enum CheckInResult {
        case success, duplicate, invalid, expired, offline
    }

    var body: some View {
        ZStack {
            Color.black.ignoresSafeArea()

            VStack(spacing: 0) {
                // Scanner view (simulated with animated frame)
                scannerView

                // Status info
                statusSection

                Spacer(minLength: 40)

                // Manual entry fallback
                manualEntrySection

                // Result banner
                if showingResult, let result = result {
                    resultBanner(result)
                        .transition(.move(edge: .bottom).combined(with: .opacity))
                }
            }
            .padding(.horizontal, 20)
        }
        .navigationTitle("QR Check-In")
        .navigationBarTitleDisplayMode(.inline)
        .onAppear {
            startScanning()
        }
    }

    // MARK: - Scanner View

    private var scannerView: some View {
        ZStack {
            // Simulated camera feed
            RoundedRectangle(cornerRadius: 20, style: .continuous)
                .fill(Color.white.opacity(0.03))
                .overlay(
                    RoundedRectangle(cornerRadius: 20, style: .continuous)
                        .stroke(Color.white.opacity(0.1), lineWidth: 1)
                )
                .frame(height: 260)

            // Scanner frame corners
            ScannerFrame()

            // Scanning line
            if isScanning {
                ScannerLine()
                    .animation(
                        .linear(duration: 2).repeatForever(autoreverses: false),
                        value: isScanning
                    )
            }

            // Center hint
            VStack {
                Spacer()
                Text("Position QR code inside the frame")
                    .font(.system(size: 14, weight: .medium, design: .rounded))
                    .foregroundColor(.white.opacity(0.6))
                Spacer()
            }
        }
    }

    // MARK: - Status Section

    private var statusSection: some View {
        VStack(spacing: 12) {
            HStack {
                VStack(alignment: .leading, spacing: 4) {
                    Text("Session QR")
                        .font(.system(size: 13, weight: .semibold, design: .rounded))
                        .foregroundColor(.white.opacity(0.6))
                    Text(scannedQR.isEmpty ? "Waiting to scan…" : scannedQR)
                        .font(.system(size: 16, weight: .bold, design: .rounded, monospacedDigit: true))
                        .foregroundColor(.green)
                }
                Spacer()
                Button(action: toggleScanning) {
                    Image(systemName: isScanning ? "stop.fill" : "play.fill")
                        .font(.system(size: 18, weight: .medium))
                        .foregroundColor(isScanning ? .red : .green)
                        .frame(width: 44, height: 44)
                        .background(
                            Circle()
                                .fill((isScanning ? Color.red : Color.green).opacity(0.2))
                        )
                }
            }

            Text("QR rotates every 10 minutes • Valid only for current session")
                .font(.system(size: 12, weight: .medium, design: .rounded))
                .foregroundColor(.white.opacity(0.4))
        }
        .padding(16)
        .background(
            RoundedRectangle(cornerRadius: 16, style: .continuous)
                .fill(Color.white.opacity(0.04))
        )
    }

    // MARK: - Manual Entry

    private var manualEntrySection: some View {
        VStack(alignment: .leading, spacing: 10) {
            Text("Manual Entry (Front Desk)")
                .font(.system(size: 14, weight: .semibold, design: .rounded))
                .foregroundColor(.white.opacity(0.7))

            HStack(spacing: 10) {
                TextField("Enter QR code", text: $manualEntry)
                    .font(.system(size: 14, weight: .medium, design: .rounded, monospacedDigit: true))
                    .foregroundColor(.white)
                    .padding(.horizontal, 12)
                    .padding(.vertical, 12)
                    .background(
                        RoundedRectangle(cornerRadius: 12, style: .continuous)
                            .fill(Color.white.opacity(0.06))
                    )

                Button(action: processManualEntry) {
                    Text("Verify")
                        .font(.system(size: 14, weight: .semibold, design: .rounded))
                        .foregroundColor(.black)
                        .padding(.horizontal, 16)
                        .padding(.vertical, 12)
                        .background(Color.green)
                        .cornerRadius(12)
                }
                .disabled(manualEntry.isEmpty)
            }
        }
    }

    // MARK: - Result Banner

    private func resultBanner(_ result: CheckInResult) -> some View {
        VStack(spacing: 10) {
            HStack(spacing: 10) {
                Image(systemName: iconFor(result))
                    .font(.system(size: 20, weight: .medium))
                    .foregroundColor(colorFor(result))
                Text(titleFor(result))
                    .font(.system(size: 15, weight: .semibold, design: .rounded))
                    .foregroundColor(.white)
                Spacer()
                Button(action: { showingResult = false }) {
                    Image(systemName: "xmark.circle.fill")
                        .foregroundColor(.white.opacity(0.5))
                }
            }
            Text(messageFor(result))
                .font(.system(size: 13, weight: .medium, design: .rounded))
                .foregroundColor(.white.opacity(0.8))
        }
        .padding(14)
        .background(
            RoundedRectangle(cornerRadius: 14, style: .continuous)
                .fill(colorFor(result).opacity(0.15))
                .overlay(
                    RoundedRectangle(cornerRadius: 14, style: .continuous)
                        .stroke(colorFor(result).opacity(0.4), lineWidth: 1)
                )
        )
    }

    // MARK: - Actions

    private func startScanning() {
        isScanning = true
        // Simulate auto-scan after 2 seconds
        DispatchQueue.main.asyncAfter(deadline: .now() + 2) {
            simulateScan()
        }
    }

    private func toggleScanning() {
        isScanning.toggle()
        if isScanning {
            DispatchQueue.main.asyncAfter(deadline: .now() + 2) {
                simulateScan()
            }
        }
    }

    private func simulateScan() {
        guard isScanning else { return }

        // Simulate a valid QR code
        scannedQR = "GYM-\(Int.random(in: 1000...9999))-\(Int.random(in: 100...999))"

        // Simulate validation result (weighted toward success for demo)
        let roll = Double.random(in: 0...1)
        let result: CheckInResult
        if roll < 0.6 {
            result = .success
        } else if roll < 0.75 {
            result = .duplicate
        } else if roll < 0.85 {
            result = .invalid
        } else if roll < 0.92 {
            result = .expired
        } else {
            result = .offline
        }

        isScanning = false
        self.result = result
        showingResult = true

        // Record attendance if success
        if result == .success {
            Task {
                await attendanceStore.recordCheckIn()
                Haptics.success()
            }
        } else {
            Haptics.error()
        }

        // Auto-dismiss after 4 seconds
        DispatchQueue.main.asyncAfter(deadline: .now() + 4) {
            showingResult = false
            self.result = nil
            // Restart scanning
            isScanning = true
            DispatchQueue.main.asyncAfter(deadline: .now() + 2) {
                simulateScan()
            }
        }
    }

    private func processManualEntry() {
        scannedQR = manualEntry
        manualEntry = ""
        // Treat manual entry as valid for demo
        result = .success
        showingResult = true
        Task {
            await attendanceStore.recordCheckIn()
            Haptics.success()
        }
        DispatchQueue.main.asyncAfter(deadline: .now() + 4) {
            showingResult = false
            self.result = nil
        }
    }

    // MARK: - Helpers

    private func iconFor(_ result: CheckInResult) -> String {
        switch result {
        case .success: return "checkmark.circle.fill"
        case .duplicate: return "exclamationmark.triangle.fill"
        case .invalid: return "xmark.circle.fill"
        case .expired: return "clock.fill"
        case .offline: return "wifi.slash"
        }
    }

    private func colorFor(_ result: CheckInResult) -> Color {
        switch result {
        case .success: return .green
        case .duplicate, .invalid: return .orange
        case .expired: return .yellow
        case .offline: return .gray
        }
    }

    private func titleFor(_ result: CheckInResult) -> String {
        switch result {
        case .success: return "Check-In Successful"
        case .duplicate: return "Duplicate Scan"
        case .invalid: return "Invalid QR"
        case .expired: return "Membership Expired"
        case .offline: return "Offline Mode"
        }
    }

    private func messageFor(_ result: CheckInResult) -> String {
        switch result {
        case .success: return "Attendance recorded. Streak updated!"
        case .duplicate: return "Already checked in within 10 minutes."
        case .invalid: return "Please scan a valid session-bound QR."
        case .expired: return "Membership expired. Please renew first."
        case .offline: return "Offline. Will sync when back online."
        }
    }
}

// MARK: - Scanner Frame (corner brackets)

private struct ScannerFrame: View {
    var body: some View {
        ZStack {
            // Top-left
            cornerLines(x: -70, y: -70)
            // Top-right
            cornerLines(x: 70, y: -70).scaleEffect(x: -1, y: 1)
            // Bottom-left
            cornerLines(x: -70, y: 70).scaleEffect(x: 1, y: -1)
            // Bottom-right
            cornerLines(x: 70, y: 70).scaleEffect(x: -1, y: -1)
        }
    }

    private func cornerLines(x: CGFloat, y: CGFloat) -> some View {
        VStack(spacing: 0) {
            HStack(spacing: 0) {
                cornerLine(vertical: false)
                Spacer()
            }
            Spacer()
            HStack(spacing: 0) {
                cornerLine(vertical: true)
                Spacer()
            }
        }
        .offset(x: x, y: y)
    }

    private func cornerLine(vertical: Bool) -> some View {
        Group {
            if vertical {
                Rectangle()
                    .fill(Color.green)
                    .frame(width: 3, height: 30)
            } else {
                Rectangle()
                    .fill(Color.green)
                    .frame(width: 30, height: 3)
            }
        }
    }
}

// MARK: - Scanning Line

private struct ScannerLine: View {
    @State private var offset: CGFloat = -110

    var body: some View {
        Rectangle()
            .fill(Color.green)
            .frame(width: 180, height: 3)
            .offset(y: offset)
            .onAppear {
                withAnimation(.linear(duration: 1.5).repeatForever(autoreverses: true)) {
                    offset = 110
                }
            }
    }
}

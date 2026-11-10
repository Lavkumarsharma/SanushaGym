import SwiftUI

/// Settings — Communication preference and opt-out controls.
/// Marketing consent separate, supports opt-out.
struct SettingsView: View {
    @State private var communicationOptIn = true
    @State private var whatsappOptIn = true
    @State private var emailOptIn = true
    @State private var smsOptIn = true
    @State private var pushOptIn = true
    @State private var language = "English / Hinglish"
    @State private var notifications = true
    @State private var biometricAuth = false
    @State private var dataUsage = true
    @State private var showingLogout = false

    var body: some View {
        NavigationView {
            ZStack {
                Color.black.ignoresSafeArea()

                List {
                    // Account
                    Section {
                        SettingsRow(icon: "person.fill", title: "Profile", subtitle: "Update your details", color: .blue) {
                            // profile
                        }
                        SettingsRow(icon: "phone.fill", title: "Mobile Number", subtitle: "+91 98765 43210", color: .green) {
                            // change phone
                        }
                        SettingsRow(icon: "envelope.fill", title: "Email", subtitle: "rajesh@example.com", color: .purple) {
                            // change email
                        }
                    } header: {
                        Text("Account")
                    }

                    // Communication preferences (key requirement)
                    Section {
                        ToggleRow(icon: "bell.fill", title: "Push Notifications", isOn: $pushOptIn, color: .red)
                        ToggleRow(icon: "sms.fill", title: "SMS Alerts", isOn: $smsOptIn, color: .green)
                        ToggleRow(icon: "at.fill", title: "Email Updates", isOn: $emailOptIn, color: .blue)
                        ToggleRow(icon: "message.fill", title: "WhatsApp Messages", isOn: $whatsappOptIn, color: .green)

                        // Marketing consent separate
                        VStack(alignment: .leading, spacing: 8) {
                            Toggle(isOn: $communicationOptIn) {
                                VStack(alignment: .leading, spacing: 2) {
                                    Text("Marketing Communications")
                                        .font(.system(size: 14, weight: .semibold, design: .rounded))
                                        .foregroundColor(.white)
                                    Text("Offers, add-ons, and promotions from FitLocal Gym")
                                        .font(.system(size: 11, weight: .medium, design: .rounded))
                                        .foregroundColor(.white.opacity(0.5))
                                }
                            }
                            .toggleStyle(SwitchToggleStyle(tint: .green))

                            Text("You can opt out anytime. We never sell your data.")
                                .font(.system(size: 11, weight: .medium, design: .rounded))
                                .foregroundColor(.white.opacity(0.4))
                        }
                        .padding(.vertical, 4)
                    } header: {
                        Text("Communication Preferences")
                    } footer: {
                        Text("Marketing consent is separate from service alerts. Opting out stops promotional messages only.")
                    }

                    // App settings
                    Section {
                        SettingsRow(icon: "globe", title: "Language", subtitle: language, color: .orange) {
                            // language picker
                        }
                        ToggleRow(icon: "faceid", title: "Biometric Auth", isOn: $biometricAuth, color: .purple)
                        ToggleRow(icon: "doc.fill", title: "Data Usage & Analytics", isOn: $dataUsage, color: .blue)
                    } header: {
                        Text("App Settings")
                    }

                    // Safety / support
                    Section {
                        SettingsRow(icon: "shield.fill", title: "Privacy Policy", subtitle: "How we protect your data", color: .gray) {
                            // privacy
                        }
                        SettingsRow(icon: "text.bubble.fill", title: "Support", subtitle: "Chat with front desk", color: .blue) {
                            // support
                        }
                        SettingsRow(icon: "rectangle.portrait.and.arrow.right", title: "Logout", subtitle: "Sign out of your account", color: .red) {
                            showingLogout = true
                        }
                    } header: {
                        Text("Support & Safety")
                    }
                }
                .listStyle(GroupedListStyle())
                .scrollContentBackground(.hidden)
                .background(Color.black)
            }
            .navigationTitle("Settings")
            .navigationBarTitleDisplayMode(.inline)
            .confirmationDialog("Logout?", isPresented: $showingLogout, titleVisibility: .visible) {
                Button("Cancel", role: .cancel) {}
                Button("Logout", role: .destructive) {
                    // perform logout
                }
            } message: {
                Text("You will be signed out and returned to the login screen.")
            }
        }
    }
}

// MARK: - Settings Row

struct SettingsRow: View {
    let icon: String
    let title: String
    let subtitle: String
    let color: Color
    let action: () -> Void

    var body: some View {
        Button(action: action) {
            HStack(spacing: 14) {
                Image(systemName: icon)
                    .font(.system(size: 20, weight: .medium))
                    .foregroundColor(color)
                    .frame(width: 32)
                VStack(alignment: .leading, spacing: 2) {
                    Text(title)
                        .font(.system(size: 15, weight: .semibold, design: .rounded))
                        .foregroundColor(.white)
                    Text(subtitle)
                        .font(.system(size: 12, weight: .medium, design: .rounded))
                        .foregroundColor(.white.opacity(0.5))
                }
                Spacer()
                Image(systemName: "chevron.right")
                    .font(.system(size: 14))
                    .foregroundColor(.white.opacity(0.3))
            }
            .padding(.vertical, 4)
        }
        .buttonStyle(PlainButtonStyle())
        .listRowBackground(Color.white.opacity(0.04))
    }
}

// MARK: - Toggle Row

struct ToggleRow: View {
    let icon: String
    let title: String
    @Binding var isOn: Bool
    let color: Color

    var body: some View {
        HStack(spacing: 14) {
            Image(systemName: icon)
                .font(.system(size: 20, weight: .medium))
                .foregroundColor(color)
                .frame(width: 32)
            Text(title)
                .font(.system(size: 15, weight: .semibold, design: .rounded))
                .foregroundColor(.white)
            Spacer()
            Toggle("", isOn: $isOn)
                .toggleStyle(SwitchToggleStyle(tint: .green))
        }
        .padding(.vertical, 4)
        .listRowBackground(Color.white.opacity(0.04))
    }
}

import SwiftUI

/// Add-On Marketplace — Personal Training, Diet Plans, Protein/Supplements.
///
/// Rules: never pre-selected, exact price, validity, trainer/qualification or
/// product stock, cancellation terms. Dark gym aesthetic.
struct AddOnsView: View {
    @EnvironmentObject var ownerStore: OwnerStore
    @State private var selectedAddOn: AddOn?
    @State private var quantity = 1
    @State private var showingAddToCart = false

    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: 20) {
                Text("Add-Ons")
                    .font(.system(size: 28, weight: .bold, design: .rounded))
                    .foregroundColor(.white)
                Text("Personal Training • Diet Plans • Supplements")
                    .font(.system(size: 15, weight: .medium, design: .rounded))
                    .foregroundColor(.white.opacity(0.5))

                // Category chips
                ScrollView(.horizontal, showsIndicators: false) {
                    HStack(spacing: 10) {
                        ForEach(AddOn.AddOnType.allCases, id: \.self) { type in
                            CategoryChip(type: type, isSelected: true)
                        }
                    }
                    .padding(.horizontal, 4)
                }

                // Grid of add-ons
                LazyVGrid(columns: [
                    GridItem(.flexible(), spacing: 14),
                    GridItem(.flexible(), spacing: 14)
                ], spacing: 16) {
                    ForEach(ownerStore.addOns) { addOn in
                        AddOnCard(addOn: addOn) {
                            selectedAddOn = addOn
                            quantity = 1
                        }
                    }
                }

                // Bottom bar (sticky effect via ZStack overlay not possible in ScrollView,
                // so we put a purchase section if something selected)
                if let selected = selectedAddOn {
                    AddOnPurchaseSection(addOn: selected, quantity: $quantity) {
                        showingAddToCart = true
                    }
                    .transition(.move(edge: .bottom).combined(with: .opacity))
                }
            }
            .padding(16)
            .padding(.bottom, selectedAddOn != nil ? 100 : 20)
        }
        .background(Color.black.ignoresSafeArea())
        .navigationTitle("Add-Ons")
        .navigationBarTitleDisplayMode(.inline)
    }
}

// MARK: - Category Chip

private struct CategoryChip: View {
    let type: AddOn.AddOnType
    let isSelected: Bool

    var body: some View {
        Text(type.displayName)
            .font(.system(size: 13, weight: .semibold, design: .rounded))
            .foregroundColor(isSelected ? .green : .white.opacity(0.6))
            .padding(.horizontal, 14)
            .padding(.vertical, 8)
            .background(
                RoundedRectangle(cornerRadius: 20, style: .continuous)
                    .fill(isSelected ? Color.green.opacity(0.2) : Color.white.opacity(0.05))
                    .overlay(
                        RoundedRectangle(cornerRadius: 20, style: .continuous)
                            .stroke(isSelected ? Color.green : Color.white.opacity(0.1), lineWidth: 1)
                    )
            )
    }
}

// MARK: - Add-On Card

private struct AddOnCard: View {
    let addOn: AddOn
    let onTap: () -> Void

    var body: some View {
        Button(action: onTap) {
            VStack(alignment: .leading, spacing: 12) {
                // Icon by type
                ZStack {
                    Circle()
                        .fill(typeColor.opacity(0.15))
                        .frame(width: 52, height: 52)
                    Image(systemName: typeIcon)
                        .font(.system(size: 22, weight: .medium))
                        .foregroundColor(typeColor)
                }

                VStack(alignment: .leading, spacing: 6) {
                    Text(addOn.name)
                        .font(.system(size: 15, weight: .bold, design: .rounded))
                        .foregroundColor(.white)
                        .lineLimit(2)

                    Text(addOn.type.displayName)
                        .font(.system(size: 12, weight: .medium, design: .rounded))
                        .foregroundColor(.white.opacity(0.5))
                }

                // Price + validity
                HStack {
                    VStack(alignment: .leading, spacing: 2) {
                        Text("₹\(Int(addOn.price))")
                            .font(.system(size: 17, weight: .bold, design: .rounded))
                            .foregroundColor(.green)
                        Text("Valid \(addOn.validityDays) days")
                            .font(.system(size: 11, weight: .medium, design: .rounded))
                            .foregroundColor(.white.opacity(0.5))
                    }
                    Spacer()
                    if let stock = addOn.stock {
                        StockBadge(count: stock)
                    }
                }

                // Trainer info (PT / diet)
                if let trainer = addOn.trainerName, let qual = addOn.trainerQualification {
                    HStack(spacing: 6) {
                        Image(systemName: "person.fill")
                            .font(.system(size: 11))
                            .foregroundColor(.white.opacity(0.5))
                        VStack(alignment: .leading, spacing: 1) {
                            Text(trainer)
                                .font(.system(size: 11, weight: .medium, design: .rounded))
                                .foregroundColor(.white)
                            Text(qual)
                                .font(.system(size: 9, weight: .medium, design: .rounded))
                                .foregroundColor(.white.opacity(0.5))
                        }
                    }
                }

                // Cancellation terms
                Text(addOn.cancellationTerms)
                    .font(.system(size: 10, weight: .medium, design: .rounded))
                    .foregroundColor(.white.opacity(0.4))
                    .lineLimit(2)
            }
            .padding(14)
            .background(
                RoundedRectangle(cornerRadius: 18, style: .continuous)
                    .fill(Color.white.opacity(0.06))
                    .overlay(
                        RoundedRectangle(cornerRadius: 18, style: .continuous)
                            .stroke(Color.white.opacity(0.1), lineWidth: 1)
                    )
            )
        }
        .buttonStyle(PlainButtonStyle())
    }

    private var typeColor: Color {
        switch addOn.type {
        case .personalTraining: return .blue
        case .dietPlan: return .green
        case .supplement: return .orange
        }
    }

    private var typeIcon: String {
        switch addOn.type {
        case .personalTraining: return "dumbbell.fill"
        case .dietPlan: return "leaf.fill"
        case .supplement: return "cup.and.spoon.fill"
        }
    }
}

// MARK: - Stock Badge

private struct StockBadge: View {
    let count: Int

    var body: some View {
        HStack(spacing: 4) {
            Image(systemName: "cube.box.fill")
                .font(.system(size: 10))
            Text("\(count) left")
                .font(.system(size: 10, weight: .bold, design: .rounded))
        }
        .foregroundColor(count > 5 ? .green : .orange)
        .padding(.horizontal, 8)
        .padding(.vertical, 4)
        .background(
            RoundedRectangle(cornerRadius: 8, style: .continuous)
                .fill((count > 5 ? Color.green : Color.orange).opacity(0.15))
        )
    }
}

// MARK: - Purchase Section

struct AddOnPurchaseSection: View {
    let addOn: AddOn
    @Binding var quantity: Int
    let onPurchase: () -> Void

    var body: some View {
        VStack(spacing: 0) {
            Divider().background(Color.white.opacity(0.15))

            VStack(alignment: .leading, spacing: 10) {
                HStack {
                    Text("Add to Membership")
                        .font(.system(size: 15, weight: .semibold, design: .rounded))
                        .foregroundColor(.white)
                    Spacer()
                    Text("₹\(Int(addOn.price) * quantity)")
                        .font(.system(size: 18, weight: .bold, design: .rounded))
                        .foregroundColor(.green)
                }

                HStack(spacing: 12) {
                    Button {
                        quantity = max(1, quantity - 1)
                    } label: {
                        Image(systemName: "minus.circle.fill")
                            .font(.system(size: 22))
                            .foregroundColor(.green)
                    }

                    Text("\(quantity)")
                        .font(.system(size: 16, weight: .bold, design: .rounded))
                        .foregroundColor(.white)
                        .frame(width: 28)

                    Button {
                        quantity += 1
                    } label: {
                        Image(systemName: "plus.circle.fill")
                            .font(.system(size: 22))
                            .foregroundColor(.green)
                    }
                }

                // Cancellation terms reminder
                HStack(spacing: 6) {
                    Image(systemName: "info.circle")
                        .font(.system(size: 12))
                        .foregroundColor(.yellow)
                    Text(addOn.cancellationTerms)
                        .font(.system(size: 11, weight: .medium, design: .rounded))
                        .foregroundColor(.white.opacity(0.6))
                }

                Button(action: onPurchase) {
                    HStack {
                        Image(systemName: "plus.circle.fill")
                        Text("Add \(addOn.name)")
                    }
                    .font(.system(size: 16, weight: .semibold, design: .rounded))
                    .foregroundColor(.black)
                    .frame(maxWidth: .infinity)
                    .padding(.vertical, 14)
                    .background(Color.green)
                    .cornerRadius(12)
                }
            }
            .padding(16)
        }
        .background(Color.black)
    }
}

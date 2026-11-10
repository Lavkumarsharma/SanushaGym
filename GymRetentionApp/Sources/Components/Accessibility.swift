import SwiftUI

#if canImport(UIKit)
import UIKit
#endif

enum Accessibility {
    static var reduceMotionEnabled: Bool {
        #if canImport(UIKit)
        UIAccessibility.isReduceMotionEnabled
        #else
        false
        #endif
    }
}

import Foundation

public enum WebViewNavigationAction: Equatable {
    case idle
    case load(URL)
    case goBack
    case goForward
    case reload
}
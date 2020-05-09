//
//  RNFirebaseAuthUI.swift
//  EkoDigital
//
//  Created by Rajendra Bhochalya on 08/05/20.
//

import Foundation
import UIKit
import FirebaseUI

@objc(RNFirebaseAuthUI)
class RNFirebaseAuthUI: NSObject {

  private var authUI: FUIAuth?

  @objc
  func launchSingInFlow(_ resolve: RCTPromiseResolveBlock,
                    rejecter reject: @escaping RCTPromiseRejectBlock) -> Void {
    authUI = FUIAuth.defaultAuthUI()

    guard authUI != nil else {
      return
    }

    var providers: [FUIAuthProvider] = [
      FUIPhoneAuth(authUI: authUI!),
    ]

    if #available(iOS 13.0, *) {
      providers.append(FUIOAuth.appleAuthProvider())
    }

    authUI!.providers = providers

    let authViewController = authUI!.authViewController()
    let rootViewController = UIApplication.shared.delegate?.window??.rootViewController
    rootViewController?.present(authViewController, animated: true)

    resolve(nil)
  }

  @objc
  func closeSingInFlow(_ resolve: RCTPromiseResolveBlock,
                    rejecter reject: @escaping RCTPromiseRejectBlock) -> Void {
    resolve(nil)
  }

}

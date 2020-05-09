//
//  RNFirebaseAuthUI.h
//  EkoDigital
//
//  Created by Rajendra Bhochalya on 08/05/20.
//

#import <React/RCTBridgeModule.h>

@interface RCT_EXTERN_MODULE(RNFirebaseAuthUI, NSObject)

RCT_EXTERN_METHOD(launchSingInFlow:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(closeSingInFlow:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)

@end

#import "VnNativeAdmobSdk.m"
#import <Cordova/CDVPlugin.h>
@import Firebase;
@import GoogleMobileAds;
@implementation VnNativeAdmobSdk
- (void)connect:(CDVInvokedUrlCommand*)command
{
    CDVPluginResult* pluginResult = nil;
    [FIRApp configure];
    [[GADMobileAds sharedInstance] startWithCompletionHandler:nil];
    NSString* message = [""]
    pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsString:message];
    [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
}  

- (void)banner:(GADBannerView*)bannerView

{
    self.bannerView = [[GADBannerView alloc]
      initWithAdSize:kGADAdSizeBanner];

    [self addBannerViewToView:self.bannerView];
}
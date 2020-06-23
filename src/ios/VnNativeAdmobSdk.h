#import <Cordova/CDVPlugin.h>
@interface Echo : CDVPlugin

- (void)echo:(CDVInvokedUrlCommand*)command;

- (void)banner:(GADBannerView*)bannerView;

@end

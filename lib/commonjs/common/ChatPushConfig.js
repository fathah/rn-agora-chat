"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ChatPushOption = exports.ChatPushDisplayStyle = exports.ChatPushConfig = void 0;
var _reactNative = require("react-native");
/**
 * The display style of offline push notifications.
 */
let ChatPushDisplayStyle = /*#__PURE__*/function (ChatPushDisplayStyle) {
  ChatPushDisplayStyle[ChatPushDisplayStyle["Simple"] = 0] = "Simple";
  ChatPushDisplayStyle[ChatPushDisplayStyle["Summary"] = 1] = "Summary";
  return ChatPushDisplayStyle;
}({});
/**
 * The push configuration class.
 *
 * For Google Firebase Cloud Messaging (FCM), see {@url https://firebase.google.com/docs/cloud-messaging/concept-options}.
 * For the Apple Push Notification service (APNs), see {@url https://developer.apple.com/documentation/usernotifications}.
 * For platform information of React Native, see {@url https://reactnative.dev/docs/platform}.
 * For example:
 *    ```console.log('android: ext: ', Platform.OS, (Platform as any).constants);```
 * Print result:
 *    ```
 *    [
 *       {"Brand": "google", "Fingerprint": "google/walleye/walleye:11/RP1A.200720.009/6720564:user/release-keys", "Manufacturer": "Google", "Model": "Pixel 2", "Release": "11", "Serial": "unknown", "Version": 30, "isTesting": false, "reactNativeVersion": {"major": 0, "minor": 66, "patch": 4, "prerelease": null}, "uiMode": "normal"}
 *   ]
 *    ```
 */
exports.ChatPushDisplayStyle = ChatPushDisplayStyle;
class ChatPushConfig {
  /**
   * The device ID.
   * For FCM, the field is the user ID of the push notification sender.
   * For APNs, this field is the certificate name of the push service.
   */

  /**
   * The device token.
   * The device token is indicated in the callback or method provided by the push vendor.
   * For details, see the push SDK instructions of the respective push vendors.
   */

  /**
   * The device vendor. See {@link Platform.constants.Manufacturer}
   */

  /**
   * Constructs a push configuration object.
   */
  constructor(params) {
    this.deviceToken = params === null || params === void 0 ? void 0 : params.deviceToken;
    this.deviceId = params === null || params === void 0 ? void 0 : params.deviceId;
    if (_reactNative.Platform.OS === 'ios') {} else if (_reactNative.Platform.OS === 'android') {
      this.manufacturer = _reactNative.Platform.constants.Manufacturer.toLowerCase();
    }
  }
}

/**
 * The push option class.
 */
exports.ChatPushConfig = ChatPushConfig;
class ChatPushOption {
  /**
   * The display type of push notifications.
   */

  /**
   * The nickname of the sender displayed in push notifications.
   */

  constructor(params) {
    this.displayStyle = params === null || params === void 0 ? void 0 : params.displayStyle;
    this.displayName = params === null || params === void 0 ? void 0 : params.displayName;
  }
}
exports.ChatPushOption = ChatPushOption;
//# sourceMappingURL=ChatPushConfig.js.map
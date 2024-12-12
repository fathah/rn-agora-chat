"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ChatDeviceInfo = void 0;
/**
 * The device information class, which contains the information of logged-in devices.
 */
class ChatDeviceInfo {
  /**
   * The information of logged-in devices.
   */

  /**
   * The UUID of the device.
   */

  /**
   * The device type, such as "Pixel 6 Pro".
   */

  constructor(params) {
    this.resource = params.resource;
    this.deviceName = params.deviceName;
    this.deviceUUID = params.deviceUUID;
  }
}
exports.ChatDeviceInfo = ChatDeviceInfo;
//# sourceMappingURL=ChatDeviceInfo.js.map
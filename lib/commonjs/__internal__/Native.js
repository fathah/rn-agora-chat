"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Native = void 0;
var _reactNative = require("react-native");
var _ChatError = require("../common/ChatError");
/**
 * Call native api
 */

const {
  ExtSdkApiRN
} = _reactNative.NativeModules;
class Native {
  static checkErrorFromResult(result) {
    if (result !== null && result !== void 0 && result.error) {
      throw new _ChatError.ChatError(result.error);
    }
  }
  static _callMethod(method, args) {
    return ExtSdkApiRN.callMethod(method, args);
  }
}
exports.Native = Native;
//# sourceMappingURL=Native.js.map
/**
 * Call native api
 */

import { NativeModules } from 'react-native';
import { ChatError } from '../common/ChatError';
const {
  ExtSdkApiRN
} = NativeModules;
export class Native {
  static checkErrorFromResult(result) {
    if (result !== null && result !== void 0 && result.error) {
      throw new ChatError(result.error);
    }
  }
  static _callMethod(method, args) {
    return ExtSdkApiRN.callMethod(method, args);
  }
}
//# sourceMappingURL=Native.js.map
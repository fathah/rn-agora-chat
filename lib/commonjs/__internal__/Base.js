"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.BaseManager = void 0;
var _ChatConst = require("../common/ChatConst");
var _ChatError = require("../common/ChatError");
var _ChatMessage = require("../common/ChatMessage");
var _Consts = require("./Consts");
var _Native = require("./Native");
class BaseManager extends _Native.Native {
  static TAG = 'BaseManager';
  constructor() {
    super();
  }
  setNativeListener(_eventEmitter) {
    throw new _ChatError.ChatError({
      code: 1,
      description: 'Please subclass to implement.'
    });
  }
  static handleMessageCallback(methodName, self, message, callback) {
    if (callback && self._eventEmitter) {
      const subscription = self._eventEmitter.addListener(methodName, params => {
        const localMsgId = params.localTime.toString();
        _ChatConst.chatlog.log(`${BaseManager.TAG}: handleMessageCallback: ${methodName}: ${localMsgId} ${params.callbackType}`);
        if (message.localMsgId === localMsgId) {
          const callbackType = params.callbackType;
          if (callbackType === _Consts.MTonMessageSuccess) {
            const m = params.message;
            callback.onSuccess(new _ChatMessage.ChatMessage(m));
            subscription.remove();
          } else if (callbackType === _Consts.MTonMessageError) {
            const e = params.error;
            callback.onError(localMsgId, new _ChatError.ChatError(e));
            subscription.remove();
          } else if (callbackType === _Consts.MTonMessageProgressUpdate) {
            var _callback$onProgress;
            const progress = params.progress;
            (_callback$onProgress = callback.onProgress) === null || _callback$onProgress === void 0 ? void 0 : _callback$onProgress.call(callback, localMsgId, progress);
          }
        }
      });
    }
  }
  static handleGroupFileCallback(methodName, self, groupId, filePath, callback) {
    if (callback && self._eventEmitter) {
      const subscription = self._eventEmitter.addListener(methodName, params => {
        const gid = params.groupId;
        const fp = params.filePath;
        _ChatConst.chatlog.log(`${BaseManager.TAG}: handleGroupFileCallback: ${gid}: ${fp}`);
        if (gid === groupId && fp === filePath) {
          const callbackType = params.callbackType;
          if (callbackType === _Consts.MTonMessageSuccess) {
            callback.onSuccess(gid, fp);
            subscription.remove();
          } else if (callbackType === _Consts.MTonMessageError) {
            const e = params.error;
            callback.onError(gid, fp, new _ChatError.ChatError(e));
            subscription.remove();
          } else if (callbackType === _Consts.MTonMessageProgressUpdate) {
            var _callback$onProgress2;
            const progress = params.progress;
            (_callback$onProgress2 = callback.onProgress) === null || _callback$onProgress2 === void 0 ? void 0 : _callback$onProgress2.call(callback, gid, fp, progress);
          }
        }
      });
    }
  }
}
exports.BaseManager = BaseManager;
//# sourceMappingURL=Base.js.map
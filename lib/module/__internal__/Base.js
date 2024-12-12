import { chatlog } from '../common/ChatConst';
import { ChatError } from '../common/ChatError';
import { ChatMessage } from '../common/ChatMessage';
import { MTonMessageError, MTonMessageProgressUpdate, MTonMessageSuccess } from './Consts';
import { Native } from './Native';
export class BaseManager extends Native {
  static TAG = 'BaseManager';
  constructor() {
    super();
  }
  setNativeListener(_eventEmitter) {
    throw new ChatError({
      code: 1,
      description: 'Please subclass to implement.'
    });
  }
  static handleMessageCallback(methodName, self, message, callback) {
    if (callback && self._eventEmitter) {
      const subscription = self._eventEmitter.addListener(methodName, params => {
        const localMsgId = params.localTime.toString();
        chatlog.log(`${BaseManager.TAG}: handleMessageCallback: ${methodName}: ${localMsgId} ${params.callbackType}`);
        if (message.localMsgId === localMsgId) {
          const callbackType = params.callbackType;
          if (callbackType === MTonMessageSuccess) {
            const m = params.message;
            callback.onSuccess(new ChatMessage(m));
            subscription.remove();
          } else if (callbackType === MTonMessageError) {
            const e = params.error;
            callback.onError(localMsgId, new ChatError(e));
            subscription.remove();
          } else if (callbackType === MTonMessageProgressUpdate) {
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
        chatlog.log(`${BaseManager.TAG}: handleGroupFileCallback: ${gid}: ${fp}`);
        if (gid === groupId && fp === filePath) {
          const callbackType = params.callbackType;
          if (callbackType === MTonMessageSuccess) {
            callback.onSuccess(gid, fp);
            subscription.remove();
          } else if (callbackType === MTonMessageError) {
            const e = params.error;
            callback.onError(gid, fp, new ChatError(e));
            subscription.remove();
          } else if (callbackType === MTonMessageProgressUpdate) {
            var _callback$onProgress2;
            const progress = params.progress;
            (_callback$onProgress2 = callback.onProgress) === null || _callback$onProgress2 === void 0 ? void 0 : _callback$onProgress2.call(callback, gid, fp, progress);
          }
        }
      });
    }
  }
}
//# sourceMappingURL=Base.js.map
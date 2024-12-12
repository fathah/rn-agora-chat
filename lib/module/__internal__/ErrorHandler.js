import { chatlog } from '../common/ChatConst';
/**
 * Handle internal errors. The upper layer gets errors by adding a listener. The except event will be called back when an except occurs.
 */
export class ExceptionHandler {
  static TAG = 'ErrorRegister';
  constructor() {
    this._exceptListeners = new Set();
  }
  static getInstance() {
    if (!ExceptionHandler._instance) {
      ExceptionHandler._instance = new ExceptionHandler();
    }
    return ExceptionHandler._instance;
  }
  get listeners() {
    return this._exceptListeners;
  }
  /**
   * SDK internal call.
   */
  sendExcept(params) {
    chatlog.log(`${ExceptionHandler.TAG}: sendError: `, params);
    this._exceptListeners.forEach(listener => {
      listener.onExcept(params);
    });
  }
}
//# sourceMappingURL=ErrorHandler.js.map
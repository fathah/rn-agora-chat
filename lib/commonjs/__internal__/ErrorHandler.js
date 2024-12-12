"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ExceptionHandler = void 0;
var _ChatConst = require("../common/ChatConst");
/**
 * Handle internal errors. The upper layer gets errors by adding a listener. The except event will be called back when an except occurs.
 */
class ExceptionHandler {
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
    _ChatConst.chatlog.log(`${ExceptionHandler.TAG}: sendError: `, params);
    this._exceptListeners.forEach(listener => {
      listener.onExcept(params);
    });
  }
}
exports.ExceptionHandler = ExceptionHandler;
//# sourceMappingURL=ErrorHandler.js.map
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ChatException = exports.ChatError = void 0;
/**
 * The chat error class, which contains the error code and error description.
 */
class ChatError {
  /**
   * The error code.
   *
   * See the error code of the iOS or Android platform:
   * - iOS: {@link https://docs.agora.io/en/agora-chat/reference/error-codes?platform=ios}
   * - Android: {@link https://docs.agora.io/en/agora-chat/reference/error-codes?platform=android}
   */

  /**
   * The error description.
   */

  constructor(params) {
    this.code = params.code;
    this.description = params.description;
  }
}

/**
 * The chat exception class, which contains the code and description.
 */
exports.ChatError = ChatError;
class ChatException extends ChatError {}
exports.ChatException = ChatException;
//# sourceMappingURL=ChatError.js.map
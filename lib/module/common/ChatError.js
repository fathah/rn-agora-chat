/**
 * The chat error class, which contains the error code and error description.
 */
export class ChatError {
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
export class ChatException extends ChatError {}
//# sourceMappingURL=ChatError.js.map
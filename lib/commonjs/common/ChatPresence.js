"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ChatPresence = void 0;
/**
 * The presence property class that contains presence properties, including the publisher's user ID and current presence state, and the platform used by the online device, as well as the presence's extension information, update time, and subscription expiration time.
 */
class ChatPresence {
  /**
   * The user ID of the presence publisher.
   */

  /**
   * The custom online state such as busy, away, or hidden.
   */

  /**
   * The Unix timestamp when the presence state is last updated. The unit is second.
   */

  /**
   * The Unix timestamp when the presence subscription expires. The unit is second.
   */

  /**
   * The details of the current presence state.
   */

  constructor(params) {
    this.publisher = params.publisher;
    this.statusDescription = params.statusDescription;
    this.lastTime = params.lastTime;
    this.expiryTime = params.expiryTime;
    this.statusDetails = new Map();
    Object.entries(params.statusDetails).forEach(value => {
      this.statusDetails.set(value[0], value[1]);
    });
  }
}
exports.ChatPresence = ChatPresence;
//# sourceMappingURL=ChatPresence.js.map
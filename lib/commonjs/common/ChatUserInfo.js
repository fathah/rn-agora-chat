"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ChatUserInfo = void 0;
/**
 * The user information class, which contains the user attributes, such as the user ID and the nickname and avatar of a user.
 */
class ChatUserInfo {
  /**
   * The user ID.
   */

  /**
   * The nickname of the user.
   */

  /**
   * The avatar URL of the user.
   */

  /**
   * The email address of the user.
   */

  /**
   * The mobile phone number of the user.
   */

  /**
   * The gender of the user.
   * - (Default) `0`: Unknown.
   * - `1`: Male.
   * - `2`: Female.
   */

  /**
   * The signature of the user.
   */

  /**
   * The birthday of the user.
   */

  /**
   * The extension information of the user.
   *
   * You can specify either an empty string or the custom information encapsulated as the JSON string.
   */

  constructor(params) {
    this.userId = params.userId;
    this.nickName = params.nickName;
    this.avatarUrl = params.avatarUrl;
    this.mail = params.mail;
    this.phone = params.phone;
    this.gender = params.gender;
    this.sign = params.sign;
    this.birth = params.birth;
    this.ext = params.ext;
  }
}
exports.ChatUserInfo = ChatUserInfo;
//# sourceMappingURL=ChatUserInfo.js.map
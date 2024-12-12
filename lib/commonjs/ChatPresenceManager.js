"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ChatPresenceManager = void 0;
var _Consts = require("./__internal__/Consts");
var _Native = require("./__internal__/Native");
var _ChatConst = require("./common/ChatConst");
var _ChatPresence = require("./common/ChatPresence");
/**
 * The presence manager class.
 */
class ChatPresenceManager extends _Native.Native {
  static TAG = 'ChatPresenceManager';
  constructor() {
    super();
    this._presenceListeners = new Set();
    this._presenceSubscriptions = new Map();
  }
  setNativeListener(event) {
    _ChatConst.chatlog.log(`${ChatPresenceManager.TAG}: setNativeListener: `);
    this._presenceSubscriptions.forEach(value => {
      value.remove();
    });
    this._presenceSubscriptions.clear();
    this._presenceSubscriptions.set(_Consts.MTonPresenceStatusChanged, event.addListener(_Consts.MTonPresenceStatusChanged, params => {
      this.invokePresenceListener(params);
    }));
  }
  invokePresenceListener(params) {
    this._presenceListeners.forEach(listener => {
      const ret = [];
      const l = params === null || params === void 0 ? void 0 : params.presences;
      l.forEach(value => {
        ret.push(new _ChatPresence.ChatPresence(value));
      });
      listener.onPresenceStatusChanged(ret);
    });
  }

  /**
   * Adds a presence listener.
   *
   * @param listener The presence listener to add.
   */
  addPresenceListener(listener) {
    this._presenceListeners.add(listener);
  }

  /**
   * Removes a presence listener.
   *
   * @param listener The presence listener to remove.
   */
  removePresenceListener(listener) {
    this._presenceListeners.delete(listener);
  }

  /**
   * Clears all presence listeners.
   */
  removeAllPresenceListener() {
    this._presenceListeners.clear();
  }

  /**
   * Publishes a custom presence state.
   *
   * @param description The extension information of the presence state. It can be set as nil.
   *
   * @throws A description of the exception. See {@link ChatError}.
   */
  async publishPresence(description) {
    _ChatConst.chatlog.log(`${ChatPresenceManager.TAG}: publishPresence: `, description);
    let r = await _Native.Native._callMethod(_Consts.MTpublishPresenceWithDescription, {
      [_Consts.MTpublishPresenceWithDescription]: {
        desc: description
      }
    });
    ChatPresenceManager.checkErrorFromResult(r);
  }

  /**
   * Subscribes to the presence state of a user.
   *
   * If the subscription succeeds, the subscriber will receive the callback when the presence state of the user changes.
   *
   * @param members The array of user IDs users whose presence state you want to subscribe to.
   * @param expiry The subscription duration in seconds. The duration cannot exceed 2,592,000 (30×24×3600) seconds, i.e., 30 days.
   * @returns The current presence state of users to whom you have subscribed.
   *
   * @throws A description of the exception. See {@link ChatError}.
   */
  async subscribe(members, expiry) {
    _ChatConst.chatlog.log(`${ChatPresenceManager.TAG}: subscribe: `, members, expiry);
    let r = await _Native.Native._callMethod(_Consts.MTpresenceSubscribe, {
      [_Consts.MTpresenceSubscribe]: {
        members,
        expiry
      }
    });
    ChatPresenceManager.checkErrorFromResult(r);
    const ret = [];
    Object.entries(r === null || r === void 0 ? void 0 : r[_Consts.MTpresenceSubscribe]).forEach(value => {
      ret.push(new _ChatPresence.ChatPresence(value[1]));
    });
    return ret;
  }

  /**
   * Unsubscribes from the presence state of the unspecified users.
   *
   * @param members The array of user IDs whose presence state you want to unsubscribe from.
   *
   * @throws A description of the exception. See {@link ChatError}.
   */
  async unsubscribe(members) {
    _ChatConst.chatlog.log(`${ChatPresenceManager.TAG}: unsubscribe: `, members);
    let r = await _Native.Native._callMethod(_Consts.MTpresenceUnsubscribe, {
      [_Consts.MTpresenceUnsubscribe]: {
        members
      }
    });
    ChatPresenceManager.checkErrorFromResult(r);
  }

  /**
   * Uses the pagination to get a list of users whose presence states you have subscribed to.
   *
   * @param pageNum The current page number, starting from 1.
   * @param pageSize The number of subscribed users that you expect to get on each page.
   * @returns The user IDs of your subscriptions. The SDK returns `null` if you does not subscribe to the presence state of any users.
   *
   * @throws A description of the exception. See {@link ChatError}.
   */
  async fetchSubscribedMembers() {
    let pageNum = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;
    let pageSize = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 20;
    _ChatConst.chatlog.log(`${ChatPresenceManager.TAG}: fetchSubscribedMembers: `, pageNum, pageSize);
    let r = await _Native.Native._callMethod(_Consts.MTfetchSubscribedMembersWithPageNum, {
      [_Consts.MTfetchSubscribedMembersWithPageNum]: {
        pageNum,
        pageSize
      }
    });
    ChatPresenceManager.checkErrorFromResult(r);
    return r === null || r === void 0 ? void 0 : r[_Consts.MTfetchSubscribedMembersWithPageNum];
  }

  /**
   * Gets the current presence state of specified users.
   *
   * @param members The array of user IDs whose current presence state you want to check.
   * @returns The current presence states of the specified users.
   *
   * @throws A description of the exception. See {@link ChatError}.
   */
  async fetchPresenceStatus(members) {
    _ChatConst.chatlog.log(`${ChatPresenceManager.TAG}: fetchPresenceStatus: `, members);
    let r = await _Native.Native._callMethod(_Consts.MTfetchPresenceStatus, {
      [_Consts.MTfetchPresenceStatus]: {
        members
      }
    });
    ChatPresenceManager.checkErrorFromResult(r);
    const ret = [];
    Object.entries(r === null || r === void 0 ? void 0 : r[_Consts.MTfetchPresenceStatus]).forEach(value => {
      ret.push(new _ChatPresence.ChatPresence(value[1]));
    });
    return ret;
  }
}
exports.ChatPresenceManager = ChatPresenceManager;
//# sourceMappingURL=ChatPresenceManager.js.map
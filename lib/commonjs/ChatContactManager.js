"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ChatContactManager = void 0;
var _Base = require("./__internal__/Base");
var _Consts = require("./__internal__/Consts");
var _ErrorHandler = require("./__internal__/ErrorHandler");
var _Native = require("./__internal__/Native");
var _ChatConst = require("./common/ChatConst");
var _ChatContact = require("./common/ChatContact");
var _ChatCursorResult = require("./common/ChatCursorResult");
var _ChatError = require("./common/ChatError");
/**
 * The contact manager class, which manages chat contacts such as adding, retrieving, modifying, and deleting contacts.
 */
class ChatContactManager extends _Base.BaseManager {
  static TAG = 'ChatContactManager';
  constructor() {
    super();
    this._contactListeners = new Set();
    this._contactSubscriptions = new Map();
  }
  setNativeListener(event) {
    _ChatConst.chatlog.log(`${ChatContactManager.TAG}: setNativeListener: `);
    this._contactSubscriptions.forEach(value => {
      value.remove();
    });
    this._contactSubscriptions.clear();
    this._contactSubscriptions.set(_Consts.MTonContactChanged, event.addListener(_Consts.MTonContactChanged, params => {
      this.invokeContactListener(params);
    }));
  }
  invokeContactListener(params) {
    this._contactListeners.forEach(listener => {
      var _listener$onContactAd, _listener$onContactDe, _listener$onContactIn, _listener$onFriendReq, _listener$onFriendReq2;
      const contactEventType = params.type;
      switch (contactEventType) {
        case 'onContactAdded':
          (_listener$onContactAd = listener.onContactAdded) === null || _listener$onContactAd === void 0 ? void 0 : _listener$onContactAd.call(listener, params.username);
          break;
        case 'onContactDeleted':
          (_listener$onContactDe = listener.onContactDeleted) === null || _listener$onContactDe === void 0 ? void 0 : _listener$onContactDe.call(listener, params.username);
          break;
        case 'onContactInvited':
          (_listener$onContactIn = listener.onContactInvited) === null || _listener$onContactIn === void 0 ? void 0 : _listener$onContactIn.call(listener, params.username, params.reason);
          break;
        case 'onFriendRequestAccepted':
          (_listener$onFriendReq = listener.onFriendRequestAccepted) === null || _listener$onFriendReq === void 0 ? void 0 : _listener$onFriendReq.call(listener, params.username);
          break;
        case 'onFriendRequestDeclined':
          (_listener$onFriendReq2 = listener.onFriendRequestDeclined) === null || _listener$onFriendReq2 === void 0 ? void 0 : _listener$onFriendReq2.call(listener, params.username);
          break;
        default:
          _ErrorHandler.ExceptionHandler.getInstance().sendExcept({
            except: new _ChatError.ChatException({
              code: 1,
              description: `This type is not supported. ` + contactEventType
            }),
            from: ChatContactManager.TAG
          });
      }
    });
  }

  /**
   * Adds a contact listener.
   *
   * @param listener The listener to add.
   */
  addContactListener(listener) {
    _ChatConst.chatlog.log(`${ChatContactManager.TAG}: addContactListener: `);
    this._contactListeners.add(listener);
  }

  /**
   * Removes the contact listener.
   *
   * @param listener The listener to remove.
   */
  removeContactListener(listener) {
    _ChatConst.chatlog.log(`${ChatContactManager.TAG}: removeContactListener: `);
    this._contactListeners.delete(listener);
  }

  /**
   * Removes all contact listeners.
   */
  removeAllContactListener() {
    _ChatConst.chatlog.log(`${ChatContactManager.TAG}: removeAllContactListener: `);
    this._contactListeners.clear();
  }

  /**
   * Adds a new contact.
   *
   * @param userId The user ID of the contact to add.
   * @param reason The reason for adding the contact. This parameter is optional and can be `null` or "".
   *
   * @throws A description of the exception. See {@link ChatError}.
   */
  async addContact(userId) {
    let reason = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
    _ChatConst.chatlog.log(`${ChatContactManager.TAG}: addContact: `, userId);
    let r = await _Native.Native._callMethod(_Consts.MTaddContact, {
      [_Consts.MTaddContact]: {
        username: userId,
        reason: reason
      }
    });
    ChatContactManager.checkErrorFromResult(r);
  }

  /**
   * Deletes a contact and all the related conversations.
   *
   * @param userId The user ID of the contact to delete.
   * @param keepConversation Whether to retain conversations of the contact to delete.
   * - `true`: Yes.
   * - (Default) `false`: No.
   *
   * @throws A description of the exception. See {@link ChatError}.
   */
  async deleteContact(userId) {
    let keepConversation = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
    _ChatConst.chatlog.log(`${ChatContactManager.TAG}: deleteContact: `, userId);
    let r = await _Native.Native._callMethod(_Consts.MTdeleteContact, {
      [_Consts.MTdeleteContact]: {
        username: userId,
        keepConversation: keepConversation
      }
    });
    ChatContactManager.checkErrorFromResult(r);
  }

  /**
   * Gets the contact list from the server.
   *
   * @returns The list of contacts.
   *
   * @throws A description of the exception. See {@link ChatError}.
   */
  async getAllContactsFromServer() {
    _ChatConst.chatlog.log(`${ChatContactManager.TAG}: getAllContactsFromServer: `);
    let r = await _Native.Native._callMethod(_Consts.MTgetAllContactsFromServer);
    ChatContactManager.checkErrorFromResult(r);
    const ret = r === null || r === void 0 ? void 0 : r[_Consts.MTgetAllContactsFromServer];
    return ret;
  }

  /**
   * Gets the contact list from the local database.
   *
   * @returns The contact list.
   *
   * @throws A description of the exception. See {@link ChatError}.
   */
  async getAllContactsFromDB() {
    _ChatConst.chatlog.log(`${ChatContactManager.TAG}: getAllContactsFromDB: `);
    let r = await _Native.Native._callMethod(_Consts.MTgetAllContactsFromDB);
    ChatContactManager.checkErrorFromResult(r);
    const ret = r === null || r === void 0 ? void 0 : r[_Consts.MTgetAllContactsFromDB];
    return ret;
  }

  /**
   * Adds a contact to the block list.
   *
   * You can send messages to the users on the block list, but cannot receive messages from them.
   *
   * @param userId The user ID of the contact to be added to the block list.
   *
   * @throws A description of the exception. See {@link ChatError}.
   */
  async addUserToBlockList(userId) {
    _ChatConst.chatlog.log(`${ChatContactManager.TAG}: addUserToBlockList: `, userId);
    let r = await _Native.Native._callMethod(_Consts.MTaddUserToBlockList, {
      [_Consts.MTaddUserToBlockList]: {
        username: userId
      }
    });
    ChatContactManager.checkErrorFromResult(r);
  }

  /**
   * Removes the contact from the block list.
   *
   * @param userId The user ID of the contact to be removed from the block list.
   *
   * @throws A description of the exception. See {@link ChatError}.
   */
  async removeUserFromBlockList(userId) {
    _ChatConst.chatlog.log(`${ChatContactManager.TAG}: removeUserFromBlockList: `, userId);
    let r = await _Native.Native._callMethod(_Consts.MTremoveUserFromBlockList, {
      [_Consts.MTremoveUserFromBlockList]: {
        username: userId
      }
    });
    ChatContactManager.checkErrorFromResult(r);
  }

  /**
   * Gets the block list from the server.
   *
   * @returns The block list obtained from the server.
   *
   * @throws A description of the exception. See {@link ChatError}.
   */
  async getBlockListFromServer() {
    _ChatConst.chatlog.log(`${ChatContactManager.TAG}: getBlockListFromServer: `);
    let r = await _Native.Native._callMethod(_Consts.MTgetBlockListFromServer);
    ChatContactManager.checkErrorFromResult(r);
    const ret = r === null || r === void 0 ? void 0 : r[_Consts.MTgetBlockListFromServer];
    return ret;
  }

  /**
   * Gets the block list from the local database.
   *
   * @returns The block list obtained from the local database.
   *
   * @throws A description of the exception. See {@link ChatError}.
   */
  async getBlockListFromDB() {
    _ChatConst.chatlog.log(`${ChatContactManager.TAG}: getBlockListFromDB: `);
    let r = await _Native.Native._callMethod(_Consts.MTgetBlockListFromDB);
    ChatContactManager.checkErrorFromResult(r);
    const ret = r === null || r === void 0 ? void 0 : r[_Consts.MTgetBlockListFromDB];
    return ret;
  }

  /**
   * Accepts a friend invitation。
   *
   * @param userId The user who sends the friend invitation.
   *
   * @throws A description of the exception. See {@link ChatError}.
   */
  async acceptInvitation(userId) {
    _ChatConst.chatlog.log(`${ChatContactManager.TAG}: acceptInvitation: `, userId);
    let r = await _Native.Native._callMethod(_Consts.MTacceptInvitation, {
      [_Consts.MTacceptInvitation]: {
        username: userId
      }
    });
    ChatContactManager.checkErrorFromResult(r);
  }

  /**
   * Declines a friend invitation.
   *
   * @param userId The user who sends the friend invitation.
   *
   * @throws A description of the exception. See {@link ChatError}.
   */
  async declineInvitation(userId) {
    _ChatConst.chatlog.log(`${ChatContactManager.TAG}: declineInvitation: `, userId);
    let r = await _Native.Native._callMethod(_Consts.MTdeclineInvitation, {
      [_Consts.MTdeclineInvitation]: {
        username: userId
      }
    });
    ChatContactManager.checkErrorFromResult(r);
  }

  /**
   * Gets the unique IDs of the current user on the other devices. The ID is in the format of `{user_ID} + "/" + {resource_ID}`.
   *
   * @returns The list of unique IDs of users on the other devices if the method succeeds.
   *
   * @throws A description of the exception. See {@link ChatError}.
   */
  async getSelfIdsOnOtherPlatform() {
    _ChatConst.chatlog.log(`${ChatContactManager.TAG}: getSelfIdsOnOtherPlatform: `);
    let r = await _Native.Native._callMethod(_Consts.MTgetSelfIdsOnOtherPlatform);
    ChatContactManager.checkErrorFromResult(r);
    const ret = r === null || r === void 0 ? void 0 : r[_Consts.MTgetSelfIdsOnOtherPlatform];
    return ret;
  }

  /**
   * Gets all contacts from the local database.
   *
   * @returns The list of contacts.
   *
   * @throws A description of the exception. See {@link ChatError}.
   */
  async getAllContacts() {
    _ChatConst.chatlog.log(`${ChatContactManager.TAG}: getAllContacts: `);
    let r = await _Native.Native._callMethod(_Consts.MTgetAllContacts);
    ChatContactManager.checkErrorFromResult(r);
    const list = r === null || r === void 0 ? void 0 : r[_Consts.MTgetAllContacts];
    const ret = [];
    for (const i of list) {
      ret.push(new _ChatContact.ChatContact(i));
    }
    return ret;
  }

  /**
   * Gets the contact by user ID from local database.
   *
   * @param userId The user ID of the contact to get.
   * @returns The contact.
   *
   * @throws A description of the exception. See {@link ChatError}.
   */
  async getContact(userId) {
    _ChatConst.chatlog.log(`${ChatContactManager.TAG}: getContact: ${userId}`);
    let r = await _Native.Native._callMethod(_Consts.MTgetContact, {
      [_Consts.MTgetContact]: {
        userId
      }
    });
    ChatContactManager.checkErrorFromResult(r);
    const g = r === null || r === void 0 ? void 0 : r[_Consts.MTgetContact];
    if (g) {
      return new _ChatContact.ChatContact(g);
    }
    return undefined;
  }

  /**
   * Gets all contacts from the server.
   *
   * @returns The list of contacts.
   *
   * @throws A description of the exception. See {@link ChatError}.
   */
  async fetchAllContacts() {
    _ChatConst.chatlog.log(`${ChatContactManager.TAG}: fetchAllContacts: `);
    let r = await _Native.Native._callMethod(_Consts.MTfetchAllContacts);
    ChatContactManager.checkErrorFromResult(r);
    const list = r === null || r === void 0 ? void 0 : r[_Consts.MTfetchAllContacts];
    const ret = [];
    for (const i of list) {
      ret.push(new _ChatContact.ChatContact(i));
    }
    return ret;
  }

  /**
   * Gets the contacts from the server.
   * @params params -
   * - cursor: The cursor of the page to get. The first page is an empty string.
   * - pageSize: The number of contacts to get. The default value is 20. [1-50]
   * @returns The list of contacts.
   *
   * @throws A description of the exception. See {@link ChatError}.
   */
  async fetchContacts(params) {
    _ChatConst.chatlog.log(`${ChatContactManager.TAG}: fetchContacts: ${params.cursor}, ${params.pageSize}`);
    let r = await _Native.Native._callMethod(_Consts.MTfetchContacts, {
      [_Consts.MTfetchContacts]: {
        cursor: params.cursor,
        pageSize: params.pageSize ?? 20
      }
    });
    ChatContactManager.checkErrorFromResult(r);
    let ret = new _ChatCursorResult.ChatCursorResult({
      cursor: r === null || r === void 0 ? void 0 : r[_Consts.MTfetchContacts].cursor,
      list: r === null || r === void 0 ? void 0 : r[_Consts.MTfetchContacts].list,
      opt: {
        map: param => {
          return new _ChatContact.ChatContact(param);
        }
      }
    });
    return ret;
  }

  /**
   * Set the contact's remark.
   *
   * @param contact The contact to set.
   *
   * @throws A description of the exception. See {@link ChatError}.
   */
  async setContactRemark(contact) {
    _ChatConst.chatlog.log(`${ChatContactManager.TAG}: setContactRemark: ${contact}`);
    let r = await _Native.Native._callMethod(_Consts.MTsetContactRemark, {
      [_Consts.MTsetContactRemark]: {
        userId: contact.userId,
        remark: contact.remark
      }
    });
    ChatContactManager.checkErrorFromResult(r);
  }
}
exports.ChatContactManager = ChatContactManager;
//# sourceMappingURL=ChatContactManager.js.map
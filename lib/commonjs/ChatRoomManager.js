"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ChatRoomManager = void 0;
var _Consts = require("./__internal__/Consts");
var _ErrorHandler = require("./__internal__/ErrorHandler");
var _Native = require("./__internal__/Native");
var _ChatConst = require("./common/ChatConst");
var _ChatCursorResult = require("./common/ChatCursorResult");
var _ChatError = require("./common/ChatError");
var _ChatPageResult = require("./common/ChatPageResult");
var _ChatRoom = require("./common/ChatRoom");
/**
 * The chat room manager class, which manages user operations, like joining and leaving the chat room and retrieving the chat room list, and manages member privileges.
 */
class ChatRoomManager extends _Native.Native {
  static TAG = 'ChatRoomManager';
  constructor() {
    super();
    this._roomListeners = new Set();
    this._roomSubscriptions = new Map();
  }
  setNativeListener(event) {
    _ChatConst.chatlog.log(`${ChatRoomManager.TAG}: setNativeListener: `);
    this._roomSubscriptions.forEach(value => {
      value.remove();
    });
    this._roomSubscriptions.clear();
    this._roomSubscriptions.set(_Consts.MTchatRoomChange, event.addListener(_Consts.MTchatRoomChange, params => {
      this.invokeRoomListener(params);
    }));
  }
  invokeRoomListener(params) {
    this._roomListeners.forEach(listener => {
      var _listener$onDestroyed, _listener$onMemberJoi, _listener$onMemberExi, _listener$onMemberRem, _listener$onMuteListA, _listener$onMuteListR, _listener$onAdminAdde, _listener$onAdminRemo, _listener$onOwnerChan, _listener$onAnnouncem, _listener$onAllowList, _listener$onAllowList2, _listener$onAllChatRo, _listener$onSpecifica, _listener$onAttribute, _listener$onAttribute2;
      const contactEventType = params === null || params === void 0 ? void 0 : params.type;
      switch (contactEventType) {
        case 'onChatRoomDestroyed':
          (_listener$onDestroyed = listener.onDestroyed) === null || _listener$onDestroyed === void 0 ? void 0 : _listener$onDestroyed.call(listener, {
            roomId: params.roomId,
            roomName: params.roomName
          });
          break;
        case 'onMemberJoined':
          (_listener$onMemberJoi = listener.onMemberJoined) === null || _listener$onMemberJoi === void 0 ? void 0 : _listener$onMemberJoi.call(listener, {
            roomId: params.roomId,
            participant: params.participant
          });
          break;
        case 'onMemberExited':
          (_listener$onMemberExi = listener.onMemberExited) === null || _listener$onMemberExi === void 0 ? void 0 : _listener$onMemberExi.call(listener, {
            roomId: params.roomId,
            participant: params.participant,
            roomName: params.roomName
          });
          break;
        case 'onRemovedFromChatRoom':
          (_listener$onMemberRem = listener.onMemberRemoved) === null || _listener$onMemberRem === void 0 ? void 0 : _listener$onMemberRem.call(listener, {
            roomId: params.roomId,
            participant: params.participant,
            roomName: params.roomName,
            reason: params.reason
          });
          break;
        case 'onMuteListAdded':
          (_listener$onMuteListA = listener.onMuteListAdded) === null || _listener$onMuteListA === void 0 ? void 0 : _listener$onMuteListA.call(listener, {
            roomId: params.roomId,
            mutes: params.mutes,
            expireTime: params.expireTime
          });
          break;
        case 'onMuteListRemoved':
          (_listener$onMuteListR = listener.onMuteListRemoved) === null || _listener$onMuteListR === void 0 ? void 0 : _listener$onMuteListR.call(listener, {
            roomId: params.roomId,
            mutes: params.mutes
          });
          break;
        case 'onAdminAdded':
          (_listener$onAdminAdde = listener.onAdminAdded) === null || _listener$onAdminAdde === void 0 ? void 0 : _listener$onAdminAdde.call(listener, {
            roomId: params.roomId,
            admin: params.admin
          });
          break;
        case 'onAdminRemoved':
          (_listener$onAdminRemo = listener.onAdminRemoved) === null || _listener$onAdminRemo === void 0 ? void 0 : _listener$onAdminRemo.call(listener, {
            roomId: params.roomId,
            admin: params.admin
          });
          break;
        case 'onOwnerChanged':
          (_listener$onOwnerChan = listener.onOwnerChanged) === null || _listener$onOwnerChan === void 0 ? void 0 : _listener$onOwnerChan.call(listener, {
            roomId: params.roomId,
            newOwner: params.newOwner,
            oldOwner: params.oldOwner
          });
          break;
        case 'onAnnouncementChanged':
          (_listener$onAnnouncem = listener.onAnnouncementChanged) === null || _listener$onAnnouncem === void 0 ? void 0 : _listener$onAnnouncem.call(listener, {
            roomId: params.roomId,
            announcement: params.announcement
          });
          break;
        case 'onAllowListAdded':
          (_listener$onAllowList = listener.onAllowListAdded) === null || _listener$onAllowList === void 0 ? void 0 : _listener$onAllowList.call(listener, {
            roomId: params.roomId,
            members: params.members
          });
          break;
        case 'onAllowListRemoved':
          (_listener$onAllowList2 = listener.onAllowListRemoved) === null || _listener$onAllowList2 === void 0 ? void 0 : _listener$onAllowList2.call(listener, {
            roomId: params.roomId,
            members: params.members
          });
          break;
        case 'onAllMemberMuteStateChanged':
          (_listener$onAllChatRo = listener.onAllChatRoomMemberMuteStateChanged) === null || _listener$onAllChatRo === void 0 ? void 0 : _listener$onAllChatRo.call(listener, {
            roomId: params.roomId,
            isAllMuted: params.isAllMuted
          });
          break;
        case 'onSpecificationChanged':
          (_listener$onSpecifica = listener.onSpecificationChanged) === null || _listener$onSpecifica === void 0 ? void 0 : _listener$onSpecifica.call(listener, new _ChatRoom.ChatRoom(params.room));
          break;
        case 'onAttributesUpdated':
          const attributes = new Map();
          Object.entries(params).forEach(v => {
            attributes.set(v[0], v[1]);
          });
          (_listener$onAttribute = listener.onAttributesUpdated) === null || _listener$onAttribute === void 0 ? void 0 : _listener$onAttribute.call(listener, {
            roomId: params.roomId,
            attributes: attributes,
            from: params.from
          });
          break;
        case 'onAttributesRemoved':
          (_listener$onAttribute2 = listener.onAttributesRemoved) === null || _listener$onAttribute2 === void 0 ? void 0 : _listener$onAttribute2.call(listener, {
            roomId: params.roomId,
            removedKeys: params.removedKeys,
            from: params.from
          });
          break;
        default:
          _ErrorHandler.ExceptionHandler.getInstance().sendExcept({
            except: new _ChatError.ChatException({
              code: 1,
              description: `This type is not supported. ` + contactEventType
            }),
            from: ChatRoomManager.TAG
          });
      }
    });
  }

  /**
   * Adds a chat room listener.
   *
   * @param listener The listener to add.
   */
  addRoomListener(listener) {
    _ChatConst.chatlog.log(`${ChatRoomManager.TAG}: addRoomListener: `);
    this._roomListeners.add(listener);
  }

  /**
   * Removes the chat room listener.
   *
   * @param listener The listener to remove.
   */
  removeRoomListener(listener) {
    _ChatConst.chatlog.log(`${ChatRoomManager.TAG}: removeRoomListener: `);
    this._roomListeners.delete(listener);
  }

  /**
   * Removes all the chat room listeners.
   */
  removeAllRoomListener() {
    _ChatConst.chatlog.log(`${ChatRoomManager.TAG}: removeAllRoomListener: `);
    this._roomListeners.clear();
  }

  /**
   * Joins the chat room.
   *
   * To leave the chat room, you can call {@link leaveChatRoom}.
   *
   * @param roomId The ID of the chat room to join.
   *
   * @throws A description of the exception. See {@link ChatError}.
   */
  async joinChatRoom(roomId) {
    _ChatConst.chatlog.log(`${ChatRoomManager.TAG}: joinChatRoom: ${roomId}`);
    let r = await _Native.Native._callMethod(_Consts.MTjoinChatRoom, {
      [_Consts.MTjoinChatRoom]: {
        roomId: roomId
      }
    });
    ChatRoomManager.checkErrorFromResult(r);
  }

  /**
   * Leaves the chat room.
   *
   * @param roomId The ID of the chat room to leave.
   *
   * @throws A description of the exception. See {@link ChatError}.
   */
  async leaveChatRoom(roomId) {
    _ChatConst.chatlog.log(`${ChatRoomManager.TAG}: leaveChatRoom: ${roomId}`);
    let r = await _Native.Native._callMethod(_Consts.MTleaveChatRoom, {
      [_Consts.MTleaveChatRoom]: {
        roomId
      }
    });
    ChatRoomManager.checkErrorFromResult(r);
  }

  /**
   * Gets chat room data from the server with pagination.
   *
   * @param pageNum The page number, starting from 1.
   * @param pageSize The number of chat rooms that you expect to get on each page.
   * @returns The list of obtained chat rooms. See {@link ChatPageResult}.
   *
   * @throws A description of the exception. See {@link ChatError}.
   */
  async fetchPublicChatRoomsFromServer() {
    let pageNum = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;
    let pageSize = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 200;
    _ChatConst.chatlog.log(`${ChatRoomManager.TAG}: fetchPublicChatRoomsFromServer: `, pageNum, pageSize);
    let r = await _Native.Native._callMethod(_Consts.MTfetchPublicChatRoomsFromServer, {
      [_Consts.MTfetchPublicChatRoomsFromServer]: {
        pageNum,
        pageSize
      }
    });
    ChatRoomManager.checkErrorFromResult(r);
    let ret = new _ChatPageResult.ChatPageResult({
      pageCount: r === null || r === void 0 ? void 0 : r[_Consts.MTfetchPublicChatRoomsFromServer].count,
      list: r === null || r === void 0 ? void 0 : r[_Consts.MTfetchPublicChatRoomsFromServer].list,
      opt: {
        map: param => {
          return new _ChatRoom.ChatRoom(param);
        }
      }
    });
    return ret;
  }

  /**
   * Gets the details of the chat room from the server.
   *
   * By default, the details do not include the chat room member list.
   *
   * @param roomId The chat room ID.
   * @returns The chat room instance. The SDK returns `undefined` if the chat room does not exist.
   *
   * @throws A description of the exception. See {@link ChatError}.
   */
  async fetchChatRoomInfoFromServer(roomId) {
    _ChatConst.chatlog.log(`${ChatRoomManager.TAG}: fetchChatRoomInfoFromServer: ${roomId}`);
    let r = await _Native.Native._callMethod(_Consts.MTfetchChatRoomInfoFromServer, {
      [_Consts.MTfetchChatRoomInfoFromServer]: {
        roomId
      }
    });
    ChatRoomManager.checkErrorFromResult(r);
    const rr = r === null || r === void 0 ? void 0 : r[_Consts.MTfetchChatRoomInfoFromServer];
    if (rr) {
      return new _ChatRoom.ChatRoom(rr);
    }
    return undefined;
  }

  /**
   * Gets the chat room by ID from the local database.
   *
   * @param roomId The chat room ID.
   * @returns The chat room instance. The SDK returns `undefined` if the chat room does not exist.
   *
   * @throws A description of the exception. See {@link ChatError}.
   */
  async getChatRoomWithId(roomId) {
    _ChatConst.chatlog.log(`${ChatRoomManager.TAG}: getChatRoomWithId: ${roomId}`);
    let r = await _Native.Native._callMethod(_Consts.MTgetChatRoom, {
      [_Consts.MTgetChatRoom]: {
        roomId
      }
    });
    ChatRoomManager.checkErrorFromResult(r);
    const rr = r === null || r === void 0 ? void 0 : r[_Consts.MTgetChatRoom];
    if (rr) {
      return new _ChatRoom.ChatRoom(rr);
    }
    return undefined;
  }

  /**
   * Creates a chat room.
   *
   * @param subject The chat room name.
   * @param description The chat room description.
   * @param welcome A welcome message for new chat room members.
   * @param members The list of members invited to join the chat room.
   * @param maxCount The maximum number of members allowed to join the chat room.
   * @returns The chat room instance.
   *
   * @throws A description of the exception. See {@link ChatError}.
   */
  async createChatRoom(subject, description, welcome, members) {
    let maxCount = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 300;
    _ChatConst.chatlog.log(`${ChatRoomManager.TAG}: createChatRoom: `, subject, description, welcome, members, maxCount);
    let r = await _Native.Native._callMethod(_Consts.MTcreateChatRoom, {
      [_Consts.MTcreateChatRoom]: {
        subject: subject,
        desc: description,
        welcomeMsg: welcome,
        members: members,
        maxUserCount: maxCount
      }
    });
    ChatRoomManager.checkErrorFromResult(r);
    let ret = new _ChatRoom.ChatRoom(r === null || r === void 0 ? void 0 : r[_Consts.MTcreateChatRoom]);
    return ret;
  }

  /**
   * Destroys a chat room.
   *
   * Only the chat room owner can call this method.
   *
   * @param roomId The chat room ID.
   *
   * @throws A description of the exception. See {@link ChatError}.
   */
  async destroyChatRoom(roomId) {
    _ChatConst.chatlog.log(`${ChatRoomManager.TAG}: destroyChatRoom: `, roomId);
    let r = await _Native.Native._callMethod(_Consts.MTdestroyChatRoom, {
      [_Consts.MTdestroyChatRoom]: {
        roomId
      }
    });
    ChatRoomManager.checkErrorFromResult(r);
  }

  /**
   * Changes the chat room name.
   *
   * Only the chat room owner can call this method.
   *
   * @param roomId The chat room ID.
   * @param subject The new name of the chat room.
   *
   * @throws A description of the exception. See {@link ChatError}.
   */
  async changeChatRoomSubject(roomId, subject) {
    _ChatConst.chatlog.log(`${ChatRoomManager.TAG}: changeChatRoomSubject: ${roomId}, ${subject}`);
    let r = await _Native.Native._callMethod(_Consts.MTchangeChatRoomSubject, {
      [_Consts.MTchangeChatRoomSubject]: {
        roomId,
        subject
      }
    });
    ChatRoomManager.checkErrorFromResult(r);
  }

  /**
   * Modifies the chat room description.
   *
   * Only the chat room owner can call this method.
   *
   * @param roomId The chat room ID.
   * @param description The new description of the chat room.
   *
   * @throws A description of the exception. See {@link ChatError}.
   */
  async changeChatRoomDescription(roomId, description) {
    _ChatConst.chatlog.log(`${ChatRoomManager.TAG}: changeChatRoomSubject: `, roomId, description);
    let r = await _Native.Native._callMethod(_Consts.MTchangeChatRoomDescription, {
      [_Consts.MTchangeChatRoomDescription]: {
        roomId,
        description
      }
    });
    ChatRoomManager.checkErrorFromResult(r);
  }

  /**
   * Gets the chat room member list.
   *
   * @param roomId The chat room ID.
   * @param cursor The cursor position from which to start to get data.
   *               At the first method call, if you set `cursor` as `null` or an empty string, the SDK gets the data in the reverse chronological order of when users join the chat room.
   * @param pageSize The number of members that you expect to get on each page.
   * @returns The list of chat room members and the cursor for the next query. See {@link ChatCursorResult}.
   *
   * @throws A description of the exception. See {@link ChatError}.
   */
  async fetchChatRoomMembers(roomId) {
    let cursor = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
    let pageSize = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 200;
    _ChatConst.chatlog.log(`${ChatRoomManager.TAG}: fetchChatRoomMembers: `, roomId, cursor, pageSize);
    let r = await _Native.Native._callMethod(_Consts.MTfetchChatRoomMembers, {
      [_Consts.MTfetchChatRoomMembers]: {
        roomId,
        cursor,
        pageSize
      }
    });
    ChatRoomManager.checkErrorFromResult(r);
    let ret = new _ChatCursorResult.ChatCursorResult({
      cursor: r === null || r === void 0 ? void 0 : r[_Consts.MTfetchChatRoomMembers].cursor,
      list: r === null || r === void 0 ? void 0 : r[_Consts.MTfetchChatRoomMembers].list,
      opt: {
        map: param => {
          return param;
        }
      }
    });
    return ret;
  }

  /**
   * Mutes the specified members in a chat room.
   *
   * Only the chat room owner or admin can call this method.
   *
   * @param roomId The chat room ID.
   * @param muteMembers The user IDs of members to be muted.
   * @param duration The mute duration in milliseconds.
   *
   * @throws A description of the exception. See {@link ChatError}.
   */
  async muteChatRoomMembers(roomId, muteMembers) {
    let duration = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : -1;
    _ChatConst.chatlog.log(`${ChatRoomManager.TAG}: muteChatRoomMembers: `, roomId, muteMembers, duration);
    let r = await _Native.Native._callMethod(_Consts.MTmuteChatRoomMembers, {
      [_Consts.MTmuteChatRoomMembers]: {
        roomId,
        muteMembers,
        duration
      }
    });
    ChatRoomManager.checkErrorFromResult(r);
  }

  /**
   * Unmutes the specified members in a chat room.
   *
   * Only the chat room owner or admin can call this method.
   *
   * @param roomId The chat room ID.
   * @param unMuteMembers The user IDs of members to be unmuted.
   *
   * @throws A description of the exception. See {@link ChatError}.
   */
  async unMuteChatRoomMembers(roomId, unMuteMembers) {
    _ChatConst.chatlog.log(`${ChatRoomManager.TAG}: unMuteChatRoomMembers: `, roomId, unMuteMembers);
    let r = await _Native.Native._callMethod(_Consts.MTunMuteChatRoomMembers, {
      [_Consts.MTunMuteChatRoomMembers]: {
        roomId,
        unMuteMembers
      }
    });
    ChatRoomManager.checkErrorFromResult(r);
  }

  /**
   * Transfers the chat room ownership.
   *
   * Only the chat room owner can call this method.
   *
   * @param roomId The chat room ID.
   * @param newOwner The user ID of the new chat room owner.
   *
   * @throws A description of the exception. See {@link ChatError}.
   */
  async changeOwner(roomId, newOwner) {
    _ChatConst.chatlog.log(`${ChatRoomManager.TAG}: changeOwner: `, roomId, newOwner);
    let r = await _Native.Native._callMethod(_Consts.MTchangeChatRoomOwner, {
      [_Consts.MTchangeChatRoomOwner]: {
        roomId,
        newOwner
      }
    });
    ChatRoomManager.checkErrorFromResult(r);
  }

  /**
   * Adds a chat room admin.
   *
   * Only the chat room owner can call this method.
   *
   * @param roomId The chat room ID.
   * @param admin The user ID of the chat room admin to be added.
   *
   * @throws A description of the exception. See {@link ChatError}.
   */
  async addChatRoomAdmin(roomId, admin) {
    _ChatConst.chatlog.log(`${ChatRoomManager.TAG}: addChatRoomAdmin: `, roomId, admin);
    let r = await _Native.Native._callMethod(_Consts.MTaddChatRoomAdmin, {
      [_Consts.MTaddChatRoomAdmin]: {
        roomId,
        admin
      }
    });
    ChatRoomManager.checkErrorFromResult(r);
  }

  /**
   * Removes administrative privileges of a chat room admin.
   *
   * @param roomId The chat room ID.
   * @param admin The user ID of the chat room admin whose administrative privileges are to be removed.
   *
   * @throws A description of the exception. See {@link ChatError}.
   */
  async removeChatRoomAdmin(roomId, admin) {
    _ChatConst.chatlog.log(`${ChatRoomManager.TAG}: removeChatRoomAdmin: `, roomId, admin);
    let r = await _Native.Native._callMethod(_Consts.MTremoveChatRoomAdmin, {
      [_Consts.MTremoveChatRoomAdmin]: {
        roomId,
        admin
      }
    });
    ChatRoomManager.checkErrorFromResult(r);
  }

  /**
   * Uses the pagination to get the list of members who are muted in the chat room.
   *
   * This method gets data from the server.
   *
   * Only the chat room owner or admin can call this method.
   *
   * @param roomId The chat room ID.
   * @param pageNum The page number, starting from 1.
   * @param pageSize The number of muted members that you expect to get on each page.
   * @returns The user IDs of muted members.
   *
   * @throws A description of the exception. See {@link ChatError}.
   */
  async fetchChatRoomMuteList(roomId) {
    let pageNum = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;
    let pageSize = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 200;
    _ChatConst.chatlog.log(`${ChatRoomManager.TAG}: fetchChatRoomMuteList: `, roomId, pageNum, pageSize);
    let r = await _Native.Native._callMethod(_Consts.MTfetchChatRoomMuteList, {
      [_Consts.MTfetchChatRoomMuteList]: {
        roomId,
        pageNum,
        pageSize
      }
    });
    ChatRoomManager.checkErrorFromResult(r);
    let ret = r === null || r === void 0 ? void 0 : r[_Consts.MTfetchChatRoomMuteList];
    return ret;
  }

  /**
   * Removes the specified members from a chat room.
   *
   * Only the chat room owner or admin can call this method.
   *
   * @param roomId The chat room ID.
   * @param members The user IDs of the members to be removed.
   *
   * @throws A description of the exception. See {@link ChatError}.
   */
  async removeChatRoomMembers(roomId, members) {
    _ChatConst.chatlog.log(`${ChatRoomManager.TAG}: removeChatRoomMembers: `, roomId, members);
    let r = await _Native.Native._callMethod(_Consts.MTremoveChatRoomMembers, {
      [_Consts.MTremoveChatRoomMembers]: {
        roomId,
        members
      }
    });
    ChatRoomManager.checkErrorFromResult(r);
  }

  /**
   * Adds the specified members to the block list of the chat room.
   *
   * Only the chat room owner or admin can call this method.
   *
   * @param roomId The chat room ID.
   * @param members The user IDs of members to be added to block list of the chat room.
   *
   * @throws A description of the exception. See {@link ChatError}.
   */
  async blockChatRoomMembers(roomId, members) {
    _ChatConst.chatlog.log(`${ChatRoomManager.TAG}: blockChatRoomMembers: `, roomId, members);
    let r = await _Native.Native._callMethod(_Consts.MTblockChatRoomMembers, {
      [_Consts.MTblockChatRoomMembers]: {
        roomId,
        members
      }
    });
    ChatRoomManager.checkErrorFromResult(r);
  }

  /**
   * Removes the specified members from the block list of the chat room.
   *
   * Only the chat room owner or admin can call this method.
   *
   * @param roomId The chat room ID.
   * @param members The user IDs of members to be removed from the block list of the chat room.
   *
   * @throws A description of the exception. See {@link ChatError}.
   */
  async unBlockChatRoomMembers(roomId, members) {
    _ChatConst.chatlog.log(`${ChatRoomManager.TAG}: unBlockChatRoomMembers: `, roomId, members);
    let r = await _Native.Native._callMethod(_Consts.MTunBlockChatRoomMembers, {
      [_Consts.MTunBlockChatRoomMembers]: {
        roomId,
        members
      }
    });
    ChatRoomManager.checkErrorFromResult(r);
  }

  /**
   * Gets the chat room block list with pagination.
   *
   * Only the chat room owner or admin can call this method.
   *
   * @param roomId The chat room ID.
   * @param pageNum The page number, starting from 1.
   * @param pageSize The number of users on the block list that you expect to get on each page.
   * @returns The user IDs of the chat room members on the block list.
   *
   * @throws A description of the exception. See {@link ChatError}.
   */
  async fetchChatRoomBlockList(roomId) {
    let pageNum = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;
    let pageSize = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 200;
    _ChatConst.chatlog.log(`${ChatRoomManager.TAG}: fetchChatRoomBlockList: `, roomId, pageNum, pageSize);
    let r = await _Native.Native._callMethod(_Consts.MTfetchChatRoomBlockList, {
      [_Consts.MTfetchChatRoomBlockList]: {
        roomId,
        pageNum,
        pageSize
      }
    });
    ChatRoomManager.checkErrorFromResult(r);
    const ret = r === null || r === void 0 ? void 0 : r[_Consts.MTfetchChatRoomBlockList];
    return ret;
  }

  /**
   * Updates the chat room announcement.
   *
   * Only the chat room owner or admin can call this method.
   *
   * @param roomId The chat room ID.
   * @param announcement The new chat room announcement.
   *
   * @throws A description of the exception. See {@link ChatError}.
   */
  async updateChatRoomAnnouncement(roomId, announcement) {
    _ChatConst.chatlog.log(`${ChatRoomManager.TAG}: updateChatRoomAnnouncement: `, roomId, announcement);
    let r = await _Native.Native._callMethod(_Consts.MTupdateChatRoomAnnouncement, {
      [_Consts.MTupdateChatRoomAnnouncement]: {
        roomId,
        announcement
      }
    });
    ChatRoomManager.checkErrorFromResult(r);
  }

  /**
   * Gets the chat room announcement from the server.
   *
   * @param roomId The chat room ID.
   * @returns The chat room announcement.
   *
   * @throws A description of the exception. See {@link ChatError}.
   */
  async fetchChatRoomAnnouncement(roomId) {
    _ChatConst.chatlog.log(`${ChatRoomManager.TAG}: fetchChatRoomAnnouncement: `, roomId);
    let r = await _Native.Native._callMethod(_Consts.MTfetchChatRoomAnnouncement, {
      [_Consts.MTfetchChatRoomAnnouncement]: {
        roomId
      }
    });
    ChatRoomManager.checkErrorFromResult(r);
    return r === null || r === void 0 ? void 0 : r[_Consts.MTfetchChatRoomAnnouncement];
  }

  /**
   * Gets the allow list from the server.
   *
   * Only the chat room owner or admin can call this method.
   *
   * @param roomId The chat room ID.
   * @returns The allow list of the chat room.
   *
   * @throws A description of the exception. See {@link ChatError}.
   */
  async fetchChatRoomAllowListFromServer(roomId) {
    _ChatConst.chatlog.log(`${ChatRoomManager.TAG}: fetchChatRoomAllowListFromServer: `, roomId);
    let r = await _Native.Native._callMethod(_Consts.MTfetchChatRoomAllowListFromServer, {
      [_Consts.MTfetchChatRoomAllowListFromServer]: {
        roomId
      }
    });
    ChatRoomManager.checkErrorFromResult(r);
    let ret = r === null || r === void 0 ? void 0 : r[_Consts.MTfetchChatRoomAllowListFromServer];
    return ret;
  }

  /**
   * Checks whether the member is on the allow list of the chat room.
   *
   * @param roomId The chat room ID.
   * @returns Whether the member is on the allow list of the chat room.
   *          - `true`: Yes.
   *          - `false`: No.
   *
   * @throws A description of the exception. See {@link ChatError}.
   */
  async isMemberInChatRoomAllowList(roomId) {
    _ChatConst.chatlog.log(`${ChatRoomManager.TAG}: isMemberInChatRoomAllowList: `, roomId);
    let r = await _Native.Native._callMethod(_Consts.MTisMemberInChatRoomAllowListFromServer, {
      [_Consts.MTisMemberInChatRoomAllowListFromServer]: {
        roomId
      }
    });
    ChatRoomManager.checkErrorFromResult(r);
    let ret = r === null || r === void 0 ? void 0 : r[_Consts.MTisMemberInChatRoomAllowListFromServer];
    return ret;
  }

  /**
   * Adds members to the allow list of the chat room.
   *
   * Only the chat room owner or admin can call this method.
   *
   * @param roomId The chat room ID.
   * @param members The user IDs of members to be added to the allow list of the chat room.
   *
   * @throws A description of the exception. See {@link ChatError}.
   */
  async addMembersToChatRoomAllowList(roomId, members) {
    _ChatConst.chatlog.log(`${ChatRoomManager.TAG}: addMembersToChatRoomAllowList: `, roomId, members);
    let r = await _Native.Native._callMethod(_Consts.MTaddMembersToChatRoomAllowList, {
      [_Consts.MTaddMembersToChatRoomAllowList]: {
        roomId,
        members
      }
    });
    ChatRoomManager.checkErrorFromResult(r);
  }

  /**
   * Removes members from the allow list of the chat room.
   *
   * Only the chat room owner or admin can call this method.
   *
   * @param roomId The chat room ID.
   * @param members The user IDs of members to be removed from the allow list of the chat room.
   *
   * @throws A description of the exception. See {@link ChatError}.
   */
  async removeMembersFromChatRoomAllowList(roomId, members) {
    _ChatConst.chatlog.log(`${ChatRoomManager.TAG}: removeMembersFromChatRoomAllowList: `, roomId, members);
    let r = await _Native.Native._callMethod(_Consts.MTremoveMembersFromChatRoomAllowList, {
      [_Consts.MTremoveMembersFromChatRoomAllowList]: {
        roomId,
        members
      }
    });
    ChatRoomManager.checkErrorFromResult(r);
  }

  /**
   * Mutes all members.
   *
   * Only the chat room owner or admin can call this method.
   *
   * The chat room owner, admins, and members added to the allow list cannot be muted.
   *
   * @param roomId The chat room ID.
   *
   * @throws A description of the exception. See {@link ChatError}.
   */
  async muteAllChatRoomMembers(roomId) {
    _ChatConst.chatlog.log(`${ChatRoomManager.TAG}: muteAllChatRoomMembers: `, roomId);
    let r = await _Native.Native._callMethod(_Consts.MTmuteAllChatRoomMembers, {
      [_Consts.MTmuteAllChatRoomMembers]: {
        roomId
      }
    });
    ChatRoomManager.checkErrorFromResult(r);
  }

  /**
   * Unmutes all members of the chat room.
   *
   * Only the chat room owner or admins can call this method.
   *
   * @param roomId The chat room ID.
   *
   * @throws A description of the exception. See {@link ChatError}.
   */
  async unMuteAllChatRoomMembers(roomId) {
    _ChatConst.chatlog.log(`${ChatRoomManager.TAG}: unMuteAllChatRoomMembers: `, roomId);
    let r = await _Native.Native._callMethod(_Consts.MTunMuteAllChatRoomMembers, {
      [_Consts.MTunMuteAllChatRoomMembers]: {
        roomId
      }
    });
    ChatRoomManager.checkErrorFromResult(r);
  }

  /**
   * Gets custom chat room attributes from the server.
   *
   * @param roomId The chat room ID.
   * @param keys The key list of custom attributes to get. If you set it as `null` or leave it empty, this method retrieves all custom attributes.
   *
   * @returns Custom chat room attributes in key-value format.
   *
   * @throws A description of the exception. See {@link ChatError}.
   */
  async fetchChatRoomAttributes(roomId, keys) {
    _ChatConst.chatlog.log(`${ChatRoomManager.TAG}: ${this.fetchChatRoomAttributes.name}`);
    let r = await _Native.Native._callMethod(_Consts.MTfetchChatRoomAttributes, {
      [_Consts.MTfetchChatRoomAttributes]: {
        roomId,
        keys
      }
    });
    ChatRoomManager.checkErrorFromResult(r);
    const ret = new Map();
    Object.entries(r === null || r === void 0 ? void 0 : r[_Consts.MTfetchChatRoomAttributes]).forEach(v => {
      ret.set(v[0], v[1]);
    });
    return ret;
  }

  /**
   * Sets custom chat room attributes.
   *
   * @params params
   * - roomId The chat room ID.
   * - attributes The chat room attributes to add. The attributes are in key-value format.
   * In a key-value pair, the key is the attribute name that can contain 128 characters at most; the value is the attribute value that cannot exceed 4096 characters.
   * A chat room can have a maximum of 100 custom attributes and the total length of custom chat room attributes cannot exceed 10 GB for each app. Attribute keys support the following character sets:
   *   - 26 lowercase English letters (a-z)
   *   - 26 uppercase English letters (A-Z)
   *   - 10 numbers (0-9)
   *   - "_", "-", "."
   * - deleteWhenLeft: Whether to delete the chat room attributes set by the member when he or she exits the chat room.
   *   - (Default)`true`: Yes.
   *   - `false`: No.
   * - overwrite: Whether to overwrite the attributes with same key set by others.
   *   - `true`: Yes.
   *   - (Default)`false`: No.
   *
   * @returns If certain attributes fail to be set, the SDK returns a map of the attributes in key-value format, where the key is the attribute key and the value is the reason for the failure.
   *
   * @throws A description of the exception. See {@link ChatError}.
   */
  async addAttributes(params) {
    _ChatConst.chatlog.log(`${ChatRoomManager.TAG}: ${this.addAttributes.name}`);
    let r = await _Native.Native._callMethod(_Consts.MTsetChatRoomAttributes, {
      [_Consts.MTsetChatRoomAttributes]: {
        roomId: params.roomId,
        attributes: params.attributes,
        autoDelete: params.deleteWhenLeft ?? false,
        forced: params.overwrite ?? false
      }
    });
    ChatRoomManager.checkErrorFromResult(r);
    const ret = new Map();
    if (r !== null && r !== void 0 && r[_Consts.MTsetChatRoomAttributes]) {
      Object.entries(r === null || r === void 0 ? void 0 : r[_Consts.MTsetChatRoomAttributes]).forEach(v => {
        ret.set(v[0], v[1]);
      });
    }
    return ret;
  }

  /**
   * Removes custom chat room attributes.
   *
   * @params params
   * - roomId: The chat room ID.
   * - keys: The keys of the chat room attributes to remove.
   * - forced: Whether to remove the attributes with same key set by others.
   *   - `true`: Yes.
   *   - (Default)`false`: No.
   *
   * @returns If certain attributes fail to be removed, the SDK returns a map of the attributes in key-value format, where the key is the attribute key and the value is the reason for the failure.
   *
   * @throws A description of the exception. See {@link ChatError}.
   */
  async removeAttributes(params) {
    _ChatConst.chatlog.log(`${ChatRoomManager.TAG}: ${this.removeAttributes.name}`);
    let r = await _Native.Native._callMethod(_Consts.MTremoveChatRoomAttributes, {
      [_Consts.MTremoveChatRoomAttributes]: {
        roomId: params.roomId,
        keys: params.keys,
        forced: params.forced ?? false
      }
    });
    ChatRoomManager.checkErrorFromResult(r);
    const ret = new Map();
    if (r !== null && r !== void 0 && r[_Consts.MTremoveChatRoomAttributes]) {
      Object.entries(r === null || r === void 0 ? void 0 : r[_Consts.MTremoveChatRoomAttributes]).forEach(v => {
        ret.set(v[0], v[1]);
      });
    }
    return ret;
  }
}
exports.ChatRoomManager = ChatRoomManager;
//# sourceMappingURL=ChatRoomManager.js.map
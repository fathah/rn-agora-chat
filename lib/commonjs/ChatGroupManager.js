"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ChatGroupManager = void 0;
var _Base = require("./__internal__/Base");
var _Consts = require("./__internal__/Consts");
var _ErrorHandler = require("./__internal__/ErrorHandler");
var _Native = require("./__internal__/Native");
var _ChatConst = require("./common/ChatConst");
var _ChatCursorResult = require("./common/ChatCursorResult");
var _ChatError = require("./common/ChatError");
var _ChatGroup = require("./common/ChatGroup");
/**
 * The group manager class, which defines how to manage groups, like group creation and destruction and member management.
 */
class ChatGroupManager extends _Base.BaseManager {
  static TAG = 'ChatGroupManager';
  constructor() {
    super();
    this._groupListeners = new Set();
    this._groupSubscriptions = new Map();
  }
  setNativeListener(event) {
    this._eventEmitter = event;
    _ChatConst.chatlog.log(`${ChatGroupManager.TAG}: setNativeListener: `);
    this._groupSubscriptions.forEach(value => {
      value.remove();
    });
    this._groupSubscriptions.clear();
    this._groupSubscriptions.set(_Consts.MTonGroupChanged, event.addListener(_Consts.MTonGroupChanged, params => {
      this.invokeGroupListener(params);
    }));
  }
  invokeGroupListener(params) {
    this._groupListeners.forEach(listener => {
      var _listener$onInvitatio, _listener$onRequestTo, _listener$onRequestTo2, _listener$onRequestTo3, _listener$onInvitatio2, _listener$onInvitatio3, _listener$onMemberRem, _listener$onDestroyed, _listener$onAutoAccep, _listener$onMuteListA, _listener$onMuteListR, _listener$onAdminAdde, _listener$onAdminRemo, _listener$onOwnerChan, _listener$onMemberJoi, _listener$onMemberExi, _listener$onAnnouncem, _listener$onSharedFil, _listener$onSharedFil2, _listener$onAllowList, _listener$onAllowList2, _listener$onAllGroupM, _listener$onStateChan, _listener$onDetailCha, _listener$onMemberAtt;
      const groupEventType = params.type;
      switch (groupEventType) {
        case 'onInvitationReceived':
          (_listener$onInvitatio = listener.onInvitationReceived) === null || _listener$onInvitatio === void 0 ? void 0 : _listener$onInvitatio.call(listener, {
            groupId: params.groupId,
            inviter: params.inviter,
            groupName: params === null || params === void 0 ? void 0 : params.groupName,
            reason: params === null || params === void 0 ? void 0 : params.reason
          });
          break;
        case 'onRequestToJoinReceived':
          (_listener$onRequestTo = listener.onRequestToJoinReceived) === null || _listener$onRequestTo === void 0 ? void 0 : _listener$onRequestTo.call(listener, {
            groupId: params.groupId,
            applicant: params.applicant,
            groupName: params.groupName,
            reason: params === null || params === void 0 ? void 0 : params.reason
          });
          break;
        case 'onRequestToJoinAccepted':
          (_listener$onRequestTo2 = listener.onRequestToJoinAccepted) === null || _listener$onRequestTo2 === void 0 ? void 0 : _listener$onRequestTo2.call(listener, {
            groupId: params.groupId,
            accepter: params.accepter,
            groupName: params === null || params === void 0 ? void 0 : params.groupName
          });
          break;
        case 'onRequestToJoinDeclined':
          (_listener$onRequestTo3 = listener.onRequestToJoinDeclined) === null || _listener$onRequestTo3 === void 0 ? void 0 : _listener$onRequestTo3.call(listener, {
            groupId: params.groupId,
            decliner: params.decliner,
            groupName: params === null || params === void 0 ? void 0 : params.groupName,
            applicant: params === null || params === void 0 ? void 0 : params.applicant,
            reason: params === null || params === void 0 ? void 0 : params.reason
          });
          break;
        case 'onInvitationAccepted':
          (_listener$onInvitatio2 = listener.onInvitationAccepted) === null || _listener$onInvitatio2 === void 0 ? void 0 : _listener$onInvitatio2.call(listener, {
            groupId: params.groupId,
            invitee: params.invitee,
            reason: params === null || params === void 0 ? void 0 : params.reason
          });
          break;
        case 'onInvitationDeclined':
          (_listener$onInvitatio3 = listener.onInvitationDeclined) === null || _listener$onInvitatio3 === void 0 ? void 0 : _listener$onInvitatio3.call(listener, {
            groupId: params.groupId,
            invitee: params.invitee,
            reason: params.reason
          });
          break;
        case 'onUserRemoved':
          (_listener$onMemberRem = listener.onMemberRemoved) === null || _listener$onMemberRem === void 0 ? void 0 : _listener$onMemberRem.call(listener, {
            groupId: params.groupId,
            groupName: params.groupName
          });
          break;
        case 'onGroupDestroyed':
          (_listener$onDestroyed = listener.onDestroyed) === null || _listener$onDestroyed === void 0 ? void 0 : _listener$onDestroyed.call(listener, {
            groupId: params.groupId,
            groupName: params.groupName
          });
          break;
        case 'onAutoAcceptInvitationFromGroup':
          (_listener$onAutoAccep = listener.onAutoAcceptInvitation) === null || _listener$onAutoAccep === void 0 ? void 0 : _listener$onAutoAccep.call(listener, {
            groupId: params.groupId,
            inviter: params.inviter,
            inviteMessage: params.inviteMessage
          });
          break;
        case 'onMuteListAdded':
          (_listener$onMuteListA = listener.onMuteListAdded) === null || _listener$onMuteListA === void 0 ? void 0 : _listener$onMuteListA.call(listener, {
            groupId: params.groupId,
            mutes: params.mutes,
            muteExpire: params.muteExpire
          });
          break;
        case 'onMuteListRemoved':
          (_listener$onMuteListR = listener.onMuteListRemoved) === null || _listener$onMuteListR === void 0 ? void 0 : _listener$onMuteListR.call(listener, {
            groupId: params.groupId,
            mutes: params.mutes
          });
          break;
        case 'onAdminAdded':
          (_listener$onAdminAdde = listener.onAdminAdded) === null || _listener$onAdminAdde === void 0 ? void 0 : _listener$onAdminAdde.call(listener, {
            groupId: params.groupId,
            admin: params.admin
          });
          break;
        case 'onAdminRemoved':
          (_listener$onAdminRemo = listener.onAdminRemoved) === null || _listener$onAdminRemo === void 0 ? void 0 : _listener$onAdminRemo.call(listener, {
            groupId: params.groupId,
            admin: params.admin
          });
          break;
        case 'onOwnerChanged':
          (_listener$onOwnerChan = listener.onOwnerChanged) === null || _listener$onOwnerChan === void 0 ? void 0 : _listener$onOwnerChan.call(listener, {
            groupId: params.groupId,
            newOwner: params.newOwner,
            oldOwner: params.oldOwner
          });
          break;
        case 'onMemberJoined':
          (_listener$onMemberJoi = listener.onMemberJoined) === null || _listener$onMemberJoi === void 0 ? void 0 : _listener$onMemberJoi.call(listener, {
            groupId: params.groupId,
            member: params.member
          });
          break;
        case 'onMemberExited':
          (_listener$onMemberExi = listener.onMemberExited) === null || _listener$onMemberExi === void 0 ? void 0 : _listener$onMemberExi.call(listener, {
            groupId: params.groupId,
            member: params.member
          });
          break;
        case 'onAnnouncementChanged':
          (_listener$onAnnouncem = listener.onAnnouncementChanged) === null || _listener$onAnnouncem === void 0 ? void 0 : _listener$onAnnouncem.call(listener, {
            groupId: params.groupId,
            announcement: params.announcement
          });
          break;
        case 'onSharedFileAdded':
          (_listener$onSharedFil = listener.onSharedFileAdded) === null || _listener$onSharedFil === void 0 ? void 0 : _listener$onSharedFil.call(listener, {
            groupId: params.groupId,
            sharedFile: params.sharedFile
          });
          break;
        case 'onSharedFileDeleted':
          (_listener$onSharedFil2 = listener.onSharedFileDeleted) === null || _listener$onSharedFil2 === void 0 ? void 0 : _listener$onSharedFil2.call(listener, {
            groupId: params.groupId,
            fileId: params.fileId
          });
          break;
        case 'onAllowListAdded':
          (_listener$onAllowList = listener.onAllowListAdded) === null || _listener$onAllowList === void 0 ? void 0 : _listener$onAllowList.call(listener, {
            groupId: params.groupId,
            members: params.members
          });
          break;
        case 'onAllowListRemoved':
          (_listener$onAllowList2 = listener.onAllowListRemoved) === null || _listener$onAllowList2 === void 0 ? void 0 : _listener$onAllowList2.call(listener, {
            groupId: params.groupId,
            members: params.members
          });
          break;
        case 'onAllMemberMuteStateChanged':
          (_listener$onAllGroupM = listener.onAllGroupMemberMuteStateChanged) === null || _listener$onAllGroupM === void 0 ? void 0 : _listener$onAllGroupM.call(listener, {
            groupId: params.groupId,
            isAllMuted: params.isAllMuted
          });
          break;
        case 'onStateChanged':
          (_listener$onStateChan = listener.onStateChanged) === null || _listener$onStateChan === void 0 ? void 0 : _listener$onStateChan.call(listener, new _ChatGroup.ChatGroup(params.group));
          break;
        case 'onSpecificationChanged':
          (_listener$onDetailCha = listener.onDetailChanged) === null || _listener$onDetailCha === void 0 ? void 0 : _listener$onDetailCha.call(listener, new _ChatGroup.ChatGroup(params.group));
          break;
        case 'onMemberAttributesChanged':
          (_listener$onMemberAtt = listener.onMemberAttributesChanged) === null || _listener$onMemberAtt === void 0 ? void 0 : _listener$onMemberAtt.call(listener, {
            groupId: params.groupId,
            member: params.member,
            operator: params.operator,
            attributes: params.attributes
          });
          break;
        default:
          _ErrorHandler.ExceptionHandler.getInstance().sendExcept({
            except: new _ChatError.ChatException({
              code: 1,
              description: `This type is not supported. ` + groupEventType
            }),
            from: ChatGroupManager.TAG
          });
      }
    });
  }
  static handleUploadFileCallback(self, groupId, filePath, callback) {
    ChatGroupManager.handleGroupFileCallback(_Consts.MTuploadGroupSharedFile, self, groupId, filePath, callback);
  }
  static handleDownloadFileCallback(self, groupId, filePath, callback) {
    ChatGroupManager.handleGroupFileCallback(_Consts.MTdownloadGroupSharedFile, self, groupId, filePath, callback);
  }

  /**
   * Gets the group instance from the memory by group ID.
   *
   * @param groupId The group ID.
   * @returns The group instance. The SDK returns `undefined` if the group does not exist.
   *
   * @throws A description of the exception. See {@link ChatError}.
   */
  async getGroupWithId(groupId) {
    _ChatConst.chatlog.log(`${ChatGroupManager.TAG}: getGroupWithId: `, groupId);
    let r = await _Native.Native._callMethod(_Consts.MTgetGroupWithId, {
      [_Consts.MTgetGroupWithId]: {
        groupId: groupId
      }
    });
    ChatGroupManager.checkErrorFromResult(r);
    const g = r === null || r === void 0 ? void 0 : r[_Consts.MTgetGroupWithId];
    if (g) {
      return new _ChatGroup.ChatGroup(g);
    }
    return undefined;
  }

  /**
   * Gets the list of groups that the current user has joined.
   *
   * This method gets data from the local database.
   *
   * @returns The group list.
   *
   * @throws A description of the exception. See {@link ChatError}.
   */
  async getJoinedGroups() {
    _ChatConst.chatlog.log(`${ChatGroupManager.TAG}: getJoinedGroups: `);
    let r = await _Native.Native._callMethod(_Consts.MTgetJoinedGroups);
    ChatGroupManager.checkErrorFromResult(r);
    const ret = [];
    Object.entries(r === null || r === void 0 ? void 0 : r[_Consts.MTgetJoinedGroups]).forEach(value => {
      ret.push(new _ChatGroup.ChatGroup(value[1]));
    });
    return ret;
  }

  /**
   * Gets the list of groups that the current user has joined.
   *
   * This method gets data from the server.
   *
   * This method returns a group list which does not contain member information. If you want to update information of a group to include its member information, call {@link fetchMemberListFromServer}.
   *
   * @param pageSize The number of groups that you expect to return on each page [1, 20].
   * @param pageNum The page number, starting from 0.
   * @returns The list of groups that the current user joins.
   *
   * @throws A description of the exception. See {@link ChatError}.
   */
  async fetchJoinedGroupsFromServer(pageSize, pageNum) {
    _ChatConst.chatlog.log(`${ChatGroupManager.TAG}: fetchJoinedGroupsFromServer: `, pageSize, pageNum);
    let r = await _Native.Native._callMethod(_Consts.MTgetJoinedGroupsFromServer, {
      [_Consts.MTgetJoinedGroupsFromServer]: {
        pageSize,
        pageNum,
        needRole: true,
        needMemberCount: true
      }
    });
    ChatGroupManager.checkErrorFromResult(r);
    const ret = [];
    Object.entries(r === null || r === void 0 ? void 0 : r[_Consts.MTgetJoinedGroupsFromServer]).forEach(value => {
      ret.push(new _ChatGroup.ChatGroup(value[1]));
    });
    return ret;
  }

  /**
   * Gets public groups from the server with pagination.
   *
   * @param pageSize The number of public groups that you expect on each page.
   * @param cursor The cursor position from which to start to get data. At the first method call, if you set `cursor` as `null`, the SDK gets the data in the reverse chronological order of when groups are created.
   * @returns The group list and the cursor for the next query. See {@link ChatCursorResult}.
   *
   * @throws A description of the exception. See {@link ChatError}.
   */
  async fetchPublicGroupsFromServer(pageSize, cursor) {
    _ChatConst.chatlog.log(`${ChatGroupManager.TAG}: fetchPublicGroupsFromServer: `, pageSize, cursor);
    let r = await _Native.Native._callMethod(_Consts.MTgetPublicGroupsFromServer, {
      [_Consts.MTgetPublicGroupsFromServer]: {
        pageSize,
        cursor
      }
    });
    ChatGroupManager.checkErrorFromResult(r);
    let ret = new _ChatCursorResult.ChatCursorResult({
      cursor: r === null || r === void 0 ? void 0 : r[_Consts.MTgetPublicGroupsFromServer].cursor,
      list: r === null || r === void 0 ? void 0 : r[_Consts.MTgetPublicGroupsFromServer].list,
      opt: {
        map: param => {
          return new _ChatGroup.ChatGroupInfo(param);
        }
      }
    });
    return ret;
  }

  /**
   * Creates a group instance.
   *
   * After the group is created, the data in the memory and database will be updated and multiple devices will receive the notification event and update the group to the memory and database.
   *
   * You can set {@link ChatGroupEventListener} to listen for the event.
   *
   * @param options The options for creating a group. They are optional and cannot be `null`. See {@link ChatGroupOptions}.
   * The options are as follows:
   * - The maximum number of members allowed in the group. The default value is 200.
   * - The group style. See {@link ChatGroupStyle}. The default value is {@link ChatGroupStyle.PrivateOnlyOwnerInvite}.
   * - Whether to ask for permission when inviting a user to join the group. The default value is `false`, indicating that invitees are automatically added to the group without their permission.
   * - The extension of group details.
   * @param groupName The group name. It is optional. Pass `null` if you do not want to set this parameter.
   * @param desc The group description. It is optional. Pass `null` if you do not want to set this parameter.
   * @param inviteMembers The group member array. The group owner ID is optional. This parameter cannot be `null`.
   * @param inviteReason The group joining invitation. It is optional. Pass `null` if you do not want to set this parameter.
   * @returns The created group instance.
   *
   * @throws A description of the exception. See {@link ChatError}.
   */
  async createGroup(options, groupName, desc, inviteMembers, inviteReason) {
    _ChatConst.chatlog.log(`${ChatGroupManager.TAG}: createGroup: `, options, groupName, desc, inviteMembers, inviteReason);
    let r = await _Native.Native._callMethod(_Consts.MTcreateGroup, {
      [_Consts.MTcreateGroup]: {
        groupName,
        desc,
        inviteMembers,
        inviteReason,
        options
      }
    });
    ChatGroupManager.checkErrorFromResult(r);
    return new _ChatGroup.ChatGroup(r === null || r === void 0 ? void 0 : r[_Consts.MTcreateGroup]);
  }

  /**
   * Gets the group information from the server.
   *
   * @param groupId The group ID.
   * @param isFetchMembers Whether to get group member information:
   *                       - `true`: Yes. This method can return information of at most 200 group members. To get information of all group members, you can call {@link fetchMemberListFromServer}.
   *                       - `false`: No.
   * @returns The group instance. The SDK returns `undefined` if the group does not exist.
   *
   * @throws A description of the exception. See {@link ChatError}.
   */
  async fetchGroupInfoFromServer(groupId) {
    let isFetchMembers = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
    _ChatConst.chatlog.log(`${ChatGroupManager.TAG}: fetchGroupInfoFromServer: `, groupId);
    let r = await _Native.Native._callMethod(_Consts.MTgetGroupSpecificationFromServer, {
      [_Consts.MTgetGroupSpecificationFromServer]: {
        groupId: groupId,
        fetchMembers: isFetchMembers
      }
    });
    ChatGroupManager.checkErrorFromResult(r);
    const g = r === null || r === void 0 ? void 0 : r[_Consts.MTgetGroupSpecificationFromServer];
    if (g) {
      return new _ChatGroup.ChatGroup(g);
    }
    return undefined;
  }

  /**
   * Uses the pagination to get the member list of the group from the server.
   *
   * @param groupId The group ID.
   * @param pageSize The number of group members that you expect to get on each page.
   * @param cursor The cursor position from which to start to get data. At the first method call, if you set `cursor` as `null`, the SDK gets the data in the reverse chronological order of when users join the group.
   * @returns The group member list and the cursor for the next query. See {@link ChatCursorResult}.
   *
   * @throws A description of the exception. See {@link ChatError}.
   */
  async fetchMemberListFromServer(groupId) {
    let pageSize = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 200;
    let cursor = arguments.length > 2 ? arguments[2] : undefined;
    _ChatConst.chatlog.log(`${ChatGroupManager.TAG}: fetchMemberListFromServer: `, groupId, pageSize, cursor);
    let r = await _Native.Native._callMethod(_Consts.MTgetGroupMemberListFromServer, {
      [_Consts.MTgetGroupMemberListFromServer]: {
        groupId,
        pageSize,
        cursor
      }
    });
    ChatGroupManager.checkErrorFromResult(r);
    let ret = new _ChatCursorResult.ChatCursorResult({
      cursor: r === null || r === void 0 ? void 0 : r[_Consts.MTgetGroupMemberListFromServer].cursor,
      list: r === null || r === void 0 ? void 0 : r[_Consts.MTgetGroupMemberListFromServer].list,
      opt: {
        map: param => {
          return param;
        }
      }
    });
    return ret;
  }

  /**
   * Uses the pagination to get the group block list from the server.
   *
   * Only the group owner or admin can call this method.
   *
   * @param groupId The group ID.
   * @param pageSize The number of group members on the block list that you expect to get on each page.
   * @param pageNum The page number, starting from 1.
   * @returns The group block list.
   *
   * @throws A description of the exception. See {@link ChatError}.
   */
  async fetchBlockListFromServer(groupId) {
    let pageSize = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 200;
    let pageNum = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1;
    _ChatConst.chatlog.log(`${ChatGroupManager.TAG}: fetchBlockListFromServer: `, groupId, pageSize, pageNum);
    let r = await _Native.Native._callMethod(_Consts.MTgetGroupBlockListFromServer, {
      [_Consts.MTgetGroupBlockListFromServer]: {
        groupId,
        pageSize,
        pageNum
      }
    });
    ChatGroupManager.checkErrorFromResult(r);
    let ret = r === null || r === void 0 ? void 0 : r[_Consts.MTgetGroupBlockListFromServer];
    return ret;
  }

  /**
   * Uses the pagination to get the mute list of the group from the server.
   *
   * Only the group owner or admin can call this method.
   *
   * @param groupId The group ID.
   * @param pageSize The number of muted members that you expect to get on each page.
   * @param pageNum The page number, starting from 1.
   * @returns The group mute list.
   *
   * @throws A description of the exception. See {@link ChatError}.
   */
  async fetchMuteListFromServer(groupId) {
    let pageSize = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 200;
    let pageNum = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1;
    _ChatConst.chatlog.log(`${ChatGroupManager.TAG}: fetchMuteListFromServer: `, groupId, pageSize, pageNum);
    let r = await _Native.Native._callMethod(_Consts.MTgetGroupMuteListFromServer, {
      [_Consts.MTgetGroupMuteListFromServer]: {
        groupId,
        pageSize,
        pageNum
      }
    });
    ChatGroupManager.checkErrorFromResult(r);
    let ret = r === null || r === void 0 ? void 0 : r[_Consts.MTgetGroupMuteListFromServer];
    return ret;
  }

  /**
   * Uses the pagination to get the allow list of the group from the server.
   *
   * Only the group owner or admin can call this method.
   *
   * @param groupId The group ID.
   * @returns The allow list of the group.
   *
   * @throws A description of the exception. See {@link ChatError}.
   */
  async fetchAllowListFromServer(groupId) {
    _ChatConst.chatlog.log(`${ChatGroupManager.TAG}: fetchAllowListFromServer: `, groupId);
    let r = await _Native.Native._callMethod(_Consts.MTgetGroupAllowListFromServer, {
      [_Consts.MTgetGroupAllowListFromServer]: {
        groupId
      }
    });
    ChatGroupManager.checkErrorFromResult(r);
    let ret = r === null || r === void 0 ? void 0 : r[_Consts.MTgetGroupAllowListFromServer];
    return ret;
  }

  /**
   * Gets whether the member is on the allow list of the group.
   *
   * @param groupId The group ID.
   * @returns Whether the current user is on the allow list of the group.
   * - `true`: Yes.
   * - `false`: No.
   *
   * @throws A description of the exception. See {@link ChatError}.
   */
  async isMemberInAllowListFromServer(groupId) {
    _ChatConst.chatlog.log(`${ChatGroupManager.TAG}: isMemberInAllowListFromServer: `, groupId);
    let r = await _Native.Native._callMethod(_Consts.MTisMemberInAllowListFromServer, {
      [_Consts.MTisMemberInAllowListFromServer]: {
        groupId
      }
    });
    ChatGroupManager.checkErrorFromResult(r);
    let ret = r === null || r === void 0 ? void 0 : r[_Consts.MTisMemberInAllowListFromServer];
    return ret;
  }

  /**
   * Uses the pagination to get the shared files of the group from the server.
   *
   * @param groupId The group ID.
   * @param pageSize The number of shared files that you get on each page.
   * @param pageNum The page number, starting from 1.
   * @returns The shared file list.
   *
   * @throws A description of the exception. See {@link ChatError}.
   */
  async fetchGroupFileListFromServer(groupId) {
    let pageSize = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 200;
    let pageNum = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1;
    _ChatConst.chatlog.log(`${ChatGroupManager.TAG}: fetchGroupFileListFromServer: `, groupId, pageSize, pageNum);
    let r = await _Native.Native._callMethod(_Consts.MTgetGroupFileListFromServer, {
      [_Consts.MTgetGroupFileListFromServer]: {
        groupId,
        pageSize,
        pageNum
      }
    });
    ChatGroupManager.checkErrorFromResult(r);
    const ret = [];
    Object.entries(r === null || r === void 0 ? void 0 : r[_Consts.MTgetGroupFileListFromServer]).forEach(value => {
      ret.push(new _ChatGroup.ChatGroupSharedFile(value[1]));
    });
    return ret;
  }

  /**
   * Gets the group announcement from the server.
   *
   * All group members can call this method.
   *
   * @param groupId The group ID.
   * @returns The group announcement.
   *
   * @throws A description of the exception. See {@link ChatError}.
   */
  async fetchAnnouncementFromServer(groupId) {
    _ChatConst.chatlog.log(`${ChatGroupManager.TAG}: fetchAnnouncementFromServer: `, groupId);
    let r = await _Native.Native._callMethod(_Consts.MTgetGroupAnnouncementFromServer, {
      [_Consts.MTgetGroupAnnouncementFromServer]: {
        groupId
      }
    });
    ChatGroupManager.checkErrorFromResult(r);
    let ret = r === null || r === void 0 ? void 0 : r[_Consts.MTgetGroupAnnouncementFromServer];
    return ret;
  }

  /**
   * Adds users to the group.
   *
   * Only the group owner or admin can call this method.
   *
   * @param groupId The group ID.
   * @param members The array of new members to add.
   * @param welcome (optional) The welcome message.
   *
   * @throws A description of the exception. See {@link ChatError}.
   */
  async addMembers(groupId, members, welcome) {
    _ChatConst.chatlog.log(`${ChatGroupManager.TAG}: addMembers: `, groupId, members, welcome);
    let r = await _Native.Native._callMethod(_Consts.MTaddMembers, {
      [_Consts.MTaddMembers]: {
        groupId,
        members,
        welcome
      }
    });
    ChatGroupManager.checkErrorFromResult(r);
  }

  /**
   * Invites users to join the group.
   *
   * This method works only for groups with the following styles:
   * - `PrivateOnlyOwnerInvite` style: Only the group owner can invite users to join the group.
   * - `PrivateMemberCanInvite` style: Each group member can invite users to join the group.
   * - `PublicJoinNeedApproval` style: Each group member can invite users to join the group and users can join a group only after getting approval from the group owner or admins.
   *
   * @param groupId The group ID.
   * @param members The array of user IDs of new members to invite.
   * @param reason The invitation reason.
   *
   * @throws A description of the exception. See {@link ChatError}.
   */
  async inviteUser(groupId, members, reason) {
    _ChatConst.chatlog.log(`${ChatGroupManager.TAG}: inviteUser: `, groupId, members, reason);
    let r = await _Native.Native._callMethod(_Consts.MTinviterUser, {
      [_Consts.MTinviterUser]: {
        groupId,
        members,
        reason
      }
    });
    ChatGroupManager.checkErrorFromResult(r);
  }

  /**
   * Removes a member from the group.
   *
   * Only the group owner or admin can call this method.
   *
   * @param groupId The group ID.
   * @param members The user ID of the member to be removed.
   *
   * @throws A description of the exception. See {@link ChatError}.
   */
  async removeMembers(groupId, members) {
    _ChatConst.chatlog.log(`${ChatGroupManager.TAG}: removeMembers: `, groupId, members);
    let r = await _Native.Native._callMethod(_Consts.MTremoveMembers, {
      [_Consts.MTremoveMembers]: {
        groupId,
        members
      }
    });
    ChatGroupManager.checkErrorFromResult(r);
  }

  /**
   * Adds the user to the block list of the group.
   *
   * Users will be first removed from the group they have joined before being added to the block list of the group. The users on the group block list cannot join the group again.
   *
   * Only the group owner or admin can call this method.
   *
   * @param groupId The group ID.
   * @param members The array of user IDs of members to be added to the block list.
   *
   * @throws A description of the exception. See {@link ChatError}.
   */
  async blockMembers(groupId, members) {
    _ChatConst.chatlog.log(`${ChatGroupManager.TAG}: blockMembers: `, groupId, members);
    let r = await _Native.Native._callMethod(_Consts.MTblockMembers, {
      [_Consts.MTblockMembers]: {
        groupId,
        members
      }
    });
    ChatGroupManager.checkErrorFromResult(r);
  }

  /**
   * Removes users from the group block list.
   *
   * Only the group owner or admin can call this method.
   *
   * @param groupId The group ID.
   * @param members The user IDs of members to be removed from the group block list.
   *
   * @throws A description of the exception. See {@link ChatError}.
   */
  async unblockMembers(groupId, members) {
    _ChatConst.chatlog.log(`${ChatGroupManager.TAG}: unblockMembers: `, groupId, members);
    let r = await _Native.Native._callMethod(_Consts.MTunblockMembers, {
      [_Consts.MTunblockMembers]: {
        groupId,
        members
      }
    });
    ChatGroupManager.checkErrorFromResult(r);
  }

  /**
   * Changes the group name.
   *
   * Only the group owner or admin can call this method.
   *
   * @param groupId The group ID.
   * @param groupName The new group name.
   *
   * @throws A description of the exception. See {@link ChatError}.
   */
  async changeGroupName(groupId, groupName) {
    _ChatConst.chatlog.log(`${ChatGroupManager.TAG}: changeGroupName: `, groupId, groupName);
    let r = await _Native.Native._callMethod(_Consts.MTupdateGroupSubject, {
      [_Consts.MTupdateGroupSubject]: {
        groupId,
        name: groupName
      }
    });
    ChatGroupManager.checkErrorFromResult(r);
  }

  /**
   * Modifies the group description.
   *
   * Only the group owner or admin can call this method.
   *
   * @param groupId The group ID.
   * @param description The new group description.
   *
   * @throws A description of the exception. See {@link ChatError}.
   */
  async changeGroupDescription(groupId, description) {
    _ChatConst.chatlog.log(`${ChatGroupManager.TAG}: changeGroupDescription: `, groupId, description);
    let r = await _Native.Native._callMethod(_Consts.MTupdateDescription, {
      [_Consts.MTupdateDescription]: {
        groupId,
        desc: description
      }
    });
    ChatGroupManager.checkErrorFromResult(r);
  }

  /**
   * Leaves a group.
   *
   * @param groupId The group ID.
   *
   * @throws A description of the exception. See {@link ChatError}.
   */
  async leaveGroup(groupId) {
    _ChatConst.chatlog.log(`${ChatGroupManager.TAG}: leaveGroup: `, groupId);
    let r = await _Native.Native._callMethod(_Consts.MTleaveGroup, {
      [_Consts.MTleaveGroup]: {
        groupId
      }
    });
    ChatGroupManager.checkErrorFromResult(r);
  }

  /**
   * Destroys the group instance.
   *
   * Only the group owner can call this method.
   *
   * @param groupId The group ID.
   *
   * @throws A description of the exception. See {@link ChatError}.
   */
  async destroyGroup(groupId) {
    _ChatConst.chatlog.log(`${ChatGroupManager.TAG}: destroyGroup: `, groupId);
    let r = await _Native.Native._callMethod(_Consts.MTdestroyGroup, {
      [_Consts.MTdestroyGroup]: {
        groupId
      }
    });
    ChatGroupManager.checkErrorFromResult(r);
  }

  /**
   * Blocks group messages.
   *
   * The user that blocks group messages is still a group member, but cannot receive group messages.
   *
   * @param groupId The group ID.
   *
   * @throws A description of the exception. See {@link ChatError}.
   */
  async blockGroup(groupId) {
    _ChatConst.chatlog.log(`${ChatGroupManager.TAG}: blockGroup: `, groupId);
    let r = await _Native.Native._callMethod(_Consts.MTblockGroup, {
      [_Consts.MTblockGroup]: {
        groupId
      }
    });
    ChatGroupManager.checkErrorFromResult(r);
  }

  /**
   * Unblocks group messages.
   *
   * @param groupId The group ID.
   *
   * @throws A description of the exception. See {@link ChatError}.
   */
  async unblockGroup(groupId) {
    _ChatConst.chatlog.log(`${ChatGroupManager.TAG}: unblockGroup: `, groupId);
    let r = await _Native.Native._callMethod(_Consts.MTunblockGroup, {
      [_Consts.MTunblockGroup]: {
        groupId
      }
    });
    ChatGroupManager.checkErrorFromResult(r);
  }

  /**
   * Transfers the group ownership.
   *
   * Only the group owner can call this method.
   *
   * @param groupId The group ID.
   * @param newOwner The user ID of the new group owner.
   *
   * @throws A description of the exception. See {@link ChatError}.
   */
  async changeOwner(groupId, newOwner) {
    _ChatConst.chatlog.log(`${ChatGroupManager.TAG}: changeOwner: `, groupId, newOwner);
    let r = await _Native.Native._callMethod(_Consts.MTupdateGroupOwner, {
      [_Consts.MTupdateGroupOwner]: {
        groupId: groupId,
        owner: newOwner
      }
    });
    ChatGroupManager.checkErrorFromResult(r);
  }

  /**
   * Adds a group admin.
   *
   * Only the group owner can call this method and group admins cannot.
   *
   * @param groupId The group ID.
   * @param admin The user ID of the admin to add.
   *
   * @throws A description of the exception. See {@link ChatError}.
   */
  async addAdmin(groupId, admin) {
    _ChatConst.chatlog.log(`${ChatGroupManager.TAG}: addAdmin: `, groupId, admin);
    let r = await _Native.Native._callMethod(_Consts.MTaddAdmin, {
      [_Consts.MTaddAdmin]: {
        groupId,
        admin
      }
    });
    ChatGroupManager.checkErrorFromResult(r);
  }

  /**
   * Removes a group admin.
   *
   * Only the group owner can call this method.
   *
   * @param groupId The group ID.
   * @param admin The user ID of the group admin to remove.
   *
   * @throws A description of the exception. See {@link ChatError}.
   */
  async removeAdmin(groupId, admin) {
    _ChatConst.chatlog.log(`${ChatGroupManager.TAG}: removeAdmin: `, groupId, admin);
    let r = await _Native.Native._callMethod(_Consts.MTremoveAdmin, {
      [_Consts.MTremoveAdmin]: {
        groupId,
        admin
      }
    });
    ChatGroupManager.checkErrorFromResult(r);
  }

  /**
   * Mutes group members.
   *
   * Only the group owner or admin can call this method.
   *
   * @param groupId The group ID.
   * @param members The list of user IDs of members to mute.
   * @param duration The mute duration in milliseconds. It is a reserved parameter.
   *
   * @throws A description of the exception. See {@link ChatError}.
   */
  async muteMembers(groupId, members) {
    let duration = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : -1;
    _ChatConst.chatlog.log(`${ChatGroupManager.TAG}: muteMembers: `, groupId, members, duration);
    let r = await _Native.Native._callMethod(_Consts.MTmuteMembers, {
      [_Consts.MTmuteMembers]: {
        groupId,
        members,
        duration
      }
    });
    ChatGroupManager.checkErrorFromResult(r);
  }

  /**
   * Unmutes group members.
   *
   * Only the group owner or admin can call this method.
   *
   * @param groupId The group ID.
   * @param members The array of user IDs of members to be unmuted.
   *
   * @throws A description of the exception. See {@link ChatError}.
   */
  async unMuteMembers(groupId, members) {
    _ChatConst.chatlog.log(`${ChatGroupManager.TAG}: unMuteMembers: `, groupId, members);
    let r = await _Native.Native._callMethod(_Consts.MTunMuteMembers, {
      [_Consts.MTunMuteMembers]: {
        groupId,
        members
      }
    });
    ChatGroupManager.checkErrorFromResult(r);
  }

  /**
   * Mutes all members.
   *
   * Only the group owner or admin can call this method.
   *
   * @param groupId The group ID.
   *
   * @throws A description of the exception. See {@link ChatError}.
   */
  async muteAllMembers(groupId) {
    _ChatConst.chatlog.log(`${ChatGroupManager.TAG}: muteAllMembers: `, groupId);
    let r = await _Native.Native._callMethod(_Consts.MTmuteAllMembers, {
      [_Consts.MTmuteAllMembers]: {
        groupId
      }
    });
    ChatGroupManager.checkErrorFromResult(r);
  }

  /**
   * Unmutes all group members.
   *
   * Only the group owner or admin can call this method.
   *
   * @param groupId The group ID.
   *
   * @throws A description of the exception. See {@link ChatError}.
   */
  async unMuteAllMembers(groupId) {
    _ChatConst.chatlog.log(`${ChatGroupManager.TAG}: unMuteAllMembers: `, groupId);
    let r = await _Native.Native._callMethod(_Consts.MTunMuteAllMembers, {
      [_Consts.MTunMuteAllMembers]: {
        groupId
      }
    });
    ChatGroupManager.checkErrorFromResult(r);
  }

  /**
   * Adds members to the allow list of the group.
   *
   * Only the group owner or admin can call this method.
   *
   * @param groupId The group ID.
   * @param members The user IDs of members to be added to the allow list of the group.
   *
   * @throws A description of the exception. See {@link ChatError}.
   */
  async addAllowList(groupId, members) {
    _ChatConst.chatlog.log(`${ChatGroupManager.TAG}: addAllowList: `, groupId, members);
    let r = await _Native.Native._callMethod(_Consts.MTaddAllowList, {
      [_Consts.MTaddAllowList]: {
        groupId,
        members
      }
    });
    ChatGroupManager.checkErrorFromResult(r);
  }

  /**
   * Removes members from the allow list of the group.
   *
   * Only the group owner or admin can call this method.
   *
   * @param groupId The group ID.
   * @param members The user IDs of members to be removed from the allow list of the group.
   *
   * @throws A description of the exception. See {@link ChatError}.
   */
  async removeAllowList(groupId, members) {
    _ChatConst.chatlog.log(`${ChatGroupManager.TAG}: removeAllowList: `, groupId, members);
    let r = await _Native.Native._callMethod(_Consts.MTremoveAllowList, {
      [_Consts.MTremoveAllowList]: {
        groupId,
        members
      }
    });
    ChatGroupManager.checkErrorFromResult(r);
  }

  /**
   * Uploads the shared file to the group.
   *
   * When a shared file is uploaded, the upload progress callback will be triggered.
   *
   * @param groupId The group ID.
   * @param filePath The local path of the shared file.
   * @param callback (Optional) The file upload result callback.
   *
   * @throws A description of the exception. See {@link ChatError}.
   */
  async uploadGroupSharedFile(groupId, filePath, callback) {
    _ChatConst.chatlog.log(`${ChatGroupManager.TAG}: uploadGroupSharedFile: `, groupId, filePath);
    ChatGroupManager.handleUploadFileCallback(this, groupId, filePath, callback);
    let r = await _Native.Native._callMethod(_Consts.MTuploadGroupSharedFile, {
      [_Consts.MTuploadGroupSharedFile]: {
        groupId,
        filePath
      }
    });
    ChatGroupManager.checkErrorFromResult(r);
  }

  /**
   * Downloads the shared file of the group.
   *
   * @param groupId The group ID.
   * @param fileId The ID of the shared file.
   * @param savePath The local path of the shared file.
   * @param callback (Optional) The file upload result callback.
   *
   * @throws A description of the exception. See {@link ChatError}.
   */
  async downloadGroupSharedFile(groupId, fileId, savePath, callback) {
    _ChatConst.chatlog.log(`${ChatGroupManager.TAG}: downloadGroupSharedFile: `, groupId, fileId, savePath);
    ChatGroupManager.handleDownloadFileCallback(this, groupId, savePath, callback);
    let r = await _Native.Native._callMethod(_Consts.MTdownloadGroupSharedFile, {
      [_Consts.MTdownloadGroupSharedFile]: {
        groupId,
        fileId,
        savePath
      }
    });
    ChatGroupManager.checkErrorFromResult(r);
  }

  /**
   * Removes a shared file of the group.
   *
   * Group members can delete their own uploaded files. The group owner or admin can delete all shared files.
   *
   * @param groupId The group ID.
   * @param fileId The ID of the shared file.
   *
   * @throws A description of the exception. See {@link ChatError}.
   */
  async removeGroupSharedFile(groupId, fileId) {
    _ChatConst.chatlog.log(`${ChatGroupManager.TAG}: removeGroupSharedFile: `, groupId, fileId);
    let r = await _Native.Native._callMethod(_Consts.MTremoveGroupSharedFile, {
      [_Consts.MTremoveGroupSharedFile]: {
        groupId,
        fileId
      }
    });
    ChatGroupManager.checkErrorFromResult(r);
  }

  /**
   * Updates the group announcement.
   *
   * Only the group owner or admin can call this method.
   *
   * @param groupId The group ID.
   * @param announcement The group announcement.
   *
   * @throws A description of the exception. See {@link ChatError}.
   */
  async updateGroupAnnouncement(groupId, announcement) {
    _ChatConst.chatlog.log(`${ChatGroupManager.TAG}: updateGroupAnnouncement: `, groupId, announcement);
    let r = await _Native.Native._callMethod(_Consts.MTupdateGroupAnnouncement, {
      [_Consts.MTupdateGroupAnnouncement]: {
        groupId,
        announcement
      }
    });
    ChatGroupManager.checkErrorFromResult(r);
  }

  /**
   * Updates the group extension field.
   *
   * Only the group owner or admin can call this method.
   *
   * @param groupId The group ID.
   * @param extension The updated group extension field.
   *
   * @throws A description of the exception. See {@link ChatError}.
   */
  async updateGroupExtension(groupId, extension) {
    _ChatConst.chatlog.log(`${ChatGroupManager.TAG}: updateGroupExtension: `, groupId, extension);
    let r = await _Native.Native._callMethod(_Consts.MTupdateGroupExt, {
      [_Consts.MTupdateGroupExt]: {
        groupId: groupId,
        ext: extension
      }
    });
    ChatGroupManager.checkErrorFromResult(r);
  }

  /**
   * Joins a public group.
   *
   * For a group that requires no authentication，users can join it freely without obtaining permissions from the group owner or admin.
   *
   * For a group that requires authentication, users need to wait for the group owner or admin to agree before joining the group. For details, see {@link ChatGroupStyle}.
   *
   * @param groupId The group ID.
   *
   * @throws A description of the exception. See {@link ChatError}.
   */
  async joinPublicGroup(groupId) {
    _ChatConst.chatlog.log(`${ChatGroupManager.TAG}: joinPublicGroup: `, groupId);
    let r = await _Native.Native._callMethod(_Consts.MTjoinPublicGroup, {
      [_Consts.MTjoinPublicGroup]: {
        groupId
      }
    });
    ChatGroupManager.checkErrorFromResult(r);
  }

  /**
   * Requests to join a group.
   *
   * You can call this method to only join public groups requiring authentication, i.e., groups with the style of {@link ChatGroupStyle.PublicJoinNeedApproval}.
   *
   * @param groupId The group ID.
   * @param reason The reason for requesting to join the group.
   *
   * @throws A description of the exception. See {@link ChatError}.
   */
  async requestToJoinPublicGroup(groupId, reason) {
    _ChatConst.chatlog.log(`${ChatGroupManager.TAG}: requestToJoinPublicGroup: `, groupId, reason);
    let r = await _Native.Native._callMethod(_Consts.MTrequestToJoinPublicGroup, {
      [_Consts.MTrequestToJoinPublicGroup]: {
        groupId,
        reason
      }
    });
    ChatGroupManager.checkErrorFromResult(r);
  }

  /**
   * Accepts a join request.
   *
   * Only the group owner or admin can call this method.
   *
   * @param groupId The group ID.
   * @param userId The ID of the user who sends a request to join the group.
   *
   * @throws A description of the exception. See {@link ChatError}.
   */
  async acceptJoinApplication(groupId, userId) {
    _ChatConst.chatlog.log(`${ChatGroupManager.TAG}: acceptJoinApplication: `, groupId, userId);
    let r = await _Native.Native._callMethod(_Consts.MTacceptJoinApplication, {
      [_Consts.MTacceptJoinApplication]: {
        groupId,
        username: userId
      }
    });
    ChatGroupManager.checkErrorFromResult(r);
  }

  /**
   * Declines a join request.
   *
   * Only the group owner or admin can call this method.
   *
   * @param groupId The group ID.
   * @param username The ID of the user who sends a request to join the group.
   * @param reason The reason of declining the join request.
   *
   * @throws A description of the exception. See {@link ChatError}.
   */
  async declineJoinApplication(groupId, username, reason) {
    _ChatConst.chatlog.log(`${ChatGroupManager.TAG}: declineJoinApplication: `, groupId, username, reason);
    let r = await _Native.Native._callMethod(_Consts.MTdeclineJoinApplication, {
      [_Consts.MTdeclineJoinApplication]: {
        groupId,
        username,
        reason
      }
    });
    ChatGroupManager.checkErrorFromResult(r);
  }

  /**
   * Accepts a group invitation.
   *
   * @param groupId The group ID.
   * @param inviter The user ID of the inviter.
   *
   * @throws A description of the exception. See {@link ChatError}.
   */
  async acceptInvitation(groupId, inviter) {
    _ChatConst.chatlog.log(`${ChatGroupManager.TAG}: acceptInvitation: `, groupId, inviter);
    let r = await _Native.Native._callMethod(_Consts.MTacceptInvitationFromGroup, {
      [_Consts.MTdeclineJoinApplication]: {
        groupId,
        inviter
      }
    });
    ChatGroupManager.checkErrorFromResult(r);
  }

  /**
   * Declines a group invitation.
   *
   * @param groupId The group ID.
   * @param inviter The user ID of the inviter.
   * @param reason The reason for declining the invitation.
   *
   * @throws A description of the exception. See {@link ChatError}.
   */
  async declineInvitation(groupId, inviter, reason) {
    _ChatConst.chatlog.log(`${ChatGroupManager.TAG}: declineInvitation: `, groupId, inviter, reason);
    let r = await _Native.Native._callMethod(_Consts.MTdeclineInvitationFromGroup, {
      [_Consts.MTdeclineInvitationFromGroup]: {
        groupId,
        inviter,
        reason
      }
    });
    ChatGroupManager.checkErrorFromResult(r);
  }

  /**
   * Sets custom attributes of a group member.
   *
   * @param groupId The group ID.
   * @param member The array of user IDs of group members whose custom attributes are retrieved.(limitation is ten. More than callback error. )
   * @param attribute The map of custom attributes in key-value format. In a key-value pair, if the value is set to an empty string, the custom attribute will be deleted.
   *
   * @throws A description of the exception. See {@link ChatError}.
   */
  async setMemberAttribute(groupId, member, attributes) {
    _ChatConst.chatlog.log(`${ChatGroupManager.TAG}: setMemberAttribute: `, groupId, member, attributes);
    let r = await _Native.Native._callMethod(_Consts.MTsetMemberAttributesFromGroup, {
      [_Consts.MTsetMemberAttributesFromGroup]: {
        groupId,
        member,
        attributes
      }
    });
    ChatGroupManager.checkErrorFromResult(r);
  }

  /**
   * Gets all custom attributes of a group member.
   *
   * @param groupId The group ID.
   * @param member The user ID of the group member whose all custom attributes are retrieved.
   *
   * @returns The user attributes.
   *
   * @throws A description of the exception. See {@link ChatError}.
   */
  async fetchMemberAttributes(groupId, member) {
    _ChatConst.chatlog.log(`${ChatGroupManager.TAG}: fetchMemberAttributes: `, groupId, member);
    let r = await _Native.Native._callMethod(_Consts.MTfetchMemberAttributesFromGroup, {
      [_Consts.MTfetchMemberAttributesFromGroup]: {
        groupId,
        member
      }
    });
    ChatGroupManager.checkErrorFromResult(r);
    return r === null || r === void 0 ? void 0 : r[_Consts.MTfetchMemberAttributesFromGroup];
  }

  /**
   * Gets custom attributes of multiple group members by attribute key.
   *
   * @param groupId The group ID.
   * @param members The array of user IDs of group members whose custom attributes are retrieved.(limitation is ten. More than callback error. )
   * @param attributeKeys The array of keys of custom attributes to be retrieved.
   *
   * @returns The users attributes.
   *
   * @throws A description of the exception. See {@link ChatError}.
   */
  async fetchMembersAttributes(groupId, members, attributeKeys) {
    _ChatConst.chatlog.log(`${ChatGroupManager.TAG}: fetchMembersAttributes: `, groupId, members, attributeKeys);
    let r = await _Native.Native._callMethod(_Consts.MTfetchMembersAttributesFromGroup, {
      [_Consts.MTfetchMembersAttributesFromGroup]: {
        groupId,
        members,
        keys: attributeKeys
      }
    });
    ChatGroupManager.checkErrorFromResult(r);
    const ret = new Map();
    Object.entries(r === null || r === void 0 ? void 0 : r[_Consts.MTfetchMembersAttributesFromGroup]).forEach(v => {
      ret.set(v[0], v[1]);
    });
    return ret;
  }

  /**
   * Gets the number of groups joined by the current user.
   *
   * @returns The list of joined groups of the current user.
   *
   * @throws A description of the exception. See {@link ChatError}.
   */
  async fetchJoinedGroupCount() {
    _ChatConst.chatlog.log(`${ChatGroupManager.TAG}: fetchJoinedGroupCount: `);
    let r = await _Native.Native._callMethod(_Consts.MTfetchJoinedGroupCount);
    ChatGroupManager.checkErrorFromResult(r);
    return r === null || r === void 0 ? void 0 : r[_Consts.MTfetchJoinedGroupCount];
  }

  /**
   * Adds a group listener.
   *
   * @param listener The group listener to add.
   */
  addGroupListener(listener) {
    _ChatConst.chatlog.log(`${ChatGroupManager.TAG}: addGroupListener: `);
    this._groupListeners.add(listener);
  }

  /**
   * Removes the group listener.
   *
   * @param listener The group listener to remove.
   */
  removeGroupListener(listener) {
    _ChatConst.chatlog.log(`${ChatGroupManager.TAG}: removeGroupListener: `);
    this._groupListeners.delete(listener);
  }

  /**
   * Clears all group listeners.
   */
  removeAllGroupListener() {
    _ChatConst.chatlog.log(`${ChatGroupManager.TAG}: removeAllGroupListener: `);
    this._groupListeners.clear();
  }
}
exports.ChatGroupManager = ChatGroupManager;
//# sourceMappingURL=ChatGroupManager.js.map
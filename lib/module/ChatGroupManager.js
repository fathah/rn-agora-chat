import { BaseManager } from './__internal__/Base';
import { MTacceptInvitationFromGroup, MTacceptJoinApplication, MTaddAdmin, MTaddAllowList, MTaddMembers, MTblockGroup, MTblockMembers, MTcreateGroup, MTdeclineInvitationFromGroup, MTdeclineJoinApplication, MTdestroyGroup, MTdownloadGroupSharedFile, MTfetchJoinedGroupCount, MTfetchMemberAttributesFromGroup, MTfetchMembersAttributesFromGroup, MTgetGroupAllowListFromServer, MTgetGroupAnnouncementFromServer, MTgetGroupBlockListFromServer, MTgetGroupFileListFromServer, MTgetGroupMemberListFromServer, MTgetGroupMuteListFromServer, MTgetGroupSpecificationFromServer, MTgetGroupWithId, MTgetJoinedGroups, MTgetJoinedGroupsFromServer, MTgetPublicGroupsFromServer, MTinviterUser, MTisMemberInAllowListFromServer, MTjoinPublicGroup, MTleaveGroup, MTmuteAllMembers, MTmuteMembers, MTonGroupChanged, MTremoveAdmin, MTremoveAllowList, MTremoveGroupSharedFile, MTremoveMembers, MTrequestToJoinPublicGroup, MTsetMemberAttributesFromGroup, MTunblockGroup, MTunblockMembers, MTunMuteAllMembers, MTunMuteMembers, MTupdateDescription, MTupdateGroupAnnouncement, MTupdateGroupExt, MTupdateGroupOwner, MTupdateGroupSubject, MTuploadGroupSharedFile } from './__internal__/Consts';
import { ExceptionHandler } from './__internal__/ErrorHandler';
import { Native } from './__internal__/Native';
import { chatlog } from './common/ChatConst';
import { ChatCursorResult } from './common/ChatCursorResult';
import { ChatException } from './common/ChatError';
import { ChatGroup, ChatGroupInfo, ChatGroupSharedFile } from './common/ChatGroup';

/**
 * The group manager class, which defines how to manage groups, like group creation and destruction and member management.
 */
export class ChatGroupManager extends BaseManager {
  static TAG = 'ChatGroupManager';
  constructor() {
    super();
    this._groupListeners = new Set();
    this._groupSubscriptions = new Map();
  }
  setNativeListener(event) {
    this._eventEmitter = event;
    chatlog.log(`${ChatGroupManager.TAG}: setNativeListener: `);
    this._groupSubscriptions.forEach(value => {
      value.remove();
    });
    this._groupSubscriptions.clear();
    this._groupSubscriptions.set(MTonGroupChanged, event.addListener(MTonGroupChanged, params => {
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
          (_listener$onStateChan = listener.onStateChanged) === null || _listener$onStateChan === void 0 ? void 0 : _listener$onStateChan.call(listener, new ChatGroup(params.group));
          break;
        case 'onSpecificationChanged':
          (_listener$onDetailCha = listener.onDetailChanged) === null || _listener$onDetailCha === void 0 ? void 0 : _listener$onDetailCha.call(listener, new ChatGroup(params.group));
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
          ExceptionHandler.getInstance().sendExcept({
            except: new ChatException({
              code: 1,
              description: `This type is not supported. ` + groupEventType
            }),
            from: ChatGroupManager.TAG
          });
      }
    });
  }
  static handleUploadFileCallback(self, groupId, filePath, callback) {
    ChatGroupManager.handleGroupFileCallback(MTuploadGroupSharedFile, self, groupId, filePath, callback);
  }
  static handleDownloadFileCallback(self, groupId, filePath, callback) {
    ChatGroupManager.handleGroupFileCallback(MTdownloadGroupSharedFile, self, groupId, filePath, callback);
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
    chatlog.log(`${ChatGroupManager.TAG}: getGroupWithId: `, groupId);
    let r = await Native._callMethod(MTgetGroupWithId, {
      [MTgetGroupWithId]: {
        groupId: groupId
      }
    });
    ChatGroupManager.checkErrorFromResult(r);
    const g = r === null || r === void 0 ? void 0 : r[MTgetGroupWithId];
    if (g) {
      return new ChatGroup(g);
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
    chatlog.log(`${ChatGroupManager.TAG}: getJoinedGroups: `);
    let r = await Native._callMethod(MTgetJoinedGroups);
    ChatGroupManager.checkErrorFromResult(r);
    const ret = [];
    Object.entries(r === null || r === void 0 ? void 0 : r[MTgetJoinedGroups]).forEach(value => {
      ret.push(new ChatGroup(value[1]));
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
    chatlog.log(`${ChatGroupManager.TAG}: fetchJoinedGroupsFromServer: `, pageSize, pageNum);
    let r = await Native._callMethod(MTgetJoinedGroupsFromServer, {
      [MTgetJoinedGroupsFromServer]: {
        pageSize,
        pageNum,
        needRole: true,
        needMemberCount: true
      }
    });
    ChatGroupManager.checkErrorFromResult(r);
    const ret = [];
    Object.entries(r === null || r === void 0 ? void 0 : r[MTgetJoinedGroupsFromServer]).forEach(value => {
      ret.push(new ChatGroup(value[1]));
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
    chatlog.log(`${ChatGroupManager.TAG}: fetchPublicGroupsFromServer: `, pageSize, cursor);
    let r = await Native._callMethod(MTgetPublicGroupsFromServer, {
      [MTgetPublicGroupsFromServer]: {
        pageSize,
        cursor
      }
    });
    ChatGroupManager.checkErrorFromResult(r);
    let ret = new ChatCursorResult({
      cursor: r === null || r === void 0 ? void 0 : r[MTgetPublicGroupsFromServer].cursor,
      list: r === null || r === void 0 ? void 0 : r[MTgetPublicGroupsFromServer].list,
      opt: {
        map: param => {
          return new ChatGroupInfo(param);
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
    chatlog.log(`${ChatGroupManager.TAG}: createGroup: `, options, groupName, desc, inviteMembers, inviteReason);
    let r = await Native._callMethod(MTcreateGroup, {
      [MTcreateGroup]: {
        groupName,
        desc,
        inviteMembers,
        inviteReason,
        options
      }
    });
    ChatGroupManager.checkErrorFromResult(r);
    return new ChatGroup(r === null || r === void 0 ? void 0 : r[MTcreateGroup]);
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
    chatlog.log(`${ChatGroupManager.TAG}: fetchGroupInfoFromServer: `, groupId);
    let r = await Native._callMethod(MTgetGroupSpecificationFromServer, {
      [MTgetGroupSpecificationFromServer]: {
        groupId: groupId,
        fetchMembers: isFetchMembers
      }
    });
    ChatGroupManager.checkErrorFromResult(r);
    const g = r === null || r === void 0 ? void 0 : r[MTgetGroupSpecificationFromServer];
    if (g) {
      return new ChatGroup(g);
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
    chatlog.log(`${ChatGroupManager.TAG}: fetchMemberListFromServer: `, groupId, pageSize, cursor);
    let r = await Native._callMethod(MTgetGroupMemberListFromServer, {
      [MTgetGroupMemberListFromServer]: {
        groupId,
        pageSize,
        cursor
      }
    });
    ChatGroupManager.checkErrorFromResult(r);
    let ret = new ChatCursorResult({
      cursor: r === null || r === void 0 ? void 0 : r[MTgetGroupMemberListFromServer].cursor,
      list: r === null || r === void 0 ? void 0 : r[MTgetGroupMemberListFromServer].list,
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
    chatlog.log(`${ChatGroupManager.TAG}: fetchBlockListFromServer: `, groupId, pageSize, pageNum);
    let r = await Native._callMethod(MTgetGroupBlockListFromServer, {
      [MTgetGroupBlockListFromServer]: {
        groupId,
        pageSize,
        pageNum
      }
    });
    ChatGroupManager.checkErrorFromResult(r);
    let ret = r === null || r === void 0 ? void 0 : r[MTgetGroupBlockListFromServer];
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
    chatlog.log(`${ChatGroupManager.TAG}: fetchMuteListFromServer: `, groupId, pageSize, pageNum);
    let r = await Native._callMethod(MTgetGroupMuteListFromServer, {
      [MTgetGroupMuteListFromServer]: {
        groupId,
        pageSize,
        pageNum
      }
    });
    ChatGroupManager.checkErrorFromResult(r);
    let ret = r === null || r === void 0 ? void 0 : r[MTgetGroupMuteListFromServer];
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
    chatlog.log(`${ChatGroupManager.TAG}: fetchAllowListFromServer: `, groupId);
    let r = await Native._callMethod(MTgetGroupAllowListFromServer, {
      [MTgetGroupAllowListFromServer]: {
        groupId
      }
    });
    ChatGroupManager.checkErrorFromResult(r);
    let ret = r === null || r === void 0 ? void 0 : r[MTgetGroupAllowListFromServer];
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
    chatlog.log(`${ChatGroupManager.TAG}: isMemberInAllowListFromServer: `, groupId);
    let r = await Native._callMethod(MTisMemberInAllowListFromServer, {
      [MTisMemberInAllowListFromServer]: {
        groupId
      }
    });
    ChatGroupManager.checkErrorFromResult(r);
    let ret = r === null || r === void 0 ? void 0 : r[MTisMemberInAllowListFromServer];
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
    chatlog.log(`${ChatGroupManager.TAG}: fetchGroupFileListFromServer: `, groupId, pageSize, pageNum);
    let r = await Native._callMethod(MTgetGroupFileListFromServer, {
      [MTgetGroupFileListFromServer]: {
        groupId,
        pageSize,
        pageNum
      }
    });
    ChatGroupManager.checkErrorFromResult(r);
    const ret = [];
    Object.entries(r === null || r === void 0 ? void 0 : r[MTgetGroupFileListFromServer]).forEach(value => {
      ret.push(new ChatGroupSharedFile(value[1]));
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
    chatlog.log(`${ChatGroupManager.TAG}: fetchAnnouncementFromServer: `, groupId);
    let r = await Native._callMethod(MTgetGroupAnnouncementFromServer, {
      [MTgetGroupAnnouncementFromServer]: {
        groupId
      }
    });
    ChatGroupManager.checkErrorFromResult(r);
    let ret = r === null || r === void 0 ? void 0 : r[MTgetGroupAnnouncementFromServer];
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
    chatlog.log(`${ChatGroupManager.TAG}: addMembers: `, groupId, members, welcome);
    let r = await Native._callMethod(MTaddMembers, {
      [MTaddMembers]: {
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
    chatlog.log(`${ChatGroupManager.TAG}: inviteUser: `, groupId, members, reason);
    let r = await Native._callMethod(MTinviterUser, {
      [MTinviterUser]: {
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
    chatlog.log(`${ChatGroupManager.TAG}: removeMembers: `, groupId, members);
    let r = await Native._callMethod(MTremoveMembers, {
      [MTremoveMembers]: {
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
    chatlog.log(`${ChatGroupManager.TAG}: blockMembers: `, groupId, members);
    let r = await Native._callMethod(MTblockMembers, {
      [MTblockMembers]: {
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
    chatlog.log(`${ChatGroupManager.TAG}: unblockMembers: `, groupId, members);
    let r = await Native._callMethod(MTunblockMembers, {
      [MTunblockMembers]: {
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
    chatlog.log(`${ChatGroupManager.TAG}: changeGroupName: `, groupId, groupName);
    let r = await Native._callMethod(MTupdateGroupSubject, {
      [MTupdateGroupSubject]: {
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
    chatlog.log(`${ChatGroupManager.TAG}: changeGroupDescription: `, groupId, description);
    let r = await Native._callMethod(MTupdateDescription, {
      [MTupdateDescription]: {
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
    chatlog.log(`${ChatGroupManager.TAG}: leaveGroup: `, groupId);
    let r = await Native._callMethod(MTleaveGroup, {
      [MTleaveGroup]: {
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
    chatlog.log(`${ChatGroupManager.TAG}: destroyGroup: `, groupId);
    let r = await Native._callMethod(MTdestroyGroup, {
      [MTdestroyGroup]: {
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
    chatlog.log(`${ChatGroupManager.TAG}: blockGroup: `, groupId);
    let r = await Native._callMethod(MTblockGroup, {
      [MTblockGroup]: {
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
    chatlog.log(`${ChatGroupManager.TAG}: unblockGroup: `, groupId);
    let r = await Native._callMethod(MTunblockGroup, {
      [MTunblockGroup]: {
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
    chatlog.log(`${ChatGroupManager.TAG}: changeOwner: `, groupId, newOwner);
    let r = await Native._callMethod(MTupdateGroupOwner, {
      [MTupdateGroupOwner]: {
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
    chatlog.log(`${ChatGroupManager.TAG}: addAdmin: `, groupId, admin);
    let r = await Native._callMethod(MTaddAdmin, {
      [MTaddAdmin]: {
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
    chatlog.log(`${ChatGroupManager.TAG}: removeAdmin: `, groupId, admin);
    let r = await Native._callMethod(MTremoveAdmin, {
      [MTremoveAdmin]: {
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
    chatlog.log(`${ChatGroupManager.TAG}: muteMembers: `, groupId, members, duration);
    let r = await Native._callMethod(MTmuteMembers, {
      [MTmuteMembers]: {
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
    chatlog.log(`${ChatGroupManager.TAG}: unMuteMembers: `, groupId, members);
    let r = await Native._callMethod(MTunMuteMembers, {
      [MTunMuteMembers]: {
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
    chatlog.log(`${ChatGroupManager.TAG}: muteAllMembers: `, groupId);
    let r = await Native._callMethod(MTmuteAllMembers, {
      [MTmuteAllMembers]: {
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
    chatlog.log(`${ChatGroupManager.TAG}: unMuteAllMembers: `, groupId);
    let r = await Native._callMethod(MTunMuteAllMembers, {
      [MTunMuteAllMembers]: {
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
    chatlog.log(`${ChatGroupManager.TAG}: addAllowList: `, groupId, members);
    let r = await Native._callMethod(MTaddAllowList, {
      [MTaddAllowList]: {
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
    chatlog.log(`${ChatGroupManager.TAG}: removeAllowList: `, groupId, members);
    let r = await Native._callMethod(MTremoveAllowList, {
      [MTremoveAllowList]: {
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
    chatlog.log(`${ChatGroupManager.TAG}: uploadGroupSharedFile: `, groupId, filePath);
    ChatGroupManager.handleUploadFileCallback(this, groupId, filePath, callback);
    let r = await Native._callMethod(MTuploadGroupSharedFile, {
      [MTuploadGroupSharedFile]: {
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
    chatlog.log(`${ChatGroupManager.TAG}: downloadGroupSharedFile: `, groupId, fileId, savePath);
    ChatGroupManager.handleDownloadFileCallback(this, groupId, savePath, callback);
    let r = await Native._callMethod(MTdownloadGroupSharedFile, {
      [MTdownloadGroupSharedFile]: {
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
    chatlog.log(`${ChatGroupManager.TAG}: removeGroupSharedFile: `, groupId, fileId);
    let r = await Native._callMethod(MTremoveGroupSharedFile, {
      [MTremoveGroupSharedFile]: {
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
    chatlog.log(`${ChatGroupManager.TAG}: updateGroupAnnouncement: `, groupId, announcement);
    let r = await Native._callMethod(MTupdateGroupAnnouncement, {
      [MTupdateGroupAnnouncement]: {
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
    chatlog.log(`${ChatGroupManager.TAG}: updateGroupExtension: `, groupId, extension);
    let r = await Native._callMethod(MTupdateGroupExt, {
      [MTupdateGroupExt]: {
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
    chatlog.log(`${ChatGroupManager.TAG}: joinPublicGroup: `, groupId);
    let r = await Native._callMethod(MTjoinPublicGroup, {
      [MTjoinPublicGroup]: {
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
    chatlog.log(`${ChatGroupManager.TAG}: requestToJoinPublicGroup: `, groupId, reason);
    let r = await Native._callMethod(MTrequestToJoinPublicGroup, {
      [MTrequestToJoinPublicGroup]: {
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
    chatlog.log(`${ChatGroupManager.TAG}: acceptJoinApplication: `, groupId, userId);
    let r = await Native._callMethod(MTacceptJoinApplication, {
      [MTacceptJoinApplication]: {
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
    chatlog.log(`${ChatGroupManager.TAG}: declineJoinApplication: `, groupId, username, reason);
    let r = await Native._callMethod(MTdeclineJoinApplication, {
      [MTdeclineJoinApplication]: {
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
    chatlog.log(`${ChatGroupManager.TAG}: acceptInvitation: `, groupId, inviter);
    let r = await Native._callMethod(MTacceptInvitationFromGroup, {
      [MTdeclineJoinApplication]: {
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
    chatlog.log(`${ChatGroupManager.TAG}: declineInvitation: `, groupId, inviter, reason);
    let r = await Native._callMethod(MTdeclineInvitationFromGroup, {
      [MTdeclineInvitationFromGroup]: {
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
    chatlog.log(`${ChatGroupManager.TAG}: setMemberAttribute: `, groupId, member, attributes);
    let r = await Native._callMethod(MTsetMemberAttributesFromGroup, {
      [MTsetMemberAttributesFromGroup]: {
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
    chatlog.log(`${ChatGroupManager.TAG}: fetchMemberAttributes: `, groupId, member);
    let r = await Native._callMethod(MTfetchMemberAttributesFromGroup, {
      [MTfetchMemberAttributesFromGroup]: {
        groupId,
        member
      }
    });
    ChatGroupManager.checkErrorFromResult(r);
    return r === null || r === void 0 ? void 0 : r[MTfetchMemberAttributesFromGroup];
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
    chatlog.log(`${ChatGroupManager.TAG}: fetchMembersAttributes: `, groupId, members, attributeKeys);
    let r = await Native._callMethod(MTfetchMembersAttributesFromGroup, {
      [MTfetchMembersAttributesFromGroup]: {
        groupId,
        members,
        keys: attributeKeys
      }
    });
    ChatGroupManager.checkErrorFromResult(r);
    const ret = new Map();
    Object.entries(r === null || r === void 0 ? void 0 : r[MTfetchMembersAttributesFromGroup]).forEach(v => {
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
    chatlog.log(`${ChatGroupManager.TAG}: fetchJoinedGroupCount: `);
    let r = await Native._callMethod(MTfetchJoinedGroupCount);
    ChatGroupManager.checkErrorFromResult(r);
    return r === null || r === void 0 ? void 0 : r[MTfetchJoinedGroupCount];
  }

  /**
   * Adds a group listener.
   *
   * @param listener The group listener to add.
   */
  addGroupListener(listener) {
    chatlog.log(`${ChatGroupManager.TAG}: addGroupListener: `);
    this._groupListeners.add(listener);
  }

  /**
   * Removes the group listener.
   *
   * @param listener The group listener to remove.
   */
  removeGroupListener(listener) {
    chatlog.log(`${ChatGroupManager.TAG}: removeGroupListener: `);
    this._groupListeners.delete(listener);
  }

  /**
   * Clears all group listeners.
   */
  removeAllGroupListener() {
    chatlog.log(`${ChatGroupManager.TAG}: removeAllGroupListener: `);
    this._groupListeners.clear();
  }
}
//# sourceMappingURL=ChatGroupManager.js.map
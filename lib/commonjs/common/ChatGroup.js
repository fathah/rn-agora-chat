"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ChatGroupPermissionType = exports.ChatGroupOptions = exports.ChatGroupMessageAck = exports.ChatGroupInfo = exports.ChatGroup = void 0;
exports.ChatGroupPermissionTypeFromNumber = ChatGroupPermissionTypeFromNumber;
exports.ChatGroupPermissionTypeToString = ChatGroupPermissionTypeToString;
exports.ChatGroupStyle = exports.ChatGroupSharedFile = void 0;
exports.ChatGroupStyleFromNumber = ChatGroupStyleFromNumber;
exports.ChatGroupStyleToString = ChatGroupStyleToString;
/**
 * The group types.
 */
let ChatGroupStyle = /*#__PURE__*/function (ChatGroupStyle) {
  ChatGroupStyle[ChatGroupStyle["PrivateOnlyOwnerInvite"] = 0] = "PrivateOnlyOwnerInvite";
  ChatGroupStyle[ChatGroupStyle["PrivateMemberCanInvite"] = 1] = "PrivateMemberCanInvite";
  ChatGroupStyle[ChatGroupStyle["PublicJoinNeedApproval"] = 2] = "PublicJoinNeedApproval";
  ChatGroupStyle[ChatGroupStyle["PublicOpenJoin"] = 3] = "PublicOpenJoin";
  return ChatGroupStyle;
}({});
/**
 * The group role types.
 */
exports.ChatGroupStyle = ChatGroupStyle;
let ChatGroupPermissionType = /*#__PURE__*/function (ChatGroupPermissionType) {
  ChatGroupPermissionType[ChatGroupPermissionType["None"] = -1] = "None";
  ChatGroupPermissionType[ChatGroupPermissionType["Member"] = 0] = "Member";
  ChatGroupPermissionType[ChatGroupPermissionType["Admin"] = 1] = "Admin";
  ChatGroupPermissionType[ChatGroupPermissionType["Owner"] = 2] = "Owner";
  return ChatGroupPermissionType;
}({});
/**
 * Converts the group type from Int to enum.
 *
 * @param params The group type of the Int type.
 * @returns The group type of the enum type.
 */
exports.ChatGroupPermissionType = ChatGroupPermissionType;
function ChatGroupStyleFromNumber(params) {
  switch (params) {
    case 0:
      return ChatGroupStyle.PrivateOnlyOwnerInvite;
    case 1:
      return ChatGroupStyle.PrivateMemberCanInvite;
    case 2:
      return ChatGroupStyle.PublicJoinNeedApproval;
    case 3:
      return ChatGroupStyle.PublicOpenJoin;
    default:
      return params;
  }
}

/**
 * Converts the group type from enum to string.
 *
 * @param params The group type of the enum type.
 * @returns The group type of the string type.
 */
function ChatGroupStyleToString(params) {
  return ChatGroupStyle[params];
}

/**
 * Converts the group role from Int to enum.
 *
 * @param params The group role of the Int type.
 * @returns The group role of the enum type.
 */
function ChatGroupPermissionTypeFromNumber(params) {
  switch (params) {
    case -1:
      return ChatGroupPermissionType.None;
    case 0:
      return ChatGroupPermissionType.Member;
    case 1:
      return ChatGroupPermissionType.Admin;
    case 2:
      return ChatGroupPermissionType.Owner;
    default:
      return params;
  }
}

/**
 * Converts the group role from enum to string.
 *
 * @param params The group role of the enum type.
 * @returns The group role of the string type.
 */
function ChatGroupPermissionTypeToString(params) {
  return ChatGroupPermissionType[params];
}

/**
 *The class for read receipts of group messages.
 */
class ChatGroupMessageAck {
  /**
   * The group message ID.
   */

  /**
   * The ID of the read receipt of a group message.
   */

  /**
   * The ID of the user who sends the read receipt.
   */

  /**
   * The number of read receipts of group messages.
   */

  /**
   * The Unix timestamp of sending the read receipt of a group message. The unit is millisecond.
   */

  /**
   * The extension information of a read receipt.
   */

  constructor(params) {
    this.msg_id = params.msg_id;
    this.ack_id = params.ack_id;
    this.from = params.from;
    this.count = params.count;
    this.timestamp = params.timestamp;
    if (params.ext) {
      this.content = params.ext.content;
    }
  }
}

/**
 * The group information class, which contains the information of the chat group.
 *
 * You can call the {@link ChatGroupManager.fetchGroupInfoFromServer} method to obtain group information.
 */
exports.ChatGroupMessageAck = ChatGroupMessageAck;
class ChatGroup {
  /**
   * The group ID.
   */

  /**
   * The group name.
   */

  /**
   * The group description.
   */

  /**
   * The user ID of the group owner.
   */

  /**
   * The content of the group announcement.
   */

  /**
   * The member count of the group.
   */

  /**
   * The member list of the group.
   */

  /**
   * The admin list of the group.
   */

  /**
   * The block list of the group.
   */

  /**
   * The mute list of the group.
   */

  /**
   * Whether group messages are blocked.
   * - `true`: Yes.
   * - `false`: No.
   */

  /**
   * Whether all group members are muted.
   * - `true`: Yes.
   * - `false`: No.
   */

  /**
   * The role of the current user in the group.
   */

  /**
   * The group options.
   */

  /**
   * Gets the maximum number of members allowed in a group. The parameter is set when the group is created.
   */
  get maxCount() {
    var _this$options;
    return ((_this$options = this.options) === null || _this$options === void 0 ? void 0 : _this$options.maxCount) ?? 0;
  }
  constructor(params) {
    this.groupId = params.groupId;
    this.groupName = params.groupName ?? '';
    this.description = params.description ?? '';
    this.owner = params.owner ?? '';
    this.announcement = params.announcement ?? '';
    this.memberCount = params.memberCount ?? 0;
    this.memberList = params.memberList ?? [];
    this.adminList = params.adminList ?? [];
    this.blockList = params.blockList ?? [];
    this.muteList = params.muteList ?? [];
    this.messageBlocked = params.messageBlocked ?? false;
    this.isAllMemberMuted = params.isAllMemberMuted ?? false;
    this.permissionType = ChatGroupPermissionTypeFromNumber(params.permissionType);
    if (params.options) {
      this.options = new ChatGroupOptions(params.options);
    }
  }
}

/**
 * The group options to be configured when the chat group is created.
 */
exports.ChatGroup = ChatGroup;
class ChatGroupOptions {
  /**
   * The group style.
   */

  /**
   * The maximum number of members allowed in a group.
   */

  /**
   * Whether to ask for consent when inviting a user to join a group.
   *
   * Whether to automatically accept the invitation to join a group depends on two settings:
   *
   * - {@link GroupOptions.inviteNeedConfirm}, an option for group creation.
   * - {@link ChatOptions.autoAcceptGroupInvitation}: Determines whether to automatically accept an invitation to join the group.
   *
   * There are two cases:
   * - If `inviteNeedConfirm` is set to `false`, the SDK adds the invitee directly to the group on the server side, regardless of the setting of {@link ChatOptions.autoAcceptGroupInvitation} on the invitee side.
   * - If `inviteNeedConfirm` is set to `true`, whether the invitee automatically joins the chat group or not depends on the settings of {@link ChatOptions.autoAcceptGroupInvitation}.
   *
   * {@link ChatOptions.autoAcceptGroupInvitation} is an SDK-level operation. If it is set to `true`, the invitee automatically joins the chat group; if it is set to `false`, the invitee can manually accept or decline the group invitation instead of joining the group automatically.
   *
   */

  /**
   * The group extension information.
   */

  /**
   * Whether the group is disabled:
   * - `true`: Yes.
   * - `false`: No.
   */

  /**
   * Construct a group option.
   */
  constructor(params) {
    this.style = params.style ? ChatGroupStyleFromNumber(params.style) : ChatGroupStyle.PublicJoinNeedApproval;
    this.maxCount = params.maxCount ?? 200;
    this.inviteNeedConfirm = params.inviteNeedConfirm ?? false;
    this.ext = params.ext;
    this.isDisabled = params.isDisabled ?? false;
  }
}

/**
 * The shared file class, which defines how to manage shared files.
 */
exports.ChatGroupOptions = ChatGroupOptions;
class ChatGroupSharedFile {
  /**
   * The ID of the shared file.
   */

  /**
   * The name of the shared file.
   */

  /**
   * The user ID of the member who uploads the shared file.
   */

  /**
   * The Unix timestamp for uploading the shared file, in milliseconds.
   */

  /**
   * The size of the shared file, in bytes.
   */

  constructor(params) {
    this.fileId = params.fileId;
    this.name = params.name;
    this.owner = params.owner;
    this.createTime = params.createTime;
    this.fileSize = params.fileSize;
  }
}

/**
 * The class that defines basic information of chat groups.
 */
exports.ChatGroupSharedFile = ChatGroupSharedFile;
class ChatGroupInfo {
  /**
   * The group ID.
   */

  /**
   * The group name.
   */

  constructor(params) {
    this.groupId = params.groupId;
    this.groupName = params.groupName;
  }
}

/**
 * The status change listener for shared files in groups.
 */
exports.ChatGroupInfo = ChatGroupInfo;
//# sourceMappingURL=ChatGroup.js.map
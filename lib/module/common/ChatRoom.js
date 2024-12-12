/**
 * The chat room role types.
 */
export let ChatRoomPermissionType = /*#__PURE__*/function (ChatRoomPermissionType) {
  ChatRoomPermissionType[ChatRoomPermissionType["None"] = -1] = "None";
  ChatRoomPermissionType[ChatRoomPermissionType["Member"] = 0] = "Member";
  ChatRoomPermissionType[ChatRoomPermissionType["Admin"] = 1] = "Admin";
  ChatRoomPermissionType[ChatRoomPermissionType["Owner"] = 2] = "Owner";
  return ChatRoomPermissionType;
}({});

/**
 * Converts the chat room role type from Int to enum.
 *
 * @param params The chat room role type of the Int type.
 * @returns The chat room role type of the enum type.
 */
export function ChatRoomPermissionTypeFromNumber(params) {
  switch (params) {
    case -1:
      return ChatRoomPermissionType.None;
    case 0:
      return ChatRoomPermissionType.Member;
    case 1:
      return ChatRoomPermissionType.Admin;
    case 2:
      return ChatRoomPermissionType.Owner;
    default:
      return params;
  }
}

/**
 * Converts the chat room role type from enum to string.
 *
 * @param params The chat room role type of the enum type.
 * @returns The chat room role type of the string type.
 */
export function ChatRoomPermissionTypeToString(params) {
  return ChatRoomPermissionType[params];
}

/**
 * The chat room instance class.
 *
 * To get the correct value, ensure that you call {@link ChatRoomManager.fetchChatRoomInfoFromServer} to get chat room details before calling this method.
 */
export class ChatRoom {
  /**
   * The chat room ID.
   */

  /**
   * The chat room name.
   */

  /**
   * The chat room description.
   */

  /**
   * The user ID of the chat room owner.
   */

  /**
   * The chat room announcement.
   */

  /**
   * The number of members in the chat room.
   */

  /**
   * The maximum number of users allowed to join a chat room. This field is specified during the creation of a chat room.
   */

  /**
   * The admin list of the chat room.
   */

  /**
   * The member list of the chat room.
   */

  /**
   * The block list of the chat room.
   */

  /**
   * The mute list of the chat room.
   */

  /**
   * Whether all members are muted in the chat room.
   * - `true`: Yes.
   * - `false`: No.
   */

  /**
   * The role of the current user in the chat room. For role types, see {@link ChatRoomPermissionType}.
   */

  constructor(params) {
    this.roomId = params.roomId;
    this.roomName = params.roomName;
    this.description = params.description;
    this.owner = params.owner;
    this.announcement = params.announcement;
    this.memberCount = params.memberCount;
    this.maxUsers = params.maxUsers;
    this.adminList = params.adminList;
    this.memberList = params.memberList;
    this.blockList = params.blockList;
    this.muteList = params.muteList;
    this.isAllMemberMuted = params.isAllMemberMuted;
    this.permissionType = ChatRoomPermissionTypeFromNumber(params.permissionType);
  }
}
//# sourceMappingURL=ChatRoom.js.map
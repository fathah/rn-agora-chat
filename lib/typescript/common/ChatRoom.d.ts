/**
 * The chat room role types.
 */
export declare enum ChatRoomPermissionType {
    /**
     * Unknown.
     */
    None = -1,
    /**
     * The chat room member.
     */
    Member = 0,
    /**
     * The chat room admin.
     */
    Admin = 1,
    /**
     * The chat room owner.
     */
    Owner = 2
}
/**
 * Converts the chat room role type from Int to enum.
 *
 * @param params The chat room role type of the Int type.
 * @returns The chat room role type of the enum type.
 */
export declare function ChatRoomPermissionTypeFromNumber(params: number): ChatRoomPermissionType;
/**
 * Converts the chat room role type from enum to string.
 *
 * @param params The chat room role type of the enum type.
 * @returns The chat room role type of the string type.
 */
export declare function ChatRoomPermissionTypeToString(params: ChatRoomPermissionType): string;
/**
 * The chat room instance class.
 *
 * To get the correct value, ensure that you call {@link ChatRoomManager.fetchChatRoomInfoFromServer} to get chat room details before calling this method.
 */
export declare class ChatRoom {
    /**
     * The chat room ID.
     */
    roomId: string;
    /**
     * The chat room name.
     */
    roomName?: string;
    /**
     * The chat room description.
     */
    description?: string;
    /**
     * The user ID of the chat room owner.
     */
    owner: string;
    /**
     * The chat room announcement.
     */
    announcement?: string;
    /**
     * The number of members in the chat room.
     */
    memberCount?: string;
    /**
     * The maximum number of users allowed to join a chat room. This field is specified during the creation of a chat room.
     */
    maxUsers?: string;
    /**
     * The admin list of the chat room.
     */
    adminList?: Array<string>;
    /**
     * The member list of the chat room.
     */
    memberList?: Array<string>;
    /**
     * The block list of the chat room.
     */
    blockList?: Array<string>;
    /**
     * The mute list of the chat room.
     */
    muteList?: Array<string>;
    /**
     * Whether all members are muted in the chat room.
     * - `true`: Yes.
     * - `false`: No.
     */
    isAllMemberMuted?: boolean;
    /**
     * The role of the current user in the chat room. For role types, see {@link ChatRoomPermissionType}.
     */
    permissionType: ChatRoomPermissionType;
    constructor(params: {
        roomId: string;
        roomName?: string;
        description?: string;
        owner: string;
        announcement?: string;
        memberCount?: string;
        maxUsers?: string;
        adminList?: Array<string>;
        memberList?: Array<string>;
        blockList?: Array<string>;
        muteList?: Array<string>;
        isAllMemberMuted?: boolean;
        permissionType: number;
    });
}
//# sourceMappingURL=ChatRoom.d.ts.map
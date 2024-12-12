import type { ChatError } from './ChatError';
/**
 * The group types.
 */
export declare enum ChatGroupStyle {
    /**
     * Private groups where only the group owner or admins can invite users to join.
     */
    PrivateOnlyOwnerInvite = 0,
    /**
     * Private groups where each group member can invite users to join.
     */
    PrivateMemberCanInvite = 1,
    /**
     * Public groups where users can join only after an invitation is received from the group owner(admin) or the join request is accepted by the  group owner(admin).
     */
    PublicJoinNeedApproval = 2,
    /**
     * Public groups where users can join freely, without the approval of the group owner or admins.
     */
    PublicOpenJoin = 3
}
/**
 * The group role types.
 */
export declare enum ChatGroupPermissionType {
    /**
     * Unknown.
     */
    None = -1,
    /**
     * The group member.
     */
    Member = 0,
    /**
     * The group admin.
     */
    Admin = 1,
    /**
     * The group owner.
     */
    Owner = 2
}
/**
 * Converts the group type from Int to enum.
 *
 * @param params The group type of the Int type.
 * @returns The group type of the enum type.
 */
export declare function ChatGroupStyleFromNumber(params: number): ChatGroupStyle;
/**
 * Converts the group type from enum to string.
 *
 * @param params The group type of the enum type.
 * @returns The group type of the string type.
 */
export declare function ChatGroupStyleToString(params: ChatGroupStyle): string;
/**
 * Converts the group role from Int to enum.
 *
 * @param params The group role of the Int type.
 * @returns The group role of the enum type.
 */
export declare function ChatGroupPermissionTypeFromNumber(params: number): ChatGroupPermissionType;
/**
 * Converts the group role from enum to string.
 *
 * @param params The group role of the enum type.
 * @returns The group role of the string type.
 */
export declare function ChatGroupPermissionTypeToString(params: ChatGroupPermissionType): string;
/**
 *The class for read receipts of group messages.
 */
export declare class ChatGroupMessageAck {
    /**
     * The group message ID.
     */
    msg_id: string;
    /**
     * The ID of the read receipt of a group message.
     */
    ack_id: string;
    /**
     * The ID of the user who sends the read receipt.
     */
    from: string;
    /**
     * The number of read receipts of group messages.
     */
    count: number;
    /**
     * The Unix timestamp of sending the read receipt of a group message. The unit is millisecond.
     */
    timestamp: number;
    /**
     * The extension information of a read receipt.
     */
    content?: string;
    constructor(params: {
        msg_id: string;
        ack_id: string;
        from: string;
        count: number;
        timestamp: number;
        ext?: {
            content: string;
        };
    });
}
/**
 * The group information class, which contains the information of the chat group.
 *
 * You can call the {@link ChatGroupManager.fetchGroupInfoFromServer} method to obtain group information.
 */
export declare class ChatGroup {
    /**
     * The group ID.
     */
    groupId: string;
    /**
     * The group name.
     */
    groupName: string;
    /**
     * The group description.
     */
    description: string;
    /**
     * The user ID of the group owner.
     */
    owner: string;
    /**
     * The content of the group announcement.
     */
    announcement: string;
    /**
     * The member count of the group.
     */
    memberCount: number;
    /**
     * The member list of the group.
     */
    memberList: Array<string>;
    /**
     * The admin list of the group.
     */
    adminList: Array<string>;
    /**
     * The block list of the group.
     */
    blockList: Array<string>;
    /**
     * The mute list of the group.
     */
    muteList: Array<string>;
    /**
     * Whether group messages are blocked.
     * - `true`: Yes.
     * - `false`: No.
     */
    messageBlocked: boolean;
    /**
     * Whether all group members are muted.
     * - `true`: Yes.
     * - `false`: No.
     */
    isAllMemberMuted: boolean;
    /**
     * The role of the current user in the group.
     */
    permissionType: ChatGroupPermissionType;
    /**
     * The group options.
     */
    options?: ChatGroupOptions;
    /**
     * Gets the maximum number of members allowed in a group. The parameter is set when the group is created.
     */
    get maxCount(): number;
    constructor(params: {
        groupId: string;
        groupName?: string;
        description?: string;
        owner: string;
        announcement?: string;
        memberCount?: number;
        memberList?: Array<string>;
        adminList?: Array<string>;
        blockList?: Array<string>;
        muteList?: Array<string>;
        messageBlocked?: boolean;
        isAllMemberMuted?: boolean;
        permissionType: number;
        options?: any;
    });
}
/**
 * The group options to be configured when the chat group is created.
 */
export declare class ChatGroupOptions {
    /**
     * The group style.
     */
    style: ChatGroupStyle;
    /**
     * The maximum number of members allowed in a group.
     */
    maxCount: number;
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
    inviteNeedConfirm: boolean;
    /**
     * The group extension information.
     */
    ext?: string;
    /**
     * Whether the group is disabled:
     * - `true`: Yes.
     * - `false`: No.
     */
    isDisabled: boolean;
    /**
     * Construct a group option.
     */
    constructor(params: {
        style?: number;
        maxCount?: number;
        inviteNeedConfirm?: boolean;
        ext?: string;
        isDisabled?: boolean;
    });
}
/**
 * The shared file class, which defines how to manage shared files.
 */
export declare class ChatGroupSharedFile {
    /**
     * The ID of the shared file.
     */
    fileId: string;
    /**
     * The name of the shared file.
     */
    name: string;
    /**
     * The user ID of the member who uploads the shared file.
     */
    owner: string;
    /**
     * The Unix timestamp for uploading the shared file, in milliseconds.
     */
    createTime: number;
    /**
     * The size of the shared file, in bytes.
     */
    fileSize: number;
    constructor(params: {
        fileId: string;
        name: string;
        owner: string;
        createTime: number;
        fileSize: number;
    });
}
/**
 * The class that defines basic information of chat groups.
 */
export declare class ChatGroupInfo {
    /**
     * The group ID.
     */
    groupId: string;
    /**
     * The group name.
     */
    groupName: string;
    constructor(params: {
        groupId: string;
        groupName: string;
    });
}
/**
 * The status change listener for shared files in groups.
 */
export interface ChatGroupFileStatusCallback {
    /**
     * Occurs when a shared file is being uploaded or downloaded.
     *
     * @param groupId The group ID.
     * @param filePath The path of the shared file.
     * @param progress The value of the download or upload progress. The value range is 0-100 in percentage.
     */
    onProgress?(groupId: string, filePath: string, progress: number): void;
    /**
     * Occurs when there is an error during the upload or download of a shared file.
     *
     * @param groupId The group ID.
     * @param filePath The path of the shared file.
     * @param error A description of the error. See {@link ChatError}.
     */
    onError(groupId: string, filePath: string, error: ChatError): void;
    /**
     * Occurs when the message is sent.
     *
     * @param groupId The group ID.
     * @param filePath The path of the shared file.
     */
    onSuccess(groupId: string, filePath: string): void;
}
//# sourceMappingURL=ChatGroup.d.ts.map
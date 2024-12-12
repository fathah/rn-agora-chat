import type { NativeEventEmitter } from 'react-native';
import { BaseManager } from './__internal__/Base';
import type { ChatGroupEventListener } from './ChatEvents';
import { ChatCursorResult } from './common/ChatCursorResult';
import { ChatGroup, ChatGroupFileStatusCallback, ChatGroupInfo, ChatGroupOptions, ChatGroupSharedFile } from './common/ChatGroup';
/**
 * The group manager class, which defines how to manage groups, like group creation and destruction and member management.
 */
export declare class ChatGroupManager extends BaseManager {
    protected static TAG: string;
    private _groupListeners;
    private _groupSubscriptions;
    constructor();
    setNativeListener(event: NativeEventEmitter): void;
    private invokeGroupListener;
    private static handleUploadFileCallback;
    private static handleDownloadFileCallback;
    /**
     * Gets the group instance from the memory by group ID.
     *
     * @param groupId The group ID.
     * @returns The group instance. The SDK returns `undefined` if the group does not exist.
     *
     * @throws A description of the exception. See {@link ChatError}.
     */
    getGroupWithId(groupId: string): Promise<ChatGroup | undefined>;
    /**
     * Gets the list of groups that the current user has joined.
     *
     * This method gets data from the local database.
     *
     * @returns The group list.
     *
     * @throws A description of the exception. See {@link ChatError}.
     */
    getJoinedGroups(): Promise<Array<ChatGroup>>;
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
    fetchJoinedGroupsFromServer(pageSize: number, pageNum: number): Promise<Array<ChatGroup>>;
    /**
     * Gets public groups from the server with pagination.
     *
     * @param pageSize The number of public groups that you expect on each page.
     * @param cursor The cursor position from which to start to get data. At the first method call, if you set `cursor` as `null`, the SDK gets the data in the reverse chronological order of when groups are created.
     * @returns The group list and the cursor for the next query. See {@link ChatCursorResult}.
     *
     * @throws A description of the exception. See {@link ChatError}.
     */
    fetchPublicGroupsFromServer(pageSize: number, cursor?: string): Promise<ChatCursorResult<ChatGroupInfo>>;
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
    createGroup(options: ChatGroupOptions, groupName: string, desc?: string, inviteMembers?: Array<string>, inviteReason?: string): Promise<ChatGroup>;
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
    fetchGroupInfoFromServer(groupId: string, isFetchMembers?: boolean): Promise<ChatGroup | undefined>;
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
    fetchMemberListFromServer(groupId: string, pageSize?: number, cursor?: string): Promise<ChatCursorResult<string>>;
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
    fetchBlockListFromServer(groupId: string, pageSize?: number, pageNum?: number): Promise<Array<string>>;
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
    fetchMuteListFromServer(groupId: string, pageSize?: number, pageNum?: number): Promise<Array<string>>;
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
    fetchAllowListFromServer(groupId: string): Promise<Array<string>>;
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
    isMemberInAllowListFromServer(groupId: string): Promise<boolean>;
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
    fetchGroupFileListFromServer(groupId: string, pageSize?: number, pageNum?: number): Promise<Array<ChatGroupSharedFile>>;
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
    fetchAnnouncementFromServer(groupId: string): Promise<string>;
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
    addMembers(groupId: string, members: Array<string>, welcome?: string): Promise<void>;
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
    inviteUser(groupId: string, members: Array<string>, reason?: string): Promise<void>;
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
    removeMembers(groupId: string, members: Array<string>): Promise<void>;
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
    blockMembers(groupId: string, members: Array<string>): Promise<void>;
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
    unblockMembers(groupId: string, members: Array<string>): Promise<void>;
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
    changeGroupName(groupId: string, groupName: string): Promise<void>;
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
    changeGroupDescription(groupId: string, description: string): Promise<void>;
    /**
     * Leaves a group.
     *
     * @param groupId The group ID.
     *
     * @throws A description of the exception. See {@link ChatError}.
     */
    leaveGroup(groupId: string): Promise<void>;
    /**
     * Destroys the group instance.
     *
     * Only the group owner can call this method.
     *
     * @param groupId The group ID.
     *
     * @throws A description of the exception. See {@link ChatError}.
     */
    destroyGroup(groupId: string): Promise<void>;
    /**
     * Blocks group messages.
     *
     * The user that blocks group messages is still a group member, but cannot receive group messages.
     *
     * @param groupId The group ID.
     *
     * @throws A description of the exception. See {@link ChatError}.
     */
    blockGroup(groupId: string): Promise<void>;
    /**
     * Unblocks group messages.
     *
     * @param groupId The group ID.
     *
     * @throws A description of the exception. See {@link ChatError}.
     */
    unblockGroup(groupId: string): Promise<void>;
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
    changeOwner(groupId: string, newOwner: string): Promise<void>;
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
    addAdmin(groupId: string, admin: string): Promise<void>;
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
    removeAdmin(groupId: string, admin: string): Promise<void>;
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
    muteMembers(groupId: string, members: Array<string>, duration?: number): Promise<void>;
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
    unMuteMembers(groupId: string, members: Array<string>): Promise<void>;
    /**
     * Mutes all members.
     *
     * Only the group owner or admin can call this method.
     *
     * @param groupId The group ID.
     *
     * @throws A description of the exception. See {@link ChatError}.
     */
    muteAllMembers(groupId: string): Promise<void>;
    /**
     * Unmutes all group members.
     *
     * Only the group owner or admin can call this method.
     *
     * @param groupId The group ID.
     *
     * @throws A description of the exception. See {@link ChatError}.
     */
    unMuteAllMembers(groupId: string): Promise<void>;
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
    addAllowList(groupId: string, members: Array<string>): Promise<void>;
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
    removeAllowList(groupId: string, members: Array<string>): Promise<void>;
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
    uploadGroupSharedFile(groupId: string, filePath: string, callback?: ChatGroupFileStatusCallback): Promise<void>;
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
    downloadGroupSharedFile(groupId: string, fileId: string, savePath: string, callback?: ChatGroupFileStatusCallback): Promise<void>;
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
    removeGroupSharedFile(groupId: string, fileId: string): Promise<void>;
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
    updateGroupAnnouncement(groupId: string, announcement: string): Promise<void>;
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
    updateGroupExtension(groupId: string, extension: string): Promise<void>;
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
    joinPublicGroup(groupId: string): Promise<void>;
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
    requestToJoinPublicGroup(groupId: string, reason?: string): Promise<void>;
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
    acceptJoinApplication(groupId: string, userId: string): Promise<void>;
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
    declineJoinApplication(groupId: string, username: string, reason?: string): Promise<void>;
    /**
     * Accepts a group invitation.
     *
     * @param groupId The group ID.
     * @param inviter The user ID of the inviter.
     *
     * @throws A description of the exception. See {@link ChatError}.
     */
    acceptInvitation(groupId: string, inviter: string): Promise<void>;
    /**
     * Declines a group invitation.
     *
     * @param groupId The group ID.
     * @param inviter The user ID of the inviter.
     * @param reason The reason for declining the invitation.
     *
     * @throws A description of the exception. See {@link ChatError}.
     */
    declineInvitation(groupId: string, inviter: string, reason?: string): Promise<void>;
    /**
     * Sets custom attributes of a group member.
     *
     * @param groupId The group ID.
     * @param member The array of user IDs of group members whose custom attributes are retrieved.(limitation is ten. More than callback error. )
     * @param attribute The map of custom attributes in key-value format. In a key-value pair, if the value is set to an empty string, the custom attribute will be deleted.
     *
     * @throws A description of the exception. See {@link ChatError}.
     */
    setMemberAttribute(groupId: string, member: string, attributes: Record<string, string>): Promise<void>;
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
    fetchMemberAttributes(groupId: string, member: string): Promise<Record<string, string> | undefined>;
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
    fetchMembersAttributes(groupId: string, members: string[], attributeKeys?: string[]): Promise<Map<string, Record<string, string>>>;
    /**
     * Gets the number of groups joined by the current user.
     *
     * @returns The list of joined groups of the current user.
     *
     * @throws A description of the exception. See {@link ChatError}.
     */
    fetchJoinedGroupCount(): Promise<number>;
    /**
     * Adds a group listener.
     *
     * @param listener The group listener to add.
     */
    addGroupListener(listener: ChatGroupEventListener): void;
    /**
     * Removes the group listener.
     *
     * @param listener The group listener to remove.
     */
    removeGroupListener(listener: ChatGroupEventListener): void;
    /**
     * Clears all group listeners.
     */
    removeAllGroupListener(): void;
}
//# sourceMappingURL=ChatGroupManager.d.ts.map
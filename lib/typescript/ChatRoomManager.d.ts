import type { NativeEventEmitter } from 'react-native';
import { Native } from './__internal__/Native';
import type { ChatRoomEventListener } from './ChatEvents';
import { ChatCursorResult } from './common/ChatCursorResult';
import { ChatPageResult } from './common/ChatPageResult';
import { ChatRoom } from './common/ChatRoom';
/**
 * The chat room manager class, which manages user operations, like joining and leaving the chat room and retrieving the chat room list, and manages member privileges.
 */
export declare class ChatRoomManager extends Native {
    private static TAG;
    constructor();
    private _roomListeners;
    private _roomSubscriptions;
    setNativeListener(event: NativeEventEmitter): void;
    private invokeRoomListener;
    /**
     * Adds a chat room listener.
     *
     * @param listener The listener to add.
     */
    addRoomListener(listener: ChatRoomEventListener): void;
    /**
     * Removes the chat room listener.
     *
     * @param listener The listener to remove.
     */
    removeRoomListener(listener: ChatRoomEventListener): void;
    /**
     * Removes all the chat room listeners.
     */
    removeAllRoomListener(): void;
    /**
     * Joins the chat room.
     *
     * To leave the chat room, you can call {@link leaveChatRoom}.
     *
     * @param roomId The ID of the chat room to join.
     *
     * @throws A description of the exception. See {@link ChatError}.
     */
    joinChatRoom(roomId: string): Promise<void>;
    /**
     * Leaves the chat room.
     *
     * @param roomId The ID of the chat room to leave.
     *
     * @throws A description of the exception. See {@link ChatError}.
     */
    leaveChatRoom(roomId: string): Promise<void>;
    /**
     * Gets chat room data from the server with pagination.
     *
     * @param pageNum The page number, starting from 1.
     * @param pageSize The number of chat rooms that you expect to get on each page.
     * @returns The list of obtained chat rooms. See {@link ChatPageResult}.
     *
     * @throws A description of the exception. See {@link ChatError}.
     */
    fetchPublicChatRoomsFromServer(pageNum?: number, pageSize?: number): Promise<ChatPageResult<ChatRoom>>;
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
    fetchChatRoomInfoFromServer(roomId: string): Promise<ChatRoom | undefined>;
    /**
     * Gets the chat room by ID from the local database.
     *
     * @param roomId The chat room ID.
     * @returns The chat room instance. The SDK returns `undefined` if the chat room does not exist.
     *
     * @throws A description of the exception. See {@link ChatError}.
     */
    getChatRoomWithId(roomId: string): Promise<ChatRoom | undefined>;
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
    createChatRoom(subject: string, description?: string, welcome?: string, members?: Array<string>, maxCount?: number): Promise<ChatRoom>;
    /**
     * Destroys a chat room.
     *
     * Only the chat room owner can call this method.
     *
     * @param roomId The chat room ID.
     *
     * @throws A description of the exception. See {@link ChatError}.
     */
    destroyChatRoom(roomId: string): Promise<void>;
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
    changeChatRoomSubject(roomId: string, subject: string): Promise<void>;
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
    changeChatRoomDescription(roomId: string, description: string): Promise<void>;
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
    fetchChatRoomMembers(roomId: string, cursor?: string, pageSize?: number): Promise<ChatCursorResult<string>>;
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
    muteChatRoomMembers(roomId: string, muteMembers: Array<string>, duration?: number): Promise<void>;
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
    unMuteChatRoomMembers(roomId: string, unMuteMembers: Array<string>): Promise<void>;
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
    changeOwner(roomId: string, newOwner: string): Promise<void>;
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
    addChatRoomAdmin(roomId: string, admin: string): Promise<void>;
    /**
     * Removes administrative privileges of a chat room admin.
     *
     * @param roomId The chat room ID.
     * @param admin The user ID of the chat room admin whose administrative privileges are to be removed.
     *
     * @throws A description of the exception. See {@link ChatError}.
     */
    removeChatRoomAdmin(roomId: string, admin: string): Promise<void>;
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
    fetchChatRoomMuteList(roomId: string, pageNum?: number, pageSize?: number): Promise<Array<string>>;
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
    removeChatRoomMembers(roomId: string, members: Array<string>): Promise<void>;
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
    blockChatRoomMembers(roomId: string, members: Array<string>): Promise<void>;
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
    unBlockChatRoomMembers(roomId: string, members: Array<string>): Promise<void>;
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
    fetchChatRoomBlockList(roomId: string, pageNum?: number, pageSize?: number): Promise<Array<string>>;
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
    updateChatRoomAnnouncement(roomId: string, announcement: string): Promise<void>;
    /**
     * Gets the chat room announcement from the server.
     *
     * @param roomId The chat room ID.
     * @returns The chat room announcement.
     *
     * @throws A description of the exception. See {@link ChatError}.
     */
    fetchChatRoomAnnouncement(roomId: string): Promise<string | undefined>;
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
    fetchChatRoomAllowListFromServer(roomId: string): Promise<Array<string>>;
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
    isMemberInChatRoomAllowList(roomId: string): Promise<boolean>;
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
    addMembersToChatRoomAllowList(roomId: string, members: Array<string>): Promise<void>;
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
    removeMembersFromChatRoomAllowList(roomId: string, members: Array<string>): Promise<void>;
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
    muteAllChatRoomMembers(roomId: string): Promise<void>;
    /**
     * Unmutes all members of the chat room.
     *
     * Only the chat room owner or admins can call this method.
     *
     * @param roomId The chat room ID.
     *
     * @throws A description of the exception. See {@link ChatError}.
     */
    unMuteAllChatRoomMembers(roomId: string): Promise<void>;
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
    fetchChatRoomAttributes(roomId: string, keys?: Array<string>): Promise<Map<string, string>>;
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
    addAttributes(params: {
        roomId: string;
        attributes: {
            [x: string]: string;
        }[];
        deleteWhenLeft?: boolean;
        overwrite?: boolean;
    }): Promise<Map<string, string>>;
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
    removeAttributes(params: {
        roomId: string;
        keys: Array<string>;
        forced?: boolean;
    }): Promise<Map<string, string>>;
}
//# sourceMappingURL=ChatRoomManager.d.ts.map
import type { NativeEventEmitter } from 'react-native';
import { BaseManager } from './__internal__/Base';
import type { ChatContactEventListener } from './ChatEvents';
import { ChatContact } from './common/ChatContact';
import { ChatCursorResult } from './common/ChatCursorResult';
/**
 * The contact manager class, which manages chat contacts such as adding, retrieving, modifying, and deleting contacts.
 */
export declare class ChatContactManager extends BaseManager {
    protected static TAG: string;
    constructor();
    private _contactListeners;
    private _contactSubscriptions;
    setNativeListener(event: NativeEventEmitter): void;
    private invokeContactListener;
    /**
     * Adds a contact listener.
     *
     * @param listener The listener to add.
     */
    addContactListener(listener: ChatContactEventListener): void;
    /**
     * Removes the contact listener.
     *
     * @param listener The listener to remove.
     */
    removeContactListener(listener: ChatContactEventListener): void;
    /**
     * Removes all contact listeners.
     */
    removeAllContactListener(): void;
    /**
     * Adds a new contact.
     *
     * @param userId The user ID of the contact to add.
     * @param reason The reason for adding the contact. This parameter is optional and can be `null` or "".
     *
     * @throws A description of the exception. See {@link ChatError}.
     */
    addContact(userId: string, reason?: string): Promise<void>;
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
    deleteContact(userId: string, keepConversation?: boolean): Promise<void>;
    /**
     * Gets the contact list from the server.
     *
     * @returns The list of contacts.
     *
     * @throws A description of the exception. See {@link ChatError}.
     */
    getAllContactsFromServer(): Promise<Array<string>>;
    /**
     * Gets the contact list from the local database.
     *
     * @returns The contact list.
     *
     * @throws A description of the exception. See {@link ChatError}.
     */
    getAllContactsFromDB(): Promise<Array<string>>;
    /**
     * Adds a contact to the block list.
     *
     * You can send messages to the users on the block list, but cannot receive messages from them.
     *
     * @param userId The user ID of the contact to be added to the block list.
     *
     * @throws A description of the exception. See {@link ChatError}.
     */
    addUserToBlockList(userId: string): Promise<void>;
    /**
     * Removes the contact from the block list.
     *
     * @param userId The user ID of the contact to be removed from the block list.
     *
     * @throws A description of the exception. See {@link ChatError}.
     */
    removeUserFromBlockList(userId: string): Promise<void>;
    /**
     * Gets the block list from the server.
     *
     * @returns The block list obtained from the server.
     *
     * @throws A description of the exception. See {@link ChatError}.
     */
    getBlockListFromServer(): Promise<Array<string>>;
    /**
     * Gets the block list from the local database.
     *
     * @returns The block list obtained from the local database.
     *
     * @throws A description of the exception. See {@link ChatError}.
     */
    getBlockListFromDB(): Promise<Array<string>>;
    /**
     * Accepts a friend invitation。
     *
     * @param userId The user who sends the friend invitation.
     *
     * @throws A description of the exception. See {@link ChatError}.
     */
    acceptInvitation(userId: string): Promise<void>;
    /**
     * Declines a friend invitation.
     *
     * @param userId The user who sends the friend invitation.
     *
     * @throws A description of the exception. See {@link ChatError}.
     */
    declineInvitation(userId: string): Promise<void>;
    /**
     * Gets the unique IDs of the current user on the other devices. The ID is in the format of `{user_ID} + "/" + {resource_ID}`.
     *
     * @returns The list of unique IDs of users on the other devices if the method succeeds.
     *
     * @throws A description of the exception. See {@link ChatError}.
     */
    getSelfIdsOnOtherPlatform(): Promise<Array<string>>;
    /**
     * Gets all contacts from the local database.
     *
     * @returns The list of contacts.
     *
     * @throws A description of the exception. See {@link ChatError}.
     */
    getAllContacts(): Promise<ChatContact[]>;
    /**
     * Gets the contact by user ID from local database.
     *
     * @param userId The user ID of the contact to get.
     * @returns The contact.
     *
     * @throws A description of the exception. See {@link ChatError}.
     */
    getContact(userId: string): Promise<ChatContact | undefined>;
    /**
     * Gets all contacts from the server.
     *
     * @returns The list of contacts.
     *
     * @throws A description of the exception. See {@link ChatError}.
     */
    fetchAllContacts(): Promise<ChatContact[]>;
    /**
     * Gets the contacts from the server.
     * @params params -
     * - cursor: The cursor of the page to get. The first page is an empty string.
     * - pageSize: The number of contacts to get. The default value is 20. [1-50]
     * @returns The list of contacts.
     *
     * @throws A description of the exception. See {@link ChatError}.
     */
    fetchContacts(params: {
        cursor?: string;
        pageSize?: number;
    }): Promise<ChatCursorResult<ChatContact>>;
    /**
     * Set the contact's remark.
     *
     * @param contact The contact to set.
     *
     * @throws A description of the exception. See {@link ChatError}.
     */
    setContactRemark(contact: ChatContact): Promise<void>;
}
//# sourceMappingURL=ChatContactManager.d.ts.map
import type { ChatMessage, ChatMessageSearchScope, ChatMessageType } from './ChatMessage';
/**
 * The message search directions.
 *
 * The message search is based on the Unix timestamp included in messages. Each message contains two Unix timestamps:
 *    - The Unix timestamp when the message is created;
 *    - The Unix timestamp when the message is received by the server.
 *
 * Which Unix timestamp is used for message search depends on the setting of {@link ChatOptions.sortMessageByServerTime}.
 *
 */
export declare enum ChatSearchDirection {
    /**
     * Messages are retrieved in the descending order of the timestamp included in them.
     *
     */
    UP = 0,
    /**
     * Messages are retrieved in the ascending order of the timestamp included in them.
     *
     */
    DOWN = 1
}
/**
 * The conversation types.
 */
export declare enum ChatConversationType {
    /**
     * One-to-one chat.
     */
    PeerChat = 0,
    /**
     * Chat group chat.
     */
    GroupChat = 1,
    /**
     * Chat room chat.
     */
    RoomChat = 2
}
/**
 * The mapping between each type of conversation mark and their actual meanings is maintained by the developer.
 *
 * Unlike conversation extension fields, conversation marks are searchable.
 */
export declare enum ChatConversationMarkType {
    Type0 = 0,
    Type1 = 1,
    Type2 = 2,
    Type3 = 3,
    Type4 = 4,
    Type5 = 5,
    Type6 = 6,
    Type7 = 7,
    Type8 = 8,
    Type9 = 9,
    Type10 = 10,
    Type11 = 11,
    Type12 = 12,
    Type13 = 13,
    Type14 = 14,
    Type15 = 15,
    Type16 = 16,
    Type17 = 17,
    Type18 = 18,
    Type19 = 19
}
/**
 * Converts the conversation type from int to enum.
 *
 * @param params The conversation type of the int type.
 * @returns The conversation type of the enum type.
 */
export declare function ChatConversationTypeFromNumber(params: number): ChatConversationType;
/**
 * Converts the conversation type from enum to string.
 *
 * @param params The conversation type of the enum type.
 * @returns The conversation type of the string type.
 */
export declare function ChatConversationTypeToString(params: ChatConversationType): string;
/**
 * The conversation class, which defines one-to-one conversations, group conversations, and chat room conversations.
 *
 * Each type of conversation involves messages that are sent and received.
 *
 * You can get the conversation name by conversation type:
 * - One-to-one chat: See {@link ChatUserInfoManager.fetchUserInfoById}.
 * - Group chat: See {@link ChatGroup.getGroupWithId}.
 * - Chat room: See {@link ChatRoom.fetchChatRoomInfoFromServer}.
 */
export declare class ChatConversation {
    /**
     * The conversation ID.
     */
    convId: string;
    /**
     * The conversation type.
     */
    convType: ChatConversationType;
    /**
     * Whether the current conversation is a thread conversation.
     *
     * - `true`: Yes.
     * - `false`: No.
     *
     * **Note**
  
     * This parameter is valid only for group chat.
     */
    isChatThread: boolean;
    /**
     * The conversation extension.
     */
    ext?: any;
    /**
     * Whether the conversation is pinned:
     *
     * - `true`: Yes.
     * - (Default) `false`: No.
     */
    isPinned?: boolean;
    /**
     * The UNIX timestamp when the conversation is pinned. The unit is millisecond. This value is `0` when the conversation is not pinned.
     */
    pinnedTime?: number;
    /**
     * The conversation marks.
     */
    marks?: ChatConversationMarkType[];
    constructor(params: {
        convId: string;
        convType: ChatConversationType;
        isChatThread?: boolean;
        ext?: any;
        isPinned?: boolean;
        pinnedTime?: number;
        marks?: ChatConversationMarkType[];
    });
    /**
     * Gets the conversation ID.
     *
     * @returns The conversation ID.
     */
    name(): Promise<string | undefined>;
    /**
     * Gets the count of unread messages in the conversation.
     *
     * @returns The count of unread messages.
     *
     * @throws A description of the exception. See {@link ChatError}.
     */
    getUnreadCount(): Promise<number>;
    /**
     * Gets the count of messages in the conversation.
     * @returns The count of messages.
     * @throws A description of the exception. See {@link ChatError}.
     */
    getMessageCount(): Promise<number>;
    /**
     * Gets the latest message from the conversation.
     *
     * @returns The message instance. The SDK returns `undefined` if the message does not exist.
     *
     * @throws A description of the exception. See {@link ChatError}.
     */
    getLatestMessage(): Promise<ChatMessage | undefined>;
    /**
     * Gets the latest message received in the conversation.
     *
     * @returns The message instance. The SDK returns `undefined` if the message does not exist.
     *
     * @throws A description of the exception. See {@link ChatError}.
     */
    getLatestReceivedMessage(): Promise<ChatMessage | undefined>;
    /**
     * Sets the extension information of the conversation.
     *
     * @param ext The extension information of the conversation. This parameter must be in the key-value format.
     *
     * @throws A description of the exception. See {@link ChatError}.
     */
    setConversationExtension(ext: {
        [key: string]: string | number;
    }): Promise<void>;
    /**
     * Marks a message as read.
     *
     * @param msgId The message ID.
     *
     * @throws A description of the exception. See {@link ChatError}.
     */
    markMessageAsRead(msgId: string): Promise<void>;
    /**
     * Marks all messages as read.
     *
     * @throws A description of the exception. See {@link ChatError}.
     */
    markAllMessagesAsRead(): Promise<void>;
    /**
     * Updates a message in the local database.
     *
     * After you modify a message, the message ID remains unchanged and the SDK automatically updates attributes of the conversation, like `latestMessage`.
     *
     * @param msg The message instance.
     *
     * @throws A description of the exception. See {@link ChatError}.
     */
    updateMessage(msg: ChatMessage): Promise<void>;
    /**
     * Deletes a message from the local database.
     *
     * @param msgId The ID of message to delete.
     *
     * @throws A description of the exception. See {@link ChatError}.
     */
    deleteMessage(msgId: string): Promise<void>;
    /**
     * Deletes messages sent or received in a certain period from the local database.
     *
     * @params params
     * - startTs: The starting UNIX timestamp for message deletion. The unit is millisecond.
     * - endTs: The end UNIX timestamp for message deletion. The unit is millisecond.
     *
     * @throws A description of the exception. See {@link ChatError}.
     */
    deleteMessagesWithTimestamp(params: {
        startTs: number;
        endTs: number;
    }): Promise<void>;
    /**
     * Deletes all the messages of the conversation.
     *
     * This method deletes all the messages of the conversation from both the memory and local database.
     *
     * @throws A description of the exception. See {@link ChatError}.
     */
    deleteAllMessages(): Promise<void>;
    /**
     * Gets messages of a certain type that a specified user sends in a conversation.
     *
     * @param msgType The message type. See {@link ChatMessageType}.
     * @param direction The message search direction. See {@link ChatSearchDirection}.
     * - (Default) `ChatSearchDirection.UP`: Messages are retrieved in the descending order of the Unix timestamp ({@link ChatOptions.sortMessageByServerTime}) included in them.
     * - `ChatSearchDirection.DOWN`: Messages are retrieved in the ascending of the Unix timestamp ({@link ChatOptions.sortMessageByServerTime}) included in them.
     * @param timestamp The starting Unix timestamp in the message for query. The unit is millisecond. After this parameter is set, the SDK retrieves messages, starting from the specified one, according to the message search direction.
     *                  If you set this parameter as a negative value, the SDK retrieves messages, starting from the current time, in the descending order of the timestamp included in them.
     * @param count The maximum number of messages to retrieve each time. The value range is [1,400].
     * @param sender The user ID or group ID for retrieval. Usually, it is the conversation ID.
     * @returns The list of retrieved messages (excluding the one with the starting timestamp). If no message is obtained, an empty list is returned.
     *
     * @throws A description of the exception. See {@link ChatError}.
     *
     * @deprecated 2024-04-17 This method is deprecated. Use {@link getMsgsWithMsgType} instead.
     */
    getMessagesWithMsgType(msgType: ChatMessageType, direction?: ChatSearchDirection, timestamp?: number, count?: number, sender?: string): Promise<Array<ChatMessage>>;
    /**
     * Gets messages of a certain type in the conversation from the local database.
     *
     * **note** If the conversation object does not exist, this method will create it.
     *
     * @params -
     * @param msgType The message type. See {@link ChatMessageType}.
     * @param direction The message search direction. See {@link ChatSearchDirection}.
     * - (Default) `ChatSearchDirection.UP`: Messages are retrieved in the descending order of the Unix timestamp included in them.
     * - `ChatSearchDirection.DOWN`: Messages are retrieved in the ascending order of the Unix timestamp included in them.
     * @param timestamp The starting Unix timestamp in the message for query. The unit is millisecond. After this parameter is set, the SDK retrieves messages, starting from the specified one, according to the message search direction.
     *                  If you set this parameter as a negative value, the SDK retrieves messages, starting from the current time, in the descending order of the timestamp included in them.
     * @param count The maximum number of messages to retrieve each time. The value range is [1,400].
     * @param sender The user ID or group ID for retrieval. Usually, it is the conversation ID.
     *
     * @returns The list of retrieved messages (excluding the one with the starting timestamp). If no message is obtained, an empty list is returned.
     *
     * @throws A description of the exception. See {@link ChatError}.
     */
    getMsgsWithMsgType(params: {
        msgType: ChatMessageType;
        direction?: ChatSearchDirection;
        timestamp?: number;
        count?: number;
        sender?: string;
    }): Promise<Array<ChatMessage>>;
    /**
     * Gets messages of a certain quantity in a conversation from the local database.
     *
     * **Note**
     *
     * The obtained messages will also join the existing messages of the conversation stored in the memory.
     *
     * @param startMsgId The starting message ID for query. After this parameter is set, the SDK retrieves messages, starting from the specified one, according to the message search direction.
     *                   If this parameter is set an empty string, the SDK retrieves messages according to the message search direction while ignoring this parameter.
     *                  - If `direction` is set as `ChatSearchDirection.UP`, the SDK retrieves messages, starting from the latest one, in the descending order of the Unix timestamp ({@link ChatOptions.sortMessageByServerTime}) included in them.
     *                 - If `direction` is set as `ChatSearchDirection.DOWN`, the SDK retrieves messages, starting from the oldest one, in the ascending order of the Unix timestamp ({@link ChatOptions.sortMessageByServerTime}) included in them.
     * @param direction The message search direction. See {@link ChatSearchDirection}.
     * - (Default) `ChatSearchDirection.UP`: Messages are retrieved in the descending order of the Unix timestamp ({@link ChatOptions.sortMessageByServerTime}) included in them.
     * - `ChatSearchDirection.DOWN`: Messages are retrieved in the ascending order of the Unix timestamp ({@link ChatOptions.sortMessageByServerTime}) included in them.
     * @param loadCount The maximum number of messages to retrieve each time. The value range is [1,400].
     * @returns The message list (excluding the ones with the starting or ending timestamp). If no message is obtained, an empty list is returned.
     *
     * @throws A description of the exception. See {@link ChatError}.
     *
     * @deprecated 2024-04-17 This method is deprecated. Use {@link getMsgs} instead.
     */
    getMessages(startMsgId: string, direction?: ChatSearchDirection, loadCount?: number): Promise<Array<ChatMessage>>;
    /**
     * Gets messages of a specified quantity in a conversation from the local database.
     *
     * The retrieved messages will also be put in the conversation in the memory according to the timestamp included in them.
     *
     * **note** If the conversation object does not exist, this method will create it.
     *
     * @params -
     * @param startMsgId The starting message ID for query. After this parameter is set, the SDK retrieves messages, starting from the specified one, according to the message search direction.
     *                   If this parameter is set an empty string, the SDK retrieves messages according to the message search direction while ignoring this parameter.
     * @param direction The message search direction. See {@link ChatSearchDirection}.
     * - (Default) `ChatSearchDirection.UP`: Messages are retrieved in the descending order of the Unix timestamp included in them.
     * - `ChatSearchDirection.DOWN`: Messages are retrieved in the ascending order of the Unix timestamp included in them.
     * @param loadCount The maximum number of messages to retrieve each time. The value range is [1,50].
     *
     * @returns The list of retrieved messages (excluding the one with the starting timestamp). If no message is obtained, an empty list is returned.
     *
     * @throws A description of the exception. See {@link ChatError}.
     */
    getMsgs(params: {
        startMsgId: string;
        direction?: ChatSearchDirection;
        loadCount?: number;
    }): Promise<Array<ChatMessage>>;
    /**
     * Gets messages with keywords in a conversation in the local database.
     *
     * @param keywords The keywords for query.
     * @param direction The message search direction. See {@link ChatSearchDirection}.
     * - (Default) `ChatSearchDirection.Up`: Messages are retrieved in the descending order of the Unix timestamp ({@link ChatOptions.sortMessageByServerTime}) included in them.
     * - `ChatSearchDirection.Down`: Messages are retrieved in the ascending order of the Unix timestamp ({@link ChatOptions.sortMessageByServerTime}) included in them.
     * @param timestamp The starting Unix timestamp in the message for query. The unit is millisecond. After this parameter is set, the SDK retrieves messages, starting from the specified one, according to the message search direction.
     *                  If you set this parameter as a negative value, the SDK retrieves messages, starting from the current time, in the descending order of the the Unix timestamp ({@link ChatOptions.sortMessageByServerTime}) included in them.
     * @param count The maximum number of messages to retrieve each time. The value range is [1,400].
     * @param sender The user ID or group ID for retrieval. Usually, it is the conversation ID.
     * @returns  The list of retrieved messages (excluding the one with the starting timestamp). If no message is obtained, an empty list is returned.
     *
     * @throws A description of the exception. See {@link ChatError}.
     *
     * @deprecated 2024-04-17 This method is deprecated. Use {@link getMsgsWithKeyword} instead.
     */
    getMessagesWithKeyword(keywords: string, direction?: ChatSearchDirection, timestamp?: number, count?: number, sender?: string): Promise<Array<ChatMessage>>;
    /**
     * Gets messages that the specified user sends in a conversation in a certain period.
     *
     * This method gets data from the local database.
     *
     * **note** If the conversation object does not exist, this method will create it.
     *
     * @params -
     * - keywords The keywords for query.
     * - direction The message search direction. See {@link ChatSearchDirection}.
     * - (Default) `ChatSearchDirection.UP`: Messages are retrieved in the descending order of the Unix timestamp included in them.
     * - `ChatSearchDirection.DOWN`: Messages are retrieved in the ascending order of the Unix timestamp included in them.
     * - timestamp The starting Unix timestamp in the message for query. The unit is millisecond. After this parameter is set, the SDK retrieves messages, starting from the specified one, according to the message search direction.
     * - searchScope The message search scope. See {@link ChatMessageSearchScope}.
     *                  If you set this parameter as a negative value, the SDK retrieves messages, starting from the current time, in the descending order of the timestamp included in them.
     * - count The maximum number of messages to retrieve each time. The value range is [1,400].
     * - sender The user ID or group ID for retrieval. Usually, it is the conversation ID.
     *
     * @returns The list of retrieved messages (excluding the one with the starting timestamp). If no message is obtained, an empty list is returned.
     *
     * @throws A description of the exception. See {@link ChatError}.
     */
    getMsgsWithKeyword(params: {
        keywords: string;
        direction?: ChatSearchDirection;
        timestamp?: number;
        count?: number;
        sender?: string;
        searchScope?: ChatMessageSearchScope;
    }): Promise<Array<ChatMessage>>;
    /**
     * Gets messages that are sent and received in a certain period in a conversation in the local database.
     *
     * @param startTime The starting Unix timestamp for search. The unit is millisecond.
     * @param endTime The ending Unix timestamp for search. The unit is millisecond.
     * @param direction The message search direction. See {@link ChatSearchDirection}.
     * - (Default) `ChatSearchDirection.UP`: Messages are retrieved in the descending order of the Unix timestamp ({@link ChatOptions.sortMessageByServerTime}) included in them.
     * - `ChatSearchDirection.DOWN`: Messages are retrieved in the ascending order of the Unix timestamp ({@link ChatOptions.sortMessageByServerTime}) included in them.
     * @param count The maximum number of messages to retrieve each time. The value range is [1,400].
     * @returns The list of retrieved messages (excluding the ones with the starting or ending timestamp). If no message is obtained, an empty list is returned.
     *
     * @throws A description of the exception. See {@link ChatError}.
     *
     * @deprecated 2024-04-17 This method is deprecated. Use {@link getMsgWithTimestamp} instead.
     */
    getMessageWithTimestamp(startTime: number, endTime: number, direction?: ChatSearchDirection, count?: number): Promise<Array<ChatMessage>>;
    /**
     * Gets messages that are sent and received in a certain period in a conversation in the local database.
     *
     * **note** If the conversation object does not exist, this method will create it.
     *
     * @params -
     * @param startTime The starting Unix timestamp for query, in milliseconds.
     * @param endTime The ending Unix timestamp for query, in milliseconds.
     * @param direction The message search direction. See {@link ChatSearchDirection}.
     * - (Default) `ChatSearchDirection.UP`: Messages are retrieved in the descending order of the Unix timestamp included in them.
     * - `ChatSearchDirection.DOWN`: Messages are retrieved in the ascending order of the Unix timestamp included in them.
     * @param count The maximum number of messages to retrieve each time. The value range is [1,400].
     *
     * @returns The list of retrieved messages (excluding with the ones with the starting or ending timestamp). If no message is obtained, an empty list is returned.
     *
     * @throws A description of the exception. See {@link ChatError}.
     */
    getMsgWithTimestamp(params: {
        startTime: number;
        endTime: number;
        direction?: ChatSearchDirection;
        count?: number;
    }): Promise<Array<ChatMessage>>;
    /**
     * Deletes messages from the conversation (from both local storage and server).
     *
     * @param msgIds The IDs of messages to delete from the current conversation.
     *
     * @throws A description of the exception. See {@link ChatError}.
     */
    removeMessagesFromServerWithMsgIds(msgIds: string[]): Promise<void>;
    /**
     * Deletes messages from the conversation (from both local storage and server).
     *
     * @param timestamp The message timestamp in millisecond. The messages with the timestamp smaller than the specified one will be deleted.
     *
     * @throws A description of the exception. See {@link ChatError}.
     */
    removeMessagesFromServerWithTimestamp(timestamp: number): Promise<void>;
    /**
     * Gets the pinned messages in the conversation from the local database.
     *
     * @returns The list of pinned messages. If no message is obtained, an empty list is returned.
     *
     * @throws A description of the exception. See {@link ChatError}.
     */
    getPinnedMessages(): Promise<ChatMessage[]>;
    /**
     * Gets the pinned messages in the conversation from the server.
     *
     * @returns The list of pinned messages. If no message is obtained, an empty list is returned.
     *
     * @throws A description of the exception. See {@link ChatError}.
     */
    fetchPinnedMessages(): Promise<ChatMessage[]>;
}
/**
 * The conversation filter class.
 */
export declare class ChatConversationFetchOptions {
    /**
     * The number of conversations to retrieve.
     *
     * If you retrieve marked conversations, the value range is [1,10], with 10 as the default. Otherwise, the value range is [1,50].
     */
    pageSize?: number;
    /**
     * The cursor to specify where to start retrieving conversations.
     */
    cursor?: string;
    /**
     * Whether to get pinned conversations.
     * - `true`: Yes.
     * - `false`: No.
     */
    pinned?: boolean;
    /**
     * Whether to get marked conversations.
     * - `true`: Yes.
     * - `false`: No.
     */
    mark?: ChatConversationMarkType;
    constructor(params: {
        pageSize?: number;
        cursor?: string;
        pinned?: boolean;
        mark?: ChatConversationMarkType;
    });
    static default(): ChatConversationFetchOptions;
    static pinned(): ChatConversationFetchOptions;
    static withMark(mark: ChatConversationMarkType): ChatConversationFetchOptions;
}
//# sourceMappingURL=ChatConversation.d.ts.map
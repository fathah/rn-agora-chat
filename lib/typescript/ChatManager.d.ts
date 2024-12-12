import type { NativeEventEmitter } from 'react-native';
import { BaseManager } from './__internal__/Base';
import type { ChatMessageEventListener } from './ChatEvents';
import { ChatConversation, ChatConversationFetchOptions, ChatConversationMarkType, ChatConversationType, ChatSearchDirection } from './common/ChatConversation';
import { ChatCursorResult } from './common/ChatCursorResult';
import { ChatGroupMessageAck } from './common/ChatGroup';
import { ChatFetchMessageOptions, ChatMessage, ChatMessageBody, ChatMessageChatType, ChatMessagePinInfo, ChatMessageSearchScope, ChatMessageStatusCallback, ChatMessageType } from './common/ChatMessage';
import { ChatMessageReaction } from './common/ChatMessageReaction';
import { ChatMessageThread } from './common/ChatMessageThread';
import { ChatTranslateLanguage } from './common/ChatTranslateLanguage';
/**
 * The chat manager class, responsible for sending and receiving messages, managing conversations (including loading and deleting conversations), and downloading attachments.
 *
 * The sample code for sending a text message is as follows:
 *
 *  ```typescript
 *  let msg = ChatMessage.createTextMessage(
 *    'asteriskhx2',
 *    Date.now().toString(),
 *    ChatMessageChatType.PeerChat
 *  );
 *  let callback = new (class s implements ChatMessageStatusCallback {
 *    onProgress(progress: number): void {
 *      chatlog.log('ConnectScreen.sendMessage.onProgress ', progress);
 *    }
 *    onError(error: ChatError): void {
 *      chatlog.log('ConnectScreen.sendMessage.onError ', error);
 *    }
 *    onSuccess(): void {
 *      chatlog.log('ConnectScreen.sendMessage.onSuccess');
 *    }
 *    onReadAck(): void {
 *      chatlog.log('ConnectScreen.sendMessage.onReadAck');
 *    }
 *    onDeliveryAck(): void {
 *      chatlog.log('ConnectScreen.sendMessage.onDeliveryAck');
 *    }
 *    onStatusChanged(status: ChatMessageStatus): void {
 *      chatlog.log('ConnectScreen.sendMessage.onStatusChanged ', status);
 *    }
 *  })();
 *  ChatClient.getInstance()
 *    .chatManager.sendMessage(msg, callback)
 *    .then((nmsg: ChatMessage) => {
 *      chatlog.log(`${msg}, ${nmsg}`);
 *    })
 *    .catch();
 *  ```
 */
export declare class ChatManager extends BaseManager {
    static TAG: string;
    private _messageListeners;
    constructor();
    setNativeListener(event: NativeEventEmitter): void;
    private filterUnsupportedMessage;
    private createReceiveMessage;
    private onMessagesReceived;
    private onCmdMessagesReceived;
    private onMessagesRead;
    private onGroupMessageRead;
    private onMessagesDelivered;
    private onMessagesRecalled;
    private onConversationsUpdate;
    private onConversationHasRead;
    private onReadAckForGroupMessageUpdated;
    private onMessageReactionDidChange;
    private onChatMessageThreadCreated;
    private onChatMessageThreadUpdated;
    private onChatMessageThreadDestroyed;
    private onChatMessageThreadUserRemoved;
    private onMessageContentChanged;
    private onMessagePinChanged;
    private static handleSendMessageCallback;
    private static handleResendMessageCallback;
    private static handleDownloadAttachmentCallback;
    private static handleDownloadThumbnailCallback;
    private static handleDownloadFileCallback;
    /**
     * Adds a message listener.
     *
     * @param listener The message listener to add.
     */
    addMessageListener(listener: ChatMessageEventListener): void;
    /**
     * Removes the message listener.
     *
     * @param listener The message listener to remove.
     */
    removeMessageListener(listener: ChatMessageEventListener): void;
    /**
     * Removes all message listeners.
     */
    removeAllMessageListener(): void;
    /**
     * Sends a message.
     *
     * **Note**
     *
     * - For a voice or image message or a message with an attachment, the SDK will automatically upload the attachment.
     * - You can determine whether to upload the attachment to the chat sever by setting {@link ChatOptions}.
     *
     * @param message The message object to be sent. Ensure that you set this parameter.
     * @param callback The listener that listens for message changes.
     *
     * @throws A description of the exception. See {@link ChatError}.
     */
    sendMessage(message: ChatMessage, callback?: ChatMessageStatusCallback): Promise<void>;
    /**
     * Resends a message.
     *
     * @param message The message object to be resent.
     * @param callback The listener that listens for message changes.
     *
     * @throws A description of the exception. See {@link ChatError}.
     */
    resendMessage(message: ChatMessage, callback: ChatMessageStatusCallback): Promise<void>;
    /**
     * Sends the read receipt to the server.
     *
     * This method applies to one-to-one chats only.
     *
     * **Note**
     *
     * This method takes effect only when you set {@link ChatOptions.requireAck} as `true`.
     *
     * To send a group message read receipt, you can call {@link sendGroupMessageReadAck}.
     *
     * We recommend that you call {@link sendConversationReadAck} when opening the chat page. In other cases, you can call this method to reduce the number of method calls.
     *
     * @param message The message for which the read receipt is to be sent.
     *
     * @throws A description of the exception. See {@link ChatError}.
     */
    sendMessageReadAck(message: ChatMessage): Promise<void>;
    /**
     * Sends the group message receipt to the server.
     *
     * **Note**
     *
     * - This method takes effect only after you set {@link ChatOptions.requireAck} and {@link ChatMessage.needGroupAck} as `true`.
     * - This method applies to group messages only. To send a read receipt for a one-to-one chat message, you can call {@link sendMessageReadAck}; to send a conversation read receipt, you can call {@link sendConversationReadAck}.
     *
     * @param msgId The message ID.
     * @param groupId The group ID.
     * @param opt The extension information, which is a custom keyword that specifies a custom action or command.
     *
     * @throws A description of the exception. See {@link ChatError}.
     */
    sendGroupMessageReadAck(msgId: string, groupId: string, opt?: {
        content: string;
    }): Promise<void>;
    /**
     * Sends the conversation read receipt to the server.
     *
     * **Note**
     *
     * - This method is valid only for one-to-one conversations.
     * - After this method is called, the sever will set the message status from unread to read.
     * - The SDK triggers the {@link ChatMessageEventListener.onConversationRead} callback on the client of the message sender, notifying that the messages are read. This also applies to multi-device scenarios.
     *
     * @param convId The conversation ID.
     *
     * @throws A description of the exception. See {@link ChatError}.
     */
    sendConversationReadAck(convId: string): Promise<void>;
    /**
     * Recalls the sent message.
     *
     * @param msgId The message ID.
     *
     * @throws A description of the exception. See {@link ChatError}.
     */
    recallMessage(msgId: string): Promise<void>;
    /**
     * Gets a message from the local database by message ID.
     *
     * @param msgId The message ID.
     * @returns The message.
     *
     * @throws A description of the exception. See {@link ChatError}.
     */
    getMessage(msgId: string): Promise<ChatMessage | undefined>;
    /**
     * Marks all conversations as read.
     *
     * This method is for the local conversations only.
     *
     * @throws A description of the exception. See {@link ChatError}.
     */
    markAllConversationsAsRead(): Promise<void>;
    /**
     * Gets the count of the unread messages.
     *
     * @returns The count of the unread messages.
     *
     * @throws A description of the exception. See {@link ChatError}.
     */
    getUnreadCount(): Promise<number>;
    /**
     * Inserts a message to the conversation in the local database.
     *
     * For example, when a notification messages is received, a message can be constructed and written to the conversation. If the message to insert already exits (msgId or localMsgId is existed), the insertion fails.
     *
     * The message will be inserted based on the Unix timestamp included in it. Upon message insertion, the SDK will automatically update attributes of the conversation, including `latestMessage`.
     *
     * @param message The message to be inserted.
     *
     * @throws A description of the exception. See {@link ChatError}.
     */
    insertMessage(message: ChatMessage): Promise<void>;
    /**
     * Updates the local message.
     *
     * The message will be updated both in the memory and local database.
     *
     * @return The updated message.
     *
     * @throws A description of the exception. See {@link ChatError}.
     */
    updateMessage(message: ChatMessage): Promise<ChatMessage>;
    /**
     * Imports messages to the local database.
     *
     * You can only import messages that you sent or received.
     *
     * @param messages The messages to import.
     *
     * @throws A description of the exception. See {@link ChatError}.
     */
    importMessages(messages: Array<ChatMessage>): Promise<void>;
    /**
     * Downloads the message attachment.
     *
     * **Note** This method is only used to download messages attachment in combine type message or thread type.
     *
     * **Note** The bottom layer will not get the original message object and will use the json converted message object.
     *
     * You can also call this method if the attachment fails to be downloaded automatically.
     *
     * @param message The ID of the message with the attachment to be downloaded.
     * @param callback The listener that listens for message changes.
     *
     * @throws A description of the exception. See {@link ChatError}.
     */
    downloadAttachmentInCombine(message: ChatMessage, callback?: ChatMessageStatusCallback): Promise<void>;
    /**
     * Downloads the message thumbnail.
     *
     * **Note** This method is only used to download messages thumbnail in combine type message.
     *
     * @param message The ID of the message with the thumbnail to be downloaded. Only the image messages and video messages have a thumbnail.
     *
     * @throws A description of the exception. See {@link ChatError}.
     */
    downloadThumbnailInCombine(message: ChatMessage, callback?: ChatMessageStatusCallback): Promise<void>;
    /**
     * Downloads the message attachment.
     *
     * You can also call this method if the attachment fails to be downloaded automatically.
     *
     * @param message The ID of the message with the attachment to be downloaded.
     * @param callback The listener that listens for message changes.
     *
     * @throws A description of the exception. See {@link ChatError}.
     */
    downloadAttachment(message: ChatMessage, callback?: ChatMessageStatusCallback): Promise<void>;
    /**
     * Downloads the message thumbnail.
     *
     * @param message The ID of the message with the thumbnail to be downloaded. Only the image messages and video messages have a thumbnail.
     *
     * @throws A description of the exception. See {@link ChatError}.
     */
    downloadThumbnail(message: ChatMessage, callback?: ChatMessageStatusCallback): Promise<void>;
    /**
     * Uses the pagination to get messages in the specified conversation from the server.
     *
     * **note** If the conversation object does not exist, this method will create it.
     *
     * @param convId The conversation ID.
     * @param chatType The conversation type. See {@link ChatConversationType}.
     * @params params
     * - pageSize: The number of messages that you expect to get on each page. The value range is [1,50].
     * - startMsgId: The starting message ID for query. After this parameter is set, the SDK retrieves messages, starting from the specified one, in the reverse chronological order of when the server receives them. If this parameter is set an empty string, the SDK retrieves messages, starting from the latest one, in the reverse chronological order of when the server receives them.
     * - direction: The message search direction. See {@link ChatSearchDirection}.
     *                  - (Default) `ChatSearchDirection.Up`: Messages are retrieved in the descending order of the Unix timestamp included in them.
     *                  - `ChatSearchDirection.Down`: Messages are retrieved in the ascending order of the Unix timestamp included in them.
     * @returns The list of retrieved messages (excluding the one with the starting ID) and the cursor for the next query.
     *
     * @throws A description of the exception. See {@link ChatError}.
     */
    fetchHistoryMessages(convId: string, chatType: ChatConversationType, params: {
        pageSize?: number;
        startMsgId?: string;
        direction?: ChatSearchDirection;
    }): Promise<ChatCursorResult<ChatMessage>>;
    /**
     * retrieve the history message for the specified session from the server.
     *
     * **note** If the conversation object does not exist, this method will create it.
     *
     * @param convId The conversation ID.
     * @param chatType The conversation type. See {@link ChatConversationType}.
     * @param params -
     * - options: The parameter configuration class for pulling historical messages from the server. See {@link ChatFetchMessageOptions}.
     * - cursor: The cursor position from which to start querying data.
     * - pageSize: The number of messages that you expect to get on each page. The value range is [1,50].
     *
     * @returns The list of retrieved messages (excluding the one with the starting ID) and the cursor for the next query.
     *
     * @throws A description of the exception. See {@link ChatError}.
     */
    fetchHistoryMessagesByOptions(convId: string, chatType: ChatConversationType, params?: {
        options?: ChatFetchMessageOptions;
        cursor?: string;
        pageSize?: number;
    }): Promise<ChatCursorResult<ChatMessage>>;
    /**
     * Retrieves messages with keywords in a conversation from the local database.
     *
     * @param keywords The keywords for query.
     * @param timestamp The starting Unix timestamp in the message for query. The unit is millisecond. After this parameter is set, the SDK retrieves messages, starting from the specified one, according to the message search direction.
     *                  If you set this parameter as a negative value, the SDK retrieves messages, starting from the current time, in the descending order of the timestamp included in them.
     * @param maxCount The maximum number of messages to retrieve each time. The value range is [1,400].
     * @param from The user ID or group ID for retrieval. Usually, it is the conversation ID.
     * @param direction The message search direction. See {@link ChatSearchDirection}.
     *                  - (Default) `ChatSearchDirection.Up`: Messages are retrieved in the descending order of the Unix timestamp included in them.
     *                  - `ChatSearchDirection.Down`: Messages are retrieved in the ascending order of the Unix timestamp included in them.
     * @returns The list of retrieved messages (excluding the one with the starting timestamp). If no message is obtained, an empty list is returned.
     *
     * @throws A description of the exception. See {@link ChatError}.
     *
     * @deprecated 2024-04-22. Use {@link getMsgsWithKeyword} instead.
     */
    searchMsgFromDB(keywords: string, timestamp?: number, maxCount?: number, from?: string, direction?: ChatSearchDirection): Promise<Array<ChatMessage>>;
    /**
     * Retrieves messages with keywords from the local database.
     *
     * @param keywords The keywords for query.
     * @param timestamp The starting Unix timestamp in the message for query. The unit is millisecond. After this parameter is set, the SDK retrieves messages, starting from the specified one, according to the message search direction.
     *                  If you set this parameter as a negative value, the SDK retrieves messages, starting from the current time, in the descending order of the timestamp included in them.
     * @param maxCount The maximum number of messages to retrieve each time. The value range is [1,400].
     * @param from The user ID or group ID for retrieval. Usually, it is the conversation ID.
     * @param direction The message search direction. See {@link ChatSearchDirection}.
     *                  - (Default) `ChatSearchDirection.Up`: Messages are retrieved in the descending order of the Unix timestamp included in them.
     *                  - `ChatSearchDirection.Down`: Messages are retrieved in the ascending order of the Unix timestamp included in them.
     * @returns The list of retrieved messages (excluding the one with the starting timestamp). If no message is obtained, an empty list is returned.
     *
     * @throws A description of the exception. See {@link ChatError}.
     */
    getMsgsWithKeyword(params: {
        keywords: string;
        timestamp?: number;
        maxCount?: number;
        from?: string;
        direction?: ChatSearchDirection;
        searchScope?: ChatMessageSearchScope;
    }): Promise<Array<ChatMessage>>;
    /**
     * Uses the pagination to get read receipts for group messages from the server.
     *
     * For how to send read receipts for group messages, see {@link sendConversationReadAck}.
     *
     * @param msgId The message ID.
     * @param startAckId The starting read receipt ID for query. After this parameter is set, the SDK retrieves read receipts, from the specified one, in the reverse chronological order of when the server receives them.
     *                   If this parameter is set as `null` or an empty string, the SDK retrieves read receipts, from the latest one, in the reverse chronological order of when the server receives them.
     * @param pageSize The number of read receipts for the group message that you expect to get on each page. The value range is [1,400].
     * @returns The list of retrieved read receipts (excluding the one with the starting ID) and the cursor for the next query.
     *
     * @throws A description of the exception. See {@link ChatError}.
     */
    fetchGroupAcks(msgId: string, groupId: string, startAckId: string, pageSize?: number): Promise<ChatCursorResult<ChatGroupMessageAck>>;
    /**
     * Deletes the specified conversation and its historical messages from the server.
     *
     * @param convId The conversation ID.
     * @param convType The conversation type. See {@link ChatConversationType}.
     * @param isDeleteMessage Whether to delete the historical messages with the conversation.
     * - (Default) `true`: Yes.
     * - `false`: No.
     *
     * @throws A description of the exception. See {@link ChatError}.
     */
    removeConversationFromServer(convId: string, convType: ChatConversationType, isDeleteMessage?: boolean): Promise<void>;
    /**
     * Gets the conversation by conversation ID and conversation type.
     *
     * @param convId The conversation ID.
     * @param convType The conversation type. See {@link ChatConversationType}.
     * @param createIfNeed Whether to create a conversation if the specified conversation is not found:
     * - (Default) `true`: Yes.
     * - `false`: No.
     * @param isChatThread Whether the conversation is a thread conversation.
     * - (Default) `false`: No.
     * - `true`: Yes.
     *
     * @returns The retrieved conversation object. The SDK returns `null` if the conversation is not found.
     *
     * @throws A description of the exception. See {@link ChatError}.
     */
    getConversation(convId: string, convType: ChatConversationType, createIfNeed?: boolean, isChatThread?: boolean): Promise<ChatConversation | undefined>;
    /**
     * Gets all conversations from the local database.
     *
     * Conversations will be first retrieved from the memory. If no conversation is found, the SDK retrieves from the local database.
     *
     * @returns The retrieved conversations.
     *
     * @throws A description of the exception. See {@link ChatError}.
     */
    getAllConversations(): Promise<Array<ChatConversation>>;
    /**
     * @deprecated 2023-07-24
     *
     * Gets the conversation list from the server.
     *
     * **Note**
     *
     * - To use this function, you need to contact our business manager to activate it.
     * - After this function is activated, users can pull 10 conversations within 7 days by default (each conversation contains the latest historical message).
     * - If you want to adjust the number of conversations or time limit, contact our business manager.
     *
     * @returns The conversation list of the current user.
     *
     * @throws A description of the exception. See {@link ChatError}.
     */
    fetchAllConversations(): Promise<Array<ChatConversation>>;
    /**
     * Deletes a conversation and its local messages from the local database.
     *
     * @param convId The conversation ID.
     * @param withMessage Whether to delete the historical messages with the conversation.
     * - (Default) `true`: Yes.
     * - `false`: No.
     * @returns Whether the conversation is successfully deleted.
     * - `true`: Yes.
     * - `false`: No.
     *
     * @throws A description of the exception. See {@link ChatError}.
     */
    deleteConversation(convId: string, withMessage?: boolean): Promise<void>;
    /**
     * Gets the latest message from the conversation.
     *
     * **Note**
     *
     * The operation does not change the unread message count.
     * If the conversation object does not exist, this method will create it.
     *
     * The SDK gets the latest message from the memory first. If no message is found, the SDK loads the message from the local database and then puts it in the memory.
     *
     * @param convId The conversation ID.
     * @param convType The conversation type. See {@link ChatConversationType}.
     * @param isChatThread Whether the conversation is a thread conversation.
     *
     * @returns The message instance. The SDK returns `undefined` if the message does not exist.
     *
     * @throws A description of the exception. See {@link ChatError}.
     */
    getLatestMessage(convId: string, convType: ChatConversationType, isChatThread?: boolean): Promise<ChatMessage | undefined>;
    /**
     * Gets the latest received message from the conversation.
     *
     * **note** If the conversation object does not exist, this method will create it.
     *
     * @param convId The conversation ID.
     * @param convType The conversation type. See {@link ChatConversationType}.
     * @param isChatThread Whether the conversation is a thread conversation.
     *
     * @returns The message instance. The SDK returns `undefined` if the message does not exist.
     *
     * @throws A description of the exception. See {@link ChatError}.
     */
    getLatestReceivedMessage(convId: string, convType: ChatConversationType, isChatThread?: boolean): Promise<ChatMessage | undefined>;
    /**
     * Gets the unread message count of the conversation.
     *
     * **note** If the conversation object does not exist, this method will create it.
     *
     * @param convId The conversation ID.
     * @param convType The conversation type. See {@link ChatConversationType}.
     * @param isChatThread Whether the conversation is a thread conversation.
     *
     * @returns The unread message count.
     *
     * @throws A description of the exception. See {@link ChatError}.
     */
    getConversationUnreadCount(convId: string, convType: ChatConversationType, isChatThread?: boolean): Promise<number>;
    /**
     * Gets the message count of the conversation.
     *
     * **note** If the conversation object does not exist, this method will create it.
     *
     * @param convId The conversation ID.
     * @param convType The conversation type. See {@link ChatConversationType}.
     * @param isChatThread Whether the conversation is a thread conversation.
     *
     * @returns The message count.
     *getMessageCount
     * @throws A description of the exception. See {@link ChatError}.
     */
    getConversationMessageCount(convId: string, convType: ChatConversationType, isChatThread?: boolean): Promise<number>;
    /**
     * Marks a message as read.
     *
     * **note** If the conversation object does not exist, this method will create it.
     *
     * @param convId The conversation ID.
     * @param convType The conversation type. See {@link ChatConversationType}.
     * @param isChatThread Whether the conversation is a thread conversation.
     *
     * @param msgId The message ID.
     *
     * @throws A description of the exception. See {@link ChatError}.
     */
    markMessageAsRead(convId: string, convType: ChatConversationType, msgId: string, isChatThread?: boolean): Promise<void>;
    /**
     * Marks all messages as read.
     *
     * **note** If the conversation object does not exist, this method will create it.
     *
     * @param convId The conversation ID.
     * @param convType The conversation type. See {@link ChatConversationType}.
     * @param isChatThread Whether the conversation is a thread conversation.
     *
     * @throws A description of the exception. See {@link ChatError}.
     */
    markAllMessagesAsRead(convId: string, convType: ChatConversationType, isChatThread?: boolean): Promise<void>;
    /**
     * Updates a message in the local database.
     *
     * After you modify a message, the message ID remains unchanged and the SDK automatically updates properties of the conversation, like `latestMessage`.
     *
     * **note** If the conversation object does not exist, this method will create it.
     *
     * @param convId The conversation ID.
     * @param convType The conversation type. See {@link ChatConversationType}.
     * @param isChatThread Whether the conversation is a thread conversation.
     *
     * @param msg The ID of the message to update.
     *
     * @throws A description of the exception. See {@link ChatError}.
     */
    updateConversationMessage(convId: string, convType: ChatConversationType, msg: ChatMessage, isChatThread?: boolean): Promise<void>;
    /**
     * Deletes a message from the local database.
     *
     * **note** If the conversation object does not exist, this method will create it.
     *
     * @param convId The conversation ID.
     * @param convType The conversation type. See {@link ChatConversationType}.
     * @param isChatThread Whether the conversation is a thread conversation.
     *
     * @param msgId The ID of the message to delete.
     *
     * @throws A description of the exception. See {@link ChatError}.
     */
    deleteMessage(convId: string, convType: ChatConversationType, msgId: string, isChatThread?: boolean): Promise<void>;
    /**
     * Deletes messages sent or received in a certain period from the local database.
     *
     * **note** If the conversation object does not exist, this method will create it.
     *
     * @param convId The conversation ID.
     * @param convType The conversation type. See {@link ChatConversationType}.
     * @param isChatThread Whether the conversation is a thread conversation.
     *
     * @params params
     * - startTs: The starting UNIX timestamp for message deletion. The unit is millisecond.
     * - endTs: The end UNIX timestamp for message deletion. The unit is millisecond.
     *
     * @throws A description of the exception. See {@link ChatError}.
     */
    deleteMessagesWithTimestamp(convId: string, convType: ChatConversationType, params: {
        startTs: number;
        endTs: number;
    }, isChatThread?: boolean): Promise<void>;
    /**
     * Deletes all messages in the conversation from both the memory and local database.
     *
     * **note** If the conversation object does not exist, this method will create it.
     *
     * @param convId The conversation ID.
     * @param convType The conversation type. See {@link ChatConversationType}.
     * @param isChatThread Whether the conversation is a thread conversation.
     *
     * @throws A description of the exception. See {@link ChatError}.
     */
    deleteConversationAllMessages(convId: string, convType: ChatConversationType, isChatThread?: boolean): Promise<void>;
    /**
     * Deletes local messages with timestamp that is before the specified one.
     *
     * @param timestamp The specified Unix timestamp(milliseconds).
     *
     * @throws A description of the exception. See {@link ChatError}.
     */
    deleteMessagesBeforeTimestamp(timestamp: number): Promise<void>;
    /**
     * Retrieves messages of a certain type in the conversation from the local database.
     *
     * **note** If the conversation object does not exist, this method will create it.
     *
     * @param convId The conversation ID.
     * @param convType The conversation type. See {@link ChatConversationType}.
     * @param msgType The message type. See {@link ChatMessageType}.
     * @param direction The message search direction. See {@link ChatSearchDirection}.
     * - (Default) `ChatSearchDirection.UP`: Messages are retrieved in the descending order of the Unix timestamp included in them.
     * - `ChatSearchDirection.DOWN`: Messages are retrieved in the ascending order of the Unix timestamp included in them.
     * @param timestamp The starting Unix timestamp in the message for query. The unit is millisecond. After this parameter is set, the SDK retrieves messages, starting from the specified one, according to the message search direction.
     *                  If you set this parameter as a negative value, the SDK retrieves messages, starting from the current time, in the descending order of the timestamp included in them.
     * @param count The maximum number of messages to retrieve each time. The value range is [1,400].
     * @param sender The user ID or group ID for retrieval. Usually, it is the conversation ID.
     * @param isChatThread Whether the conversation is a thread conversation.
     *
     * @returns The list of retrieved messages (excluding the one with the starting timestamp). If no message is obtained, an empty list is returned.
     *
     * @throws A description of the exception. See {@link ChatError}.
     *
     * @deprecated 2023-07-24. Use {@link getMsgsWithMsgType} instead.
     */
    getMessagesWithMsgType(convId: string, convType: ChatConversationType, msgType: ChatMessageType, direction?: ChatSearchDirection, timestamp?: number, count?: number, sender?: string, isChatThread?: boolean): Promise<Array<ChatMessage>>;
    /**
     * Retrieves messages of a certain type in the conversation from the local database.
     *
     * **note** If the conversation object does not exist, this method will create it.
     *
     * @params -
     * @param convId The conversation ID.
     * @param convType The conversation type. See {@link ChatConversationType}.
     * @param msgType The message type. See {@link ChatMessageType}.
     * @param direction The message search direction. See {@link ChatSearchDirection}.
     * - (Default) `ChatSearchDirection.UP`: Messages are retrieved in the descending order of the Unix timestamp included in them.
     * - `ChatSearchDirection.DOWN`: Messages are retrieved in the ascending order of the Unix timestamp included in them.
     * @param timestamp The starting Unix timestamp in the message for query. The unit is millisecond. After this parameter is set, the SDK retrieves messages, starting from the specified one, according to the message search direction.
     *                  If you set this parameter as a negative value, the SDK retrieves messages, starting from the current time, in the descending order of the timestamp included in them.
     * @param count The maximum number of messages to retrieve each time. The value range is [1,400].
     * @param sender The user ID or group ID for retrieval. Usually, it is the conversation ID.
     * @param isChatThread Whether the conversation is a thread conversation.
     *
     * @returns The list of retrieved messages (excluding the one with the starting timestamp). If no message is obtained, an empty list is returned.
     *
     * @throws A description of the exception. See {@link ChatError}.
     */
    getMsgsWithMsgType(params: {
        convId: string;
        convType: ChatConversationType;
        msgType: ChatMessageType;
        direction?: ChatSearchDirection;
        timestamp?: number;
        count?: number;
        sender?: string;
        isChatThread?: boolean;
    }): Promise<Array<ChatMessage>>;
    /**
     * Retrieves messages of a specified quantity in a conversation from the local database.
     *
     * The retrieved messages will also be put in the conversation in the memory according to the timestamp included in them.
     *
     * **note** If the conversation object does not exist, this method will create it.
     *
     * @param convId The conversation ID.
     * @param convType The conversation type. See {@link ChatConversationType}.
     * @param startMsgId The starting message ID for query. After this parameter is set, the SDK retrieves messages, starting from the specified one, according to the message search direction.
     *                   If this parameter is set an empty string, the SDK retrieves messages according to the message search direction while ignoring this parameter.
     * @param direction The message search direction. See {@link ChatSearchDirection}.
     * - (Default) `ChatSearchDirection.UP`: Messages are retrieved in the descending order of the Unix timestamp included in them.
     * - `ChatSearchDirection.DOWN`: Messages are retrieved in the ascending order of the Unix timestamp included in them.
     * @param loadCount The maximum number of messages to retrieve each time. The value range is [1,50].
     * @param isChatThread Whether the conversation is a thread conversation.
     *
     * @returns The list of retrieved messages (excluding the one with the starting timestamp). If no message is obtained, an empty list is returned.
     *
     * @throws A description of the exception. See {@link ChatError}.
     *
     * @deprecated 2023-07-24. Use {@link getMsgs} instead.
     */
    getMessages(convId: string, convType: ChatConversationType, startMsgId: string, direction?: ChatSearchDirection, loadCount?: number, isChatThread?: boolean): Promise<Array<ChatMessage>>;
    /**
     * Retrieves messages of a specified quantity in a conversation from the local database.
     *
     * The retrieved messages will also be put in the conversation in the memory according to the timestamp included in them.
     *
     * **note** If the conversation object does not exist, this method will create it.
     *
     * @params -
     * @param convId The conversation ID.
     * @param convType The conversation type. See {@link ChatConversationType}.
     * @param startMsgId The starting message ID for query. After this parameter is set, the SDK retrieves messages, starting from the specified one, according to the message search direction.
     *                   If this parameter is set an empty string, the SDK retrieves messages according to the message search direction while ignoring this parameter.
     * @param direction The message search direction. See {@link ChatSearchDirection}.
     * - (Default) `ChatSearchDirection.UP`: Messages are retrieved in the descending order of the Unix timestamp included in them.
     * - `ChatSearchDirection.DOWN`: Messages are retrieved in the ascending order of the Unix timestamp included in them.
     * @param loadCount The maximum number of messages to retrieve each time. The value range is [1,50].
     * @param isChatThread Whether the conversation is a thread conversation.
     *
     * @returns The list of retrieved messages (excluding the one with the starting timestamp). If no message is obtained, an empty list is returned.
     *
     * @throws A description of the exception. See {@link ChatError}.
     */
    getMsgs(params: {
        convId: string;
        convType: ChatConversationType;
        startMsgId: string;
        direction?: ChatSearchDirection;
        loadCount?: number;
        isChatThread?: boolean;
    }): Promise<Array<ChatMessage>>;
    /**
     * Gets messages that the specified user sends in a conversation in a certain period.
     *
     * This method gets data from the local database.
     *
     * **note** If the conversation object does not exist, this method will create it.
     *
     * @param convId The conversation ID.
     * @param convType The conversation type. See {@link ChatConversationType}.
     * @param keywords The keywords for query.
     * @param direction The message search direction. See {@link ChatSearchDirection}.
     * - (Default) `ChatSearchDirection.UP`: Messages are retrieved in the descending order of the Unix timestamp included in them.
     * - `ChatSearchDirection.DOWN`: Messages are retrieved in the ascending order of the Unix timestamp included in them.
     * @param timestamp The starting Unix timestamp in the message for query. The unit is millisecond. After this parameter is set, the SDK retrieves messages, starting from the specified one, according to the message search direction.
     *                  If you set this parameter as a negative value, the SDK retrieves messages, starting from the current time, in the descending order of the timestamp included in them.
     * @param count The maximum number of messages to retrieve each time. The value range is [1,400].
     * @param sender The user ID or group ID for retrieval. Usually, it is the conversation ID.
     * @param isChatThread Whether the conversation is a thread conversation.
     *
     * @returns The list of retrieved messages (excluding the one with the starting timestamp). If no message is obtained, an empty list is returned.
     *
     * @throws A description of the exception. See {@link ChatError}.
     *
     * @deprecated 2023-07-24 This method is deprecated. Use {@link getConvMsgsWithKeyword} instead.
     */
    getMessagesWithKeyword(convId: string, convType: ChatConversationType, keywords: string, direction?: ChatSearchDirection, timestamp?: number, count?: number, sender?: string, isChatThread?: boolean): Promise<Array<ChatMessage>>;
    /**
     * Gets messages that the specified user sends in a conversation in a certain period.
     *
     * This method gets data from the local database.
     *
     * **note** If the conversation object does not exist, this method will create it.
     *
     * @params -
     * - convId The conversation ID.
     * - convType The conversation type. See {@link ChatConversationType}.
     * - keywords The keywords for query.
     * - direction The message search direction. See {@link ChatSearchDirection}.
     * - (Default) `ChatSearchDirection.UP`: Messages are retrieved in the descending order of the Unix timestamp included in them.
     * - `ChatSearchDirection.DOWN`: Messages are retrieved in the ascending order of the Unix timestamp included in them.
     * - timestamp The starting Unix timestamp in the message for query. The unit is millisecond. After this parameter is set, the SDK retrieves messages, starting from the specified one, according to the message search direction.
     * - searchScope The message search scope. See {@link ChatMessageSearchScope}.
     *                  If you set this parameter as a negative value, the SDK retrieves messages, starting from the current time, in the descending order of the timestamp included in them.
     * - count The maximum number of messages to retrieve each time. The value range is [1,400].
     * - sender The user ID or group ID for retrieval. Usually, it is the conversation ID.
     * - isChatThread Whether the conversation is a thread conversation.
     *
     * @returns The list of retrieved messages (excluding the one with the starting timestamp). If no message is obtained, an empty list is returned.
     *
     * @throws A description of the exception. See {@link ChatError}.
     */
    getConvMsgsWithKeyword(params: {
        convId: string;
        convType: ChatConversationType;
        keywords: string;
        direction?: ChatSearchDirection;
        timestamp?: number;
        count?: number;
        sender?: string;
        searchScope?: ChatMessageSearchScope;
        isChatThread?: boolean;
    }): Promise<Array<ChatMessage>>;
    /**
     * Retrieves messages that are sent and received in a certain period in a conversation in the local database.
     *
     * **note** If the conversation object does not exist, this method will create it.
     *
     * @param convId The conversation ID.
     * @param convType The conversation type. See {@link ChatConversationType}.
     * @param startTime The starting Unix timestamp for query, in milliseconds.
     * @param endTime The ending Unix timestamp for query, in milliseconds.
     * @param direction The message search direction. See {@link ChatSearchDirection}.
     * - (Default) `ChatSearchDirection.UP`: Messages are retrieved in the descending order of the Unix timestamp included in them.
     * - `ChatSearchDirection.DOWN`: Messages are retrieved in the ascending order of the Unix timestamp included in them.
     * @param count The maximum number of messages to retrieve each time. The value range is [1,400].
     * @param isChatThread Whether the conversation is a thread conversation.
     *
     * @returns The list of retrieved messages (excluding with the ones with the starting or ending timestamp). If no message is obtained, an empty list is returned.
     *
     * @throws A description of the exception. See {@link ChatError}.
     *
     * @deprecated 2023-07-24 This method is deprecated. Use {@link getMsgWithTimestamp} instead.
     */
    getMessageWithTimestamp(convId: string, convType: ChatConversationType, startTime: number, endTime: number, direction?: ChatSearchDirection, count?: number, isChatThread?: boolean): Promise<Array<ChatMessage>>;
    /**
     * Retrieves messages that are sent and received in a certain period in a conversation in the local database.
     *
     * **note** If the conversation object does not exist, this method will create it.
     *
     * @params -
     * @param convId The conversation ID.
     * @param convType The conversation type. See {@link ChatConversationType}.
     * @param startTime The starting Unix timestamp for query, in milliseconds.
     * @param endTime The ending Unix timestamp for query, in milliseconds.
     * @param direction The message search direction. See {@link ChatSearchDirection}.
     * - (Default) `ChatSearchDirection.UP`: Messages are retrieved in the descending order of the Unix timestamp included in them.
     * - `ChatSearchDirection.DOWN`: Messages are retrieved in the ascending order of the Unix timestamp included in them.
     * @param count The maximum number of messages to retrieve each time. The value range is [1,400].
     * @param isChatThread Whether the conversation is a thread conversation.
     *
     * @returns The list of retrieved messages (excluding with the ones with the starting or ending timestamp). If no message is obtained, an empty list is returned.
     *
     * @throws A description of the exception. See {@link ChatError}.
     */
    getMsgWithTimestamp(params: {
        convId: string;
        convType: ChatConversationType;
        startTime: number;
        endTime: number;
        direction?: ChatSearchDirection;
        count?: number;
        isChatThread?: boolean;
    }): Promise<Array<ChatMessage>>;
    /**
     * Translates a text message.
     *
     * @param msg The text message to translate.
     * @param languages The target languages.
     * @returns The translation.
     *
     * @throws A description of the exception. See {@link ChatError}.
     */
    translateMessage(msg: ChatMessage, languages: Array<string>): Promise<ChatMessage>;
    /**
     * Gets all languages supported by the translation service.
     *
     * @returns The list of languages supported for translation.
     *
     * @throws A description of the exception. See {@link ChatError}.
     */
    fetchSupportedLanguages(): Promise<Array<ChatTranslateLanguage>>;
    /**
     * Sets the extension information of the conversation.
     *
     * **note** If the conversation object does not exist, this method will create it.
     *
     * @param convId The conversation ID.
     * @param convType The conversation type. See {@link ChatConversationType}.
     * @param isChatThread Whether the conversation is a thread conversation.
     *
     * @param ext The extension information. This parameter must be key-value type.
     */
    setConversationExtension(convId: string, convType: ChatConversationType, ext: {
        [key: string]: string | number | boolean;
    }, isChatThread?: boolean): Promise<void>;
    /**
     * Adds a Reaction.
     *
     * @param reaction The Reaction content.
     * @param msgId The ID of the message for which the Reaction is added.
     *
     * @throws A description of the exception. See {@link ChatError}.
     */
    addReaction(reaction: string, msgId: string): Promise<void>;
    /**
     * Deletes a Reaction.
     *
     * @param reaction The Reaction to delete.
     * @param msgId The message ID.
     *
     * @throws A description of the exception. See {@link ChatError}.
     */
    removeReaction(reaction: string, msgId: string): Promise<void>;
    /**
     * Gets the list of Reactions.
     *
     * @param msgIds The message ID list.
     * @param groupId The group ID, which is invalid only when the chat type is group chat.
     * @param chatType The chat type.
     * @returns If success, the Reaction list is returned; otherwise, an exception is thrown.
     *
     * @throws A description of the exception. See {@link ChatError}.
     */
    fetchReactionList(msgIds: Array<string>, groupId: string, chatType: ChatMessageChatType): Promise<Map<string, Array<ChatMessageReaction>>>;
    /**
     * Gets the Reaction details.
     *
     * @param msgId The message ID.
     * @param reaction The Reaction content.
     * @param cursor The cursor position from which to start getting Reactions.
     * @param pageSize The number of Reactions you expect to get on each page.
     * @returns If success, the SDK returns the Reaction details and the cursor for the next query. The SDK returns `null` if all the data is fetched.
     *          If a failure occurs, an exception is thrown.
     *
     * @throws A description of the exception. See {@link ChatError}.
     */
    fetchReactionDetail(msgId: string, reaction: string, cursor?: string, pageSize?: number): Promise<ChatCursorResult<ChatMessageReaction>>;
    /**
     * Reports an inappropriate message.
     *
     * @param msgId The ID of the message to report.
     * @param tag The tag of the inappropriate message. You need to type a custom tag, like `porn` or `ad`.
     * @param reason The reporting reason. You need to type a specific reason.
     *
     * @throws A description of the exception. See {@link ChatError}.
     */
    reportMessage(msgId: string, tag: string, reason: string): Promise<void>;
    /**
     * Gets the list of Reactions from a message.
     *
     * @param msgId The message ID.
     * @returns If success, the Reaction list is returned; otherwise, an exception will be thrown.
     *
     * @throws A description of the exception. See {@link ChatError}.
     */
    getReactionList(msgId: string): Promise<Array<ChatMessageReaction>>;
    /**
     * Gets the number of members that have read the group message.
     *
     * @param msgId The message ID.
     * @returns If success, the SDK returns the number of members that have read the group message; otherwise, an exception will be thrown.
     *
     * @throws A description of the exception. See {@link ChatError}.
     */
    groupAckCount(msgId: string): Promise<number | undefined>;
    /**
     * Creates a message thread.
     *
     * Each member of the group where the thread belongs can call this method.
     *
     * Upon the creation of a message thread, the following will occur:
     *
     *  - In a single-device login scenario, each member of the group to which the message thread belongs will receive the {@link ChatMessageEventListener.onChatMessageThreadCreated} callback.
     *   You can listen for message thread events by setting {@link ChatMessageEventListener}.
     *
     * - In a multi-device login scenario, the devices will receive the {@link ChatMultiDeviceEventListener.onThreadEvent} callback.
     *   You can listen for message thread events by setting {@link ChatMultiDeviceEventListener}.
     *
     * @param name The name of the new message thread. It can contain a maximum of 64 characters.
     * @param msgId The ID of the parent message.
     * @param parentId The parent ID, which is the group ID.
     * @returns If success, the new message thread object is returned; otherwise, an exception will be thrown.
     *
     * @throws A description of the exception. See {@link ChatError}.
     */
    createChatThread(name: string, msgId: string, parentId: string): Promise<ChatMessageThread>;
    /**
     * Joins a message thread.
     *
     * Each member of the group where the message thread belongs can call this method.
     *
     * In a multi-device login scenario, note the following:
     *
     * - The devices will receive the {@link ChatMultiDeviceEventListener.onThreadEvent} callback.
     *
     * - You can listen for message thread events by setting {@link ChatMultiDeviceEventListener}.
     *
     * @param chatThreadId The message thread ID.
     * @returns If success, the message thread details {@link ChatMessageThread} are returned; otherwise, an exception will be thrown.
     *
     * @throws A description of the exception. See {@link ChatError}.
     */
    joinChatThread(chatThreadId: string): Promise<ChatMessageThread>;
    /**
     * Leaves a message thread.
     *
     * Each member in the message thread can call this method.
     *
     * In a multi-device login scenario, note the following:
     *
     * - The devices will receive the {@link ChatMultiDeviceEventListener.onThreadEvent} callback.
     *
     * - You can listen for message thread events by setting {@link ChatMultiDeviceEventListener}.
     *
     * @param chatThreadId The ID of the message thread that the current user wants to leave.
     *
     * @throws A description of the exception. See {@link ChatError}.
     */
    leaveChatThread(chatThreadId: string): Promise<void>;
    /**
     * Destroys the message thread.
     *
     * Only the owner or admins of the group where the message thread belongs can call this method.
     *
     * **Note**
     *
     * - In a single-device login scenario, each member of the group to which the message thread belongs will receive the {@link ChatMessageEventListener.onChatMessageThreadDestroyed} callback.
     *   You can listen for message thread events by setting {@link ChatMessageEventListener}.
     *
     * - In a multi-device login scenario, the devices will receive the {@link ChatMultiDeviceEventListener.onThreadEvent} callback.
     *   You can listen for message thread events by setting {@link ChatMultiDeviceEventListener}.
     *
     * @param chatThreadId The message thread ID.
     *
     * @throws A description of the exception. See {@link ChatError}.
     */
    destroyChatThread(chatThreadId: string): Promise<void>;
    /**
     * Changes the name of the message thread.
     *
     * Only the owner or admins of the group where the message thread belongs and the message thread creator can call this method.
     *
     * Each member of the group to which the message thread belongs will receive the {@link ChatMessageEventListener.onChatMessageThreadUpdated} callback.
     *
     * You can listen for message thread events by setting {@link ChatMessageEventListener}.
     *
     * @param chatThreadId  The message thread ID.
     * @param newName The new message thread name. It can contain a maximum of 64 characters.
     *
     * @throws A description of the exception. See {@link ChatError}.
     */
    updateChatThreadName(chatThreadId: string, newName: string): Promise<void>;
    /**
     * Removes a member from the message thread.
     *
     * Only the owner or admins of the group where the message thread belongs and the message thread creator can call this method.
     *
     * The removed member will receive the {@link ChatMessageEventListener.onChatMessageThreadUserRemoved} callback.
     *
     * You can listen for message thread events by setting {@link ChatMessageEventListener}.
     *
     * @param chatThreadId The message thread ID.
     * @param memberId The user ID of the member to be removed from the message thread.
     *
     * @throws A description of the exception. See {@link ChatError}.
     */
    removeMemberWithChatThread(chatThreadId: string, memberId: string): Promise<void>;
    /**
     * Uses the pagination to get a list of members in the message thread.
     *
     * Each member of the group to which the message thread belongs can call this method.
     *
     * @param chatThreadId The message thread ID.
     * @param cursor The position from which to start getting data. At the first method call, if you set `cursor` to `null` or an empty string, the SDK will get data in the chronological order of when members join the message thread.
     * @param pageSize The number of members that you expect to get on each page. The value range is [1,400].
     * @returns If success, the list of members in a message thread is returned; otherwise, an exception will be thrown.
     *
     * @throws A description of the exception. See {@link ChatError}.
     */
    fetchMembersWithChatThreadFromServer(chatThreadId: string, cursor?: string, pageSize?: number): Promise<ChatCursorResult<string>>;
    /**
     * Uses the pagination to get the list of message threads that the current user has joined.
     *
     * @param cursor The position from which to start getting data. At the first method call, if you set `cursor` to `null` or an empty string, the SDK will get data in the reverse chronological order of when the user joins the message threads.
     * @param pageSize The number of message threads that you expect to get on each page. The value range is [1,400].
     * @returns If success, a list of message threads is returned; otherwise, an exception will be thrown.
     *
     * @throws A description of the exception. See {@link ChatError}.
     */
    fetchJoinedChatThreadFromServer(cursor?: string, pageSize?: number): Promise<ChatCursorResult<ChatMessageThread>>;
    /**
     * Uses the pagination to get the list of message threads that the current user has joined in the specified group.
     *
     * This method gets data from the server.
     *
     * @param parentId The parent ID, which is the group ID.
     * @param cursor The position from which to start getting data. At the first method call, if you set `cursor` to `null` or an empty string, the SDK will get data in the reverse chronological order of when the user joins the message threads.
     * @param pageSize The number of message threads that you expect to get on each page. The value range is [1,400].
     * @returns If success, a list of message threads is returned; otherwise, an exception will be thrown.
     *
     * @throws A description of the exception. See {@link ChatError}.
     */
    fetchJoinedChatThreadWithParentFromServer(parentId: string, cursor?: string, pageSize?: number): Promise<ChatCursorResult<ChatMessageThread>>;
    /**
     * Uses the pagination to get the list of message threads in the specified group.
     *
     * This method gets data from the server.
     *
     * @param parentId The parent ID, which is the group ID.
     * @param cursor The position from which to start getting data. At the first method call, if you set `cursor` to `null` or an empty string, the SDK will get data in the reverse chronological order of when message threads are created.
     * @param pageSize The number of message threads that you expect to get on each page. The value range is [1,400].
     * @returns If success, a list of message threads is returned; otherwise, an exception will be thrown.
     *
     * @throws A description of the exception. See {@link ChatError}.
     */
    fetchChatThreadWithParentFromServer(parentId: string, cursor?: string, pageSize?: number): Promise<ChatCursorResult<ChatMessageThread>>;
    /**
     * Gets the last reply in the specified message threads from the server.
     *
     * @param chatThreadIds The list of message thread IDs to query. You can pass a maximum of 20 message thread IDs each time.
     * @returns If success, a list of last replies are returned; otherwise, an exception will be thrown.
     *
     * @throws A description of the exception. See {@link ChatError}.
     */
    fetchLastMessageWithChatThread(chatThreadIds: Array<string>): Promise<Map<string, ChatMessage>>;
    /**
     * Gets the details of the message thread from the server.
     *
     * @param chatThreadId The message thread ID.
     * @returns If success, the details of the message thread are returned; otherwise, an exception will be thrown.
     *
     * @throws A description of the exception. See {@link ChatError}.
     */
    fetchChatThreadFromServer(chatThreadId: string): Promise<ChatMessageThread | undefined>;
    /**
     * Gets the details of the message thread from the memory.
     *
     * @param msgId The message thread ID.
     * @returns If success, the details of the message thread are returned; otherwise, an exception will be thrown.
     *
     * @throws A description of the exception. See {@link ChatError}.
     */
    getMessageThread(msgId: string): Promise<ChatMessageThread | undefined>;
    /**
     * Gets the thread conversation by conversation ID.
     *
     * @param convId The conversation ID.
     * @param createIfNeed Whether to create a conversation if the specified conversation is not found:
     * - (Default) `true`: Yes.
     * - `false`: No.
     *
     * @returns The retrieved conversation object. The SDK returns `null` if the conversation is not found.
     *
     * @throws A description of the exception. See {@link ChatError}.
     */
    getThreadConversation(convId: string, createIfNeed?: boolean): Promise<ChatConversation | undefined>;
    /**
     * Gets conversations from the server with pagination.
     *
     * @param pageSize The number of conversations to retrieve on each page.
     * @param pageNum The current page number, starting from 1.
     * @returns If success, the list of conversations is returned; otherwise, an exception will be thrown.
     *
     * @throws A description of the exception. See {@link ChatError}.
     */
    fetchConversationsFromServerWithPage(pageSize: number, pageNum: number): Promise<Array<ChatConversation>>;
    /**
     * Deletes messages from the conversation (from both local storage and server).
     *
     * **note** If the conversation object does not exist, this method will create it.
     *
     * @param convId The conversation ID.
     * @param convType The conversation Type.
     * @param isChatThread Whether the conversation is a thread conversation.
     *
     * @param msgIds The IDs of messages to delete from the current conversation.
     *
     * @throws A description of the exception. See {@link ChatError}.
     */
    removeMessagesFromServerWithMsgIds(convId: string, convType: ChatConversationType, msgIds: string[], isChatThread?: boolean): Promise<void>;
    /**
     * Deletes messages from the conversation (from both local storage and server).
     *
     * **note** If the conversation object does not exist, this method will create it.
     *
     * @param convId The conversation ID.
     * @param convType The conversation Type.
     * @param isChatThread Whether the conversation is a thread conversation.
     *
     * @param timestamp The message timestamp in millisecond. The messages with the timestamp smaller than the specified one will be deleted.
     *
     * @throws A description of the exception. See {@link ChatError}.
     */
    removeMessagesFromServerWithTimestamp(convId: string, convType: ChatConversationType, timestamp: number, isChatThread?: boolean): Promise<void>;
    /**
     * Gets the list of conversations from the server with pagination.
     *
     * The SDK retrieves the list of conversations in the reverse chronological order of their active time (generally the timestamp of the last message).
     *
     * If there is no message in the conversation, the SDK retrieves the list of conversations in the reverse chronological order of their creation time.
     *
     * @param cursor: The cursor position from which to start querying data. If you pass in an empty string or `undefined`, the SDK retrieves conversations from the latest active one.
     *
     * @param pageSize: The number of conversations that you expect to get on each page. The value range is [1,50].
     *
     * @returns The list of retrieved conversations.
     *
     * @throws A description of the exception. See {@link ChatError}.
     */
    fetchConversationsFromServerWithCursor(cursor?: string, pageSize?: number): Promise<ChatCursorResult<ChatConversation>>;
    /**
     * Get the list of pinned conversations from the server with pagination.
     *
     * The SDK returns the pinned conversations in the reverse chronological order of their pinning.
     *
     * @param cursor: The cursor position from which to start querying data. If you pass in an empty string or `undefined`, the SDK retrieves the pinned conversations from the latest pinned one.
     * @param pageSize: The number of conversations that you expect to get on each page. The value range is [1,50].
     *
     * @returns The list of retrieved conversations.
     *
     * @throws A description of the exception. See {@link ChatError}.
     */
    fetchPinnedConversationsFromServerWithCursor(cursor?: string, pageSize?: number): Promise<ChatCursorResult<ChatConversation>>;
    /**
     * Sets whether to pin a conversation.
     *
     * @param convId The conversation ID.
     * @param isPinned Whether to pin a conversation:
     * - `true`：Yes.
     * - `false`: No. The conversation is unpinned.
     *
     * @throws A description of the exception. See {@link ChatError}.
     */
    pinConversation(convId: string, isPinned: boolean): Promise<void>;
    /**
     * Modifies a message.
     *
     * After this method is called to modify a message, both the local message and the message on the server are modified.
     *
     * This method can only modify a text message in one-to-one chats or group chats, but not in chat rooms.
     *
     * @param msgId The ID of the message to modify.
     * @param body The modified text message body. See {@link ChatTextMessageBody}.
     *
     * @returns The modified message. See {@link ChatMessageBody}.
     *
     * @throws A description of the exception. See {@link ChatError}.
     */
    modifyMessageBody(msgId: string, body: ChatMessageBody): Promise<ChatMessage>;
    /**
     * Gets the list of original messages included in a combined message.
     *
     * A combined message contains one or more multiple original messages.
     *
     * @param message The combined message.
     *
     * @returns The list of original messages in the message body.
     *
     * @throws A description of the exception. See {@link ChatError}.
     */
    fetchCombineMessageDetail(message: ChatMessage): Promise<Array<ChatMessage>>;
    /**
     *  Marks conversations.
     *
     *  This method marks conversations both locally and on the server.
     *
     * @param convIds The list of conversation IDs.
     * @param mark The mark to add for the conversations. See {@link ChatConversationMarkType}.
     *
     * @throws A description of the exception. See {@link ChatError}.
     */
    addRemoteAndLocalConversationsMark(convIds: string[], mark: ChatConversationMarkType): Promise<void>;
    /**
     *  Unmarks conversations.
     *
     *  This method unmarks conversations both locally and on the server.
     *
     * @param convIds The list of conversation IDs.
     * @param mark The conversation mark to remove. See {@link ChatConversationMarkType}.
     *
     * @throws A description of the exception. See {@link ChatError}.
     */
    deleteRemoteAndLocalConversationsMark(convIds: string[], mark: ChatConversationMarkType): Promise<void>;
    /**
     * Gets the conversations from the server by conversation filter options.
     *
     * @param option The conversation filter options. See {@link ChatConversationFetchOptions}.
     *
     * @returns The retrieved list of conversations. See {@link ChatCursorResult}.
     */
    fetchConversationsByOptions(option: ChatConversationFetchOptions): Promise<ChatCursorResult<ChatConversation>>;
    /**
     * Clears all conversations and all messages in them.
     *
     * @param clearServerData Whether to clear all conversations and all messages in them on the server.
     *   - `true`：Yes. All conversations and all messages in them will be cleared on the server side.
     *   The current user cannot retrieve messages and conversations from the server, while this has no impact on other users.
     *  - (Default) `false`：No. All local conversations and all messages in them will be cleared, while those on the server remain.
     *
     * @throws A description of the exception. See {@link ChatError}.
     */
    deleteAllMessageAndConversation(clearServerData?: boolean): Promise<void>;
    /**
     * Pins a message.
     *
     * @param messageId The message ID.
     *
     * @throws A description of the exception. See {@link ChatError}.
     */
    pinMessage(messageId: string): Promise<void>;
    /**
     * Unpins a message.
     *
     * @param messageId The message ID.
     *
     * @throws A description of the exception. See {@link ChatError}.
     */
    unpinMessage(messageId: string): Promise<void>;
    /**
     * Gets the list of pinned messages in the conversation from the server.
     *
     * @param convId The conversation ID.
     * @param convType The conversation type. See {@link ChatConversationType}.
     * @param isChatThread Whether the conversation is a thread conversation.
     *
     * @returns The list of pinned messages. If no message is obtained, an empty list is returned.
     *
     * @throws A description of the exception. See {@link ChatError}.
     */
    fetchPinnedMessages(convId: string, convType: ChatConversationType, isChatThread?: boolean): Promise<ChatMessage[]>;
    /**
     * Gets the pinned messages in a local conversation.
     *
     * @param convId The conversation ID.
     * @param convType The conversation type. See {@link ChatConversationType}.
     * @param isChatThread Whether the conversation is a thread conversation.
     *
     * @returns The list of pinned messages. If no message is obtained, an empty list is returned.
     *
     * @throws A description of the exception. See {@link ChatError}.
     */
    getPinnedMessages(convId: string, convType: ChatConversationType, isChatThread?: boolean): Promise<ChatMessage[]>;
    /**
     * Gets the pinning information of a message.
     *
     * @param messageId The message ID.
     * @returns The message pinning information. If the message does not exit or is not pinned, `undefined` is returned.
     *
     * @throws A description of the exception. See {@link ChatError}.
     */
    getMessagePinInfo(messageId: string): Promise<ChatMessagePinInfo | undefined>;
}
//# sourceMappingURL=ChatManager.d.ts.map
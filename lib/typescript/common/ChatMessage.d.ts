import type { ChatSearchDirection } from './ChatConversation';
import { ChatError } from './ChatError';
import type { ChatMessageReaction } from './ChatMessageReaction';
import type { ChatMessageThread } from './ChatMessageThread';
/**
 * The conversation types.
 */
export declare enum ChatMessageChatType {
    /**
     * One-to-one chat.
     */
    PeerChat = 0,
    /**
     * Group chat.
     */
    GroupChat = 1,
    /**
     * Chat room.
     */
    ChatRoom = 2
}
/**
 * The message directions.
 */
export declare enum ChatMessageDirection {
    /**
     * This message is sent from the local client.
     */
    SEND = "send",
    /**
     * The message is received by the local client.
     */
    RECEIVE = "rec"
}
/**
 * The message sending states.
 */
export declare enum ChatMessageStatus {
    /**
     * The message is created to be sent.
     */
    CREATE = 0,
    /**
     * The message is being delivered.
     */
    PROGRESS = 1,
    /**
     * The message is successfully delivered.
     */
    SUCCESS = 2,
    /**
     * The message fails to be delivered.
     */
    FAIL = 3
}
/**
 * The attachment file download states.
 */
export declare enum ChatDownloadStatus {
    /**
     * The file message download is pending.
     */
    PENDING = -1,
    /**
     * The SDK is downloading the file message.
     */
    DOWNLOADING = 0,
    /**
     * The SDK successfully downloads the file message.
     */
    SUCCESS = 1,
    /**
     * The SDK fails to download the file message.
     */
    FAILED = 2
}
/**
 * The message types.
 */
export declare enum ChatMessageType {
    /**
     * internal use.
     */
    /**
     * Text message.
     */
    TXT = "txt",
    /**
     * Image message.
     */
    IMAGE = "img",
    /**
     * Video message.
     */
    VIDEO = "video",
    /**
     * Location message.
     */
    LOCATION = "loc",
    /**
     * Voice message.
     */
    VOICE = "voice",
    /**
     * File message.
     */
    FILE = "file",
    /**
     * Command message.
     */
    CMD = "cmd",
    /**
     * Custom message.
     */
    CUSTOM = "custom",
    /**
     * Combined message.
     */
    COMBINE = "combine"
}
/**
 * The priorities of chat room messages.
 */
export declare enum ChatRoomMessagePriority {
    /**
     * High
     */
    PriorityHigh = 0,
    /**
     * Normal. `Normal` is the default priority.
     */
    PriorityNormal = 1,
    /**
     * Low
     */
    PriorityLow = 2
}
/**
 * The message pinning and unpinning operations.
 */
export declare enum ChatMessagePinOperation {
    /**
     * Pin the message.
     */
    Pin = 0,
    /**
     * Unpin the message.
     */
    Unpin = 1
}
/**
 * The message search scope.
 */
export declare enum ChatMessageSearchScope {
    /**
     * Search by message content.
     */
    Content = 0,
    /**
     * Search by message extension.
     */
    Attribute = 1,
    /**
     * Search by message content and extension.
     */
    All = 2
}
/**
 * Converts the conversation type from int to string.
 *
 * @param params The conversation type of the int type.
 * @returns The conversation type of the string type.
 */
export declare function ChatMessageChatTypeFromNumber(params: number): ChatMessageChatType;
/**
 * Converts the message direction from string to enum.
 *
 * @param params The message direction of the string type.
 * @returns The message direction of the enum type.
 */
export declare function ChatMessageDirectionFromString(params: string): ChatMessageDirection;
/**
 * Converts the message status from int to enum.
 *
 * @param params The message status of the int type.
 * @returns The message status of the enum type.
 */
export declare function ChatMessageStatusFromNumber(params: number): ChatMessageStatus;
/**
 * Converts the message status from enum to string.
 *
 * @param params The message status of the enum type.
 * @returns The message status of the string type.
 */
export declare function ChatMessageStatusToString(params: ChatMessageStatus): string;
/**
 * Converts the message download status from int to string.
 *
 * @param params The message download status of the int type.
 * @returns The message download status of the string type.
 */
export declare function ChatDownloadStatusFromNumber(params: number): ChatDownloadStatus;
/**
 * Converts the message download status from int to string.
 *
 * @param params The message download status of the int type.
 * @returns The message download status of the string type.
 */
export declare function ChatDownloadStatusToString(params: ChatDownloadStatus): string;
/**
 * Converts the message type from string to enum.
 *
 * @param params The message type of the string type.
 * @returns The message type of the enum type.
 */
export declare function ChatMessageTypeFromString(params: string): ChatMessageType;
/**
 * The message status change listener.
 */
export interface ChatMessageStatusCallback {
    /**
     * Occurs when a message is uploaded or downloaded.
     *
     * @param progress The message upload/download progress value. The value range is 0 to 100 in percentage.
     */
    onProgress?(localMsgId: string, progress: number): void;
    /**
     * Occurs when a message error occurs.
     *
     * @param error A description of the error. See {@link ChatError}.
     */
    onError(localMsgId: string, error: ChatError): void;
    /**
     * Occurs when a message is successfully delivered.
     *
     * @param message The message that is successfully delivered.
     */
    onSuccess(message: ChatMessage): void;
}
/**
 * The message class that defines a message that is to be sent or received.
 *
 * For example, construct a text message to send:
 *
 * ```typescript
 *   let msg = ChatMessage.createTextMessage(
 *         'asteriskhx2',
 *         Date.now().toString(),
 *         ChatMessageChatType.PeerChat
 *       );
 * ```
 */
export declare class ChatMessage {
    static TAG: string;
    /**
     * The message ID generated on the server.
     */
    msgId: string;
    /**
     * The local message ID.
     */
    localMsgId: string;
    /**
     * The conversation ID.
     */
    conversationId: string;
    /**
     * The user ID of the message sender.
     */
    from: string;
    /**
     * The user ID of the message recipient:
     *
     * - For the one-to-one chat, it is the user ID of the message recipient;
     * - For the group chat, it is the group ID;
     * - For the chat room chat, it is the chat room ID;
     * - For a message thread, it is the ID of the message thread.
     */
    to: string;
    /**
     * The Unix timestamp when the message is created locally. The unit is millisecond.
     */
    localTime: number;
    /**
     * The Unix timestamp when the server receives the message. The unit is millisecond.
     */
    serverTime: number;
    /**
     * Whether messages have arrived at the recipient during a one-to-one chat. If delivery receipts are required, recipient need to set {@link ChatOptions.requireDeliveryAck} to `true` during the SDK initialization. Delivery receipts are unavailable for group messages.
     *
     * - `true`: Yes.
     * - (Default) `false`: No.
     */
    hasDeliverAck: boolean;
    /**
     * Whether the the read receipt from the recipient is received by the sender during a one-to-one chat. Upon reading the message, the recipient calls the {@link ChatManager.sendMessageReadAck} or `{@link ChatManager.sendConversationReadAck}` method to send a read receipt to the sender. If read receipts are required, you need to set {@link ChatOptions.requireAck} to `true` during the SDK initialization.
     *
     * - `true`: Yes.
     * - (Default) `false`: No.
     */
    hasReadAck: boolean;
    /**
     * Whether read receipts are required for a group message.
     *
     * - `true`: Yes.
     * - (Default) `false`: No.
     */
    needGroupAck: boolean;
    /**
     * The number of group members that have read a message. Upon reading a message, members in the group call {@link ChatManager.sendGroupMessageReadAck} or {@link ChatManager.sendConversationReadAck} to send a read receipt for a message or a conversation. To enable the read receipt function for group messages, you need to set {@link ChatOptions.requireAck} to `true` during SDK initialization and set {@link isNeedGroupAck} to `true` when sending a message.
     */
    groupAckCount: number;
    /**
     * Whether the the message is read by the recipient during a one-to-one chat or group chat. This parameter setting has connection with the number of unread messages in a conversation. Upon reading the message, the recipient calls  {@link ChatManager.markMessageAsRead} to mark a message read or {@link ChatManager.markAllMessagesAsRead}  to mark all unread messages in the conversation read.
     *
     * - `true`: Yes.
     * - (Default) `false`: No.
     */
    hasRead: boolean;
    /**
     * The conversation type. See {@link ChatType}.
     */
    chatType: ChatMessageChatType;
    /**
     * The message direction. See {@link ChatMessageDirection}.
     */
    direction: ChatMessageDirection;
    /**
     * The message sending status. See {@link ChatMessageStatus}.
     */
    status: ChatMessageStatus;
    /**
     * The extension attribute of the message.
     *
     * Value can be an object, string, string json, numerical value, undefined, null, etc.
     *
     * **Note** Symbol and function types are not supported.
     */
    attributes: Record<string, any>;
    /**
     * The message body. See {@link ChatMessageBody}.
     */
    body: ChatMessageBody;
    /**
     * Whether it is a message in a message thread.
     *
     * - `true`: Yes. In this case, you need to set the user ID of the message recipient to the message thread ID. See {@link to}.
     * - `false`: No.
     *
     * **Note**
  
     * This parameter is valid only for group chat.
     */
    isChatThread: boolean;
    /**
     * Whether it is a online message.
     *
     * - `true`: Yes. In this case, if the application is running in the background, a notification window may pop up.
     * - `false`: No.
     */
    isOnline: boolean;
    /**
     * The delivery priorities of chat room messages.
     * **Note** Only for chat rooms.
     */
    private priority?;
    /**
     * Whether the message is delivered only when the recipient(s) is/are online:
     * - `true`：The message is delivered only when the recipient(s) is/are online. If the recipient is offline, the message is discarded.
     * - (Default) `false`：The message is delivered when the recipient(s) is/are online. If the recipient(s) is/are offline, the message will not be delivered to them until they get online.
     */
    deliverOnlineOnly: boolean;
    /**
     * The recipient list of a targeted message.
     *
     * The default value is `undefined`, indicating that the message is sent to all members in the group or chat room.
     *
     * This property is used only for messages in groups and chat rooms.
     */
    receiverList?: string[];
    /**
     * Whether it is a global broadcast message.
     */
    isBroadcast: boolean;
    /**
     * Whether the message content is replaced.
     *
     * It is valid after `ChatOptions.useReplacedMessageContents` is enabled.
     */
    isContentReplaced: boolean;
    /**
     * Constructs a message.
     */
    constructor(params: {
        msgId?: string;
        localMsgId?: string;
        conversationId?: string;
        from?: string;
        to?: string;
        localTime?: number;
        serverTime?: number;
        hasDeliverAck?: boolean;
        hasReadAck?: boolean;
        needGroupAck?: boolean;
        groupAckCount?: number;
        hasRead?: boolean;
        chatType?: number;
        direction?: string;
        status?: number;
        attributes?: any;
        body: any;
        isChatThread?: boolean;
        isOnline?: boolean;
        deliverOnlineOnly?: boolean;
        receiverList?: string[];
        isBroadcast?: boolean;
        isContentReplaced?: boolean;
    });
    private fromAttributes;
    private static getBody;
    static createSendMessage(params: {
        body: ChatMessageBody;
        targetId: string;
        chatType: ChatMessageChatType;
        isChatThread?: boolean;
        isOnline?: boolean;
        deliverOnlineOnly?: boolean;
        receiverList?: string[];
    }): ChatMessage;
    /**
     * Creates a text message for sending.
     *
     * @param targetId The user ID of the message recipient.
     * - For a one-to-one chat, it is the user ID of the peer user.
     * - For a group chat, it is the group ID.
     * - For a chat room, it is the chat room ID.
     * @param content The text content.
     * @param chatType The conversation type. See {@link ChatType}.
     * @params opt The extension parameters of the message.
     *  - targetLanguageCodes: The language code. See {@link ChatTextMessageBody.targetLanguageCodes}.
     *  -  isChatThread: Whether this message is a threaded message.
     *   - `true`: Yes.
     *   - (Default) `false`: No.
     * - isOnline: Whether it is a online message.
     * - deliverOnlineOnly: Whether the message is delivered only when the recipient(s) is/are online.
     * - receiverList: The recipient list of a targeted message.
     * @returns The message instance.
     */
    static createTextMessage(targetId: string, content: string, chatType?: ChatMessageChatType, opt?: {
        isChatThread?: boolean;
        targetLanguageCodes?: Array<string>;
        isOnline?: boolean;
        deliverOnlineOnly?: boolean;
        receiverList?: string[];
    }): ChatMessage;
    /**
     * Creates a message with a file attachment for sending.
     *
     * @param targetId The user ID of the message recipient.
     * - For a one-to-one chat, it is the user ID of the peer user.
     * - For a group chat, it is the group ID.
     * - For a chat room, it is the chat room ID.
     * @param filePath The file path.
     * @param chatType The conversation type. See {@link ChatType}.
     * @params opt The extension parameters of the message.
     * - displayName: The file name.
     * - isChatThread: Whether this message is a threaded message.
     *   - `true`: Yes.
     *   - (Default) `false`: No.
     * - isOnline: Whether it is a online message.
     * - deliverOnlineOnly: Whether the message is delivered only when the recipient(s) is/are online.
     * - fileSize: The file size.
     * - receiverList: The recipient list of a targeted message.
     * @returns The message instance.
     */
    static createFileMessage(targetId: string, filePath: string, chatType?: ChatMessageChatType, opt?: {
        displayName: string;
        isChatThread?: boolean;
        fileSize?: number;
        isOnline?: boolean;
        deliverOnlineOnly?: boolean;
        receiverList?: string[];
    }): ChatMessage;
    /**
     * Creates an image message for sending.
     *
     * @param targetId The user ID of the message recipient.
     * - For a one-to-one chat, it is the user ID of the peer user.
     * - For a group chat, it is the group ID.
     * - For a chat room, it is the chat room ID.
     * @param filePath The image path.
     * @param chatType The conversation type. See {@link ChatType}.
     * @params opt The extension parameters of the message.
     * - displayName: The image name.
     * - thumbnailLocalPath: The image thumbnail path.
     * - sendOriginalImage: Whether to send the original image.
     *   - `true`: Yes.
     *   - (Default) `false`: If the image is equal to or greater than 100 KB, the SDK will compress it before sending the compressed image.
     * - width: The image width in pixels.
     * - height: The image height in pixels.
     * - isChatThread: Whether this message is a threaded message.
     *   - `true`: Yes.
     *   - (Default) `false`: No.
     * - isOnline: Whether it is a online message.
     * - deliverOnlineOnly: Whether the message is delivered only when the recipient(s) is/are online.
     * - fileSize: The file size.
     * - receiverList: The recipient list of a targeted message.
     * @returns The message instance.
     */
    static createImageMessage(targetId: string, filePath: string, chatType?: ChatMessageChatType, opt?: {
        displayName: string;
        thumbnailLocalPath?: string;
        sendOriginalImage?: boolean;
        width: number;
        height: number;
        isChatThread?: boolean;
        fileSize?: number;
        isOnline?: boolean;
        deliverOnlineOnly?: boolean;
        receiverList?: string[];
    }): ChatMessage;
    /**
     * Creates a video message for sending.
     *
     * @param targetId The user ID of the message recipient.
     * - For a one-to-one chat, it is the user ID of the peer user.
     * - For a group chat, it is the group ID.
     * - For a chat room, it is the chat room ID.
     * @param filePath The path of the video file.
     * @param chatType The conversation type. See {@link ChatType}.
     * @params opt The extension parameters of the message.
     * - displayName: The video file name.
     * - thumbnailLocalPath: The path of the thumbnail of the first frame of video.
     * - duration: The video duration in seconds.
     * - width: The video thumbnail width in pixels.
     * - height: The video thumbnail height in pixels.
     * - isChatThread: Whether this message is a threaded message.
     *   - `true`: Yes.
     *   - (Default) `false`: No.
     * - isOnline: Whether it is a online message.
     * - deliverOnlineOnly: Whether the message is delivered only when the recipient(s) is/are online.
     * - fileSize: The file size.
     * - receiverList: The recipient list of a targeted message.
     * @returns The message instance.
     */
    static createVideoMessage(targetId: string, filePath: string, chatType?: ChatMessageChatType, opt?: {
        displayName: string;
        thumbnailLocalPath: string;
        duration: number;
        width: number;
        height: number;
        isChatThread?: boolean;
        fileSize?: number;
        isOnline?: boolean;
        deliverOnlineOnly?: boolean;
        receiverList?: string[];
    }): ChatMessage;
    /**
     * Creates a voice message for sending.
     *
     * @param targetId The user ID of the message recipient.
     * - For a one-to-one chat, it is the user ID of the peer user.
     * - For a group chat, it is the group ID.
     * - For a chat room, it is the chat room ID.
     * @param filePath The path of the voice file.
     * @param chatType The conversation type. See {@link ChatType}.
     * @params opt The extension parameters of the message.
     * - displayName: The voice file name.
     * - duration: The voice duration in seconds.
     * - isChatThread: Whether this message is a threaded message.
     *   - `true`: Yes.
     *   - (Default) `false`: No.
     * - isOnline: Whether it is a online message.
     * - deliverOnlineOnly: Whether the message is delivered only when the recipient(s) is/are online.
     * - fileSize: The file size.
     * - receiverList: The recipient list of a targeted message.
     * @returns The message instance.
     */
    static createVoiceMessage(targetId: string, filePath: string, chatType?: ChatMessageChatType, opt?: {
        displayName?: string;
        duration: number;
        isChatThread?: boolean;
        fileSize?: number;
        isOnline?: boolean;
        deliverOnlineOnly?: boolean;
        receiverList?: string[];
    }): ChatMessage;
    /**
     * Creates a combined message for sending.
     *
     * @param targetId The message recipient. The field setting is determined by the conversation type:
     * - For a one-to-one chat, it is the user ID of the peer user.
     * - For a group chat, it is the group ID.
     * - For a chat room, it is the chat room ID.
     * @param messageIdList A collection of message IDs. The list cannot be empty. It can contain a maximum of 300 message IDs.
     * @param chatType The conversation type. See {@link ChatType}.
     * @params opt The extension parameters of the message.
     * - title: The title of the combined message.
     * - summary: The summary of the combined message.
     * - compatibleText: The compatible text of the combined message. This field is used for compatibility with SDK versions that do not support combined messages.
     * - isChatThread: Whether this message is a threaded message.
     *   - `true`: Yes.
     *   - (Default) `false`：No.
     * - isOnline: Whether it is a online message.
     *   - `true`: Yes.
     *   - `false`：No.
     * - deliverOnlineOnly: Whether the message is delivered only when the recipient(s) is/are online:
     *   - `true`: - `true`：The message is delivered only when the recipient(s) is/are online. If the recipient is offline, the message is discarded.
     *   - (Default) `false`：The message is delivered when the recipient(s) is/are online. If the recipient(s) is/are offline, the message will not be delivered to them until they get online.
     * - receiverList: The recipient list of a targeted message.
     * @returns The message instance.
     */
    static createCombineMessage(targetId: string, messageIdList: string[], chatType?: ChatMessageChatType, opt?: {
        title?: string;
        summary?: string;
        compatibleText?: string;
        isChatThread?: boolean;
        isOnline?: boolean;
        deliverOnlineOnly?: boolean;
        receiverList?: string[];
    }): ChatMessage;
    /**
     * Creates a location message for sending.
     *
     * @param targetId The user ID of the message recipient.
     * - For a one-to-one chat, it is the user ID of the peer user.
     * - For a group chat, it is the group ID.
     * - For a chat room, it is the chat room ID.
     * @param latitude The latitude.
     * @param longitude The longitude.
     * @param chatType The conversation type. See {@link ChatType}.
     * @params opt The extension parameters of the message.
     * - address: The location details.
     * - isChatThread: Whether this message is a threaded message.
     *   - `true`: Yes.
     *   - (Default) `false`: No.
     * - receiverList: The recipient list of a targeted message.
     * @returns The message instance.
     */
    static createLocationMessage(targetId: string, latitude: string, longitude: string, chatType?: ChatMessageChatType, opt?: {
        address: string;
        isChatThread?: boolean;
        isOnline?: boolean;
        deliverOnlineOnly?: boolean;
        receiverList?: string[];
    }): ChatMessage;
    /**
     * Creates a command message for sending.
     *
     * @param targetId The user ID of the message recipient.
     * - For a one-to-one chat, it is the user ID of the peer user.
     * - For a group chat, it is the group ID.
     * - For a chat room, it is the chat room ID.
     * @param action The command action.
     * @param chatType The conversation type. See {@link ChatType}.
     * @params opt The extension parameters of the message.
     * - isChatThread: Whether this message is a threaded message.
     *   - `true`: Yes.
     *   - (Default) `false`: No.
     * - deliverOnlineOnly: Whether this command message is delivered only to the online users.
     *   - (Default) `true`: Yes.
     *   - `false`: No. The command message is delivered to users, regardless of their online or offline status.
     * - receiverList: The recipient list of a targeted message.
     * @returns The message instance.
     */
    static createCmdMessage(targetId: string, action: string, chatType?: ChatMessageChatType, opt?: {
        isChatThread?: boolean;
        isOnline?: boolean;
        deliverOnlineOnly?: boolean;
        receiverList?: string[];
    }): ChatMessage;
    /**
     * Creates a custom message for sending.
     *
     * @param targetId The user ID of the message recipient.
     * - For a one-to-one chat, it is the user ID of the peer user.
     * - For a group chat, it is the group ID.
     * - For a chat room, it is the chat room ID.
     * @param event The custom event.
     * @param chatType The conversation type. See {@link ChatType}.
     * @params opt The extension parameters of the message.
     * - params: The dictionary of custom parameters.
     * - isChatThread: Whether this message is a threaded message.
     *   - `true`: Yes.
     *   - (Default) `false`: No.
     * - receiverList: The recipient list of a targeted message.
     * @returns The message instance.
     */
    static createCustomMessage(targetId: string, event: string, chatType?: ChatMessageChatType, opt?: {
        params: Record<string, string>;
        isChatThread?: boolean;
        isOnline?: boolean;
        deliverOnlineOnly?: boolean;
        receiverList?: string[];
    }): ChatMessage;
    /**
     * Creates a received message instance.
     *
     * @param params The received message.
     * @returns The message object.
     */
    static createReceiveMessage(params: any): ChatMessage;
    /**
     * Gets the list of Reactions.
     */
    get reactionList(): Promise<Array<ChatMessageReaction>>;
    /**
     * Gets the count of read receipts of a group message.
     */
    get groupReadCount(): Promise<number | undefined>;
    /**
     * Gets details of a message thread.
     */
    get threadInfo(): Promise<ChatMessageThread | undefined>;
    /**
     * Get the list of pinned messages in the conversation.
     */
    get getPinInfo(): Promise<ChatMessagePinInfo | undefined>;
    /**
     * Set the chat room message priority.
     */
    set messagePriority(p: ChatRoomMessagePriority);
}
/**
 * The message body base class.
 */
export declare abstract class ChatMessageBody {
    /**
     * The message type. See {@link ChatMessageType}.
     */
    readonly type: ChatMessageType;
    /**
     * The user ID of the operator that modified the message last time.
     */
    lastModifyOperatorId?: string;
    /**
     * The UNIX timestamp of the last message modification, in milliseconds.
     */
    lastModifyTime?: number;
    /**
     * The number of times a message is modified.
     */
    modifyCount?: number;
    protected constructor(type: ChatMessageType, opt?: {
        lastModifyOperatorId?: string;
        lastModifyTime?: number;
        modifyCount?: number;
    });
}
/**
 * The text message body class.
 */
export declare class ChatTextMessageBody extends ChatMessageBody {
    /**
     * The text message content.
     */
    content: string;
    /**
     * The target language for translation. See {@link https://docs.microsoft.com/en-us/azure/cognitive-services/translator/language-support}.
     */
    targetLanguageCodes?: Array<string>;
    /**
     * The translation.
     *
     * It is a KV object, where the key is the target language and the value is the translation.
     */
    translations?: any;
    constructor(params: {
        content: string;
        targetLanguageCodes?: Array<string>;
        translations?: any;
        lastModifyOperatorId?: string;
        lastModifyTime?: number;
        modifyCount?: number;
    });
}
/**
 * The location message body class.
 */
export declare class ChatLocationMessageBody extends ChatMessageBody {
    /**
     * The address.
     */
    address: string;
    /**
     * The latitude.
     */
    latitude: string;
    /**
     * The longitude.
     */
    longitude: string;
    constructor(params: {
        address: string;
        latitude: string;
        longitude: string;
        lastModifyOperatorId?: string;
        lastModifyTime?: number;
        modifyCount?: number;
    });
}
/**
 * The file message body class for internal.
 */
declare abstract class _ChatFileMessageBody extends ChatMessageBody {
    /**
     * The local path of the file.
     */
    localPath: string;
    /**
     * The token to download the file attachment.
     */
    secret: string;
    /**
     * The path of the attachment file in the server.
     */
    remotePath: string;
    /**
     * The download status of the attachment file. See {@link ChatDownloadStatus}.
     */
    fileStatus: ChatDownloadStatus;
    /**
     * The size of the file in bytes.
     */
    fileSize: number;
    /**
     * The file name.
     */
    displayName: string;
    protected constructor(params: {
        type: ChatMessageType;
        localPath: string;
        secret?: string;
        remotePath?: string;
        fileStatus?: number;
        fileSize?: number;
        displayName?: string;
        lastModifyOperatorId?: string;
        lastModifyTime?: number;
        modifyCount?: number;
    });
}
/**
 * The file message body class.
 */
export declare class ChatFileMessageBody extends _ChatFileMessageBody {
    constructor(params: {
        localPath: string;
        secret?: string;
        remotePath?: string;
        fileStatus?: number;
        fileSize?: number;
        displayName?: string;
        lastModifyOperatorId?: string;
        lastModifyTime?: number;
        modifyCount?: number;
    });
}
/**
 * The image message body class.
 */
export declare class ChatImageMessageBody extends _ChatFileMessageBody {
    /**
     Whether to send the original image.
    * - `true`: Yes.
    * - (Default) `false`: No. If the image is smaller than 100 KB, the SDK sends the original image. If the image is equal to or greater than 100 KB, the SDK will compress it before sending the compressed image.
     */
    sendOriginalImage: boolean;
    /**
     * The local path or the URI of the thumbnail as a string.
     */
    thumbnailLocalPath: string;
    /**
     * The URL of the thumbnail on the server.
     */
    thumbnailRemotePath: string;
    /**
     * The secret to access the thumbnail. A secret is required for verification for thumbnail download.
     */
    thumbnailSecret: string;
    /**
     * The download status of the thumbnail. See {@link ChatDownloadStatus}
     */
    thumbnailStatus: ChatDownloadStatus;
    /**
     * The image width in pixels.
     */
    width: number;
    /**
     * The image height in pixels.
     */
    height: number;
    constructor(params: {
        localPath: string;
        secret?: string;
        remotePath?: string;
        fileStatus?: number;
        fileSize?: number;
        displayName: string;
        sendOriginalImage?: boolean;
        thumbnailLocalPath?: string;
        thumbnailRemotePath?: string;
        thumbnailSecret?: string;
        thumbnailStatus?: number;
        width?: number;
        height?: number;
        lastModifyOperatorId?: string;
        lastModifyTime?: number;
        modifyCount?: number;
    });
}
/**
 * The video message body class.
 */
export declare class ChatVideoMessageBody extends _ChatFileMessageBody {
    /**
     * The video duration in seconds.
     */
    duration: number;
    /**
     * The local path of the video thumbnail.
     */
    thumbnailLocalPath: string;
    /**
     * The URL of the thumbnail on the server.
     */
    thumbnailRemotePath: string;
    /**
     * The secret to download the video thumbnail.
     */
    thumbnailSecret: string;
    /**
     * The download status of the video thumbnail. See {@link ChatDownloadStatus}
     */
    thumbnailStatus: ChatDownloadStatus;
    /**
     * The video width in pixels.
     */
    width: number;
    /**
     * The video height in pixels.
     */
    height: number;
    constructor(params: {
        localPath: string;
        secret?: string;
        remotePath?: string;
        fileStatus?: number;
        fileSize?: number;
        displayName: string;
        duration?: number;
        thumbnailLocalPath?: string;
        thumbnailRemotePath?: string;
        thumbnailSecret?: string;
        thumbnailStatus?: ChatDownloadStatus;
        width?: number;
        height?: number;
        lastModifyOperatorId?: string;
        lastModifyTime?: number;
        modifyCount?: number;
    });
}
/**
 * The voice message body.
 */
export declare class ChatVoiceMessageBody extends _ChatFileMessageBody {
    /**
     * The voice duration in seconds.
     */
    duration: number;
    constructor(params: {
        localPath: string;
        secret?: string;
        remotePath?: string;
        fileStatus?: number;
        fileSize?: number;
        displayName: string;
        duration?: number;
        lastModifyOperatorId?: string;
        lastModifyTime?: number;
        modifyCount?: number;
    });
}
/**
 * The command message body.
 */
export declare class ChatCmdMessageBody extends ChatMessageBody {
    /**
     * The command action.
     */
    action: string;
    constructor(params: {
        action: string;
        lastModifyOperatorId?: string;
        lastModifyTime?: number;
        modifyCount?: number;
    });
}
/**
 * The custom message body.
 */
export declare class ChatCustomMessageBody extends ChatMessageBody {
    /**
     * The event.
     */
    event: string;
    /**
     * The custom params map.
     */
    params?: Record<string, string>;
    constructor(params: {
        event: string;
        params?: Record<string, string>;
        lastModifyOperatorId?: string;
        lastModifyTime?: number;
        modifyCount?: number;
    });
}
/**
 * The combined message body.
 */
export declare class ChatCombineMessageBody extends _ChatFileMessageBody {
    /**
     * The title of the combined message.
     */
    title?: string;
    /**
     * The summary of the combined message.
     */
    summary?: string;
    /**
     * The list of IDs of original messages in the combined message.
     *
     * **note** This attribute is used only when you create a combined message.
     */
    messageIdList?: string[];
    /**
     * The compatible text of the combined message.
     */
    compatibleText?: string;
    constructor(params: {
        localPath: string;
        secret?: string;
        remotePath?: string;
        fileStatus?: number;
        fileSize?: number;
        displayName?: string;
        title?: string;
        summary?: string;
        messageIdList?: string[];
        compatibleText?: string;
        lastModifyOperatorId?: string;
        lastModifyTime?: number;
        modifyCount?: number;
    });
}
/**
 * The pinning or unpinning information of the message.
 */
export declare class ChatMessagePinInfo {
    /**
     * The time when the message is pinned or unpinned.
     */
    pinTime: number;
    /**
     * The user ID of the operator that pins or unpins the message.
     */
    operatorId: string;
    constructor(params: {
        pinTime: number;
        operatorId: string;
    });
}
/**
 * The parameter configuration class for pulling historical messages from the server.
 */
export declare class ChatFetchMessageOptions {
    /**
     * The user ID of the message sender in the group conversation.
     */
    from?: string;
    /**
     * The array of message types for query. The default value is `undefined`, indicating that all types of messages are retrieved.
     */
    msgTypes?: ChatMessageType[];
    /**
     * The start time for message query. The time is a UNIX time stamp in milliseconds. The default value is -1,indicating that this parameter is ignored during message query.If the [startTs] is set to a specific time spot and the [endTs] uses the default value -1,the SDK returns messages that are sent and received in the period that is from the start time to the current time.If the [startTs] uses the default value -1 and the [endTs] is set to a specific time spot,the SDK returns messages that are sent and received in the period that is from the timestamp of the first message to the current time.
     */
    startTs: number;
    /**
     * The end time for message query. The time is a UNIX time stamp in milliseconds.
     */
    endTs: number;
    /**
     * The message search direction, Default is {@link ChatSearchDirection.UP}.
     */
    direction: ChatSearchDirection;
    /**
     * Whether to save the retrieved messages to the database:
     * - `true`: save to database;
     * - `false`(Default)：no save to database.
     */
    needSave: boolean;
    constructor(params: {
        from?: string;
        msgTypes?: ChatMessageType[];
        startTs: number;
        endTs: number;
        direction: ChatSearchDirection;
        needSave: boolean;
    });
}
export {};
//# sourceMappingURL=ChatMessage.d.ts.map
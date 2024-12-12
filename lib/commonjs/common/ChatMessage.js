"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ChatDownloadStatus = exports.ChatCustomMessageBody = exports.ChatCombineMessageBody = exports.ChatCmdMessageBody = void 0;
exports.ChatDownloadStatusFromNumber = ChatDownloadStatusFromNumber;
exports.ChatDownloadStatusToString = ChatDownloadStatusToString;
exports.ChatMessageChatType = exports.ChatMessageBody = exports.ChatMessage = exports.ChatLocationMessageBody = exports.ChatImageMessageBody = exports.ChatFileMessageBody = exports.ChatFetchMessageOptions = void 0;
exports.ChatMessageChatTypeFromNumber = ChatMessageChatTypeFromNumber;
exports.ChatMessageDirection = void 0;
exports.ChatMessageDirectionFromString = ChatMessageDirectionFromString;
exports.ChatMessageStatus = exports.ChatMessageSearchScope = exports.ChatMessagePinOperation = exports.ChatMessagePinInfo = void 0;
exports.ChatMessageStatusFromNumber = ChatMessageStatusFromNumber;
exports.ChatMessageStatusToString = ChatMessageStatusToString;
exports.ChatMessageType = void 0;
exports.ChatMessageTypeFromString = ChatMessageTypeFromString;
exports.ChatVoiceMessageBody = exports.ChatVideoMessageBody = exports.ChatTextMessageBody = exports.ChatRoomMessagePriority = void 0;
var _ErrorHandler = require("../__internal__/ErrorHandler");
var _Utils = require("../__internal__/Utils");
var _ChatClient = require("../ChatClient");
var _ChatError = require("./ChatError");
/**
 * The conversation types.
 */
let ChatMessageChatType = /*#__PURE__*/function (ChatMessageChatType) {
  ChatMessageChatType[ChatMessageChatType["PeerChat"] = 0] = "PeerChat";
  ChatMessageChatType[ChatMessageChatType["GroupChat"] = 1] = "GroupChat";
  ChatMessageChatType[ChatMessageChatType["ChatRoom"] = 2] = "ChatRoom";
  return ChatMessageChatType;
}({});
/**
 * The message directions.
 */
exports.ChatMessageChatType = ChatMessageChatType;
let ChatMessageDirection = /*#__PURE__*/function (ChatMessageDirection) {
  ChatMessageDirection["SEND"] = "send";
  ChatMessageDirection["RECEIVE"] = "rec";
  return ChatMessageDirection;
}({});
/**
 * The message sending states.
 */
exports.ChatMessageDirection = ChatMessageDirection;
let ChatMessageStatus = /*#__PURE__*/function (ChatMessageStatus) {
  ChatMessageStatus[ChatMessageStatus["CREATE"] = 0] = "CREATE";
  ChatMessageStatus[ChatMessageStatus["PROGRESS"] = 1] = "PROGRESS";
  ChatMessageStatus[ChatMessageStatus["SUCCESS"] = 2] = "SUCCESS";
  ChatMessageStatus[ChatMessageStatus["FAIL"] = 3] = "FAIL";
  return ChatMessageStatus;
}({});
/**
 * The attachment file download states.
 */
exports.ChatMessageStatus = ChatMessageStatus;
let ChatDownloadStatus = /*#__PURE__*/function (ChatDownloadStatus) {
  ChatDownloadStatus[ChatDownloadStatus["PENDING"] = -1] = "PENDING";
  ChatDownloadStatus[ChatDownloadStatus["DOWNLOADING"] = 0] = "DOWNLOADING";
  ChatDownloadStatus[ChatDownloadStatus["SUCCESS"] = 1] = "SUCCESS";
  ChatDownloadStatus[ChatDownloadStatus["FAILED"] = 2] = "FAILED";
  return ChatDownloadStatus;
}({});
/**
 * The message types.
 */
exports.ChatDownloadStatus = ChatDownloadStatus;
let ChatMessageType = /*#__PURE__*/function (ChatMessageType) {
  ChatMessageType["TXT"] = "txt";
  ChatMessageType["IMAGE"] = "img";
  ChatMessageType["VIDEO"] = "video";
  ChatMessageType["LOCATION"] = "loc";
  ChatMessageType["VOICE"] = "voice";
  ChatMessageType["FILE"] = "file";
  ChatMessageType["CMD"] = "cmd";
  ChatMessageType["CUSTOM"] = "custom";
  ChatMessageType["COMBINE"] = "combine";
  return ChatMessageType;
}({});
/**
 * The priorities of chat room messages.
 */
exports.ChatMessageType = ChatMessageType;
let ChatRoomMessagePriority = /*#__PURE__*/function (ChatRoomMessagePriority) {
  ChatRoomMessagePriority[ChatRoomMessagePriority["PriorityHigh"] = 0] = "PriorityHigh";
  ChatRoomMessagePriority[ChatRoomMessagePriority["PriorityNormal"] = 1] = "PriorityNormal";
  ChatRoomMessagePriority[ChatRoomMessagePriority["PriorityLow"] = 2] = "PriorityLow";
  return ChatRoomMessagePriority;
}({});
/**
 * The message pinning and unpinning operations.
 */
exports.ChatRoomMessagePriority = ChatRoomMessagePriority;
let ChatMessagePinOperation = /*#__PURE__*/function (ChatMessagePinOperation) {
  ChatMessagePinOperation[ChatMessagePinOperation["Pin"] = 0] = "Pin";
  ChatMessagePinOperation[ChatMessagePinOperation["Unpin"] = 1] = "Unpin";
  return ChatMessagePinOperation;
}({});
/**
 * The message search scope.
 */
exports.ChatMessagePinOperation = ChatMessagePinOperation;
let ChatMessageSearchScope = /*#__PURE__*/function (ChatMessageSearchScope) {
  ChatMessageSearchScope[ChatMessageSearchScope["Content"] = 0] = "Content";
  ChatMessageSearchScope[ChatMessageSearchScope["Attribute"] = 1] = "Attribute";
  ChatMessageSearchScope[ChatMessageSearchScope["All"] = 2] = "All";
  return ChatMessageSearchScope;
}({});
/**
 * Converts the conversation type from int to string.
 *
 * @param params The conversation type of the int type.
 * @returns The conversation type of the string type.
 */
exports.ChatMessageSearchScope = ChatMessageSearchScope;
function ChatMessageChatTypeFromNumber(params) {
  switch (params) {
    case 2:
      return ChatMessageChatType.ChatRoom;
    case 1:
      return ChatMessageChatType.GroupChat;
    default:
      return ChatMessageChatType.PeerChat;
  }
}

/**
 * Converts the message direction from string to enum.
 *
 * @param params The message direction of the string type.
 * @returns The message direction of the enum type.
 */
function ChatMessageDirectionFromString(params) {
  switch (params) {
    case 'send':
      return ChatMessageDirection.SEND;
    default:
      return ChatMessageDirection.RECEIVE;
  }
}

/**
 * Converts the message status from int to enum.
 *
 * @param params The message status of the int type.
 * @returns The message status of the enum type.
 */
function ChatMessageStatusFromNumber(params) {
  switch (params) {
    case 3:
      return ChatMessageStatus.FAIL;
    case 2:
      return ChatMessageStatus.SUCCESS;
    case 1:
      return ChatMessageStatus.PROGRESS;
    default:
      return ChatMessageStatus.CREATE;
  }
}

/**
 * Converts the message status from enum to string.
 *
 * @param params The message status of the enum type.
 * @returns The message status of the string type.
 */
function ChatMessageStatusToString(params) {
  return ChatMessageStatus[params];
}

/**
 * Converts the message download status from int to string.
 *
 * @param params The message download status of the int type.
 * @returns The message download status of the string type.
 */
function ChatDownloadStatusFromNumber(params) {
  switch (params) {
    case 0:
      return ChatDownloadStatus.DOWNLOADING;
    case 1:
      return ChatDownloadStatus.SUCCESS;
    case 2:
      return ChatDownloadStatus.FAILED;
    default:
      return ChatDownloadStatus.PENDING;
  }
}

/**
 * Converts the message download status from int to string.
 *
 * @param params The message download status of the int type.
 * @returns The message download status of the string type.
 */
function ChatDownloadStatusToString(params) {
  return ChatDownloadStatus[params];
}

/**
 * Converts the message type from string to enum.
 *
 * @param params The message type of the string type.
 * @returns The message type of the enum type.
 */
function ChatMessageTypeFromString(params) {
  switch (params) {
    case 'txt':
      return ChatMessageType.TXT;
    case 'loc':
      return ChatMessageType.LOCATION;
    case 'cmd':
      return ChatMessageType.CMD;
    case 'custom':
      return ChatMessageType.CUSTOM;
    case 'file':
      return ChatMessageType.FILE;
    case 'img':
      return ChatMessageType.IMAGE;
    case 'video':
      return ChatMessageType.VIDEO;
    case 'voice':
      return ChatMessageType.VOICE;
    case 'combine':
      return ChatMessageType.COMBINE;
    default:
      const ret = 'unknown';
      _ErrorHandler.ExceptionHandler.getInstance().sendExcept({
        except: new _ChatError.ChatException({
          code: 1,
          description: `This type is not supported. ` + params
        }),
        from: 'ChatMessageTypeFromString'
      });
      return ret;
  }
}

/**
 * The message status change listener.
 */

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
class ChatMessage {
  static TAG = 'ChatMessage';
  /**
   * The message ID generated on the server.
   */
  msgId = (0, _Utils.generateMessageId)();
  /**
   * The local message ID.
   */
  localMsgId = '';
  /**
   * The conversation ID.
   */
  conversationId = '';
  /**
   * The user ID of the message sender.
   */
  from = '';
  /**
   * The user ID of the message recipient:
   *
   * - For the one-to-one chat, it is the user ID of the message recipient;
   * - For the group chat, it is the group ID;
   * - For the chat room chat, it is the chat room ID;
   * - For a message thread, it is the ID of the message thread.
   */
  to = '';
  /**
   * The Unix timestamp when the message is created locally. The unit is millisecond.
   */
  localTime = (0, _Utils.getNowTimestamp)();
  /**
   * The Unix timestamp when the server receives the message. The unit is millisecond.
   */
  serverTime = (0, _Utils.getNowTimestamp)();
  /**
   * Whether messages have arrived at the recipient during a one-to-one chat. If delivery receipts are required, recipient need to set {@link ChatOptions.requireDeliveryAck} to `true` during the SDK initialization. Delivery receipts are unavailable for group messages.
   *
   * - `true`: Yes.
   * - (Default) `false`: No.
   */
  hasDeliverAck = false;
  /**
   * Whether the the read receipt from the recipient is received by the sender during a one-to-one chat. Upon reading the message, the recipient calls the {@link ChatManager.sendMessageReadAck} or `{@link ChatManager.sendConversationReadAck}` method to send a read receipt to the sender. If read receipts are required, you need to set {@link ChatOptions.requireAck} to `true` during the SDK initialization.
   *
   * - `true`: Yes.
   * - (Default) `false`: No.
   */
  hasReadAck = false;
  /**
   * Whether read receipts are required for a group message.
   *
   * - `true`: Yes.
   * - (Default) `false`: No.
   */
  needGroupAck = false;
  /**
   * The number of group members that have read a message. Upon reading a message, members in the group call {@link ChatManager.sendGroupMessageReadAck} or {@link ChatManager.sendConversationReadAck} to send a read receipt for a message or a conversation. To enable the read receipt function for group messages, you need to set {@link ChatOptions.requireAck} to `true` during SDK initialization and set {@link isNeedGroupAck} to `true` when sending a message.
   */
  groupAckCount = 0;
  /**
   * Whether the the message is read by the recipient during a one-to-one chat or group chat. This parameter setting has connection with the number of unread messages in a conversation. Upon reading the message, the recipient calls  {@link ChatManager.markMessageAsRead} to mark a message read or {@link ChatManager.markAllMessagesAsRead}  to mark all unread messages in the conversation read.
   *
   * - `true`: Yes.
   * - (Default) `false`: No.
   */
  hasRead = false;
  /**
   * The conversation type. See {@link ChatType}.
   */

  /**
   * The message direction. See {@link ChatMessageDirection}.
   */

  /**
   * The message sending status. See {@link ChatMessageStatus}.
   */
  status = ChatMessageStatus.CREATE;
  /**
   * The extension attribute of the message.
   *
   * Value can be an object, string, string json, numerical value, undefined, null, etc.
   *
   * **Note** Symbol and function types are not supported.
   */

  /**
   * The message body. See {@link ChatMessageBody}.
   */

  /**
   * Whether it is a message in a message thread.
   * 
   * - `true`: Yes. In this case, you need to set the user ID of the message recipient to the message thread ID. See {@link to}.
   * - `false`: No.
   *
   * **Note**
    * This parameter is valid only for group chat.
   */

  /**
   * Whether it is a online message.
   *
   * - `true`: Yes. In this case, if the application is running in the background, a notification window may pop up.
   * - `false`: No.
   */

  /**
   * The delivery priorities of chat room messages.
   * **Note** Only for chat rooms.
   */

  /**
   * Whether the message is delivered only when the recipient(s) is/are online:
   * - `true`：The message is delivered only when the recipient(s) is/are online. If the recipient is offline, the message is discarded.
   * - (Default) `false`：The message is delivered when the recipient(s) is/are online. If the recipient(s) is/are offline, the message will not be delivered to them until they get online.
   */

  /**
   * The recipient list of a targeted message.
   *
   * The default value is `undefined`, indicating that the message is sent to all members in the group or chat room.
   *
   * This property is used only for messages in groups and chat rooms.
   */

  /**
   * Whether it is a global broadcast message.
   */

  /**
   * Whether the message content is replaced.
   *
   * It is valid after `ChatOptions.useReplacedMessageContents` is enabled.
   */

  /**
   * Constructs a message.
   */
  constructor(params) {
    this.msgId = params.msgId ?? (0, _Utils.generateMessageId)();
    this.conversationId = params.conversationId ?? '';
    this.from = params.from ?? '';
    this.to = params.to ?? '';
    this.localTime = params.localTime ?? (0, _Utils.getNowTimestamp)();
    this.serverTime = params.serverTime ?? (0, _Utils.getNowTimestamp)();
    this.hasDeliverAck = params.hasDeliverAck ?? false;
    this.hasReadAck = params.hasReadAck ?? false;
    this.needGroupAck = params.needGroupAck ?? false;
    this.groupAckCount = params.groupAckCount ?? 0;
    this.hasRead = params.hasRead ?? false;
    this.chatType = ChatMessageChatTypeFromNumber(params.chatType ?? 0);
    this.direction = ChatMessageDirectionFromString(params.direction ?? 'send');
    this.status = ChatMessageStatusFromNumber(params.status ?? 0);
    this.attributes = {};
    this.fromAttributes(params.attributes);
    this.body = ChatMessage.getBody(params.body);
    this.localMsgId = this.localTime.toString();
    this.isChatThread = params.isChatThread ?? false;
    this.isOnline = params.isOnline ?? true;
    this.deliverOnlineOnly = params.deliverOnlineOnly ?? false;
    this.receiverList = params.receiverList;
    this.isBroadcast = params.isBroadcast ?? false;
    this.isContentReplaced = params.isContentReplaced ?? false;
  }
  fromAttributes(attributes) {
    if (attributes) {
      const keys = Object.getOwnPropertyNames(attributes);
      for (const key of keys) {
        const v = attributes[key];
        if (typeof v === 'object') {
          this.attributes[key] = v;
        } else if (typeof v === 'function') {
          this.attributes[key] = v;
        } else if (typeof v === 'symbol' || typeof v === 'undefined') {
          this.attributes[key] = v;
        } else if (typeof v === 'string') {
          // !!! maybe json string
          try {
            this.attributes[key] = JSON.parse(v);
          } catch (error) {
            this.attributes[key] = v;
          }
        } else {
          this.attributes[key] = v;
        }
      }
    }
  }
  static getBody(params) {
    let type = ChatMessageTypeFromString(params.type);
    switch (type) {
      case ChatMessageType.TXT:
        return new ChatTextMessageBody(params);
      case ChatMessageType.LOCATION:
        return new ChatLocationMessageBody(params);
      case ChatMessageType.CMD:
        return new ChatCmdMessageBody(params);
      case ChatMessageType.CUSTOM:
        return new ChatCustomMessageBody(params);
      case ChatMessageType.FILE:
        return new ChatFileMessageBody(params);
      case ChatMessageType.IMAGE:
        return new ChatImageMessageBody(params);
      case ChatMessageType.VIDEO:
        return new ChatVideoMessageBody(params);
      case ChatMessageType.VOICE:
        return new ChatVoiceMessageBody(params);
      case ChatMessageType.COMBINE:
        return new ChatCombineMessageBody(params);
      default:
        const ret = new _ChatUnknownMessageBody();
        _ErrorHandler.ExceptionHandler.getInstance().sendExcept({
          except: new _ChatError.ChatException({
            code: 1,
            description: `This type is not supported. ` + type
          }),
          from: 'getBody'
        });
        return ret;
    }
  }
  static createSendMessage(params) {
    let r = new ChatMessage({
      from: _ChatClient.ChatClient.getInstance().currentUserName ?? '',
      body: params.body,
      direction: 'send',
      to: params.targetId,
      hasRead: true,
      chatType: params.chatType,
      isChatThread: params.isChatThread,
      conversationId: params.targetId,
      isOnline: params.isOnline,
      deliverOnlineOnly: params.deliverOnlineOnly,
      receiverList: params.receiverList
    });
    return r;
  }

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
  static createTextMessage(targetId, content) {
    let chatType = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : ChatMessageChatType.PeerChat;
    let opt = arguments.length > 3 ? arguments[3] : undefined;
    return ChatMessage.createSendMessage({
      body: new ChatTextMessageBody({
        content: content,
        targetLanguageCodes: opt === null || opt === void 0 ? void 0 : opt.targetLanguageCodes
      }),
      targetId: targetId,
      chatType: chatType,
      isChatThread: opt === null || opt === void 0 ? void 0 : opt.isChatThread,
      isOnline: opt === null || opt === void 0 ? void 0 : opt.isOnline,
      deliverOnlineOnly: opt === null || opt === void 0 ? void 0 : opt.deliverOnlineOnly,
      receiverList: opt === null || opt === void 0 ? void 0 : opt.receiverList
    });
  }

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
  static createFileMessage(targetId, filePath) {
    let chatType = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : ChatMessageChatType.PeerChat;
    let opt = arguments.length > 3 ? arguments[3] : undefined;
    return ChatMessage.createSendMessage({
      body: new ChatFileMessageBody({
        localPath: filePath,
        displayName: (opt === null || opt === void 0 ? void 0 : opt.displayName) ?? '',
        fileSize: opt === null || opt === void 0 ? void 0 : opt.fileSize
      }),
      targetId: targetId,
      chatType: chatType,
      isChatThread: opt === null || opt === void 0 ? void 0 : opt.isChatThread,
      isOnline: opt === null || opt === void 0 ? void 0 : opt.isOnline,
      deliverOnlineOnly: opt === null || opt === void 0 ? void 0 : opt.deliverOnlineOnly,
      receiverList: opt === null || opt === void 0 ? void 0 : opt.receiverList
    });
  }

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
  static createImageMessage(targetId, filePath) {
    let chatType = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : ChatMessageChatType.PeerChat;
    let opt = arguments.length > 3 ? arguments[3] : undefined;
    return ChatMessage.createSendMessage({
      body: new ChatImageMessageBody({
        localPath: filePath,
        displayName: (opt === null || opt === void 0 ? void 0 : opt.displayName) ?? filePath,
        thumbnailLocalPath: opt === null || opt === void 0 ? void 0 : opt.thumbnailLocalPath,
        sendOriginalImage: (opt === null || opt === void 0 ? void 0 : opt.sendOriginalImage) ?? false,
        width: opt === null || opt === void 0 ? void 0 : opt.width,
        height: opt === null || opt === void 0 ? void 0 : opt.height,
        fileSize: opt === null || opt === void 0 ? void 0 : opt.fileSize
      }),
      targetId: targetId,
      chatType: chatType,
      isChatThread: opt === null || opt === void 0 ? void 0 : opt.isChatThread,
      isOnline: opt === null || opt === void 0 ? void 0 : opt.isOnline,
      deliverOnlineOnly: opt === null || opt === void 0 ? void 0 : opt.deliverOnlineOnly,
      receiverList: opt === null || opt === void 0 ? void 0 : opt.receiverList
    });
  }

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
  static createVideoMessage(targetId, filePath) {
    let chatType = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : ChatMessageChatType.PeerChat;
    let opt = arguments.length > 3 ? arguments[3] : undefined;
    return ChatMessage.createSendMessage({
      body: new ChatVideoMessageBody({
        localPath: filePath,
        displayName: (opt === null || opt === void 0 ? void 0 : opt.displayName) ?? '',
        thumbnailLocalPath: opt === null || opt === void 0 ? void 0 : opt.thumbnailLocalPath,
        duration: opt === null || opt === void 0 ? void 0 : opt.duration,
        width: opt === null || opt === void 0 ? void 0 : opt.width,
        height: opt === null || opt === void 0 ? void 0 : opt.height,
        fileSize: opt === null || opt === void 0 ? void 0 : opt.fileSize
      }),
      targetId: targetId,
      chatType: chatType,
      isChatThread: opt === null || opt === void 0 ? void 0 : opt.isChatThread,
      isOnline: opt === null || opt === void 0 ? void 0 : opt.isOnline,
      deliverOnlineOnly: opt === null || opt === void 0 ? void 0 : opt.deliverOnlineOnly,
      receiverList: opt === null || opt === void 0 ? void 0 : opt.receiverList
    });
  }

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
  static createVoiceMessage(targetId, filePath) {
    let chatType = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : ChatMessageChatType.PeerChat;
    let opt = arguments.length > 3 ? arguments[3] : undefined;
    return ChatMessage.createSendMessage({
      body: new ChatVoiceMessageBody({
        localPath: filePath,
        displayName: (opt === null || opt === void 0 ? void 0 : opt.displayName) ?? '',
        duration: opt === null || opt === void 0 ? void 0 : opt.duration,
        fileSize: opt === null || opt === void 0 ? void 0 : opt.fileSize
      }),
      targetId: targetId,
      chatType: chatType,
      isChatThread: opt === null || opt === void 0 ? void 0 : opt.isChatThread,
      isOnline: opt === null || opt === void 0 ? void 0 : opt.isOnline,
      deliverOnlineOnly: opt === null || opt === void 0 ? void 0 : opt.deliverOnlineOnly,
      receiverList: opt === null || opt === void 0 ? void 0 : opt.receiverList
    });
  }

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
  static createCombineMessage(targetId, messageIdList) {
    let chatType = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : ChatMessageChatType.PeerChat;
    let opt = arguments.length > 3 ? arguments[3] : undefined;
    return ChatMessage.createSendMessage({
      body: new ChatCombineMessageBody({
        localPath: '',
        title: opt === null || opt === void 0 ? void 0 : opt.title,
        summary: opt === null || opt === void 0 ? void 0 : opt.summary,
        compatibleText: opt === null || opt === void 0 ? void 0 : opt.compatibleText,
        messageIdList: messageIdList
      }),
      targetId: targetId,
      chatType: chatType,
      isChatThread: opt === null || opt === void 0 ? void 0 : opt.isChatThread,
      isOnline: opt === null || opt === void 0 ? void 0 : opt.isOnline,
      deliverOnlineOnly: opt === null || opt === void 0 ? void 0 : opt.deliverOnlineOnly,
      receiverList: opt === null || opt === void 0 ? void 0 : opt.receiverList
    });
  }

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
  static createLocationMessage(targetId, latitude, longitude) {
    let chatType = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : ChatMessageChatType.PeerChat;
    let opt = arguments.length > 4 ? arguments[4] : undefined;
    return ChatMessage.createSendMessage({
      body: new ChatLocationMessageBody({
        latitude: latitude,
        longitude: longitude,
        address: (opt === null || opt === void 0 ? void 0 : opt.address) ?? ''
      }),
      targetId: targetId,
      chatType: chatType,
      isChatThread: opt === null || opt === void 0 ? void 0 : opt.isChatThread,
      isOnline: opt === null || opt === void 0 ? void 0 : opt.isOnline,
      deliverOnlineOnly: opt === null || opt === void 0 ? void 0 : opt.deliverOnlineOnly,
      receiverList: opt === null || opt === void 0 ? void 0 : opt.receiverList
    });
  }

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
  static createCmdMessage(targetId, action) {
    let chatType = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : ChatMessageChatType.PeerChat;
    let opt = arguments.length > 3 ? arguments[3] : undefined;
    return ChatMessage.createSendMessage({
      body: new ChatCmdMessageBody({
        action: action
      }),
      targetId: targetId,
      chatType: chatType,
      isChatThread: opt === null || opt === void 0 ? void 0 : opt.isChatThread,
      isOnline: opt === null || opt === void 0 ? void 0 : opt.isOnline,
      deliverOnlineOnly: opt === null || opt === void 0 ? void 0 : opt.deliverOnlineOnly,
      receiverList: opt === null || opt === void 0 ? void 0 : opt.receiverList
    });
  }

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
  static createCustomMessage(targetId, event) {
    let chatType = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : ChatMessageChatType.PeerChat;
    let opt = arguments.length > 3 ? arguments[3] : undefined;
    return ChatMessage.createSendMessage({
      body: new ChatCustomMessageBody({
        event: event,
        params: opt === null || opt === void 0 ? void 0 : opt.params
      }),
      targetId: targetId,
      chatType: chatType,
      isChatThread: opt === null || opt === void 0 ? void 0 : opt.isChatThread,
      isOnline: opt === null || opt === void 0 ? void 0 : opt.isOnline,
      deliverOnlineOnly: opt === null || opt === void 0 ? void 0 : opt.deliverOnlineOnly,
      receiverList: opt === null || opt === void 0 ? void 0 : opt.receiverList
    });
  }

  /**
   * Creates a received message instance.
   *
   * @param params The received message.
   * @returns The message object.
   */
  static createReceiveMessage(params) {
    return new ChatMessage(params);
  }

  /**
   * Gets the list of Reactions.
   */
  get reactionList() {
    return _ChatClient.ChatClient.getInstance().chatManager.getReactionList(this.msgId);
  }

  /**
   * Gets the count of read receipts of a group message.
   */
  get groupReadCount() {
    return _ChatClient.ChatClient.getInstance().chatManager.groupAckCount(this.msgId);
  }

  /**
   * Gets details of a message thread.
   */
  get threadInfo() {
    return _ChatClient.ChatClient.getInstance().chatManager.getMessageThread(this.msgId);
  }

  /**
   * Get the list of pinned messages in the conversation.
   */
  get getPinInfo() {
    return _ChatClient.ChatClient.getInstance().chatManager.getMessagePinInfo(this.msgId);
  }

  /**
   * Set the chat room message priority.
   */
  set messagePriority(p) {
    this.priority = p;
  }
}

/**
 * The message body base class.
 */
exports.ChatMessage = ChatMessage;
class ChatMessageBody {
  /**
   * The message type. See {@link ChatMessageType}.
   */

  /**
   * The user ID of the operator that modified the message last time.
   */

  /**
   * The UNIX timestamp of the last message modification, in milliseconds.
   */

  /**
   * The number of times a message is modified.
   */

  constructor(type, opt) {
    this.type = type;
    this.lastModifyOperatorId = opt === null || opt === void 0 ? void 0 : opt.lastModifyOperatorId;
    this.lastModifyTime = opt === null || opt === void 0 ? void 0 : opt.lastModifyTime;
    this.modifyCount = opt === null || opt === void 0 ? void 0 : opt.modifyCount;
  }
}

/**
 * The text message body class.
 */
exports.ChatMessageBody = ChatMessageBody;
class ChatTextMessageBody extends ChatMessageBody {
  /**
   * The text message content.
   */

  /**
   * The target language for translation. See {@link https://docs.microsoft.com/en-us/azure/cognitive-services/translator/language-support}.
   */

  /**
   * The translation.
   *
   * It is a KV object, where the key is the target language and the value is the translation.
   */

  constructor(params) {
    super(ChatMessageType.TXT, {
      lastModifyOperatorId: params.lastModifyOperatorId,
      lastModifyTime: params.lastModifyTime,
      modifyCount: params.modifyCount
    });
    this.content = params.content;
    this.targetLanguageCodes = params.targetLanguageCodes;
    this.translations = params.translations;
  }
}
exports.ChatTextMessageBody = ChatTextMessageBody;
class _ChatUnknownMessageBody extends ChatMessageBody {
  constructor() {
    super('unknown');
  }
}

/**
 * The location message body class.
 */
class ChatLocationMessageBody extends ChatMessageBody {
  /**
   * The address.
   */

  /**
   * The latitude.
   */

  /**
   * The longitude.
   */

  constructor(params) {
    super(ChatMessageType.LOCATION, {
      lastModifyOperatorId: params.lastModifyOperatorId,
      lastModifyTime: params.lastModifyTime,
      modifyCount: params.modifyCount
    });
    this.address = params.address;
    this.latitude = params.latitude;
    this.longitude = params.longitude;
  }
}

/**
 * The file message body class for internal.
 */
exports.ChatLocationMessageBody = ChatLocationMessageBody;
class _ChatFileMessageBody extends ChatMessageBody {
  /**
   * The local path of the file.
   */
  localPath = '';
  /**
   * The token to download the file attachment.
   */

  /**
   * The path of the attachment file in the server.
   */

  /**
   * The download status of the attachment file. See {@link ChatDownloadStatus}.
   */

  /**
   * The size of the file in bytes.
   */

  /**
   * The file name.
   */

  constructor(params) {
    super(params.type, {
      lastModifyOperatorId: params.lastModifyOperatorId,
      lastModifyTime: params.lastModifyTime,
      modifyCount: params.modifyCount
    });
    this.localPath = params.localPath;
    this.secret = params.secret ?? '';
    this.remotePath = params.remotePath ?? '';
    this.fileStatus = ChatDownloadStatusFromNumber(params.fileStatus ?? -1);
    this.fileSize = params.fileSize ?? 0;
    this.displayName = params.displayName ?? '';
  }
}

/**
 * The file message body class.
 */
class ChatFileMessageBody extends _ChatFileMessageBody {
  constructor(params) {
    super({
      ...params,
      type: ChatMessageType.FILE
    });
  }
}

/**
 * The image message body class.
 */
exports.ChatFileMessageBody = ChatFileMessageBody;
class ChatImageMessageBody extends _ChatFileMessageBody {
  /**
   Whether to send the original image.
  * - `true`: Yes. 
  * - (Default) `false`: No. If the image is smaller than 100 KB, the SDK sends the original image. If the image is equal to or greater than 100 KB, the SDK will compress it before sending the compressed image.
   */

  /**
   * The local path or the URI of the thumbnail as a string.
   */

  /**
   * The URL of the thumbnail on the server.
   */

  /**
   * The secret to access the thumbnail. A secret is required for verification for thumbnail download.
   */

  /**
   * The download status of the thumbnail. See {@link ChatDownloadStatus}
   */

  /**
   * The image width in pixels.
   */

  /**
   * The image height in pixels.
   */

  constructor(params) {
    super({
      type: ChatMessageType.IMAGE,
      lastModifyOperatorId: params.lastModifyOperatorId,
      lastModifyTime: params.lastModifyTime,
      modifyCount: params.modifyCount,
      localPath: params.localPath,
      secret: params.secret,
      remotePath: params.remotePath,
      fileStatus: params.fileStatus,
      fileSize: params.fileSize,
      displayName: params.displayName
    });
    this.sendOriginalImage = params.sendOriginalImage ?? false;
    this.thumbnailLocalPath = params.thumbnailLocalPath ?? '';
    this.thumbnailRemotePath = params.thumbnailRemotePath ?? '';
    this.thumbnailSecret = params.thumbnailSecret ?? '';
    this.thumbnailStatus = ChatDownloadStatusFromNumber(params.thumbnailStatus ?? -1);
    this.width = params.width ?? 0;
    this.height = params.height ?? 0;
  }
}

/**
 * The video message body class.
 */
exports.ChatImageMessageBody = ChatImageMessageBody;
class ChatVideoMessageBody extends _ChatFileMessageBody {
  /**
   * The video duration in seconds.
   */

  /**
   * The local path of the video thumbnail.
   */

  /**
   * The URL of the thumbnail on the server.
   */

  /**
   * The secret to download the video thumbnail.
   */

  /**
   * The download status of the video thumbnail. See {@link ChatDownloadStatus}
   */

  /**
   * The video width in pixels.
   */

  /**
   * The video height in pixels.
   */

  constructor(params) {
    super({
      type: ChatMessageType.VIDEO,
      lastModifyOperatorId: params.lastModifyOperatorId,
      lastModifyTime: params.lastModifyTime,
      modifyCount: params.modifyCount,
      localPath: params.localPath,
      secret: params.secret,
      remotePath: params.remotePath,
      fileStatus: params.fileStatus,
      fileSize: params.fileSize,
      displayName: params.displayName
    });
    this.duration = params.duration ?? 0;
    this.thumbnailLocalPath = params.thumbnailLocalPath ?? '';
    this.thumbnailRemotePath = params.thumbnailRemotePath ?? '';
    this.thumbnailSecret = params.thumbnailSecret ?? '';
    this.thumbnailStatus = ChatDownloadStatusFromNumber(params.thumbnailStatus ?? -1);
    this.width = params.width ?? 0;
    this.height = params.height ?? 0;
  }
}

/**
 * The voice message body.
 */
exports.ChatVideoMessageBody = ChatVideoMessageBody;
class ChatVoiceMessageBody extends _ChatFileMessageBody {
  /**
   * The voice duration in seconds.
   */

  constructor(params) {
    super({
      type: ChatMessageType.VOICE,
      lastModifyOperatorId: params.lastModifyOperatorId,
      lastModifyTime: params.lastModifyTime,
      modifyCount: params.modifyCount,
      localPath: params.localPath,
      secret: params.secret,
      remotePath: params.remotePath,
      fileStatus: params.fileStatus,
      fileSize: params.fileSize,
      displayName: params.displayName
    });
    this.duration = params.duration ?? 0;
  }
}

/**
 * The command message body.
 */
exports.ChatVoiceMessageBody = ChatVoiceMessageBody;
class ChatCmdMessageBody extends ChatMessageBody {
  /**
   * The command action.
   */

  constructor(params) {
    super(ChatMessageType.CMD, {
      lastModifyOperatorId: params.lastModifyOperatorId,
      lastModifyTime: params.lastModifyTime,
      modifyCount: params.modifyCount
    });
    this.action = params.action;
  }
}

/**
 * The custom message body.
 */
exports.ChatCmdMessageBody = ChatCmdMessageBody;
class ChatCustomMessageBody extends ChatMessageBody {
  /**
   * The event.
   */

  /**
   * The custom params map.
   */

  constructor(params) {
    super(ChatMessageType.CUSTOM, {
      lastModifyOperatorId: params.lastModifyOperatorId,
      lastModifyTime: params.lastModifyTime,
      modifyCount: params.modifyCount
    });
    this.event = params.event;
    this.params = params.params;
  }
}

/**
 * The combined message body.
 */
exports.ChatCustomMessageBody = ChatCustomMessageBody;
class ChatCombineMessageBody extends _ChatFileMessageBody {
  /**
   * The title of the combined message.
   */

  /**
   * The summary of the combined message.
   */

  /**
   * The list of IDs of original messages in the combined message.
   *
   * **note** This attribute is used only when you create a combined message.
   */

  /**
   * The compatible text of the combined message.
   */

  constructor(params) {
    super({
      type: ChatMessageType.COMBINE,
      lastModifyOperatorId: params.lastModifyOperatorId,
      lastModifyTime: params.lastModifyTime,
      modifyCount: params.modifyCount,
      localPath: params.localPath,
      secret: params.secret,
      remotePath: params.remotePath,
      fileStatus: params.fileStatus,
      fileSize: params.fileSize,
      displayName: params.displayName
    });
    this.title = params.title;
    this.compatibleText = params.compatibleText;
    this.messageIdList = params.messageIdList;
    this.summary = params.summary;
  }
}

/**
 * The pinning or unpinning information of the message.
 */
exports.ChatCombineMessageBody = ChatCombineMessageBody;
class ChatMessagePinInfo {
  /**
   * The time when the message is pinned or unpinned.
   */

  /**
   * The user ID of the operator that pins or unpins the message.
   */

  constructor(params) {
    this.pinTime = params.pinTime;
    this.operatorId = params.operatorId;
  }
}

/**
 * The parameter configuration class for pulling historical messages from the server.
 */
exports.ChatMessagePinInfo = ChatMessagePinInfo;
class ChatFetchMessageOptions {
  /**
   * The user ID of the message sender in the group conversation.
   */

  /**
   * The array of message types for query. The default value is `undefined`, indicating that all types of messages are retrieved.
   */

  /**
   * The start time for message query. The time is a UNIX time stamp in milliseconds. The default value is -1,indicating that this parameter is ignored during message query.If the [startTs] is set to a specific time spot and the [endTs] uses the default value -1,the SDK returns messages that are sent and received in the period that is from the start time to the current time.If the [startTs] uses the default value -1 and the [endTs] is set to a specific time spot,the SDK returns messages that are sent and received in the period that is from the timestamp of the first message to the current time.
   */

  /**
   * The end time for message query. The time is a UNIX time stamp in milliseconds.
   */

  /**
   * The message search direction, Default is {@link ChatSearchDirection.UP}.
   */

  /**
   * Whether to save the retrieved messages to the database:
   * - `true`: save to database;
   * - `false`(Default)：no save to database.
   */

  constructor(params) {
    this.from = params.from;
    this.startTs = params.startTs;
    this.endTs = params.endTs;
    this.direction = params.direction;
    this.needSave = params.needSave;
    this.msgTypes = params.msgTypes;
  }
}
exports.ChatFetchMessageOptions = ChatFetchMessageOptions;
//# sourceMappingURL=ChatMessage.js.map
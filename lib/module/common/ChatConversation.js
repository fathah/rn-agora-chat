import { ChatClient } from '../ChatClient';
import { ChatError } from './ChatError';
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
export let ChatSearchDirection = /*#__PURE__*/function (ChatSearchDirection) {
  ChatSearchDirection[ChatSearchDirection["UP"] = 0] = "UP";
  ChatSearchDirection[ChatSearchDirection["DOWN"] = 1] = "DOWN";
  return ChatSearchDirection;
}({});

/**
 * The conversation types.
 */
export let ChatConversationType = /*#__PURE__*/function (ChatConversationType) {
  ChatConversationType[ChatConversationType["PeerChat"] = 0] = "PeerChat";
  ChatConversationType[ChatConversationType["GroupChat"] = 1] = "GroupChat";
  ChatConversationType[ChatConversationType["RoomChat"] = 2] = "RoomChat";
  return ChatConversationType;
}({});

/**
 * The mapping between each type of conversation mark and their actual meanings is maintained by the developer.
 *
 * Unlike conversation extension fields, conversation marks are searchable.
 */
export let ChatConversationMarkType = /*#__PURE__*/function (ChatConversationMarkType) {
  ChatConversationMarkType[ChatConversationMarkType["Type0"] = 0] = "Type0";
  ChatConversationMarkType[ChatConversationMarkType["Type1"] = 1] = "Type1";
  ChatConversationMarkType[ChatConversationMarkType["Type2"] = 2] = "Type2";
  ChatConversationMarkType[ChatConversationMarkType["Type3"] = 3] = "Type3";
  ChatConversationMarkType[ChatConversationMarkType["Type4"] = 4] = "Type4";
  ChatConversationMarkType[ChatConversationMarkType["Type5"] = 5] = "Type5";
  ChatConversationMarkType[ChatConversationMarkType["Type6"] = 6] = "Type6";
  ChatConversationMarkType[ChatConversationMarkType["Type7"] = 7] = "Type7";
  ChatConversationMarkType[ChatConversationMarkType["Type8"] = 8] = "Type8";
  ChatConversationMarkType[ChatConversationMarkType["Type9"] = 9] = "Type9";
  ChatConversationMarkType[ChatConversationMarkType["Type10"] = 10] = "Type10";
  ChatConversationMarkType[ChatConversationMarkType["Type11"] = 11] = "Type11";
  ChatConversationMarkType[ChatConversationMarkType["Type12"] = 12] = "Type12";
  ChatConversationMarkType[ChatConversationMarkType["Type13"] = 13] = "Type13";
  ChatConversationMarkType[ChatConversationMarkType["Type14"] = 14] = "Type14";
  ChatConversationMarkType[ChatConversationMarkType["Type15"] = 15] = "Type15";
  ChatConversationMarkType[ChatConversationMarkType["Type16"] = 16] = "Type16";
  ChatConversationMarkType[ChatConversationMarkType["Type17"] = 17] = "Type17";
  ChatConversationMarkType[ChatConversationMarkType["Type18"] = 18] = "Type18";
  ChatConversationMarkType[ChatConversationMarkType["Type19"] = 19] = "Type19";
  return ChatConversationMarkType;
}({});

/**
 * Converts the conversation type from int to enum.
 *
 * @param params The conversation type of the int type.
 * @returns The conversation type of the enum type.
 */
export function ChatConversationTypeFromNumber(params) {
  switch (params) {
    case 0:
      return ChatConversationType.PeerChat;
    case 1:
      return ChatConversationType.GroupChat;
    case 2:
      return ChatConversationType.RoomChat;
    default:
      return params;
  }
}

/**
 * Converts the conversation type from enum to string.
 *
 * @param params The conversation type of the enum type.
 * @returns The conversation type of the string type.
 */
export function ChatConversationTypeToString(params) {
  return ChatConversationType[params];
}

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
export class ChatConversation {
  /**
   * The conversation ID.
   */

  /**
   * The conversation type.
   */

  /**
   * Whether the current conversation is a thread conversation.
   *
   * - `true`: Yes.
   * - `false`: No.
   *
   * **Note**
    * This parameter is valid only for group chat.
   */

  /**
   * The conversation extension.
   */

  /**
   * Whether the conversation is pinned:
   *
   * - `true`: Yes.
   * - (Default) `false`: No.
   */

  /**
   * The UNIX timestamp when the conversation is pinned. The unit is millisecond. This value is `0` when the conversation is not pinned.
   */

  /**
   * The conversation marks.
   */

  constructor(params) {
    this.convId = params.convId;
    this.convType = params.convType;
    this.isChatThread = params.isChatThread ?? false;
    this.ext = params.ext;
    this.isPinned = params.isPinned ?? false;
    this.pinnedTime = params.pinnedTime ?? 0;
    this.marks = params.marks;
  }

  /**
   * Gets the conversation ID.
   *
   * @returns The conversation ID.
   */
  async name() {
    if (this.convType === ChatConversationType.PeerChat) {
      const ret = await ChatClient.getInstance().userManager.fetchUserInfoById([this.convId]);
      if (ret.size > 0) {
        var _ret$values$next$valu;
        return (_ret$values$next$valu = ret.values().next().value) === null || _ret$values$next$valu === void 0 ? void 0 : _ret$values$next$valu.nickName;
      }
    } else if (this.convType === ChatConversationType.GroupChat) {
      const ret = await ChatClient.getInstance().groupManager.fetchGroupInfoFromServer(this.convId);
      if (ret) {
        return ret.groupName;
      }
    } else if (this.convType === ChatConversationType.RoomChat) {
      const ret = await ChatClient.getInstance().roomManager.fetchChatRoomInfoFromServer(this.convId);
      if (ret) {
        return ret.roomName;
      }
    } else {
      throw new ChatError({
        code: 1,
        description: `This type is not supported. ` + this.convType
      });
    }
    return undefined;
  }

  /**
   * Gets the count of unread messages in the conversation.
   *
   * @returns The count of unread messages.
   *
   * @throws A description of the exception. See {@link ChatError}.
   */
  async getUnreadCount() {
    return ChatClient.getInstance().chatManager.getConversationUnreadCount(this.convId, this.convType, this.isChatThread);
  }

  /**
   * Gets the count of messages in the conversation.
   * @returns The count of messages.
   * @throws A description of the exception. See {@link ChatError}.
   */
  async getMessageCount() {
    return ChatClient.getInstance().chatManager.getConversationMessageCount(this.convId, this.convType, this.isChatThread);
  }

  /**
   * Gets the latest message from the conversation.
   *
   * @returns The message instance. The SDK returns `undefined` if the message does not exist.
   *
   * @throws A description of the exception. See {@link ChatError}.
   */
  async getLatestMessage() {
    return ChatClient.getInstance().chatManager.getLatestMessage(this.convId, this.convType, this.isChatThread);
  }

  /**
   * Gets the latest message received in the conversation.
   *
   * @returns The message instance. The SDK returns `undefined` if the message does not exist.
   *
   * @throws A description of the exception. See {@link ChatError}.
   */
  async getLatestReceivedMessage() {
    return ChatClient.getInstance().chatManager.getLatestReceivedMessage(this.convId, this.convType, this.isChatThread);
  }

  /**
   * Sets the extension information of the conversation.
   *
   * @param ext The extension information of the conversation. This parameter must be in the key-value format.
   *
   * @throws A description of the exception. See {@link ChatError}.
   */
  async setConversationExtension(ext) {
    await ChatClient.getInstance().chatManager.setConversationExtension(this.convId, this.convType, this.ext, this.isChatThread);
    this.ext = ext;
  }

  /**
   * Marks a message as read.
   *
   * @param msgId The message ID.
   *
   * @throws A description of the exception. See {@link ChatError}.
   */
  async markMessageAsRead(msgId) {
    return ChatClient.getInstance().chatManager.markMessageAsRead(this.convId, this.convType, msgId, this.isChatThread);
  }

  /**
   * Marks all messages as read.
   *
   * @throws A description of the exception. See {@link ChatError}.
   */
  async markAllMessagesAsRead() {
    return ChatClient.getInstance().chatManager.markAllMessagesAsRead(this.convId, this.convType, this.isChatThread);
  }

  /**
   * Updates a message in the local database.
   *
   * After you modify a message, the message ID remains unchanged and the SDK automatically updates attributes of the conversation, like `latestMessage`.
   *
   * @param msg The message instance.
   *
   * @throws A description of the exception. See {@link ChatError}.
   */
  async updateMessage(msg) {
    if (msg.conversationId !== this.convId) {
      throw new ChatError({
        code: 1,
        description: 'The Message conversation id is not same as conversation id'
      });
    }
    return ChatClient.getInstance().chatManager.updateConversationMessage(this.convId, this.convType, msg, this.isChatThread);
  }

  /**
   * Deletes a message from the local database.
   *
   * @param msgId The ID of message to delete.
   *
   * @throws A description of the exception. See {@link ChatError}.
   */
  async deleteMessage(msgId) {
    return ChatClient.getInstance().chatManager.deleteMessage(this.convId, this.convType, msgId, this.isChatThread);
  }

  /**
   * Deletes messages sent or received in a certain period from the local database.
   *
   * @params params
   * - startTs: The starting UNIX timestamp for message deletion. The unit is millisecond.
   * - endTs: The end UNIX timestamp for message deletion. The unit is millisecond.
   *
   * @throws A description of the exception. See {@link ChatError}.
   */
  async deleteMessagesWithTimestamp(params) {
    return ChatClient.getInstance().chatManager.deleteMessagesWithTimestamp(this.convId, this.convType, params, this.isChatThread);
  }

  /**
   * Deletes all the messages of the conversation.
   *
   * This method deletes all the messages of the conversation from both the memory and local database.
   *
   * @throws A description of the exception. See {@link ChatError}.
   */
  async deleteAllMessages() {
    return ChatClient.getInstance().chatManager.deleteConversationAllMessages(this.convId, this.convType, this.isChatThread);
  }

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
  async getMessagesWithMsgType(msgType) {
    let direction = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : ChatSearchDirection.UP;
    let timestamp = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : -1;
    let count = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 20;
    let sender = arguments.length > 4 ? arguments[4] : undefined;
    return ChatClient.getInstance().chatManager.getMessagesWithMsgType(this.convId, this.convType, msgType, direction, timestamp, count, sender, this.isChatThread);
  }

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
  async getMsgsWithMsgType(params) {
    return ChatClient.getInstance().chatManager.getMsgsWithMsgType({
      ...params,
      convId: this.convId,
      convType: this.convType,
      isChatThread: this.isChatThread
    });
  }

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
  async getMessages(startMsgId) {
    let direction = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : ChatSearchDirection.UP;
    let loadCount = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 20;
    return ChatClient.getInstance().chatManager.getMessages(this.convId, this.convType, startMsgId, direction, loadCount, this.isChatThread);
  }

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
  async getMsgs(params) {
    return ChatClient.getInstance().chatManager.getMsgs({
      ...params,
      convId: this.convId,
      convType: this.convType,
      isChatThread: this.isChatThread
    });
  }

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
  async getMessagesWithKeyword(keywords) {
    let direction = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : ChatSearchDirection.UP;
    let timestamp = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : -1;
    let count = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 20;
    let sender = arguments.length > 4 ? arguments[4] : undefined;
    return ChatClient.getInstance().chatManager.getMessagesWithKeyword(this.convId, this.convType, keywords, direction, timestamp, count, sender, this.isChatThread);
  }

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
  async getMsgsWithKeyword(params) {
    return ChatClient.getInstance().chatManager.getConvMsgsWithKeyword({
      ...params,
      convId: this.convId,
      convType: this.convType,
      isChatThread: this.isChatThread
    });
  }

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
  async getMessageWithTimestamp(startTime, endTime) {
    let direction = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : ChatSearchDirection.UP;
    let count = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 20;
    return ChatClient.getInstance().chatManager.getMessageWithTimestamp(this.convId, this.convType, startTime, endTime, direction, count, this.isChatThread);
  }

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
  async getMsgWithTimestamp(params) {
    return ChatClient.getInstance().chatManager.getMsgWithTimestamp({
      ...params,
      convId: this.convId,
      convType: this.convType,
      isChatThread: this.isChatThread
    });
  }

  /**
   * Deletes messages from the conversation (from both local storage and server).
   *
   * @param msgIds The IDs of messages to delete from the current conversation.
   *
   * @throws A description of the exception. See {@link ChatError}.
   */
  async removeMessagesFromServerWithMsgIds(msgIds) {
    return ChatClient.getInstance().chatManager.removeMessagesFromServerWithMsgIds(this.convId, this.convType, msgIds, this.isChatThread);
  }

  /**
   * Deletes messages from the conversation (from both local storage and server).
   *
   * @param timestamp The message timestamp in millisecond. The messages with the timestamp smaller than the specified one will be deleted.
   *
   * @throws A description of the exception. See {@link ChatError}.
   */
  async removeMessagesFromServerWithTimestamp(timestamp) {
    return ChatClient.getInstance().chatManager.removeMessagesFromServerWithTimestamp(this.convId, this.convType, timestamp, this.isChatThread);
  }

  /**
   * Gets the pinned messages in the conversation from the local database.
   *
   * @returns The list of pinned messages. If no message is obtained, an empty list is returned.
   *
   * @throws A description of the exception. See {@link ChatError}.
   */
  async getPinnedMessages() {
    return ChatClient.getInstance().chatManager.getPinnedMessages(this.convId, this.convType, this.isChatThread);
  }

  /**
   * Gets the pinned messages in the conversation from the server.
   *
   * @returns The list of pinned messages. If no message is obtained, an empty list is returned.
   *
   * @throws A description of the exception. See {@link ChatError}.
   */
  async fetchPinnedMessages() {
    return ChatClient.getInstance().chatManager.fetchPinnedMessages(this.convId, this.convType, this.isChatThread);
  }
}

/**
 * The conversation filter class.
 */
export class ChatConversationFetchOptions {
  /**
   * The number of conversations to retrieve.
   *
   * If you retrieve marked conversations, the value range is [1,10], with 10 as the default. Otherwise, the value range is [1,50].
   */

  /**
   * The cursor to specify where to start retrieving conversations.
   */

  /**
   * Whether to get pinned conversations.
   * - `true`: Yes.
   * - `false`: No.
   */

  /**
   * Whether to get marked conversations.
   * - `true`: Yes.
   * - `false`: No.
   */

  constructor(params) {
    this.pageSize = params.pageSize;
    this.cursor = params.cursor;
    this.pinned = params.pinned;
    this.mark = params.mark;
  }
  static default() {
    return new ChatConversationFetchOptions({
      pageSize: 20,
      pinned: false
    });
  }
  static pinned() {
    return new ChatConversationFetchOptions({
      pageSize: 20,
      pinned: true
    });
  }
  static withMark(mark) {
    return new ChatConversationFetchOptions({
      pageSize: 20,
      mark: mark
    });
  }
}
//# sourceMappingURL=ChatConversation.js.map
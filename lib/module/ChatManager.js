import { BaseManager } from './__internal__/Base';
import { MTackConversationRead, MTackGroupMessageRead, MTackMessageRead, MTaddReaction, MTaddRemoteAndLocalConversationsMark, MTasyncFetchGroupAcks, MTclearAllMessages, MTcreateChatThread, MTdeleteAllMessageAndConversation, MTdeleteConversation, MTdeleteMessagesBeforeTimestamp, MTdeleteMessagesWithTs, MTdeleteRemoteAndLocalConversationsMark, MTdeleteRemoteConversation, MTdestroyChatThread, MTdownloadAndParseCombineMessage, MTdownloadAttachment, MTdownloadAttachmentInCombine, MTdownloadThumbnail, MTdownloadThumbnailInCombine, MTfetchChatThreadDetail, MTfetchChatThreadMember, MTfetchChatThreadsWithParentId, MTfetchConversationsByOptions, MTfetchConversationsFromServerWithPage, MTfetchHistoryMessages, MTfetchHistoryMessagesByOptions, MTfetchJoinedChatThreads, MTfetchJoinedChatThreadsWithParentId, MTfetchLastMessageWithChatThreads, MTfetchPinnedMessages, MTfetchReactionDetail, MTfetchReactionList, MTfetchSupportLanguages, MTgetConversation, MTgetConversationsFromServer, MTgetConversationsFromServerWithCursor, MTgetLatestMessage, MTgetLatestMessageFromOthers, MTgetMessage, MTgetMessageThread, MTgetMsgCount, MTgetPinInfo, MTgetPinnedConversationsFromServerWithCursor, MTgetReactionList, MTgetThreadConversation, MTgetUnreadMessageCount, MTgetUnreadMsgCount, MTgroupAckCount, MTimportMessages, MTinsertMessage, MTjoinChatThread, MTleaveChatThread, MTloadAllConversations, MTloadMsgWithKeywords, MTloadMsgWithMsgType, MTloadMsgWithStartId, MTloadMsgWithTime, MTmarkAllChatMsgAsRead, MTmarkAllMessagesAsRead, MTmarkMessageAsRead, MTmessageReactionDidChange, MTmodifyMessage, MTonChatThreadCreated, MTonChatThreadDestroyed, MTonChatThreadUpdated, MTonChatThreadUserRemoved, MTonCmdMessagesReceived, MTonConversationHasRead, MTonConversationUpdate, MTonGroupMessageRead, MTonMessageContentChanged, MTonMessagePinChanged, MTonMessagesDelivered, MTonMessagesRead, MTonMessagesRecalled, MTonMessagesReceived, MTonReadAckForGroupMessageUpdated, MTpinConversation, MTpinMessage, MTpinnedMessages, MTrecallMessage, MTremoveMemberFromChatThread, MTremoveMessage, MTremoveMessagesFromServerWithMsgIds, MTremoveMessagesFromServerWithTs, MTremoveReaction, MTreportMessage, MTresendMessage, MTsearchChatMsgFromDB, MTsendMessage, MTsyncConversationExt, MTtranslateMessage, MTunpinMessage, MTupdateChatMessage, MTupdateChatThreadSubject, MTupdateConversationMessage } from './__internal__/Consts';
import { Native } from './__internal__/Native';
import { ChatClient } from './ChatClient';
import { chatlog } from './common/ChatConst';
import { ChatConversation, ChatConversationType, ChatSearchDirection } from './common/ChatConversation';
import { ChatCursorResult } from './common/ChatCursorResult';
import { ChatError } from './common/ChatError';
import { ChatGroupMessageAck } from './common/ChatGroup';
import { ChatMessage, ChatMessagePinInfo, ChatMessageSearchScope, ChatMessageStatus, ChatMessageType } from './common/ChatMessage';
import { ChatMessageReaction, ChatMessageReactionEvent, ChatReactionOperation } from './common/ChatMessageReaction';
import { ChatMessageThread, ChatMessageThreadEvent } from './common/ChatMessageThread';
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
export class ChatManager extends BaseManager {
  static TAG = 'ChatManager';
  constructor() {
    super();
    this._messageListeners = new Set();
  }
  setNativeListener(event) {
    chatlog.log(`${ChatManager.TAG}: setNativeListener: `);
    this._eventEmitter = event;
    event.removeAllListeners(MTonMessagesReceived);
    event.addListener(MTonMessagesReceived, this.onMessagesReceived.bind(this));
    event.removeAllListeners(MTonCmdMessagesReceived);
    event.addListener(MTonCmdMessagesReceived, this.onCmdMessagesReceived.bind(this));
    event.removeAllListeners(MTonMessagesRead);
    event.addListener(MTonMessagesRead, this.onMessagesRead.bind(this));
    event.removeAllListeners(MTonGroupMessageRead);
    event.addListener(MTonGroupMessageRead, this.onGroupMessageRead.bind(this));
    event.removeAllListeners(MTonMessagesDelivered);
    event.addListener(MTonMessagesDelivered, this.onMessagesDelivered.bind(this));
    event.removeAllListeners(MTonMessagesRecalled);
    event.addListener(MTonMessagesRecalled, this.onMessagesRecalled.bind(this));
    event.removeAllListeners(MTonConversationUpdate);
    event.addListener(MTonConversationUpdate, this.onConversationsUpdate.bind(this));
    event.removeAllListeners(MTonConversationHasRead);
    event.addListener(MTonConversationHasRead, this.onConversationHasRead.bind(this));
    event.removeAllListeners(MTonReadAckForGroupMessageUpdated);
    event.addListener(MTonReadAckForGroupMessageUpdated, this.onReadAckForGroupMessageUpdated.bind(this));
    event.removeAllListeners(MTmessageReactionDidChange);
    event.addListener(MTmessageReactionDidChange, this.onMessageReactionDidChange.bind(this));
    event.removeAllListeners(MTonChatThreadCreated);
    event.addListener(MTonChatThreadCreated, this.onChatMessageThreadCreated.bind(this));
    event.removeAllListeners(MTonChatThreadUpdated);
    event.addListener(MTonChatThreadUpdated, this.onChatMessageThreadUpdated.bind(this));
    event.removeAllListeners(MTonChatThreadDestroyed);
    event.addListener(MTonChatThreadDestroyed, this.onChatMessageThreadDestroyed.bind(this));
    event.removeAllListeners(MTonChatThreadUserRemoved);
    event.addListener(MTonChatThreadUserRemoved, this.onChatMessageThreadUserRemoved.bind(this));
    event.removeAllListeners(MTonMessageContentChanged);
    event.addListener(MTonMessageContentChanged, this.onMessageContentChanged.bind(this));
    event.removeAllListeners(MTonMessagePinChanged);
    event.addListener(MTonMessagePinChanged, this.onMessagePinChanged.bind(this));
  }
  filterUnsupportedMessage(messages) {
    return messages.filter(message => {
      return message.body.type !== 'unknown';
    });
  }
  createReceiveMessage(messages) {
    let list = [];
    messages.forEach(message => {
      let m = ChatMessage.createReceiveMessage(message);
      list.push(m);
    });
    return this.filterUnsupportedMessage(list);
  }
  onMessagesReceived(messages) {
    chatlog.log(`${ChatManager.TAG}: onMessagesReceived: `, messages);
    if (this._messageListeners.size === 0) {
      return;
    }
    let list = this.createReceiveMessage(messages);
    this._messageListeners.forEach(listener => {
      var _listener$onMessagesR;
      (_listener$onMessagesR = listener.onMessagesReceived) === null || _listener$onMessagesR === void 0 ? void 0 : _listener$onMessagesR.call(listener, list);
    });
  }
  onCmdMessagesReceived(messages) {
    chatlog.log(`${ChatManager.TAG}: onCmdMessagesReceived: `, messages);
    if (this._messageListeners.size === 0) {
      return;
    }
    let list = this.createReceiveMessage(messages);
    this._messageListeners.forEach(listener => {
      var _listener$onCmdMessag;
      (_listener$onCmdMessag = listener.onCmdMessagesReceived) === null || _listener$onCmdMessag === void 0 ? void 0 : _listener$onCmdMessag.call(listener, list);
    });
  }
  onMessagesRead(messages) {
    chatlog.log(`${ChatManager.TAG}: onMessagesRead: `, messages);
    if (this._messageListeners.size === 0) {
      return;
    }
    let list = this.createReceiveMessage(messages);
    this._messageListeners.forEach(listener => {
      var _listener$onMessagesR2;
      (_listener$onMessagesR2 = listener.onMessagesRead) === null || _listener$onMessagesR2 === void 0 ? void 0 : _listener$onMessagesR2.call(listener, list);
    });
  }
  onGroupMessageRead(messages) {
    chatlog.log(`${ChatManager.TAG}: onGroupMessageRead: `, messages);
    if (this._messageListeners.size === 0) {
      return;
    }
    let list = [];
    messages.forEach(message => {
      let m = new ChatGroupMessageAck(message);
      list.push(m);
    });
    this._messageListeners.forEach(listener => {
      var _listener$onGroupMess;
      (_listener$onGroupMess = listener.onGroupMessageRead) === null || _listener$onGroupMess === void 0 ? void 0 : _listener$onGroupMess.call(listener, messages);
    });
  }
  onMessagesDelivered(messages) {
    chatlog.log(`${ChatManager.TAG}: onMessagesDelivered: `, messages);
    if (this._messageListeners.size === 0) {
      return;
    }
    let list = this.createReceiveMessage(messages);
    this._messageListeners.forEach(listener => {
      var _listener$onMessagesD;
      (_listener$onMessagesD = listener.onMessagesDelivered) === null || _listener$onMessagesD === void 0 ? void 0 : _listener$onMessagesD.call(listener, list);
    });
  }
  onMessagesRecalled(messages) {
    chatlog.log(`${ChatManager.TAG}: onMessagesRecalled: `, messages);
    if (this._messageListeners.size === 0) {
      return;
    }
    let list = this.createReceiveMessage(messages);
    this._messageListeners.forEach(listener => {
      var _listener$onMessagesR3;
      (_listener$onMessagesR3 = listener.onMessagesRecalled) === null || _listener$onMessagesR3 === void 0 ? void 0 : _listener$onMessagesR3.call(listener, list);
    });
  }
  onConversationsUpdate() {
    chatlog.log(`${ChatManager.TAG}: onConversationsUpdate: `);
    this._messageListeners.forEach(listener => {
      var _listener$onConversat;
      (_listener$onConversat = listener.onConversationsUpdate) === null || _listener$onConversat === void 0 ? void 0 : _listener$onConversat.call(listener);
    });
  }
  onConversationHasRead(params) {
    chatlog.log(`${ChatManager.TAG}: onConversationHasRead: `, params);
    this._messageListeners.forEach(listener => {
      var _listener$onConversat2;
      let from = params === null || params === void 0 ? void 0 : params.from;
      let to = params === null || params === void 0 ? void 0 : params.to;
      (_listener$onConversat2 = listener.onConversationRead) === null || _listener$onConversat2 === void 0 ? void 0 : _listener$onConversat2.call(listener, from, to);
    });
  }
  onReadAckForGroupMessageUpdated(params) {
    chatlog.log(`${ChatManager.TAG}: onReadAckForGroupMessageUpdated: `, params);
  }
  onMessageReactionDidChange(params) {
    chatlog.log(`${ChatManager.TAG}: onMessageReactionDidChange: `, JSON.stringify(params));
    if (this._messageListeners.size === 0) {
      return;
    }
    const list = [];
    Object.entries(params).forEach(v => {
      const convId = v[1].conversationId;
      const msgId = v[1].messageId;
      const ll = [];
      Object.entries(v[1].reactions).forEach(vv => {
        ll.push(new ChatMessageReaction(vv[1]));
      });
      const o = [];
      Object.entries(v[1].operations).forEach(vv => {
        o.push(ChatReactionOperation.fromNative(vv[1]));
      });
      list.push(new ChatMessageReactionEvent({
        convId: convId,
        msgId: msgId,
        reactions: ll,
        operations: o
      }));
    });
    this._messageListeners.forEach(listener => {
      var _listener$onMessageRe;
      (_listener$onMessageRe = listener.onMessageReactionDidChange) === null || _listener$onMessageRe === void 0 ? void 0 : _listener$onMessageRe.call(listener, list);
    });
  }
  onChatMessageThreadCreated(params) {
    chatlog.log(`${ChatManager.TAG}: onChatMessageThreadCreated: `, params);
    this._messageListeners.forEach(listener => {
      var _listener$onChatMessa;
      (_listener$onChatMessa = listener.onChatMessageThreadCreated) === null || _listener$onChatMessa === void 0 ? void 0 : _listener$onChatMessa.call(listener, new ChatMessageThreadEvent(params));
    });
  }
  onChatMessageThreadUpdated(params) {
    chatlog.log(`${ChatManager.TAG}: onChatMessageThreadUpdated: `, params);
    this._messageListeners.forEach(listener => {
      var _listener$onChatMessa2;
      (_listener$onChatMessa2 = listener.onChatMessageThreadUpdated) === null || _listener$onChatMessa2 === void 0 ? void 0 : _listener$onChatMessa2.call(listener, new ChatMessageThreadEvent(params));
    });
  }
  onChatMessageThreadDestroyed(params) {
    chatlog.log(`${ChatManager.TAG}: onChatMessageThreadDestroyed: `, params);
    this._messageListeners.forEach(listener => {
      var _listener$onChatMessa3;
      (_listener$onChatMessa3 = listener.onChatMessageThreadDestroyed) === null || _listener$onChatMessa3 === void 0 ? void 0 : _listener$onChatMessa3.call(listener, new ChatMessageThreadEvent(params));
    });
  }
  onChatMessageThreadUserRemoved(params) {
    chatlog.log(`${ChatManager.TAG}: onChatMessageThreadUserRemoved: `, params);
    this._messageListeners.forEach(listener => {
      var _listener$onChatMessa4;
      (_listener$onChatMessa4 = listener.onChatMessageThreadUserRemoved) === null || _listener$onChatMessa4 === void 0 ? void 0 : _listener$onChatMessa4.call(listener, new ChatMessageThreadEvent(params));
    });
  }
  onMessageContentChanged(params) {
    chatlog.log(`${ChatManager.TAG}: onMessageContentChanged: `, params);
    this._messageListeners.forEach(listener => {
      var _listener$onMessageCo;
      (_listener$onMessageCo = listener.onMessageContentChanged) === null || _listener$onMessageCo === void 0 ? void 0 : _listener$onMessageCo.call(listener, ChatMessage.createReceiveMessage(params.message), params.lastModifyOperatorId, params.lastModifyTime);
    });
  }
  onMessagePinChanged(params) {
    chatlog.log(`${ChatManager.TAG}: onMessagePinChanged: `, params);
    this._messageListeners.forEach(listener => {
      var _listener$onMessagePi;
      (_listener$onMessagePi = listener.onMessagePinChanged) === null || _listener$onMessagePi === void 0 ? void 0 : _listener$onMessagePi.call(listener, {
        messageId: params.messageId,
        convId: params.conversationId,
        pinOperation: params.pinOperation,
        pinInfo: new ChatMessagePinInfo(params.pinInfo)
      });
    });
  }
  static handleSendMessageCallback(self, message, callback) {
    ChatManager.handleMessageCallback(MTsendMessage, self, message, callback);
  }
  static handleResendMessageCallback(self, message, callback) {
    ChatManager.handleMessageCallback(MTresendMessage, self, message, callback);
  }
  static handleDownloadAttachmentCallback(self, message, callback) {
    ChatManager.handleMessageCallback(MTdownloadAttachment, self, message, callback);
  }
  static handleDownloadThumbnailCallback(self, message, callback) {
    ChatManager.handleMessageCallback(MTdownloadThumbnail, self, message, callback);
  }
  static handleDownloadFileCallback(self, message, method, callback) {
    ChatManager.handleMessageCallback(method, self, message, callback);
  }

  /**
   * Adds a message listener.
   *
   * @param listener The message listener to add.
   */
  addMessageListener(listener) {
    chatlog.log(`${ChatManager.TAG}: addMessageListener: `);
    this._messageListeners.add(listener);
  }

  /**
   * Removes the message listener.
   *
   * @param listener The message listener to remove.
   */
  removeMessageListener(listener) {
    chatlog.log(`${ChatManager.TAG}: removeMessageListener: `);
    this._messageListeners.delete(listener);
  }

  /**
   * Removes all message listeners.
   */
  removeAllMessageListener() {
    chatlog.log(`${ChatManager.TAG}: removeAllMessageListener: `);
    this._messageListeners.clear();
  }

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
  async sendMessage(message, callback) {
    chatlog.log(`${ChatManager.TAG}: sendMessage: ${message.msgId}, ${message.localTime}`, message);
    message.status = ChatMessageStatus.PROGRESS;
    ChatManager.handleSendMessageCallback(this, message, callback);
    let r = await Native._callMethod(MTsendMessage, {
      [MTsendMessage]: message
    });
    Native.checkErrorFromResult(r);
  }

  /**
   * Resends a message.
   *
   * @param message The message object to be resent.
   * @param callback The listener that listens for message changes.
   *
   * @throws A description of the exception. See {@link ChatError}.
   */
  async resendMessage(message, callback) {
    chatlog.log(`${ChatManager.TAG}: resendMessage: ${message.msgId}, ${message.localTime}`, message);
    if (message.msgId !== message.localMsgId && message.status === ChatMessageStatus.SUCCESS) {
      callback.onError(message.localMsgId, new ChatError({
        code: 1,
        description: 'The message had send success'
      }));
      return;
    }
    message.status = ChatMessageStatus.PROGRESS;
    ChatManager.handleResendMessageCallback(this, message, callback);
    let r = await Native._callMethod(MTresendMessage, {
      [MTsendMessage]: message
    });
    Native.checkErrorFromResult(r);
  }

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
  async sendMessageReadAck(message) {
    chatlog.log(`${ChatManager.TAG}: sendMessageReadAck: ${message.msgId}, ${message.localTime}`, message);
    let r = await Native._callMethod(MTackMessageRead, {
      [MTackMessageRead]: {
        to: message.from,
        msg_id: message.msgId
      }
    });
    Native.checkErrorFromResult(r);
  }

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
  async sendGroupMessageReadAck(msgId, groupId, opt) {
    chatlog.log(`${ChatManager.TAG}: sendGroupMessageReadAck: ${msgId}, ${groupId}`);
    let s = opt !== null && opt !== void 0 && opt.content ? {
      msg_id: msgId,
      group_id: groupId,
      content: opt === null || opt === void 0 ? void 0 : opt.content
    } : {
      msg_id: msgId,
      group_id: groupId
    };
    let r = await Native._callMethod(MTackGroupMessageRead, {
      [MTackGroupMessageRead]: s
    });
    Native.checkErrorFromResult(r);
  }

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
  async sendConversationReadAck(convId) {
    chatlog.log(`${ChatManager.TAG}: sendConversationReadAck: ${convId}`);
    let r = await Native._callMethod(MTackConversationRead, {
      [MTackConversationRead]: {
        convId: convId
      }
    });
    Native.checkErrorFromResult(r);
  }

  /**
   * Recalls the sent message.
   *
   * @param msgId The message ID.
   *
   * @throws A description of the exception. See {@link ChatError}.
   */
  async recallMessage(msgId) {
    chatlog.log(`${ChatManager.TAG}: recallMessage: ${msgId}`);
    let r = await Native._callMethod(MTrecallMessage, {
      [MTrecallMessage]: {
        msg_id: msgId
      }
    });
    Native.checkErrorFromResult(r);
  }

  /**
   * Gets a message from the local database by message ID.
   *
   * @param msgId The message ID.
   * @returns The message.
   *
   * @throws A description of the exception. See {@link ChatError}.
   */
  async getMessage(msgId) {
    chatlog.log(`${ChatManager.TAG}: getMessage: ${msgId}`);
    let r = await Native._callMethod(MTgetMessage, {
      [MTgetMessage]: {
        msg_id: msgId
      }
    });
    Native.checkErrorFromResult(r);
    const rr = r === null || r === void 0 ? void 0 : r[MTgetMessage];
    if (rr) {
      return new ChatMessage(rr);
    }
    return undefined;
  }

  /**
   * Marks all conversations as read.
   *
   * This method is for the local conversations only.
   *
   * @throws A description of the exception. See {@link ChatError}.
   */
  async markAllConversationsAsRead() {
    chatlog.log(`${ChatManager.TAG}: markAllConversationsAsRead: `);
    let r = await Native._callMethod(MTmarkAllChatMsgAsRead);
    Native.checkErrorFromResult(r);
  }

  /**
   * Gets the count of the unread messages.
   *
   * @returns The count of the unread messages.
   *
   * @throws A description of the exception. See {@link ChatError}.
   */
  async getUnreadCount() {
    chatlog.log(`${ChatManager.TAG}: getUnreadCount: `);
    let r = await Native._callMethod(MTgetUnreadMessageCount);
    Native.checkErrorFromResult(r);
    return r === null || r === void 0 ? void 0 : r[MTgetUnreadMessageCount];
  }

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
  async insertMessage(message) {
    chatlog.log(`${ChatManager.TAG}: insertMessage: `, message);
    let r = await Native._callMethod(MTinsertMessage, {
      [MTinsertMessage]: {
        msg: message
      }
    });
    Native.checkErrorFromResult(r);
  }

  /**
   * Updates the local message.
   *
   * The message will be updated both in the memory and local database.
   *
   * @return The updated message.
   *
   * @throws A description of the exception. See {@link ChatError}.
   */
  async updateMessage(message) {
    chatlog.log(`${ChatManager.TAG}: updateMessage: ${message.msgId}, ${message.localTime}`, message);
    let r = await Native._callMethod(MTupdateChatMessage, {
      [MTupdateChatMessage]: {
        message: message
      }
    });
    Native.checkErrorFromResult(r);
    const rr = r === null || r === void 0 ? void 0 : r[MTupdateChatMessage];
    return new ChatMessage(rr);
  }

  /**
   * Imports messages to the local database.
   *
   * You can only import messages that you sent or received.
   *
   * @param messages The messages to import.
   *
   * @throws A description of the exception. See {@link ChatError}.
   */
  async importMessages(messages) {
    chatlog.log(`${ChatManager.TAG}: importMessages: ${messages.length}`, messages);
    let r = await Native._callMethod(MTimportMessages, {
      [MTimportMessages]: {
        messages: messages
      }
    });
    Native.checkErrorFromResult(r);
  }

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
  async downloadAttachmentInCombine(message, callback) {
    chatlog.log(`${ChatManager.TAG}: downloadAttachmentInCombine: ${message.msgId}, ${message.localTime}`, message);
    ChatManager.handleDownloadFileCallback(this, message, MTdownloadAttachmentInCombine, callback);
    let r = await Native._callMethod(MTdownloadAttachmentInCombine, {
      [MTdownloadAttachmentInCombine]: {
        message: message
      }
    });
    Native.checkErrorFromResult(r);
  }

  /**
   * Downloads the message thumbnail.
   *
   * **Note** This method is only used to download messages thumbnail in combine type message.
   *
   * @param message The ID of the message with the thumbnail to be downloaded. Only the image messages and video messages have a thumbnail.
   *
   * @throws A description of the exception. See {@link ChatError}.
   */
  async downloadThumbnailInCombine(message, callback) {
    chatlog.log(`${ChatManager.TAG}: downloadThumbnailInCombine: ${message.msgId}, ${message.localTime}`, message);
    ChatManager.handleDownloadFileCallback(this, message, MTdownloadThumbnailInCombine, callback);
    let r = await Native._callMethod(MTdownloadThumbnailInCombine, {
      [MTdownloadThumbnailInCombine]: {
        message: message
      }
    });
    Native.checkErrorFromResult(r);
  }

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
  async downloadAttachment(message, callback) {
    chatlog.log(`${ChatManager.TAG}: downloadAttachment: ${message.msgId}, ${message.localTime}`, message);
    ChatManager.handleDownloadAttachmentCallback(this, message, callback);
    let r = await Native._callMethod(MTdownloadAttachment, {
      [MTdownloadAttachment]: {
        message: message
      }
    });
    Native.checkErrorFromResult(r);
  }

  /**
   * Downloads the message thumbnail.
   *
   * @param message The ID of the message with the thumbnail to be downloaded. Only the image messages and video messages have a thumbnail.
   *
   * @throws A description of the exception. See {@link ChatError}.
   */
  async downloadThumbnail(message, callback) {
    chatlog.log(`${ChatManager.TAG}: downloadThumbnail: ${message.msgId}, ${message.localTime}`, message);
    ChatManager.handleDownloadThumbnailCallback(this, message, callback);
    let r = await Native._callMethod(MTdownloadThumbnail, {
      [MTdownloadThumbnail]: {
        message: message
      }
    });
    Native.checkErrorFromResult(r);
  }

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
  async fetchHistoryMessages(convId, chatType, params) {
    chatlog.log(`${ChatManager.TAG}: fetchHistoryMessages: ${convId}, ${chatType}, ${params}`);
    let r = await Native._callMethod(MTfetchHistoryMessages, {
      [MTfetchHistoryMessages]: {
        convId: convId,
        convType: chatType,
        pageSize: params.pageSize ?? 20,
        startMsgId: params.startMsgId ?? '',
        direction: params.direction ?? ChatSearchDirection.UP
      }
    });
    Native.checkErrorFromResult(r);
    let ret = new ChatCursorResult({
      cursor: r === null || r === void 0 ? void 0 : r[MTfetchHistoryMessages].cursor,
      list: r === null || r === void 0 ? void 0 : r[MTfetchHistoryMessages].list,
      opt: {
        map: param => {
          return new ChatMessage(param);
        }
      }
    });
    return ret;
  }

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
  async fetchHistoryMessagesByOptions(convId, chatType, params) {
    chatlog.log(`${ChatManager.TAG}: fetchHistoryMessagesByOptions: ${convId}, ${chatType}, ${params}`);
    let r = await Native._callMethod(MTfetchHistoryMessagesByOptions, {
      [MTfetchHistoryMessagesByOptions]: {
        convId: convId,
        convType: chatType,
        pageSize: (params === null || params === void 0 ? void 0 : params.pageSize) ?? 20,
        cursor: (params === null || params === void 0 ? void 0 : params.cursor) ?? '',
        options: params === null || params === void 0 ? void 0 : params.options
      }
    });
    Native.checkErrorFromResult(r);
    let ret = new ChatCursorResult({
      cursor: r === null || r === void 0 ? void 0 : r[MTfetchHistoryMessagesByOptions].cursor,
      list: r === null || r === void 0 ? void 0 : r[MTfetchHistoryMessagesByOptions].list,
      opt: {
        map: param => {
          return new ChatMessage(param);
        }
      }
    });
    return ret;
  }

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
  async searchMsgFromDB(keywords) {
    let timestamp = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : -1;
    let maxCount = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 20;
    let from = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : '';
    let direction = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : ChatSearchDirection.UP;
    chatlog.log(`${ChatManager.TAG}: searchMsgFromDB: ${keywords}, ${timestamp}, ${maxCount}, ${from}`);
    let r = await Native._callMethod(MTsearchChatMsgFromDB, {
      [MTsearchChatMsgFromDB]: {
        keywords: keywords,
        timeStamp: timestamp,
        maxCount: maxCount,
        from: from,
        direction: direction === ChatSearchDirection.UP ? 'up' : 'down'
      }
    });
    Native.checkErrorFromResult(r);
    let ret = new Array(0);
    const rr = r === null || r === void 0 ? void 0 : r[MTsearchChatMsgFromDB];
    if (rr) {
      rr.forEach(element => {
        ret.push(new ChatMessage(element));
      });
    }
    return ret;
  }

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
  async getMsgsWithKeyword(params) {
    const {
      keywords,
      timestamp = -1,
      maxCount = 20,
      from = '',
      direction = ChatSearchDirection.UP,
      searchScope = ChatMessageSearchScope.All
    } = params;
    chatlog.log(`${ChatManager.TAG}: searchMsgFromDB: ${keywords}, ${timestamp}, ${maxCount}, ${from}`);
    let r = await Native._callMethod(MTsearchChatMsgFromDB, {
      [MTsearchChatMsgFromDB]: {
        keywords: keywords,
        timeStamp: timestamp,
        maxCount: maxCount,
        from: from,
        direction: direction === ChatSearchDirection.UP ? 'up' : 'down',
        searchScope: searchScope
      }
    });
    Native.checkErrorFromResult(r);
    let ret = new Array(0);
    const rr = r === null || r === void 0 ? void 0 : r[MTsearchChatMsgFromDB];
    if (rr) {
      rr.forEach(element => {
        ret.push(new ChatMessage(element));
      });
    }
    return ret;
  }

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
  async fetchGroupAcks(msgId, groupId, startAckId) {
    let pageSize = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;
    chatlog.log(`${ChatManager.TAG}: asyncFetchGroupAcks: ${msgId}, ${startAckId}, ${pageSize}`);
    let r = await Native._callMethod(MTasyncFetchGroupAcks, {
      [MTasyncFetchGroupAcks]: {
        msg_id: msgId,
        ack_id: startAckId,
        pageSize: pageSize,
        group_id: groupId
      }
    });
    Native.checkErrorFromResult(r);
    let ret = new ChatCursorResult({
      cursor: r === null || r === void 0 ? void 0 : r[MTasyncFetchGroupAcks].cursor,
      list: r === null || r === void 0 ? void 0 : r[MTasyncFetchGroupAcks].list,
      opt: {
        map: param => {
          return new ChatGroupMessageAck(param);
        }
      }
    });
    return ret;
  }

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
  async removeConversationFromServer(convId, convType) {
    let isDeleteMessage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
    chatlog.log(`${ChatManager.TAG}: removeConversationFromServer: ${convId}, ${convType}, ${isDeleteMessage}`);
    let ct = 0;
    switch (convType) {
      case ChatConversationType.PeerChat:
        ct = 0;
        break;
      case ChatConversationType.GroupChat:
        ct = 1;
        break;
      case ChatConversationType.RoomChat:
        ct = 2;
        break;
      default:
        throw new ChatError({
          code: 1,
          description: `This type is not supported. ` + convType
        });
    }
    let r = await Native._callMethod(MTdeleteRemoteConversation, {
      [MTdeleteRemoteConversation]: {
        conversationId: convId,
        conversationType: ct,
        isDeleteRemoteMessage: isDeleteMessage
      }
    });
    Native.checkErrorFromResult(r);
  }

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
  async getConversation(convId, convType) {
    let createIfNeed = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
    let isChatThread = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
    chatlog.log(`${ChatManager.TAG}: getConversation: ${convId}, ${convType}, ${createIfNeed}, ${isChatThread}`);
    let r = await Native._callMethod(MTgetConversation, {
      [MTgetConversation]: {
        convId: convId,
        convType: convType,
        createIfNeed: createIfNeed,
        isChatThread: isChatThread
      }
    });
    Native.checkErrorFromResult(r);
    const rr = r === null || r === void 0 ? void 0 : r[MTgetConversation];
    if (rr) {
      return new ChatConversation(rr);
    }
    return undefined;
  }

  /**
   * Gets all conversations from the local database.
   *
   * Conversations will be first retrieved from the memory. If no conversation is found, the SDK retrieves from the local database.
   *
   * @returns The retrieved conversations.
   *
   * @throws A description of the exception. See {@link ChatError}.
   */
  async getAllConversations() {
    chatlog.log(`${ChatManager.TAG}: getAllConversations:`);
    let r = await Native._callMethod(MTloadAllConversations);
    Native.checkErrorFromResult(r);
    let ret = new Array(0);
    const rr = r === null || r === void 0 ? void 0 : r[MTloadAllConversations];
    if (rr) {
      rr.forEach(element => {
        ret.push(new ChatConversation(element));
      });
    }
    return ret;
  }

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
  async fetchAllConversations() {
    chatlog.log(`${ChatManager.TAG}: fetchAllConversations:`);
    let r = await Native._callMethod(MTgetConversationsFromServer);
    Native.checkErrorFromResult(r);
    let ret = new Array(0);
    const rr = r === null || r === void 0 ? void 0 : r[MTgetConversationsFromServer];
    if (rr) {
      rr.forEach(element => {
        ret.push(new ChatConversation(element));
      });
    }
    return ret;
  }

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
  async deleteConversation(convId) {
    let withMessage = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
    chatlog.log(`${ChatManager.TAG}: deleteConversation: ${convId}, ${withMessage}`);
    let r = await Native._callMethod(MTdeleteConversation, {
      [MTdeleteConversation]: {
        convId: convId,
        deleteMessages: withMessage
      }
    });
    Native.checkErrorFromResult(r);
  }

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
  async getLatestMessage(convId, convType) {
    let isChatThread = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
    chatlog.log(`${ChatManager.TAG}: latestMessage: `, convId, convType, isChatThread);
    let r = await Native._callMethod(MTgetLatestMessage, {
      [MTgetLatestMessage]: {
        convId: convId,
        convType: convType,
        isChatThread: isChatThread
      }
    });
    ChatManager.checkErrorFromResult(r);
    const rr = r === null || r === void 0 ? void 0 : r[MTgetLatestMessage];
    if (rr) {
      return new ChatMessage(rr);
    }
    return undefined;
  }

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
  async getLatestReceivedMessage(convId, convType) {
    let isChatThread = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
    chatlog.log(`${ChatManager.TAG}: lastReceivedMessage: `, convId, convType, isChatThread);
    let r = await Native._callMethod(MTgetLatestMessageFromOthers, {
      [MTgetLatestMessageFromOthers]: {
        convId: convId,
        convType: convType,
        isChatThread: isChatThread
      }
    });
    ChatManager.checkErrorFromResult(r);
    const rr = r === null || r === void 0 ? void 0 : r[MTgetLatestMessageFromOthers];
    if (rr) {
      return new ChatMessage(rr);
    }
    return undefined;
  }

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
  async getConversationUnreadCount(convId, convType) {
    let isChatThread = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
    chatlog.log(`${ChatManager.TAG}: getConversationUnreadCount: `, convId, convType, isChatThread);
    let r = await Native._callMethod(MTgetUnreadMsgCount, {
      [MTgetUnreadMsgCount]: {
        convId: convId,
        convType: convType,
        isChatThread: isChatThread
      }
    });
    ChatManager.checkErrorFromResult(r);
    const ret = r === null || r === void 0 ? void 0 : r[MTgetUnreadMsgCount];
    return ret;
  }

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
  async getConversationMessageCount(convId, convType) {
    let isChatThread = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
    chatlog.log(`${ChatManager.TAG}: getConversationMessageCount: `, convId, convType, isChatThread);
    let r = await Native._callMethod(MTgetMsgCount, {
      [MTgetMsgCount]: {
        convId: convId,
        convType: convType,
        isChatThread: isChatThread
      }
    });
    ChatManager.checkErrorFromResult(r);
    const ret = r === null || r === void 0 ? void 0 : r[MTgetMsgCount];
    return ret;
  }

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
  async markMessageAsRead(convId, convType, msgId) {
    let isChatThread = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
    chatlog.log(`${ChatManager.TAG}: markMessageAsRead: `, convId, convType, msgId, isChatThread);
    let r = await Native._callMethod(MTmarkMessageAsRead, {
      [MTmarkMessageAsRead]: {
        convId: convId,
        convType: convType,
        msg_id: msgId,
        isChatThread: isChatThread
      }
    });
    ChatManager.checkErrorFromResult(r);
  }

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
  async markAllMessagesAsRead(convId, convType) {
    let isChatThread = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
    chatlog.log(`${ChatManager.TAG}: markAllMessagesAsRead: `, convId, convType, isChatThread);
    let r = await Native._callMethod(MTmarkAllMessagesAsRead, {
      [MTmarkAllMessagesAsRead]: {
        convId: convId,
        convType: convType,
        isChatThread: isChatThread
      }
    });
    ChatManager.checkErrorFromResult(r);
  }

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
  async updateConversationMessage(convId, convType, msg) {
    let isChatThread = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
    chatlog.log(`${ChatManager.TAG}: updateConversationMessage: `, convId, convType, msg, isChatThread);
    let r = await Native._callMethod(MTupdateConversationMessage, {
      [MTupdateConversationMessage]: {
        convId: convId,
        convType: convType,
        msg: msg,
        isChatThread: isChatThread
      }
    });
    ChatManager.checkErrorFromResult(r);
  }

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
  async deleteMessage(convId, convType, msgId) {
    let isChatThread = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
    chatlog.log(`${ChatManager.TAG}: deleteMessage: ${convId}, ${convType}, ${msgId}, ${isChatThread}`);
    let r = await Native._callMethod(MTremoveMessage, {
      [MTremoveMessage]: {
        convId: convId,
        convType: convType,
        msg_id: msgId,
        isChatThread: isChatThread
      }
    });
    ChatManager.checkErrorFromResult(r);
  }

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
  async deleteMessagesWithTimestamp(convId, convType, params) {
    let isChatThread = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
    chatlog.log(`${ChatManager.TAG}: deleteMessagesWithTimestamp: ${convId}, ${convType}, ${params}, ${isChatThread}`);
    let r = await Native._callMethod(MTdeleteMessagesWithTs, {
      [MTdeleteMessagesWithTs]: {
        convId: convId,
        convType: convType,
        startTs: params.startTs,
        endTs: params.endTs,
        isChatThread: isChatThread ?? false
      }
    });
    ChatManager.checkErrorFromResult(r);
  }

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
  async deleteConversationAllMessages(convId, convType) {
    let isChatThread = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
    chatlog.log(`${ChatManager.TAG}: deleteConversationAllMessages: `, convId, convType, isChatThread);
    let r = await Native._callMethod(MTclearAllMessages, {
      [MTclearAllMessages]: {
        convId: convId,
        convType: convType,
        isChatThread: isChatThread
      }
    });
    ChatManager.checkErrorFromResult(r);
  }

  /**
   * Deletes local messages with timestamp that is before the specified one.
   *
   * @param timestamp The specified Unix timestamp(milliseconds).
   *
   * @throws A description of the exception. See {@link ChatError}.
   */
  async deleteMessagesBeforeTimestamp(timestamp) {
    chatlog.log(`${ChatManager.TAG}: deleteMessagesBeforeTimestamp:`, timestamp);
    let r = await Native._callMethod(MTdeleteMessagesBeforeTimestamp, {
      [MTdeleteMessagesBeforeTimestamp]: {
        timestamp: timestamp
      }
    });
    ChatManager.checkErrorFromResult(r);
  }

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
  async getMessagesWithMsgType(convId, convType, msgType) {
    let direction = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : ChatSearchDirection.UP;
    let timestamp = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : -1;
    let count = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : 20;
    let sender = arguments.length > 6 ? arguments[6] : undefined;
    let isChatThread = arguments.length > 7 && arguments[7] !== undefined ? arguments[7] : false;
    chatlog.log(`${ChatManager.TAG}: getMessagesWithMsgType: `, convId, convType, msgType, direction, timestamp, count, sender, isChatThread);
    let r = await Native._callMethod(MTloadMsgWithMsgType, {
      [MTloadMsgWithMsgType]: {
        convId: convId,
        convType: convType,
        msg_type: msgType,
        direction: direction === ChatSearchDirection.UP ? 'up' : 'down',
        timestamp: timestamp,
        count: count,
        sender: sender ?? '',
        isChatThread: isChatThread
      }
    });
    ChatManager.checkErrorFromResult(r);
    const ret = [];
    const rr = r === null || r === void 0 ? void 0 : r[MTloadMsgWithMsgType];
    if (rr) {
      Object.entries(rr).forEach(value => {
        ret.push(new ChatMessage(value[1]));
      });
    }
    return ret;
  }

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
  async getMsgsWithMsgType(params) {
    const {
      convId,
      convType,
      msgType,
      direction = ChatSearchDirection.UP,
      timestamp = -1,
      count = 20,
      sender,
      isChatThread = false
    } = params;
    chatlog.log(`${ChatManager.TAG}: getMsgsWithMsgType: `, convId, convType, msgType, direction, timestamp, count, sender, isChatThread);
    let r = await Native._callMethod(MTloadMsgWithMsgType, {
      [MTloadMsgWithMsgType]: {
        convId: convId,
        convType: convType,
        msg_type: msgType,
        direction: direction === ChatSearchDirection.UP ? 'up' : 'down',
        timestamp: timestamp,
        count: count,
        sender: sender ?? '',
        isChatThread: isChatThread
      }
    });
    ChatManager.checkErrorFromResult(r);
    const ret = [];
    const rr = r === null || r === void 0 ? void 0 : r[MTloadMsgWithMsgType];
    if (rr) {
      Object.entries(rr).forEach(value => {
        ret.push(new ChatMessage(value[1]));
      });
    }
    return ret;
  }

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
  async getMessages(convId, convType, startMsgId) {
    let direction = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : ChatSearchDirection.UP;
    let loadCount = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 20;
    let isChatThread = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : false;
    chatlog.log(`${ChatManager.TAG}: getMessages: `, convId, convType, startMsgId, direction, loadCount, isChatThread);
    let r = await Native._callMethod(MTloadMsgWithStartId, {
      [MTloadMsgWithStartId]: {
        convId: convId,
        convType: convType,
        direction: direction === ChatSearchDirection.UP ? 'up' : 'down',
        startId: startMsgId,
        count: loadCount,
        isChatThread: isChatThread
      }
    });
    ChatManager.checkErrorFromResult(r);
    const ret = [];
    const rr = r === null || r === void 0 ? void 0 : r[MTloadMsgWithStartId];
    if (rr) {
      Object.entries(rr).forEach(value => {
        ret.push(new ChatMessage(value[1]));
      });
    }
    return ret;
  }

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
  async getMsgs(params) {
    const {
      convId,
      convType,
      startMsgId,
      direction = ChatSearchDirection.UP,
      loadCount = 20,
      isChatThread = false
    } = params;
    chatlog.log(`${ChatManager.TAG}: getMsgs: `, convId, convType, startMsgId, direction, loadCount, isChatThread);
    let r = await Native._callMethod(MTloadMsgWithStartId, {
      [MTloadMsgWithStartId]: {
        convId: convId,
        convType: convType,
        direction: direction === ChatSearchDirection.UP ? 'up' : 'down',
        startId: startMsgId,
        count: loadCount,
        isChatThread: isChatThread
      }
    });
    ChatManager.checkErrorFromResult(r);
    const ret = [];
    const rr = r === null || r === void 0 ? void 0 : r[MTloadMsgWithStartId];
    if (rr) {
      Object.entries(rr).forEach(value => {
        ret.push(new ChatMessage(value[1]));
      });
    }
    return ret;
  }

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
  async getMessagesWithKeyword(convId, convType, keywords) {
    let direction = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : ChatSearchDirection.UP;
    let timestamp = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : -1;
    let count = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : 20;
    let sender = arguments.length > 6 ? arguments[6] : undefined;
    let isChatThread = arguments.length > 7 && arguments[7] !== undefined ? arguments[7] : false;
    chatlog.log(`${ChatManager.TAG}: getMessagesWithKeyword: `, convId, convType, keywords, direction, timestamp, count, sender, isChatThread);
    let r = await Native._callMethod(MTloadMsgWithKeywords, {
      [MTloadMsgWithKeywords]: {
        convId: convId,
        convType: convType,
        keywords: keywords,
        direction: direction === ChatSearchDirection.UP ? 'up' : 'down',
        timestamp: timestamp,
        count: count,
        sender: sender,
        isChatThread: isChatThread
      }
    });
    ChatManager.checkErrorFromResult(r);
    const ret = [];
    const rr = r === null || r === void 0 ? void 0 : r[MTloadMsgWithKeywords];
    if (rr) {
      Object.entries(rr).forEach(value => {
        ret.push(new ChatMessage(value[1]));
      });
    }
    return ret;
  }

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
  async getConvMsgsWithKeyword(params) {
    const {
      convId,
      convType,
      keywords,
      direction = ChatSearchDirection.UP,
      timestamp = -1,
      count = 20,
      sender,
      searchScope = ChatMessageSearchScope.All,
      isChatThread = false
    } = params;
    chatlog.log(`${ChatManager.TAG}: getMsgsWithKeyword: `, convId, convType, keywords, direction, timestamp, count, searchScope, sender, isChatThread);
    let r = await Native._callMethod(MTloadMsgWithKeywords, {
      [MTloadMsgWithKeywords]: {
        convId: convId,
        convType: convType,
        keywords: keywords,
        direction: direction === ChatSearchDirection.UP ? 'up' : 'down',
        timestamp: timestamp,
        count: count,
        sender: sender,
        searchScope: searchScope,
        isChatThread: isChatThread
      }
    });
    ChatManager.checkErrorFromResult(r);
    const ret = [];
    const rr = r === null || r === void 0 ? void 0 : r[MTloadMsgWithKeywords];
    if (rr) {
      Object.entries(rr).forEach(value => {
        ret.push(new ChatMessage(value[1]));
      });
    }
    return ret;
  }

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
  async getMessageWithTimestamp(convId, convType, startTime, endTime) {
    let direction = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : ChatSearchDirection.UP;
    let count = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : 20;
    let isChatThread = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : false;
    chatlog.log(`${ChatManager.TAG}: getMessageWithTimestamp: `, convId, convType, startTime, endTime, direction, count, isChatThread);
    let r = await Native._callMethod(MTloadMsgWithTime, {
      [MTloadMsgWithTime]: {
        convId: convId,
        convType: convType,
        startTime: startTime,
        endTime: endTime,
        direction: direction === ChatSearchDirection.UP ? 'up' : 'down',
        count: count,
        isChatThread: isChatThread
      }
    });
    ChatManager.checkErrorFromResult(r);
    const ret = [];
    const rr = r === null || r === void 0 ? void 0 : r[MTloadMsgWithTime];
    if (rr) {
      Object.entries(rr).forEach(value => {
        ret.push(new ChatMessage(value[1]));
      });
    }
    return ret;
  }

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
  async getMsgWithTimestamp(params) {
    const {
      convId,
      convType,
      startTime,
      endTime,
      direction = ChatSearchDirection.UP,
      count = 20,
      isChatThread = false
    } = params;
    chatlog.log(`${ChatManager.TAG}: getMsgWithTimestamp: `, convId, convType, startTime, endTime, direction, count, isChatThread);
    let r = await Native._callMethod(MTloadMsgWithTime, {
      [MTloadMsgWithTime]: {
        convId: convId,
        convType: convType,
        startTime: startTime,
        endTime: endTime,
        direction: direction === ChatSearchDirection.UP ? 'up' : 'down',
        count: count,
        isChatThread: isChatThread
      }
    });
    ChatManager.checkErrorFromResult(r);
    const ret = [];
    const rr = r === null || r === void 0 ? void 0 : r[MTloadMsgWithTime];
    if (rr) {
      Object.entries(rr).forEach(value => {
        ret.push(new ChatMessage(value[1]));
      });
    }
    return ret;
  }

  /**
   * Translates a text message.
   *
   * @param msg The text message to translate.
   * @param languages The target languages.
   * @returns The translation.
   *
   * @throws A description of the exception. See {@link ChatError}.
   */
  async translateMessage(msg, languages) {
    chatlog.log(`${ChatManager.TAG}: translateMessage: `, msg, languages);
    let r = await Native._callMethod(MTtranslateMessage, {
      [MTtranslateMessage]: {
        message: msg,
        languages: languages
      }
    });
    ChatManager.checkErrorFromResult(r);
    const rr = r === null || r === void 0 ? void 0 : r[MTtranslateMessage];
    return new ChatMessage(rr === null || rr === void 0 ? void 0 : rr.message);
  }

  /**
   * Gets all languages supported by the translation service.
   *
   * @returns The list of languages supported for translation.
   *
   * @throws A description of the exception. See {@link ChatError}.
   */
  async fetchSupportedLanguages() {
    chatlog.log(`${ChatManager.TAG}: fetchSupportedLanguages: `);
    let r = await Native._callMethod(MTfetchSupportLanguages);
    ChatManager.checkErrorFromResult(r);
    const ret = [];
    const rr = r === null || r === void 0 ? void 0 : r[MTfetchSupportLanguages];
    if (rr) {
      rr.forEach(value => {
        ret.push(new ChatTranslateLanguage(value));
      });
    }
    return ret;
  }

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
  async setConversationExtension(convId, convType, ext) {
    let isChatThread = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
    chatlog.log(`${ChatManager.TAG}: setConversationExtension: `, convId, convType, ext, isChatThread);
    let r = await Native._callMethod(MTsyncConversationExt, {
      [MTsyncConversationExt]: {
        convId: convId,
        convType: convType,
        ext: ext,
        isChatThread: isChatThread
      }
    });
    ChatManager.checkErrorFromResult(r);
  }

  /**
   * Adds a Reaction.
   *
   * @param reaction The Reaction content.
   * @param msgId The ID of the message for which the Reaction is added.
   *
   * @throws A description of the exception. See {@link ChatError}.
   */
  async addReaction(reaction, msgId) {
    chatlog.log(`${ChatManager.TAG}: addReaction: `, reaction, msgId);
    let r = await Native._callMethod(MTaddReaction, {
      [MTaddReaction]: {
        reaction,
        msgId
      }
    });
    ChatManager.checkErrorFromResult(r);
  }

  /**
   * Deletes a Reaction.
   *
   * @param reaction The Reaction to delete.
   * @param msgId The message ID.
   *
   * @throws A description of the exception. See {@link ChatError}.
   */
  async removeReaction(reaction, msgId) {
    chatlog.log(`${ChatManager.TAG}: removeReaction: `, reaction, msgId);
    let r = await Native._callMethod(MTremoveReaction, {
      [MTremoveReaction]: {
        reaction,
        msgId
      }
    });
    ChatManager.checkErrorFromResult(r);
  }

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
  async fetchReactionList(msgIds, groupId, chatType) {
    chatlog.log(`${ChatManager.TAG}: fetchReactionList: `, msgIds, groupId, chatType);
    let r = await Native._callMethod(MTfetchReactionList, {
      [MTfetchReactionList]: {
        msgIds,
        groupId,
        chatType
      }
    });
    ChatManager.checkErrorFromResult(r);
    const ret = new Map();
    Object.entries(r === null || r === void 0 ? void 0 : r[MTfetchReactionList]).forEach(v => {
      const list = [];
      Object.entries(v[1]).forEach(vv => {
        list.push(new ChatMessageReaction(vv[1]));
      });
      ret.set(v[0], list);
    });
    return ret;
  }

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
  async fetchReactionDetail(msgId, reaction, cursor, pageSize) {
    chatlog.log(`${ChatManager.TAG}: fetchReactionDetail: `, msgId, reaction, cursor, pageSize);
    let r = await Native._callMethod(MTfetchReactionDetail, {
      [MTfetchReactionDetail]: {
        msgId,
        reaction,
        cursor,
        pageSize
      }
    });
    ChatManager.checkErrorFromResult(r);
    let ret = new ChatCursorResult({
      cursor: r === null || r === void 0 ? void 0 : r[MTfetchReactionDetail].cursor,
      list: r === null || r === void 0 ? void 0 : r[MTfetchReactionDetail].list,
      opt: {
        map: param => {
          return new ChatMessageReaction(param);
        }
      }
    });
    return ret;
  }

  /**
   * Reports an inappropriate message.
   *
   * @param msgId The ID of the message to report.
   * @param tag The tag of the inappropriate message. You need to type a custom tag, like `porn` or `ad`.
   * @param reason The reporting reason. You need to type a specific reason.
   *
   * @throws A description of the exception. See {@link ChatError}.
   */
  async reportMessage(msgId, tag, reason) {
    chatlog.log(`${ChatManager.TAG}: reportMessage: `, msgId, tag, reason);
    let r = await Native._callMethod(MTreportMessage, {
      [MTreportMessage]: {
        msgId,
        tag,
        reason
      }
    });
    ChatManager.checkErrorFromResult(r);
  }

  /**
   * Gets the list of Reactions from a message.
   *
   * @param msgId The message ID.
   * @returns If success, the Reaction list is returned; otherwise, an exception will be thrown.
   *
   * @throws A description of the exception. See {@link ChatError}.
   */
  async getReactionList(msgId) {
    chatlog.log(`${ChatManager.TAG}: getReactionList: `, msgId);
    let r = await Native._callMethod(MTgetReactionList, {
      [MTgetReactionList]: {
        msgId
      }
    });
    ChatManager.checkErrorFromResult(r);
    const ret = [];
    if (r !== null && r !== void 0 && r[MTgetReactionList]) {
      Object.entries(r === null || r === void 0 ? void 0 : r[MTgetReactionList]).forEach(value => {
        ret.push(new ChatMessageReaction(value[1]));
      });
    }
    return ret;
  }

  /**
   * Gets the number of members that have read the group message.
   *
   * @param msgId The message ID.
   * @returns If success, the SDK returns the number of members that have read the group message; otherwise, an exception will be thrown.
   *
   * @throws A description of the exception. See {@link ChatError}.
   */
  async groupAckCount(msgId) {
    chatlog.log(`${ChatManager.TAG}: groupAckCount: `, msgId);
    let r = await Native._callMethod(MTgroupAckCount, {
      [MTgroupAckCount]: {
        msgId
      }
    });
    ChatManager.checkErrorFromResult(r);
    if ((r === null || r === void 0 ? void 0 : r[MTgroupAckCount]) !== undefined) {
      return r === null || r === void 0 ? void 0 : r[MTgroupAckCount];
    }
    return undefined;
  }

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
  async createChatThread(name, msgId, parentId) {
    chatlog.log(`${ChatManager.TAG}: createChatThread: `, name, msgId, parentId);
    let r = await Native._callMethod(MTcreateChatThread, {
      [MTcreateChatThread]: {
        name: name,
        messageId: msgId,
        parentId: parentId
      }
    });
    ChatManager.checkErrorFromResult(r);
    return new ChatMessageThread(r === null || r === void 0 ? void 0 : r[MTcreateChatThread]);
  }

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
  async joinChatThread(chatThreadId) {
    chatlog.log(`${ChatManager.TAG}: joinChatThread: `, chatThreadId);
    let r = await Native._callMethod(MTjoinChatThread, {
      [MTjoinChatThread]: {
        threadId: chatThreadId
      }
    });
    ChatManager.checkErrorFromResult(r);
    return new ChatMessageThread(r === null || r === void 0 ? void 0 : r[MTjoinChatThread]);
  }

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
  async leaveChatThread(chatThreadId) {
    chatlog.log(`${ChatManager.TAG}: leaveChatThread: `, chatThreadId);
    let r = await Native._callMethod(MTleaveChatThread, {
      [MTleaveChatThread]: {
        threadId: chatThreadId
      }
    });
    ChatManager.checkErrorFromResult(r);
  }

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
  async destroyChatThread(chatThreadId) {
    chatlog.log(`${ChatManager.TAG}: destroyChatThread: `, chatThreadId);
    let r = await Native._callMethod(MTdestroyChatThread, {
      [MTdestroyChatThread]: {
        threadId: chatThreadId
      }
    });
    ChatManager.checkErrorFromResult(r);
  }

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
  async updateChatThreadName(chatThreadId, newName) {
    chatlog.log(`${ChatManager.TAG}: updateChatThreadName: `, chatThreadId, newName);
    let r = await Native._callMethod(MTupdateChatThreadSubject, {
      [MTupdateChatThreadSubject]: {
        threadId: chatThreadId,
        name: newName
      }
    });
    ChatManager.checkErrorFromResult(r);
  }

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
  async removeMemberWithChatThread(chatThreadId, memberId) {
    chatlog.log(`${ChatManager.TAG}: removeMemberWithChatThread: `, chatThreadId, memberId);
    let r = await Native._callMethod(MTremoveMemberFromChatThread, {
      [MTremoveMemberFromChatThread]: {
        threadId: chatThreadId,
        memberId: memberId
      }
    });
    ChatManager.checkErrorFromResult(r);
  }

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
  async fetchMembersWithChatThreadFromServer(chatThreadId) {
    let cursor = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
    let pageSize = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 20;
    chatlog.log(`${ChatManager.TAG}: fetchMembersWithChatThreadFromServer: `, chatThreadId, cursor, pageSize);
    let r = await Native._callMethod(MTfetchChatThreadMember, {
      [MTfetchChatThreadMember]: {
        threadId: chatThreadId,
        cursor: cursor,
        pageSize: pageSize
      }
    });
    ChatManager.checkErrorFromResult(r);
    let ret = new ChatCursorResult({
      cursor: r === null || r === void 0 ? void 0 : r[MTfetchChatThreadMember].cursor,
      list: r === null || r === void 0 ? void 0 : r[MTfetchChatThreadMember].list,
      opt: {
        map: param => {
          return param;
        }
      }
    });
    return ret;
  }

  /**
   * Uses the pagination to get the list of message threads that the current user has joined.
   *
   * @param cursor The position from which to start getting data. At the first method call, if you set `cursor` to `null` or an empty string, the SDK will get data in the reverse chronological order of when the user joins the message threads.
   * @param pageSize The number of message threads that you expect to get on each page. The value range is [1,400].
   * @returns If success, a list of message threads is returned; otherwise, an exception will be thrown.
   *
   * @throws A description of the exception. See {@link ChatError}.
   */
  async fetchJoinedChatThreadFromServer() {
    let cursor = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
    let pageSize = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 20;
    chatlog.log(`${ChatManager.TAG}: fetchJoinedChatThreadFromServer: `, cursor, pageSize);
    let r = await Native._callMethod(MTfetchJoinedChatThreads, {
      [MTfetchJoinedChatThreads]: {
        cursor: cursor,
        pageSize: pageSize
      }
    });
    ChatManager.checkErrorFromResult(r);
    let ret = new ChatCursorResult({
      cursor: r === null || r === void 0 ? void 0 : r[MTfetchJoinedChatThreads].cursor,
      list: r === null || r === void 0 ? void 0 : r[MTfetchJoinedChatThreads].list,
      opt: {
        map: param => {
          return new ChatMessageThread(param);
        }
      }
    });
    return ret;
  }

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
  async fetchJoinedChatThreadWithParentFromServer(parentId) {
    let cursor = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
    let pageSize = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 20;
    chatlog.log(`${ChatManager.TAG}: fetchJoinedChatThreadWithParentFromServer: `, parentId, cursor, pageSize);
    let r = await Native._callMethod(MTfetchJoinedChatThreadsWithParentId, {
      [MTfetchJoinedChatThreadsWithParentId]: {
        parentId: parentId,
        cursor: cursor,
        pageSize: pageSize
      }
    });
    ChatManager.checkErrorFromResult(r);
    let ret = new ChatCursorResult({
      cursor: r === null || r === void 0 ? void 0 : r[MTfetchJoinedChatThreadsWithParentId].cursor,
      list: r === null || r === void 0 ? void 0 : r[MTfetchJoinedChatThreadsWithParentId].list,
      opt: {
        map: param => {
          return new ChatMessageThread(param);
        }
      }
    });
    return ret;
  }

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
  async fetchChatThreadWithParentFromServer(parentId) {
    let cursor = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
    let pageSize = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 20;
    chatlog.log(`${ChatManager.TAG}: fetchChatThreadWithParentFromServer: `, parentId, cursor, pageSize);
    let r = await Native._callMethod(MTfetchChatThreadsWithParentId, {
      [MTfetchChatThreadsWithParentId]: {
        parentId: parentId,
        cursor: cursor,
        pageSize: pageSize
      }
    });
    ChatManager.checkErrorFromResult(r);
    let ret = new ChatCursorResult({
      cursor: r === null || r === void 0 ? void 0 : r[MTfetchChatThreadsWithParentId].cursor,
      list: r === null || r === void 0 ? void 0 : r[MTfetchChatThreadsWithParentId].list,
      opt: {
        map: param => {
          return new ChatMessageThread(param);
        }
      }
    });
    return ret;
  }

  /**
   * Gets the last reply in the specified message threads from the server.
   *
   * @param chatThreadIds The list of message thread IDs to query. You can pass a maximum of 20 message thread IDs each time.
   * @returns If success, a list of last replies are returned; otherwise, an exception will be thrown.
   *
   * @throws A description of the exception. See {@link ChatError}.
   */
  async fetchLastMessageWithChatThread(chatThreadIds) {
    chatlog.log(`${ChatManager.TAG}: fetchLastMessageWithChatThread: `, chatThreadIds);
    let r = await Native._callMethod(MTfetchLastMessageWithChatThreads, {
      [MTfetchLastMessageWithChatThreads]: {
        threadIds: chatThreadIds
      }
    });
    ChatManager.checkErrorFromResult(r);
    const ret = new Map();
    Object.entries(r === null || r === void 0 ? void 0 : r[MTfetchLastMessageWithChatThreads]).forEach(v => {
      ret.set(v[0], new ChatMessage(v[1]));
    });
    return ret;
  }

  /**
   * Gets the details of the message thread from the server.
   *
   * @param chatThreadId The message thread ID.
   * @returns If success, the details of the message thread are returned; otherwise, an exception will be thrown.
   *
   * @throws A description of the exception. See {@link ChatError}.
   */
  async fetchChatThreadFromServer(chatThreadId) {
    chatlog.log(`${ChatManager.TAG}: fetchChatThreadFromServer: `, chatThreadId);
    let r = await Native._callMethod(MTfetchChatThreadDetail, {
      [MTfetchChatThreadDetail]: {
        threadId: chatThreadId
      }
    });
    ChatManager.checkErrorFromResult(r);
    const rr = r === null || r === void 0 ? void 0 : r[MTfetchChatThreadDetail];
    if (rr) {
      return new ChatMessageThread(rr);
    }
    return undefined;
  }

  /**
   * Gets the details of the message thread from the memory.
   *
   * @param msgId The message thread ID.
   * @returns If success, the details of the message thread are returned; otherwise, an exception will be thrown.
   *
   * @throws A description of the exception. See {@link ChatError}.
   */
  async getMessageThread(msgId) {
    chatlog.log(`${ChatManager.TAG}: getMessageThread: `, msgId);
    let r = await Native._callMethod(MTgetMessageThread, {
      [MTgetMessageThread]: {
        msgId: msgId
      }
    });
    ChatManager.checkErrorFromResult(r);
    const rr = r === null || r === void 0 ? void 0 : r[MTgetMessageThread];
    if (rr) {
      return new ChatMessageThread(rr);
    }
    return undefined;
  }

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
  async getThreadConversation(convId) {
    let createIfNeed = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
    chatlog.log(`${ChatManager.TAG}: getThreadConversation: `, convId, createIfNeed);
    let r = await Native._callMethod(MTgetThreadConversation, {
      [MTgetThreadConversation]: {
        convId: convId,
        createIfNeed: createIfNeed
      }
    });
    Native.checkErrorFromResult(r);
    const rr = r === null || r === void 0 ? void 0 : r[MTgetThreadConversation];
    if (rr) {
      return new ChatConversation(rr);
    }
    return undefined;
  }

  /**
   * Gets conversations from the server with pagination.
   *
   * @param pageSize The number of conversations to retrieve on each page.
   * @param pageNum The current page number, starting from 1.
   * @returns If success, the list of conversations is returned; otherwise, an exception will be thrown.
   *
   * @throws A description of the exception. See {@link ChatError}.
   */
  async fetchConversationsFromServerWithPage(pageSize, pageNum) {
    chatlog.log(`${ChatManager.TAG}: fetchConversationsFromServerWithPage: `, pageSize, pageNum);
    let r = await Native._callMethod(MTfetchConversationsFromServerWithPage, {
      [MTfetchConversationsFromServerWithPage]: {
        pageSize: pageSize,
        pageNum: pageNum
      }
    });
    Native.checkErrorFromResult(r);
    let ret = [];
    const rr = r === null || r === void 0 ? void 0 : r[MTfetchConversationsFromServerWithPage];
    if (rr) {
      rr.forEach(element => {
        ret.push(new ChatConversation(element));
      });
    }
    return ret;
  }

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
  async removeMessagesFromServerWithMsgIds(convId, convType, msgIds) {
    let isChatThread = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
    chatlog.log(`${ChatManager.TAG}: removeMessagesFromServerWithMsgIds: `, convId, convType, msgIds, isChatThread);
    if (msgIds.length === 0) {
      // todo: temp fix native
      console.log(`${ChatManager.TAG}: removeMessagesFromServerWithMsgIds: msgIds count is 0`);
      throw new ChatError({
        code: 1,
        description: 'msgIds count is 0'
      });
    }
    if ((await ChatClient.getInstance().isLoginBefore()) === false) {
      // todo: temp fix native
      console.log(`${ChatManager.TAG}: removeMessagesFromServerWithMsgIds: not logged in yet.`);
      throw new ChatError({
        code: 1,
        description: 'not logged in yet'
      });
    }
    let r = await Native._callMethod(MTremoveMessagesFromServerWithMsgIds, {
      [MTremoveMessagesFromServerWithMsgIds]: {
        convId: convId,
        convType: convType,
        msgIds: msgIds,
        isChatThread: isChatThread
      }
    });
    Native.checkErrorFromResult(r);
  }

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
  async removeMessagesFromServerWithTimestamp(convId, convType, timestamp) {
    let isChatThread = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
    chatlog.log(`${ChatManager.TAG}: removeMessagesFromServerWithTimestamp: `, convId, convType, timestamp, isChatThread);
    if (timestamp <= 0) {
      // todo: temp fix native
      console.log(`${ChatManager.TAG}: removeMessagesFromServerWithTimestamp: timestamp <= 0`);
      throw new ChatError({
        code: 1,
        description: 'timestamp <= 0'
      });
    }
    if ((await ChatClient.getInstance().isLoginBefore()) === false) {
      // todo: temp fix native
      console.log(`${ChatManager.TAG}: removeMessagesFromServerWithTimestamp: not logged in yet.`);
      throw new ChatError({
        code: 1,
        description: 'not logged in yet'
      });
    }
    let r = await Native._callMethod(MTremoveMessagesFromServerWithTs, {
      [MTremoveMessagesFromServerWithTs]: {
        convId: convId,
        convType: convType,
        timestamp: timestamp,
        isChatThread: isChatThread
      }
    });
    Native.checkErrorFromResult(r);
  }

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
  async fetchConversationsFromServerWithCursor(cursor, pageSize) {
    chatlog.log(`${ChatManager.TAG}: fetchConversationsFromServerWithCursor: ${cursor}, ${pageSize}`);
    let r = await Native._callMethod(MTgetConversationsFromServerWithCursor, {
      [MTgetConversationsFromServerWithCursor]: {
        cursor: cursor ?? '',
        pageSize: pageSize ?? 20
      }
    });
    Native.checkErrorFromResult(r);
    let ret = new ChatCursorResult({
      cursor: r === null || r === void 0 ? void 0 : r[MTgetConversationsFromServerWithCursor].cursor,
      list: r === null || r === void 0 ? void 0 : r[MTgetConversationsFromServerWithCursor].list,
      opt: {
        map: param => {
          return new ChatConversation(param);
        }
      }
    });
    return ret;
  }

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
  async fetchPinnedConversationsFromServerWithCursor(cursor, pageSize) {
    chatlog.log(`${ChatManager.TAG}: fetchPinnedConversationsFromServerWithCursor: ${cursor}, ${pageSize}`);
    let r = await Native._callMethod(MTgetPinnedConversationsFromServerWithCursor, {
      [MTgetPinnedConversationsFromServerWithCursor]: {
        cursor: cursor ?? '',
        pageSize: pageSize ?? 20
      }
    });
    Native.checkErrorFromResult(r);
    let ret = new ChatCursorResult({
      cursor: r === null || r === void 0 ? void 0 : r[MTgetPinnedConversationsFromServerWithCursor].cursor,
      list: r === null || r === void 0 ? void 0 : r[MTgetPinnedConversationsFromServerWithCursor].list,
      opt: {
        map: param => {
          return new ChatConversation(param);
        }
      }
    });
    return ret;
  }

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
  async pinConversation(convId, isPinned) {
    chatlog.log(`${ChatManager.TAG}: pinConversation: ${convId}, ${isPinned}`);
    let r = await Native._callMethod(MTpinConversation, {
      [MTpinConversation]: {
        convId,
        isPinned
      }
    });
    Native.checkErrorFromResult(r);
  }

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
  async modifyMessageBody(msgId, body) {
    chatlog.log(`${ChatManager.TAG}: modifyMessageBody: ${msgId}, ${body.type}`);
    if (body.type !== ChatMessageType.TXT) {
      throw new ChatError({
        code: 1,
        description: 'Currently only text message content modification is supported.'
      });
    }
    let r = await Native._callMethod(MTmodifyMessage, {
      [MTmodifyMessage]: {
        msgId,
        body
      }
    });
    Native.checkErrorFromResult(r);
    const rr = r === null || r === void 0 ? void 0 : r[MTmodifyMessage];
    return new ChatMessage(rr);
  }

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
  async fetchCombineMessageDetail(message) {
    chatlog.log(`${ChatManager.TAG}: fetchCombineMessageDetail: ${message.body.type}`);
    if (message.body.type !== ChatMessageType.COMBINE) {
      throw new ChatError({
        code: 1,
        description: 'Please select a combine type message.'
      });
    }
    let r = await Native._callMethod(MTdownloadAndParseCombineMessage, {
      [MTdownloadAndParseCombineMessage]: {
        message
      }
    });
    Native.checkErrorFromResult(r);
    const ret = [];
    const rr = r === null || r === void 0 ? void 0 : r[MTdownloadAndParseCombineMessage];
    if (rr) {
      Object.entries(rr).forEach(value => {
        ret.push(new ChatMessage(value[1]));
      });
    }
    return ret;
  }

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
  async addRemoteAndLocalConversationsMark(convIds, mark) {
    chatlog.log(`${ChatManager.TAG}: addRemoteAndLocalConversationsMark: ${convIds}, ${mark}`);
    let r = await Native._callMethod(MTaddRemoteAndLocalConversationsMark, {
      [MTaddRemoteAndLocalConversationsMark]: {
        convIds,
        mark
      }
    });
    Native.checkErrorFromResult(r);
  }

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
  async deleteRemoteAndLocalConversationsMark(convIds, mark) {
    chatlog.log(`${ChatManager.TAG}: deleteRemoteAndLocalConversationsMark: ${convIds}, ${mark}`);
    let r = await Native._callMethod(MTdeleteRemoteAndLocalConversationsMark, {
      [MTdeleteRemoteAndLocalConversationsMark]: {
        convIds,
        mark
      }
    });
    Native.checkErrorFromResult(r);
  }

  /**
   * Gets the conversations from the server by conversation filter options.
   *
   * @param option The conversation filter options. See {@link ChatConversationFetchOptions}.
   *
   * @returns The retrieved list of conversations. See {@link ChatCursorResult}.
   */
  async fetchConversationsByOptions(option) {
    chatlog.log(`${ChatManager.TAG}: fetchConversationsByOptions: ${option}`);
    let r = await Native._callMethod(MTfetchConversationsByOptions, {
      [MTfetchConversationsByOptions]: {
        ...option
      }
    });
    Native.checkErrorFromResult(r);
    let ret = new ChatCursorResult({
      cursor: r === null || r === void 0 ? void 0 : r[MTfetchConversationsByOptions].cursor,
      list: r === null || r === void 0 ? void 0 : r[MTfetchConversationsByOptions].list,
      opt: {
        map: param => {
          return new ChatConversation(param);
        }
      }
    });
    return ret;
  }

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
  async deleteAllMessageAndConversation() {
    let clearServerData = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
    chatlog.log(`${ChatManager.TAG}: deleteAllMessageAndConversation: ${clearServerData}`);
    let r = await Native._callMethod(MTdeleteAllMessageAndConversation, {
      [MTdeleteAllMessageAndConversation]: {
        clearServerData: clearServerData
      }
    });
    Native.checkErrorFromResult(r);
  }

  /**
   * Pins a message.
   *
   * @param messageId The message ID.
   *
   * @throws A description of the exception. See {@link ChatError}.
   */
  async pinMessage(messageId) {
    chatlog.log(`${ChatManager.TAG}: pinMessage: ${messageId}`);
    let r = await Native._callMethod(MTpinMessage, {
      [MTpinMessage]: {
        msgId: messageId
      }
    });
    Native.checkErrorFromResult(r);
  }

  /**
   * Unpins a message.
   *
   * @param messageId The message ID.
   *
   * @throws A description of the exception. See {@link ChatError}.
   */
  async unpinMessage(messageId) {
    chatlog.log(`${ChatManager.TAG}: pinMessage: ${messageId}`);
    let r = await Native._callMethod(MTunpinMessage, {
      [MTunpinMessage]: {
        msgId: messageId
      }
    });
    Native.checkErrorFromResult(r);
  }

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
  async fetchPinnedMessages(convId, convType) {
    let isChatThread = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
    chatlog.log(`${ChatManager.TAG}: fetchPinnedMessages:`, convId, convType, isChatThread);
    let r = await Native._callMethod(MTfetchPinnedMessages, {
      [MTfetchPinnedMessages]: {
        convId: convId,
        convType: convType,
        isChatThread: isChatThread
      }
    });
    ChatManager.checkErrorFromResult(r);
    const ret = [];
    const rr = r === null || r === void 0 ? void 0 : r[MTfetchPinnedMessages];
    if (rr) {
      Object.entries(rr).forEach(value => {
        ret.push(new ChatMessage(value[1]));
      });
    }
    return ret;
  }

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
  async getPinnedMessages(convId, convType) {
    let isChatThread = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
    chatlog.log(`${ChatManager.TAG}: getPinnedMessages:`, convId, convType, isChatThread);
    let r = await Native._callMethod(MTpinnedMessages, {
      [MTpinnedMessages]: {
        convId: convId,
        convType: convType,
        isChatThread: isChatThread
      }
    });
    ChatManager.checkErrorFromResult(r);
    const ret = [];
    const rr = r === null || r === void 0 ? void 0 : r[MTpinnedMessages];
    if (rr) {
      Object.entries(rr).forEach(value => {
        ret.push(new ChatMessage(value[1]));
      });
    }
    return ret;
  }

  /**
   * Gets the pinning information of a message.
   *
   * @param messageId The message ID.
   * @returns The message pinning information. If the message does not exit or is not pinned, `undefined` is returned.
   *
   * @throws A description of the exception. See {@link ChatError}.
   */
  async getMessagePinInfo(messageId) {
    chatlog.log(`${ChatManager.TAG}: getMessagePinInfo:`, messageId);
    let r = await Native._callMethod(MTgetPinInfo, {
      [MTgetPinInfo]: {
        msgId: messageId
      }
    });
    ChatManager.checkErrorFromResult(r);
    if (r !== null && r !== void 0 && r[MTgetPinInfo]) {
      return new ChatMessagePinInfo(r[MTgetPinInfo]);
    }
    return undefined;
  }
}
//# sourceMappingURL=ChatManager.js.map
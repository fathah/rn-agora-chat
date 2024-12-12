"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ChatManager = void 0;
var _Base = require("./__internal__/Base");
var _Consts = require("./__internal__/Consts");
var _Native = require("./__internal__/Native");
var _ChatClient = require("./ChatClient");
var _ChatConst = require("./common/ChatConst");
var _ChatConversation = require("./common/ChatConversation");
var _ChatCursorResult = require("./common/ChatCursorResult");
var _ChatError = require("./common/ChatError");
var _ChatGroup = require("./common/ChatGroup");
var _ChatMessage = require("./common/ChatMessage");
var _ChatMessageReaction = require("./common/ChatMessageReaction");
var _ChatMessageThread = require("./common/ChatMessageThread");
var _ChatTranslateLanguage = require("./common/ChatTranslateLanguage");
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
class ChatManager extends _Base.BaseManager {
  static TAG = 'ChatManager';
  constructor() {
    super();
    this._messageListeners = new Set();
  }
  setNativeListener(event) {
    _ChatConst.chatlog.log(`${ChatManager.TAG}: setNativeListener: `);
    this._eventEmitter = event;
    event.removeAllListeners(_Consts.MTonMessagesReceived);
    event.addListener(_Consts.MTonMessagesReceived, this.onMessagesReceived.bind(this));
    event.removeAllListeners(_Consts.MTonCmdMessagesReceived);
    event.addListener(_Consts.MTonCmdMessagesReceived, this.onCmdMessagesReceived.bind(this));
    event.removeAllListeners(_Consts.MTonMessagesRead);
    event.addListener(_Consts.MTonMessagesRead, this.onMessagesRead.bind(this));
    event.removeAllListeners(_Consts.MTonGroupMessageRead);
    event.addListener(_Consts.MTonGroupMessageRead, this.onGroupMessageRead.bind(this));
    event.removeAllListeners(_Consts.MTonMessagesDelivered);
    event.addListener(_Consts.MTonMessagesDelivered, this.onMessagesDelivered.bind(this));
    event.removeAllListeners(_Consts.MTonMessagesRecalled);
    event.addListener(_Consts.MTonMessagesRecalled, this.onMessagesRecalled.bind(this));
    event.removeAllListeners(_Consts.MTonConversationUpdate);
    event.addListener(_Consts.MTonConversationUpdate, this.onConversationsUpdate.bind(this));
    event.removeAllListeners(_Consts.MTonConversationHasRead);
    event.addListener(_Consts.MTonConversationHasRead, this.onConversationHasRead.bind(this));
    event.removeAllListeners(_Consts.MTonReadAckForGroupMessageUpdated);
    event.addListener(_Consts.MTonReadAckForGroupMessageUpdated, this.onReadAckForGroupMessageUpdated.bind(this));
    event.removeAllListeners(_Consts.MTmessageReactionDidChange);
    event.addListener(_Consts.MTmessageReactionDidChange, this.onMessageReactionDidChange.bind(this));
    event.removeAllListeners(_Consts.MTonChatThreadCreated);
    event.addListener(_Consts.MTonChatThreadCreated, this.onChatMessageThreadCreated.bind(this));
    event.removeAllListeners(_Consts.MTonChatThreadUpdated);
    event.addListener(_Consts.MTonChatThreadUpdated, this.onChatMessageThreadUpdated.bind(this));
    event.removeAllListeners(_Consts.MTonChatThreadDestroyed);
    event.addListener(_Consts.MTonChatThreadDestroyed, this.onChatMessageThreadDestroyed.bind(this));
    event.removeAllListeners(_Consts.MTonChatThreadUserRemoved);
    event.addListener(_Consts.MTonChatThreadUserRemoved, this.onChatMessageThreadUserRemoved.bind(this));
    event.removeAllListeners(_Consts.MTonMessageContentChanged);
    event.addListener(_Consts.MTonMessageContentChanged, this.onMessageContentChanged.bind(this));
    event.removeAllListeners(_Consts.MTonMessagePinChanged);
    event.addListener(_Consts.MTonMessagePinChanged, this.onMessagePinChanged.bind(this));
  }
  filterUnsupportedMessage(messages) {
    return messages.filter(message => {
      return message.body.type !== 'unknown';
    });
  }
  createReceiveMessage(messages) {
    let list = [];
    messages.forEach(message => {
      let m = _ChatMessage.ChatMessage.createReceiveMessage(message);
      list.push(m);
    });
    return this.filterUnsupportedMessage(list);
  }
  onMessagesReceived(messages) {
    _ChatConst.chatlog.log(`${ChatManager.TAG}: onMessagesReceived: `, messages);
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
    _ChatConst.chatlog.log(`${ChatManager.TAG}: onCmdMessagesReceived: `, messages);
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
    _ChatConst.chatlog.log(`${ChatManager.TAG}: onMessagesRead: `, messages);
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
    _ChatConst.chatlog.log(`${ChatManager.TAG}: onGroupMessageRead: `, messages);
    if (this._messageListeners.size === 0) {
      return;
    }
    let list = [];
    messages.forEach(message => {
      let m = new _ChatGroup.ChatGroupMessageAck(message);
      list.push(m);
    });
    this._messageListeners.forEach(listener => {
      var _listener$onGroupMess;
      (_listener$onGroupMess = listener.onGroupMessageRead) === null || _listener$onGroupMess === void 0 ? void 0 : _listener$onGroupMess.call(listener, messages);
    });
  }
  onMessagesDelivered(messages) {
    _ChatConst.chatlog.log(`${ChatManager.TAG}: onMessagesDelivered: `, messages);
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
    _ChatConst.chatlog.log(`${ChatManager.TAG}: onMessagesRecalled: `, messages);
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
    _ChatConst.chatlog.log(`${ChatManager.TAG}: onConversationsUpdate: `);
    this._messageListeners.forEach(listener => {
      var _listener$onConversat;
      (_listener$onConversat = listener.onConversationsUpdate) === null || _listener$onConversat === void 0 ? void 0 : _listener$onConversat.call(listener);
    });
  }
  onConversationHasRead(params) {
    _ChatConst.chatlog.log(`${ChatManager.TAG}: onConversationHasRead: `, params);
    this._messageListeners.forEach(listener => {
      var _listener$onConversat2;
      let from = params === null || params === void 0 ? void 0 : params.from;
      let to = params === null || params === void 0 ? void 0 : params.to;
      (_listener$onConversat2 = listener.onConversationRead) === null || _listener$onConversat2 === void 0 ? void 0 : _listener$onConversat2.call(listener, from, to);
    });
  }
  onReadAckForGroupMessageUpdated(params) {
    _ChatConst.chatlog.log(`${ChatManager.TAG}: onReadAckForGroupMessageUpdated: `, params);
  }
  onMessageReactionDidChange(params) {
    _ChatConst.chatlog.log(`${ChatManager.TAG}: onMessageReactionDidChange: `, JSON.stringify(params));
    if (this._messageListeners.size === 0) {
      return;
    }
    const list = [];
    Object.entries(params).forEach(v => {
      const convId = v[1].conversationId;
      const msgId = v[1].messageId;
      const ll = [];
      Object.entries(v[1].reactions).forEach(vv => {
        ll.push(new _ChatMessageReaction.ChatMessageReaction(vv[1]));
      });
      const o = [];
      Object.entries(v[1].operations).forEach(vv => {
        o.push(_ChatMessageReaction.ChatReactionOperation.fromNative(vv[1]));
      });
      list.push(new _ChatMessageReaction.ChatMessageReactionEvent({
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
    _ChatConst.chatlog.log(`${ChatManager.TAG}: onChatMessageThreadCreated: `, params);
    this._messageListeners.forEach(listener => {
      var _listener$onChatMessa;
      (_listener$onChatMessa = listener.onChatMessageThreadCreated) === null || _listener$onChatMessa === void 0 ? void 0 : _listener$onChatMessa.call(listener, new _ChatMessageThread.ChatMessageThreadEvent(params));
    });
  }
  onChatMessageThreadUpdated(params) {
    _ChatConst.chatlog.log(`${ChatManager.TAG}: onChatMessageThreadUpdated: `, params);
    this._messageListeners.forEach(listener => {
      var _listener$onChatMessa2;
      (_listener$onChatMessa2 = listener.onChatMessageThreadUpdated) === null || _listener$onChatMessa2 === void 0 ? void 0 : _listener$onChatMessa2.call(listener, new _ChatMessageThread.ChatMessageThreadEvent(params));
    });
  }
  onChatMessageThreadDestroyed(params) {
    _ChatConst.chatlog.log(`${ChatManager.TAG}: onChatMessageThreadDestroyed: `, params);
    this._messageListeners.forEach(listener => {
      var _listener$onChatMessa3;
      (_listener$onChatMessa3 = listener.onChatMessageThreadDestroyed) === null || _listener$onChatMessa3 === void 0 ? void 0 : _listener$onChatMessa3.call(listener, new _ChatMessageThread.ChatMessageThreadEvent(params));
    });
  }
  onChatMessageThreadUserRemoved(params) {
    _ChatConst.chatlog.log(`${ChatManager.TAG}: onChatMessageThreadUserRemoved: `, params);
    this._messageListeners.forEach(listener => {
      var _listener$onChatMessa4;
      (_listener$onChatMessa4 = listener.onChatMessageThreadUserRemoved) === null || _listener$onChatMessa4 === void 0 ? void 0 : _listener$onChatMessa4.call(listener, new _ChatMessageThread.ChatMessageThreadEvent(params));
    });
  }
  onMessageContentChanged(params) {
    _ChatConst.chatlog.log(`${ChatManager.TAG}: onMessageContentChanged: `, params);
    this._messageListeners.forEach(listener => {
      var _listener$onMessageCo;
      (_listener$onMessageCo = listener.onMessageContentChanged) === null || _listener$onMessageCo === void 0 ? void 0 : _listener$onMessageCo.call(listener, _ChatMessage.ChatMessage.createReceiveMessage(params.message), params.lastModifyOperatorId, params.lastModifyTime);
    });
  }
  onMessagePinChanged(params) {
    _ChatConst.chatlog.log(`${ChatManager.TAG}: onMessagePinChanged: `, params);
    this._messageListeners.forEach(listener => {
      var _listener$onMessagePi;
      (_listener$onMessagePi = listener.onMessagePinChanged) === null || _listener$onMessagePi === void 0 ? void 0 : _listener$onMessagePi.call(listener, {
        messageId: params.messageId,
        convId: params.conversationId,
        pinOperation: params.pinOperation,
        pinInfo: new _ChatMessage.ChatMessagePinInfo(params.pinInfo)
      });
    });
  }
  static handleSendMessageCallback(self, message, callback) {
    ChatManager.handleMessageCallback(_Consts.MTsendMessage, self, message, callback);
  }
  static handleResendMessageCallback(self, message, callback) {
    ChatManager.handleMessageCallback(_Consts.MTresendMessage, self, message, callback);
  }
  static handleDownloadAttachmentCallback(self, message, callback) {
    ChatManager.handleMessageCallback(_Consts.MTdownloadAttachment, self, message, callback);
  }
  static handleDownloadThumbnailCallback(self, message, callback) {
    ChatManager.handleMessageCallback(_Consts.MTdownloadThumbnail, self, message, callback);
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
    _ChatConst.chatlog.log(`${ChatManager.TAG}: addMessageListener: `);
    this._messageListeners.add(listener);
  }

  /**
   * Removes the message listener.
   *
   * @param listener The message listener to remove.
   */
  removeMessageListener(listener) {
    _ChatConst.chatlog.log(`${ChatManager.TAG}: removeMessageListener: `);
    this._messageListeners.delete(listener);
  }

  /**
   * Removes all message listeners.
   */
  removeAllMessageListener() {
    _ChatConst.chatlog.log(`${ChatManager.TAG}: removeAllMessageListener: `);
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
    _ChatConst.chatlog.log(`${ChatManager.TAG}: sendMessage: ${message.msgId}, ${message.localTime}`, message);
    message.status = _ChatMessage.ChatMessageStatus.PROGRESS;
    ChatManager.handleSendMessageCallback(this, message, callback);
    let r = await _Native.Native._callMethod(_Consts.MTsendMessage, {
      [_Consts.MTsendMessage]: message
    });
    _Native.Native.checkErrorFromResult(r);
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
    _ChatConst.chatlog.log(`${ChatManager.TAG}: resendMessage: ${message.msgId}, ${message.localTime}`, message);
    if (message.msgId !== message.localMsgId && message.status === _ChatMessage.ChatMessageStatus.SUCCESS) {
      callback.onError(message.localMsgId, new _ChatError.ChatError({
        code: 1,
        description: 'The message had send success'
      }));
      return;
    }
    message.status = _ChatMessage.ChatMessageStatus.PROGRESS;
    ChatManager.handleResendMessageCallback(this, message, callback);
    let r = await _Native.Native._callMethod(_Consts.MTresendMessage, {
      [_Consts.MTsendMessage]: message
    });
    _Native.Native.checkErrorFromResult(r);
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
    _ChatConst.chatlog.log(`${ChatManager.TAG}: sendMessageReadAck: ${message.msgId}, ${message.localTime}`, message);
    let r = await _Native.Native._callMethod(_Consts.MTackMessageRead, {
      [_Consts.MTackMessageRead]: {
        to: message.from,
        msg_id: message.msgId
      }
    });
    _Native.Native.checkErrorFromResult(r);
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
    _ChatConst.chatlog.log(`${ChatManager.TAG}: sendGroupMessageReadAck: ${msgId}, ${groupId}`);
    let s = opt !== null && opt !== void 0 && opt.content ? {
      msg_id: msgId,
      group_id: groupId,
      content: opt === null || opt === void 0 ? void 0 : opt.content
    } : {
      msg_id: msgId,
      group_id: groupId
    };
    let r = await _Native.Native._callMethod(_Consts.MTackGroupMessageRead, {
      [_Consts.MTackGroupMessageRead]: s
    });
    _Native.Native.checkErrorFromResult(r);
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
    _ChatConst.chatlog.log(`${ChatManager.TAG}: sendConversationReadAck: ${convId}`);
    let r = await _Native.Native._callMethod(_Consts.MTackConversationRead, {
      [_Consts.MTackConversationRead]: {
        convId: convId
      }
    });
    _Native.Native.checkErrorFromResult(r);
  }

  /**
   * Recalls the sent message.
   *
   * @param msgId The message ID.
   *
   * @throws A description of the exception. See {@link ChatError}.
   */
  async recallMessage(msgId) {
    _ChatConst.chatlog.log(`${ChatManager.TAG}: recallMessage: ${msgId}`);
    let r = await _Native.Native._callMethod(_Consts.MTrecallMessage, {
      [_Consts.MTrecallMessage]: {
        msg_id: msgId
      }
    });
    _Native.Native.checkErrorFromResult(r);
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
    _ChatConst.chatlog.log(`${ChatManager.TAG}: getMessage: ${msgId}`);
    let r = await _Native.Native._callMethod(_Consts.MTgetMessage, {
      [_Consts.MTgetMessage]: {
        msg_id: msgId
      }
    });
    _Native.Native.checkErrorFromResult(r);
    const rr = r === null || r === void 0 ? void 0 : r[_Consts.MTgetMessage];
    if (rr) {
      return new _ChatMessage.ChatMessage(rr);
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
    _ChatConst.chatlog.log(`${ChatManager.TAG}: markAllConversationsAsRead: `);
    let r = await _Native.Native._callMethod(_Consts.MTmarkAllChatMsgAsRead);
    _Native.Native.checkErrorFromResult(r);
  }

  /**
   * Gets the count of the unread messages.
   *
   * @returns The count of the unread messages.
   *
   * @throws A description of the exception. See {@link ChatError}.
   */
  async getUnreadCount() {
    _ChatConst.chatlog.log(`${ChatManager.TAG}: getUnreadCount: `);
    let r = await _Native.Native._callMethod(_Consts.MTgetUnreadMessageCount);
    _Native.Native.checkErrorFromResult(r);
    return r === null || r === void 0 ? void 0 : r[_Consts.MTgetUnreadMessageCount];
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
    _ChatConst.chatlog.log(`${ChatManager.TAG}: insertMessage: `, message);
    let r = await _Native.Native._callMethod(_Consts.MTinsertMessage, {
      [_Consts.MTinsertMessage]: {
        msg: message
      }
    });
    _Native.Native.checkErrorFromResult(r);
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
    _ChatConst.chatlog.log(`${ChatManager.TAG}: updateMessage: ${message.msgId}, ${message.localTime}`, message);
    let r = await _Native.Native._callMethod(_Consts.MTupdateChatMessage, {
      [_Consts.MTupdateChatMessage]: {
        message: message
      }
    });
    _Native.Native.checkErrorFromResult(r);
    const rr = r === null || r === void 0 ? void 0 : r[_Consts.MTupdateChatMessage];
    return new _ChatMessage.ChatMessage(rr);
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
    _ChatConst.chatlog.log(`${ChatManager.TAG}: importMessages: ${messages.length}`, messages);
    let r = await _Native.Native._callMethod(_Consts.MTimportMessages, {
      [_Consts.MTimportMessages]: {
        messages: messages
      }
    });
    _Native.Native.checkErrorFromResult(r);
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
    _ChatConst.chatlog.log(`${ChatManager.TAG}: downloadAttachmentInCombine: ${message.msgId}, ${message.localTime}`, message);
    ChatManager.handleDownloadFileCallback(this, message, _Consts.MTdownloadAttachmentInCombine, callback);
    let r = await _Native.Native._callMethod(_Consts.MTdownloadAttachmentInCombine, {
      [_Consts.MTdownloadAttachmentInCombine]: {
        message: message
      }
    });
    _Native.Native.checkErrorFromResult(r);
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
    _ChatConst.chatlog.log(`${ChatManager.TAG}: downloadThumbnailInCombine: ${message.msgId}, ${message.localTime}`, message);
    ChatManager.handleDownloadFileCallback(this, message, _Consts.MTdownloadThumbnailInCombine, callback);
    let r = await _Native.Native._callMethod(_Consts.MTdownloadThumbnailInCombine, {
      [_Consts.MTdownloadThumbnailInCombine]: {
        message: message
      }
    });
    _Native.Native.checkErrorFromResult(r);
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
    _ChatConst.chatlog.log(`${ChatManager.TAG}: downloadAttachment: ${message.msgId}, ${message.localTime}`, message);
    ChatManager.handleDownloadAttachmentCallback(this, message, callback);
    let r = await _Native.Native._callMethod(_Consts.MTdownloadAttachment, {
      [_Consts.MTdownloadAttachment]: {
        message: message
      }
    });
    _Native.Native.checkErrorFromResult(r);
  }

  /**
   * Downloads the message thumbnail.
   *
   * @param message The ID of the message with the thumbnail to be downloaded. Only the image messages and video messages have a thumbnail.
   *
   * @throws A description of the exception. See {@link ChatError}.
   */
  async downloadThumbnail(message, callback) {
    _ChatConst.chatlog.log(`${ChatManager.TAG}: downloadThumbnail: ${message.msgId}, ${message.localTime}`, message);
    ChatManager.handleDownloadThumbnailCallback(this, message, callback);
    let r = await _Native.Native._callMethod(_Consts.MTdownloadThumbnail, {
      [_Consts.MTdownloadThumbnail]: {
        message: message
      }
    });
    _Native.Native.checkErrorFromResult(r);
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
    _ChatConst.chatlog.log(`${ChatManager.TAG}: fetchHistoryMessages: ${convId}, ${chatType}, ${params}`);
    let r = await _Native.Native._callMethod(_Consts.MTfetchHistoryMessages, {
      [_Consts.MTfetchHistoryMessages]: {
        convId: convId,
        convType: chatType,
        pageSize: params.pageSize ?? 20,
        startMsgId: params.startMsgId ?? '',
        direction: params.direction ?? _ChatConversation.ChatSearchDirection.UP
      }
    });
    _Native.Native.checkErrorFromResult(r);
    let ret = new _ChatCursorResult.ChatCursorResult({
      cursor: r === null || r === void 0 ? void 0 : r[_Consts.MTfetchHistoryMessages].cursor,
      list: r === null || r === void 0 ? void 0 : r[_Consts.MTfetchHistoryMessages].list,
      opt: {
        map: param => {
          return new _ChatMessage.ChatMessage(param);
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
    _ChatConst.chatlog.log(`${ChatManager.TAG}: fetchHistoryMessagesByOptions: ${convId}, ${chatType}, ${params}`);
    let r = await _Native.Native._callMethod(_Consts.MTfetchHistoryMessagesByOptions, {
      [_Consts.MTfetchHistoryMessagesByOptions]: {
        convId: convId,
        convType: chatType,
        pageSize: (params === null || params === void 0 ? void 0 : params.pageSize) ?? 20,
        cursor: (params === null || params === void 0 ? void 0 : params.cursor) ?? '',
        options: params === null || params === void 0 ? void 0 : params.options
      }
    });
    _Native.Native.checkErrorFromResult(r);
    let ret = new _ChatCursorResult.ChatCursorResult({
      cursor: r === null || r === void 0 ? void 0 : r[_Consts.MTfetchHistoryMessagesByOptions].cursor,
      list: r === null || r === void 0 ? void 0 : r[_Consts.MTfetchHistoryMessagesByOptions].list,
      opt: {
        map: param => {
          return new _ChatMessage.ChatMessage(param);
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
    let direction = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : _ChatConversation.ChatSearchDirection.UP;
    _ChatConst.chatlog.log(`${ChatManager.TAG}: searchMsgFromDB: ${keywords}, ${timestamp}, ${maxCount}, ${from}`);
    let r = await _Native.Native._callMethod(_Consts.MTsearchChatMsgFromDB, {
      [_Consts.MTsearchChatMsgFromDB]: {
        keywords: keywords,
        timeStamp: timestamp,
        maxCount: maxCount,
        from: from,
        direction: direction === _ChatConversation.ChatSearchDirection.UP ? 'up' : 'down'
      }
    });
    _Native.Native.checkErrorFromResult(r);
    let ret = new Array(0);
    const rr = r === null || r === void 0 ? void 0 : r[_Consts.MTsearchChatMsgFromDB];
    if (rr) {
      rr.forEach(element => {
        ret.push(new _ChatMessage.ChatMessage(element));
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
      direction = _ChatConversation.ChatSearchDirection.UP,
      searchScope = _ChatMessage.ChatMessageSearchScope.All
    } = params;
    _ChatConst.chatlog.log(`${ChatManager.TAG}: searchMsgFromDB: ${keywords}, ${timestamp}, ${maxCount}, ${from}`);
    let r = await _Native.Native._callMethod(_Consts.MTsearchChatMsgFromDB, {
      [_Consts.MTsearchChatMsgFromDB]: {
        keywords: keywords,
        timeStamp: timestamp,
        maxCount: maxCount,
        from: from,
        direction: direction === _ChatConversation.ChatSearchDirection.UP ? 'up' : 'down',
        searchScope: searchScope
      }
    });
    _Native.Native.checkErrorFromResult(r);
    let ret = new Array(0);
    const rr = r === null || r === void 0 ? void 0 : r[_Consts.MTsearchChatMsgFromDB];
    if (rr) {
      rr.forEach(element => {
        ret.push(new _ChatMessage.ChatMessage(element));
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
    _ChatConst.chatlog.log(`${ChatManager.TAG}: asyncFetchGroupAcks: ${msgId}, ${startAckId}, ${pageSize}`);
    let r = await _Native.Native._callMethod(_Consts.MTasyncFetchGroupAcks, {
      [_Consts.MTasyncFetchGroupAcks]: {
        msg_id: msgId,
        ack_id: startAckId,
        pageSize: pageSize,
        group_id: groupId
      }
    });
    _Native.Native.checkErrorFromResult(r);
    let ret = new _ChatCursorResult.ChatCursorResult({
      cursor: r === null || r === void 0 ? void 0 : r[_Consts.MTasyncFetchGroupAcks].cursor,
      list: r === null || r === void 0 ? void 0 : r[_Consts.MTasyncFetchGroupAcks].list,
      opt: {
        map: param => {
          return new _ChatGroup.ChatGroupMessageAck(param);
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
    _ChatConst.chatlog.log(`${ChatManager.TAG}: removeConversationFromServer: ${convId}, ${convType}, ${isDeleteMessage}`);
    let ct = 0;
    switch (convType) {
      case _ChatConversation.ChatConversationType.PeerChat:
        ct = 0;
        break;
      case _ChatConversation.ChatConversationType.GroupChat:
        ct = 1;
        break;
      case _ChatConversation.ChatConversationType.RoomChat:
        ct = 2;
        break;
      default:
        throw new _ChatError.ChatError({
          code: 1,
          description: `This type is not supported. ` + convType
        });
    }
    let r = await _Native.Native._callMethod(_Consts.MTdeleteRemoteConversation, {
      [_Consts.MTdeleteRemoteConversation]: {
        conversationId: convId,
        conversationType: ct,
        isDeleteRemoteMessage: isDeleteMessage
      }
    });
    _Native.Native.checkErrorFromResult(r);
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
    _ChatConst.chatlog.log(`${ChatManager.TAG}: getConversation: ${convId}, ${convType}, ${createIfNeed}, ${isChatThread}`);
    let r = await _Native.Native._callMethod(_Consts.MTgetConversation, {
      [_Consts.MTgetConversation]: {
        convId: convId,
        convType: convType,
        createIfNeed: createIfNeed,
        isChatThread: isChatThread
      }
    });
    _Native.Native.checkErrorFromResult(r);
    const rr = r === null || r === void 0 ? void 0 : r[_Consts.MTgetConversation];
    if (rr) {
      return new _ChatConversation.ChatConversation(rr);
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
    _ChatConst.chatlog.log(`${ChatManager.TAG}: getAllConversations:`);
    let r = await _Native.Native._callMethod(_Consts.MTloadAllConversations);
    _Native.Native.checkErrorFromResult(r);
    let ret = new Array(0);
    const rr = r === null || r === void 0 ? void 0 : r[_Consts.MTloadAllConversations];
    if (rr) {
      rr.forEach(element => {
        ret.push(new _ChatConversation.ChatConversation(element));
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
    _ChatConst.chatlog.log(`${ChatManager.TAG}: fetchAllConversations:`);
    let r = await _Native.Native._callMethod(_Consts.MTgetConversationsFromServer);
    _Native.Native.checkErrorFromResult(r);
    let ret = new Array(0);
    const rr = r === null || r === void 0 ? void 0 : r[_Consts.MTgetConversationsFromServer];
    if (rr) {
      rr.forEach(element => {
        ret.push(new _ChatConversation.ChatConversation(element));
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
    _ChatConst.chatlog.log(`${ChatManager.TAG}: deleteConversation: ${convId}, ${withMessage}`);
    let r = await _Native.Native._callMethod(_Consts.MTdeleteConversation, {
      [_Consts.MTdeleteConversation]: {
        convId: convId,
        deleteMessages: withMessage
      }
    });
    _Native.Native.checkErrorFromResult(r);
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
    _ChatConst.chatlog.log(`${ChatManager.TAG}: latestMessage: `, convId, convType, isChatThread);
    let r = await _Native.Native._callMethod(_Consts.MTgetLatestMessage, {
      [_Consts.MTgetLatestMessage]: {
        convId: convId,
        convType: convType,
        isChatThread: isChatThread
      }
    });
    ChatManager.checkErrorFromResult(r);
    const rr = r === null || r === void 0 ? void 0 : r[_Consts.MTgetLatestMessage];
    if (rr) {
      return new _ChatMessage.ChatMessage(rr);
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
    _ChatConst.chatlog.log(`${ChatManager.TAG}: lastReceivedMessage: `, convId, convType, isChatThread);
    let r = await _Native.Native._callMethod(_Consts.MTgetLatestMessageFromOthers, {
      [_Consts.MTgetLatestMessageFromOthers]: {
        convId: convId,
        convType: convType,
        isChatThread: isChatThread
      }
    });
    ChatManager.checkErrorFromResult(r);
    const rr = r === null || r === void 0 ? void 0 : r[_Consts.MTgetLatestMessageFromOthers];
    if (rr) {
      return new _ChatMessage.ChatMessage(rr);
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
    _ChatConst.chatlog.log(`${ChatManager.TAG}: getConversationUnreadCount: `, convId, convType, isChatThread);
    let r = await _Native.Native._callMethod(_Consts.MTgetUnreadMsgCount, {
      [_Consts.MTgetUnreadMsgCount]: {
        convId: convId,
        convType: convType,
        isChatThread: isChatThread
      }
    });
    ChatManager.checkErrorFromResult(r);
    const ret = r === null || r === void 0 ? void 0 : r[_Consts.MTgetUnreadMsgCount];
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
    _ChatConst.chatlog.log(`${ChatManager.TAG}: getConversationMessageCount: `, convId, convType, isChatThread);
    let r = await _Native.Native._callMethod(_Consts.MTgetMsgCount, {
      [_Consts.MTgetMsgCount]: {
        convId: convId,
        convType: convType,
        isChatThread: isChatThread
      }
    });
    ChatManager.checkErrorFromResult(r);
    const ret = r === null || r === void 0 ? void 0 : r[_Consts.MTgetMsgCount];
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
    _ChatConst.chatlog.log(`${ChatManager.TAG}: markMessageAsRead: `, convId, convType, msgId, isChatThread);
    let r = await _Native.Native._callMethod(_Consts.MTmarkMessageAsRead, {
      [_Consts.MTmarkMessageAsRead]: {
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
    _ChatConst.chatlog.log(`${ChatManager.TAG}: markAllMessagesAsRead: `, convId, convType, isChatThread);
    let r = await _Native.Native._callMethod(_Consts.MTmarkAllMessagesAsRead, {
      [_Consts.MTmarkAllMessagesAsRead]: {
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
    _ChatConst.chatlog.log(`${ChatManager.TAG}: updateConversationMessage: `, convId, convType, msg, isChatThread);
    let r = await _Native.Native._callMethod(_Consts.MTupdateConversationMessage, {
      [_Consts.MTupdateConversationMessage]: {
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
    _ChatConst.chatlog.log(`${ChatManager.TAG}: deleteMessage: ${convId}, ${convType}, ${msgId}, ${isChatThread}`);
    let r = await _Native.Native._callMethod(_Consts.MTremoveMessage, {
      [_Consts.MTremoveMessage]: {
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
    _ChatConst.chatlog.log(`${ChatManager.TAG}: deleteMessagesWithTimestamp: ${convId}, ${convType}, ${params}, ${isChatThread}`);
    let r = await _Native.Native._callMethod(_Consts.MTdeleteMessagesWithTs, {
      [_Consts.MTdeleteMessagesWithTs]: {
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
    _ChatConst.chatlog.log(`${ChatManager.TAG}: deleteConversationAllMessages: `, convId, convType, isChatThread);
    let r = await _Native.Native._callMethod(_Consts.MTclearAllMessages, {
      [_Consts.MTclearAllMessages]: {
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
    _ChatConst.chatlog.log(`${ChatManager.TAG}: deleteMessagesBeforeTimestamp:`, timestamp);
    let r = await _Native.Native._callMethod(_Consts.MTdeleteMessagesBeforeTimestamp, {
      [_Consts.MTdeleteMessagesBeforeTimestamp]: {
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
    let direction = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : _ChatConversation.ChatSearchDirection.UP;
    let timestamp = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : -1;
    let count = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : 20;
    let sender = arguments.length > 6 ? arguments[6] : undefined;
    let isChatThread = arguments.length > 7 && arguments[7] !== undefined ? arguments[7] : false;
    _ChatConst.chatlog.log(`${ChatManager.TAG}: getMessagesWithMsgType: `, convId, convType, msgType, direction, timestamp, count, sender, isChatThread);
    let r = await _Native.Native._callMethod(_Consts.MTloadMsgWithMsgType, {
      [_Consts.MTloadMsgWithMsgType]: {
        convId: convId,
        convType: convType,
        msg_type: msgType,
        direction: direction === _ChatConversation.ChatSearchDirection.UP ? 'up' : 'down',
        timestamp: timestamp,
        count: count,
        sender: sender ?? '',
        isChatThread: isChatThread
      }
    });
    ChatManager.checkErrorFromResult(r);
    const ret = [];
    const rr = r === null || r === void 0 ? void 0 : r[_Consts.MTloadMsgWithMsgType];
    if (rr) {
      Object.entries(rr).forEach(value => {
        ret.push(new _ChatMessage.ChatMessage(value[1]));
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
      direction = _ChatConversation.ChatSearchDirection.UP,
      timestamp = -1,
      count = 20,
      sender,
      isChatThread = false
    } = params;
    _ChatConst.chatlog.log(`${ChatManager.TAG}: getMsgsWithMsgType: `, convId, convType, msgType, direction, timestamp, count, sender, isChatThread);
    let r = await _Native.Native._callMethod(_Consts.MTloadMsgWithMsgType, {
      [_Consts.MTloadMsgWithMsgType]: {
        convId: convId,
        convType: convType,
        msg_type: msgType,
        direction: direction === _ChatConversation.ChatSearchDirection.UP ? 'up' : 'down',
        timestamp: timestamp,
        count: count,
        sender: sender ?? '',
        isChatThread: isChatThread
      }
    });
    ChatManager.checkErrorFromResult(r);
    const ret = [];
    const rr = r === null || r === void 0 ? void 0 : r[_Consts.MTloadMsgWithMsgType];
    if (rr) {
      Object.entries(rr).forEach(value => {
        ret.push(new _ChatMessage.ChatMessage(value[1]));
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
    let direction = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : _ChatConversation.ChatSearchDirection.UP;
    let loadCount = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 20;
    let isChatThread = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : false;
    _ChatConst.chatlog.log(`${ChatManager.TAG}: getMessages: `, convId, convType, startMsgId, direction, loadCount, isChatThread);
    let r = await _Native.Native._callMethod(_Consts.MTloadMsgWithStartId, {
      [_Consts.MTloadMsgWithStartId]: {
        convId: convId,
        convType: convType,
        direction: direction === _ChatConversation.ChatSearchDirection.UP ? 'up' : 'down',
        startId: startMsgId,
        count: loadCount,
        isChatThread: isChatThread
      }
    });
    ChatManager.checkErrorFromResult(r);
    const ret = [];
    const rr = r === null || r === void 0 ? void 0 : r[_Consts.MTloadMsgWithStartId];
    if (rr) {
      Object.entries(rr).forEach(value => {
        ret.push(new _ChatMessage.ChatMessage(value[1]));
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
      direction = _ChatConversation.ChatSearchDirection.UP,
      loadCount = 20,
      isChatThread = false
    } = params;
    _ChatConst.chatlog.log(`${ChatManager.TAG}: getMsgs: `, convId, convType, startMsgId, direction, loadCount, isChatThread);
    let r = await _Native.Native._callMethod(_Consts.MTloadMsgWithStartId, {
      [_Consts.MTloadMsgWithStartId]: {
        convId: convId,
        convType: convType,
        direction: direction === _ChatConversation.ChatSearchDirection.UP ? 'up' : 'down',
        startId: startMsgId,
        count: loadCount,
        isChatThread: isChatThread
      }
    });
    ChatManager.checkErrorFromResult(r);
    const ret = [];
    const rr = r === null || r === void 0 ? void 0 : r[_Consts.MTloadMsgWithStartId];
    if (rr) {
      Object.entries(rr).forEach(value => {
        ret.push(new _ChatMessage.ChatMessage(value[1]));
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
    let direction = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : _ChatConversation.ChatSearchDirection.UP;
    let timestamp = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : -1;
    let count = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : 20;
    let sender = arguments.length > 6 ? arguments[6] : undefined;
    let isChatThread = arguments.length > 7 && arguments[7] !== undefined ? arguments[7] : false;
    _ChatConst.chatlog.log(`${ChatManager.TAG}: getMessagesWithKeyword: `, convId, convType, keywords, direction, timestamp, count, sender, isChatThread);
    let r = await _Native.Native._callMethod(_Consts.MTloadMsgWithKeywords, {
      [_Consts.MTloadMsgWithKeywords]: {
        convId: convId,
        convType: convType,
        keywords: keywords,
        direction: direction === _ChatConversation.ChatSearchDirection.UP ? 'up' : 'down',
        timestamp: timestamp,
        count: count,
        sender: sender,
        isChatThread: isChatThread
      }
    });
    ChatManager.checkErrorFromResult(r);
    const ret = [];
    const rr = r === null || r === void 0 ? void 0 : r[_Consts.MTloadMsgWithKeywords];
    if (rr) {
      Object.entries(rr).forEach(value => {
        ret.push(new _ChatMessage.ChatMessage(value[1]));
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
      direction = _ChatConversation.ChatSearchDirection.UP,
      timestamp = -1,
      count = 20,
      sender,
      searchScope = _ChatMessage.ChatMessageSearchScope.All,
      isChatThread = false
    } = params;
    _ChatConst.chatlog.log(`${ChatManager.TAG}: getMsgsWithKeyword: `, convId, convType, keywords, direction, timestamp, count, searchScope, sender, isChatThread);
    let r = await _Native.Native._callMethod(_Consts.MTloadMsgWithKeywords, {
      [_Consts.MTloadMsgWithKeywords]: {
        convId: convId,
        convType: convType,
        keywords: keywords,
        direction: direction === _ChatConversation.ChatSearchDirection.UP ? 'up' : 'down',
        timestamp: timestamp,
        count: count,
        sender: sender,
        searchScope: searchScope,
        isChatThread: isChatThread
      }
    });
    ChatManager.checkErrorFromResult(r);
    const ret = [];
    const rr = r === null || r === void 0 ? void 0 : r[_Consts.MTloadMsgWithKeywords];
    if (rr) {
      Object.entries(rr).forEach(value => {
        ret.push(new _ChatMessage.ChatMessage(value[1]));
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
    let direction = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : _ChatConversation.ChatSearchDirection.UP;
    let count = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : 20;
    let isChatThread = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : false;
    _ChatConst.chatlog.log(`${ChatManager.TAG}: getMessageWithTimestamp: `, convId, convType, startTime, endTime, direction, count, isChatThread);
    let r = await _Native.Native._callMethod(_Consts.MTloadMsgWithTime, {
      [_Consts.MTloadMsgWithTime]: {
        convId: convId,
        convType: convType,
        startTime: startTime,
        endTime: endTime,
        direction: direction === _ChatConversation.ChatSearchDirection.UP ? 'up' : 'down',
        count: count,
        isChatThread: isChatThread
      }
    });
    ChatManager.checkErrorFromResult(r);
    const ret = [];
    const rr = r === null || r === void 0 ? void 0 : r[_Consts.MTloadMsgWithTime];
    if (rr) {
      Object.entries(rr).forEach(value => {
        ret.push(new _ChatMessage.ChatMessage(value[1]));
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
      direction = _ChatConversation.ChatSearchDirection.UP,
      count = 20,
      isChatThread = false
    } = params;
    _ChatConst.chatlog.log(`${ChatManager.TAG}: getMsgWithTimestamp: `, convId, convType, startTime, endTime, direction, count, isChatThread);
    let r = await _Native.Native._callMethod(_Consts.MTloadMsgWithTime, {
      [_Consts.MTloadMsgWithTime]: {
        convId: convId,
        convType: convType,
        startTime: startTime,
        endTime: endTime,
        direction: direction === _ChatConversation.ChatSearchDirection.UP ? 'up' : 'down',
        count: count,
        isChatThread: isChatThread
      }
    });
    ChatManager.checkErrorFromResult(r);
    const ret = [];
    const rr = r === null || r === void 0 ? void 0 : r[_Consts.MTloadMsgWithTime];
    if (rr) {
      Object.entries(rr).forEach(value => {
        ret.push(new _ChatMessage.ChatMessage(value[1]));
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
    _ChatConst.chatlog.log(`${ChatManager.TAG}: translateMessage: `, msg, languages);
    let r = await _Native.Native._callMethod(_Consts.MTtranslateMessage, {
      [_Consts.MTtranslateMessage]: {
        message: msg,
        languages: languages
      }
    });
    ChatManager.checkErrorFromResult(r);
    const rr = r === null || r === void 0 ? void 0 : r[_Consts.MTtranslateMessage];
    return new _ChatMessage.ChatMessage(rr === null || rr === void 0 ? void 0 : rr.message);
  }

  /**
   * Gets all languages supported by the translation service.
   *
   * @returns The list of languages supported for translation.
   *
   * @throws A description of the exception. See {@link ChatError}.
   */
  async fetchSupportedLanguages() {
    _ChatConst.chatlog.log(`${ChatManager.TAG}: fetchSupportedLanguages: `);
    let r = await _Native.Native._callMethod(_Consts.MTfetchSupportLanguages);
    ChatManager.checkErrorFromResult(r);
    const ret = [];
    const rr = r === null || r === void 0 ? void 0 : r[_Consts.MTfetchSupportLanguages];
    if (rr) {
      rr.forEach(value => {
        ret.push(new _ChatTranslateLanguage.ChatTranslateLanguage(value));
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
    _ChatConst.chatlog.log(`${ChatManager.TAG}: setConversationExtension: `, convId, convType, ext, isChatThread);
    let r = await _Native.Native._callMethod(_Consts.MTsyncConversationExt, {
      [_Consts.MTsyncConversationExt]: {
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
    _ChatConst.chatlog.log(`${ChatManager.TAG}: addReaction: `, reaction, msgId);
    let r = await _Native.Native._callMethod(_Consts.MTaddReaction, {
      [_Consts.MTaddReaction]: {
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
    _ChatConst.chatlog.log(`${ChatManager.TAG}: removeReaction: `, reaction, msgId);
    let r = await _Native.Native._callMethod(_Consts.MTremoveReaction, {
      [_Consts.MTremoveReaction]: {
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
    _ChatConst.chatlog.log(`${ChatManager.TAG}: fetchReactionList: `, msgIds, groupId, chatType);
    let r = await _Native.Native._callMethod(_Consts.MTfetchReactionList, {
      [_Consts.MTfetchReactionList]: {
        msgIds,
        groupId,
        chatType
      }
    });
    ChatManager.checkErrorFromResult(r);
    const ret = new Map();
    Object.entries(r === null || r === void 0 ? void 0 : r[_Consts.MTfetchReactionList]).forEach(v => {
      const list = [];
      Object.entries(v[1]).forEach(vv => {
        list.push(new _ChatMessageReaction.ChatMessageReaction(vv[1]));
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
    _ChatConst.chatlog.log(`${ChatManager.TAG}: fetchReactionDetail: `, msgId, reaction, cursor, pageSize);
    let r = await _Native.Native._callMethod(_Consts.MTfetchReactionDetail, {
      [_Consts.MTfetchReactionDetail]: {
        msgId,
        reaction,
        cursor,
        pageSize
      }
    });
    ChatManager.checkErrorFromResult(r);
    let ret = new _ChatCursorResult.ChatCursorResult({
      cursor: r === null || r === void 0 ? void 0 : r[_Consts.MTfetchReactionDetail].cursor,
      list: r === null || r === void 0 ? void 0 : r[_Consts.MTfetchReactionDetail].list,
      opt: {
        map: param => {
          return new _ChatMessageReaction.ChatMessageReaction(param);
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
    _ChatConst.chatlog.log(`${ChatManager.TAG}: reportMessage: `, msgId, tag, reason);
    let r = await _Native.Native._callMethod(_Consts.MTreportMessage, {
      [_Consts.MTreportMessage]: {
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
    _ChatConst.chatlog.log(`${ChatManager.TAG}: getReactionList: `, msgId);
    let r = await _Native.Native._callMethod(_Consts.MTgetReactionList, {
      [_Consts.MTgetReactionList]: {
        msgId
      }
    });
    ChatManager.checkErrorFromResult(r);
    const ret = [];
    if (r !== null && r !== void 0 && r[_Consts.MTgetReactionList]) {
      Object.entries(r === null || r === void 0 ? void 0 : r[_Consts.MTgetReactionList]).forEach(value => {
        ret.push(new _ChatMessageReaction.ChatMessageReaction(value[1]));
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
    _ChatConst.chatlog.log(`${ChatManager.TAG}: groupAckCount: `, msgId);
    let r = await _Native.Native._callMethod(_Consts.MTgroupAckCount, {
      [_Consts.MTgroupAckCount]: {
        msgId
      }
    });
    ChatManager.checkErrorFromResult(r);
    if ((r === null || r === void 0 ? void 0 : r[_Consts.MTgroupAckCount]) !== undefined) {
      return r === null || r === void 0 ? void 0 : r[_Consts.MTgroupAckCount];
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
    _ChatConst.chatlog.log(`${ChatManager.TAG}: createChatThread: `, name, msgId, parentId);
    let r = await _Native.Native._callMethod(_Consts.MTcreateChatThread, {
      [_Consts.MTcreateChatThread]: {
        name: name,
        messageId: msgId,
        parentId: parentId
      }
    });
    ChatManager.checkErrorFromResult(r);
    return new _ChatMessageThread.ChatMessageThread(r === null || r === void 0 ? void 0 : r[_Consts.MTcreateChatThread]);
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
    _ChatConst.chatlog.log(`${ChatManager.TAG}: joinChatThread: `, chatThreadId);
    let r = await _Native.Native._callMethod(_Consts.MTjoinChatThread, {
      [_Consts.MTjoinChatThread]: {
        threadId: chatThreadId
      }
    });
    ChatManager.checkErrorFromResult(r);
    return new _ChatMessageThread.ChatMessageThread(r === null || r === void 0 ? void 0 : r[_Consts.MTjoinChatThread]);
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
    _ChatConst.chatlog.log(`${ChatManager.TAG}: leaveChatThread: `, chatThreadId);
    let r = await _Native.Native._callMethod(_Consts.MTleaveChatThread, {
      [_Consts.MTleaveChatThread]: {
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
    _ChatConst.chatlog.log(`${ChatManager.TAG}: destroyChatThread: `, chatThreadId);
    let r = await _Native.Native._callMethod(_Consts.MTdestroyChatThread, {
      [_Consts.MTdestroyChatThread]: {
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
    _ChatConst.chatlog.log(`${ChatManager.TAG}: updateChatThreadName: `, chatThreadId, newName);
    let r = await _Native.Native._callMethod(_Consts.MTupdateChatThreadSubject, {
      [_Consts.MTupdateChatThreadSubject]: {
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
    _ChatConst.chatlog.log(`${ChatManager.TAG}: removeMemberWithChatThread: `, chatThreadId, memberId);
    let r = await _Native.Native._callMethod(_Consts.MTremoveMemberFromChatThread, {
      [_Consts.MTremoveMemberFromChatThread]: {
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
    _ChatConst.chatlog.log(`${ChatManager.TAG}: fetchMembersWithChatThreadFromServer: `, chatThreadId, cursor, pageSize);
    let r = await _Native.Native._callMethod(_Consts.MTfetchChatThreadMember, {
      [_Consts.MTfetchChatThreadMember]: {
        threadId: chatThreadId,
        cursor: cursor,
        pageSize: pageSize
      }
    });
    ChatManager.checkErrorFromResult(r);
    let ret = new _ChatCursorResult.ChatCursorResult({
      cursor: r === null || r === void 0 ? void 0 : r[_Consts.MTfetchChatThreadMember].cursor,
      list: r === null || r === void 0 ? void 0 : r[_Consts.MTfetchChatThreadMember].list,
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
    _ChatConst.chatlog.log(`${ChatManager.TAG}: fetchJoinedChatThreadFromServer: `, cursor, pageSize);
    let r = await _Native.Native._callMethod(_Consts.MTfetchJoinedChatThreads, {
      [_Consts.MTfetchJoinedChatThreads]: {
        cursor: cursor,
        pageSize: pageSize
      }
    });
    ChatManager.checkErrorFromResult(r);
    let ret = new _ChatCursorResult.ChatCursorResult({
      cursor: r === null || r === void 0 ? void 0 : r[_Consts.MTfetchJoinedChatThreads].cursor,
      list: r === null || r === void 0 ? void 0 : r[_Consts.MTfetchJoinedChatThreads].list,
      opt: {
        map: param => {
          return new _ChatMessageThread.ChatMessageThread(param);
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
    _ChatConst.chatlog.log(`${ChatManager.TAG}: fetchJoinedChatThreadWithParentFromServer: `, parentId, cursor, pageSize);
    let r = await _Native.Native._callMethod(_Consts.MTfetchJoinedChatThreadsWithParentId, {
      [_Consts.MTfetchJoinedChatThreadsWithParentId]: {
        parentId: parentId,
        cursor: cursor,
        pageSize: pageSize
      }
    });
    ChatManager.checkErrorFromResult(r);
    let ret = new _ChatCursorResult.ChatCursorResult({
      cursor: r === null || r === void 0 ? void 0 : r[_Consts.MTfetchJoinedChatThreadsWithParentId].cursor,
      list: r === null || r === void 0 ? void 0 : r[_Consts.MTfetchJoinedChatThreadsWithParentId].list,
      opt: {
        map: param => {
          return new _ChatMessageThread.ChatMessageThread(param);
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
    _ChatConst.chatlog.log(`${ChatManager.TAG}: fetchChatThreadWithParentFromServer: `, parentId, cursor, pageSize);
    let r = await _Native.Native._callMethod(_Consts.MTfetchChatThreadsWithParentId, {
      [_Consts.MTfetchChatThreadsWithParentId]: {
        parentId: parentId,
        cursor: cursor,
        pageSize: pageSize
      }
    });
    ChatManager.checkErrorFromResult(r);
    let ret = new _ChatCursorResult.ChatCursorResult({
      cursor: r === null || r === void 0 ? void 0 : r[_Consts.MTfetchChatThreadsWithParentId].cursor,
      list: r === null || r === void 0 ? void 0 : r[_Consts.MTfetchChatThreadsWithParentId].list,
      opt: {
        map: param => {
          return new _ChatMessageThread.ChatMessageThread(param);
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
    _ChatConst.chatlog.log(`${ChatManager.TAG}: fetchLastMessageWithChatThread: `, chatThreadIds);
    let r = await _Native.Native._callMethod(_Consts.MTfetchLastMessageWithChatThreads, {
      [_Consts.MTfetchLastMessageWithChatThreads]: {
        threadIds: chatThreadIds
      }
    });
    ChatManager.checkErrorFromResult(r);
    const ret = new Map();
    Object.entries(r === null || r === void 0 ? void 0 : r[_Consts.MTfetchLastMessageWithChatThreads]).forEach(v => {
      ret.set(v[0], new _ChatMessage.ChatMessage(v[1]));
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
    _ChatConst.chatlog.log(`${ChatManager.TAG}: fetchChatThreadFromServer: `, chatThreadId);
    let r = await _Native.Native._callMethod(_Consts.MTfetchChatThreadDetail, {
      [_Consts.MTfetchChatThreadDetail]: {
        threadId: chatThreadId
      }
    });
    ChatManager.checkErrorFromResult(r);
    const rr = r === null || r === void 0 ? void 0 : r[_Consts.MTfetchChatThreadDetail];
    if (rr) {
      return new _ChatMessageThread.ChatMessageThread(rr);
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
    _ChatConst.chatlog.log(`${ChatManager.TAG}: getMessageThread: `, msgId);
    let r = await _Native.Native._callMethod(_Consts.MTgetMessageThread, {
      [_Consts.MTgetMessageThread]: {
        msgId: msgId
      }
    });
    ChatManager.checkErrorFromResult(r);
    const rr = r === null || r === void 0 ? void 0 : r[_Consts.MTgetMessageThread];
    if (rr) {
      return new _ChatMessageThread.ChatMessageThread(rr);
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
    _ChatConst.chatlog.log(`${ChatManager.TAG}: getThreadConversation: `, convId, createIfNeed);
    let r = await _Native.Native._callMethod(_Consts.MTgetThreadConversation, {
      [_Consts.MTgetThreadConversation]: {
        convId: convId,
        createIfNeed: createIfNeed
      }
    });
    _Native.Native.checkErrorFromResult(r);
    const rr = r === null || r === void 0 ? void 0 : r[_Consts.MTgetThreadConversation];
    if (rr) {
      return new _ChatConversation.ChatConversation(rr);
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
    _ChatConst.chatlog.log(`${ChatManager.TAG}: fetchConversationsFromServerWithPage: `, pageSize, pageNum);
    let r = await _Native.Native._callMethod(_Consts.MTfetchConversationsFromServerWithPage, {
      [_Consts.MTfetchConversationsFromServerWithPage]: {
        pageSize: pageSize,
        pageNum: pageNum
      }
    });
    _Native.Native.checkErrorFromResult(r);
    let ret = [];
    const rr = r === null || r === void 0 ? void 0 : r[_Consts.MTfetchConversationsFromServerWithPage];
    if (rr) {
      rr.forEach(element => {
        ret.push(new _ChatConversation.ChatConversation(element));
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
    _ChatConst.chatlog.log(`${ChatManager.TAG}: removeMessagesFromServerWithMsgIds: `, convId, convType, msgIds, isChatThread);
    if (msgIds.length === 0) {
      // todo: temp fix native
      console.log(`${ChatManager.TAG}: removeMessagesFromServerWithMsgIds: msgIds count is 0`);
      throw new _ChatError.ChatError({
        code: 1,
        description: 'msgIds count is 0'
      });
    }
    if ((await _ChatClient.ChatClient.getInstance().isLoginBefore()) === false) {
      // todo: temp fix native
      console.log(`${ChatManager.TAG}: removeMessagesFromServerWithMsgIds: not logged in yet.`);
      throw new _ChatError.ChatError({
        code: 1,
        description: 'not logged in yet'
      });
    }
    let r = await _Native.Native._callMethod(_Consts.MTremoveMessagesFromServerWithMsgIds, {
      [_Consts.MTremoveMessagesFromServerWithMsgIds]: {
        convId: convId,
        convType: convType,
        msgIds: msgIds,
        isChatThread: isChatThread
      }
    });
    _Native.Native.checkErrorFromResult(r);
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
    _ChatConst.chatlog.log(`${ChatManager.TAG}: removeMessagesFromServerWithTimestamp: `, convId, convType, timestamp, isChatThread);
    if (timestamp <= 0) {
      // todo: temp fix native
      console.log(`${ChatManager.TAG}: removeMessagesFromServerWithTimestamp: timestamp <= 0`);
      throw new _ChatError.ChatError({
        code: 1,
        description: 'timestamp <= 0'
      });
    }
    if ((await _ChatClient.ChatClient.getInstance().isLoginBefore()) === false) {
      // todo: temp fix native
      console.log(`${ChatManager.TAG}: removeMessagesFromServerWithTimestamp: not logged in yet.`);
      throw new _ChatError.ChatError({
        code: 1,
        description: 'not logged in yet'
      });
    }
    let r = await _Native.Native._callMethod(_Consts.MTremoveMessagesFromServerWithTs, {
      [_Consts.MTremoveMessagesFromServerWithTs]: {
        convId: convId,
        convType: convType,
        timestamp: timestamp,
        isChatThread: isChatThread
      }
    });
    _Native.Native.checkErrorFromResult(r);
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
    _ChatConst.chatlog.log(`${ChatManager.TAG}: fetchConversationsFromServerWithCursor: ${cursor}, ${pageSize}`);
    let r = await _Native.Native._callMethod(_Consts.MTgetConversationsFromServerWithCursor, {
      [_Consts.MTgetConversationsFromServerWithCursor]: {
        cursor: cursor ?? '',
        pageSize: pageSize ?? 20
      }
    });
    _Native.Native.checkErrorFromResult(r);
    let ret = new _ChatCursorResult.ChatCursorResult({
      cursor: r === null || r === void 0 ? void 0 : r[_Consts.MTgetConversationsFromServerWithCursor].cursor,
      list: r === null || r === void 0 ? void 0 : r[_Consts.MTgetConversationsFromServerWithCursor].list,
      opt: {
        map: param => {
          return new _ChatConversation.ChatConversation(param);
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
    _ChatConst.chatlog.log(`${ChatManager.TAG}: fetchPinnedConversationsFromServerWithCursor: ${cursor}, ${pageSize}`);
    let r = await _Native.Native._callMethod(_Consts.MTgetPinnedConversationsFromServerWithCursor, {
      [_Consts.MTgetPinnedConversationsFromServerWithCursor]: {
        cursor: cursor ?? '',
        pageSize: pageSize ?? 20
      }
    });
    _Native.Native.checkErrorFromResult(r);
    let ret = new _ChatCursorResult.ChatCursorResult({
      cursor: r === null || r === void 0 ? void 0 : r[_Consts.MTgetPinnedConversationsFromServerWithCursor].cursor,
      list: r === null || r === void 0 ? void 0 : r[_Consts.MTgetPinnedConversationsFromServerWithCursor].list,
      opt: {
        map: param => {
          return new _ChatConversation.ChatConversation(param);
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
    _ChatConst.chatlog.log(`${ChatManager.TAG}: pinConversation: ${convId}, ${isPinned}`);
    let r = await _Native.Native._callMethod(_Consts.MTpinConversation, {
      [_Consts.MTpinConversation]: {
        convId,
        isPinned
      }
    });
    _Native.Native.checkErrorFromResult(r);
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
    _ChatConst.chatlog.log(`${ChatManager.TAG}: modifyMessageBody: ${msgId}, ${body.type}`);
    if (body.type !== _ChatMessage.ChatMessageType.TXT) {
      throw new _ChatError.ChatError({
        code: 1,
        description: 'Currently only text message content modification is supported.'
      });
    }
    let r = await _Native.Native._callMethod(_Consts.MTmodifyMessage, {
      [_Consts.MTmodifyMessage]: {
        msgId,
        body
      }
    });
    _Native.Native.checkErrorFromResult(r);
    const rr = r === null || r === void 0 ? void 0 : r[_Consts.MTmodifyMessage];
    return new _ChatMessage.ChatMessage(rr);
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
    _ChatConst.chatlog.log(`${ChatManager.TAG}: fetchCombineMessageDetail: ${message.body.type}`);
    if (message.body.type !== _ChatMessage.ChatMessageType.COMBINE) {
      throw new _ChatError.ChatError({
        code: 1,
        description: 'Please select a combine type message.'
      });
    }
    let r = await _Native.Native._callMethod(_Consts.MTdownloadAndParseCombineMessage, {
      [_Consts.MTdownloadAndParseCombineMessage]: {
        message
      }
    });
    _Native.Native.checkErrorFromResult(r);
    const ret = [];
    const rr = r === null || r === void 0 ? void 0 : r[_Consts.MTdownloadAndParseCombineMessage];
    if (rr) {
      Object.entries(rr).forEach(value => {
        ret.push(new _ChatMessage.ChatMessage(value[1]));
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
    _ChatConst.chatlog.log(`${ChatManager.TAG}: addRemoteAndLocalConversationsMark: ${convIds}, ${mark}`);
    let r = await _Native.Native._callMethod(_Consts.MTaddRemoteAndLocalConversationsMark, {
      [_Consts.MTaddRemoteAndLocalConversationsMark]: {
        convIds,
        mark
      }
    });
    _Native.Native.checkErrorFromResult(r);
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
    _ChatConst.chatlog.log(`${ChatManager.TAG}: deleteRemoteAndLocalConversationsMark: ${convIds}, ${mark}`);
    let r = await _Native.Native._callMethod(_Consts.MTdeleteRemoteAndLocalConversationsMark, {
      [_Consts.MTdeleteRemoteAndLocalConversationsMark]: {
        convIds,
        mark
      }
    });
    _Native.Native.checkErrorFromResult(r);
  }

  /**
   * Gets the conversations from the server by conversation filter options.
   *
   * @param option The conversation filter options. See {@link ChatConversationFetchOptions}.
   *
   * @returns The retrieved list of conversations. See {@link ChatCursorResult}.
   */
  async fetchConversationsByOptions(option) {
    _ChatConst.chatlog.log(`${ChatManager.TAG}: fetchConversationsByOptions: ${option}`);
    let r = await _Native.Native._callMethod(_Consts.MTfetchConversationsByOptions, {
      [_Consts.MTfetchConversationsByOptions]: {
        ...option
      }
    });
    _Native.Native.checkErrorFromResult(r);
    let ret = new _ChatCursorResult.ChatCursorResult({
      cursor: r === null || r === void 0 ? void 0 : r[_Consts.MTfetchConversationsByOptions].cursor,
      list: r === null || r === void 0 ? void 0 : r[_Consts.MTfetchConversationsByOptions].list,
      opt: {
        map: param => {
          return new _ChatConversation.ChatConversation(param);
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
    _ChatConst.chatlog.log(`${ChatManager.TAG}: deleteAllMessageAndConversation: ${clearServerData}`);
    let r = await _Native.Native._callMethod(_Consts.MTdeleteAllMessageAndConversation, {
      [_Consts.MTdeleteAllMessageAndConversation]: {
        clearServerData: clearServerData
      }
    });
    _Native.Native.checkErrorFromResult(r);
  }

  /**
   * Pins a message.
   *
   * @param messageId The message ID.
   *
   * @throws A description of the exception. See {@link ChatError}.
   */
  async pinMessage(messageId) {
    _ChatConst.chatlog.log(`${ChatManager.TAG}: pinMessage: ${messageId}`);
    let r = await _Native.Native._callMethod(_Consts.MTpinMessage, {
      [_Consts.MTpinMessage]: {
        msgId: messageId
      }
    });
    _Native.Native.checkErrorFromResult(r);
  }

  /**
   * Unpins a message.
   *
   * @param messageId The message ID.
   *
   * @throws A description of the exception. See {@link ChatError}.
   */
  async unpinMessage(messageId) {
    _ChatConst.chatlog.log(`${ChatManager.TAG}: pinMessage: ${messageId}`);
    let r = await _Native.Native._callMethod(_Consts.MTunpinMessage, {
      [_Consts.MTunpinMessage]: {
        msgId: messageId
      }
    });
    _Native.Native.checkErrorFromResult(r);
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
    _ChatConst.chatlog.log(`${ChatManager.TAG}: fetchPinnedMessages:`, convId, convType, isChatThread);
    let r = await _Native.Native._callMethod(_Consts.MTfetchPinnedMessages, {
      [_Consts.MTfetchPinnedMessages]: {
        convId: convId,
        convType: convType,
        isChatThread: isChatThread
      }
    });
    ChatManager.checkErrorFromResult(r);
    const ret = [];
    const rr = r === null || r === void 0 ? void 0 : r[_Consts.MTfetchPinnedMessages];
    if (rr) {
      Object.entries(rr).forEach(value => {
        ret.push(new _ChatMessage.ChatMessage(value[1]));
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
    _ChatConst.chatlog.log(`${ChatManager.TAG}: getPinnedMessages:`, convId, convType, isChatThread);
    let r = await _Native.Native._callMethod(_Consts.MTpinnedMessages, {
      [_Consts.MTpinnedMessages]: {
        convId: convId,
        convType: convType,
        isChatThread: isChatThread
      }
    });
    ChatManager.checkErrorFromResult(r);
    const ret = [];
    const rr = r === null || r === void 0 ? void 0 : r[_Consts.MTpinnedMessages];
    if (rr) {
      Object.entries(rr).forEach(value => {
        ret.push(new _ChatMessage.ChatMessage(value[1]));
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
    _ChatConst.chatlog.log(`${ChatManager.TAG}: getMessagePinInfo:`, messageId);
    let r = await _Native.Native._callMethod(_Consts.MTgetPinInfo, {
      [_Consts.MTgetPinInfo]: {
        msgId: messageId
      }
    });
    ChatManager.checkErrorFromResult(r);
    if (r !== null && r !== void 0 && r[_Consts.MTgetPinInfo]) {
      return new _ChatMessage.ChatMessagePinInfo(r[_Consts.MTgetPinInfo]);
    }
    return undefined;
  }
}
exports.ChatManager = ChatManager;
//# sourceMappingURL=ChatManager.js.map
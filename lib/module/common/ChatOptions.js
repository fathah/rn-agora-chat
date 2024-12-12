import { ChatAreaCode } from './ChatAreaCode';
/**
 * The chat setting class that defines parameters and options of the SDK, including whether to encrypt the messages before sending them and whether to automatically accept the friend invitations.
 */
export class ChatOptions {
  /**
   * The App Key you get from the console when creating a chat app. It is the unique identifier of your app.
   */

  /**
   * Whether to enable automatic login.
   *
   * - (Default) `true`: Enables automatic login.
   * - `false`: Disables automatic login.
   */

  /**
   * Whether to output the debug information.
   * - `true`: Yes.
   * - (Default) `false`: No.
   *
   */

  /**
   * Global flag for printing logs.
   */

  /**
   * Whether to activate the timestamp of the log.
   */

  /**
   * Whether to accept friend invitations from other users automatically.
   *
   * - `true`: Yes.
   * - (Default) `false`: No.
   */

  /**
   * Whether to accept group invitations automatically.
   *
   * - `true`: Yes.
   * - (Default) `false`: No.
   */

  /**
   * Whether to require the message read receipt from the recipient.
   *
   * - (Default) `true`: Yes.
   * - `false`: No.
   *
   * This property does not take effect for {@link ChatManager.sendConversationReadAck}.
   *
   */

  /**
   * Whether to require the delivery receipt.
   *
   * **Note**
   *
   * Only valid for single chat messages. {@link ChatMessageChatType.PeerChat}
   *
   * - `true`: Yes.
   * - (Default) `false`: No.
   */

  /**
   * Whether to delete the historical messages of the group stored in the memory and local database when leaving a group (either voluntarily or passively).
   *
   * - (Default) `true`: Yes.
   * - `false`: No.
   */

  /**
   * Whether to delete the historical messages of the chat room in the memory and local database when leaving the chat room (either voluntarily or passively).
   *
   * - (Default) `true`: Yes.
   * - `false`: No.
   */

  /**
   * Whether to allow the chat room owner to leave the chat room.
   *
   * - (Default) `true`: Yes. Even if the chat room owner leaves the chat room, the owner still has all privileges, except for receiving messages in the chat room.
   * - `false`: No.
   */

  /**
   * Whether to sort the messages in the reverse chronological order of the time when they are received by the server.
   *
   * - (Default) `true`: Yes;
   * - `false`: No. Messages are sorted in the reverse chronological order of the time when they are created.
   */

  /**
   * Whether only HTTPS is used for REST operations.
   *
   * - (Default) `true`: Only HTTPS is supported.
   * - `false`: Both HTTP and HTTPS are allowed.
   */

  /**
   * Whether to upload the message attachments automatically to the chat server.
   *
   * - (Default) `true`: Yes.
   * - `false`: No. A custom path is used.
   */

  /**
   * Whether to automatically download the thumbnail.
   *
   * - (Default) `true`: Yes.
   * - `false`: No.
   */

  /**
   * The push configuration.
   */

  /**
   * Whether to disable DNS.
   *
   * - (Default) `true`: Yes.
   * - `false`: No. DNS needs to be disabled for private deployment.
   */

  /**
   * The URL of the DNS server.
   */

  /**
   * The custom address of the REST server.
   *
   * This address is used when you implement data isolation and data security during private deployment.
   *
   * If you need the address, contact our business manager.
   */

  /**
   * The custom address of the IM message server.
   *
   * This address is used when you implement data isolation and data security during private deployment.
   *
   * If you need the address, contact our business manager.
   */

  /**
   * The custom port of the IM server.
   *
   * The custom port is used when you implement data isolation and data security during private deployment.
   *
   * If you need the port, contact our business manager.
   */

  /**
   * Whether to enable TLS connection, which takes effect during initialization and is `false` by default.
   */

  /**
   * Whether the sent message is included in `ChatMessageEventListener.onMessagesReceived`.
   * - `true`: Yes. Besides the received message, the sent message is also included in `ChatMessageEventListener.onMessagesReceived`.
   * - (Default)`false`: No. Only the received message is included in `ChatMessageEventListener.onMessagesReceived`.
   */

  /**
   * Whether to set messages from the server side as read.
   * - `true`: Yes.
   * - (Default) `false`: No.
   */

  /**
   * The area code.
   * This attribute is used to restrict the scope of accessible edge nodes. The default value is `GLOB`. See {@link ChatAreaCode}.
   * This attribute can be set only when you call {@link ChatClient.init}. The attribute setting cannot be changed during the app runtime.
   */

  /**
   * Whether to include empty conversations when the SDK loads conversations from the local database:
   *
   * - `true`: Yes. Empty conversations are included.
   * - (Default) `false`: No. Empty conversations are excluded.
   */

  /**
   * Custom device name.
   *
   * This attribute does not take effect when `customOSType` is set to `-1`.
   *
   * An application scenario is as follows: User A wants to log in to a mobile phone and a tablet with the same user account. Then the user sets `customOSType` to `1` and `customDeviceName` to `foo`.
   *
   */

  /**
   * Custom system type.
   */

  /**
   * Whether the server returns the sender the text message with the content replaced during text moderation:
   * - `true`: Yes.
   * - (Default) `false`: No. The server returns the original message to the sender.
   */

  constructor(params) {
    this.appKey = params.appKey;
    this.autoLogin = params.autoLogin ?? true;
    this.debugModel = params.debugModel ?? false;
    this.acceptInvitationAlways = params.acceptInvitationAlways ?? false;
    this.autoAcceptGroupInvitation = params.autoAcceptGroupInvitation ?? false;
    this.requireAck = params.requireAck ?? true;
    this.requireDeliveryAck = params.requireDeliveryAck ?? false;
    this.deleteMessagesAsExitGroup = params.deleteMessagesAsExitGroup ?? true;
    this.deleteMessagesAsExitChatRoom = params.deleteMessagesAsExitChatRoom ?? true;
    this.isChatRoomOwnerLeaveAllowed = params.isChatRoomOwnerLeaveAllowed ?? true;
    this.sortMessageByServerTime = params.sortMessageByServerTime ?? true;
    this.usingHttpsOnly = params.usingHttpsOnly ?? true;
    this.serverTransfer = params.serverTransfer ?? true;
    this.isAutoDownload = params.isAutoDownload ?? true;
    this.pushConfig = params.pushConfig;
    this.enableDNSConfig = params.enableDNSConfig !== undefined ? params.enableDNSConfig : true;
    this.dnsUrl = params.dnsUrl ?? '';
    this.restServer = params.restServer ?? '';
    this.imServer = params.imServer ?? '';
    this.imPort = params.imPort !== undefined ? params.imPort : 0;
    this.areaCode = params.areaCode ?? ChatAreaCode.GLOB;
    this.logTag = params.logTag;
    this.logTimestamp = params.logTimestamp;
    this.enableEmptyConversation = params.enableEmptyConversation ?? false;
    this.customDeviceName = params.customDeviceName;
    this.customOSType = params.customOSType;
    this.enableTLS = params.enableTLS ?? false;
    this.messagesReceiveCallbackIncludeSend = params.messagesReceiveCallbackIncludeSend ?? false;
    this.regardImportMessagesAsRead = params.regardImportMessagesAsRead ?? false;
    this.useReplacedMessageContents = params.useReplacedMessageContents ?? false;
  }
}
//# sourceMappingURL=ChatOptions.js.map
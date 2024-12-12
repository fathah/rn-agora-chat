import { ExceptionHandler } from './__internal__/ErrorHandler';
import { ChatException } from './common/ChatError';
/**
 *  The event types in multi-device login scenarios.
 *
 * This class takes user A that uses both Device A1 and Device A2 as an example to describe when the various types of multi-device events are triggered.
 */
export let ChatMultiDeviceEvent = /*#__PURE__*/function (ChatMultiDeviceEvent) {
  ChatMultiDeviceEvent[ChatMultiDeviceEvent["CONTACT_REMOVE"] = 2] = "CONTACT_REMOVE";
  ChatMultiDeviceEvent[ChatMultiDeviceEvent["CONTACT_ACCEPT"] = 3] = "CONTACT_ACCEPT";
  ChatMultiDeviceEvent[ChatMultiDeviceEvent["CONTACT_DECLINE"] = 4] = "CONTACT_DECLINE";
  ChatMultiDeviceEvent[ChatMultiDeviceEvent["CONTACT_BAN"] = 5] = "CONTACT_BAN";
  ChatMultiDeviceEvent[ChatMultiDeviceEvent["CONTACT_ALLOW"] = 6] = "CONTACT_ALLOW";
  ChatMultiDeviceEvent[ChatMultiDeviceEvent["GROUP_CREATE"] = 10] = "GROUP_CREATE";
  ChatMultiDeviceEvent[ChatMultiDeviceEvent["GROUP_DESTROY"] = 11] = "GROUP_DESTROY";
  ChatMultiDeviceEvent[ChatMultiDeviceEvent["GROUP_JOIN"] = 12] = "GROUP_JOIN";
  ChatMultiDeviceEvent[ChatMultiDeviceEvent["GROUP_LEAVE"] = 13] = "GROUP_LEAVE";
  ChatMultiDeviceEvent[ChatMultiDeviceEvent["GROUP_APPLY"] = 14] = "GROUP_APPLY";
  ChatMultiDeviceEvent[ChatMultiDeviceEvent["GROUP_APPLY_ACCEPT"] = 15] = "GROUP_APPLY_ACCEPT";
  ChatMultiDeviceEvent[ChatMultiDeviceEvent["GROUP_APPLY_DECLINE"] = 16] = "GROUP_APPLY_DECLINE";
  ChatMultiDeviceEvent[ChatMultiDeviceEvent["GROUP_INVITE"] = 17] = "GROUP_INVITE";
  ChatMultiDeviceEvent[ChatMultiDeviceEvent["GROUP_INVITE_ACCEPT"] = 18] = "GROUP_INVITE_ACCEPT";
  ChatMultiDeviceEvent[ChatMultiDeviceEvent["GROUP_INVITE_DECLINE"] = 19] = "GROUP_INVITE_DECLINE";
  ChatMultiDeviceEvent[ChatMultiDeviceEvent["GROUP_KICK"] = 20] = "GROUP_KICK";
  ChatMultiDeviceEvent[ChatMultiDeviceEvent["GROUP_BAN"] = 21] = "GROUP_BAN";
  ChatMultiDeviceEvent[ChatMultiDeviceEvent["GROUP_ALLOW"] = 22] = "GROUP_ALLOW";
  ChatMultiDeviceEvent[ChatMultiDeviceEvent["GROUP_BLOCK"] = 23] = "GROUP_BLOCK";
  ChatMultiDeviceEvent[ChatMultiDeviceEvent["GROUP_UNBLOCK"] = 24] = "GROUP_UNBLOCK";
  ChatMultiDeviceEvent[ChatMultiDeviceEvent["GROUP_ASSIGN_OWNER"] = 25] = "GROUP_ASSIGN_OWNER";
  ChatMultiDeviceEvent[ChatMultiDeviceEvent["GROUP_ADD_ADMIN"] = 26] = "GROUP_ADD_ADMIN";
  ChatMultiDeviceEvent[ChatMultiDeviceEvent["GROUP_REMOVE_ADMIN"] = 27] = "GROUP_REMOVE_ADMIN";
  ChatMultiDeviceEvent[ChatMultiDeviceEvent["GROUP_ADD_MUTE"] = 28] = "GROUP_ADD_MUTE";
  ChatMultiDeviceEvent[ChatMultiDeviceEvent["GROUP_REMOVE_MUTE"] = 29] = "GROUP_REMOVE_MUTE";
  ChatMultiDeviceEvent[ChatMultiDeviceEvent["GROUP_ADD_USER_ALLOW_LIST"] = 30] = "GROUP_ADD_USER_ALLOW_LIST";
  ChatMultiDeviceEvent[ChatMultiDeviceEvent["GROUP_REMOVE_USER_ALLOW_LIST"] = 31] = "GROUP_REMOVE_USER_ALLOW_LIST";
  ChatMultiDeviceEvent[ChatMultiDeviceEvent["GROUP_ALL_BAN"] = 32] = "GROUP_ALL_BAN";
  ChatMultiDeviceEvent[ChatMultiDeviceEvent["GROUP_REMOVE_ALL_BAN"] = 33] = "GROUP_REMOVE_ALL_BAN";
  ChatMultiDeviceEvent[ChatMultiDeviceEvent["GROUP_METADATA_CHANGED"] = 34] = "GROUP_METADATA_CHANGED";
  ChatMultiDeviceEvent[ChatMultiDeviceEvent["THREAD_CREATE"] = 40] = "THREAD_CREATE";
  ChatMultiDeviceEvent[ChatMultiDeviceEvent["THREAD_DESTROY"] = 41] = "THREAD_DESTROY";
  ChatMultiDeviceEvent[ChatMultiDeviceEvent["THREAD_JOIN"] = 42] = "THREAD_JOIN";
  ChatMultiDeviceEvent[ChatMultiDeviceEvent["THREAD_LEAVE"] = 43] = "THREAD_LEAVE";
  ChatMultiDeviceEvent[ChatMultiDeviceEvent["THREAD_UPDATE"] = 44] = "THREAD_UPDATE";
  ChatMultiDeviceEvent[ChatMultiDeviceEvent["THREAD_KICK"] = 45] = "THREAD_KICK";
  ChatMultiDeviceEvent[ChatMultiDeviceEvent["CONVERSATION_PINNED"] = 60] = "CONVERSATION_PINNED";
  ChatMultiDeviceEvent[ChatMultiDeviceEvent["CONVERSATION_UNPINNED"] = 61] = "CONVERSATION_UNPINNED";
  ChatMultiDeviceEvent[ChatMultiDeviceEvent["CONVERSATION_DELETED"] = 62] = "CONVERSATION_DELETED";
  ChatMultiDeviceEvent[ChatMultiDeviceEvent["CONVERSATION_UPDATE_MARK"] = 63] = "CONVERSATION_UPDATE_MARK";
  return ChatMultiDeviceEvent;
}({});

/**
 * Converts the multi-device event from Int to enum.
 *
 * @param params The multi-device event of the int type.
 * @returns The multi-device event of the enum type.
 */
export function ChatMultiDeviceEventFromNumber(params) {
  switch (params) {
    case 2:
      return ChatMultiDeviceEvent.CONTACT_REMOVE;
    case 3:
      return ChatMultiDeviceEvent.CONTACT_ACCEPT;
    case 4:
      return ChatMultiDeviceEvent.CONTACT_DECLINE;
    case 5:
      return ChatMultiDeviceEvent.CONTACT_BAN;
    case 6:
      return ChatMultiDeviceEvent.CONTACT_ALLOW;
    case 10:
      return ChatMultiDeviceEvent.GROUP_CREATE;
    case 11:
      return ChatMultiDeviceEvent.GROUP_DESTROY;
    case 12:
      return ChatMultiDeviceEvent.GROUP_JOIN;
    case 13:
      return ChatMultiDeviceEvent.GROUP_LEAVE;
    case 14:
      return ChatMultiDeviceEvent.GROUP_APPLY;
    case 15:
      return ChatMultiDeviceEvent.GROUP_APPLY_ACCEPT;
    case 16:
      return ChatMultiDeviceEvent.GROUP_APPLY_DECLINE;
    case 17:
      return ChatMultiDeviceEvent.GROUP_INVITE;
    case 18:
      return ChatMultiDeviceEvent.GROUP_INVITE_ACCEPT;
    case 19:
      return ChatMultiDeviceEvent.GROUP_INVITE_DECLINE;
    case 20:
      return ChatMultiDeviceEvent.GROUP_KICK;
    case 21:
      return ChatMultiDeviceEvent.GROUP_BAN;
    case 22:
      return ChatMultiDeviceEvent.GROUP_ALLOW;
    case 23:
      return ChatMultiDeviceEvent.GROUP_BLOCK;
    case 24:
      return ChatMultiDeviceEvent.GROUP_UNBLOCK;
    case 25:
      return ChatMultiDeviceEvent.GROUP_ASSIGN_OWNER;
    case 26:
      return ChatMultiDeviceEvent.GROUP_ADD_ADMIN;
    case 27:
      return ChatMultiDeviceEvent.GROUP_REMOVE_ADMIN;
    case 28:
      return ChatMultiDeviceEvent.GROUP_ADD_MUTE;
    case 29:
      return ChatMultiDeviceEvent.GROUP_REMOVE_MUTE;
    case 30:
      return ChatMultiDeviceEvent.GROUP_ADD_USER_ALLOW_LIST;
    case 31:
      return ChatMultiDeviceEvent.GROUP_REMOVE_USER_ALLOW_LIST;
    case 32:
      return ChatMultiDeviceEvent.GROUP_ALL_BAN;
    case 33:
      return ChatMultiDeviceEvent.GROUP_REMOVE_ALL_BAN;
    case 40:
      return ChatMultiDeviceEvent.THREAD_CREATE;
    case 41:
      return ChatMultiDeviceEvent.THREAD_DESTROY;
    case 42:
      return ChatMultiDeviceEvent.THREAD_JOIN;
    case 43:
      return ChatMultiDeviceEvent.THREAD_LEAVE;
    case 44:
      return ChatMultiDeviceEvent.THREAD_UPDATE;
    case 45:
      return ChatMultiDeviceEvent.THREAD_KICK;
    case 52:
      return ChatMultiDeviceEvent.GROUP_METADATA_CHANGED;
    case 60:
      return ChatMultiDeviceEvent.CONVERSATION_PINNED;
    case 61:
      return ChatMultiDeviceEvent.CONVERSATION_UNPINNED;
    case 62:
      return ChatMultiDeviceEvent.CONVERSATION_DELETED;
    case 63:
      return ChatMultiDeviceEvent.CONVERSATION_UPDATE_MARK;
    default:
      const ret = params;
      ExceptionHandler.getInstance().sendExcept({
        except: new ChatException({
          code: 1,
          description: `This type is not supported. ` + params
        }),
        from: 'ChatMultiDeviceEventFromNumber'
      });
      return ret;
  }
}

/**
 * The connection event listener.
 *
 * In the case of disconnection in an unstable network environment, the app using the SDK receives the `onDisconnected` callback.
 *
 * You do not need to reconnect manually as the chat SDK will handle it automatically.
 *
 * There are two connection-related callbacks:
 * - `onConnected`: Occurs when the connection is set up.
 * - `onDisconnected`: Occurs when the connection breaks down.
 *
 * Adds a connection event listener:
 *
 *  ```typescript
 *  let listener = new (class s implements ChatConnectEventListener {
 *    onTokenWillExpire(): void {
 *      chatlog.log('ConnectScreen.onTokenWillExpire');
 *    }
 *    onTokenDidExpire(): void {
 *      chatlog.log('ConnectScreen.onTokenDidExpire');
 *    }
 *    onConnected(): void {
 *      chatlog.log('ConnectScreen.onConnected');
 *    }
 *    onDisconnected(errorCode?: number): void {
 *      chatlog.log('ConnectScreen.onDisconnected', errorCode);
 *    }
 *  })();
 *  ChatClient.getInstance().addConnectionListener(listener);
 *  ```
 * Removes a connection event listener:
 *
 *  ```typescript
 *  ChatClient.getInstance().removeConnectionListener(listener);
 *  ```
 */

/**
 * The multi-device event listener.
 *
 * The listener listens for the actions of the current user on other devices, including contact events, group events, thread events, and conversation events.
 */

/**
 * The custom event listener.
 */

/**
 * The message event listener.
 *
 * This listener listens for message state changes:
 *
 * - If messages are sent successfully, a delivery receipt will be returned to the sender (the delivery receipt function needs to be enabled: {@link ChatOptions.requireDeliveryAck}.
 *
 * - If the recipient reads the received message, a read receipt will be returned to the sender (the read receipt function needs to be enabled: {@link ChatOptions.requireAck})
 *
 * During message delivery, the message ID will be changed from a local uuid to a global unique ID that is generated by the server to uniquely identify a message on all devices using the SDK.
 *
 * Adds a message event listener:
 *
 *   ```typescript
 *   let msgListener = new (class ss implements ChatMessageEventListener {
 *     onMessagesReceived(messages: ChatMessage[]): void {
 *       chatlog.log('ConnectScreen.onMessagesReceived', messages);
 *     }
 *     onCmdMessagesReceived(messages: ChatMessage[]): void {
 *       chatlog.log('ConnectScreen.onCmdMessagesReceived', messages);
 *     }
 *     onMessagesRead(messages: ChatMessage[]): void {
 *       chatlog.log('ConnectScreen.onMessagesRead', messages);
 *     }
 *     onGroupMessageRead(groupMessageAcks: ChatGroupMessageAck[]): void {
 *       chatlog.log('ConnectScreen.onGroupMessageRead', groupMessageAcks);
 *     }
 *     onMessagesDelivered(messages: ChatMessage[]): void {
 *       chatlog.log('ConnectScreen.onMessagesDelivered', messages);
 *     }
 *     onMessagesRecalled(messages: ChatMessage[]): void {
 *       chatlog.log('ConnectScreen.onMessagesRecalled', messages);
 *     }
 *     onConversationsUpdate(): void {
 *       chatlog.log('ConnectScreen.onConversationsUpdate');
 *     }
 *     onConversationRead(from: string, to?: string): void {
 *       chatlog.log('ConnectScreen.onConversationRead', from, to);
 *     }
 *   })();
 *   ChatClient.getInstance().chatManager.addListener(msgListener);
 *   ```
 *
 * Removes a message event listener:
 *
 *   ```typescript
 *   ChatClient.getInstance().chatManager.delListener(this.msgListener);
 *   ```
 */

/**
 * The group event listener.
 *
 * For descriptions of callback methods in the listener, user A acts as the current user and user B serves as the peer user.
 */

/**
 * The contact update listener.
 *
 * It listens for contact changes, including adding or removing a friend and accepting and declining a friend request.
 *
 * For descriptions of callback methods in the listener, user A acts as the current user and user B serves as the peer user.
 */

/**
 * The chat room event listener.
 */

/**
 * The presence state change listener.
 */
//# sourceMappingURL=ChatEvents.js.map
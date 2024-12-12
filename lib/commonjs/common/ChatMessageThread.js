"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ChatMessageThreadOperation = exports.ChatMessageThreadEvent = exports.ChatMessageThread = void 0;
exports.ChatMessageThreadOperationFromNumber = ChatMessageThreadOperationFromNumber;
var _ChatMessage = require("./ChatMessage");
/**
 * The chat message thread class.
 */
class ChatMessageThread {
  /**
   * The message thread ID.
   */

  /**
   * The name of the message thread.
   */

  /**
   * The creator of the message thread.
   */

  /**
   * The ID of the parent message of the message thread.
   */

  /**
   * The group ID where the message thread belongs.
   */

  /**
   * The count of members in the message thread.
   */

  /**
   * The count of messages in the message thread.
   */

  /**
   * The Unix timestamp when the message thread is created. The unit is millisecond.
   */

  /**
   * The last reply in the message thread. If it is empty, the last message is withdrawn.
   */

  /**
   * Creates a message thread.
   */
  constructor(params) {
    this.threadId = params.threadId;
    this.threadName = params.threadName;
    this.parentId = params.parentId;
    this.msgId = params.msgId;
    this.owner = params.owner;
    this.memberCount = params.memberCount;
    this.msgCount = params.msgCount;
    this.createAt = params.createAt;
    if (params.lastMessage) {
      this.lastMessage = _ChatMessage.ChatMessage.createReceiveMessage(params.lastMessage);
    }
  }
}

/**
 * The message thread event types.
 */
exports.ChatMessageThread = ChatMessageThread;
let ChatMessageThreadOperation = /*#__PURE__*/function (ChatMessageThreadOperation) {
  ChatMessageThreadOperation[ChatMessageThreadOperation["UnKnown"] = 0] = "UnKnown";
  ChatMessageThreadOperation[ChatMessageThreadOperation["Create"] = 1] = "Create";
  ChatMessageThreadOperation[ChatMessageThreadOperation["Update"] = 2] = "Update";
  ChatMessageThreadOperation[ChatMessageThreadOperation["Delete"] = 3] = "Delete";
  ChatMessageThreadOperation[ChatMessageThreadOperation["Update_Msg"] = 4] = "Update_Msg";
  return ChatMessageThreadOperation;
}({});
/**
 * Converts the message thread event type from Int to enum.
 *
 * @param type The message thread event type of the Int type.
 * @returns The message thread event type of the enum type.
 */
exports.ChatMessageThreadOperation = ChatMessageThreadOperation;
function ChatMessageThreadOperationFromNumber(type) {
  let ret = ChatMessageThreadOperation.UnKnown;
  switch (type) {
    case 1:
      ret = ChatMessageThreadOperation.Create;
      break;
    case 2:
      ret = ChatMessageThreadOperation.Update;
      break;
    case 3:
      ret = ChatMessageThreadOperation.Delete;
      break;
    case 4:
      ret = ChatMessageThreadOperation.Update_Msg;
      break;
    default:
      break;
  }
  return ret;
}

/**
 * The message thread event class.
 */
class ChatMessageThreadEvent {
  /**
   * The user ID of the message thread operator.
   */

  /**
   * The message thread event type.
   */

  /**
   * The message thread object.
   */

  /**
   * Constructs a message thread event.
   */
  constructor(params) {
    this.from = params.from;
    this.type = ChatMessageThreadOperationFromNumber(params.type);
    this.thread = new ChatMessageThread(params.thread);
  }
}
exports.ChatMessageThreadEvent = ChatMessageThreadEvent;
//# sourceMappingURL=ChatMessageThread.js.map
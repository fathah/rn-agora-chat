/**
 * Operation type of reaction.
 */
export let ChatReactionOperate = /*#__PURE__*/function (ChatReactionOperate) {
  ChatReactionOperate[ChatReactionOperate["Remove"] = 0] = "Remove";
  ChatReactionOperate[ChatReactionOperate["Add"] = 1] = "Add";
  return ChatReactionOperate;
}({});

/**
 * Reaction Operation
 */
export class ChatReactionOperation {
  /**
   * Operator userId.
   */

  /**
   * Changed reaction.
   */

  /**
   * Operate type.
   */

  constructor(params) {
    this.userId = params.userId;
    this.reaction = params.reaction;
    this.operate = params.operate;
  }
  static fromNative(params) {
    let o = ChatReactionOperate.Add;
    if (params.operate === 0) {
      o = ChatReactionOperate.Remove;
    } else if (params.operate === 1) {
      o = ChatReactionOperate.Add;
    }
    const ret = new ChatReactionOperation({
      ...params,
      operate: o
    });
    return ret;
  }
}

/**
 * The message Reaction instance class that defines Reaction attributes.
 */
export class ChatMessageReaction {
  /**
   * The Reaction content.
   */

  /**
   * The count of the users who added this Reaction.
   */

  /**
   * Whether the current user added this Reaction.
   * - `true`: Yes.
   * - `false`: No.
   */

  /**
   * The list of users that added this Reaction.
   */

  constructor(params) {
    this.reaction = params.reaction;
    this.count = params.count;
    this.isAddedBySelf = params.isAddedBySelf;
    this.userList = params.userList;
  }
}
/**
 * The message Reaction event class.
 *
 */
export class ChatMessageReactionEvent {
  /**
   * The conversation ID.
   */

  /**
   * The message ID.
   */

  /**
   * The Reaction list.
   */

  /**
   * The list of Reaction operations.
   */

  constructor(params) {
    this.convId = params.convId;
    this.msgId = params.msgId;
    this.reactions = params.reactions;
    this.operations = params.operations;
  }
}
//# sourceMappingURL=ChatMessageReaction.js.map
/**
 * Operation type of reaction.
 */
export declare enum ChatReactionOperate {
    Remove = 0,
    Add = 1
}
/**
 * Reaction Operation
 */
export declare class ChatReactionOperation {
    /**
     * Operator userId.
     */
    userId: string;
    /**
     * Changed reaction.
     */
    reaction: string;
    /**
     * Operate type.
     */
    operate: ChatReactionOperate;
    constructor(params: {
        userId: string;
        reaction: string;
        operate: ChatReactionOperate;
    });
    static fromNative(params: {
        userId: string;
        reaction: string;
        operate: number;
    }): ChatReactionOperation;
}
/**
 * The message Reaction instance class that defines Reaction attributes.
 */
export declare class ChatMessageReaction {
    /**
     * The Reaction content.
     */
    reaction: string;
    /**
     * The count of the users who added this Reaction.
     */
    count: number;
    /**
     * Whether the current user added this Reaction.
     * - `true`: Yes.
     * - `false`: No.
     */
    isAddedBySelf: boolean;
    /**
     * The list of users that added this Reaction.
     */
    userList: Array<string>;
    constructor(params: {
        reaction: string;
        count: number;
        isAddedBySelf: boolean;
        userList: Array<string>;
    });
}
/**
 * The message Reaction event class.
 *
 */
export declare class ChatMessageReactionEvent {
    /**
     * The conversation ID.
     */
    convId: string;
    /**
     * The message ID.
     */
    msgId: string;
    /**
     * The Reaction list.
     */
    reactions: Array<ChatMessageReaction>;
    /**
     * The list of Reaction operations.
     */
    operations: Array<ChatReactionOperation>;
    constructor(params: {
        convId: string;
        msgId: string;
        reactions: Array<ChatMessageReaction>;
        operations: Array<ChatReactionOperation>;
    });
}
//# sourceMappingURL=ChatMessageReaction.d.ts.map
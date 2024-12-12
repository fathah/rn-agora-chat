import { ChatMessage } from './ChatMessage';
/**
 * The chat message thread class.
 */
export declare class ChatMessageThread {
    /**
     * The message thread ID.
     */
    threadId: string;
    /**
     * The name of the message thread.
     */
    threadName: string;
    /**
     * The creator of the message thread.
     */
    owner: string;
    /**
     * The ID of the parent message of the message thread.
     */
    msgId: string;
    /**
     * The group ID where the message thread belongs.
     */
    parentId: string;
    /**
     * The count of members in the message thread.
     */
    memberCount: number;
    /**
     * The count of messages in the message thread.
     */
    msgCount: number;
    /**
     * The Unix timestamp when the message thread is created. The unit is millisecond.
     */
    createAt: number;
    /**
     * The last reply in the message thread. If it is empty, the last message is withdrawn.
     */
    lastMessage?: ChatMessage;
    /**
     * Creates a message thread.
     */
    constructor(params: {
        threadId: string;
        threadName: string;
        owner: string;
        parentId: string;
        msgId: string;
        memberCount: number;
        msgCount: number;
        createAt: number;
        lastMessage?: any;
    });
}
/**
 * The message thread event types.
 */
export declare enum ChatMessageThreadOperation {
    /**
     * The unknown type of message thread event.
     */
    UnKnown = 0,
    /**
     * The message thread is created.
     */
    Create = 1,
    /**
     * The message thread is updated.
     */
    Update = 2,
    /**
     * The message thread is destroyed.
     */
    Delete = 3,
    /**
     * One or more messages are updated in the message thread.
     */
    Update_Msg = 4
}
/**
 * Converts the message thread event type from Int to enum.
 *
 * @param type The message thread event type of the Int type.
 * @returns The message thread event type of the enum type.
 */
export declare function ChatMessageThreadOperationFromNumber(type: number): ChatMessageThreadOperation;
/**
 * The message thread event class.
 */
export declare class ChatMessageThreadEvent {
    /**
     * The user ID of the message thread operator.
     */
    from: string;
    /**
     * The message thread event type.
     */
    type: ChatMessageThreadOperation;
    /**
     * The message thread object.
     */
    thread: ChatMessageThread;
    /**
     * Constructs a message thread event.
     */
    constructor(params: {
        from: string;
        type: number;
        thread: any;
    });
}
//# sourceMappingURL=ChatMessageThread.d.ts.map
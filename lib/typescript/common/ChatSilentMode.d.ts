import type { ChatConversationType } from './ChatConversation';
/**
 * The parameter types of the offline push.
 */
export declare enum ChatSilentModeParamType {
    /**
     * The push notification mode.
     */
    REMIND_TYPE = 0,
    /**
     * The duration of the do-not-disturb mode, in minutes.
     */
    SILENT_MODE_DURATION = 1,
    /**
     * The time frame of the do-not-disturb mode.
     * This parameter type is valid only at the app level, but not for conversations.
     */
    SILENT_MODE_INTERVAL = 2
}
/**
 * The push notification modes.
 */
export declare enum ChatPushRemindType {
    /**
     * Receives push notifications for all offline messages.
     */
    ALL = 0,
    /**
     * Only receives push notifications for mentioned messages.
     */
    MENTION_ONLY = 1,
    /**
     * Receives no push notification for offline messages.
     */
    NONE = 2
}
/**
 * The time class that is used to set the start point and end point in the do-not-disturb time frame for the offline message push.
 */
export declare class ChatSilentModeTime {
    /**
     * The start or end hour of the do-not-disturb time frame.
     *
     * The time is based on a 24-hour clock. The value range is [0,23].
     */
    hour: number;
    /**
     * The start or end minute of the do-not-disturb time frame.
     *
     * The value range is [0,59].
     */
    minute: number;
    constructor(params?: {
        hour?: number;
        minute?: number;
    });
}
/**
 * The parameter entity class for the offline message push.
 */
export declare class ChatSilentModeParam {
    /**
     * The parameter type of the do-not-disturb mode.
     */
    paramType: ChatSilentModeParamType;
    /**
     * The push notification mode.
     */
    remindType?: ChatPushRemindType;
    /**
     * The start time of do-not-disturb mode.
     * - Both the start time and end time need to be set.
     * - If both `hours` and `minutes` are set to `0` in the start time and end time, the Do Not Disturb mode is disabled.
     */
    startTime?: ChatSilentModeTime;
    /**
     * The end time of do-not-disturb mode.
     * - Both the start time and end time need to be set.
     * - If both `hours` and `minutes` are set to `0` in the start time and end time, the Do Not Disturb mode is disabled.
      
     */
    endTime?: ChatSilentModeTime;
    /**
     * The duration of the do-not-disturb mode, in minutes.
     */
    duration?: number;
    /**
     * Constructs an object.
     */
    constructor(params: {
        paramType: ChatSilentModeParamType;
        remindType?: ChatPushRemindType;
        startTime?: ChatSilentModeTime;
        endTime?: ChatSilentModeTime;
        duration?: number;
    });
    /**
     * Sets the push notification mode.
     *
     * @param remindType The push notification mode.
     * @returns The ChatSilentModeParam Object.
     */
    static constructorWithNotification(remindType: ChatPushRemindType): ChatSilentModeParam;
    /**
     * Set the duration of the do-not-disturb mode for the offline message push.
     *
     * @param silentDuration The duration of the do-not-disturb mode, in minutes.
     * @returns The ChatSilentModeParam object.
     */
    static constructorWithDuration(silentDuration: number): ChatSilentModeParam;
    /**
     * Sets the time frame of the do-not-disturb mode.
     *
     * The time frame of the do-not-disturb mode is valid only at the app level, but not for conversations.
     *
     * @params params
     * - startTime: The start point in the do-not-disturb time frame.
     * - endTime: The end point in the do-not-disturb time frame.
     * @returns The ChatSilentModeParam object.
     */
    static constructorWithPeriod(params: {
        startTime: ChatSilentModeTime;
        endTime: ChatSilentModeTime;
    }): ChatSilentModeParam;
}
/**
 * The configuration result class for the do-not-disturb mode of the offline message push.
 */
export declare class ChatSilentModeResult {
    /**
     * The Unix timestamp when the do-not-disturb mode of the offline message push expires, in milliseconds.
     */
    expireTimestamp?: number;
    /**
     * The conversation Type.
     */
    conversationType: ChatConversationType;
    /**
     * The conversation ID.
     */
    conversationId: string;
    /**
     * The push notification mode.
     */
    remindType?: ChatPushRemindType;
    /**
     * The start point in the do-not-disturb time frame for the offline message push.
     */
    startTime?: ChatSilentModeTime;
    /**
     * The end point in the do-not-disturb time frame for the offline message push.
     */
    endTime?: ChatSilentModeTime;
    /**
     * Constructs an object.
     */
    constructor(params: {
        expireTimestamp?: number;
        conversationType: ChatConversationType;
        conversationId: string;
        remindType?: ChatPushRemindType;
        startTime?: ChatSilentModeTime;
        endTime?: ChatSilentModeTime;
    });
}
/**
 * Converts the parameter type of the do-not-disturb mode from int to enum.
 *
 * @param params The do-not-disturb parameter type of the int type.
 * @returns The do-not-disturb parameter of the enum type.
 */
export declare function ChatSilentModeParamTypeFromNumber(params: number): ChatSilentModeParamType;
/**
 * Converts the parameter type of the do-not-disturb mode from enum to int.
 *
 * @param params The do-not-disturb parameter type of the enum type.
 * @returns The do-not-disturb parameter type of the int type.
 */
export declare function ChatSilentModeParamTypeToNumber(params: ChatSilentModeParamType): number;
/**
 * Converts the push notification mode from int to enum.
 *
 * @param params The push notification mode of the int type.
 * @returns The push notification mode of the enum type.
 */
export declare function ChatPushRemindTypeFromNumber(params: number): ChatPushRemindType;
/**
 * Converts the push notification mode from enum to int.
 *
 * @param params The push notification mode of the enum type.
 * @returns The push notification mode of the int type.
 */
export declare function ChatPushRemindTypeToNumber(params: ChatPushRemindType): number;
//# sourceMappingURL=ChatSilentMode.d.ts.map
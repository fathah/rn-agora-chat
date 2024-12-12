/**
 * The parameter types of the offline push.
 */
export let ChatSilentModeParamType = /*#__PURE__*/function (ChatSilentModeParamType) {
  ChatSilentModeParamType[ChatSilentModeParamType["REMIND_TYPE"] = 0] = "REMIND_TYPE";
  ChatSilentModeParamType[ChatSilentModeParamType["SILENT_MODE_DURATION"] = 1] = "SILENT_MODE_DURATION";
  ChatSilentModeParamType[ChatSilentModeParamType["SILENT_MODE_INTERVAL"] = 2] = "SILENT_MODE_INTERVAL";
  return ChatSilentModeParamType;
}({});
/**
 * The push notification modes.
 */
export let ChatPushRemindType = /*#__PURE__*/function (ChatPushRemindType) {
  ChatPushRemindType[ChatPushRemindType["ALL"] = 0] = "ALL";
  ChatPushRemindType[ChatPushRemindType["MENTION_ONLY"] = 1] = "MENTION_ONLY";
  ChatPushRemindType[ChatPushRemindType["NONE"] = 2] = "NONE";
  return ChatPushRemindType;
}({});

/**
 * The time class that is used to set the start point and end point in the do-not-disturb time frame for the offline message push.
 */
export class ChatSilentModeTime {
  /**
   * The start or end hour of the do-not-disturb time frame.
   *
   * The time is based on a 24-hour clock. The value range is [0,23].
   */

  /**
   * The start or end minute of the do-not-disturb time frame.
   *
   * The value range is [0,59].
   */

  constructor(params) {
    this.hour = (params === null || params === void 0 ? void 0 : params.hour) ?? 0;
    this.minute = (params === null || params === void 0 ? void 0 : params.minute) ?? 0;
  }
}

/**
 * The parameter entity class for the offline message push.
 */
export class ChatSilentModeParam {
  /**
   * The parameter type of the do-not-disturb mode.
   */

  /**
   * The push notification mode.
   */

  /**
   * The start time of do-not-disturb mode.
   * - Both the start time and end time need to be set.
   * - If both `hours` and `minutes` are set to `0` in the start time and end time, the Do Not Disturb mode is disabled.
   */

  /**
   * The end time of do-not-disturb mode.
   * - Both the start time and end time need to be set.
   * - If both `hours` and `minutes` are set to `0` in the start time and end time, the Do Not Disturb mode is disabled.
    
   */

  /**
   * The duration of the do-not-disturb mode, in minutes.
   */

  /**
   * Constructs an object.
   */
  constructor(params) {
    this.paramType = params.paramType;
    this.remindType = params.remindType;
    this.startTime = params.startTime;
    this.endTime = params.endTime;
    this.duration = params.duration;
  }

  /**
   * Sets the push notification mode.
   *
   * @param remindType The push notification mode.
   * @returns The ChatSilentModeParam Object.
   */
  static constructorWithNotification(remindType) {
    return new ChatSilentModeParam({
      paramType: ChatSilentModeParamType.REMIND_TYPE,
      remindType: remindType
    });
  }

  /**
   * Set the duration of the do-not-disturb mode for the offline message push.
   *
   * @param silentDuration The duration of the do-not-disturb mode, in minutes.
   * @returns The ChatSilentModeParam object.
   */
  static constructorWithDuration(silentDuration) {
    return new ChatSilentModeParam({
      paramType: ChatSilentModeParamType.SILENT_MODE_DURATION,
      duration: silentDuration
    });
  }

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
  static constructorWithPeriod(params) {
    return new ChatSilentModeParam({
      paramType: ChatSilentModeParamType.SILENT_MODE_INTERVAL,
      startTime: params.startTime,
      endTime: params.endTime
    });
  }
}

/**
 * The configuration result class for the do-not-disturb mode of the offline message push.
 */
export class ChatSilentModeResult {
  /**
   * The Unix timestamp when the do-not-disturb mode of the offline message push expires, in milliseconds.
   */

  /**
   * The conversation Type.
   */

  /**
   * The conversation ID.
   */

  /**
   * The push notification mode.
   */

  /**
   * The start point in the do-not-disturb time frame for the offline message push.
   */

  /**
   * The end point in the do-not-disturb time frame for the offline message push.
   */

  /**
   * Constructs an object.
   */
  constructor(params) {
    this.expireTimestamp = params.expireTimestamp;
    this.conversationId = params.conversationId;
    this.conversationType = params.conversationType;
    this.remindType = params.remindType;
    this.startTime = params.startTime;
    this.endTime = params.endTime;
  }
}

/**
 * Converts the parameter type of the do-not-disturb mode from int to enum.
 *
 * @param params The do-not-disturb parameter type of the int type.
 * @returns The do-not-disturb parameter of the enum type.
 */
export function ChatSilentModeParamTypeFromNumber(params) {
  switch (params) {
    case 0:
      return ChatSilentModeParamType.REMIND_TYPE;
    case 1:
      return ChatSilentModeParamType.SILENT_MODE_DURATION;
    case 2:
      return ChatSilentModeParamType.SILENT_MODE_INTERVAL;
    default:
      return ChatSilentModeParamType.REMIND_TYPE;
  }
}

/**
 * Converts the parameter type of the do-not-disturb mode from enum to int.
 *
 * @param params The do-not-disturb parameter type of the enum type.
 * @returns The do-not-disturb parameter type of the int type.
 */
export function ChatSilentModeParamTypeToNumber(params) {
  return params;
}

/**
 * Converts the push notification mode from int to enum.
 *
 * @param params The push notification mode of the int type.
 * @returns The push notification mode of the enum type.
 */
export function ChatPushRemindTypeFromNumber(params) {
  switch (params) {
    case 0:
      return ChatPushRemindType.ALL;
    case 1:
      return ChatPushRemindType.MENTION_ONLY;
    case 2:
      return ChatPushRemindType.NONE;
    default:
      return ChatPushRemindType.NONE;
  }
}

/**
 * Converts the push notification mode from enum to int.
 *
 * @param params The push notification mode of the enum type.
 * @returns The push notification mode of the int type.
 */
export function ChatPushRemindTypeToNumber(params) {
  return params;
}
//# sourceMappingURL=ChatSilentMode.js.map
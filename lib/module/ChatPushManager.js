import { MTfetchConversationSilentMode, MTfetchPreferredNotificationLanguage, MTfetchSilentModeForAll, MTfetchSilentModeForConversations, MTgetImPushConfigFromServer, MTgetPushTemplate, MTremoveConversationSilentMode, MTsetConversationSilentMode, MTsetPreferredNotificationLanguage, MTsetPushTemplate, MTsetSilentModeForAll, MTupdateImPushStyle, MTupdatePushNickname } from './__internal__/Consts';
import { Native } from './__internal__/Native';
import { chatlog } from './common/ChatConst';
import { ChatPushDisplayStyle, ChatPushOption } from './common/ChatPushConfig';
import { ChatSilentModeResult } from './common/ChatSilentMode';

/**
 * The class for message push configuration options.
 */
export class ChatPushManager extends Native {
  static TAG = 'ChatPushManager';
  constructor() {
    super();
  }
  setNativeListener(_event) {
    chatlog.log(`${ChatPushManager.TAG}: setNativeListener: `);
  }

  /**
   * Sets the offline push for the conversation.
   *
   * @params params
   * - convId: The conversation ID.
   * - convType: The conversation type.
   * - option: The configuration options for the offline push.
   *
   * @throws A description of the exception. See {@link ChatError}.
   */
  async setSilentModeForConversation(params) {
    chatlog.log(`${ChatPushManager.TAG}: setSilentModeForConversation: `, params.convId, params.convType, params.option);
    let r = await Native._callMethod(MTsetConversationSilentMode, {
      [MTsetConversationSilentMode]: {
        conversationId: params.convId,
        conversationType: params.convType,
        param: params.option
      }
    });
    ChatPushManager.checkErrorFromResult(r);
  }

  /**
   * Clears the offline push settings of the conversation.
   *
   * After clearing, the conversation uses the offline push settings of the app. See {@link EMPushManager.setSilentModeForAll}.
   *
   * @params params
   * - convId: The conversation ID.
   * - convType: The conversation type.
   *
   * @throws A description of the exception. See {@link ChatError}.
   */
  async removeSilentModeForConversation(params) {
    chatlog.log(`${ChatPushManager.TAG}: removeSilentModeForConversation: `, params.convId, params.convType);
    let r = await Native._callMethod(MTremoveConversationSilentMode, {
      [MTremoveConversationSilentMode]: {
        conversationId: params.convId,
        conversationType: params.convType
      }
    });
    ChatPushManager.checkErrorFromResult(r);
  }

  /**
   * Gets the offline push settings of the conversation.
   *
   * @params params
   * - convId: The conversation ID.
   * - convType: The conversation type.
   *
   * @returns The offline push settings of the conversation.
   *
   * @throws A description of the exception. See {@link ChatError}.
   */
  async fetchSilentModeForConversation(params) {
    chatlog.log(`${ChatPushManager.TAG}: fetchSilentModeForConversation: `, params.convId, params.convType);
    let r = await Native._callMethod(MTfetchConversationSilentMode, {
      [MTfetchConversationSilentMode]: {
        conversationId: params.convId,
        conversationType: params.convType
      }
    });
    ChatPushManager.checkErrorFromResult(r);
    const rr = r === null || r === void 0 ? void 0 : r[MTfetchConversationSilentMode];
    return new ChatSilentModeResult(rr);
  }

  /**
   * Sets the offline push of the app.
   *
   * @param option The offline push parameters.
   *
   * @throws A description of the exception. See {@link ChatError}.
   */
  async setSilentModeForAll(option) {
    chatlog.log(`${ChatPushManager.TAG}: setSilentModeForAll: `, JSON.stringify(option));
    let r = await Native._callMethod(MTsetSilentModeForAll, {
      [MTsetSilentModeForAll]: {
        param: option
      }
    });
    ChatPushManager.checkErrorFromResult(r);
  }

  /**
   * Gets the do-not-disturb settings of the app.
   *
   * @returns The do-not-disturb settings of the app.
   *
   * @throws A description of the exception. See {@link ChatError}.
   */
  async fetchSilentModeForAll() {
    chatlog.log(`${ChatPushManager.TAG}: fetchSilentModeForAll: `);
    let r = await Native._callMethod(MTfetchSilentModeForAll);
    ChatPushManager.checkErrorFromResult(r);
    const rr = r === null || r === void 0 ? void 0 : r[MTfetchSilentModeForAll];
    return new ChatSilentModeResult(rr);
  }

  /**
   * Gets the do-not-disturb settings of the specified conversations.
   *
   * @param conversations The conversation list.
   * @returns  The do-not-disturb settings of the specified conversations, which are key-value pairs where the key is the conversation ID and the value is the do-not-disturb settings.
   *
   * @throws A description of the exception. See {@link ChatError}.
   */
  async fetchSilentModeForConversations(conversations) {
    chatlog.log(`${ChatPushManager.TAG}: fetchSilentModeForConversations: `, JSON.stringify(conversations));
    let r = await Native._callMethod(MTfetchSilentModeForConversations, {
      [MTfetchSilentModeForConversations]: {
        convs: conversations
      }
    });
    ChatPushManager.checkErrorFromResult(r);
    const rr = r === null || r === void 0 ? void 0 : r[MTfetchSilentModeForConversations];
    const ret = new Map();
    if (rr) {
      Object.entries(rr).forEach(value => {
        ret.set(value[0], value[1]);
      });
    }
    return ret;
  }

  /**
   * Sets the target translation language of offline push notifications.
   *
   * @param languageCode The language code. See {@link ChatTextMessageBody}.
   *
   * @throws A description of the exception. See {@link ChatError}.
   */
  async setPreferredNotificationLanguage(languageCode) {
    chatlog.log(`${ChatPushManager.TAG}: setPreferredNotificationLanguage: `, languageCode);
    let r = await Native._callMethod(MTsetPreferredNotificationLanguage, {
      [MTsetPreferredNotificationLanguage]: {
        code: languageCode
      }
    });
    ChatPushManager.checkErrorFromResult(r);
  }

  /**
   * Gets the configured push translation language.
   *
   * @returns The language code.
   *
   * @throws A description of the exception. See {@link ChatError}.
   */
  async fetchPreferredNotificationLanguage() {
    chatlog.log(`${ChatPushManager.TAG}: fetchPreferredNotificationLanguage: `);
    let r = await Native._callMethod(MTfetchPreferredNotificationLanguage);
    ChatPushManager.checkErrorFromResult(r);
    const rr = r === null || r === void 0 ? void 0 : r[MTfetchPreferredNotificationLanguage];
    return rr;
  }

  /**
   * Updates nickname of the sender displayed in push notifications.
   *
   * This nickname can be different from the nickname in the user profile; however, we recommend that you use the same nickname for both. Therefore, if either nickname is updated, the other should be changed at the same time.
   *
   * To update the nickname in the user profile, you can call {@link ChatUserInfoManager.updateOwnUserInfo}.
   *
   * @param nickname  The nickname of the sender displayed in push notifications.
   *
   * @throws A description of the exception. See {@link ChatError}.
   */
  async updatePushNickname(nickname) {
    chatlog.log(`${ChatPushManager.TAG}: ${this.updatePushNickname.name}`);
    let r = await Native._callMethod(MTupdatePushNickname, {
      [MTupdatePushNickname]: {
        nickname: nickname
      }
    });
    ChatPushManager.checkErrorFromResult(r);
  }

  /**
   * Updates the display style of push notifications.
   *
   * The default value is {@link ChatPushDisplayStyle.Simple}.
   *
   * @param displayStyle The display style of push notifications.
   *
   * @throws A description of the exception. See {@link ChatError}.
   */
  async updatePushDisplayStyle() {
    let displayStyle = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : ChatPushDisplayStyle.Simple;
    chatlog.log(`${ChatPushManager.TAG}: ${this.updatePushDisplayStyle.name}`);
    let r = await Native._callMethod(MTupdateImPushStyle, {
      [MTupdateImPushStyle]: {
        pushStyle: displayStyle
      }
    });
    ChatPushManager.checkErrorFromResult(r);
  }

  /**
   * Gets the push configurations from the server.
   *
   * @returns The push options.
   *
   * @throws A description of the exception. See {@link ChatError}.
   */
  async fetchPushOptionFromServer() {
    chatlog.log(`${ChatPushManager.TAG}: ${this.fetchPushOptionFromServer.name}`);
    let r = await Native._callMethod(MTgetImPushConfigFromServer);
    ChatPushManager.checkErrorFromResult(r);
    return new ChatPushOption(r === null || r === void 0 ? void 0 : r[MTgetImPushConfigFromServer]);
  }

  /**
   * Selects the push template for offline push.
   *
   * The push template can be set with a RESTful API or on the console.
   *
   * @param templateName The push template name. If the template name does not exist, this template does not take effect, although no error is returned.
   *
   * @throws A description of the exception. See {@link ChatError}.
   */
  async selectPushTemplate(templateName) {
    chatlog.log(`${ChatPushManager.TAG}: ${this.selectPushTemplate.name}`);
    let r = await Native._callMethod(MTsetPushTemplate, {
      [MTsetPushTemplate]: {
        templateName
      }
    });
    ChatPushManager.checkErrorFromResult(r);
  }

  /**
   * Gets the selected push template for offline push.
   *
   * @returns The name of the selected push template.
   *
   * @throws A description of the exception. See {@link ChatError}.
   */
  async fetchSelectedPushTemplate() {
    chatlog.log(`${ChatPushManager.TAG}: ${this.fetchSelectedPushTemplate.name}`);
    let r = await Native._callMethod(MTgetPushTemplate);
    ChatPushManager.checkErrorFromResult(r);
    return r === null || r === void 0 ? void 0 : r[MTgetPushTemplate].templateName;
  }
}
//# sourceMappingURL=ChatPushManager.js.map
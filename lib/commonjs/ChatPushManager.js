"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ChatPushManager = void 0;
var _Consts = require("./__internal__/Consts");
var _Native = require("./__internal__/Native");
var _ChatConst = require("./common/ChatConst");
var _ChatPushConfig = require("./common/ChatPushConfig");
var _ChatSilentMode = require("./common/ChatSilentMode");
/**
 * The class for message push configuration options.
 */
class ChatPushManager extends _Native.Native {
  static TAG = 'ChatPushManager';
  constructor() {
    super();
  }
  setNativeListener(_event) {
    _ChatConst.chatlog.log(`${ChatPushManager.TAG}: setNativeListener: `);
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
    _ChatConst.chatlog.log(`${ChatPushManager.TAG}: setSilentModeForConversation: `, params.convId, params.convType, params.option);
    let r = await _Native.Native._callMethod(_Consts.MTsetConversationSilentMode, {
      [_Consts.MTsetConversationSilentMode]: {
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
    _ChatConst.chatlog.log(`${ChatPushManager.TAG}: removeSilentModeForConversation: `, params.convId, params.convType);
    let r = await _Native.Native._callMethod(_Consts.MTremoveConversationSilentMode, {
      [_Consts.MTremoveConversationSilentMode]: {
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
    _ChatConst.chatlog.log(`${ChatPushManager.TAG}: fetchSilentModeForConversation: `, params.convId, params.convType);
    let r = await _Native.Native._callMethod(_Consts.MTfetchConversationSilentMode, {
      [_Consts.MTfetchConversationSilentMode]: {
        conversationId: params.convId,
        conversationType: params.convType
      }
    });
    ChatPushManager.checkErrorFromResult(r);
    const rr = r === null || r === void 0 ? void 0 : r[_Consts.MTfetchConversationSilentMode];
    return new _ChatSilentMode.ChatSilentModeResult(rr);
  }

  /**
   * Sets the offline push of the app.
   *
   * @param option The offline push parameters.
   *
   * @throws A description of the exception. See {@link ChatError}.
   */
  async setSilentModeForAll(option) {
    _ChatConst.chatlog.log(`${ChatPushManager.TAG}: setSilentModeForAll: `, JSON.stringify(option));
    let r = await _Native.Native._callMethod(_Consts.MTsetSilentModeForAll, {
      [_Consts.MTsetSilentModeForAll]: {
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
    _ChatConst.chatlog.log(`${ChatPushManager.TAG}: fetchSilentModeForAll: `);
    let r = await _Native.Native._callMethod(_Consts.MTfetchSilentModeForAll);
    ChatPushManager.checkErrorFromResult(r);
    const rr = r === null || r === void 0 ? void 0 : r[_Consts.MTfetchSilentModeForAll];
    return new _ChatSilentMode.ChatSilentModeResult(rr);
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
    _ChatConst.chatlog.log(`${ChatPushManager.TAG}: fetchSilentModeForConversations: `, JSON.stringify(conversations));
    let r = await _Native.Native._callMethod(_Consts.MTfetchSilentModeForConversations, {
      [_Consts.MTfetchSilentModeForConversations]: {
        convs: conversations
      }
    });
    ChatPushManager.checkErrorFromResult(r);
    const rr = r === null || r === void 0 ? void 0 : r[_Consts.MTfetchSilentModeForConversations];
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
    _ChatConst.chatlog.log(`${ChatPushManager.TAG}: setPreferredNotificationLanguage: `, languageCode);
    let r = await _Native.Native._callMethod(_Consts.MTsetPreferredNotificationLanguage, {
      [_Consts.MTsetPreferredNotificationLanguage]: {
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
    _ChatConst.chatlog.log(`${ChatPushManager.TAG}: fetchPreferredNotificationLanguage: `);
    let r = await _Native.Native._callMethod(_Consts.MTfetchPreferredNotificationLanguage);
    ChatPushManager.checkErrorFromResult(r);
    const rr = r === null || r === void 0 ? void 0 : r[_Consts.MTfetchPreferredNotificationLanguage];
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
    _ChatConst.chatlog.log(`${ChatPushManager.TAG}: ${this.updatePushNickname.name}`);
    let r = await _Native.Native._callMethod(_Consts.MTupdatePushNickname, {
      [_Consts.MTupdatePushNickname]: {
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
    let displayStyle = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : _ChatPushConfig.ChatPushDisplayStyle.Simple;
    _ChatConst.chatlog.log(`${ChatPushManager.TAG}: ${this.updatePushDisplayStyle.name}`);
    let r = await _Native.Native._callMethod(_Consts.MTupdateImPushStyle, {
      [_Consts.MTupdateImPushStyle]: {
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
    _ChatConst.chatlog.log(`${ChatPushManager.TAG}: ${this.fetchPushOptionFromServer.name}`);
    let r = await _Native.Native._callMethod(_Consts.MTgetImPushConfigFromServer);
    ChatPushManager.checkErrorFromResult(r);
    return new _ChatPushConfig.ChatPushOption(r === null || r === void 0 ? void 0 : r[_Consts.MTgetImPushConfigFromServer]);
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
    _ChatConst.chatlog.log(`${ChatPushManager.TAG}: ${this.selectPushTemplate.name}`);
    let r = await _Native.Native._callMethod(_Consts.MTsetPushTemplate, {
      [_Consts.MTsetPushTemplate]: {
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
    _ChatConst.chatlog.log(`${ChatPushManager.TAG}: ${this.fetchSelectedPushTemplate.name}`);
    let r = await _Native.Native._callMethod(_Consts.MTgetPushTemplate);
    ChatPushManager.checkErrorFromResult(r);
    return r === null || r === void 0 ? void 0 : r[_Consts.MTgetPushTemplate].templateName;
  }
}
exports.ChatPushManager = ChatPushManager;
//# sourceMappingURL=ChatPushManager.js.map
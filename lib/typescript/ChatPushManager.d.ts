import type { NativeEventEmitter } from 'react-native';
import { Native } from './__internal__/Native';
import type { ChatConversation, ChatConversationType } from './common/ChatConversation';
import { ChatPushDisplayStyle, ChatPushOption } from './common/ChatPushConfig';
import { ChatSilentModeParam, ChatSilentModeResult } from './common/ChatSilentMode';
/**
 * The class for message push configuration options.
 */
export declare class ChatPushManager extends Native {
    private static TAG;
    constructor();
    setNativeListener(_event: NativeEventEmitter): void;
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
    setSilentModeForConversation(params: {
        convId: string;
        convType: ChatConversationType;
        option: ChatSilentModeParam;
    }): Promise<void>;
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
    removeSilentModeForConversation(params: {
        convId: string;
        convType: ChatConversationType;
    }): Promise<void>;
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
    fetchSilentModeForConversation(params: {
        convId: string;
        convType: ChatConversationType;
    }): Promise<ChatSilentModeResult>;
    /**
     * Sets the offline push of the app.
     *
     * @param option The offline push parameters.
     *
     * @throws A description of the exception. See {@link ChatError}.
     */
    setSilentModeForAll(option: ChatSilentModeParam): Promise<void>;
    /**
     * Gets the do-not-disturb settings of the app.
     *
     * @returns The do-not-disturb settings of the app.
     *
     * @throws A description of the exception. See {@link ChatError}.
     */
    fetchSilentModeForAll(): Promise<ChatSilentModeResult>;
    /**
     * Gets the do-not-disturb settings of the specified conversations.
     *
     * @param conversations The conversation list.
     * @returns  The do-not-disturb settings of the specified conversations, which are key-value pairs where the key is the conversation ID and the value is the do-not-disturb settings.
     *
     * @throws A description of the exception. See {@link ChatError}.
     */
    fetchSilentModeForConversations(conversations: ChatConversation[]): Promise<Map<string, ChatSilentModeResult>>;
    /**
     * Sets the target translation language of offline push notifications.
     *
     * @param languageCode The language code. See {@link ChatTextMessageBody}.
     *
     * @throws A description of the exception. See {@link ChatError}.
     */
    setPreferredNotificationLanguage(languageCode: string): Promise<void>;
    /**
     * Gets the configured push translation language.
     *
     * @returns The language code.
     *
     * @throws A description of the exception. See {@link ChatError}.
     */
    fetchPreferredNotificationLanguage(): Promise<string | undefined>;
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
    updatePushNickname(nickname: string): Promise<void>;
    /**
     * Updates the display style of push notifications.
     *
     * The default value is {@link ChatPushDisplayStyle.Simple}.
     *
     * @param displayStyle The display style of push notifications.
     *
     * @throws A description of the exception. See {@link ChatError}.
     */
    updatePushDisplayStyle(displayStyle?: ChatPushDisplayStyle): Promise<void>;
    /**
     * Gets the push configurations from the server.
     *
     * @returns The push options.
     *
     * @throws A description of the exception. See {@link ChatError}.
     */
    fetchPushOptionFromServer(): Promise<ChatPushOption>;
    /**
     * Selects the push template for offline push.
     *
     * The push template can be set with a RESTful API or on the console.
     *
     * @param templateName The push template name. If the template name does not exist, this template does not take effect, although no error is returned.
     *
     * @throws A description of the exception. See {@link ChatError}.
     */
    selectPushTemplate(templateName: string): Promise<void>;
    /**
     * Gets the selected push template for offline push.
     *
     * @returns The name of the selected push template.
     *
     * @throws A description of the exception. See {@link ChatError}.
     */
    fetchSelectedPushTemplate(): Promise<string | undefined>;
}
//# sourceMappingURL=ChatPushManager.d.ts.map
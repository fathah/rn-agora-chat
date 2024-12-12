import { NativeEventEmitter } from 'react-native';
import { BaseManager } from './__internal__/Base';
import { ChatContactManager } from './ChatContactManager';
import { ChatConnectEventListener, ChatCustomEventListener, ChatExceptionEventListener, ChatMultiDeviceEventListener } from './ChatEvents';
import { ChatGroupManager } from './ChatGroupManager';
import { ChatManager } from './ChatManager';
import { ChatPresenceManager } from './ChatPresenceManager';
import { ChatPushManager } from './ChatPushManager';
import { ChatRoomManager } from './ChatRoomManager';
import { ChatUserInfoManager } from './ChatUserInfoManager';
import { ChatDeviceInfo } from './common/ChatDeviceInfo';
import { ChatOptions } from './common/ChatOptions';
import { ChatPushConfig } from './common/ChatPushConfig';
/**
 * The chat client class, which is the entry of the chat SDK. It defines how to log in to and log out of the chat app and how to manage the connection between the SDK and the chat server.
 */
export declare class ChatClient extends BaseManager {
    static eventType: number;
    protected static TAG: string;
    private static _instance;
    private _connectionSubscriptions;
    static getInstance(): ChatClient;
    private setEventEmitter;
    getEventEmitter(): NativeEventEmitter;
    private _chatManager;
    private _groupManager;
    private _contactManager;
    private _chatRoomManager;
    private _pushManager;
    private _userInfoManager;
    private _presenceManager;
    private _connectionListeners;
    private _multiDeviceListeners;
    private _customListeners;
    private _options?;
    private readonly _sdkVersion;
    private readonly _rnSdkVersion;
    private _isInit;
    private _currentUsername;
    private constructor();
    setNativeListener(event: NativeEventEmitter): void;
    private onConnected;
    private onDisconnected;
    private onTokenWillExpire;
    private onTokenDidExpire;
    private onMultiDeviceEvent;
    private onCustomEvent;
    private onUserDidLoginFromOtherDevice;
    private onUserDidRemoveFromServer;
    private onUserDidForbidByServer;
    private onUserDidChangePassword;
    private onUserDidLoginTooManyDevice;
    private onUserKickedByOtherDevice;
    private onUserAuthenticationFailed;
    private onAppActiveNumberReachLimit;
    private reset;
    get version(): string;
    /**
     * Gets the SDK configurations.
     *
     * Ensure that you set the SDK options during initialization. See {@link ChatOptions}.
     *
     * @returns The SDK configurations.
     */
    get options(): ChatOptions | undefined;
    /**
     * Gets the current logged-in user ID.
     *
     * **Note**
     *
     * The user ID for successful login is valid.
     *
     * The user ID is obtained from the memory and updated in the case of login, logout, and reconnection upon disconnection. You can call {@link getCurrentUsername} to get the latest data from the server.
     *
     * @returns The current logged-in user ID.
     */
    get currentUserName(): string;
    /**
     * Initializes the SDK.
     *
     * **Note**
     *
     * - Make sure to initialize the SDK in the main thread.
     * - This method must be called before any other methods are called.
     *
     * @param options The options for SDK initialization. Ensure that you set the options. See {@link ChatOptions}.
     *
     * @throws A description of the exception. See {@link ChatError}.
     */
    init(options: ChatOptions): Promise<void>;
    /**
     * Checks whether the SDK is connected to the chat server.
     *
     * @returns Whether the SDK is connected to the chat server.
     *         - `true`: Yes.
     *         - `false`: No.
     *
     * @throws A description of the exception. See {@link ChatError}.
     */
    isConnected(): Promise<boolean>;
    /**
     * Gets the current logged-in user ID from the server.
     *
     * **Note**
     *
     * To get the current logged-in user ID from the memory, see {@link currentUserName}.
     *
     * @returns The logged-in user ID.
     *
     * @throws A description of the exception. See {@link ChatError}.
     */
    getCurrentUsername(): Promise<string>;
    /**
     * Checks whether the current user is logged in to the app.
     *
     * **Note**
     *
     * This method needs to be called after initialization and before login.
     *
     * @returns Whether the user is logged in to the app:
     *          - `true`: The user is logged in to the app. In automatic login mode, the SDK returns `true` before successful login and `false` otherwise.
     *          - `false`: The user is not logged in to the app. In non-automatic login mode, the SDK returns `false`.
     *
     * @throws A description of the exception. See {@link ChatError}.
     */
    isLoginBefore(): Promise<boolean>;
    /**
     * Gets the token for login.
     *
     * @returns The token for login.
     *
     * @throws A description of the exception. See {@link ChatError}.
     */
    getAccessToken(): Promise<string>;
    /**
     * Creates a new user (open registration).
     *
     * **Note**
     *
     * There are two registration modes:
     *
     * - Open registration: This mode is for testing use, but not recommended in a formal environment;
     *   If a call failure occurs, you can contact our business manager.
     *
     * - Authorized registration: You can create a new user through a REST API, and then save it to your server or return it to the client.
     *
     * @param userId The user ID.
     *                 Ensure that you set this parameter. The user ID can be a maximum of 64 characters of the following types:
     *                 - 26 English letters (a-z)
     *                 - 10 numbers (0-9),
     *                 - "_", "-", "."
     *                 The user ID is case-insensitive, so Aa and aa are the same user ID.
     *                 The email address or the UUID of the user cannot be used as the user ID.
     *                 You can also set this parameter with the regular expression ^[a-zA-Z0-9_-]+$.
     * @param password The password. Ensure that you set this parameter. The password can contain a maximum of 64 characters.
     *
     * @throws A description of the exception. See {@link ChatError}.
     */
    createAccount(userId: string, password: string): Promise<void>;
    /**
     * Logs in to the chat server with a password or an Easemob token. An exception message is thrown if the login fails.
     *
     * **Note**
     *
     * If you use an Easemob token to log in to the server, you can get the token in either of the following ways:
     * - Through an SDK API. See {@link createAccount} or {@link getAccessToken}.
     * - Through the console.
     *
     * The token expiration reminder is returned by the two callback methods: {@link ChatConnectEventListener.onTokenWillExpire} and {@link ChatConnectEventListener.onTokenDidExpire}.
     *
     * @param userId    The user ID. See {@link createAccount}.
     * @param pwdOrToken  The password or token. See {@link createAccount} or {@link getAccessToken}
     * @param isPassword  Whether to log in with a password or a token.
     *                    - `true`: A token is used.
     *                    - (Default) `false`: A password is used.
     *
     * @throws A description of the exception. See {@link ChatError}.
     *
     * @deprecated Please use with {@link loginWithToken} instead.
     */
    login(userId: string, pwdOrToken: string, isPassword?: boolean): Promise<void>;
    /**
     * Logs in to the chat server with a password or an Easemob token. An exception message is thrown if the login fails.
     *
     * **Note**
     *
     * If you use an Easemob token to log in to the server, you can get the token in either of the following ways:
     * - Through an SDK API. See {@link createAccount} or {@link getAccessToken}.
     * - Through the console.
     *
     * The token expiration reminder is returned by the two callback methods: {@link ChatConnectEventListener.onTokenWillExpire} and {@link ChatConnectEventListener.onTokenDidExpire}.
     *
     * @param userId    The user ID. See {@link createAccount}.
     * @param token  The password or token. See {@link createAccount} or {@link getAccessToken}
     *
     * @throws A description of the exception. See {@link ChatError}.
     */
    loginWithToken(userId: string, token: string): Promise<void>;
    /**
     * @deprecated 2023-11-17 Use {@link login} instead.
     *
     * Logs in to the chat server with the user ID and an Agora token. An exception message is thrown if the login fails.
     *
     * **Note**
     *
     * The Agora token is different from token {@link login.token} provided by Easemob.
     *
     * This method supports automatic login.
     *
     * @param userId The user ID. See {@link createAccount}.
     * @param agoraToken The Agora token.
     *
     * @throws A description of the exception. See {@link ChatError}.
     */
    loginWithAgoraToken(userId: string, agoraToken: string): Promise<void>;
    /**
     * Renews the Agora token.
     *
     * **Note**
     *
     * If you log in with an Agora token and are notified by the callback method {@link ChatConnectEventListener} that the token is to expire, you can call this method to update the token to avoid unknown issues caused by an invalid token.
     *
     * @param agoraToken The new Agora token.
     *
     * @throws A description of the exception. See {@link ChatError}.
     */
    renewAgoraToken(agoraToken: string): Promise<void>;
    /**
     * Logs out of the chat app. An exception message is thrown if the logout fails.
     *
     * @param unbindDeviceToken Whether to unbind the token upon logout. This parameter is available only to mobile platforms.
     * - (Default) `true`: Yes.
     * - `false`: No.
     *
     * @throws A description of the exception. See {@link ChatError}.
     */
    logout(unbindDeviceToken?: boolean): Promise<void>;
    /**
     * Updates the App Key, which is the unique identifier used to access the chat service.
     *
     * **Note**
     *
     * - As this key controls access to the chat service for your app, you can only update the key when the current user is logged out.
     *
     * - Updating the App Key means to switch to a new App Key.
     *
     * - You can retrieve the new App Key from the Console.
     *
     * - You can also set an App Key by using the {@link ChatOptions.appKey} method when logged out.
     *
     * @param newAppKey The new App Key. Ensure that you set this parameter.
     *
     * @throws A description of the exception. See {@link ChatError}.
     */
    changeAppKey(newAppKey: string): Promise<void>;
    /**
     * Compresses the debug log file into a gzip archive.
     *
     * We strongly recommend that you delete this debug archive once it is no longer used.
     *
     * @returns The path of the compressed gzip file.
     *
     * @throws A description of the exception. See {@link ChatError}.
     */
    compressLogs(): Promise<string | undefined>;
    /**
     * Gets the list of online devices to which you have logged in with a specified account.
     *
     * @param userId The user ID.
     * @param pwdOrToken The password or token.
     * @param isPassword If true, use password, otherwise use token. Default is true. See {@link pwdOrToken}
     * @returns The list of the online logged-in devices.
     *
     * @throws A description of the exception. See {@link ChatError}.
     */
    getLoggedInDevicesFromServer(userId: string, pwdOrToken: string, isPassword?: boolean): Promise<Array<ChatDeviceInfo>>;
    /**
     * Logs out from a specified account on a device.
     *
     * For how to get the device ID, see {@link ChatDeviceInfo.resource}.
     *
     * @param userId The user ID.
     * @param pwdOrToken The password or token.
     * @param resource The device ID. See {@link ChatDeviceInfo.resource}.
     * @param isPassword Whether the password or user token is used. See {@link pwdOrToken}.
     * - （Default）`true`：The password is used.
     * - `false`: The user token is used.
     *
     * @throws A description of the exception. See {@link ChatError}.
     */
    kickDevice(userId: string, pwdOrToken: string, resource: string, isPassword?: boolean): Promise<void>;
    /**
     * Logs out from a specified account on all devices.
     *
     * @param userId The user ID.
     * @param pwdOrToken The password or token.
     * @param isPassword Whether the password or user token is used. See {@link pwdOrToken}.
     * - （Default）`true`：The password is used.
     * - `false`: The user token is used.
     *
     * @throws A description of the exception. See {@link ChatError}.
     */
    kickAllDevices(userId: string, pwdOrToken: string, isPassword?: boolean): Promise<void>;
    /**
     * Update push configurations.
     *
     * **Note**
     * For the iOS platform, you need to pass the device ID during initialization. Otherwise, the push function cannot be used properly. See {@link ChatClient.init}
     *
     * @param config The push config, See {@link ChatPushConfig}
     *
     * @throws A description of the exception. See {@link ChatError}.
     */
    updatePushConfig(config: ChatPushConfig): Promise<void>;
    /**
     * Adds the connection status listener.
     *
     * @param listener The connection status listener to add.
     */
    addConnectionListener(listener: ChatConnectEventListener): void;
    /**
     * Removes the connection status listener.
     *
     * @param listener The connection status listener to remove.
     */
    removeConnectionListener(listener: ChatConnectEventListener): void;
    /**
     * Removes all the connection status listeners for the chat server.
     */
    removeAllConnectionListener(): void;
    /**
     * Adds the multi-device listener.
     *
     * @param listener The multi-device listener to add.
     */
    addMultiDeviceListener(listener: ChatMultiDeviceEventListener): void;
    /**
     * Removes the specified multi-device listener.
     *
     * @param listener The multi-device listener to remove.
     */
    removeMultiDeviceListener(listener: ChatMultiDeviceEventListener): void;
    /**
     * Removes all the multi-device listeners.
     */
    removeAllMultiDeviceListener(): void;
    /**
     * Adds a custom listener to receive data that the iOS or Android devices send to the React Native layer.
     *
     * @param listener The custom listener to add.
     */
    addCustomListener(listener: ChatCustomEventListener): void;
    /**
     * Removes a custom listener to stop receiving data that the iOS or Android devices send to the React Native layer.
     *
     * @param listener The custom listener to remove.
     */
    removeCustomListener(listener: ChatCustomEventListener): void;
    /**
     *  Removes all the custom listeners.
     */
    removeAllCustomListener(): void;
    /**
     * Add error listener.
     *
     * Monitor SDK internal errors.
     */
    addExceptListener(listener: ChatExceptionEventListener): void;
    /**
     * Remove error listener.
     */
    removeExceptListener(listener: ChatExceptionEventListener): void;
    /**
     * Remove all error listener.
     */
    removeAllExceptListener(): void;
    /**
     * Gets the chat manager class.
     *
     * This method can be called only after the chat client is initialized.
     *
     * @returns The chat manager class.
     */
    get chatManager(): ChatManager;
    /**
     * Gets the chat group manager class.
     *
     * This method can be called only after the chat client is initialized.
     *
     * @returns The chat group manager class.
     */
    get groupManager(): ChatGroupManager;
    /**
     * Gets the contact manager class.
     *
     * This method can be called only after the chat client is initialized.
     *
     * @returns The contact manager class.
     */
    get contactManager(): ChatContactManager;
    /**
     * Gets the push manager class.
     *
     * This method can be called only after the chat client is initialized.
     *
     * @returns The push manager class.
     */
    get pushManager(): ChatPushManager;
    /**
     * Gets the user information manager class.
     *
     * This method can be called only after the chat client is initialized.
     *
     * @returns The user information manager class.
     */
    get userManager(): ChatUserInfoManager;
    /**
     * Gets the chat room manager class.
     *
     * This method can be called only after the chat client is initialized.
     *
     * @returns The chat room manager class.
     */
    get roomManager(): ChatRoomManager;
    /**
     * Gets the presence manager class.
     *
     * This method can be called only after the chat client is initialized.
     *
     * @returns The presence manager class.
     */
    get presenceManager(): ChatPresenceManager;
}
//# sourceMappingURL=ChatClient.d.ts.map
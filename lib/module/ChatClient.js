import { NativeEventEmitter, NativeModules, Platform } from 'react-native';
import { BaseManager } from './__internal__/Base';
import { MTchangeAppKey, MTcompressLogs, MTcreateAccount, MTgetCurrentUser, MTgetLoggedInDevicesFromServer, MTgetToken, MTinit, MTisConnected, MTisLoggedInBefore, MTkickAllDevices, MTkickDevice, MTlogin, MTloginWithAgoraToken, MTlogout, MTonAppActiveNumberReachLimit, MTonConnected, MTonCustomEvent, MTonDisconnected, MTonMultiDeviceEvent, MTonMultiDeviceEventContact, MTonMultiDeviceEventConversation, MTonMultiDeviceEventGroup, MTonMultiDeviceEventRemoveMessage, MTonMultiDeviceEventThread, MTonTokenDidExpire, MTonTokenWillExpire, MTonUserAuthenticationFailed, MTonUserDidChangePassword, MTonUserDidForbidByServer, MTonUserDidLoginFromOtherDevice, MTonUserDidLoginTooManyDevice, MTonUserDidRemoveFromServer, MTonUserKickedByOtherDevice, MTrenewToken, MTupdatePushConfig } from './__internal__/Consts';
import { ExceptionHandler } from './__internal__/ErrorHandler';
import { Native } from './__internal__/Native';
import { ChatContactManager } from './ChatContactManager';
import { ChatMultiDeviceEventFromNumber } from './ChatEvents';
import { ChatGroupManager } from './ChatGroupManager';
import { ChatManager } from './ChatManager';
import { ChatPresenceManager } from './ChatPresenceManager';
import { ChatPushManager } from './ChatPushManager';
import { ChatRoomManager } from './ChatRoomManager';
import { ChatUserInfoManager } from './ChatUserInfoManager';
import { chatlog } from './common/ChatConst';
import { ChatDeviceInfo } from './common/ChatDeviceInfo';
import { ChatError } from './common/ChatError';
import { ChatOptions } from './common/ChatOptions';
import { ChatPushConfig } from './common/ChatPushConfig';
const LINKING_ERROR = `The package 'react-native-chat-sdk' doesn't seem to be linked. Make sure: \n\n` + Platform.select({
  ios: "- You have run 'pod install'\n",
  default: ''
}) + '- You rebuilt the app after installing the package\n' + '- You are not using Expo managed workflow\n';
const ExtSdkApiRN = NativeModules.ExtSdkApiRN ? NativeModules.ExtSdkApiRN : new Proxy({}, {
  get() {
    throw new ChatError({
      code: 1,
      description: LINKING_ERROR
    });
  }
});
const eventEmitter = new NativeEventEmitter(ExtSdkApiRN);
chatlog.log('eventEmitter: ', eventEmitter);

/**
 * The chat client class, which is the entry of the chat SDK. It defines how to log in to and log out of the chat app and how to manage the connection between the SDK and the chat server.
 */
export class ChatClient extends BaseManager {
  static eventType = 2; // 1.remove 2.subscription(suggested)
  static TAG = 'ChatClient';
  static getInstance() {
    if (ChatClient._instance === null || ChatClient._instance === undefined) {
      ChatClient._instance = new ChatClient();
    }
    return ChatClient._instance;
  }
  setEventEmitter() {
    chatlog.log(`${ChatClient.TAG}: setEventEmitter: `);
    this.setNativeListener(this.getEventEmitter());
    this._chatManager.setNativeListener(this.getEventEmitter());
    this._groupManager.setNativeListener(this.getEventEmitter());
    this._contactManager.setNativeListener(this.getEventEmitter());
    this._chatManager.setNativeListener(this.getEventEmitter());
    this._pushManager.setNativeListener(this.getEventEmitter());
    this._chatRoomManager.setNativeListener(this.getEventEmitter());
    this._presenceManager.setNativeListener(this.getEventEmitter());
    chatlog.log('eventEmitter has finished.');
  }
  getEventEmitter() {
    return eventEmitter;
  }
  _sdkVersion = '4.0.0';
  _rnSdkVersion = '1.1.0';
  _isInit = false;
  _currentUsername = '';
  constructor() {
    super();
    this._chatManager = new ChatManager();
    this._groupManager = new ChatGroupManager();
    this._contactManager = new ChatContactManager();
    this._chatRoomManager = new ChatRoomManager();
    this._pushManager = new ChatPushManager();
    this._userInfoManager = new ChatUserInfoManager();
    this._presenceManager = new ChatPresenceManager();
    this._connectionListeners = new Set();
    this._connectionSubscriptions = new Map();
    this._multiDeviceListeners = new Set();
    this._customListeners = new Set();
    this.setEventEmitter();
    try {
      this._rnSdkVersion = require('./version').default;
    } catch (error) {
      console.error(error);
    }
  }
  setNativeListener(event) {
    chatlog.log(`${ChatClient.TAG}: setNativeListener: `);
    this._connectionSubscriptions.forEach((value, key, map) => {
      chatlog.log(`${ChatClient.TAG}: setNativeListener:`, key, value, map);
      value.remove();
    });
    this._connectionSubscriptions.clear();
    this._connectionSubscriptions.set(MTonConnected, event.addListener(MTonConnected, this.onConnected.bind(this)));
    this._connectionSubscriptions.set(MTonDisconnected, event.addListener(MTonDisconnected, this.onDisconnected.bind(this)));
    this._connectionSubscriptions.set(MTonTokenDidExpire, event.addListener(MTonTokenDidExpire, this.onTokenDidExpire.bind(this)));
    this._connectionSubscriptions.set(MTonTokenWillExpire, event.addListener(MTonTokenWillExpire, this.onTokenWillExpire.bind(this)));
    this._connectionSubscriptions.set(MTonMultiDeviceEvent, event.addListener(MTonMultiDeviceEvent, this.onMultiDeviceEvent.bind(this)));
    this._connectionSubscriptions.set(MTonCustomEvent, event.addListener(MTonCustomEvent, this.onCustomEvent.bind(this)));
    this._connectionSubscriptions.set(MTonUserDidLoginFromOtherDevice, event.addListener(MTonUserDidLoginFromOtherDevice, this.onUserDidLoginFromOtherDevice.bind(this)));
    this._connectionSubscriptions.set(MTonUserDidRemoveFromServer, event.addListener(MTonUserDidRemoveFromServer, this.onUserDidRemoveFromServer.bind(this)));
    this._connectionSubscriptions.set(MTonUserDidForbidByServer, event.addListener(MTonUserDidForbidByServer, this.onUserDidForbidByServer.bind(this)));
    this._connectionSubscriptions.set(MTonUserDidChangePassword, event.addListener(MTonUserDidChangePassword, this.onUserDidChangePassword.bind(this)));
    this._connectionSubscriptions.set(MTonUserDidLoginTooManyDevice, event.addListener(MTonUserDidLoginTooManyDevice, this.onUserDidLoginTooManyDevice.bind(this)));
    this._connectionSubscriptions.set(MTonUserKickedByOtherDevice, event.addListener(MTonUserKickedByOtherDevice, this.onUserKickedByOtherDevice.bind(this)));
    this._connectionSubscriptions.set(MTonUserAuthenticationFailed, event.addListener(MTonUserAuthenticationFailed, this.onUserAuthenticationFailed.bind(this)));
    this._connectionSubscriptions.set(MTonAppActiveNumberReachLimit, event.addListener(MTonAppActiveNumberReachLimit, this.onAppActiveNumberReachLimit.bind(this)));
  }
  onConnected() {
    chatlog.log(`${ChatClient.TAG}: onConnected: `);
    if (this._currentUsername === '' || this._currentUsername === null || this._currentUsername === undefined) {
      this.getCurrentUsername();
    }
    this._connectionListeners.forEach(element => {
      var _element$onConnected;
      (_element$onConnected = element.onConnected) === null || _element$onConnected === void 0 ? void 0 : _element$onConnected.call(element);
    });
  }
  onDisconnected(params) {
    chatlog.log(`${ChatClient.TAG}: onDisconnected: `, params);
    this._connectionListeners.forEach(element => {
      var _element$onDisconnect;
      // let ec = params?.errorCode as number;
      (_element$onDisconnect = element.onDisconnected) === null || _element$onDisconnect === void 0 ? void 0 : _element$onDisconnect.call(element);
    });
  }
  onTokenWillExpire(params) {
    chatlog.log(`${ChatClient.TAG}: onTokenWillExpire: `, params);
    this._connectionListeners.forEach(element => {
      var _element$onTokenWillE;
      (_element$onTokenWillE = element.onTokenWillExpire) === null || _element$onTokenWillE === void 0 ? void 0 : _element$onTokenWillE.call(element);
    });
  }
  onTokenDidExpire(params) {
    chatlog.log(`${ChatClient.TAG}: onTokenDidExpire: `, params);
    this._connectionListeners.forEach(element => {
      var _element$onTokenDidEx;
      (_element$onTokenDidEx = element.onTokenDidExpire) === null || _element$onTokenDidEx === void 0 ? void 0 : _element$onTokenDidEx.call(element);
    });
  }
  onMultiDeviceEvent(params) {
    chatlog.log(`${ChatClient.TAG}: onMultiDeviceEvent: `, params);
    this._multiDeviceListeners.forEach(element => {
      var _element$onContactEve, _element$onGroupEvent, _element$onThreadEven, _element$onMessageRem, _element$onConversati;
      const type = params.type;
      switch (type) {
        case MTonMultiDeviceEventContact:
          (_element$onContactEve = element.onContactEvent) === null || _element$onContactEve === void 0 ? void 0 : _element$onContactEve.call(element, ChatMultiDeviceEventFromNumber(params.event), params.target, params.ext);
          break;
        case MTonMultiDeviceEventGroup:
          (_element$onGroupEvent = element.onGroupEvent) === null || _element$onGroupEvent === void 0 ? void 0 : _element$onGroupEvent.call(element, ChatMultiDeviceEventFromNumber(params.event), params.target, params.ext);
          break;
        case MTonMultiDeviceEventThread:
          (_element$onThreadEven = element.onThreadEvent) === null || _element$onThreadEven === void 0 ? void 0 : _element$onThreadEven.call(element, ChatMultiDeviceEventFromNumber(params.event), params.target, params.ext);
          break;
        case MTonMultiDeviceEventRemoveMessage:
          (_element$onMessageRem = element.onMessageRemoved) === null || _element$onMessageRem === void 0 ? void 0 : _element$onMessageRem.call(element, params.convId, params.deviceId);
          break;
        case MTonMultiDeviceEventConversation:
          (_element$onConversati = element.onConversationEvent) === null || _element$onConversati === void 0 ? void 0 : _element$onConversati.call(element, ChatMultiDeviceEventFromNumber(params.event), params.convId, params.convType);
          break;
        default:
          break;
      }
    });
  }
  onCustomEvent(params) {
    chatlog.log(`${ChatClient.TAG}: onCustomEvent: `, params);
    this._customListeners.forEach(element => {
      element.onDataReceived(params);
    });
  }
  onUserDidLoginFromOtherDevice(params) {
    chatlog.log(`${ChatClient.TAG}: onUserDidLoginFromOtherDevice: `);
    this._connectionListeners.forEach(element => {
      var _element$onUserDidLog;
      const deviceName = params.deviceName;
      (_element$onUserDidLog = element.onUserDidLoginFromOtherDevice) === null || _element$onUserDidLog === void 0 ? void 0 : _element$onUserDidLog.call(element, deviceName);
    });
  }
  onUserDidRemoveFromServer() {
    chatlog.log(`${ChatClient.TAG}: onUserDidRemoveFromServer: `);
    this._connectionListeners.forEach(element => {
      var _element$onUserDidRem;
      (_element$onUserDidRem = element.onUserDidRemoveFromServer) === null || _element$onUserDidRem === void 0 ? void 0 : _element$onUserDidRem.call(element);
    });
  }
  onUserDidForbidByServer() {
    chatlog.log(`${ChatClient.TAG}: onUserDidForbidByServer: `);
    this._connectionListeners.forEach(element => {
      var _element$onUserDidFor;
      (_element$onUserDidFor = element.onUserDidForbidByServer) === null || _element$onUserDidFor === void 0 ? void 0 : _element$onUserDidFor.call(element);
    });
  }
  onUserDidChangePassword() {
    chatlog.log(`${ChatClient.TAG}: onUserDidChangePassword: `);
    this._connectionListeners.forEach(element => {
      var _element$onUserDidCha;
      (_element$onUserDidCha = element.onUserDidChangePassword) === null || _element$onUserDidCha === void 0 ? void 0 : _element$onUserDidCha.call(element);
    });
  }
  onUserDidLoginTooManyDevice() {
    chatlog.log(`${ChatClient.TAG}: onUserDidLoginTooManyDevice: `);
    this._connectionListeners.forEach(element => {
      var _element$onUserDidLog2;
      (_element$onUserDidLog2 = element.onUserDidLoginTooManyDevice) === null || _element$onUserDidLog2 === void 0 ? void 0 : _element$onUserDidLog2.call(element);
    });
  }
  onUserKickedByOtherDevice() {
    chatlog.log(`${ChatClient.TAG}: onUserKickedByOtherDevice: `);
    this._connectionListeners.forEach(element => {
      var _element$onUserKicked;
      (_element$onUserKicked = element.onUserKickedByOtherDevice) === null || _element$onUserKicked === void 0 ? void 0 : _element$onUserKicked.call(element);
    });
  }
  onUserAuthenticationFailed() {
    chatlog.log(`${ChatClient.TAG}: onUserAuthenticationFailed: `);
    this._connectionListeners.forEach(element => {
      var _element$onUserAuthen;
      (_element$onUserAuthen = element.onUserAuthenticationFailed) === null || _element$onUserAuthen === void 0 ? void 0 : _element$onUserAuthen.call(element);
    });
  }
  onAppActiveNumberReachLimit() {
    chatlog.log(`${ChatClient.TAG}: onAppActiveNumberReachLimit: `);
    this._connectionListeners.forEach(element => {
      var _element$onAppActiveN;
      (_element$onAppActiveN = element.onAppActiveNumberReachLimit) === null || _element$onAppActiveN === void 0 ? void 0 : _element$onAppActiveN.call(element);
    });
  }
  reset() {
    chatlog.log(`${ChatClient.TAG}: reset: `);
    this._currentUsername = '';
  }
  get version() {
    chatlog.log(`${ChatClient.TAG}: version: `, this._rnSdkVersion);
    return this._rnSdkVersion;
  }

  /**
   * Gets the SDK configurations.
   *
   * Ensure that you set the SDK options during initialization. See {@link ChatOptions}.
   *
   * @returns The SDK configurations.
   */
  get options() {
    chatlog.log(`${ChatClient.TAG}: options: `);
    return this._options;
  }

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
  get currentUserName() {
    chatlog.log(`${ChatClient.TAG}: currentUserName: `, this._currentUsername);
    return this._currentUsername;
  }

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
  async init(options) {
    chatlog.log(`${ChatClient.TAG}: init: `, options);
    if (options.appKey === undefined || options.appKey.length === 0) {
      throw new Error('appKey is empty.');
    }
    this._options = new ChatOptions(options); // deep copy
    chatlog.enableLog = options.debugModel ?? false;
    chatlog.enableTimestamp = options.logTimestamp ?? true;
    chatlog.tag = options.logTag ?? '[chat]';
    const r = await Native._callMethod(MTinit, {
      options
    });
    ChatClient.checkErrorFromResult(r);
    this._isInit = true;
  }

  /**
   * Checks whether the SDK is connected to the chat server.
   *
   * @returns Whether the SDK is connected to the chat server.
   *         - `true`: Yes.
   *         - `false`: No.
   *
   * @throws A description of the exception. See {@link ChatError}.
   */
  async isConnected() {
    chatlog.log(`${ChatClient.TAG}: isConnected: `);
    const r = await Native._callMethod(MTisConnected);
    ChatClient.checkErrorFromResult(r);
    let _connected = r === null || r === void 0 ? void 0 : r[MTisConnected];
    return _connected;
  }

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
  async getCurrentUsername() {
    let r = await Native._callMethod(MTgetCurrentUser);
    ChatClient.checkErrorFromResult(r);
    let userName = r === null || r === void 0 ? void 0 : r[MTgetCurrentUser];
    if (userName && userName.length !== 0) {
      if (userName !== this._currentUsername) {
        this._currentUsername = userName;
      }
    }
    chatlog.log(`${ChatClient.TAG}: getCurrentUsername: `, this._currentUsername);
    return this._currentUsername;
  }

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
  async isLoginBefore() {
    chatlog.log(`${ChatClient.TAG}: isLoginBefore: `);
    let r = await Native._callMethod(MTisLoggedInBefore);
    ChatClient.checkErrorFromResult(r);
    let _isLoginBefore = r === null || r === void 0 ? void 0 : r[MTisLoggedInBefore];
    return _isLoginBefore;
  }

  /**
   * Gets the token for login.
   *
   * @returns The token for login.
   *
   * @throws A description of the exception. See {@link ChatError}.
   */
  async getAccessToken() {
    chatlog.log(`${ChatClient.TAG}: getAccessToken: `);
    let r = await Native._callMethod(MTgetToken);
    ChatClient.checkErrorFromResult(r);
    let _token = r === null || r === void 0 ? void 0 : r[MTgetToken];
    return _token;
  }

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
  async createAccount(userId, password) {
    chatlog.log(`${ChatClient.TAG}: createAccount: `, userId, '******');
    let r = await Native._callMethod(MTcreateAccount, {
      [MTcreateAccount]: {
        username: userId,
        password: password
      }
    });
    ChatClient.checkErrorFromResult(r);
  }

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
  async login(userId, pwdOrToken) {
    let isPassword = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
    chatlog.log(`${ChatClient.TAG}: login: `, userId, '******', isPassword);
    let r = await Native._callMethod(MTlogin, {
      [MTlogin]: {
        username: userId,
        pwdOrToken: pwdOrToken,
        isPassword: isPassword
      }
    });
    ChatClient.checkErrorFromResult(r);
    const rr = r === null || r === void 0 ? void 0 : r[MTlogin];
    if (rr && rr.username) {
      this._currentUsername = rr.username;
      chatlog.log(`${ChatClient.TAG}: login: ${rr === null || rr === void 0 ? void 0 : rr.username}, ${rr === null || rr === void 0 ? void 0 : rr.token}`);
    }
  }

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
  async loginWithToken(userId, token) {
    chatlog.log(`${ChatClient.TAG}: loginWithToken: `, userId, '******', false);
    let r = await Native._callMethod(MTlogin, {
      [MTlogin]: {
        username: userId,
        pwdOrToken: token,
        isPassword: false
      }
    });
    ChatClient.checkErrorFromResult(r);
    const rr = r === null || r === void 0 ? void 0 : r[MTlogin];
    if (rr && rr.username) {
      this._currentUsername = rr.username;
      chatlog.log(`${ChatClient.TAG}: login: ${rr === null || rr === void 0 ? void 0 : rr.username}, ${rr === null || rr === void 0 ? void 0 : rr.token}`);
    }
  }

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
  async loginWithAgoraToken(userId, agoraToken) {
    chatlog.log(`${ChatClient.TAG}: loginWithAgoraToken: `, userId, '******');
    let r = await Native._callMethod(MTloginWithAgoraToken, {
      [MTloginWithAgoraToken]: {
        username: userId,
        agoratoken: agoraToken
      }
    });
    ChatClient.checkErrorFromResult(r);
    const rr = r === null || r === void 0 ? void 0 : r[MTloginWithAgoraToken];
    if (rr && rr.username) {
      this._currentUsername = rr.username;
      chatlog.log(`${ChatClient.TAG}: loginA: ${rr === null || rr === void 0 ? void 0 : rr.username}, ${rr === null || rr === void 0 ? void 0 : rr.token}`);
    }
  }

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
  async renewAgoraToken(agoraToken) {
    chatlog.log(`${ChatClient.TAG}: renewAgoraToken: `, '******');
    let r = await Native._callMethod(MTrenewToken, {
      [MTrenewToken]: {
        agora_token: agoraToken
      }
    });
    ChatClient.checkErrorFromResult(r);
  }

  /**
   * Logs out of the chat app. An exception message is thrown if the logout fails.
   *
   * @param unbindDeviceToken Whether to unbind the token upon logout. This parameter is available only to mobile platforms.
   * - (Default) `true`: Yes.
   * - `false`: No.
   *
   * @throws A description of the exception. See {@link ChatError}.
   */
  async logout() {
    let unbindDeviceToken = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
    chatlog.log(`${ChatClient.TAG}: logout: `, unbindDeviceToken);
    let r = await Native._callMethod(MTlogout, {
      [MTlogout]: {
        unbindToken: unbindDeviceToken
      }
    });
    ChatClient.checkErrorFromResult(r);
    this.reset();
  }

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
  async changeAppKey(newAppKey) {
    chatlog.log(`${ChatClient.TAG}: changeAppKey: `, newAppKey);
    if (newAppKey === undefined || newAppKey.length === 0) {
      throw new Error('appKey is empty.');
    }
    let r = await Native._callMethod(MTchangeAppKey, {
      [MTchangeAppKey]: {
        appKey: newAppKey
      }
    });
    ChatClient.checkErrorFromResult(r);
  }

  /**
   * Compresses the debug log file into a gzip archive.
   *
   * We strongly recommend that you delete this debug archive once it is no longer used.
   *
   * @returns The path of the compressed gzip file.
   *
   * @throws A description of the exception. See {@link ChatError}.
   */
  async compressLogs() {
    chatlog.log(`${ChatClient.TAG}: compressLogs:`);
    let r = await Native._callMethod(MTcompressLogs);
    ChatClient.checkErrorFromResult(r);
    return r === null || r === void 0 ? void 0 : r[MTcompressLogs];
  }

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
  async getLoggedInDevicesFromServer(userId, pwdOrToken, isPassword) {
    chatlog.log(`${ChatClient.TAG}: getLoggedInDevicesFromServer: `, userId, '******');
    let r = await Native._callMethod(MTgetLoggedInDevicesFromServer, {
      [MTgetLoggedInDevicesFromServer]: {
        username: userId,
        password: pwdOrToken,
        isPassword: isPassword ?? true
      }
    });
    ChatClient.checkErrorFromResult(r);
    let ret = [];
    let list = r === null || r === void 0 ? void 0 : r[MTgetLoggedInDevicesFromServer];
    if (list) {
      list.forEach(element => {
        ret.push(new ChatDeviceInfo(element));
      });
    }
    return ret;
  }

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
  async kickDevice(userId, pwdOrToken, resource, isPassword) {
    chatlog.log(`${ChatClient.TAG}: kickDevice: `, userId, '******', resource);
    let r = await Native._callMethod(MTkickDevice, {
      [MTkickDevice]: {
        username: userId,
        password: pwdOrToken,
        resource: resource,
        isPassword: isPassword ?? true
      }
    });
    ChatClient.checkErrorFromResult(r);
  }

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
  async kickAllDevices(userId, pwdOrToken, isPassword) {
    chatlog.log(`${ChatClient.TAG}: kickAllDevices: `, userId, '******');
    let r = await Native._callMethod(MTkickAllDevices, {
      [MTkickAllDevices]: {
        username: userId,
        password: pwdOrToken,
        isPassword: isPassword ?? true
      }
    });
    ChatClient.checkErrorFromResult(r);
  }

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
  async updatePushConfig(config) {
    chatlog.log(`${ChatClient.TAG}: updatePushConfig: ${JSON.stringify(config)}`);
    if (this._options) {
      this._options.pushConfig = new ChatPushConfig(this._options.pushConfig); // deep copy
      if (config.deviceId) {
        this._options.pushConfig.deviceId = config.deviceId;
      }
      if (config.deviceToken) {
        this._options.pushConfig.deviceToken = config.deviceToken;
      }
    }
    let r = await Native._callMethod(MTupdatePushConfig, {
      [MTupdatePushConfig]: {
        config: config
      }
    });
    ChatPushManager.checkErrorFromResult(r);
  }

  /**
   * Adds the connection status listener.
   *
   * @param listener The connection status listener to add.
   */
  addConnectionListener(listener) {
    chatlog.log(`${ChatClient.TAG}: addConnectionListener: `);
    this._connectionListeners.add(listener);
  }

  /**
   * Removes the connection status listener.
   *
   * @param listener The connection status listener to remove.
   */
  removeConnectionListener(listener) {
    chatlog.log(`${ChatClient.TAG}: removeConnectionListener: `);
    this._connectionListeners.delete(listener);
  }

  /**
   * Removes all the connection status listeners for the chat server.
   */
  removeAllConnectionListener() {
    chatlog.log(`${ChatClient.TAG}: removeAllConnectionListener: `);
    this._connectionListeners.clear();
  }

  /**
   * Adds the multi-device listener.
   *
   * @param listener The multi-device listener to add.
   */
  addMultiDeviceListener(listener) {
    chatlog.log(`${ChatClient.TAG}: addMultiDeviceListener: `);
    this._multiDeviceListeners.add(listener);
  }

  /**
   * Removes the specified multi-device listener.
   *
   * @param listener The multi-device listener to remove.
   */
  removeMultiDeviceListener(listener) {
    chatlog.log(`${ChatClient.TAG}: removeMultiDeviceListener: `);
    this._multiDeviceListeners.delete(listener);
  }

  /**
   * Removes all the multi-device listeners.
   */
  removeAllMultiDeviceListener() {
    chatlog.log(`${ChatClient.TAG}: removeAllMultiDeviceListener: `);
    this._multiDeviceListeners.clear();
  }

  /**
   * Adds a custom listener to receive data that the iOS or Android devices send to the React Native layer.
   *
   * @param listener The custom listener to add.
   */
  addCustomListener(listener) {
    chatlog.log(`${ChatClient.TAG}: addCustomListener: `);
    this._customListeners.add(listener);
  }

  /**
   * Removes a custom listener to stop receiving data that the iOS or Android devices send to the React Native layer.
   *
   * @param listener The custom listener to remove.
   */
  removeCustomListener(listener) {
    chatlog.log(`${ChatClient.TAG}: removeCustomListener: `);
    this._customListeners.delete(listener);
  }

  /**
   *  Removes all the custom listeners.
   */
  removeAllCustomListener() {
    chatlog.log(`${ChatClient.TAG}: removeAllCustomListener: `);
    this._customListeners.clear();
  }

  /**
   * Add error listener.
   *
   * Monitor SDK internal errors.
   */
  addExceptListener(listener) {
    chatlog.log(`${ChatClient.TAG}: addExceptListener: `);
    ExceptionHandler.getInstance().listeners.add(listener);
  }

  /**
   * Remove error listener.
   */
  removeExceptListener(listener) {
    chatlog.log(`${ChatClient.TAG}: removeExceptListener: `);
    ExceptionHandler.getInstance().listeners.delete(listener);
  }

  /**
   * Remove all error listener.
   */
  removeAllExceptListener() {
    chatlog.log(`${ChatClient.TAG}: removeAllExceptListener: `);
    ExceptionHandler.getInstance().listeners.clear();
  }

  /**
   * Gets the chat manager class.
   *
   * This method can be called only after the chat client is initialized.
   *
   * @returns The chat manager class.
   */
  get chatManager() {
    return this._chatManager;
  }

  /**
   * Gets the chat group manager class.
   *
   * This method can be called only after the chat client is initialized.
   *
   * @returns The chat group manager class.
   */
  get groupManager() {
    return this._groupManager;
  }

  /**
   * Gets the contact manager class.
   *
   * This method can be called only after the chat client is initialized.
   *
   * @returns The contact manager class.
   */
  get contactManager() {
    return this._contactManager;
  }

  /**
   * Gets the push manager class.
   *
   * This method can be called only after the chat client is initialized.
   *
   * @returns The push manager class.
   */
  get pushManager() {
    return this._pushManager;
  }

  /**
   * Gets the user information manager class.
   *
   * This method can be called only after the chat client is initialized.
   *
   * @returns The user information manager class.
   */
  get userManager() {
    return this._userInfoManager;
  }

  /**
   * Gets the chat room manager class.
   *
   * This method can be called only after the chat client is initialized.
   *
   * @returns The chat room manager class.
   */
  get roomManager() {
    return this._chatRoomManager;
  }

  /**
   * Gets the presence manager class.
   *
   * This method can be called only after the chat client is initialized.
   *
   * @returns The presence manager class.
   */
  get presenceManager() {
    return this._presenceManager;
  }
}
//# sourceMappingURL=ChatClient.js.map
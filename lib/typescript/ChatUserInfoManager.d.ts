import { Native } from './__internal__/Native';
import { ChatUserInfo } from './common/ChatUserInfo';
/**
 * The user information manager for updating and getting user attributes.
 */
export declare class ChatUserInfoManager extends Native {
    private static TAG;
    constructor();
    /**
     * Modifies the user attributes of the current user.
     *
     * @params The parameter set.
     * - [nickName] The nickname of the user.
     * - [avatarUrl] The avatar URL of the user.
     * - [mail] The email address of the user.
     * - [phone] The phone number of the user.
     * - [gender] The gender of the user. The value can only be `0`, `1`, or `2`. Other values are invalid.
     *    - `0`: (Default) Unknown;
     *    - `1`: Male;
     *    - `2`: Female.
     * - [sign] The signature of the user.
     * - [birth] The birthday of the user.
     * - [ext] The custom extension information of the user. You can set it to an empty string or type custom information and encapsulate them as a JSON string.
     *
     * @throws A description of the exception. See {@link ChatError}.
     */
    updateOwnUserInfo(params: {
        nickName?: string;
        avatarUrl?: string;
        mail?: string;
        phone?: string;
        gender?: number;
        sign?: string;
        birth?: string;
        ext?: string;
    }): Promise<void>;
    /**
     * Gets the user attributes of the specified users.
     *
     * @param userIds The user ID array.
     * @returns A map that contains key-value pairs where the key is the user ID and the value is user attributes，see {@link ChatUserInfo}.
     *
     * @throws A description of the exception. See {@link ChatError}.
     */
    fetchUserInfoById(userIds: Array<string>): Promise<Map<string, ChatUserInfo>>;
    /**
     * Gets attributes of the current user from the server.
     *
     * @returns The obtained user attributes. See {@link ChatUserInfo}.
     *
     * @throws A description of the exception. See {@link ChatError}.
     */
    fetchOwnInfo(): Promise<ChatUserInfo | undefined>;
}
//# sourceMappingURL=ChatUserInfoManager.d.ts.map
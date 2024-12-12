import type { NativeEventEmitter } from 'react-native';
import { Native } from './__internal__/Native';
import type { ChatPresenceEventListener } from './ChatEvents';
import { ChatPresence } from './common/ChatPresence';
/**
 * The presence manager class.
 */
export declare class ChatPresenceManager extends Native {
    private static TAG;
    private _presenceListeners;
    private _presenceSubscriptions;
    constructor();
    setNativeListener(event: NativeEventEmitter): void;
    private invokePresenceListener;
    /**
     * Adds a presence listener.
     *
     * @param listener The presence listener to add.
     */
    addPresenceListener(listener: ChatPresenceEventListener): void;
    /**
     * Removes a presence listener.
     *
     * @param listener The presence listener to remove.
     */
    removePresenceListener(listener: ChatPresenceEventListener): void;
    /**
     * Clears all presence listeners.
     */
    removeAllPresenceListener(): void;
    /**
     * Publishes a custom presence state.
     *
     * @param description The extension information of the presence state. It can be set as nil.
     *
     * @throws A description of the exception. See {@link ChatError}.
     */
    publishPresence(description?: string): Promise<void>;
    /**
     * Subscribes to the presence state of a user.
     *
     * If the subscription succeeds, the subscriber will receive the callback when the presence state of the user changes.
     *
     * @param members The array of user IDs users whose presence state you want to subscribe to.
     * @param expiry The subscription duration in seconds. The duration cannot exceed 2,592,000 (30×24×3600) seconds, i.e., 30 days.
     * @returns The current presence state of users to whom you have subscribed.
     *
     * @throws A description of the exception. See {@link ChatError}.
     */
    subscribe(members: Array<string>, expiry: number): Promise<Array<ChatPresence>>;
    /**
     * Unsubscribes from the presence state of the unspecified users.
     *
     * @param members The array of user IDs whose presence state you want to unsubscribe from.
     *
     * @throws A description of the exception. See {@link ChatError}.
     */
    unsubscribe(members: Array<string>): Promise<void>;
    /**
     * Uses the pagination to get a list of users whose presence states you have subscribed to.
     *
     * @param pageNum The current page number, starting from 1.
     * @param pageSize The number of subscribed users that you expect to get on each page.
     * @returns The user IDs of your subscriptions. The SDK returns `null` if you does not subscribe to the presence state of any users.
     *
     * @throws A description of the exception. See {@link ChatError}.
     */
    fetchSubscribedMembers(pageNum?: number, pageSize?: number): Promise<Array<string>>;
    /**
     * Gets the current presence state of specified users.
     *
     * @param members The array of user IDs whose current presence state you want to check.
     * @returns The current presence states of the specified users.
     *
     * @throws A description of the exception. See {@link ChatError}.
     */
    fetchPresenceStatus(members: Array<string>): Promise<Array<ChatPresence>>;
}
//# sourceMappingURL=ChatPresenceManager.d.ts.map
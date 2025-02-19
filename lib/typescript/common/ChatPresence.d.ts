/**
 * The presence property class that contains presence properties, including the publisher's user ID and current presence state, and the platform used by the online device, as well as the presence's extension information, update time, and subscription expiration time.
 */
export declare class ChatPresence {
    /**
     * The user ID of the presence publisher.
     */
    publisher: string;
    /**
     * The custom online state such as busy, away, or hidden.
     */
    statusDescription: string;
    /**
     * The Unix timestamp when the presence state is last updated. The unit is second.
     */
    lastTime: string;
    /**
     * The Unix timestamp when the presence subscription expires. The unit is second.
     */
    expiryTime: string;
    /**
     * The details of the current presence state.
     */
    statusDetails: Map<string, number>;
    constructor(params: {
        publisher: string;
        statusDescription: string;
        lastTime: string;
        expiryTime: string;
        statusDetails: any;
    });
}
//# sourceMappingURL=ChatPresence.d.ts.map
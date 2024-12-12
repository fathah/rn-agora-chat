import type { ChatExceptionEventListener } from '../ChatEvents';
import type { ChatException } from '../common/ChatError';
/**
 * Handle internal errors. The upper layer gets errors by adding a listener. The except event will be called back when an except occurs.
 */
export declare class ExceptionHandler {
    private static TAG;
    private static _instance;
    private _exceptListeners;
    private constructor();
    static getInstance(): ExceptionHandler;
    get listeners(): Set<ChatExceptionEventListener>;
    /**
     * SDK internal call.
     */
    sendExcept(params: {
        except: ChatException;
        from?: string;
        extra?: Record<string, string>;
    }): void;
}
//# sourceMappingURL=ErrorHandler.d.ts.map
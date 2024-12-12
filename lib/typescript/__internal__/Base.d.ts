import type { NativeEventEmitter } from 'react-native';
import type { ChatGroupFileStatusCallback } from '../common/ChatGroup';
import { ChatMessage, ChatMessageStatusCallback } from '../common/ChatMessage';
import { Native } from './Native';
export declare class BaseManager extends Native {
    protected static TAG: string;
    protected _eventEmitter?: NativeEventEmitter;
    constructor();
    setNativeListener(_eventEmitter: NativeEventEmitter): void;
    protected static handleMessageCallback(methodName: string, self: BaseManager, message: ChatMessage, callback?: ChatMessageStatusCallback): void;
    protected static handleGroupFileCallback(methodName: string, self: BaseManager, groupId: string, filePath: string, callback?: ChatGroupFileStatusCallback): void;
}
//# sourceMappingURL=Base.d.ts.map
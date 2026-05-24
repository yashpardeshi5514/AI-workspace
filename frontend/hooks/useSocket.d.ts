import { Socket } from 'socket.io-client';
export declare function useSocket(): {
    sendMessage: (content: string) => void;
    socket: Socket<import("@socket.io/component-emitter").DefaultEventsMap, import("@socket.io/component-emitter").DefaultEventsMap> | null;
};
//# sourceMappingURL=useSocket.d.ts.map
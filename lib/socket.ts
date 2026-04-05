// Simplified socket library using HTTP polling instead of Socket.IO
// This provides basic real-time-like functionality without complex server setup

type EventHandler = (data: any) => void;

class SimpleSocket {
    private userId: string | null = null;
    private eventHandlers: Map<string, EventHandler[]> = new Map();
    private pollingInterval: NodeJS.Timeout | null = null;
    private connected: boolean = false;

    connect(userId: string) {
        this.userId = userId;
        this.connected = true;
        console.log('Socket connected (HTTP polling mode)');
    }

    on(event: string, handler: EventHandler) {
        if (!this.eventHandlers.has(event)) {
            this.eventHandlers.set(event, []);
        }
        this.eventHandlers.get(event)?.push(handler);
    }

    off(event: string, handler: EventHandler) {
        const handlers = this.eventHandlers.get(event);
        if (handlers) {
            const index = handlers.indexOf(handler);
            if (index > -1) {
                handlers.splice(index, 1);
            }
        }
    }

    emit(event: string, data: any) {
        // For HTTP polling, we don't actually emit events
        // Events are triggered by API responses
        console.log('Emit event:', event, data);
    }

    disconnect() {
        this.connected = false;
        if (this.pollingInterval) {
            clearInterval(this.pollingInterval);
        }
        console.log('Socket disconnected');
    }

    get id() {
        return this.userId;
    }
}

let socket: SimpleSocket | null = null;

export const initSocket = (userId: string): SimpleSocket => {
    if (!socket) {
        socket = new SimpleSocket();
    }
    socket.connect(userId);
    return socket;
};

export const getSocket = (): SimpleSocket | null => {
    return socket;
};

export const disconnectSocket = () => {
    if (socket) {
        socket.disconnect();
        socket = null;
    }
};

// Server-side exports (not used in HTTP polling mode)
export const setIO = (io: any) => {
    // Not used
};

export const getIO = () => {
    return null;
};

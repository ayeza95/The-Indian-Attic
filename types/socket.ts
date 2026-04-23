import { Server as SocketIOServer } from 'socket.io';
import { Server as HTTPServer } from 'http';

export interface ServerToClientEvents {
    'message:new': (data: {
        conversationId: string;
        message: {
            _id: string;
            sender: string;
            content: string;
            image?: string;
            timestamp: Date;
            read: boolean;
        };
    }) => void;
    'message:read': (data: {
        conversationId: string;
        messageIds: string[];
    }) => void;
    'typing:start': (data: {
        conversationId: string;
        userId: string;
        userName: string;
    }) => void;
    'typing:stop': (data: {
        conversationId: string;
        userId: string;
    }) => void;
    'user:online': (data: {
        userId: string;
    }) => void;
    'user:offline': (data: {
        userId: string;
    }) => void;
}

export interface ClientToServerEvents {
    'message:send': (data: {
        conversationId: string;
        content: string;
    }) => void;
    'message:markRead': (data: {
        conversationId: string;
        messageIds: string[];
    }) => void;
    'typing:start': (data: {
        conversationId: string;
    }) => void;
    'typing:stop': (data: {
        conversationId: string;
    }) => void;
    'user:join': (data: {
        userId: string;
    }) => void;
}

export interface InterServerEvents {
    ping: () => void;
}

export interface SocketData {
    userId: string;
    userName: string;
}

export type SocketIOServerType = SocketIOServer<
    ClientToServerEvents,
    ServerToClientEvents,
    InterServerEvents,
    SocketData
>;

export interface ConversationWithDetails {
    _id: string;
    buyer: {
        _id: string;
        name: string;
        email: string;
        avatar?: string;
    };
    seller: {
        _id: string;
        name: string;
        email: string;
        avatar?: string;
    };
    product?: {
        _id: string;
        name: string;
        images: string[];
    };
    messages: Array<{
        _id: string;
        sender: string;
        content: string;
        image?: string;
        timestamp: Date;
        read: boolean;
    }>;
    lastMessageAt: Date;
    unreadCount?: number;
    otherUser?: {
        _id: string;
        name: string;
        email: string;
        avatar?: string;
        isOnline?: boolean;
    };
}

export interface MessageData {
    _id: string;
    sender: string;
    content: string;
    image?: string; // Cloudinary image URL
    timestamp: Date;
    read: boolean;
}

export interface UserSearchResult {
    _id: string;
    name: string;
    email: string;
    role: 'buyer' | 'artisan';
    avatar?: string;
    businessName?: string;
    craftSpecialization?: string[];
}

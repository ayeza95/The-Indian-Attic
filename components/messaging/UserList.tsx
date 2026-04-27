'use client';

import { useState, useEffect } from 'react';
import { ConversationWithDetails } from '@/types/socket';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import SearchUsers from './SearchUsers';
import { formatDistanceToNow } from 'date-fns';

interface UserListProps {
    conversations: ConversationWithDetails[];
    selectedConversationId: string | null;
    onSelectConversation: (conversationId: string) => void;
    onStartNewConversation: (userId: string) => void;
}

export default function UserList({
    conversations,
    selectedConversationId,
    onSelectConversation,
    onStartNewConversation
}: UserListProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredConversations, setFilteredConversations] = useState<ConversationWithDetails[]>([]);

    useEffect(() => {
        if (!searchQuery.trim()) {
            setFilteredConversations(conversations);
        } else {
            const query = searchQuery.toLowerCase();
            const filtered = conversations.filter(conv =>
                conv.otherUser?.name.toLowerCase().includes(query) ||
                conv.otherUser?.email.toLowerCase().includes(query)
            );
            setFilteredConversations(filtered);
        }
    }, [conversations, searchQuery]);

    const getLastMessagePreview = (conv: ConversationWithDetails) => {
        if (conv.messages.length === 0) return 'No messages yet';
        const lastMessage = conv.messages[conv.messages.length - 1];
        if (!lastMessage.content && lastMessage.image) return 'Sent an image';
        return lastMessage.content.length > 50
            ? lastMessage.content.substring(0, 50) + '...'
            : lastMessage.content;
    };

    return (
        <div className="w-full md:w-80 lg:w-96 border-r border-gray-200 bg-white flex flex-col h-full">
            {/* Header */}
            <div className="p-4 border-b border-gray-200">
                <h2 className="text-xl font-semibold mb-3">Messages</h2>
                <SearchUsers onSelectUser={onStartNewConversation} />
            </div>

            {/* Search */}
            <div className="p-4 border-b border-gray-200">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                        placeholder="Search conversations..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                    />
                </div>
            </div>

            {/* Conversations List */}
            <div className="flex-1 overflow-y-auto">
                {filteredConversations.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full p-8 text-center">
                        <p className="text-gray-500 mb-2">No conversations yet</p>
                        <p className="text-sm text-gray-400">Start a new conversation to get started</p>
                    </div>
                ) : (
                    filteredConversations.map((conv) => {
                        const isSelected = conv._id === selectedConversationId;
                        const lastMessage = conv.messages[conv.messages.length - 1];

                        return (
                            <button
                                key={conv._id}
                                onClick={() => onSelectConversation(conv._id)}
                                className={`w-full flex items-start gap-3 p-4 hover:bg-gray-50 transition-colors border-b border-gray-100 ${isSelected ? 'bg-heritage-50' : ''
                                    }`}
                            >
                                {/* Avatar */}
                                <div className="relative">
                                    <div className="w-12 h-12 rounded-full bg-heritage-100 flex items-center justify-center text-heritage-700 font-semibold text-lg flex-shrink-0">
                                        {(conv.otherUser as any)?.role === 'admin' ? 'A' : conv.otherUser?.name.charAt(0).toUpperCase()}
                                    </div>
                                    {conv.otherUser?.isOnline && (
                                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                                    )}
                                </div>

                                {/* Content */}
                                <div className="flex-1 min-w-0 text-left">
                                    <div className="flex items-center justify-between mb-1">
                                        <p className="font-semibold text-sm truncate">
                                            {(conv.otherUser as any)?.role === 'admin' ? 'Admin' : conv.otherUser?.name}
                                        </p>
                                        {lastMessage && (
                                            <span className="text-xs text-gray-500 flex-shrink-0 ml-2">
                                                {formatDistanceToNow(new Date(lastMessage.timestamp), { addSuffix: true })}
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-sm text-gray-600 truncate">
                                        {getLastMessagePreview(conv)}
                                    </p>
                                    {conv.unreadCount && conv.unreadCount > 0 && (
                                        <div className="mt-1">
                                            <span className="inline-flex items-center justify-center px-2 py-0.5 text-xs font-semibold text-white bg-heritage-600 rounded-full">
                                                {conv.unreadCount}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </button>
                        );
                    })
                )}
            </div>
        </div>
    );
}

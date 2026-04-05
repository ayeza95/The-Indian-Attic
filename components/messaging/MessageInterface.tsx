'use client';

import { useState, useEffect } from 'react';
import { ConversationWithDetails } from '@/types/socket';
import UserList from './UserList';
import ChatWindow from './ChatWindow';
import { initSocket, disconnectSocket } from '@/lib/socket';

interface MessageInterfaceProps {
    userId: string;
}

export default function MessageInterface({ userId }: MessageInterfaceProps) {
    const [conversations, setConversations] = useState<ConversationWithDetails[]>([]);
    const [selectedConversation, setSelectedConversation] = useState<ConversationWithDetails | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [showChat, setShowChat] = useState(false);

    useEffect(() => {
        // Initialize socket (HTTP polling mode)
        const socket = initSocket(userId);

        // Fetch conversations initially
        fetchConversations();

        // Poll for new messages every 3 seconds
        const pollingInterval = setInterval(() => {
            fetchConversations();
        }, 3000);

        return () => {
            clearInterval(pollingInterval);
            disconnectSocket();
        };
    }, [userId]);

    const fetchConversations = async () => {
        try {
            const response = await fetch('/api/conversations');
            if (response.ok) {
                const data = await response.json();
                setConversations(data.conversations || []);

                // Update selected conversation if it exists
                if (selectedConversation) {
                    const updated = data.conversations.find(
                        (c: ConversationWithDetails) => c._id === selectedConversation._id
                    );
                    if (updated) {
                        setSelectedConversation(updated);
                    }
                }
            }
        } catch (error) {
            console.error('Error fetching conversations:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSelectConversation = (conversationId: string) => {
        const conversation = conversations.find(c => c._id === conversationId);
        if (conversation) {
            setSelectedConversation(conversation);
            setShowChat(true);
        }
    };

    const handleStartNewConversation = async (otherUserId: string) => {
        try {
            const response = await fetch('/api/conversations', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ otherUserId }),
            });

            if (response.ok) {
                const data = await response.json();
                await fetchConversations();
                setSelectedConversation(data.conversation);
                setShowChat(true);
            }
        } catch (error) {
            console.error('Error creating conversation:', error);
        }
    };

    const handleBackToList = () => {
        setShowChat(false);
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-full">
                <p className="text-gray-500">Loading conversations...</p>
            </div>
        );
    }

    return (
        <div className="flex h-full">
            {/* User List - Hidden on mobile when chat is open */}
            <div className={`${showChat ? 'hidden md:flex' : 'flex'} w-full md:w-auto`}>
                <UserList
                    conversations={conversations}
                    selectedConversationId={selectedConversation?._id || null}
                    onSelectConversation={handleSelectConversation}
                    onStartNewConversation={handleStartNewConversation}
                />
            </div>

            {/* Chat Window - Hidden on mobile when list is shown */}
            <div className={`${showChat ? 'flex' : 'hidden md:flex'} flex-1`}>
                <ChatWindow
                    conversation={selectedConversation}
                    currentUserId={userId}
                    onBack={handleBackToList}
                />
            </div>
        </div>
    );
}

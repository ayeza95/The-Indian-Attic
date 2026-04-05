'use client';

import { useState, useEffect, useRef } from 'react';
import { ConversationWithDetails, MessageData } from '@/types/socket';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, ArrowLeft, Image as ImageIcon, X } from 'lucide-react';
import MessageBubble from './MessageBubble';
import { getSocket } from '@/lib/socket';
import Image from 'next/image';

interface ChatWindowProps {
    conversation: ConversationWithDetails | null;
    currentUserId: string;
    onBack?: () => void;
}

export default function ChatWindow({ conversation, currentUserId, onBack }: ChatWindowProps) {
    const [messages, setMessages] = useState<MessageData[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [typingUser, setTypingUser] = useState<string | null>(null);
    const [isSending, setIsSending] = useState(false);
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (conversation) {
            setMessages(conversation.messages || []);
            scrollToBottom();

            // Mark messages as read
            markAsRead();

            // Join conversation room
            const socket = getSocket();
            if (socket) {
                socket.emit('user:join', { userId: currentUserId });
            }
        }
    }, [conversation, currentUserId]);

    useEffect(() => {
        const socket = getSocket();
        if (!socket || !conversation) return;

        // Listen for new messages
        const handleNewMessage = (data: { conversationId: string; message: MessageData }) => {
            if (data.conversationId === conversation._id) {
                setMessages(prev => [...prev, data.message]);
                scrollToBottom();

                // Mark as read if from other user
                if (data.message.sender !== currentUserId) {
                    markAsRead();
                }
            }
        };

        // Listen for typing indicators
        const handleTypingStart = (data: { conversationId: string; userId: string; userName: string }) => {
            if (data.conversationId === conversation._id && data.userId !== currentUserId) {
                setTypingUser(data.userName);
            }
        };

        const handleTypingStop = (data: { conversationId: string; userId: string }) => {
            if (data.conversationId === conversation._id && data.userId !== currentUserId) {
                setTypingUser(null);
            }
        };

        socket.on('message:new', handleNewMessage);
        socket.on('typing:start', handleTypingStart);
        socket.on('typing:stop', handleTypingStop);

        return () => {
            socket.off('message:new', handleNewMessage);
            socket.off('typing:start', handleTypingStart);
            socket.off('typing:stop', handleTypingStop);
        };
    }, [conversation, currentUserId]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const markAsRead = async () => {
        if (!conversation) return;

        try {
            await fetch(`/api/conversations/${conversation._id}`, {
                method: 'PUT',
            });
        } catch (error) {
            console.error('Error marking messages as read:', error);
        }
    };

    const handleTyping = () => {
        const socket = getSocket();
        if (!socket || !conversation) return;

        if (!isTyping) {
            setIsTyping(true);
            socket.emit('typing:start', { conversationId: conversation._id });
        }

        // Clear existing timeout
        if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current);
        }

        // Set new timeout to stop typing indicator
        typingTimeoutRef.current = setTimeout(() => {
            setIsTyping(false);
            socket.emit('typing:stop', { conversationId: conversation._id });
        }, 2000);
    };

    const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file && file.type.startsWith('image/')) {
            setSelectedImage(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleRemoveImage = () => {
        setSelectedImage(null);
        setImagePreview(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const uploadImage = async (file: File): Promise<string> => {
        const formData = new FormData();
        formData.append('file', file);

        const response = await fetch('/api/upload/image', {
            method: 'POST',
            body: formData,
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Failed to upload image');
        }

        return data.url;
    };

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();

        if ((!newMessage.trim() && !selectedImage) || !conversation || isSending) return;

        setIsSending(true);
        const messageContent = newMessage.trim();
        setNewMessage('');

        // Stop typing indicator
        const socket = getSocket();
        if (socket && isTyping) {
            socket.emit('typing:stop', { conversationId: conversation._id });
            setIsTyping(false);
        }

        try {
            let imageUrl: string | undefined;

            // Upload image if selected
            if (selectedImage) {
                setIsUploading(true);
                imageUrl = await uploadImage(selectedImage);
                setIsUploading(false);
                handleRemoveImage();
            }

            const response = await fetch(`/api/conversations/${conversation._id}/messages`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    content: messageContent,
                    image: imageUrl
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to send message');
            }

            const data = await response.json();

            // Message will be added via socket event, but add optimistically
            setMessages(prev => [...prev, data.message]);
            scrollToBottom();
        } catch (error) {
            console.error('Error sending message:', error);
            setNewMessage(messageContent); // Restore message on error
        } finally {
            setIsSending(false);
            setIsUploading(false);
        }
    };

    if (!conversation) {
        return (
            <div className="flex-1 flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <p className="text-gray-500 text-lg">Select a conversation to start messaging</p>
                </div>
            </div>
        );
    }

    const otherUser = conversation.otherUser;

    return (
        <div className="flex-1 flex flex-col h-full bg-white">
            {/* Header */}
            <div className="border-b border-gray-200 px-4 py-3 bg-white">
                <div className="flex items-center gap-3">
                    {onBack && (
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={onBack}
                            className="md:hidden"
                        >
                            <ArrowLeft className="h-5 w-5" />
                        </Button>
                    )}
                    <div className="flex-1">
                        <h2 className="font-semibold text-lg">{otherUser?.name}</h2>
                        <p className="text-sm text-gray-500">{otherUser?.email}</p>
                    </div>
                </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-4 bg-gray-50">
                {messages.length === 0 ? (
                    <div className="flex items-center justify-center h-full">
                        <p className="text-gray-400">No messages yet. Start the conversation!</p>
                    </div>
                ) : (
                    <>
                        {messages.map((message, index) => (
                            <MessageBubble
                                key={message._id || index}
                                message={message}
                                isSent={message.sender === currentUserId}
                            />
                        ))}
                        {typingUser && (
                            <div className="flex justify-start mb-4">
                                <div className="bg-gray-100 rounded-2xl px-4 py-2">
                                    <p className="text-sm text-gray-500 italic">{typingUser} is typing...</p>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </>
                )}
            </div>

            {/* Input */}
            <div className="border-t border-gray-200 px-4 py-3 bg-white">
                {/* Image Preview */}
                {imagePreview && (
                    <div className="mb-2 relative inline-block">
                        <Image
                            src={imagePreview}
                            alt="Preview"
                            width={100}
                            height={100}
                            className="rounded-lg"
                        />
                        <button
                            onClick={handleRemoveImage}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                        >
                            <X className="h-3 w-3" />
                        </button>
                    </div>
                )}

                <form onSubmit={handleSendMessage} className="flex gap-2">
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleImageSelect}
                        className="hidden"
                    />
                    <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isSending || isUploading}
                    >
                        <ImageIcon className="h-4 w-4" />
                    </Button>
                    <Input
                        value={newMessage}
                        onChange={(e) => {
                            setNewMessage(e.target.value);
                            handleTyping();
                        }}
                        placeholder="Type a message..."
                        className="flex-1"
                        disabled={isSending || isUploading}
                    />
                    <Button
                        type="submit"
                        disabled={(!newMessage.trim() && !selectedImage) || isSending || isUploading}
                    >
                        {isUploading ? (
                            <span className="text-xs">Uploading...</span>
                        ) : (
                            <Send className="h-4 w-4" />
                        )}
                    </Button>
                </form>
            </div>
        </div>
    );
}

'use client';

import { useState, useEffect } from 'react';
import { MessageData } from '@/types/socket';
import { formatDistanceToNow } from 'date-fns';
import Image from 'next/image';

interface MessageBubbleProps {
    message: MessageData;
    isSent: boolean;
    showTimestamp?: boolean;
}

export default function MessageBubble({ message, isSent, showTimestamp = true }: MessageBubbleProps) {
    const [formattedTime, setFormattedTime] = useState('');

    useEffect(() => {
        const updateTime = () => {
            setFormattedTime(formatDistanceToNow(new Date(message.timestamp), { addSuffix: true }));
        };

        updateTime();
        const interval = setInterval(updateTime, 60000); // Update every minute

        return () => clearInterval(interval);
    }, [message.timestamp]);

    return (
        <div className={`flex ${isSent ? 'justify-end' : 'justify-start'} mb-4`}>
            <div className={`max-w-[70%] ${isSent ? 'order-2' : 'order-1'}`}>
                <div
                    className={`rounded-2xl px-4 py-2 ${isSent
                        ? 'bg-heritage-600 text-white rounded-br-sm'
                        : 'bg-gray-100 text-gray-900 rounded-bl-sm'
                        }`}
                >
                    {message.image && (
                        <div className="mb-2 max-w-full">
                            <Image
                                src={message.image}
                                alt="Attached image"
                                width={400}
                                height={400}
                                className="rounded-lg w-full h-auto object-cover cursor-pointer hover:opacity-90 transition-opacity border border-gray-200 shadow-sm"
                                onClick={() => window.open(message.image, '_blank')}
                                unoptimized // Cloudinary URLs are already optimized, skipping Next.js optimization for speed and to avoid hostname issues
                            />
                        </div>
                    )}
                    {message.content && (
                        <p className="text-sm whitespace-pre-wrap break-words">{message.content}</p>
                    )}
                </div>
                {showTimestamp && (
                    <div className={`flex items-center gap-1 mt-1 px-2 ${isSent ? 'justify-end' : 'justify-start'}`}>
                        <span className="text-xs text-gray-500">{formattedTime}</span>
                        {isSent && (
                            <span className="text-xs text-gray-500">
                                {message.read ? '✓✓' : '✓'}
                            </span>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

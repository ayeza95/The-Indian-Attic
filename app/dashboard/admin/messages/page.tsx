'use client';

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';
import { MessageSquare, User, Store, X } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

interface Conversation {
    _id: string;
    buyer: {
        _id: string;
        name: string;
        email: string;
        role: string;
    };
    seller: {
        _id: string;
        name: string;
        email: string;
        role: string;
        businessName?: string;
    };
    messages: {
        sender: string;
        content: string;
        timestamp: string;
    }[];
    lastMessageAt: string;
}

export default function AdminMessagesPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
    const [conversationView, setConversationView] = useState<'artisan' | 'buyer'>('artisan');

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/auth/login');
        }
        if (status === 'authenticated' && session?.user?.role !== 'admin') {
            router.push('/');
        }
    }, [status, session, router]);

    useEffect(() => {
        if (session?.user?.role === 'admin') {
            fetchConversations();
        }
    }, [session]);

    const fetchConversations = async () => {
        try {
            const response = await fetch('/api/admin/messages');
            if (response.ok) {
                const data = await response.json();
                setConversations(data.conversations);
            }
        } catch (error) {
            console.error('Failed to fetch conversations:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="p-8 text-center">Loading messages...</div>;

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="heading-section mb-2">Message Center</h1>
            <p className="text-heritage-600 mb-8">Monitor conversations between Artisans and Buyers</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Artisans Column */}
                <Card className="h-[calc(100vh-200px)] flex flex-col">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Store className="h-5 w-5" />
                            Artisans
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="flex-1 overflow-y-auto space-y-4">
                        {conversations.map(conv => (
                            <div 
                                key={conv._id}
                                onClick={() => {
                                    setSelectedConversation(conv);
                                    setConversationView('artisan');
                                }}
                                className="p-4 rounded-lg border border-heritage-100 hover:bg-heritage-50 cursor-pointer transition-colors"
                            >
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="font-semibold text-heritage-900">{conv.seller.businessName || conv.seller.name}</h3>
                                        <p className="text-sm text-heritage-600">{conv.seller.email}</p>
                                    </div>
                                    <span className="text-xs text-muted-foreground whitespace-nowrap">
                                        {formatDistanceToNow(new Date(conv.lastMessageAt), { addSuffix: true })}
                                    </span>
                                </div>
                                <div className="mt-2 text-xs text-muted-foreground flex items-center gap-1">
                                    <User className="h-3 w-3" />
                                    <span>With: {conv.buyer.name}</span>
                                </div>
                            </div>
                        ))}
                        {conversations.length === 0 && <p className="text-center text-muted-foreground py-4">No messages found</p>}
                    </CardContent>
                </Card>

                {/* Buyers Column */}
                <Card className="h-[calc(100vh-200px)] flex flex-col">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <User className="h-5 w-5" />
                            Buyers
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="flex-1 overflow-y-auto space-y-4">
                        {conversations.map(conv => (
                            <div 
                                key={conv._id}
                                onClick={() => {
                                    setSelectedConversation(conv);
                                    setConversationView('buyer');
                                }}
                                className="p-4 rounded-lg border border-heritage-100 hover:bg-heritage-50 cursor-pointer transition-colors"
                            >
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="font-semibold text-heritage-900">{conv.buyer.name}</h3>
                                        <p className="text-sm text-heritage-600">{conv.buyer.email}</p>
                                    </div>
                                    <span className="text-xs text-muted-foreground whitespace-nowrap">
                                        {formatDistanceToNow(new Date(conv.lastMessageAt), { addSuffix: true })}
                                    </span>
                                </div>
                                <div className="mt-2 text-xs text-muted-foreground flex items-center gap-1">
                                    <Store className="h-3 w-3" />
                                    <span>With: {conv.seller.businessName || conv.seller.name}</span>
                                </div>
                            </div>
                        ))}
                        {conversations.length === 0 && <p className="text-center text-muted-foreground py-4">No messages found</p>}
                    </CardContent>
                </Card>
            </div>

            {/* Conversation Modal */}
            {selectedConversation && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <Card className="w-full max-w-2xl max-h-[80vh] flex flex-col shadow-xl">
                        <CardHeader className="flex flex-row items-center justify-between border-b py-4">
                            <div>
                                <CardTitle className="text-lg">Conversation Details</CardTitle>
                                <p className="text-sm text-muted-foreground mt-1">
                                    {selectedConversation.seller.name} <span className="mx-2">↔</span> {selectedConversation.buyer.name}
                                </p>
                            </div>
                            <button 
                                onClick={() => setSelectedConversation(null)}
                                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </CardHeader>
                        <CardContent className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                            {selectedConversation.messages.map((msg, idx) => {
                                const isArtisan = msg.sender === selectedConversation.seller._id;
                                // If viewing from artisan list, artisan is 'me' (right). If buyer list, buyer is 'me' (right).
                                const isRightSide = conversationView === 'artisan' ? isArtisan : !isArtisan;
                                return (
                                    <div key={idx} className={`flex ${isRightSide ? 'justify-end' : 'justify-start'}`}>
                                        <div className={`max-w-[80%] rounded-lg p-3 ${
                                            isRightSide 
                                                ? 'bg-heritage-600 text-white'
                                                : 'bg-white border border-gray-200 text-gray-900'
                                        }`}>
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="text-xs font-semibold opacity-75">
                                                    {isArtisan ? 'Artisan' : 'Buyer'}
                                                </span>
                                                <span className="text-[10px] opacity-50">
                                                    {new Date(msg.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                                </span>
                                            </div>
                                            <p className="text-sm">{msg.content}</p>
                                        </div>
                                    </div>
                                );
                            })}
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    );
}

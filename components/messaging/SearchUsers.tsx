'use client';

import { useState } from 'react';
import { UserSearchResult } from '@/types/socket';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Plus } from 'lucide-react';

interface SearchUsersProps {
    onSelectUser: (userId: string) => void;
}

export default function SearchUsers({ onSelectUser }: SearchUsersProps) {
    const [open, setOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [users, setUsers] = useState<UserSearchResult[]>([]);
    const [isSearching, setIsSearching] = useState(false);

    const handleSearch = async (query: string) => {
        setSearchQuery(query);

        if (query.trim().length < 2) {
            setUsers([]);
            return;
        }

        setIsSearching(true);
        try {
            const response = await fetch(`/api/users/search?q=${encodeURIComponent(query)}`);
            if (response.ok) {
                const data = await response.json();
                setUsers(data.users || []);
            }
        } catch (error) {
            console.error('Error searching users:', error);
        } finally {
            setIsSearching(false);
        }
    };

    const handleSelectUser = async (userId: string) => {
        setOpen(false);
        setSearchQuery('');
        setUsers([]);
        onSelectUser(userId);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="w-full">
                    <Plus className="h-4 w-4 mr-2" />
                    New Message
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Start a New Conversation</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                            placeholder="Search by name or email..."
                            value={searchQuery}
                            onChange={(e) => handleSearch(e.target.value)}
                            className="pl-10"
                        />
                    </div>

                    <div className="max-h-[300px] overflow-y-auto space-y-2">
                        {isSearching ? (
                            <div className="text-center py-8 text-gray-500">Searching...</div>
                        ) : users.length === 0 ? (
                            <div className="text-center py-8 text-gray-500">
                                {searchQuery.trim() ? 'No users found' : 'Type to search for users'}
                            </div>
                        ) : (
                            users.map((user) => (
                                <button
                                    key={user._id}
                                    onClick={() => handleSelectUser(user._id)}
                                    className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors text-left"
                                >
                                    <div className="w-10 h-10 rounded-full bg-heritage-100 flex items-center justify-center text-heritage-700 font-semibold">
                                        {user.name.charAt(0).toUpperCase()}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-medium text-sm truncate">{user.name}</p>
                                        <p className="text-xs text-gray-500 truncate">
                                            {user.businessName || user.email}
                                        </p>
                                        {user.craftSpecialization && user.craftSpecialization.length > 0 && (
                                            <p className="text-xs text-heritage-600 truncate">
                                                {user.craftSpecialization.join(', ')}
                                            </p>
                                        )}
                                    </div>
                                </button>
                            ))
                        )}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}

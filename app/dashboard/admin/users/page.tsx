'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface User {
    _id: string;
    name: string;
    email: string;
    role: string;
    isActive: boolean;
    createdAt: string;
    phone?: string;
    businessName?: string;
}

export default function AdminUsers() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');

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
            fetchUsers();
        }
    }, [session, filter]);

    const fetchUsers = async () => {
        try {
            const response = await fetch(`/api/admin/users?role=${filter}`);
            if (response.ok) {
                const data = await response.json();
                let fetchedUsers: User[] = data.users;

                if (filter === 'all') {
                    // Sort by createdAt descending
                    fetchedUsers.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
                }

                setUsers(fetchedUsers);
            }
        } catch (error) {
            console.error('Failed to fetch users:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteUser = async (userId: string) => {
        if (!confirm('Are you sure you want to delete this user?')) {
            return;
        }

        try {
            const response = await fetch(`/api/admin/users/${userId}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                setUsers(users.filter(u => u._id !== userId));
                alert('User deleted successfully');
            } else {
                alert('Failed to delete user');
            }
        } catch (error) {
            alert('An error occurred');
        }
    };

    if (status === 'loading' || loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p>Loading...</p>
            </div>
        );
    }

    if (!session || session.user.role !== 'admin') {
        return null;
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-heritage-50 to-white">
            <div className="container mx-auto px-4 py-8">
                <div className="mb-8">
                    <h1 className="heading-section">User Management</h1>
                    <p className="text-heritage-600 mt-2">View and manage all registered users</p>
                </div>

                <div className="mb-6 flex gap-2">
                    <Button
                        variant={filter === 'all' ? 'default' : 'outline'}
                        onClick={() => setFilter('all')}
                    >
                        All Users
                    </Button>
                    <Button
                        variant={filter === 'buyer' ? 'default' : 'outline'}
                        onClick={() => setFilter('buyer')}
                    >
                        Buyers
                    </Button>
                    <Button
                        variant={filter === 'artisan' ? 'default' : 'outline'}
                        onClick={() => setFilter('artisan')}
                    >
                        Artisans
                    </Button>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Registered Users ({users.length})</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {users.length === 0 ? (
                            <p className="text-center py-8 text-heritage-600">No users found</p>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b border-heritage-200">
                                            <th className="text-left py-3 px-4">Name</th>
                                            <th className="text-left py-3 px-4">Email</th>
                                            <th className="text-left py-3 px-4">Role</th>
                                            <th className="text-left py-3 px-4">Status</th>
                                            <th className="text-left py-3 px-4">Joined</th>
                                            <th className="text-left py-3 px-4">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {users.map((user) => (
                                            <tr key={user._id} className="border-b border-heritage-100 hover:bg-heritage-50">
                                                <td className="py-3 px-4">
                                                    <div>
                                                        <div className="font-medium">{user.name}</div>
                                                        {user.businessName && (
                                                            <div className="text-xs text-heritage-600">{user.businessName}</div>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="py-3 px-4 text-sm">{user.email}</td>
                                                <td className="py-3 px-4">
                                                    <Badge variant="secondary">
                                                        {user.role}
                                                    </Badge>
                                                </td>
                                                <td className="py-3 px-4">
                                                    <Badge variant={user.isActive ? 'default' : 'destructive'}>
                                                        {user.isActive ? 'Active' : 'Inactive'}
                                                    </Badge>
                                                </td>
                                                <td className="py-3 px-4 text-sm">
                                                    {new Date(user.createdAt).toLocaleDateString()}
                                                </td>
                                                <td className="py-3 px-4">
                                                    <div className="flex gap-2">
                                                        <Button size="sm" variant="outline" asChild>
                                                            <Link href={`/dashboard/admin/users/${user._id}`}>
                                                                View
                                                            </Link>
                                                        </Button>
                                                        <Button
                                                            size="sm"
                                                            variant="destructive"
                                                            onClick={() => handleDeleteUser(user._id)}
                                                        >
                                                            Delete
                                                        </Button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

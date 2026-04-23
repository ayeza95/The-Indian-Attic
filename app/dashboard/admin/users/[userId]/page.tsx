'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState, use } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

interface UserDetails {
    _id: string;
    name: string;
    email: string;
    role: string;
    isActive: boolean;
    warningCount: number;
    isRestricted: boolean;
    isBanned: boolean;
    createdAt: string;
    phone?: string;
    businessName?: string;
    originState?: string;
    deliveryCountry?: string;
    culturalPreferences?: {
        festivals: string[];
        interests: string[];
    };
    products?: any[];
    orders?: any[];
}

export default function UserDetailPage({ params }: { params: Promise<{ userId: string }> }) {
    const { userId } = use(params);
    const { data: session, status } = useSession();
    const router = useRouter();
    const [user, setUser] = useState<UserDetails | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [message, setMessage] = useState('');
    const [messageText, setMessageText] = useState('');
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);

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
            fetchUser();
        }
    }, [session, userId]);

    const fetchUser = async () => {
        try {
            const response = await fetch(`/api/admin/users/${userId}`);
            if (response.ok) {
                const data = await response.json();
                setUser(data.user);
            } else {
                const data = await response.json();
                setError(data.error || 'Failed to fetch user');
            }
        } catch (error) {
            console.error('Failed to fetch user:', error);
            setError('An error occurred while fetching user details');
        } finally {
            setLoading(false);
        }
    };

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage('');

        try {
            let imageUrl = '';
            if (imageFile) {
                setUploading(true);
                const formData = new FormData();
                formData.append('file', imageFile);
                const uploadRes = await fetch('/api/upload/image', {
                    method: 'POST',
                    body: formData,
                });
                const uploadData = await uploadRes.json();
                if (uploadRes.ok) {
                    imageUrl = uploadData.url;
                } else {
                    setUploading(false);
                    setMessage(`Upload failed: ${uploadData.error || 'Failed to upload image'}`);
                    return; // Stop here if upload failed
                }
                setUploading(false);
            }

            const response = await fetch('/api/admin/send-message', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: userId,
                    message: messageText,
                    image: imageUrl,
                }),
            });

            if (response.ok) {
                setMessage('Message sent successfully');
                setMessageText('');
                setImageFile(null);
                // Clear the file input
                const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
                if (fileInput) fileInput.value = '';
            } else {
                setMessage('Failed to send message');
            }
        } catch (error) {
            setMessage('An error occurred');
        }
    };


    const handleWarning = async () => {
        if (!user) return;
        const currentCount = user.warningCount || 0;

        let warningMsg = '';
        if (currentCount === 0) {
            warningMsg = `This is your first warning for violating our community guidelines.\nPlease review and comply with all platform rules immediately. Repeated violations may result in account restrictions or permanent suspension.\nWarnings remaining before restriction: 2\nReason for warning: [ENTER REASON HERE]`;
        } else if (currentCount === 1) {
            warningMsg = `This is your second warning for violating our community guidelines.\nYou are approaching the maximum allowed warnings. Any further violation may lead to temporary account restriction and product review.\nWarnings remaining before restriction: 1\nReason for warning: [ENTER REASON HERE]`;
        } else if (currentCount === 2) {
            warningMsg = `This is your final warning for violating our community guidelines.\nAny further violation will result in immediate account restriction, during which your account and products will be reviewed.\nNo warnings remaining.\nReason for warning: [ENTER REASON HERE]`;
        }

        try {
            const response = await fetch(`/api/admin/users/${userId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: 'warn',
                }),
            });

            if (response.ok) {
                const data = await response.json();
                setUser(data.user);
                setMessageText(warningMsg);
                setMessage('Warning count updated. Please review and send the notification message below.');
            } else {
                const errorData = await response.json();
                setMessage(errorData.error || 'Failed to issue warning');
            }
        } catch (error) {
            setMessage('Failed to issue warning');
        }
    };

    const handleToggleRestriction = async () => {
        if (!user) return;

        const actionType = user.isRestricted ? 'unrestrict' : 'restrict';

        try {
            const response = await fetch(`/api/admin/users/${userId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    isRestricted: !user.isRestricted,
                }),
            });

            if (response.ok) {
                const data = await response.json();
                const updatedUser = data.user;
                setUser(updatedUser);

                let restrictMsg = '';
                if (updatedUser.isRestricted) {
                    restrictMsg = `Your account has been temporarily restricted due to repeated violations of our community guidelines.\nDuring this restriction period:\nYour account and listed products are under review.\nYou will not be able to add or modify products.\nThis is a precautionary action and not a permanent ban.\nFurther violations may lead to permanent account suspension.\nReason for restriction: [ENTER REASON HERE]`;
                    setMessage('User restricted. Please review and send the notification message below.');
                } else {
                    restrictMsg = `Your account restriction has been lifted.\nAfter reviewing your account, we have restored full access. You may now continue normal activities on the platform, including managing and adding products.\nPlease ensure strict compliance with our community guidelines to avoid future actions.\nNote: Any further violations may result in permanent suspension.\nReason for unrestriction: [ENTER REASON HERE]`;
                    setMessage('User unrestricted. Please review and send the notification message below.');
                }
                setMessageText(restrictMsg);
            }
        } catch (error) {
            setMessage('Failed to update restriction status');
        }
    };

    const performBan = async () => {
        if (!user) return;

        try {
            const response = await fetch(`/api/admin/users/${userId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    isBanned: true,
                }),
            });

            if (response.ok) {
                const data = await response.json();
                setUser(data.user);
                const banMsg = `Your account has been permanently banned due to repeated and serious violations of our community guidelines.\nThis decision was taken after multiple warnings and a restriction period. As a result:\nYour account access has been permanently disabled.\nAll associated products and activities have been removed.\nThis action is final unless otherwise stated by the platform administration.\nReason for ban: [ENTER REASON HERE]`;
                setMessageText(banMsg);
                setMessage('User has been BANNED permanently. Please send the final notification message below.');
            }
        } catch (error) {
            setMessage('Failed to ban user');
        }
    };

    const handleBan = () => {
        if (!user) return;
        
        toast(`Are you sure you want to BAN this user? This will deactivate their account and delete all their products permanently.`, {
            action: {
                label: 'Ban User',
                onClick: () => performBan()
            },
            cancel: { label: 'Cancel', onClick: () => {} }
        });
    };

    const performHideAllProducts = async (hide: boolean) => {
        try {
            const response = await fetch(`/api/admin/users/${userId}/products`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: hide ? 'hide_all' : 'unhide_all' }),
            });

            if (response.ok) {
                const data = await response.json();
                setMessage(data.message);
                fetchUser(); // Refresh user data to verify hidden status
            } else {
                setMessage('Failed to update products');
            }
        } catch (error) {
            setMessage('An error occurred');
        }
    };

    const handleHideAllProducts = (hide: boolean) => {
        toast(`Are you sure you want to ${hide ? 'HIDE' : 'UNHIDE'} all products for this artisan?`, {
            action: {
                label: 'Confirm',
                onClick: () => performHideAllProducts(hide)
            },
            cancel: { label: 'Cancel', onClick: () => {} }
        });
    };

    const performRemoveProduct = async (productId: string) => {
        try {
            const response = await fetch(`/api/admin/products/${productId}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                setMessage('Product deleted successfully');
                fetchUser();
            } else {
                setMessage('Failed to delete product');
            }
        } catch (error) {
            setMessage('An error occurred');
        }
    };

    const handleRemoveProduct = (productId: string) => {
        toast('Are you sure you want to permanently DELETE this product? This cannot be undone.', {
            action: {
                label: 'Delete',
                onClick: () => performRemoveProduct(productId)
            },
            cancel: { label: 'Cancel', onClick: () => {} }
        });
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

    if (error) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-4">
                <p className="text-red-600 mb-4">{error}</p>
                <Button onClick={() => router.back()}>Back to Users</Button>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-4">
                <p className="text-heritage-600 mb-4">User not found</p>
                <Button onClick={() => router.back()}>Back to Users</Button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-heritage-50 to-white pb-12">
            <div className="container mx-auto px-4 py-8 max-w-4xl">
                <div className="mb-8">
                    <Button variant="outline" onClick={() => router.back()}>
                        Back to Users
                    </Button>
                </div>

                {message && (
                    <div className="mb-4 p-3 bg-blue-50 border border-blue-200 text-blue-700 rounded-md">
                        {message}
                    </div>
                )}

                <div className="space-y-6">
                    <Card className={user.isBanned ? 'border-red-500 bg-red-50/10' : ''}>
                        <CardHeader>
                            <div className="flex justify-between items-start">
                                <div>
                                    <div className="flex items-center gap-3">
                                        <CardTitle className="text-2xl">{user.name}</CardTitle>
                                        {user.isBanned && <Badge variant="destructive">BANNED</Badge>}
                                        {user.isRestricted && <Badge variant="outline" className="text-orange-600 border-orange-600">RESTRICTED</Badge>}
                                        {user.warningCount > 0 && <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Warnings: {user.warningCount}/3</Badge>}
                                    </div>
                                    <p className="text-heritage-600 mt-1">{user.email}</p>
                                </div>
                                <div className="flex gap-2">
                                    <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
                                        {user.role}
                                    </Badge>
                                    <Badge variant={user.isActive ? 'default' : 'destructive'}>
                                        {user.isActive ? 'Active' : 'Inactive'}
                                    </Badge>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm font-medium text-heritage-600">Phone</p>
                                    <p>{user.phone || 'Not provided'}</p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-heritage-600">Joined</p>
                                    <p>{new Date(user.createdAt).toLocaleDateString()}</p>
                                </div>
                                {user.businessName && (
                                    <div>
                                        <p className="text-sm font-medium text-heritage-600">Business Name</p>
                                        <p>{user.businessName}</p>
                                    </div>
                                )}
                                {user.originState && (
                                    <div>
                                        <p className="text-sm font-medium text-heritage-600">Origin State</p>
                                        <p>{typeof user.originState === 'object' ? (user.originState as any).name : (user.originState || 'Not provided')}</p>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="overflow-hidden">
                        <div className="flex w-full border-b">
                            <Button
                                className="flex-1 rounded-none py-6 bg-yellow-500 hover:bg-yellow-600 text-black font-bold border-r disabled:opacity-50"
                                onClick={handleWarning}
                                disabled={user.isBanned || (user.warningCount || 0) >= 3}
                            >
                                {(user.warningCount || 0) === 0 ? 'WARN (3 LEFT)' :
                                    (user.warningCount || 0) === 1 ? 'WARN (2 LEFT)' :
                                        (user.warningCount || 0) === 2 ? 'WARN (1 LEFT)' : 'WARNED OUT'}
                            </Button>
                            <Button
                                className={`flex-1 rounded-none py-6 font-bold border-r ${user.isRestricted ? 'bg-green-500 hover:bg-green-600' : 'bg-orange-500 hover:bg-orange-600'} text-white`}
                                onClick={handleToggleRestriction}
                                disabled={user.isBanned}
                            >
                                {user.isRestricted ? 'UNRESTRICT' : 'RESTRICT'}
                            </Button>
                            <Button
                                className="flex-1 rounded-none py-6 bg-red-600 hover:bg-red-700 text-white font-bold disabled:opacity-50"
                                onClick={handleBan}
                                disabled={user.isBanned}
                            >
                                {user.isBanned ? 'BANNED' : 'BAN'}
                            </Button>
                        </div>
                        <CardHeader>
                            <CardTitle>Send Message to User</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSendMessage} className="space-y-4">
                                <div className="space-y-2">
                                    <textarea
                                        className="flex min-h-[150px] w-full rounded-md border border-heritage-300 bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-heritage-500 focus-visible:ring-offset-2"
                                        value={messageText}
                                        onChange={(e) => setMessageText(e.target.value)}
                                        placeholder="Type your message here..."
                                        required
                                    />
                                </div>

                                <div className="space-y-4">
                                    {imageFile && (
                                        <div className="relative inline-block">
                                            <img
                                                src={URL.createObjectURL(imageFile)}
                                                alt="Preview"
                                                className="h-32 w-32 object-cover rounded-lg border border-heritage-200"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setImageFile(null);
                                                    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
                                                    if (fileInput) fileInput.value = '';
                                                }}
                                                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 shadow-sm"
                                            >
                                                ×
                                            </button>
                                        </div>
                                    )}
                                    <div className="flex items-center gap-4">
                                        <div className="flex-1">
                                            <Input
                                                type="file"
                                                accept="image/*"
                                                onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                                                className="cursor-pointer"
                                            />
                                        </div>
                                        <Button type="submit" disabled={uploading || (!messageText.trim() && !imageFile)}>
                                            {uploading ? 'Uploading...' : 'Send Message'}
                                        </Button>
                                    </div>
                                </div>
                            </form>
                        </CardContent>
                    </Card>

                    {user.role === 'artisan' && user.products && (
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between">
                                <CardTitle>Artisan Products ({user.products.length})</CardTitle>
                                <div className="flex gap-2">
                                    <Button size="sm" variant="outline" onClick={() => handleHideAllProducts(!(user.products || []).every((p: any) => p.isHidden))}>
                                        {(user.products || []).every((p: any) => p.isHidden) ? 'Unhide All Posts' : 'Hide All Posts'}
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent>
                                {user.products.length === 0 ? (
                                    <p className="text-heritage-600">No products found for this artisan.</p>
                                ) : (
                                    <div className="overflow-x-auto">
                                        <table className="w-full">
                                            <thead>
                                                <tr className="border-b border-heritage-200">
                                                    <th className="text-left py-2 px-4">Product</th>
                                                    <th className="text-left py-2 px-4">Price</th>
                                                    <th className="text-left py-2 px-4">Status</th>
                                                    <th className="text-right py-2 px-4">Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {user.products.map((product: any) => (
                                                    <tr key={product._id} className="border-b border-heritage-100">
                                                        <td className="py-2 px-4">
                                                            <div className="font-medium">{product.name}</div>
                                                            <div className="text-xs text-heritage-600">{product.state?.name}</div>
                                                        </td>
                                                        <td className="py-2 px-4">₹{product.price}</td>
                                                        <td className="py-2 px-4">
                                                            <Badge variant={product.isActive ? 'outline' : 'destructive'}>
                                                                {product.isActive ? 'Active' : 'Inactive'}
                                                            </Badge>
                                                            {product.isHidden && <Badge variant="secondary" className="ml-1 bg-gray-200">Hidden</Badge>}
                                                        </td>
                                                        <td className="py-2 px-4 text-right">
                                                            <Button
                                                                size="sm"
                                                                variant="destructive"
                                                                onClick={() => handleRemoveProduct(product._id)}
                                                            >
                                                                Remove
                                                            </Button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    )}

                    {user.role === 'buyer' && user.orders && (
                        <Card>
                            <CardHeader>
                                <CardTitle>Buyer Orders ({user.orders.length})</CardTitle>
                            </CardHeader>
                            <CardContent>
                                {user.orders.length === 0 ? (
                                    <p className="text-heritage-600">No orders found for this buyer.</p>
                                ) : (
                                    <div className="space-y-4">
                                        {user.orders.map((order: any) => (
                                            <div key={order._id} className="border rounded-lg p-4 bg-heritage-50">
                                                <div className="flex justify-between items-start mb-2">
                                                    <div>
                                                        <p className="font-medium">Order #{order.orderNumber}</p>
                                                        <p className="text-sm text-heritage-600">{new Date(order.createdAt).toLocaleDateString()}</p>
                                                    </div>
                                                    <Badge>{order.status}</Badge>
                                                </div>
                                                <div className="text-sm space-y-1">
                                                    {order.items.map((item: any, idx: number) => (
                                                        <div key={idx} className="flex justify-between">
                                                            <span>{item.productName} x {item.quantity}</span>
                                                            <span>₹{item.price * item.quantity}</span>
                                                        </div>
                                                    ))}
                                                    <div className="border-t pt-1 mt-1 font-medium flex justify-between">
                                                        <span>Total</span>
                                                        <span>₹{order.total}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    );
}

'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function BuyerPreferences() {
    const { data: session, status, update } = useSession();
    const router = useRouter();
    const [preferences, setPreferences] = useState({
        originState: '',
        festivals: '',
        interests: '',
    });
    const [states, setStates] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/auth/login');
            return;
        }

        const fetchData = async () => {
            try {
                // Fetch States for dropdown
                const statesRes = await fetch('/api/states');
                const statesData = await statesRes.json();
                setStates(statesData.states || []);

                // Fetch User Profile Preferences
                const profileRes = await fetch('/api/user/profile');
                if (profileRes.ok) {
                    const profileData = await profileRes.json();
                    const user = profileData.user;
                    setPreferences({
                        originState: user.originState || '',
                        festivals: user.culturalPreferences?.festivals?.join(', ') || '',
                        interests: user.culturalPreferences?.interests?.join(', ') || '',
                    });
                }
            } catch (err) {
                console.error('Error fetching data:', err);
                setError('Failed to load settings');
            } finally {
                setLoading(false);
            }
        };

        if (status === 'authenticated') {
            fetchData();
        }
    }, [status, router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setMessage('');
        setError('');

        try {
            const response = await fetch('/api/user/profile', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(preferences),
            });

            if (response.ok) {
                // Trigger session refresh to sync names/roles etc if needed, 
                // though originState isn't currently in session JWT, it helps consistency.
                await update();
                setMessage('Preferences saved successfully!');
            } else {
                setError('Failed to save preferences');
            }
        } catch (err) {
            setError('An error occurred while saving');
        } finally {
            setSaving(false);
        }
    };

    if (status === 'loading' || loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-heritage-600 mx-auto mb-4"></div>
                    <p>Loading your preferences...</p>
                </div>
            </div>
        );
    }

    if (!session) {
        return null;
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-heritage-50 to-white">
            <div className="container mx-auto px-4 py-8 max-w-3xl">
                <h1 className="heading-section mb-8">Cultural Preferences</h1>

                {message && (
                    <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded-md">
                        {message}
                    </div>
                )}

                {error && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md">
                        {error}
                    </div>
                )}

                <Card>
                    <CardHeader>
                        <CardTitle>Personalize Your Experience</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Origin State</label>
                                <select
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    value={preferences.originState}
                                    onChange={(e) => setPreferences({ ...preferences, originState: e.target.value })}
                                >
                                    <option value="">Select your home state</option>
                                    {states.map((state) => (
                                        <option key={state._id} value={state._id}>
                                            {state.name}
                                        </option>
                                    ))}
                                </select>
                                <p className="text-xs text-heritage-600">
                                    Help us recommend products from your home state
                                </p>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Festivals You Celebrate</label>
                                <Input
                                    value={preferences.festivals}
                                    onChange={(e) => setPreferences({ ...preferences, festivals: e.target.value })}
                                    placeholder="e.g., Diwali, Pongal, Durga Puja (separate with commas)"
                                />
                                <p className="text-xs text-heritage-600">
                                    Get recommendations for festival-specific products
                                </p>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Interests</label>
                                <Input
                                    value={preferences.interests}
                                    onChange={(e) => setPreferences({ ...preferences, interests: e.target.value })}
                                    placeholder="e.g., Textiles, Pottery, Jewelry, Spices (separate with commas)"
                                />
                                <p className="text-xs text-heritage-600">
                                    What types of crafts and products interest you?
                                </p>
                            </div>

                            <Button type="submit" disabled={saving}>
                                {saving ? 'Saving...' : 'Save Preferences'}
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

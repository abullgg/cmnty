'use client';

import { useEffect, useState } from 'react';
import { fetchApi } from '@/lib/api';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

interface ClubResponse {
    id: number;
    name: string;
    description: string;
    city: string;
    category: string | null;
    hostId: number | null;
    hostName: string;
}

export default function ClubDetails() {
    const params = useParams();
    const router = useRouter();
    const { currentUser, isAuthenticated, isAdmin } = useAuth();
    const [club, setClub] = useState<ClubResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Delete confirmation
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);

    useEffect(() => {
        if (params.id) {
            loadClub(params.id as string);
        }
    }, [params.id]);

    const loadClub = async (id: string) => {
        try {
            const data = await fetchApi(`/clubs/${id}`);
            setClub(data);
        } catch (err: any) {
            setError(err.message || 'Failed to load club details');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteClub = async () => {
        if (!club) return;
        setDeleteLoading(true);
        try {
            await fetchApi(`/clubs/${club.id}`, { method: 'DELETE' });
            router.push('/clubs');
        } catch (err: any) {
            setError(err.message || 'Failed to delete club');
            setShowDeleteConfirm(false);
        } finally {
            setDeleteLoading(false);
        }
    };

    const isHost = club?.hostId != null && currentUser?.userId === club.hostId;
    const canManage = isHost || isAdmin;

    if (loading) return <div className="pt-[160px] pb-32 px-[64px] max-w-container-max mx-auto text-center">Loading club...</div>;
    if (error) return <div className="pt-[160px] pb-32 px-[64px] max-w-container-max mx-auto text-center text-error">{error}</div>;
    if (!club) return <div className="pt-[160px] pb-32 px-[64px] max-w-container-max mx-auto text-center">Club not found</div>;

    return (
        <main className="pt-[120px] pb-32 px-[20px] md:px-[64px] max-w-container-max mx-auto mt-24">
            {/* Hero Section */}
            <div className="relative w-full h-[350px] md:h-[450px] rounded-xl overflow-hidden mb-12 shadow-[0_10px_30px_rgba(0,0,0,0.04)]">
                <img alt="Club cover" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBIB3JJyRCbwUEA5mvyDhR7kJAb92X1IiYi4CVfBaN0UJxPSgdHaEe85MQ58aQIplMcc-K4IAO7aVfSD_T5Xz20J9xA_S4Yznn7ss20o_fpxZPshoG2H7d7sL2kL79b3Icq2F-xg787EPY3FwVK_n04TTQbIqLJNrhshXNBsWjMkXpBNrpR3CaggbSglBHxh0WJZlrY0zeVK0Q_bwGhhAHQWjQrlz1UVI6m2PCijAKiTy-e2xeZD2oSZd71F2ZFE5CR5W9JHZ678JU"/>
                <div className="absolute inset-0 bg-gradient-to-t from-on-background/80 via-on-background/20 to-transparent"></div>
                <div className="absolute bottom-0 left-0 w-full p-8 md:p-12 text-white">
                    <div className="flex gap-2 mb-4">
                        <span className="inline-block bg-primary-container text-black text-[14px] leading-[1.2] tracking-[0.05em] font-semibold px-4 py-1.5 rounded-full">{club.city || 'Global'}</span>
                        {club.category && <span className="inline-block bg-white/20 backdrop-blur-md text-white text-[14px] leading-[1.2] tracking-[0.05em] font-semibold px-4 py-1.5 rounded-full">{club.category}</span>}
                    </div>
                    <h1 className="text-[48px] md:text-[64px] leading-[1.1] tracking-[-0.04em] font-extrabold text-white mb-2 max-w-4xl">{club.name}</h1>
                </div>
            </div>

            {/* Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-[24px]">
                {/* Main Details Column */}
                <div className="lg:col-span-8 space-y-12">
                    {/* About Section */}
                    <div>
                        <h2 className="text-[40px] leading-[1.2] tracking-[-0.02em] font-bold mb-6">About</h2>
                        <div className="prose max-w-none text-[18px] leading-[1.6] font-normal text-on-surface-variant space-y-6">
                            <p className="whitespace-pre-wrap">{club.description}</p>
                        </div>
                    </div>

                    {/* Info Island */}
                    <div className="bg-surface rounded-xl p-8 border border-surface-variant shadow-[0_10px_30px_rgba(0,0,0,0.02)] flex flex-wrap gap-8">
                        <div className="flex items-start gap-4">
                            <span className="material-symbols-outlined text-primary text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>location_on</span>
                            <div>
                                <h3 className="text-[14px] leading-[1.2] tracking-[0.05em] font-semibold text-on-surface-variant mb-1">City</h3>
                                <p className="text-[24px] leading-[1.3] font-semibold text-on-surface">{club.city || 'Global'}</p>
                            </div>
                        </div>
                        {club.category && (
                            <div className="flex items-start gap-4">
                                <span className="material-symbols-outlined text-primary text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>category</span>
                                <div>
                                    <h3 className="text-[14px] leading-[1.2] tracking-[0.05em] font-semibold text-on-surface-variant mb-1">Category</h3>
                                    <p className="text-[24px] leading-[1.3] font-semibold text-on-surface">{club.category}</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Sidebar */}
                <div className="lg:col-span-4 space-y-8">
                    {/* Host Profile */}
                    <div className="bg-surface rounded-xl p-8 border border-surface-variant sticky top-32">
                        <h3 className="text-[14px] leading-[1.2] tracking-[0.05em] font-semibold text-on-surface-variant mb-6 uppercase tracking-wider">Founded By</h3>
                        <div className="flex items-center gap-4">
                            <div className="w-16 h-16 rounded-full bg-surface-container-high flex items-center justify-center border border-surface-variant">
                                <span className="material-symbols-outlined text-on-surface-variant text-[28px]">person</span>
                            </div>
                            <div>
                                <h4 className="text-[24px] leading-[1.3] font-semibold text-on-surface">{club.hostName}</h4>
                                <p className="text-[16px] leading-[1.6] font-normal text-on-surface-variant text-sm">Host</p>
                            </div>
                        </div>
                    </div>

                    {/* Host/Admin Controls */}
                    {canManage && (
                        <div className="bg-surface-container-low rounded-xl p-8 border border-surface-variant border-dashed">
                            <div className="flex items-center gap-3 mb-6">
                                <span className="material-symbols-outlined text-primary">admin_panel_settings</span>
                                <h3 className="text-[14px] leading-[1.2] tracking-[0.05em] font-semibold text-on-surface">
                                    {isHost ? 'Host Controls' : 'Admin Controls'}
                                </h3>
                            </div>
                            <div className="space-y-3">
                                {/* TODO: Club edit page doesn't exist yet, link to it when built */}
                                {!showDeleteConfirm ? (
                                    <button
                                        onClick={() => setShowDeleteConfirm(true)}
                                        className="w-full bg-white text-error text-[14px] leading-[1.2] tracking-[0.05em] font-semibold py-3 rounded-full border border-error/30 hover:bg-error-container transition-colors flex items-center justify-center gap-2"
                                    >
                                        <span className="material-symbols-outlined text-[18px]">delete</span>
                                        Delete Club
                                    </button>
                                ) : (
                                    <div className="bg-error-container rounded-lg p-4 space-y-3">
                                        <p className="text-on-error-container text-sm font-semibold text-center">Are you sure? This cannot be undone.</p>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={handleDeleteClub}
                                                disabled={deleteLoading}
                                                className="flex-1 bg-error text-white text-sm font-semibold py-2 rounded-full disabled:opacity-50"
                                            >
                                                {deleteLoading ? 'Deleting...' : 'Yes, Delete'}
                                            </button>
                                            <button
                                                onClick={() => setShowDeleteConfirm(false)}
                                                className="flex-1 bg-white text-on-surface text-sm font-semibold py-2 rounded-full border border-surface-variant"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Back to Clubs */}
                    <Link href="/clubs" className="flex items-center gap-2 text-on-surface-variant hover:text-on-surface transition-colors text-[14px] font-semibold">
                        <span className="material-symbols-outlined text-[18px]">arrow_back</span>
                        Back to all clubs
                    </Link>
                </div>
            </div>
        </main>
    );
}

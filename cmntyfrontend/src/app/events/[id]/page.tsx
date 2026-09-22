'use client';

import { useEffect, useState } from 'react';
import { fetchApi } from '@/lib/api';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

interface EventResponse {
    id: number;
    title: string;
    description: string;
    city: string;
    startTime: string;
    endTime: string;
    capacity: number;
    clubName: string | null;
    category: string | null;
    hostId: number | null;
    hostName: string;
    status: string;
}

interface RegistrationResponse {
    id: number;
    eventTitle: string;
    registeredAt: string;
    status: string;
    userName: string;
}

export default function EventDetails() {
    const params = useParams();
    const router = useRouter();
    const { currentUser, isAuthenticated, isAdmin } = useAuth();
    const [event, setEvent] = useState<EventResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Registration state
    const [myRegistration, setMyRegistration] = useState<RegistrationResponse | null>(null);
    const [registrationLoading, setRegistrationLoading] = useState(false);
    const [registrationError, setRegistrationError] = useState('');

    // Host: view registrations
    const [registrations, setRegistrations] = useState<RegistrationResponse[]>([]);
    const [showRegistrations, setShowRegistrations] = useState(false);
    const [registrationsLoading, setRegistrationsLoading] = useState(false);

    // Delete confirmation
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);

    useEffect(() => {
        if (params.id) {
            loadEvent(params.id as string);
        }
    }, [params.id]);

    useEffect(() => {
        // Check registration status when authenticated
        if (params.id && isAuthenticated) {
            checkMyRegistration(params.id as string);
        }
    }, [params.id, isAuthenticated]);

    const loadEvent = async (id: string) => {
        try {
            const data = await fetchApi(`/events/${id}`);
            setEvent(data);
        } catch (err: any) {
            setError(err.message || 'Failed to load event details');
        } finally {
            setLoading(false);
        }
    };

    const checkMyRegistration = async (id: string) => {
        try {
            const data = await fetchApi(`/events/${id}/my-registration`);
            setMyRegistration(data);
        } catch {
            // Not registered or endpoint error — that's fine
            setMyRegistration(null);
        }
    };

    const handleRegister = async () => {
        if (!event) return;
        setRegistrationLoading(true);
        setRegistrationError('');
        try {
            await fetchApi(`/events/${event.id}/register`, { method: 'POST' });
            await checkMyRegistration(String(event.id));
        } catch (err: any) {
            setRegistrationError(err.message || 'Failed to register');
        } finally {
            setRegistrationLoading(false);
        }
    };

    const handleCancelRegistration = async () => {
        if (!event) return;
        setRegistrationLoading(true);
        setRegistrationError('');
        try {
            await fetchApi(`/events/${event.id}/register`, { method: 'DELETE' });
            setMyRegistration(null);
        } catch (err: any) {
            setRegistrationError(err.message || 'Failed to cancel registration');
        } finally {
            setRegistrationLoading(false);
        }
    };

    const handleDeleteEvent = async () => {
        if (!event) return;
        setDeleteLoading(true);
        try {
            await fetchApi(`/events/${event.id}`, { method: 'DELETE' });
            router.push('/events');
        } catch (err: any) {
            setError(err.message || 'Failed to delete event');
            setShowDeleteConfirm(false);
        } finally {
            setDeleteLoading(false);
        }
    };

    const loadRegistrations = async () => {
        if (!event) return;
        setRegistrationsLoading(true);
        try {
            const data = await fetchApi(`/events/${event.id}/registrations`);
            setRegistrations(data || []);
            setShowRegistrations(true);
        } catch (err: any) {
            setRegistrationError(err.message || 'Failed to load registrations');
        } finally {
            setRegistrationsLoading(false);
        }
    };

    const formatDateTime = (dateString: string) => {
        const d = new Date(dateString);
        return {
            date: d.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
            time: d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
        };
    };

    const isHost = event?.hostId != null && currentUser?.userId === event.hostId;
    const canManage = isHost || isAdmin;

    if (loading) return <div className="pt-[160px] pb-32 px-[64px] max-w-container-max mx-auto text-center">Loading event...</div>;
    if (error) return <div className="pt-[160px] pb-32 px-[64px] max-w-container-max mx-auto text-center text-error">{error}</div>;
    if (!event) return <div className="pt-[160px] pb-32 px-[64px] max-w-container-max mx-auto text-center">Event not found</div>;

    const start = formatDateTime(event.startTime);
    const end = formatDateTime(event.endTime);

    const isRegistered = myRegistration != null && myRegistration.status === 'CONFIRMED';

    return (
        <main className="pt-[120px] pb-32 px-[20px] md:px-[64px] max-w-container-max mx-auto mt-24">
            {/* Hero Section */}
            <div className="relative w-full h-[400px] md:h-[500px] rounded-xl overflow-hidden mb-12 shadow-[0_10px_30px_rgba(0,0,0,0.04)]">
                <img alt="Event cover" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDFBA56NwjDIrgNPt_w3nItEExLiM2UhrXPJKJuNHTuwM2DXjtlhGWMQDKZkSby3SpdfPpv9J1EL5ZNYJw_UqX-pxjenUesAJvzzKkZx9fMar-wgJK9myqg_CDCmRS5xMiawz_KVKMXXf9OxR6KnPWqjJIELeTEjiU72nQIJQgirpr_IXAz3DdruWwJhRRh4HUHmDJUUoY4YrCLaKgucKKoZLkegckmV7i9EPjHR2FXVoLJuHEd50JIgPvffQ_0gj5H60pQYUBX6VQ"/>
                <div className="absolute inset-0 bg-gradient-to-t from-on-background/80 via-on-background/20 to-transparent"></div>
                <div className="absolute bottom-0 left-0 w-full p-8 md:p-12 text-white">
                    <span className="inline-block bg-primary-container text-black text-[14px] leading-[1.2] tracking-[0.05em] font-semibold px-4 py-1.5 rounded-full mb-4">{event.clubName || 'General Event'}</span>
                    {event.category && <span className="inline-block bg-white/20 backdrop-blur-md text-white text-[14px] leading-[1.2] tracking-[0.05em] font-semibold px-4 py-1.5 rounded-full mb-4 ml-2">{event.category}</span>}
                    <h1 className="text-[64px] leading-[1.1] tracking-[-0.04em] font-extrabold text-white mb-2 max-w-4xl">{event.title}</h1>
                    <p className="text-[18px] leading-[1.6] font-normal text-surface-container max-w-2xl opacity-90 line-clamp-2">{event.description}</p>
                </div>
            </div>

            {/* Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-[24px]">
                {/* Main Details Column */}
                <div className="lg:col-span-8 space-y-12">
                    {/* Info Island */}
                    <div className="bg-surface rounded-xl p-8 border border-surface-variant shadow-[0_10px_30px_rgba(0,0,0,0.02)] flex flex-wrap gap-8">
                        <div className="flex items-start gap-4">
                            <span className="material-symbols-outlined text-primary text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>calendar_today</span>
                            <div>
                                <h3 className="text-[14px] leading-[1.2] tracking-[0.05em] font-semibold text-on-surface-variant mb-1">Date</h3>
                                <p className="text-[24px] leading-[1.3] font-semibold text-on-surface">{start.date}</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-4">
                            <span className="material-symbols-outlined text-primary text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>schedule</span>
                            <div>
                                <h3 className="text-[14px] leading-[1.2] tracking-[0.05em] font-semibold text-on-surface-variant mb-1">Time</h3>
                                <p className="text-[24px] leading-[1.3] font-semibold text-on-surface">{start.time} - {end.time}</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-4">
                            <span className="material-symbols-outlined text-primary text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>location_on</span>
                            <div>
                                <h3 className="text-[14px] leading-[1.2] tracking-[0.05em] font-semibold text-on-surface-variant mb-1">Location</h3>
                                <p className="text-[24px] leading-[1.3] font-semibold text-on-surface">{event.city}</p>
                            </div>
                        </div>
                    </div>

                    {/* About Section */}
                    <div>
                        <h2 className="text-[40px] leading-[1.2] tracking-[-0.02em] font-bold mb-6">About the Event</h2>
                        <div className="prose max-w-none text-[18px] leading-[1.6] font-normal text-on-surface-variant space-y-6">
                            <p className="whitespace-pre-wrap">{event.description}</p>
                        </div>
                    </div>

                    {/* Registrations List (host/admin only, toggled) */}
                    {canManage && showRegistrations && (
                        <div className="bg-surface rounded-xl p-8 border border-surface-variant">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-[24px] leading-[1.3] font-semibold">Registrations ({registrations.length})</h3>
                                <button onClick={() => setShowRegistrations(false)} className="text-on-surface-variant hover:text-on-surface transition-colors">
                                    <span className="material-symbols-outlined">close</span>
                                </button>
                            </div>
                            {registrations.length === 0 ? (
                                <p className="text-on-surface-variant text-[16px]">No registrations yet.</p>
                            ) : (
                                <div className="space-y-3">
                                    {registrations.map((reg) => (
                                        <div key={reg.id} className="flex items-center justify-between py-3 px-4 bg-surface-container-low rounded-lg">
                                            <div>
                                                <span className="font-semibold text-on-surface text-[14px]">{reg.userName}</span>
                                                <span className="text-on-surface-variant text-[12px] ml-3">
                                                    {new Date(reg.registeredAt).toLocaleDateString()}
                                                </span>
                                            </div>
                                            <span className={`text-[12px] font-semibold px-3 py-1 rounded-full ${
                                                reg.status === 'CONFIRMED' 
                                                    ? 'bg-primary-container/20 text-primary' 
                                                    : 'bg-error-container text-on-error-container'
                                            }`}>
                                                {reg.status}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Map Section */}
                    <div className="rounded-xl overflow-hidden h-[300px] border border-surface-variant">
                        <img alt="Event location map" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAlruHyvWlDs3F6EBCMpijhIGkD8s2ZvknvFE3O7nTBvdbyvtvLi5G_m-3he7WgUC_bO-39rGZohx1GmWN5c6sljwTDDuSmCRnrScuHozuDaJVCuu3tQG0lEr9ha8Ufxsz7wXhIOXqhUangEuT5-0dJ-NKAEShODUmO4X-0gSKwGCgK2H6JNwWCy9-CaDjvGlfBG-LOy_Yk3pEIaxRcofTO-bfdfy8GJ2PjNzC-LDsPm-tAt7EqlZRWWFb5UTvrBOEDMqcU1ijxYb8"/>
                    </div>
                </div>

                {/* Sidebar / Action Column */}
                <div className="lg:col-span-4 space-y-8">
                    {/* Registration Card */}
                    <div className="bg-surface rounded-xl p-8 border border-surface-variant shadow-[0_10px_30px_rgba(0,0,0,0.04)] sticky top-32">
                        <h3 className="text-[24px] leading-[1.3] font-semibold mb-2">Registration</h3>
                        <p className="text-[16px] leading-[1.6] font-normal text-on-surface-variant mb-6">{event.capacity ? `Limited to ${event.capacity} spots.` : 'Spots available.'}</p>
                        <div className="flex justify-between items-center mb-8 pb-6 border-b border-surface-variant">
                            <span className="text-[14px] leading-[1.2] tracking-[0.05em] font-semibold text-on-surface-variant">General Admission</span>
                            <span className="text-[24px] leading-[1.3] font-semibold text-on-surface">Free</span>
                        </div>

                        {registrationError && (
                            <div className="bg-error-container text-on-error-container p-3 rounded-lg mb-4 text-sm">{registrationError}</div>
                        )}

                        {event.status === 'CANCELLED' ? (
                            <button disabled className="w-full bg-error-container text-on-error-container text-[14px] leading-[1.2] tracking-[0.05em] font-semibold py-4 rounded-full flex items-center justify-center gap-2 mb-4">
                                Event Cancelled
                            </button>
                        ) : !isAuthenticated ? (
                            <Link href="/login" className="w-full bg-primary-container text-on-primary-fixed text-[14px] leading-[1.2] tracking-[0.05em] font-semibold py-4 rounded-full hover:bg-primary-fixed transition-colors flex items-center justify-center gap-2 mb-4">
                                Sign in to Register
                                <span className="material-symbols-outlined text-xl">arrow_forward</span>
                            </Link>
                        ) : isRegistered ? (
                            <div className="space-y-3 mb-4">
                                <div className="w-full bg-primary-container/20 text-primary text-[14px] leading-[1.2] tracking-[0.05em] font-semibold py-4 rounded-full flex items-center justify-center gap-2">
                                    <span className="material-symbols-outlined text-xl">check_circle</span>
                                    You're Registered
                                </div>
                                <button
                                    onClick={handleCancelRegistration}
                                    disabled={registrationLoading}
                                    className="w-full bg-surface text-on-surface-variant text-[14px] leading-[1.2] tracking-[0.05em] font-semibold py-3 rounded-full border border-surface-variant hover:border-error hover:text-error transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                                >
                                    {registrationLoading ? 'Cancelling...' : 'Cancel Registration'}
                                </button>
                            </div>
                        ) : (
                            <button
                                onClick={handleRegister}
                                disabled={registrationLoading}
                                className="w-full bg-primary-container text-on-primary-fixed text-[14px] leading-[1.2] tracking-[0.05em] font-semibold py-4 rounded-full hover:bg-primary-fixed transition-colors flex items-center justify-center gap-2 mb-4 disabled:opacity-50"
                            >
                                {registrationLoading ? 'Registering...' : 'Register Now'}
                                <span className="material-symbols-outlined text-xl">arrow_forward</span>
                            </button>
                        )}

                        <p className="text-center text-[16px] leading-[1.6] font-normal text-on-surface-variant text-sm">Status: {event.status}</p>
                    </div>

                    {/* Host Profile */}
                    <div className="bg-surface rounded-xl p-8 border border-surface-variant">
                        <h3 className="text-[14px] leading-[1.2] tracking-[0.05em] font-semibold text-on-surface-variant mb-6 uppercase tracking-wider">Hosted By</h3>
                        <div className="flex items-center gap-4">
                            <img alt="Host avatar" className="w-16 h-16 rounded-full object-cover border border-surface-variant" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDJ-WcZKrJiRABpJP8YqfkvEakZmYZCOuP1txbUhGhko22fmyL_VjKUNZgqyn1aoTh5KSOhR8XzWWZSXU87z4rlv-6AxWikS4xzoCVYQ18OaEsNcTNJj0of2dJFr6hwfaLmZOO9u96i9c2HL9F080Oj_Hf6nq2ok484UPxUFVUDoPbpZwC-W3qMm6YRKVaf3rTGLQy2jQoEti_6iypFBsSzqRNqDgd3Lu1-faI58vtjs7_yKGWGA8WFtdqw4GcBopFtt3jk3-ZPMj0"/>
                            <div>
                                <h4 className="text-[24px] leading-[1.3] font-semibold text-base text-on-surface">{event.hostName}</h4>
                                <p className="text-[16px] leading-[1.6] font-normal text-on-surface-variant text-sm">Host</p>
                            </div>
                        </div>
                    </div>
                    
                    {/* Host Controls — only shown to host or admin */}
                    {canManage && (
                        <div className="bg-surface-container-low rounded-xl p-8 border border-surface-variant border-dashed">
                            <div className="flex items-center gap-3 mb-6">
                                <span className="material-symbols-outlined text-primary">admin_panel_settings</span>
                                <h3 className="text-[14px] leading-[1.2] tracking-[0.05em] font-semibold text-on-surface">
                                    {isHost ? 'Host Controls' : 'Admin Controls'}
                                </h3>
                            </div>
                            <div className="space-y-3">
                                <Link href={`/events/${event.id}/edit`} className="w-full bg-white text-on-surface text-[14px] leading-[1.2] tracking-[0.05em] font-semibold py-3 rounded-full border border-surface-variant hover:border-primary transition-colors flex items-center justify-center gap-2">
                                    <span className="material-symbols-outlined text-[18px]">edit</span>
                                    Edit Event Details
                                </Link>
                                <button
                                    onClick={() => loadRegistrations()}
                                    disabled={registrationsLoading}
                                    className="w-full bg-white text-on-surface text-[14px] leading-[1.2] tracking-[0.05em] font-semibold py-3 rounded-full border border-surface-variant hover:border-primary transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                                >
                                    <span className="material-symbols-outlined text-[18px]">group</span>
                                    {registrationsLoading ? 'Loading...' : 'View Registrations'}
                                </button>
                                {!showDeleteConfirm ? (
                                    <button
                                        onClick={() => setShowDeleteConfirm(true)}
                                        className="w-full bg-white text-error text-[14px] leading-[1.2] tracking-[0.05em] font-semibold py-3 rounded-full border border-error/30 hover:bg-error-container transition-colors flex items-center justify-center gap-2"
                                    >
                                        <span className="material-symbols-outlined text-[18px]">delete</span>
                                        Delete Event
                                    </button>
                                ) : (
                                    <div className="bg-error-container rounded-lg p-4 space-y-3">
                                        <p className="text-on-error-container text-sm font-semibold text-center">Are you sure? This cannot be undone.</p>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={handleDeleteEvent}
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
                </div>
            </div>
        </main>
    );
}

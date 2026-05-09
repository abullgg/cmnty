'use client';

import { useEffect, useState } from 'react';
import { fetchApi } from '@/lib/api';
import { useParams, useRouter } from 'next/navigation';

export default function EditEvent() {
    const params = useParams();
    const router = useRouter();
    
    const [title, setTitle] = useState('');
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [address, setAddress] = useState('');
    const [description, setDescription] = useState('');
    const [city, setCity] = useState(''); // adding city since API needs it

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (params.id) {
            loadEvent(params.id as string);
        }
    }, [params.id]);

    const loadEvent = async (id: string) => {
        try {
            const data = await fetchApi(`/events/${id}`);
            setTitle(data.title || '');
            setDescription(data.description || '');
            setCity(data.city || '');
            setAddress(data.address || '');
            
            if (data.startTime) {
                const d = new Date(data.startTime);
                setDate(d.toISOString().split('T')[0]);
                setTime(d.toTimeString().slice(0, 5));
            }
        } catch (err: any) {
            setError(err.message || 'Failed to load event details');
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        setError('');

        try {
            const startDateTime = new Date(`${date}T${time}`);
            const endDateTime = new Date(startDateTime.getTime() + 2 * 60 * 60 * 1000);

            await fetchApi(`/events/${params.id}`, {
                method: 'PUT',
                body: JSON.stringify({
                    title,
                    description,
                    city,
                    address,
                    startTime: startDateTime.toISOString(),
                    endTime: endDateTime.toISOString(),
                })
            });
            router.push(`/events/${params.id}`);
        } catch (err: any) {
            setError(err.message || 'Failed to update event');
            setSaving(false);
        }
    };

    const handleCancelEvent = async () => {
        if (!confirm('Are you sure you want to cancel this event?')) return;
        setSaving(true);
        try {
            await fetchApi(`/events/${params.id}/cancel`, { method: 'PATCH' });
            router.push(`/events/${params.id}`);
        } catch (err: any) {
            setError(err.message || 'Failed to cancel event');
            setSaving(false);
        }
    };

    if (loading) return <div className="pt-32 pb-24 text-center">Loading event...</div>;

    return (
        <main className="max-w-[1280px] mx-auto px-[20px] md:px-[64px] pt-32 pb-24">
            <div className="mb-12">
                <h1 className="text-[64px] leading-[1.1] tracking-[-0.04em] font-extrabold mb-4">Edit Event</h1>
                <p className="text-[18px] leading-[1.6] font-normal text-on-surface-variant max-w-2xl">Refine your event details. Ensure clarity and accuracy for your community members.</p>
            </div>
            
            {error && <div className="bg-error-container text-on-error-container p-4 rounded-xl mb-8">{error}</div>}

            <form className="grid grid-cols-1 md:grid-cols-12 gap-[24px]">
                {/* Left Column: Core Details */}
                <div className="md:col-span-8 space-y-8">
                    <section className="bg-surface/70 backdrop-blur-xl border border-white/20 p-8 rounded-xl shadow-sm">
                        <h2 className="text-[24px] leading-[1.3] font-semibold mb-6 border-b border-outline-variant pb-4">Basic Info</h2>
                        <div className="space-y-6">
                            <div>
                                <label className="block text-[14px] leading-[1.2] tracking-[0.05em] font-semibold text-on-surface-variant mb-2" htmlFor="event-title">Event Title</label>
                                <input 
                                    id="event-title" 
                                    type="text" 
                                    value={title}
                                    onChange={e => setTitle(e.target.value)}
                                    className="w-full rounded-full bg-surface-container-low border-none focus:ring-2 focus:ring-primary-container px-6 py-4 text-[16px] leading-[1.6] font-normal text-on-surface transition-shadow" 
                                />
                            </div>
                            <div>
                                <label className="block text-[14px] leading-[1.2] tracking-[0.05em] font-semibold text-on-surface-variant mb-2" htmlFor="event-desc">Description</label>
                                <textarea 
                                    id="event-desc" 
                                    rows={5}
                                    value={description}
                                    onChange={e => setDescription(e.target.value)}
                                    className="w-full rounded-xl bg-surface-container-low border-none focus:ring-2 focus:ring-primary-container px-6 py-4 text-[16px] leading-[1.6] font-normal text-on-surface transition-shadow resize-none"
                                ></textarea>
                            </div>
                        </div>
                    </section>
                    <section className="bg-surface/70 backdrop-blur-xl border border-white/20 p-8 rounded-xl shadow-sm">
                        <h2 className="text-[24px] leading-[1.3] font-semibold mb-6 border-b border-outline-variant pb-4">Logistics</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-[14px] leading-[1.2] tracking-[0.05em] font-semibold text-on-surface-variant mb-2" htmlFor="event-date">Date</label>
                                <input 
                                    id="event-date" 
                                    type="date" 
                                    value={date}
                                    onChange={e => setDate(e.target.value)}
                                    className="w-full rounded-full bg-surface-container-low border-none focus:ring-2 focus:ring-primary-container px-6 py-4 text-[16px] leading-[1.6] font-normal text-on-surface transition-shadow" 
                                />
                            </div>
                            <div>
                                <label className="block text-[14px] leading-[1.2] tracking-[0.05em] font-semibold text-on-surface-variant mb-2" htmlFor="event-time">Time</label>
                                <input 
                                    id="event-time" 
                                    type="time" 
                                    value={time}
                                    onChange={e => setTime(e.target.value)}
                                    className="w-full rounded-full bg-surface-container-low border-none focus:ring-2 focus:ring-primary-container px-6 py-4 text-[16px] leading-[1.6] font-normal text-on-surface transition-shadow" 
                                />
                            </div>
                            <div className="sm:col-span-2">
                                <label className="block text-[14px] leading-[1.2] tracking-[0.05em] font-semibold text-on-surface-variant mb-2" htmlFor="event-city">City</label>
                                <input 
                                    id="event-city" 
                                    type="text" 
                                    value={city}
                                    onChange={e => setCity(e.target.value)}
                                    className="w-full rounded-full bg-surface-container-low border-none focus:ring-2 focus:ring-primary-container px-6 py-4 text-[16px] leading-[1.6] font-normal text-on-surface transition-shadow" 
                                />
                            </div>
                            <div className="sm:col-span-2">
                                <label className="block text-[14px] leading-[1.2] tracking-[0.05em] font-semibold text-on-surface-variant mb-2" htmlFor="event-location">Venue Address</label>
                                <input 
                                    id="event-location" 
                                    type="text" 
                                    value={address}
                                    onChange={e => setAddress(e.target.value)}
                                    className="w-full rounded-full bg-surface-container-low border-none focus:ring-2 focus:ring-primary-container px-6 py-4 text-[16px] leading-[1.6] font-normal text-on-surface transition-shadow" 
                                />
                            </div>
                        </div>
                    </section>
                </div>

                {/* Right Column: Media & Actions */}
                <div className="md:col-span-4 space-y-8">
                    <section className="bg-surface/70 backdrop-blur-xl border border-white/20 p-8 rounded-xl shadow-sm">
                        <h2 className="text-[24px] leading-[1.3] font-semibold mb-6 border-b border-outline-variant pb-4">Cover Image</h2>
                        <div className="relative w-full aspect-video rounded-lg overflow-hidden mb-4 group cursor-pointer border border-outline-variant">
                            <img alt="Event cover image" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBXAlWHkhNP2cRsrMPjGpwQWx4UAM5zdJhALg7NcHjHuWXfv3WP8lOL625GlIY34sy0_vAIQeQ604_4XFyUQXaVGIxmPZBbnX4XVPyks0d2N_txuDZF1p5lRZRhgzthohFeoVUBQVq-ejac1tcCh7VlJ1Wygs2kqhdq9xArxEDvLYzVKmQi5kCdmrM16uRtLlCIMl7dJaI6o_W6qzMLAhr-U5KNFSK8JNKg5fz4w4Vb1SPCyb-orhAzDx5tIcwv-mJNQiUCQ1fsuDY"/>
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <span className="bg-surface text-on-surface px-4 py-2 rounded-full text-[14px] leading-[1.2] tracking-[0.05em] font-semibold flex items-center gap-2">
                                    <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>upload</span> Replace
                                </span>
                            </div>
                        </div>
                        <p className="text-[16px] leading-[1.6] font-normal text-on-surface-variant text-sm">Recommended size: 1920x1080px. Max file size: 5MB.</p>
                    </section>
                    
                    {/* Actions */}
                    <div className="flex flex-col gap-4 mt-8">
                        <button 
                            type="button" 
                            onClick={handleSave}
                            disabled={saving}
                            className="w-full py-4 rounded-full bg-primary-container text-on-primary-fixed text-[14px] leading-[1.2] tracking-[0.05em] font-semibold hover:bg-primary-fixed transition-colors disabled:opacity-50"
                        >
                            {saving ? 'Saving...' : 'Save Changes'}
                        </button>
                        <button 
                            type="button" 
                            onClick={() => router.back()}
                            disabled={saving}
                            className="w-full py-4 rounded-full bg-transparent border-2 border-outline-variant text-on-surface text-[14px] leading-[1.2] tracking-[0.05em] font-semibold hover:bg-surface-container-low transition-colors disabled:opacity-50"
                        >
                            Cancel
                        </button>
                        <button 
                            type="button" 
                            onClick={handleCancelEvent}
                            disabled={saving}
                            className="w-full py-4 rounded-full bg-transparent text-error text-[14px] leading-[1.2] tracking-[0.05em] font-semibold hover:bg-error-container transition-colors mt-4 disabled:opacity-50"
                        >
                            Cancel Event
                        </button>
                    </div>
                </div>
            </form>
        </main>
    );
}

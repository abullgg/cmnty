'use client';

import { useState } from 'react';
import { fetchApi } from '@/lib/api';
import { useRouter } from 'next/navigation';

export default function CreateEvent() {
    const router = useRouter();
    const [title, setTitle] = useState('');
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [city, setCity] = useState('');
    const [address, setAddress] = useState('');
    const [capacity, setCapacity] = useState<number | ''>('');
    const [description, setDescription] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            // Combine date and time
            const startDateTime = new Date(`${date}T${time}`);
            // default end time to 2 hours later
            const endDateTime = new Date(startDateTime.getTime() + 2 * 60 * 60 * 1000);

            await fetchApi('/events', {
                method: 'POST',
                body: JSON.stringify({
                    title,
                    description,
                    city,
                    address,
                    startTime: startDateTime.toISOString(),
                    endTime: endDateTime.toISOString(),
                    capacity: capacity === '' ? null : Number(capacity),
                })
            });
            router.push('/events');
        } catch (err: any) {
            setError(err.message || 'Failed to create event');
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="flex-grow pt-[120px] pb-[80px] px-[20px] md:px-[64px] max-w-[1280px] mx-auto w-full flex flex-col lg:flex-row gap-[24px]">
            {/* Header / Context */}
            <div className="lg:w-1/3 flex flex-col gap-2 sticky top-[120px] h-fit">
                <div className="inline-flex items-center gap-2 text-primary bg-primary-container/10 px-4 py-1.5 rounded-full w-fit mb-4">
                    <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>add_circle</span>
                    <span className="text-[14px] leading-[1.2] tracking-[0.05em] font-semibold">Host Panel</span>
                </div>
                <h1 className="text-[40px] md:text-[64px] leading-[1.1] tracking-[-0.04em] font-extrabold text-on-surface">Initialize Event</h1>
                <p className="text-[18px] leading-[1.6] font-normal text-on-surface-variant mt-4">Create a focused gathering for your community. Precision over volume.</p>
                
                <div className="mt-8 hidden lg:block">
                    <div className="w-full h-48 rounded-2xl bg-surface-container-low overflow-hidden relative">
                        <img alt="Event preview placeholder" className="w-full h-full object-cover opacity-80" src="https://lh3.googleusercontent.com/aida-public/AB6AXuC_2Sf3FQrR73fSaNxPWS1FtzcKmqixO_MyE0dDZ6iZMVaS30ByhYJSBGibKiQZarM5b_f1e_QKtXuuhqTblVnK3wTEtJJAby1gR7qAKq1S1QU6zgxztt5sLrau_yl2ja3UdDmYvilvByhHNH3zddYbWYREnTreoxEm3EM5ATL8fd2u3qZYPvwBU9JkTLbl74LOaF6NfNCe3KwPmjD---hSRUG8CIkRIOMM0N6TSTh5JvA2nBSpijs2xWYhfAG_fcMq85QVltdlGDs"/>
                        <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent flex items-end p-4">
                            <span className="text-[14px] leading-[1.2] tracking-[0.05em] font-semibold text-on-surface">Preview Canvas</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Form Canvas */}
            <div className="lg:w-2/3">
                <div className="bg-surface/70 backdrop-blur-xl border border-white/20 shadow-[0_10px_30px_rgba(0,0,0,0.04)] rounded-2xl p-6 md:p-12 relative overflow-hidden">
                    {/* Decorative Accent */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary-container rounded-full blur-[100px] opacity-20 pointer-events-none"></div>
                    
                    {error && <div className="relative z-10 bg-error-container text-on-error-container p-3 rounded-lg mb-[24px] text-sm">{error}</div>}

                    <form onSubmit={handleSubmit} className="flex flex-col gap-8 relative z-10">
                        {/* Section: Essentials */}
                        <div className="space-y-6">
                            <h2 className="text-[14px] leading-[1.2] tracking-[0.05em] font-semibold text-tertiary tracking-widest uppercase mb-4">Core Attributes</h2>
                            <div>
                                <label className="sr-only" htmlFor="event-title">Event Title</label>
                                <input 
                                    id="event-title" 
                                    required 
                                    type="text" 
                                    value={title}
                                    onChange={e => setTitle(e.target.value)}
                                    className="w-full border-0 border-b-2 border-surface-variant focus:border-primary focus:ring-0 px-4 py-4 text-[24px] leading-[1.3] font-semibold placeholder:text-surface-variant rounded-t-xl transition-colors bg-surface-container-low/50" 
                                    placeholder="Event Designation" 
                                />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="relative">
                                    <label className="block text-[14px] leading-[1.2] tracking-[0.05em] font-semibold text-on-surface-variant mb-2 ml-4" htmlFor="event-date">Date</label>
                                    <div className="relative flex items-center">
                                        <span className="material-symbols-outlined absolute left-4 text-on-surface-variant pointer-events-none">calendar_today</span>
                                        <input 
                                            id="event-date" 
                                            required 
                                            type="date" 
                                            value={date}
                                            onChange={e => setDate(e.target.value)}
                                            className="w-full bg-[#F8F9FA] border-0 focus:ring-2 focus:ring-primary-container rounded-full py-3 pl-12 pr-4 text-[16px] leading-[1.6] font-normal text-on-surface" 
                                        />
                                    </div>
                                </div>
                                <div className="relative">
                                    <label className="block text-[14px] leading-[1.2] tracking-[0.05em] font-semibold text-on-surface-variant mb-2 ml-4" htmlFor="event-time">Time</label>
                                    <div className="relative flex items-center">
                                        <span className="material-symbols-outlined absolute left-4 text-on-surface-variant pointer-events-none">schedule</span>
                                        <input 
                                            id="event-time" 
                                            required 
                                            type="time" 
                                            value={time}
                                            onChange={e => setTime(e.target.value)}
                                            className="w-full bg-[#F8F9FA] border-0 focus:ring-2 focus:ring-primary-container rounded-full py-3 pl-12 pr-4 text-[16px] leading-[1.6] font-normal text-on-surface" 
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="h-px w-full bg-surface-variant my-2"></div>

                        {/* Section: Logistics */}
                        <div className="space-y-6">
                            <h2 className="text-[14px] leading-[1.2] tracking-[0.05em] font-semibold text-tertiary tracking-widest uppercase mb-4">Logistics</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="relative">
                                    <label className="block text-[14px] leading-[1.2] tracking-[0.05em] font-semibold text-on-surface-variant mb-2 ml-4" htmlFor="event-city">City</label>
                                    <div className="relative flex items-center">
                                        <span className="material-symbols-outlined absolute left-4 text-on-surface-variant pointer-events-none">location_city</span>
                                        <input 
                                            id="event-city" 
                                            required 
                                            type="text" 
                                            value={city}
                                            onChange={e => setCity(e.target.value)}
                                            className="w-full bg-[#F8F9FA] border-0 focus:ring-2 focus:ring-primary-container rounded-full py-3 pl-12 pr-4 text-[16px] leading-[1.6] font-normal text-on-surface placeholder:text-tertiary" 
                                            placeholder="e.g., New York" 
                                        />
                                    </div>
                                </div>
                                <div className="relative">
                                    <label className="block text-[14px] leading-[1.2] tracking-[0.05em] font-semibold text-on-surface-variant mb-2 ml-4" htmlFor="event-address">Venue Address</label>
                                    <div className="relative flex items-center">
                                        <span className="material-symbols-outlined absolute left-4 text-on-surface-variant pointer-events-none">location_on</span>
                                        <input 
                                            id="event-address" 
                                            required 
                                            type="text" 
                                            value={address}
                                            onChange={e => setAddress(e.target.value)}
                                            className="w-full bg-[#F8F9FA] border-0 focus:ring-2 focus:ring-primary-container rounded-full py-3 pl-12 pr-4 text-[16px] leading-[1.6] font-normal text-on-surface placeholder:text-tertiary" 
                                            placeholder="e.g., The Glasshouse" 
                                        />
                                    </div>
                                </div>
                            </div>
                            
                            <div className="relative w-full md:w-1/2">
                                <label className="block text-[14px] leading-[1.2] tracking-[0.05em] font-semibold text-on-surface-variant mb-2 ml-4" htmlFor="event-capacity">Maximum Capacity</label>
                                <div className="relative flex items-center">
                                    <span className="material-symbols-outlined absolute left-4 text-on-surface-variant pointer-events-none">groups</span>
                                    <input 
                                        id="event-capacity" 
                                        type="number" 
                                        min="1" 
                                        value={capacity}
                                        onChange={e => setCapacity(e.target.value === '' ? '' : Number(e.target.value))}
                                        className="w-full bg-[#F8F9FA] border-0 focus:ring-2 focus:ring-primary-container rounded-full py-3 pl-12 pr-4 text-[16px] leading-[1.6] font-normal text-on-surface placeholder:text-tertiary" 
                                        placeholder="Unlimited if empty" 
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="h-px w-full bg-surface-variant my-2"></div>

                        {/* Section: Details */}
                        <div className="space-y-6">
                            <h2 className="text-[14px] leading-[1.2] tracking-[0.05em] font-semibold text-tertiary tracking-widest uppercase mb-4">Manifesto</h2>
                            <div className="relative">
                                <label className="sr-only" htmlFor="event-description">Event Description</label>
                                <textarea 
                                    id="event-description" 
                                    required
                                    value={description}
                                    onChange={e => setDescription(e.target.value)}
                                    className="w-full bg-[#F8F9FA] border-0 focus:ring-2 focus:ring-primary-container rounded-xl py-4 px-4 text-[16px] leading-[1.6] font-normal text-on-surface placeholder:text-tertiary resize-y" 
                                    placeholder="Define the purpose and scope of this gathering..." 
                                    rows={5}
                                ></textarea>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="pt-8 flex flex-col sm:flex-row items-center gap-4 justify-end">
                            <button 
                                type="button" 
                                onClick={() => router.back()}
                                className="w-full sm:w-auto px-8 py-3 rounded-full border-[1.5px] border-on-surface text-on-surface text-[14px] leading-[1.2] tracking-[0.05em] font-semibold hover:bg-surface-variant transition-colors"
                            >
                                Cancel
                            </button>
                            <button 
                                type="submit" 
                                disabled={loading}
                                className="w-full sm:w-auto px-8 py-3 rounded-full bg-primary-container text-on-primary-fixed text-[14px] leading-[1.2] tracking-[0.05em] font-semibold hover:bg-primary-fixed transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                            >
                                {loading ? 'Deploying...' : 'Deploy Event'}
                                <span className="material-symbols-outlined text-sm">arrow_forward</span>
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </main>
    );
}

'use client';

import { useEffect, useState } from 'react';
import { fetchApi } from '@/lib/api';
import Link from 'next/link';

interface EventResponse {
    id: number;
    title: string;
    description: string;
    city: string;
    startTime: string;
    endTime: string;
    capacity: number;
    status: string;
    category: string | null;
    hostName: string;
    clubName: string | null;
}

interface PaginatedResponse {
    content: EventResponse[];
    totalPages: number;
    totalElements: number;
    number: number;
}

export default function EventsBoard() {
    const [events, setEvents] = useState<EventResponse[]>([]);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [cityFilter, setCityFilter] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadEvents(page, cityFilter);
    }, [page, cityFilter]);

    const loadEvents = async (pageNum: number, city: string) => {
        setLoading(true);
        try {
            const queryParams = new URLSearchParams();
            queryParams.append('page', pageNum.toString());
            queryParams.append('size', '10');
            if (city) {
                queryParams.append('city', city);
            }
            
            const data: PaginatedResponse = await fetchApi(`/events?${queryParams.toString()}`);
            setEvents(data.content || []);
            setTotalPages(data.totalPages || 1);
        } catch (error) {
            console.error('Failed to fetch events:', error);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString: string) => {
        const d = new Date(dateString);
        return d.toLocaleDateString('en-US', { month: 'short', day: '2-digit' });
    };

    return (
        <main className="pt-[120px] pb-20 px-[20px] md:px-[64px] max-w-container-max mx-auto mt-24">
            {/* Header Section */}
            <header className="mb-16 md:mb-24 flex flex-col md:flex-row md:items-end justify-between gap-8">
                <div className="max-w-2xl">
                    <h1 className="text-[32px] md:text-[64px] leading-[1.1] tracking-[-0.04em] font-extrabold mb-4">Discover Events.</h1>
                    <p className="text-[18px] leading-[1.6] text-on-surface-variant font-normal">Curated gatherings for the cmnty network. Find your next connection.</p>
                </div>
                {/* Filters */}
                <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                    <div className="relative w-full sm:w-48">
                        <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant z-10 pointer-events-none" style={{ fontVariationSettings: "'FILL' 0" }}>location_on</span>
                        <select 
                            value={cityFilter}
                            onChange={(e) => { setCityFilter(e.target.value); setPage(0); }}
                            className="w-full h-12 pl-12 pr-4 rounded-full bg-surface border border-outline-variant text-on-surface focus:ring-0 focus:border-primary-container focus:outline-none appearance-none text-[14px] leading-[1.2] tracking-[0.05em] font-semibold shadow-sm transition-colors cursor-pointer"
                        >
                            <option value="">Any City</option>
                            <option value="New York">New York</option>
                            <option value="San Francisco">San Francisco</option>
                            <option value="London">London</option>
                            <option value="Berlin">Berlin</option>
                            <option value="Tokyo">Tokyo</option>
                        </select>
                    </div>
                    {/* Add Create Event Button here for convenience */}
                    <Link href="/events/new" className="h-12 px-6 flex items-center justify-center bg-primary-container text-on-primary-fixed text-[14px] leading-[1.2] tracking-[0.05em] font-semibold rounded-full hover:bg-primary-fixed transition-colors shadow-sm whitespace-nowrap">
                        Create Event
                    </Link>
                </div>
            </header>

            {/* Events Grid (Bento Style) */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[24px]">
                {loading ? (
                    <div className="col-span-full py-20 text-center text-on-surface-variant text-[16px]">Loading events...</div>
                ) : events.length === 0 ? (
                    <div className="col-span-full py-20 text-center text-on-surface-variant text-[16px]">No events found.</div>
                ) : (
                    events.map((event, index) => {
                        const isFeatured = index === 0;

                        if (isFeatured) {
                            return (
                                <article key={event.id} className="col-span-1 md:col-span-2 lg:col-span-2 bg-surface rounded-[2rem] p-2 flex flex-col sm:flex-row gap-6 border border-surface-variant shadow-[0_10px_30px_rgba(0,0,0,0.02)] group hover:shadow-[0_20px_40px_rgba(0,0,0,0.06)] transition-all duration-500 overflow-hidden relative">
                                    <div className="absolute top-6 left-6 z-10 bg-surface/80 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/20 flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-primary-container"></div>
                                        <span className="text-[14px] leading-[1.2] tracking-[0.05em] font-semibold text-on-surface">Featured</span>
                                    </div>
                                    <div className="w-full sm:w-[45%] h-64 sm:h-auto rounded-[1.5rem] overflow-hidden relative flex-shrink-0">
                                        <img alt="Event Image" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDvazd2T6Q668nkS2_39a-HFjOmFFhRtUpvsQschDgg3nbBQiwXAtAoC-T2t_ABo9hqw3rdtY9uFDsgprPrqPNjJaoxhHWBLz-kRUUCd_4zKs392GL2ctM8D3SFqDoztpN4_WQD6FIhESNtOcXyFuSXFuVuppXTz3J8F-VTM--q_TU-kqvQ2icMIMYFWnpykr1Q-Yi5FmdG0lIkpZScmoEu1kYr2n40KynemcVhHjg3K8DIQ06BGtqTCI2Kd_gGOiLC4zu1j0nZW-E"/>
                                    </div>
                                    <div className="p-6 sm:p-8 flex flex-col justify-center flex-1">
                                        <div className="flex items-center gap-4 mb-4">
                                            <span className="bg-surface-container px-3 py-1 rounded-full text-[12px] leading-[1.2] tracking-[0.05em] font-semibold text-on-surface-variant">{formatDate(event.startTime)}</span>
                                            <span className="text-on-surface-variant flex items-center gap-1 text-[12px] leading-[1.2] tracking-[0.05em] font-semibold"><span className="material-symbols-outlined text-[14px]">location_on</span> {event.city}</span>
                                            {event.clubName && <span className="bg-primary-container/20 text-primary px-3 py-1 rounded-full text-[12px] leading-[1.2] tracking-[0.05em] font-semibold">{event.clubName}</span>}
                                            {event.category && <span className="bg-tertiary-container text-on-tertiary-container px-3 py-1 rounded-full text-[12px] leading-[1.2] tracking-[0.05em] font-semibold">{event.category}</span>}
                                        </div>
                                        <h2 className="text-[24px] leading-[1.3] font-semibold mb-3 text-on-surface">{event.title}</h2>
                                        <p className="text-[16px] leading-[1.6] font-normal text-on-surface-variant mb-8 line-clamp-2">{event.description}</p>
                                        <div className="mt-auto flex items-center justify-between">
                                            <div className="text-[14px] font-semibold text-on-surface-variant">
                                                Hosted by {event.hostName}
                                            </div>
                                            <Link href={`/events/${event.id}`} className="w-12 h-12 rounded-full border-2 border-on-background flex items-center justify-center group-hover:bg-primary-container group-hover:border-primary-container group-hover:text-on-primary-fixed transition-colors duration-300">
                                                <span className="material-symbols-outlined">arrow_forward</span>
                                            </Link>
                                        </div>
                                    </div>
                                </article>
                            );
                        }

                        return (
                            <article key={event.id} className="bg-surface rounded-[2rem] p-2 flex flex-col border border-surface-variant shadow-[0_10px_30px_rgba(0,0,0,0.02)] group hover:shadow-[0_20px_40px_rgba(0,0,0,0.06)] transition-all duration-500">
                                <div className="w-full h-48 rounded-[1.5rem] overflow-hidden relative mb-4 bg-surface-container flex items-center justify-center">
                                    <div className="text-center">
                                        <div className="w-16 h-16 rounded-full bg-primary-container mx-auto mb-3 flex items-center justify-center">
                                            <span className="material-symbols-outlined text-on-primary-fixed text-[32px]">calendar_month</span>
                                        </div>
                                        <span className="text-[24px] leading-[1.1] font-extrabold text-on-surface tracking-tighter uppercase">{event.city}</span>
                                    </div>
                                </div>
                                <div className="px-4 pb-4 flex flex-col flex-1">
                                    <div className="flex items-center justify-between mb-3">
                                        <span className="bg-surface-container px-3 py-1 rounded-full text-[12px] leading-[1.2] tracking-[0.05em] font-semibold text-on-surface-variant">{formatDate(event.startTime)}</span>
                                        <span className="text-on-surface-variant flex items-center gap-1 text-[12px] leading-[1.2] tracking-[0.05em] font-semibold"><span className="material-symbols-outlined text-[14px]">location_on</span> {event.city}</span>
                                    </div>
                                    {event.clubName && <span className="inline-block bg-primary-container/20 text-primary px-3 py-1 rounded-full text-[12px] leading-[1.2] tracking-[0.05em] font-semibold mb-2">{event.clubName}</span>}
                                    {event.category && <span className="inline-block bg-tertiary-container text-on-tertiary-container px-3 py-1 rounded-full text-[12px] leading-[1.2] tracking-[0.05em] font-semibold mb-2 ml-1">{event.category}</span>}
                                    <h3 className="text-[20px] leading-tight font-semibold mb-2 text-on-surface">{event.title}</h3>
                                    <p className="text-[14px] leading-[1.6] font-normal text-on-surface-variant mb-6 line-clamp-2">{event.description}</p>
                                    <div className="mt-auto pt-4 border-t border-outline-variant/30 flex items-center justify-between">
                                        <span className="text-[14px] leading-[1.2] tracking-[0.05em] font-semibold text-on-surface">{event.status === 'CANCELLED' ? 'Cancelled' : `Hosted by ${event.hostName}`}</span>
                                        <Link href={`/events/${event.id}`} className="h-8 px-4 flex items-center justify-center rounded-full border border-on-background text-on-background text-[12px] leading-[1.2] tracking-[0.05em] font-semibold hover:bg-on-background hover:text-surface transition-colors">Details</Link>
                                    </div>
                                </div>
                            </article>
                        );
                    })
                )}

                {/* Newsletter Island (Span 2 cols) */}
                <article className="col-span-1 md:col-span-2 bg-on-background text-surface rounded-[2rem] p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden">
                    <div className="absolute -right-20 -top-20 w-64 h-64 bg-primary-container rounded-full blur-[100px] opacity-20 pointer-events-none"></div>
                    <div className="z-10 max-w-md">
                        <h3 className="text-[32px] leading-[1.1] font-extrabold tracking-tight mb-3">Never miss a beat.</h3>
                        <p className="text-[16px] leading-[1.6] font-normal text-surface-variant opacity-80">Get exclusive invites to underground events and high-end workshops delivered straight to your inbox.</p>
                    </div>
                    <div className="z-10 w-full md:w-auto flex gap-2 bg-inverse-surface p-1.5 rounded-full border border-white/10">
                        <input type="email" className="bg-transparent border-none text-surface focus:ring-0 placeholder:text-surface-variant/50 text-[16px] leading-[1.6] px-4 w-full md:w-64 outline-none" placeholder="Enter your email" />
                        <button className="h-10 px-6 bg-primary-container text-on-primary-fixed text-[14px] leading-[1.2] tracking-[0.05em] font-semibold rounded-full hover:bg-primary-fixed transition-colors whitespace-nowrap">Subscribe</button>
                    </div>
                </article>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="mt-16 flex justify-center items-center gap-2">
                    <button 
                        onClick={() => setPage(p => Math.max(0, p - 1))}
                        disabled={page === 0}
                        className="w-10 h-10 rounded-full border border-outline-variant flex items-center justify-center text-on-surface hover:bg-surface-container transition-colors disabled:opacity-50"
                    >
                        <span className="material-symbols-outlined text-[18px]">chevron_left</span>
                    </button>
                    <div className="flex items-center gap-1">
                        <span className="text-on-surface font-semibold text-[14px]">Page {page + 1} of {totalPages}</span>
                    </div>
                    <button 
                        onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
                        disabled={page >= totalPages - 1}
                        className="w-10 h-10 rounded-full border border-outline-variant flex items-center justify-center text-on-surface hover:bg-surface-container transition-colors disabled:opacity-50"
                    >
                        <span className="material-symbols-outlined text-[18px]">chevron_right</span>
                    </button>
                </div>
            )}
        </main>
    );
}

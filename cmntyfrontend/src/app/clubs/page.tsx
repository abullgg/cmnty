'use client';

import { useEffect, useState } from 'react';
import { fetchApi } from '@/lib/api';
import Link from 'next/link';

interface Club {
    id: number;
    name: string;
    description: string;
    city: string;
    category?: string;
    hostName?: string;
}

export default function ClubsDirectory() {
    const [clubs, setClubs] = useState<Club[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchCity, setSearchCity] = useState('');

    useEffect(() => {
        loadClubs();
    }, []);

    const loadClubs = async (city?: string) => {
        setLoading(true);
        try {
            const endpoint = city ? `/clubs?city=${encodeURIComponent(city)}` : '/clubs';
            const data = await fetchApi(endpoint);
            setClubs(data || []);
        } catch (error) {
            console.error('Failed to fetch clubs:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            loadClubs(searchCity);
        }
    };

    return (
        <main className="flex-grow w-full max-w-container-max mx-auto px-[20px] md:px-[64px] mb-24 mt-24">
            {/* Header & Search */}
            <header className="mb-16 md:mb-24 flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
                <div className="max-w-2xl">
                    <h1 className="text-[64px] leading-[1.1] tracking-[-0.04em] font-extrabold text-on-background mb-4">Discover Micro-Communities.</h1>
                    <p className="text-[18px] leading-[1.6] font-normal text-secondary">Find your people. Explore specialized clubs tailored to your professional and personal obsessions in your city.</p>
                </div>
                <div className="w-full md:w-auto min-w-[300px]">
                    <div className="relative group">
                        <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-tertiary">search</span>
                        <input 
                            type="text" 
                            className="w-full bg-surface-container-low border-0 rounded-full py-4 pl-12 pr-6 text-[16px] leading-[1.6] text-on-surface focus:ring-2 focus:ring-primary-container transition-all shadow-[0_4px_20px_rgba(0,0,0,0.02)] hover:shadow-[0_4px_20px_rgba(0,0,0,0.04)] outline-none" 
                            placeholder="Search by city or interest..." 
                            value={searchCity}
                            onChange={(e) => setSearchCity(e.target.value)}
                            onKeyDown={handleSearch}
                        />
                    </div>
                </div>
            </header>

            {/* Header Action */}
            <div className="flex justify-end mb-8">
                <Link href="/clubs/new" className="bg-primary-container text-on-primary-fixed text-[14px] leading-[1.2] tracking-[0.05em] font-semibold rounded-full px-[32px] py-[16px] hover:bg-primary-fixed transition-colors duration-200 shadow-sm flex items-center justify-center gap-2">
                    <span>Create a Club</span>
                    <span className="material-symbols-outlined text-sm">add</span>
                </Link>
            </div>

            {/* Bento Grid Clubs */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-[24px] auto-rows-[320px]">
                {loading ? (
                    <div className="col-span-full py-20 text-center text-on-surface-variant text-[16px]">Loading clubs...</div>
                ) : clubs.length === 0 ? (
                    <div className="col-span-full py-20 text-center text-on-surface-variant text-[16px]">No clubs found. Create one!</div>
                ) : (
                    clubs.map((club, index) => {
                        // Make the first item large if desired, for now keeping all standard size or large randomly based on index
                        const isFeatured = index === 0;
                        
                        if (isFeatured) {
                            return (
                                <Link href={`/clubs/${club.id}`} key={club.id} className="col-span-1 md:col-span-2 lg:col-span-2 row-span-2 rounded-xl bg-surface relative overflow-hidden group cursor-pointer shadow-[0_10px_30px_rgba(0,0,0,0.04)] border border-white hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)] transition-all duration-500 block">
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10"></div>
                                    <img alt="Club cover" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBIB3JJyRCbwUEA5mvyDhR7kJAb92X1IiYi4CVfBaN0UJxPSgdHaEe85MQ58aQIplMcc-K4IAO7aVfSD_T5Xz20J9xA_S4Yznn7ss20o_fpxZPshoG2H7d7sL2kL79b3Icq2F-xg787EPY3FwVK_n04TTQbIqLJNrhshXNBsWjMkXpBNrpR3CaggbSglBHxh0WJZlrY0zeVK0Q_bwGhhAHQWjQrlz1UVI6m2PCijAKiTy-e2xeZD2oSZd71F2ZFE5CR5W9JHZ678JU"/>
                                    <div className="absolute bottom-0 left-0 w-full p-8 z-20 flex flex-col justify-end h-full">
                                        <div className="flex gap-2 mb-4">
                                            <span className="bg-primary-container text-on-primary-container px-3 py-1 rounded-full text-[14px] leading-[1.2] tracking-[0.05em] font-semibold">{club.city || 'Global'}</span>
                                            {club.category && <span className="bg-white/20 backdrop-blur-md text-white px-3 py-1 rounded-full text-[14px] leading-[1.2] tracking-[0.05em] font-semibold">{club.category}</span>}
                                        </div>
                                        <h2 className="text-[40px] leading-[1.2] tracking-[-0.02em] font-bold text-white mb-2">{club.name}</h2>
                                        <p className="text-[16px] leading-[1.6] text-white/80 mb-6 max-w-md">{club.description}</p>
                                        <div className="flex items-center justify-between mt-auto">
                                            <div className="font-semibold text-white/80 text-[14px]">Host: {club.hostName}</div>
                                            <button className="bg-primary-container text-on-primary-container w-12 h-12 rounded-full flex items-center justify-center hover:bg-primary hover:text-white transition-colors group-hover:scale-110 duration-300">
                                                <span className="material-symbols-outlined">arrow_forward</span>
                                            </button>
                                        </div>
                                    </div>
                                </Link>
                            );
                        }

                        return (
                            <Link href={`/clubs/${club.id}`} key={club.id} className="col-span-1 rounded-xl bg-surface relative overflow-hidden group cursor-pointer shadow-[0_10px_30px_rgba(0,0,0,0.04)] border border-surface-variant p-6 flex flex-col hover:-translate-y-1 transition-transform duration-300 block">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="w-16 h-16 rounded-2xl bg-surface-container-high overflow-hidden">
                                        <img alt="Club cover" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCMj55BKQiEqet-h6Dps5JW9JSE2TEtakTUeR0NFJ9vVyq5Vx_UlP1IM87FWAG0Or0HP_Zs__LRSnGAexkDgc6ilSbKPS3DKlN7rYPKHQgYbZU8L60_v8QmstbEdFHobVwgT-YWumxzJAwXdaDzIQxFNHdVIvUXHS-j40yMHyX9_YamxEs-eYqGFp4435d6dwaY7CMnnSvNAVgMtH0iJPqE1zsOodE0_TW2vS6-G5Y8w6VKuzt2rp0IH_M81cmkREQ7yheBGWoHdMo"/>
                                    </div>
                                    <span className="bg-surface-container text-secondary px-3 py-1 rounded-full text-[14px] leading-[1.2] tracking-[0.05em] font-semibold text-xs">{club.city || 'Global'}</span>
                                </div>
                                <h3 className="text-[24px] leading-[1.3] font-semibold text-on-surface mb-2">{club.name}</h3>
                                <p className="text-[16px] leading-[1.6] font-normal text-secondary line-clamp-3 mb-6 flex-grow">{club.description}</p>
                                <div className="flex items-center justify-between border-t border-surface-variant pt-4">
                                    <span className="text-[14px] leading-[1.2] tracking-[0.05em] font-semibold text-tertiary">Host: {club.hostName}</span>
                                    <span className="material-symbols-outlined text-primary-container group-hover:translate-x-1 transition-transform">arrow_forward</span>
                                </div>
                            </Link>
                        );
                    })
                )}
            </div>
        </main>
    );
}

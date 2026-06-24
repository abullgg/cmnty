'use client';

import { useState } from 'react';
import { fetchApi } from '@/lib/api';
import { useRouter } from 'next/navigation';
import ProtectedRoute from '@/components/ProtectedRoute';

export default function CreateClub() {
    const [name, setName] = useState('');
    const [city, setCity] = useState('');
    const [category, setCategory] = useState('');
    const [description, setDescription] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            await fetchApi('/clubs', {
                method: 'POST',
                body: JSON.stringify({ name, city, category: category || null, description })
            });
            router.push('/clubs');
        } catch (err: any) {
            setError(err.message || 'Failed to create club');
        } finally {
            setLoading(false);
        }
    };

    return (
        <ProtectedRoute>
            <main className="max-w-[1280px] mx-auto px-[20px] md:px-[64px] min-h-screen pt-[160px] pb-[120px]">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-[24px] items-center">
                {/* Left Asymmetric Image Panel */}
                <div className="md:col-span-5 h-[400px] md:h-[600px] rounded-xl overflow-hidden relative shadow-[0_10px_30px_rgba(0,0,0,0.04)] border border-surface-variant">
                    <img alt="Abstract geometric art" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuC_bkLGTDplvDvEL71fcEnl0yDqyWlF1DJ4EQQe8bwdZae4v6RjglqK68GUvILrLxA4VLXS01FM_wdD0FspzE0J_NT2q8XTcfQCZ9gL8bkeKkR5aaS5R4Nzj0Ni9EbL3ESL469FVBOrww76E_o-XmjEKwf_YqWwR2oRso-K_D20OMbCx_vzvs4ztqsAKQVsXE0vd1sdRDhwprCLPkg8oTLay1tLM2a1nOdhxpU-uWZtn24awQ0pQxCE8RX1JGQFBq3z4gkFXZxFM_8"/>
                    <div className="absolute inset-0 bg-gradient-to-t from-background/40 to-transparent mix-blend-multiply"></div>
                </div>
                {/* Right Form Panel */}
                <div className="md:col-span-6 md:col-start-7 pt-12 md:pt-0">
                    <div className="mb-12">
                        <h1 className="text-[64px] leading-[1.1] tracking-[-0.04em] font-extrabold text-on-surface mb-4">Start a Circle.</h1>
                        <p className="text-[18px] leading-[1.6] font-normal text-on-surface-variant max-w-md">Create a protected space for your community. Define your culture, set your location, and spark the connection.</p>
                    </div>
                    
                    {error && <div className="bg-error-container text-on-error-container p-3 rounded-lg mb-[24px] text-sm">{error}</div>}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Input: Club Name */}
                        <div>
                            <label className="block text-[14px] leading-[1.2] tracking-[0.05em] font-semibold text-on-surface-variant mb-2 pl-4">Club Name</label>
                            <input 
                                type="text" 
                                required
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full bg-surface-container-low border border-transparent focus:border-primary-container focus:ring-1 focus:ring-primary-container rounded-full px-6 py-4 text-[16px] leading-[1.6] font-normal text-on-surface outline-none transition-all placeholder:text-outline" 
                                placeholder="e.g. Minimalist Runners" 
                            />
                        </div>
                        {/* Input: City */}
                        <div>
                            <label className="block text-[14px] leading-[1.2] tracking-[0.05em] font-semibold text-on-surface-variant mb-2 pl-4">City Hub</label>
                            <div className="relative">
                                <span className="material-symbols-outlined absolute left-6 top-1/2 -translate-y-1/2 text-on-surface-variant">location_on</span>
                                <input 
                                    type="text" 
                                    required
                                    value={city}
                                    onChange={(e) => setCity(e.target.value)}
                                    className="w-full bg-surface-container-low border border-transparent focus:border-primary-container focus:ring-1 focus:ring-primary-container rounded-full pl-14 pr-6 py-4 text-[16px] leading-[1.6] font-normal text-on-surface outline-none transition-all placeholder:text-outline" 
                                    placeholder="Enter city name" 
                                />
                            </div>
                        </div>
                        {/* Input: Category */}
                        <div>
                            <label className="block text-[14px] leading-[1.2] tracking-[0.05em] font-semibold text-on-surface-variant mb-2 pl-4">Category</label>
                            <div className="relative">
                                <span className="material-symbols-outlined absolute left-6 top-1/2 -translate-y-1/2 text-on-surface-variant">category</span>
                                <input 
                                    type="text" 
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)}
                                    className="w-full bg-surface-container-low border border-transparent focus:border-primary-container focus:ring-1 focus:ring-primary-container rounded-full pl-14 pr-6 py-4 text-[16px] leading-[1.6] font-normal text-on-surface outline-none transition-all placeholder:text-outline" 
                                    placeholder="e.g., Tech, Sports, Music" 
                                />
                            </div>
                        </div>
                        {/* Textarea: Description */}
                        <div>
                            <label className="block text-[14px] leading-[1.2] tracking-[0.05em] font-semibold text-on-surface-variant mb-2 pl-4">Manifesto / Description</label>
                            <textarea 
                                required
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="w-full bg-surface-container-low border border-transparent focus:border-primary-container focus:ring-1 focus:ring-primary-container rounded-xl px-6 py-4 text-[16px] leading-[1.6] font-normal text-on-surface outline-none transition-all resize-none placeholder:text-outline" 
                                placeholder="What is the purpose of this circle?" 
                                rows={4}
                            ></textarea>
                        </div>
                        {/* Submit Button */}
                        <div className="pt-4">
                            <button 
                                type="submit" 
                                disabled={loading}
                                className="w-full bg-primary-container text-on-primary-fixed rounded-full px-8 py-4 text-[14px] leading-[1.2] tracking-[0.05em] font-semibold hover:bg-primary-fixed transition-colors flex items-center justify-center gap-2 group disabled:opacity-50"
                            >
                                {loading ? 'Initializing...' : 'Initialize Club'}
                                <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </main>
        </ProtectedRoute>
    );
}

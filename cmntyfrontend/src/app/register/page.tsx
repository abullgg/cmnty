'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { fetchApi, setAuthUser } from '@/lib/api';
import Link from 'next/link';

export default function Register() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const data = await fetchApi('/auth/register', {
                method: 'POST',
                body: JSON.stringify({ name, email, password })
            });
            
            if (data && data.token) {
                setAuthUser(data.token, data.userId, data.name);
                window.dispatchEvent(new Event('auth-change'));
                router.push('/');
            } else {
                setError('Invalid registration response');
            }
        } catch (err: any) {
            setError(err.message || 'Failed to register. Email might be in use.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="flex-grow flex items-center justify-center px-[20px] md:px-[64px] py-16 mt-24">
            <div className="w-full max-w-[500px] bg-surface-container-lowest rounded-xl shadow-[0_10px_30px_rgba(0,0,0,0.02)] border border-surface-variant p-8 md:p-12 relative overflow-hidden">
                <div className="absolute -top-12 -right-12 w-32 h-32 bg-primary-container rounded-full blur-[60px] opacity-20 pointer-events-none"></div>
                <div className="mb-10 relative z-10">
                    <h1 className="text-[32px] md:text-[40px] leading-[1.2] tracking-[-0.02em] font-bold text-on-surface mb-2">Join cmnty</h1>
                    <p className="text-[16px] leading-[1.6] text-on-surface-variant">Precision engineered for connection. Create your account.</p>
                </div>
                
                {error && <div className="bg-error-container text-on-error-container p-3 rounded-lg mb-6 text-sm relative z-10">{error}</div>}
                
                <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                    <div>
                        <label className="block text-[14px] leading-[1.2] tracking-[0.05em] font-semibold text-on-surface mb-2" htmlFor="fullName">Full Name</label>
                        <div className="relative">
                            <input 
                                id="fullName"
                                type="text" 
                                required
                                placeholder="Jane Doe"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full bg-surface-container-low text-on-surface text-[16px] leading-[1.6] rounded-full px-6 py-4 border-none focus:ring-1.5 focus:ring-primary-container focus:outline-none transition-shadow placeholder:text-outline-variant"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-[14px] leading-[1.2] tracking-[0.05em] font-semibold text-on-surface mb-2" htmlFor="email">Email Address</label>
                        <div className="relative">
                            <input 
                                id="email"
                                type="email" 
                                required
                                placeholder="jane@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-surface-container-low text-on-surface text-[16px] leading-[1.6] rounded-full px-6 py-4 border-none focus:ring-1.5 focus:ring-primary-container focus:outline-none transition-shadow placeholder:text-outline-variant"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-[14px] leading-[1.2] tracking-[0.05em] font-semibold text-on-surface mb-2" htmlFor="password">Password</label>
                        <div className="relative">
                            <input 
                                id="password"
                                type="password" 
                                required
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-surface-container-low text-on-surface text-[16px] leading-[1.6] rounded-full px-6 py-4 border-none focus:ring-1.5 focus:ring-primary-container focus:outline-none transition-shadow placeholder:text-outline-variant"
                            />
                        </div>
                    </div>

                    <button 
                        type="submit" 
                        disabled={loading}
                        className="w-full bg-primary-container hover:bg-primary-fixed text-on-primary-fixed text-[14px] leading-[1.2] tracking-[0.05em] font-semibold py-4 rounded-full transition-colors duration-300 mt-4 shadow-sm flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                        <span>{loading ? 'Creating...' : 'Create Account'}</span>
                        <span className="material-symbols-outlined text-sm">arrow_forward</span>
                    </button>
                    
                    <p className="text-center text-[16px] leading-[1.6] text-outline mt-6">
                        By signing up, you agree to our <Link href="#" className="text-primary hover:underline">Terms</Link> and <Link href="#" className="text-primary hover:underline">Privacy Policy</Link>.
                    </p>
                </form>
            </div>
        </main>
    );
}

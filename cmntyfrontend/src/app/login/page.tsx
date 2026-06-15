'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { fetchApi, setAuthUser } from '@/lib/api';
import Link from 'next/link';

export default function Login() {
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
            const data = await fetchApi('/auth/login', {
                method: 'POST',
                body: JSON.stringify({ email, password })
            });
            
            if (data && data.token) {
                setAuthUser(data.token, data.userId, data.name);
                window.dispatchEvent(new Event('auth-change'));
                router.push('/');
            } else {
                setError('Invalid login response');
            }
        } catch (err: any) {
            setError(err.message || 'Failed to login. Please check your credentials.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="flex-grow flex items-center justify-center p-[20px] md:p-[64px] mt-24">
            <div className="w-full max-w-[480px] bg-surface-container-lowest rounded-xl shadow-[0_10px_30px_rgba(0,0,0,0.04)] p-[40px] md:p-[64px] border border-surface-variant relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-[4px] bg-gradient-to-r from-primary-container to-primary-fixed-dim"></div>
                <div className="mb-[48px] text-center">
                    <h1 className="text-[40px] leading-[1.2] tracking-[-0.02em] font-bold text-on-surface mb-[8px]">cmnty</h1>
                    <p className="text-[16px] leading-[1.6] font-normal text-on-surface-variant mt-[8px]">Access your core network.</p>
                </div>
                
                {error && <div className="bg-error-container text-on-error-container p-3 rounded-lg mb-[24px] text-sm">{error}</div>}
                
                <form onSubmit={handleSubmit} className="flex flex-col gap-[24px]">
                    <div>
                        <label className="block text-[14px] leading-[1.2] tracking-[0.05em] font-semibold text-on-surface mb-[8px]" htmlFor="email">Email Address</label>
                        <input 
                            id="email"
                            type="email" 
                            required
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-surface-container-low border-[1.5px] border-transparent rounded-full px-[24px] py-[16px] text-[16px] leading-[1.6] text-on-surface focus:border-primary-container focus:ring-0 outline-none transition-colors duration-200"
                        />
                    </div>
                    <div>
                        <div className="flex justify-between items-center mb-[8px]">
                            <label className="block text-[14px] leading-[1.2] tracking-[0.05em] font-semibold text-on-surface" htmlFor="password">Password</label>
                            <Link href="#" className="text-[14px] leading-[1.2] tracking-[0.05em] font-semibold text-on-surface-variant hover:text-primary-container transition-colors duration-200">Forgot?</Link>
                        </div>
                        <input 
                            id="password"
                            type="password" 
                            required
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-surface-container-low border-[1.5px] border-transparent rounded-full px-[24px] py-[16px] text-[16px] leading-[1.6] text-on-surface focus:border-primary-container focus:ring-0 outline-none transition-colors duration-200"
                        />
                    </div>
                    <button 
                        type="submit" 
                        disabled={loading}
                        className="w-full bg-primary-container text-on-primary-fixed text-[14px] leading-[1.2] tracking-[0.05em] font-semibold rounded-full px-[32px] py-[18px] hover:bg-primary-fixed transition-colors duration-200 mt-[16px] flex items-center justify-center gap-[8px] disabled:opacity-50"
                    >
                        {loading ? 'Signing In...' : 'Sign In'}
                        <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                    </button>
                </form>

                <div className="mt-[48px] text-center">
                    <p className="text-[16px] leading-[1.6] text-on-surface-variant">
                        Don't have an account? 
                        <Link href="/register" className="text-[14px] leading-[1.2] tracking-[0.05em] font-semibold text-on-surface hover:text-primary-container transition-colors duration-200 ml-[4px]">Sign up</Link>
                    </p>
                </div>
            </div>
        </main>
    );
}

'use client';

import Link from 'next/link';
export default function Navbar() {

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 flex justify-center items-center w-full mt-6 px-[20px] md:px-[64px] pointer-events-none">
            <div className="pointer-events-auto flex items-center justify-between rounded-full px-6 py-2 border w-full max-w-[800px] transition-all duration-500 bg-white/40 dark:bg-surface-container/70 backdrop-blur-xl border-white/20 border-orange-500/10 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.1),0_8px_32px_rgba(255,165,0,0.15)] dark:shadow-[inset_0_0_0_1px_rgba(255,255,255,0.1),0_8px_32px_rgba(255,165,0,0.15)]">
                <Link href="/" className="text-[24px] font-extrabold tracking-tighter text-on-surface flex items-center" style={{ color: '#00ff41' }}>
                    cmnty
                </Link>
                <div className="hidden md:flex items-center space-x-6">
                    <Link href="/feed" className="text-[14px] leading-[1.2] tracking-[0.05em] font-semibold text-on-surface-variant hover:text-primary transition-all duration-300">Feed</Link>
                    <Link href="/clubs" className="text-[14px] leading-[1.2] tracking-[0.05em] font-semibold text-on-surface-variant hover:text-primary transition-all duration-300">Clubs</Link>
                    <Link href="/events" className="text-[14px] leading-[1.2] tracking-[0.05em] font-semibold text-on-surface-variant hover:text-primary transition-all duration-300">Events</Link>
                    <Link href="/explore" className="text-[14px] leading-[1.2] tracking-[0.05em] font-semibold text-primary font-bold border-b-2 border-primary pb-1 active:scale-95 transition-transform duration-200">Explore</Link>
                </div>
                <div className="flex items-center space-x-4">
                    <button className="w-10 h-10 rounded-full flex items-center justify-center border border-outline-variant hover:border-primary transition-all duration-300 group text-on-surface-variant hover:text-primary">
                        <span className="material-symbols-outlined text-[20px]">dark_mode</span>
                    </button>
                    <Link href="/login" className="w-10 h-10 rounded-full overflow-hidden border border-outline-variant hover:border-primary transition-colors duration-300 block">
                        <img alt="User avatar" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAhyRWHvl0VJczah6NM8d-RLgutyZBBOq-TuTj4I1JW-FchKxqMqcGJ2RpNePU2ThOrE4pPW-E5ZDpILcCgBOTSiwneCSTxtZXpWBAuuQMqLsarHswh-jifXyKNXNNDdIkxTOVmZs9RozqHWvb6Yic-HNBLDjHK-lmNAy3VQOWqbHDbPHUTR6cQn7eK_esJ44gt6h7XB6BQPhY8uOp1LFlhh5wKKtcSGIO9N46v9VfuNrlWtcN6Pq3BxxaNOGModlDVMUsK3KBsKNw" />
                    </Link>
                </div>
            </div>
        </nav>
    );
}

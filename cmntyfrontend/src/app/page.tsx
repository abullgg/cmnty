import Link from 'next/link';

export default function Home() {
    return (
        <main>
            {/* Split Hero Section */}
            <section className="min-h-[921px] pt-32 px-[20px] md:px-[64px] max-w-[1280px] mx-auto flex flex-col md:flex-row gap-[24px]">
                {/* Discover Half */}
                <Link href="/events" className="flex-1 flex flex-col justify-center p-8 md:p-16 bg-surface rounded-3xl border border-surface-variant relative overflow-hidden group hover:border-primary-container transition-colors duration-500 cursor-pointer animate-slide-in-left block">
                    <div className="absolute inset-0 bg-gradient-to-br from-surface-bright to-surface-variant opacity-50 z-0"></div>
                    <div className="absolute inset-0 bg-primary-container opacity-0 group-hover:opacity-10 transition-opacity duration-500 z-0"></div>
                    <div className="relative z-10">
                        <span className="inline-block px-4 py-1 rounded-full bg-surface-container text-on-surface-variant text-[14px] leading-[1.2] tracking-[0.05em] font-semibold mb-6 border border-outline-variant">For Members</span>
                        <h1 className="text-[64px] leading-[1.1] tracking-[-0.04em] font-extrabold mb-6 text-on-surface">Discover<br/>Next.</h1>
                        <p className="text-[18px] leading-[1.6] font-normal text-secondary mb-10 max-w-md">Immerse yourself in exclusive events and vibrant clubs.</p>
                    </div>
                </Link>
                {/* Host Half */}
                <Link href="/clubs/new" className="flex-1 flex flex-col justify-center p-8 md:p-16 bg-on-surface rounded-3xl relative overflow-hidden group cursor-pointer animate-slide-in-right block">
                    <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1511795409834-ef04bbd61622?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')] bg-cover bg-center opacity-20 mix-blend-luminosity z-0"></div>
                    <div className="absolute inset-0 bg-gradient-to-t from-on-surface via-transparent to-transparent z-0"></div>
                    <div className="absolute inset-0 bg-primary-container mix-blend-overlay opacity-0 group-hover:opacity-20 transition-opacity duration-500 z-0"></div>
                    <div className="relative z-10">
                        <span className="inline-block px-4 py-1 rounded-full bg-white/10 text-white text-[14px] leading-[1.2] tracking-[0.05em] font-semibold mb-6 backdrop-blur-md border border-white/20">For Creators</span>
                        <h1 className="text-[64px] leading-[1.1] tracking-[-0.04em] font-extrabold mb-6 text-white">Host<br/>Energy.</h1>
                        <p className="text-[18px] leading-[1.6] font-normal text-secondary-fixed mb-10 max-w-md">Build your community. Shape the culture.</p>
                    </div>
                </Link>
            </section>
        </main>
    );
}

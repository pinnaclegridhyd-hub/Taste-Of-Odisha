'use client';

import type { Metadata } from 'next';
import Image from 'next/image';
import './globals.css';
import Link from 'next/link';
import CartBadge from '@/components/CartBadge';
import WhatsAppSupportButton from '@/components/WhatsAppSupportButton';
import { Toaster, toast } from 'sonner';
import { Search, User, Menu, X, Heart, MessageCircle, ChevronRight, ShoppingBag, ShieldCheck, Palette, Sparkles } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? 'hidden' : 'unset';
  }, [isMenuOpen]);

  return (
    <html lang="en" className="scroll-smooth">
      <body className="antialiased selection:bg-primary/10 selection:text-primary bg-secondary min-h-screen flex flex-col font-sans">
        
        {/* Professional Header - Sanctuary Standard */}
        <header className={`absolute lg:fixed top-0 inset-x-0 z-[200] transition-all duration-300 ${scrolled ? 'bg-secondary/95 backdrop-blur-md shadow-sm py-2 lg:py-2' : 'bg-transparent py-4'}`}>
          <nav className="container-sanctuary">
            <div className="flex items-center justify-between gap-6 h-14 md:h-16">
              
              {/* Logo - Heritage Elegance */}
              <Link href="/" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-2 md:gap-3 group relative z-[210]">
                <Image src="/images/logo-too.jpeg" alt="Taste Of Odisha" width={40} height={40} className="w-8 h-8 md:w-10 md:h-10 mix-blend-multiply rounded-md" />
                <div className="flex flex-col">
                  <span className="text-xl md:text-2xl font-serif font-bold text-heritage-dark tracking-tight leading-none group-hover:text-primary transition-colors">
                    Taste Of
                  </span>
                  <span className="text-[9px] font-medium tracking-[0.3em] text-primary uppercase mt-0.5">
                    Odisha
                  </span>
                </div>
              </Link>

              {/* Universal Search - Accessible Amazon Standard */}
              <div className="hidden lg:flex flex-1 items-center justify-center max-w-xl px-4">
                <form action="/products" method="GET" className="w-full relative group">
                  <input
                    type="text"
                    name="search"
                    placeholder="Search for authentic heritage..."
                    className="w-full h-11 bg-white/80 border border-heritage-dark/10 rounded-lg px-10 text-sm focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/5 transition-all"
                  />
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-heritage-dark/40" />
                </form>
              </div>

              {/* Navigation Links */}
              <div className="hidden lg:flex items-center gap-8">
                <nav className="flex items-center gap-6 border-r border-heritage-dark/10 pr-8">
                  <Link href="/products" className="text-[11px] font-semibold uppercase tracking-widest text-heritage-dark/80 hover:text-primary transition-colors">Collection</Link>
                  <Link href="/about" className="text-[11px] font-semibold uppercase tracking-widest text-heritage-dark/80 hover:text-primary transition-colors">Our Legacy</Link>
                </nav>
                <div className="flex items-center gap-5">
                  <Link href="/account" className="w-10 h-10 rounded-lg border border-heritage-dark/10 flex items-center justify-center text-heritage-dark hover:border-primary hover:text-primary transition-all">
                    <User className="w-4 h-4" />
                  </Link>
                  <CartBadge />
                </div>
              </div>

              {/* Mobile Actions */}
              <div className="flex lg:hidden items-center gap-3 relative z-[210]">
                <CartBadge />
                <button 
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="w-10 h-10 flex items-center justify-center rounded-lg bg-heritage-dark text-white active:scale-95 transition-all"
                  aria-label="Toggle Menu"
                >
                  {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </button>
              </div>
            </div>
          </nav>

        </header>

        {/* Clean Mobile Sidebar Navigator */}
        <div className={`fixed inset-0 bg-heritage-bone z-[150] lg:hidden transition-all duration-300 ease-in-out ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'} ${!isMenuOpen ? 'pointer-events-none' : ''}`}>
           <div className="flex flex-col h-full pt-28 px-6 space-y-10">
              <nav className="flex flex-col divide-y divide-heritage-dark/5">
                {[
                  { name: 'Latest Arrivals', href: '/products' },
                  { name: 'Sweets', href: '/products?category=sweets' },
                  { name: 'Muruku', href: '/products?category=muruku' },
                  { name: 'Achar', href: '/products?category=achar' }
                ].map((item, i) => (
                  <Link 
                    key={i} 
                    href={item.href} 
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center justify-between py-6 group"
                  >
                    <span className="text-2xl font-serif text-heritage-dark group-hover:text-primary transition-colors">{item.name}</span>
                    <ChevronRight className="w-5 h-5 text-heritage-dark/20" />
                  </Link>
                ))}
              </nav>

              <div className="mt-auto pb-12 space-y-6">
                <Link href="/account" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-4 p-5 bg-white rounded-xl border border-heritage-dark/5">
                  <User className="w-5 h-5 text-primary" />
                  <span className="font-semibold text-heritage-dark">Your Account</span>
                </Link>
                <div className="text-center px-4">
                  <p className="text-[9px] font-medium text-heritage-dark/40 uppercase tracking-[0.3em]">Taste Of Odisha International</p>
                </div>
              </div>
           </div>
        </div>

        <main className="flex-grow">{children}</main>

        {/* Structured Professional Footer */}
        <footer className="bg-heritage-dark text-white pt-20 pb-12">
          <div className="container-sanctuary">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-20">
              <div className="space-y-6">
                <Link href="/" className="flex items-center gap-3">
                  <div className="bg-white/95 p-1 rounded flex items-center justify-center">
                    <Image src="/images/logo-too.jpeg" alt="Taste Of Odisha" width={40} height={40} className="w-8 h-8 object-contain mix-blend-multiply" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-2xl font-serif font-bold italic">Taste Of</span>
                    <span className="text-[9px] font-medium tracking-[0.3em] text-primary uppercase">Odisha</span>
                  </div>
                </Link>
                <p className="text-sm text-white/60 leading-relaxed font-normal">
                  Real products from Odisha, made by real artisans. Our collection is handcrafted by 100% women-led collectives in Odisha.
                </p>
              </div>

              <div>
                <h4 className="text-[10px] font-bold text-primary tracking-widest uppercase mb-6">Explore</h4>
                <ul className="space-y-4 text-sm text-white/70">
                  <li><Link href="/products" className="hover:text-primary transition-colors">All Collections</Link></li>
                  <li><Link href="/about" className="hover:text-primary transition-colors">Our History</Link></li>
                  <li><Link href="/products?category=sweets" className="hover:text-primary transition-colors">Traditional Sweets</Link></li>
                  <li><Link href="/products?category=muruku" className="hover:text-primary transition-colors">Muruku Varieties</Link></li>
                </ul>
              </div>

              <div>
                <h4 className="text-[10px] font-bold text-primary tracking-widest uppercase mb-6">Concierge</h4>
                <ul className="space-y-4 text-sm text-white/70">
                  <li><Link href="/contact" className="hover:text-primary transition-colors">Contact Support</Link></li>
                  <li><Link href="/shipping-policy" className="hover:text-primary transition-colors">Shipping Info</Link></li>
                  <li><Link href="/return-policy" className="hover:text-primary transition-colors">Returns Policy</Link></li>
                  <li><Link href="/about" className="hover:text-primary transition-colors">G.I. Verification</Link></li>
                </ul>
              </div>

              <div className="space-y-6">
                <h4 className="text-[10px] font-bold text-primary tracking-widest uppercase mb-6">The Journal</h4>
                <p className="text-xs text-white/40 leading-relaxed">Join our inner circle for seasonal drops and artisan stories.</p>
                <form className="relative">
                  <input 
                    type="email" 
                    placeholder="E-mail Address" 
                    className="bg-white/5 border border-white/10 text-white p-4 w-full text-xs rounded-lg focus:border-primary outline-none transition-all placeholder:text-white/20"
                  />
                  <button className="absolute right-3 top-1/2 -translate-y-1/2 text-primary hover:text-white transition-all">
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </form>
              </div>
            </div>

            <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center text-[10px] text-white/30 uppercase tracking-[0.2em] gap-6">
              <p>© 2024 Taste Of Odisha International.</p>
              <div className="flex flex-wrap justify-center gap-8">
                <span className="flex items-center gap-2 text-primary/60"><ShieldCheck className="w-3 h-3" /> Certified G.I. Origin</span>
                <span>Artisan Owned</span>
              </div>
            </div>
          </div>
        </footer>

        <WhatsAppSupportButton />
        <Toaster position="top-center" />
      </body>
    </html>
  );
}

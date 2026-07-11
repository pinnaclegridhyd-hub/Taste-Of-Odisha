'use client';

import Image from 'next/image';
import Script from 'next/script';
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

  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Taste Of Odisha',
    url: 'https://www.tasteofodisha1996.com',
    logo: 'https://www.tasteofodisha1996.com/images/logo-too.jpeg',
    sameAs: ['https://www.tasteofodisha1996.com'],
  };

  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Taste Of Odisha',
    url: 'https://www.tasteofodisha1996.com',
    potentialAction: {
      '@type': 'SearchAction',
      target: 'https://www.tasteofodisha1996.com/products?search={search_term_string}',
      'query-input': 'required name=search_term_string',
    },
  };

  return (
    <html lang="en" className="scroll-smooth">
      <body className="antialiased selection:bg-primary/10 selection:text-primary bg-secondary min-h-screen flex flex-col font-sans">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify([organizationSchema, websiteSchema]) }} />

        {/* Professional Header - Sanctuary Standard */}
        <header className={`absolute lg:fixed top-0 inset-x-0 z-[200] transition-all duration-300 ${scrolled ? 'bg-secondary/95 backdrop-blur-md shadow-sm py-2 lg:py-2' : 'bg-transparent py-4'}`}>
          <nav className="container-sanctuary">
            <div className="flex items-center justify-between gap-6 h-16 md:h-20">

              {/* Logo - Heritage Elegance */}
              <Link href="/" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-2 md:gap-3 group relative z-[210] shrink-0">
                <Image src="/images/logo-too.jpeg" alt="Taste Of Odisha" width={56} height={56} className="w-10 h-10 md:w-12 md:h-12 mix-blend-multiply rounded-md" />
                <div className="hidden sm:flex flex-col">
                  <span className="text-lg md:text-2xl font-serif font-bold text-heritage-dark tracking-tight leading-none group-hover:text-primary transition-colors">
                    Taste Of
                  </span>
                  <span className="text-[9px] md:text-xs font-bold tracking-[0.25em] text-primary uppercase mt-0.5">
                    Odisha
                  </span>
                </div>
              </Link>

              {/* Universal Search - Accessible Amazon Standard */}
              <div className="flex flex-1 items-center justify-center max-w-[140px] sm:max-w-xs md:max-w-md lg:max-w-lg px-2">
                <form action="/products" method="GET" className="w-full relative group">
                  <input
                    type="text"
                    name="search"
                    placeholder="Search..."
                    className="w-full h-8 sm:h-9 md:h-11 bg-white/80 border border-heritage-dark/10 rounded-lg pl-8 pr-2 sm:pl-9 sm:pr-3 text-[11px] sm:text-xs md:text-sm focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/5 transition-all"
                  />
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 md:w-4 md:h-4 text-heritage-dark/40" />
                </form>
              </div>

              {/* Navigation Links */}
              <div className="hidden lg:flex items-center gap-8">
                <nav className="flex items-center gap-6 border-r border-heritage-dark/10 pr-8">
                  <Link href="/products" className="text-[11px] font-semibold uppercase tracking-widest text-heritage-dark/80 hover:text-primary transition-colors">Collection</Link>
                  <Link href="/about" className="text-[11px] font-semibold uppercase tracking-widest text-heritage-dark/80 hover:text-primary transition-colors">About Us</Link>
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
          <div className="flex flex-col h-full pt-28 px-6 space-y-6">

            {/* Mobile Search Bar */}
            <form action="/products" method="GET" className="relative group" onSubmit={() => setIsMenuOpen(false)}>
              <input
                type="text"
                name="search"
                placeholder="Search products..."
                className="w-full h-12 bg-white border border-heritage-dark/10 rounded-xl px-11 text-sm focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/5 transition-all"
              />
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-heritage-dark/40" />
            </form>

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
                  <div className="bg-white/95 p-1.5 rounded flex items-center justify-center">
                    <Image src="/images/logo-too.jpeg" alt="Taste Of Odisha" width={56} height={56} className="w-12 h-12 object-contain mix-blend-multiply" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-3xl font-serif font-bold italic">Taste Of</span>
                    <span className="text-sm font-bold tracking-[0.25em] text-primary uppercase">Odisha</span>
                  </div>
                </Link>
                <p className="text-sm text-white/60 leading-relaxed font-normal">
                  Authentic products from Odisha, made by local communities. Our collection is prepared by 100% women-led self-help groups in Odisha.
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
                  {/* <li><Link href="/return-policy" className="hover:text-primary transition-colors">Returns Policy</Link></li> */}
                  {/* <li><Link href="/about" className="hover:text-primary transition-colors">G.I. Verification</Link></li> */}
                </ul>
              </div>

              <div className="space-y-6">
                <h4 className="text-[10px] font-bold text-primary tracking-widest uppercase mb-6">The Journal</h4>
                 <p className="text-xs text-white/40 leading-relaxed">Join our inner circle for seasonal drops and updates.</p>
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
              <p>© 2026 Taste Of Odisha International.</p>
              <div className="flex flex-wrap justify-center gap-8">
                <span className="flex items-center gap-2 text-primary/60"><ShieldCheck className="w-3 h-3" /> Certified G.I. Origin</span>
                <span>Community Owned</span>
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

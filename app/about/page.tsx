import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Heart, Globe, Users, ShieldCheck, ArrowRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Our Story | Taste Of Odisha',
  description: 'Discover the lineage and legacy of authentic Odisha flavors and our mission to preserve them.',
};

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-secondary pb-32 pt-28">
      {/* 01. Hero Narrative */}
      <section className="relative min-h-[70vh] flex items-center overflow-hidden">
        <Image 
          src="/TASTE%20OF%20ODISHA/MIXTURE%20VARIETIES%20250gram_-%E2%82%B989/Cornflakes%20mixture/WhatsApp%20Image%202026-05-24%20at%208.05.26%20PM.jpeg" 
          alt="Odisha Artisan Hero" 
          fill 
          className="object-cover brightness-50"
          priority
        />
        <div className="container-sanctuary relative z-10 py-20 text-white">
          <div className="max-w-4xl space-y-8 animate-fade-in">
            <span className="label-text text-primary-foreground/80 uppercase tracking-[0.3em]">The Lineage</span>
            <h1 className="h1 lowercase first-letter:uppercase text-white leading-[0.9]">
              Preserving the <br/>
              <span className="italic font-normal text-primary">Ancient Verse </span>
              of Odisha.
            </h1>
            <p className="body-text text-xl md:text-2xl leading-relaxed max-w-2xl text-white/90">
              TasteOfOdisha is not just a boutique; it is a living archive. We exist to protect, promote, and sustain the 2,500-year-old cultural legacy of the Odisha region.
            </p>
          </div>
        </div>
      </section>

      {/* 02. The Mission Grid */}
      <section className="py-24 md:py-32">
        <div className="container-sanctuary">
           <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-32 items-center">
              <div className="relative aspect-[4/5] rounded-xl overflow-hidden shadow-2xl group">
                <Image 
                  src="/TASTE%20OF%20ODISHA/MURUKU%20100gram_-%E2%82%B939/Masala%20murukku/WhatsApp%20Image%202026-05-29%20at%2012.31.56%20AM%20(1).jpeg" 
                  alt="Taste Of Odisha Artisan Work" 
                  fill 
                  className="object-cover transition-transform duration-[3s] group-hover:scale-110" 
                />
                 <div className="absolute inset-0 bg-gradient-to-t from-heritage-dark/60 to-transparent"></div>
                 <div className="absolute bottom-10 left-10 text-white space-y-2">
                    <p className="text-[10px] font-bold uppercase tracking-[0.4em]">The Artisan Legacy</p>
                    <p className="text-2xl font-serif italic">Every recipe tells a story.</p>
                 </div>
              </div>

              <div className="space-y-12">
                  <div className="space-y-6">
                     <h2 className="text-3xl font-serif font-bold text-heritage-dark italic">Our Sacred Mission</h2>
                     <p className="body-text text-lg">
                        TasteOfOdisha was born out of a desire to reclaim the narrative of Odisha's rich heritage. We work directly with a collective of over 500 women artisans across rural Odisha, ensuring their ancestral skills translate into economic independence.
                     </p>
                     <p className="body-text opacity-70">
                        In a world of mass production, we celebrate the slow, the deliberate, and the heart-made. From the unique flavors of handcrafted Achar to the crunchy delight of our Muruku mixtures, each product in our sanctuary is a culinary piece of history verified for authenticity.
                     </p>
                     <p className="body-text opacity-70">
                        By eliminating intermediaries, we ensure that over 70% of the proceeds go directly back to the artisan collectives, fostering a cycle of dignity and preservation.
                     </p>
                  </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 border-t border-heritage-dark/5">
                    {[
                      { icon: Users, title: 'Artisan Owned', desc: 'Direct profit-sharing models for rural upliftment.' },
                      { icon: Globe, title: 'Global Reach', desc: 'Connecting ancient Odisha to the modern world.' },
                      { icon: ShieldCheck, title: 'Auth-Verified', desc: 'Strict GI tag and heritage quality controls.' },
                      { icon: Heart, title: 'Pure Origin', desc: '100% natural, ethical, and authentic food items.' }
                    ].map((item, i) => (
                      <div key={i} className="space-y-3">
                         <item.icon className="w-5 h-5 text-primary" />
                         <h4 className="text-sm font-bold text-heritage-dark uppercase tracking-widest">{item.title}</h4>
                         <p className="text-xs text-heritage-dark/60 leading-relaxed font-medium">{item.desc}</p>
                      </div>
                    ))}
                 </div>
              </div>
           </div>
        </div>
      </section>

      {/* 03. The Promise Banner */}
      <section className="container-sanctuary pb-24">
         <div className="bg-heritage-dark rounded-xl p-12 md:p-24 text-center relative overflow-hidden flex flex-col items-center gap-10">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/black-linen.png')] opacity-10"></div>
            <span className="label-text text-primary relative z-10">The Sanctuary Promise</span>
            <h2 className="text-3xl md:text-5xl font-serif font-bold text-heritage-bone italic leading-tight max-w-4xl relative z-10">
              "We provide a bridge between ancient craftsmanship and contemporary lives, ensuring that tradition is not a memory, but a future."
            </h2>
            <Link href="/products" className="btn-primary relative z-10 flex items-center gap-3">
               Explore The Collection <ArrowRight className="w-4 h-4" />
            </Link>
         </div>
      </section>

      {/* 04. Transparency & Contact */}
      <section className="bg-heritage-bone/30 py-24 border-t border-heritage-dark/5">
        <div className="container-sanctuary text-center max-w-2xl mx-auto space-y-12">
            <h3 className="text-2xl font-serif font-bold text-heritage-dark italic">Manifest with Integrity</h3>
            <p className="body-text">
               Every heritage piece is packaged in eco-conscious martabans and recycled handloom fabric, honoring the earth as much as the art.
            </p>
            <div className="flex flex-col md:flex-row items-center justify-center gap-8 pt-10 border-t border-heritage-dark/10">
               <Link href="/contact" className="text-[10px] font-bold uppercase tracking-widest text-primary border-b-2 border-primary/20 hover:border-primary transition-all pb-2">
                  Inquire further
               </Link>
               <span className="w-1.5 h-1.5 bg-heritage-dark/10 rounded-full"></span>
               <Link href="/return-policy" className="text-[10px] font-bold uppercase tracking-widest text-primary border-b-2 border-primary/20 hover:border-primary transition-all pb-2">
                  Heritage Assurance
               </Link>
            </div>
        </div>
      </section>
    </main>
  );
}

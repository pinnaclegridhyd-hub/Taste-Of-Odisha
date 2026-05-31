import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Shipping Policy | Taste Of Odisha',
  description: 'Read our shipping and delivery policy',
};

export default function ShippingPolicyPage() {
  return (
    <main className="min-h-screen bg-secondary pb-32 pt-28">
      <section className="bg-heritage-bone border-b border-heritage-dark/5 py-12 md:py-20 mb-12">
        <div className="container-sanctuary">
           <span className="label-text text-primary">Logistics Archive</span>
           <h1 className="h1 lowercase first-letter:uppercase text-heritage-dark mt-4">
             Artisan <br /><span className="italic font-normal text-primary">Transit.</span>
           </h1>
           <p className="body-text text-lg mt-6 max-w-2xl">
             From the rural heartlands of Odisha to your doorstep, every acquisition is traveling on a voyage of preservation.
           </p>
        </div>
      </section>

      <div className="container-sanctuary">
        <div className="max-w-4xl space-y-16">
          <section className="space-y-6">
            <h2 className="text-2xl font-serif font-bold text-heritage-dark border-l-2 border-primary pl-6 italic">Delivery Horizons</h2>
            <p className="body-text">
              We provide professional heritage passage to all locations across India. Typical transit times range from <span className="text-primary font-bold">5-7 operational days</span>.
            </p>
          </section>

          <section className="space-y-8">
            <h2 className="text-2xl font-serif font-bold text-heritage-dark border-l-2 border-primary pl-6 italic">Transit Contributions</h2>
            <div className="bg-heritage-bone p-8 rounded-xl border border-heritage-dark/5 space-y-4">
               <div className="flex justify-between items-center pb-4 border-b border-heritage-dark/10">
                  <span className="label-text">Orders above ₹999</span>
                  <span className="text-primary font-bold uppercase tracking-widest text-[10px]">Complimentary</span>
               </div>
               <div className="flex justify-between items-center">
                  <span className="label-text">Acquisitions below ₹999</span>
                  <span className="text-heritage-dark font-bold text-sm">₹99 Transit Fee</span>
               </div>
            </div>
          </section>

          <section className="space-y-8">
            <h2 className="text-2xl font-serif font-bold text-heritage-dark border-l-2 border-primary pl-6 italic">The Voyage Protocol</h2>
            <div className="space-y-12">
               {[
                 { step: '01', title: 'Manifest Confirmation', desc: 'Secure order validation via heritage correspondence.' },
                 { step: '02', title: 'Payment Sanctuary', desc: 'Encrypted verification of the sacred exchange (1-2 days).' },
                 { step: '03', title: 'Artisan Dispatch', desc: 'Secure martaban packaging and archive dispatch (2-3 days).' },
                 { step: '04', title: 'Passage Tracking', desc: 'Real-time transit surveillance via SMS/Email.' },
                 { step: '05', title: 'Arrival', desc: 'Port-to-port delivery at your specified destination.' }
               ].map((item, i) => (
                 <div key={i} className="flex items-start gap-8 group">
                    <span className="text-4xl font-serif italic text-primary/20 group-hover:text-primary transition-colors duration-700 leading-none">{item.step}</span>
                    <div className="space-y-2">
                       <h4 className="label-text text-heritage-dark">{item.title}</h4>
                       <p className="body-text text-sm opacity-70">{item.desc}</p>
                    </div>
                 </div>
               ))}
            </div>
          </section>

          <section className="space-y-6">
            <h2 className="text-2xl font-serif font-bold text-heritage-dark border-l-2 border-primary pl-6 italic">Transit Vigilance</h2>
            <p className="body-text">
              Our courier partners manifest up to 2 delivery attempts. Should the voyage fail due to unavailability, the artifact will return to its origin for sanctuary. For damage reportage, please notify us within <span className="text-primary font-bold">48 operational hours</span>.
            </p>
          </section>

          <div className="pt-12 border-t border-heritage-dark/5 flex justify-between items-center text-[10px] font-bold uppercase tracking-widest text-heritage-dark/30">
             <span>Logistics Protocol v3.1</span>
             <span>Ref: {new Date().getFullYear()} Archive</span>
          </div>
        </div>

        {/* Support CTA */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-2 gap-8">
          <Link href="/return-policy" className="bg-white p-10 rounded-xl border border-heritage-dark/5 shadow-sm hover:shadow-md transition-all group">
             <h3 className="label-text group-hover:text-primary transition-colors">Return Assurance</h3>
             <p className="body-text text-xs opacity-50 mt-2">Learn about our refund manifestations.</p>
          </Link>
          <Link href="/contact" className="bg-white p-10 rounded-xl border border-heritage-dark/5 shadow-sm hover:shadow-md transition-all group">
             <h3 className="label-text group-hover:text-primary transition-colors">Heritage Liaison</h3>
             <p className="body-text text-xs opacity-50 mt-2">Speak directly with a curator.</p>
          </Link>
        </div>
      </div>
    </main>
  );
}

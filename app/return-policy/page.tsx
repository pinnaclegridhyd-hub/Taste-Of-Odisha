import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Return Policy | Taste Of Odisha',
  description: 'Read our return and refund policy',
};

export default function ReturnPolicyPage() {
  return (
    <main className="min-h-screen bg-secondary pb-32 pt-28">
      <section className="bg-heritage-bone border-b border-heritage-dark/5 py-12 md:py-20 mb-12">
        <div className="container-sanctuary">
           <span className="label-text text-primary">Policy Archive</span>
           <h1 className="h1 lowercase first-letter:uppercase text-heritage-dark mt-4">
             Heritage <br /><span className="italic font-normal text-primary">Assurance.</span>
           </h1>
           <p className="body-text text-lg mt-6 max-w-2xl">
             Every masterpiece in our sanctuary is handled with meticulous care. Our assurance policy ensures your journey with Odisha heritage remains immaculate.
           </p>
        </div>
      </section>

      <div className="container-sanctuary">
        <div className="max-w-4xl space-y-16">
          <section className="space-y-6">
            <h2 className="text-2xl font-serif font-bold text-heritage-dark border-l-2 border-primary pl-6 italic">The Assurance Window</h2>
            <p className="body-text">
              You can initiate a return or exchange manifest within <span className="text-primary font-bold">7 solar days</span> from the date of heritage delivery.
            </p>
          </section>

          <section className="space-y-8">
            <h2 className="text-2xl font-serif font-bold text-heritage-dark border-l-2 border-primary pl-6 italic">Return Eligibility</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               <ul className="space-y-4">
                 {[
                   'Product is in its original, untouched condition',
                   'All heritage tags and seals remain intact',
                   'Original handloom packaging is preserved',
                   'Initiated within the 7-day assurance window'
                 ].map((item, i) => (
                   <li key={i} className="flex gap-4 items-center body-text text-sm">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full shrink-0"></div>
                      {item}
                   </li>
                 ))}
               </ul>
            </div>
          </section>

          <section className="space-y-8">
            <h2 className="text-2xl font-serif font-bold text-heritage-dark border-l-2 border-primary pl-6 italic">The Restoration Process</h2>
            <div className="space-y-12">
               {[
                 { step: '01', title: 'Connect', desc: 'Notify the curation team at tasteofodisha1996@gmail.com with your order code.' },
                 { step: '02', title: 'Verification', desc: 'Our curators will authenticate the request within 24 operational hours.' },
                 { step: '03', title: 'Logistics', desc: 'A secure heritage courier will be scheduled for professional collection.' },
                 { step: '04', title: 'Restoration', desc: 'Once verified at the origin, your final balance will be manifest within 7 days.' }
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

          <section className="bg-heritage-bone p-10 rounded-xl border border-heritage-dark/5 space-y-6">
            <h2 className="text-xl font-bold text-heritage-dark">Artifact Exceptions</h2>
            <p className="body-text text-sm opacity-70">
              The following categories remain final acquisitions and cannot be manifest for return:
            </p>
            <div className="grid grid-cols-2 gap-4">
               {['Culinary Heritage', 'Used Garments', 'Artifact Damage', 'Custom Commissions'].map(item => (
                 <div key={item} className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-widest text-heritage-red">
                    <span className="w-1.5 h-1.5 bg-heritage-red rounded-full"></span> {item}
                 </div>
               ))}
            </div>
          </section>

          <div className="pt-12 border-t border-heritage-dark/5 flex justify-between items-center text-[10px] font-bold uppercase tracking-widest text-heritage-dark/30">
             <span>Sanctuary Protocol v2.4</span>
             <span>Ref: {new Date().getFullYear()} Lineage</span>
          </div>
        </div>

        {/* Support CTA */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-2 gap-8">
          <Link href="/shipping-policy" className="bg-white p-10 rounded-xl border border-heritage-dark/5 shadow-sm hover:shadow-md transition-all group">
             <h3 className="label-text group-hover:text-primary transition-colors">Shipping Protocol</h3>
             <p className="body-text text-xs opacity-50 mt-2">Learn about our secure artisan transit.</p>
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

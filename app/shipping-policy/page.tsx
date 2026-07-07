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
           <span className="label-text text-primary">Shipping Center</span>
           <h1 className="h1 lowercase first-letter:uppercase text-heritage-dark mt-4">
             Standard <br /><span className="italic font-normal text-primary">Shipping Policy.</span>
           </h1>
           <p className="body-text text-lg mt-6 max-w-2xl">
             From the heart of Odisha to your doorstep, we ensure every order is delivered with care.
           </p>
        </div>
      </section>

      <div className="container-sanctuary">
        <div className="max-w-4xl space-y-16">
          <section className="space-y-6">
            <h2 className="text-2xl font-serif font-bold text-heritage-dark border-l-2 border-primary pl-6 italic">Delivery Timeline</h2>
            <p className="body-text">
              We provide professional shipping to all locations across India. Typical transit times range from <span className="text-primary font-bold">5-7 business days</span>.
            </p>
          </section>

          <section className="space-y-8">
            <h2 className="text-2xl font-serif font-bold text-heritage-dark border-l-2 border-primary pl-6 italic">Shipping Fees</h2>
            <div className="bg-heritage-bone p-8 rounded-xl border border-heritage-dark/5 space-y-4">
               <div className="flex justify-between items-center pb-4 border-b border-heritage-dark/10">
                  <span className="label-text">Orders above ₹999</span>
                  <span className="text-primary font-bold uppercase tracking-widest text-[10px]">Complimentary</span>
               </div>
               <div className="flex justify-between items-center">
                  <span className="label-text">Orders below ₹999</span>
                  <span className="text-heritage-dark font-bold text-sm">₹99 Shipping Fee</span>
               </div>
            </div>
          </section>

          <section className="space-y-8">
            <h2 className="text-2xl font-serif font-bold text-heritage-dark border-l-2 border-primary pl-6 italic">Delivery Process</h2>
            <div className="space-y-12">
               {[
                 { step: '01', title: 'Order Confirmation', desc: 'Secure order validation via email notification.' },
                 { step: '02', title: 'Payment Verification', desc: 'Encrypted verification of the transaction (1-2 days).' },
                 { step: '03', title: 'Dispatch', desc: 'Secure packaging and dispatch (2-3 days).' },
                 { step: '04', title: 'Tracking', desc: 'Real-time tracking updates via SMS/Email.' },
                 { step: '05', title: 'Arrival', desc: 'Delivery at your specified destination.' }
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
            <h2 className="text-2xl font-serif font-bold text-heritage-dark border-l-2 border-primary pl-6 italic">Delivery Notes</h2>
            <p className="body-text">
              Our courier partners make up to 2 delivery attempts. Should the delivery fail due to unavailability, the product will return to its origin for safety. For damaged products, please notify us within <span className="text-primary font-bold">48 hours</span>.
            </p>
          </section>

          <div className="pt-12 border-t border-heritage-dark/5 flex justify-between items-center text-[10px] font-bold uppercase tracking-widest text-heritage-dark/30">
             <span>Shipping & Delivery Policy</span>
             <span>Taste of Odisha</span>
          </div>
        </div>

        {/* Support CTA */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* <Link href="/return-policy" className="bg-white p-10 rounded-xl border border-heritage-dark/5 shadow-sm hover:shadow-md transition-all group">
             <h3 className="label-text group-hover:text-primary transition-colors">Return Policy</h3>
             <p className="body-text text-xs opacity-50 mt-2">Learn about our refund conditions.</p>
          </Link> */}
          <Link href="/contact" className="bg-white p-10 rounded-xl border border-heritage-dark/5 shadow-sm hover:shadow-md transition-all group">
             <h3 className="label-text group-hover:text-primary transition-colors">Customer Support</h3>
             <p className="body-text text-xs opacity-50 mt-2">Get in touch with us.</p>
          </Link>
        </div>
      </div>
    </main>
  );
}

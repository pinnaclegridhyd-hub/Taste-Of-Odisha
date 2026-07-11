import { Metadata } from 'next';
import Link from 'next/link';
import { Mail, Phone, MapPin, Clock, MessageCircle, ShieldCheck, HeartHandshake, ChevronRight, ArrowLeft } from 'lucide-react';
import { SUPPORT_PHONE_E164, SUPPORT_PHONE_NUMBER } from '@/lib/support';

export const metadata: Metadata = {
  title: 'Contact Us | Taste Of Odisha',
  description: 'Reach out to the heart of Odisha heritage for inquiries and support.',
};

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-secondary pb-32 pt-28">
      {/* Refined Sanctuary Header */}
      <section className="bg-heritage-bone border-b border-heritage-dark/5 py-12 md:py-20">
        <div className="container-sanctuary">
          <div className="max-w-3xl space-y-6">
            <span className="label-text text-primary">Get in Touch</span>
            <h1 className="h1 lowercase first-letter:uppercase text-heritage-dark">
              Heritage <br /><span className="italic font-normal text-primary">Concierge.</span>
            </h1>
            <p className="body-text text-lg">
              Whether you have a query about a specific heritage piece or wish to discuss a custom commission, our curators are here to assist you.
            </p>
          </div>
        </div>
      </section>

      <div className="container-sanctuary py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-start">
          
          {/* Primary Contact Methods */}
          <div className="lg:col-span-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-8 rounded-xl border border-heritage-dark/5 shadow-sm space-y-4">
              <Mail className="w-6 h-6 text-primary" />
              <h3 className="label-text">Digital Correspondence</h3>
              <a href="mailto:tasteofodisha1996@gmail.com" className="text-lg xl:text-xl font-bold text-heritage-dark hover:text-primary transition-colors block break-all underline decoration-primary/20 hover:decoration-primary underline-offset-4">
                tasteofodisha1996@gmail.com
              </a>
            </div>

            <div className="bg-white p-8 rounded-xl border border-heritage-dark/5 shadow-sm space-y-4">
              <Phone className="w-6 h-6 text-primary" />
              <h3 className="label-text">Voice Assistance</h3>
              <a href={`tel:+91${SUPPORT_PHONE_NUMBER}`} className="text-xl font-bold text-heritage-dark hover:text-primary transition-colors block">
                +91 63703 64700
              </a>
            </div>

            <div className="bg-white p-8 rounded-xl border border-heritage-dark/5 shadow-sm space-y-4">
              <MapPin className="w-6 h-6 text-primary" />
              <h3 className="label-text">Heritage Origin</h3>
              <p className="text-xl font-bold text-heritage-dark leading-snug">
                Puri Region, <br />Odisha, India
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl border border-heritage-dark/5 shadow-sm space-y-4">
              <Clock className="w-6 h-6 text-primary" />
              <h3 className="label-text">Concierge Hours</h3>
              <p className="text-xl font-bold text-heritage-dark leading-snug">
                Mon - Sat <br />10 AM - 7 PM IST
              </p>
            </div>
          </div>

          {/* Secondary Features & Visuals */}
          <div className="lg:col-span-12 grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
            <div className="bg-heritage-dark rounded-xl p-10 md:p-16 flex flex-col justify-center gap-8 text-white relative overflow-hidden group min-h-[300px]">
               <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-[100px] opacity-20 transition-all group-hover:opacity-40"></div>
               <div className="relative z-10 space-y-4 text-left">
                  <span className="text-primary text-[10px] font-bold uppercase tracking-[0.4em]">Fast Response</span>
                  <h2 className="text-3xl md:text-4xl font-serif font-bold italic text-heritage-bone">
                    Instant WhatsApp Concierge
                  </h2>
                  <p className="text-heritage-bone/60 font-medium">
                    Connect directly with our curation team for immediate support and live heritage updates.
                  </p>
               </div>
               <Link href={`https://wa.me/${SUPPORT_PHONE_E164}`} className="btn-primary w-fit flex items-center gap-3">
                  Start Chat <MessageCircle className="w-4 h-4" />
               </Link>
            </div>

            <div className="bg-heritage-bone rounded-xl p-10 md:p-16 space-y-8 border border-heritage-dark/5">
                <h3 className="text-xl font-serif font-bold text-heritage-dark border-b-2 border-primary/20 pb-4 w-fit">Support Pillars</h3>
                <div className="space-y-6">
                   {[
                     { icon: HeartHandshake, title: 'Community Welfare', desc: 'Queries regarding fair trade and community support programs.' },
                     { icon: ShieldCheck, title: 'Authenticity Check', desc: 'Concerns about GI tags and heritage certifications.' },
                   ].map((item, i) => (
                     <div key={i} className="flex items-start gap-4 text-left">
                        <item.icon className="w-5 h-5 text-primary mt-1" />
                        <div className="space-y-1">
                           <p className="text-sm font-bold text-heritage-dark">{item.title}</p>
                           <p className="text-sm text-heritage-dark/60 font-medium leading-relaxed italic">{item.desc}</p>
                        </div>
                     </div>
                   ))}
                </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

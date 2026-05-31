import { Star, Quote, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
const testimonials = [
  {
    id: 1,
    name: 'Anjali Sharma',
    location: 'New Delhi',
    text: 'The Rasikhaja I ordered was exquisite. The detail is incredible, and you can really feel the heritage in it. It brought the authentic taste of Odisha right to my home.',
    rating: 5,
  },
  {
    id: 2,
    name: 'Rahul Mishra',
    location: 'Mumbai',
    text: 'Ordered the festive pack for the New Year. Everything from the sweets to the savory mixtures was authentic and high quality. Reminded me of my childhood.',
    rating: 5,
  },
  {
    id: 3,
    name: 'Priyanka Jha',
    location: 'Patna',
    text: 'Finally a place where I can get authentic Odisha sweets. The quality of the ingredients and the traditional preparation are just perfect for special occasions.',
    rating: 5,
  },
  {
    id: 4,
    name: 'Vikram Singh',
    location: 'Bangalore',
    text: 'The onion mixture is a revelation. Clean, crisp, and flavored perfectly. A trusted source for authentic Odisha snacks.',
    rating: 5,
  },
  {
    id: 5,
    name: 'Sushmita Dash',
    location: 'Lucknow',
    text: 'Beautiful preparation. Each bite feels like it has a story to tell. Proud to support local women from Odisha.',
    rating: 5,
  },
];

const TestimonialsSection: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, offsetWidth } = scrollRef.current;
      const index = Math.round(scrollLeft / (offsetWidth * 0.82)); 
      if (index !== activeIndex) {
        setActiveIndex(index);
      }
    }
  };

  return (
    <section className="py-24 bg-heritage-bone/30 overflow-hidden">
      <div className="container-sanctuary">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-4 px-4">
          <span className="label-text text-primary">Community Stories</span>
          <h2 className="h2 lowercase first-letter:uppercase text-heritage-dark">
            Trusted Odisha heritage.
          </h2>
          <p className="body-text text-sm italic">Real feedback from our collection of heritage lovers.</p>
        </div>

        {/* Desktop Grid / Mobile Slider */}
        <div 
          ref={scrollRef}
          onScroll={handleScroll}
          className="flex overflow-x-auto md:grid md:grid-cols-3 gap-6 pb-12 md:pb-0 px-4 md:px-0 no-scrollbar snap-x snap-mandatory scroll-smooth"
        >
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="min-w-[82vw] md:min-w-0 snap-center bg-white p-8 md:p-10 rounded-2xl border border-heritage-dark/5 relative shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div className="space-y-6">
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${i < testimonial.rating ? 'text-primary fill-primary' : 'text-heritage-dark/10'
                        }`}
                    />
                  ))}
                </div>

                <p className="text-heritage-dark/80 italic text-lg leading-relaxed font-medium">
                  "{testimonial.text}"
                </p>
              </div>

              <div className="mt-8 flex items-center justify-between">
                <div>
                  <p className="font-bold text-heritage-dark">{testimonial.name}</p>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-primary/60">{testimonial.location}</p>
                </div>
                <Quote className="w-8 h-8 text-primary/10" />
              </div>
            </div>
          ))}
        </div>

        {/* Mobile Swipe Indicators */}
        <div className="md:hidden flex justify-center mt-4 gap-2">
          {testimonials.map((_, i) => (
            <div 
              key={i} 
              className={`h-1.5 rounded-full transition-all duration-300 ${
                activeIndex === i ? 'w-6 bg-primary' : 'w-1.5 bg-heritage-dark/10'
              }`}
            ></div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;



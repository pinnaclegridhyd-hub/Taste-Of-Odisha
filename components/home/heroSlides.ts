/**
 * Hero Carousel Slide Configuration
 * -----------------------------------
 * Add, remove, or reorder slides here — no component changes needed.
 * Images should be placed in /public and referenced with absolute paths.
 *
 * If `mobileImage` is provided it will be used on screens < 768px,
 * otherwise `image` is used at every breakpoint.
 */

export interface HeroSlide {
  id: string;
  /** Background image path (relative to /public) */
  image: string;
  /** Optional portrait-cropped image for mobile (<768px) */
  mobileImage?: string;
  /** Small label above the heading */
  eyebrowText: string;
  /** Main heading (first line) */
  heading: string;
  /** Accented / italic portion of the heading */
  highlightText: string;
  /** Supporting paragraph */
  description: string;
  /** CTA button label */
  ctaLabel: string;
  /** CTA link destination */
  ctaHref: string;
  /** Optional small badge text pinned at bottom-right */
  badgeText?: string;
}

export const heroSlides: HeroSlide[] = [
  {
    id: 'heritage',
    image:
      '/TASTE%20OF%20ODISHA/SWEET%20VARIETIES%20200gram_-%E2%82%B979/ADISHA/file_00000000863472068221015270da6fee.png',
    eyebrowText: 'Legacy of Odisha',
    heading: 'Ancient Heritage',
    highlightText: 'Modern Elegance.',
    description:
      "Preserving Odisha\u2019s 2,500-year-old traditions through authentic foods, artisanal snacks, and savory mixtures. Crafted by women, delivered to your doorstep.",
    ctaLabel: 'Explore Collection',
    ctaHref: '/products',
    badgeText: 'Order on Instagram @tasteofodisha1996',
  },
  {
    id: 'gudo',
    image:
      '/TASTE%20OF%20ODISHA/SWEET%20VARIETIES%20200gram_-%E2%82%B979/ADISHA/WhatsApp%20Image%202026-05-31%20at%2012.32.02%20AM.jpeg',
    eyebrowText: 'Authentic Flavors',
    heading: 'Pure Gudo. Pure Taste.',
    highlightText: 'Pure Odisha.',
    description:
      'Crafted from pure jaggery (gudo) using time-honored Odia recipes. Every bite is a journey to the heartland of authentic sweetness.',
    ctaLabel: 'Shop Now',
    ctaHref: '/products?category=sweets',
  },
  {
    id: 'festive-achar',
    image:
      '/TASTE%20OF%20ODISHA/BERHAMPUR%20ACHAR_-500gram%20%20%E2%82%B9249/MIX%20SWEET%20ACHAR/file_00000000702071f59e0e244874ece619.png',
    eyebrowText: 'Festive Season',
    heading: 'Festive Achar Collection',
    highlightText: 'Free Shipping Over \u20B9999',
    description:
      '28+ varieties of authentic Berhampur-style achar — from tangy ambasoda to fiery red chilli. Stock up for the season!',
    ctaLabel: 'View Offers',
    ctaHref: '/products?category=achar',
  },
];

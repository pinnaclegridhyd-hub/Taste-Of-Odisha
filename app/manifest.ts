import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Taste Of Odisha',
    short_name: 'Taste Of Odisha',
    description: 'Authentic Odisha food and heritage products.',
    start_url: '/',
    display: 'standalone',
    background_color: '#f8f5f0',
    theme_color: '#8b1d1d',
    icons: [{ src: '/images/logo-too.jpeg', sizes: '192x192', type: 'image/jpeg' }],
  };
}

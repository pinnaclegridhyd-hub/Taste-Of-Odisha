/** Route remote images through our server when their host blocks browser hotlinking. */
export function getDisplayImageUrl(src?: string): string {
  if (!src) return '/images/logo-too.jpeg';
  if (/^https?:\/\//i.test(src)) return `/api/image-proxy?url=${encodeURIComponent(src)}`;
  // Product assets use names with spaces and Unicode characters. Serving them
  // through the same route avoids CDN path-normalisation failures in production.
  return `/api/image-proxy?path=${encodeURIComponent(src)}`;
}

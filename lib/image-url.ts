/** Route remote images through our server when their host blocks browser hotlinking. */
export function getDisplayImageUrl(src?: string): string {
  if (!src) return '/images/logo-too.jpeg';
  const normalized = src.trim().replace(/\\/g, '/');
  if (/^https?:\/\//i.test(normalized)) return `/api/image-proxy?url=${encodeURIComponent(normalized)}`;
  const directPath = normalized.startsWith('/') ? normalized : `/${normalized}`;
  return encodeURI(directPath);
}

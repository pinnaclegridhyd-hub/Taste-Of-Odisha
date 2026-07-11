export function getDisplayImageUrl(src?: string): string {
  if (!src) return '/images/logo-too.jpeg';
  const normalized = src.trim().replace(/\\/g, '/');
  
  if (/^https?:\/\//i.test(normalized)) {
    try {
      const url = new URL(normalized);
      const host = url.hostname.toLowerCase();
      const isLocal = host === 'localhost' ||
                      host === '127.0.0.1' ||
                      host === '0.0.0.0' ||
                      host === '::1' ||
                      host.endsWith('.local') ||
                      /^10\.|^127\.|^169\.254\.|^192\.168\.|^172\.(1[6-9]|2\d|3[0-1])\./.test(host);
      
      if (isLocal) {
        let path = url.pathname + url.search + url.hash;
        try {
          path = decodeURIComponent(path);
        } catch {
          // Ignore decode error
        }
        const directPath = path.startsWith('/') ? path : `/${path}`;
        return encodeURI(directPath);
      }
    } catch {
      // Ignore URL parsing errors
    }

    return `/api/image-proxy?url=${encodeURIComponent(normalized)}`;
  }
  
  const directPath = normalized.startsWith('/') ? normalized : `/${normalized}`;
  
  // Safe decode and then encodeURI to prevent double encoding
  let decodedPath = directPath;
  try {
    decodedPath = decodeURIComponent(directPath);
  } catch {
    try {
      decodedPath = decodeURI(directPath);
    } catch {
      // Ignore errors
    }
  }
  
  return encodeURI(decodedPath);
}

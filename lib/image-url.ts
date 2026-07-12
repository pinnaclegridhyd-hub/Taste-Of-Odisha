export function getDisplayImageUrl(src?: string): string {
  if (!src) return '/images/logo-too.jpeg';
  const normalized = src.trim().replace(/\\/g, '/');

  if (/^https?:\/\//i.test(normalized)) {
    let host = '';
    try {
      const url = new URL(normalized);
      host = url.hostname.toLowerCase();
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

    // Handle Google Drive links to ensure they use the direct download/content endpoint
    let targetUrl = normalized;
    if (host && host.includes('drive.google.com')) {
      const match = normalized.match(/\/file\/d\/([^\/]+)/) || normalized.match(/[?&]id=([^&]+)/);
      if (match && match[1]) {
        targetUrl = `https://drive.google.com/uc?export=download&id=${match[1]}`;
      }
    }

    return `/api/image-proxy?url=${encodeURIComponent(targetUrl)}`;
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

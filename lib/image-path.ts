export function normalizeProductImagePath(value?: string): string {
  if (!value) return '';

  let trimmed = value.trim().replace(/\\/g, '/');
  if (!trimmed) return '';

  // If it is a local/development URL, convert it to a relative path
  if (/^https?:\/\//i.test(trimmed)) {
    try {
      const url = new URL(trimmed);
      const host = url.hostname.toLowerCase();
      const isLocal = host === 'localhost' ||
                      host === '127.0.0.1' ||
                      host === '0.0.0.0' ||
                      host === '::1' ||
                      host.endsWith('.local') ||
                      /^10\.|^127\.|^169\.254\.|^192\.168\.|^172\.(1[6-9]|2\d|3[0-1])\./.test(host);
      
      if (isLocal) {
        trimmed = url.pathname + url.search + url.hash;
        try {
          trimmed = decodeURIComponent(trimmed);
        } catch {
          // Ignore decode errors
        }
      }
    } catch {
      // Ignore URL parsing errors
    }
  }

  if (/^https?:\/\//i.test(trimmed)) return trimmed;

  if (trimmed.startsWith('/')) return trimmed;
  if (trimmed.startsWith('public/')) return `/${trimmed.slice('public/'.length)}`;

  return `/${trimmed}`;
}

export function normalizeProductImageList(values?: string[] | null): string[] {
  if (!Array.isArray(values)) return [];
  return values
    .map((value) => normalizeProductImagePath(value))
    .filter(Boolean);
}

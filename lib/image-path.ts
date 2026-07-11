export function normalizeProductImagePath(value?: string): string {
  if (!value) return '';

  const trimmed = value.trim().replace(/\\/g, '/');
  if (!trimmed) return '';
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

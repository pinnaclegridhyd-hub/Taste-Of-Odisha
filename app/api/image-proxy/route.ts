import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';

const BLOCKED_HOSTS = new Set(['localhost', '0.0.0.0', '127.0.0.1', '::1']);

function isSafeImageUrl(value: string): boolean {
  try {
    const url = new URL(value);
    if (!['http:', 'https:'].includes(url.protocol) || url.username || url.password) return false;
    const host = url.hostname.toLowerCase();
    return !BLOCKED_HOSTS.has(host) && !host.endsWith('.local') &&
      !/^10\.|^127\.|^169\.254\.|^192\.168\.|^172\.(1[6-9]|2\d|3[0-1])\./.test(host);
  } catch {
    return false;
  }
}

/** Serves a remote product image when a source blocks direct browser embedding. */
export async function GET(request: NextRequest) {
  const source = request.nextUrl.searchParams.get('url');

  if (!source || !isSafeImageUrl(source)) {
    return NextResponse.json({ error: 'Invalid image URL' }, { status: 400 });
  }

  try {
    const response = await fetch(source, {
      headers: { Accept: 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8' },
      redirect: 'follow',
      signal: AbortSignal.timeout(10_000),
    });
    const contentType = response.headers.get('content-type') || '';
    if (!response.ok || !contentType.startsWith('image/')) {
      return NextResponse.json({ error: 'The URL did not return an image' }, { status: 422 });
    }
    return new NextResponse(await response.arrayBuffer(), {
      headers: { 'Content-Type': contentType, 'Cache-Control': 'public, max-age=86400, s-maxage=604800' },
    });
  } catch {
    return NextResponse.json({ error: 'Unable to retrieve image' }, { status: 502 });
  }
}

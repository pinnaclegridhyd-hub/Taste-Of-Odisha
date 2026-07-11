import { NextRequest, NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import path from 'path';
import { access, readdir } from 'fs/promises';

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

function normalizePublicPath(input: string): string {
  return input
    .replace(/\\/g, '/')
    .replace(/^\/public\//i, '/')
    .replace(/^public\//i, '/');
}

async function findPublicAsset(publicDirectory: string, requestedPath: string): Promise<string | null> {
  const normalized = normalizePublicPath(requestedPath);
  const directPath = path.resolve(publicDirectory, `.${normalized}`);

  try {
    await access(directPath);
    return directPath;
  } catch {
    // Fall through to fuzzy lookup below.
  }

  const targetName = path.basename(normalized).toLowerCase();
  const queue = [publicDirectory];

  while (queue.length > 0) {
    const currentDir = queue.shift()!;
    const entries = await readdir(currentDir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(currentDir, entry.name);
      if (entry.isDirectory()) {
        queue.push(fullPath);
        continue;
      }

      if (entry.isFile() && entry.name.toLowerCase() === targetName) {
        return fullPath;
      }
    }
  }

  return null;
}

/** Serves a remote product image when a source blocks direct browser embedding. */
export async function GET(request: NextRequest) {
  const source = request.nextUrl.searchParams.get('url');
  const localPath = request.nextUrl.searchParams.get('path');

  if (localPath) {
    const publicDirectory = path.resolve(process.cwd(), 'public');
    const filePath = await findPublicAsset(publicDirectory, localPath);
    if (!filePath) {
      return NextResponse.json({ error: 'Image not found' }, { status: 404 });
    }
    if (!filePath.startsWith(`${publicDirectory}${path.sep}`)) {
      return NextResponse.json({ error: 'Invalid image path' }, { status: 400 });
    }

    const extension = path.extname(filePath).toLowerCase();
    const contentTypes: Record<string, string> = { '.avif': 'image/avif', '.gif': 'image/gif', '.jpeg': 'image/jpeg', '.jpg': 'image/jpeg', '.png': 'image/png', '.svg': 'image/svg+xml', '.webp': 'image/webp' };
    if (!contentTypes[extension]) return NextResponse.json({ error: 'Unsupported image type' }, { status: 400 });

    try {
      return new NextResponse(await readFile(filePath), {
        headers: { 'Content-Type': contentTypes[extension], 'Cache-Control': 'public, max-age=86400, s-maxage=604800' },
      });
    } catch {
      return NextResponse.json({ error: 'Image not found' }, { status: 404 });
    }
  }

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

import { NextRequest, NextResponse } from 'next/server';

/**
 * Simple in-memory rate limiter
 * Stores request timestamps per IP
 */
class RateLimiter {
  private requests: Map<string, number[]> = new Map();
  private maxRequests: number;
  private windowMs: number;

  constructor(maxRequests: number = 10, windowMs: number = 60 * 1000) {
    this.maxRequests = maxRequests;
    this.windowMs = windowMs; // 1 minute by default
  }

  isAllowed(identifier: string): boolean {
    const now = Date.now();
    const windowStart = now - this.windowMs;

    if (!this.requests.has(identifier)) {
      this.requests.set(identifier, []);
    }

    const timestamps = this.requests.get(identifier)!;

    // Remove old timestamps outside the window
    const recentTimestamps = timestamps.filter((t) => t > windowStart);

    if (recentTimestamps.length >= this.maxRequests) {
      return false;
    }

    // Add current request timestamp
    recentTimestamps.push(now);
    this.requests.set(identifier, recentTimestamps);

    return true;
  }

  reset(identifier?: string) {
    if (identifier) {
      this.requests.delete(identifier);
    } else {
      this.requests.clear();
    }
  }
}

// Create limiters for different endpoints
export const createOrderLimiter = new RateLimiter(10, 60 * 1000); // 10 requests per minute
export const verifyPaymentLimiter = new RateLimiter(10, 60 * 1000); // 10 requests per minute

/**
 * Get client IP from request
 */
export function getClientIP(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }

  return request.headers.get('x-real-ip') || 'unknown';
}

/**
 * Rate limiting middleware
 */
export function rateLimit(limiter: RateLimiter) {
  return (request: NextRequest) => {
    const clientIP = getClientIP(request);

    if (!limiter.isAllowed(clientIP)) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 }
      );
    }

    return null; // Allow the request
  };
}

/**
 * Validate admin key
 */
export function validateAdminKey(authHeader?: string): boolean {
  const adminKey = process.env.ADMIN_KEY;

  if (!adminKey) {
    console.error('[AUTH] ADMIN_KEY not set in environment variables');
    return false;
  }

  if (!authHeader) {
    return false;
  }

  const token = authHeader.replace('Bearer ', '');
  return token === adminKey;
}

/**
 * Admin authentication middleware
 */
export function requireAdmin(request: NextRequest) {
  const authHeader = request.headers.get('authorization');

  if (!validateAdminKey(authHeader)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  return null; // Allow the request
}

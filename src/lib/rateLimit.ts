
interface RateLimitStore {
    [ip: string]: {
        count: number;
        resetTime: number;
    };
}

const store: RateLimitStore = {};

/**
 * Simple In-Memory Rate Limiter
 * @param ip User IP address
 * @param limit Max requests allowed
 * @param windowMs Time window in milliseconds
 * @returns boolean true if allowed, false if blocked
 */
export function rateLimit(ip: string, limit: number = 20, windowMs: number = 60000): boolean {
    const now = Date.now();
    const record = store[ip];

    // Clean up expired entry
    if (record && now > record.resetTime) {
        delete store[ip];
    }

    if (!store[ip]) {
        store[ip] = {
            count: 1,
            resetTime: now + windowMs
        };
        return true;
    }

    if (store[ip].count >= limit) {
        return false;
    }

    store[ip].count++;
    return true;
}

// Cleanup interval (every 5 minutes) to prevent memory leak from stale IPs
if (typeof setInterval !== 'undefined') {
    setInterval(() => {
        const now = Date.now();
        for (const ip in store) {
            if (now > store[ip].resetTime) {
                delete store[ip];
            }
        }
    }, 5 * 60 * 1000);
}

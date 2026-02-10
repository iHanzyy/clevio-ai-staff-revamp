/**
 * Error Logger — sends all errors to N8N webhook for centralized monitoring.
 * 
 * Usage:
 *   import { logError } from '@/lib/errorLogger';
 *   logError('ArthurSection', 'api_error', 'Failed to create agent', { status: 500 });
 */

const WEBHOOK_URL = process.env.NEXT_PUBLIC_ERROR_WEBHOOK_URL;

// Simple dedup: don't send the same error message more than once per 10 seconds
const recentErrors = new Map<string, number>();
const DEDUP_WINDOW_MS = 10_000;

interface ErrorPayload {
    timestamp: string;
    source: string;
    error_type: string;
    message: string;
    status_code?: number;
    url?: string;
    user_agent?: string;
    stack?: string;
    extra?: Record<string, any>;
}

/**
 * Log an error to the N8N webhook.
 * Fire-and-forget — won't block UI or throw.
 */
export function logError(
    source: string,
    errorType: string,
    message: string,
    extra?: {
        status_code?: number;
        stack?: string;
        [key: string]: any;
    }
): void {
    // Only run client-side and only if webhook URL is configured
    if (typeof window === 'undefined' || !WEBHOOK_URL) return;

    // Dedup check
    const dedupKey = `${source}:${errorType}:${message}`;
    const now = Date.now();
    const lastSent = recentErrors.get(dedupKey);
    if (lastSent && now - lastSent < DEDUP_WINDOW_MS) return;
    recentErrors.set(dedupKey, now);

    // Clean old dedup entries periodically
    if (recentErrors.size > 100) {
        for (const [key, time] of recentErrors.entries()) {
            if (now - time > DEDUP_WINDOW_MS) recentErrors.delete(key);
        }
    }

    const payload: ErrorPayload = {
        timestamp: new Date().toISOString(),
        source,
        error_type: errorType,
        message: message.substring(0, 2000), // Truncate very long messages
        url: window.location.href,
        user_agent: navigator.userAgent,
        ...(extra?.status_code && { status_code: extra.status_code }),
        ...(extra?.stack && { stack: extra.stack.substring(0, 3000) }),
    };

    // Remove status_code and stack from extra before spreading
    if (extra) {
        const { status_code, stack, ...rest } = extra;
        if (Object.keys(rest).length > 0) {
            payload.extra = rest;
        }
    }

    // Fire-and-forget
    fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
    }).catch(() => {
        // Silently fail — we don't want error logging to cause more errors
    });
}

/**
 * Helper: log an Error object
 */
export function logErrorObject(source: string, errorType: string, error: unknown, extra?: Record<string, any>): void {
    if (error instanceof Error) {
        logError(source, errorType, error.message, {
            stack: error.stack,
            ...extra,
        });
    } else {
        logError(source, errorType, String(error), extra);
    }
}

/**
 * Install global error handlers (call once in a client component).
 * Catches unhandled errors and unhandled promise rejections.
 */
export function installGlobalErrorHandlers(): void {
    if (typeof window === 'undefined') return;

    // Unhandled JS errors
    window.addEventListener('error', (event) => {
        logError('window', 'unhandled_error', event.message, {
            stack: event.error?.stack,
            filename: event.filename,
            lineno: event.lineno,
            colno: event.colno,
        });
    });

    // Unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
        const reason = event.reason;
        if (reason instanceof Error) {
            logError('window', 'unhandled_rejection', reason.message, {
                stack: reason.stack,
            });
        } else {
            logError('window', 'unhandled_rejection', String(reason));
        }
    });
}

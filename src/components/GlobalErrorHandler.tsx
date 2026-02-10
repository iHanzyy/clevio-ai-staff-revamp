'use client';

import { useEffect } from 'react';
import { installGlobalErrorHandlers } from '@/lib/errorLogger';

/**
 * Client component that installs global error handlers.
 * Place this inside your root layout to catch all unhandled errors.
 */
export default function GlobalErrorHandler() {
    useEffect(() => {
        installGlobalErrorHandlers();
        console.log('[GlobalErrorHandler] Global error handlers installed');
    }, []);

    return null; // This component renders nothing
}

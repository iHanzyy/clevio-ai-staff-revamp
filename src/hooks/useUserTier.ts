import { useState, useEffect } from 'react';
import { authService, User } from '@/services/authService';

export function useUserTier() {
    const [status, setStatus] = useState({
        isGuest: false,
        isTrial: false,
        planCode: ''
    });
    const [isLoading, setIsLoading] = useState(true);
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const checkStatus = async () => {
            try {
                // If user data is already in a global context (e.g. from react-query or context), use that.
                // For now, consistent with existing pattern in Navbar, we fetch it.
                // Optimally we should have a provider, but this is scoped refactor.
                const userData = await authService.getMe();
                setUser(userData);

                setStatus({
                    isGuest: userData.plan_code === 'GUEST',
                    isTrial: userData.plan_code === 'TRIAL',
                    planCode: userData.plan_code
                });

            } catch (error) {
                console.error("Failed to check trial status", error);
                // Default to restrictive states if error? Or loose?
                // For safety, assume false for everything if auth fails (user likely handled by middleware or login page)
                setStatus({ isGuest: false, isTrial: false, planCode: '' });
            } finally {
                setIsLoading(false);
            }
        };

        checkStatus();
    }, []);

    return {
        isGuest: status.isGuest,
        isTrial: status.isTrial,
        planCode: status.planCode,
        isLoading,
        user
    };
}

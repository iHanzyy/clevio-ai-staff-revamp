import { useState, useEffect } from 'react';
import { authService, User } from '@/services/authService';

export function useTrialStatus() {
    const [isTrial, setIsTrial] = useState(false);
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

                if (userData.plan_code === 'TRIAL') {
                    setIsTrial(true);
                } else {
                    setIsTrial(false);
                }
            } catch (error) {
                console.error("Failed to check trial status", error);
                // If failed to fetch me (e.g. 401), we assume not logged in properly or error.
                // But for "Trial" checking, stick to false unless explicitly 'TRIAL'.
                setIsTrial(false);
            } finally {
                setIsLoading(false);
            }
        };

        checkStatus();
    }, []);

    return { isTrial, isLoading, user };
}

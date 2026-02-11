"use client";

import React, { useEffect, useState, useRef } from 'react';
import { useUserTier } from '@/hooks/useUserTier';
import PlanRestrictionPopup from "@/components/ui/PlanRestrictionPopup";

export default function GuestTimer() {
    const { isGuest, isLoading } = useUserTier();
    const [showPopup, setShowPopup] = useState(false);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        // Don't start timer until we know the user's actual status
        if (isLoading) return;
        if (!isGuest) {
            // User is logged in — clear any existing timer and hide popup
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
            setShowPopup(false);
            return;
        }

        // Only start timer for actual guests
        intervalRef.current = setInterval(() => {
            setShowPopup(true);
        }, 5 * 60 * 1000); // 5 Minutes

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, [isGuest, isLoading]);

    return (
        <PlanRestrictionPopup
            isOpen={showPopup}
            onClose={() => setShowPopup(false)}
            type="timer"
        />
    );
}

"use client";

import React, { useEffect, useState, useRef } from 'react';
import { useUserTier } from '@/hooks/useUserTier';
import PlanRestrictionPopup from "@/components/ui/PlanRestrictionPopup";

export default function GuestTimer() {
    const { isGuest } = useUserTier();
    const [showPopup, setShowPopup] = useState(false);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        if (!isGuest) return;
        // Start 5 minute timer
        intervalRef.current = setInterval(() => {
            setShowPopup(true);
        }, 5 * 60 * 1000); // 5 Minutes

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, [isGuest]);

    return (
        <PlanRestrictionPopup
            isOpen={showPopup}
            onClose={() => setShowPopup(false)}
            type="timer"
        />
    );
}

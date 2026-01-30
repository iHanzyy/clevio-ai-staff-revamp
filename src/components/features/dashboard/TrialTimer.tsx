"use client";

import React, { useEffect, useState, useRef } from 'react';
import { useTrialStatus } from '@/hooks/useTrialStatus';
import TrialPopup from '@/components/ui/TrialPopup';

export default function TrialTimer() {
    const { isTrial } = useTrialStatus();
    const [showPopup, setShowPopup] = useState(false);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        if (isTrial) {
            // Start 5 minute timer
            intervalRef.current = setInterval(() => {
                setShowPopup(true);
            }, 5 * 60 * 1000); // 5 Minutes
        }

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, [isTrial]);

    return (
        <TrialPopup
            isOpen={showPopup}
            onClose={() => setShowPopup(false)}
            type="timer"
        />
    );
}

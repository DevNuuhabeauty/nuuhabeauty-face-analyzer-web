"use client"

import { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

// Define possible tracking permission states
type TrackingPermission = 'not_determined' | 'restricted' | 'denied' | 'authorized';

const AppTrackingTransparency = () => {
    const [showATTModal, setShowATTModal] = useState(false);
    const [trackingStatus, setTrackingStatus] = useState<TrackingPermission>('not_determined');

    useEffect(() => {
        try {
            const trackingPermission = localStorage.getItem('tracking_permission');

            if (trackingPermission) {
                // Check if tracking permission has expired (30 days)
                const permissionData = JSON.parse(trackingPermission);
                const permissionDate = new Date(permissionData.timestamp);
                const currentDate = new Date();
                const daysDifference = (currentDate.getTime() - permissionDate.getTime()) / (1000 * 60 * 60 * 24);

                if (daysDifference >= 30) {
                    // Permission has expired, show modal again
                    setShowATTModal(true);
                } else {
                    setTrackingStatus(permissionData.status);
                }
            } else {
                // No permission stored, show modal
                setShowATTModal(true);
            }
        } catch (error) {
            // If there's any error parsing the stored data, reset and show modal
            localStorage.removeItem('tracking_permission');
            setShowATTModal(true);
        }
    }, []);

    const handleAllowTracking = () => {
        const permissionData = {
            status: 'authorized' as TrackingPermission,
            timestamp: new Date().toISOString()
        };
        // Store the user's consent in localStorage with timestamp
        localStorage.setItem('tracking_permission', JSON.stringify(permissionData));
        setTrackingStatus('authorized');
        setShowATTModal(false);

        // Initialize tracking services here
        initializeTracking();
    };

    const handleDenyTracking = () => {
        const permissionData = {
            status: 'denied' as TrackingPermission,
            timestamp: new Date().toISOString()
        };
        // Store the user's choice to deny tracking with timestamp
        localStorage.setItem('tracking_permission', JSON.stringify(permissionData));
        setTrackingStatus('denied');
        setShowATTModal(false);

        // Ensure tracking is disabled
        disableTracking();
    };

    const initializeTracking = () => {
        // Initialize your tracking services here (Google Analytics, Facebook Pixel, etc.)
        console.log('Tracking initialized - user gave consent');

        // Example: Enable cookies for tracking purposes
        document.cookie = "tracking_enabled=true; max-age=31536000; path=/";
    };

    const disableTracking = () => {
        // Disable tracking services and delete tracking cookies
        console.log('Tracking disabled - user denied consent');

        // Example: Delete tracking cookies
        document.cookie = "tracking_enabled=; max-age=0; path=/";
    };

    return (
        <Dialog open={showATTModal} onOpenChange={setShowATTModal}>
            <DialogContent className="w-full max-w-[90%] md:max-w-[80%] lg:max-w-[70%] xl:max-w-[60%] px-4 md:px-6 rounded-lg">
                <DialogHeader>
                    <DialogTitle>Allow Tracking?</DialogTitle>
                    <DialogDescription>
                        Your data will be used to provide you with a better and personalized experience,
                        relevant ads, and app analytics. We track some of the actions you take in our app.
                    </DialogDescription>
                </DialogHeader>
                <div className="flex flex-col space-y-3 sm:flex-row sm:space-x-3 sm:space-y-0 justify-end">
                    <Button variant="outline" onClick={handleDenyTracking}>
                        Ask App Not to Track
                    </Button>
                    <Button onClick={handleAllowTracking}>
                        Allow Tracking
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default AppTrackingTransparency;
"use client"

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import BottomNav from "@/src/core/shared/presentation/components/bottom-nav";
import DisclaimerModal from "@/src/core/shared/presentation/components/disclaimer-modal";
import { HeadNavbar } from "@/src/core/shared/presentation/components/head-nav";
import { useMediaQuery } from "react-responsive";
import { ScrollArea } from "@/components/ui/scroll-area";
import CookieDisclaimerModal from "@/src/core/shared/presentation/components/cookie-disclaimer-modal";
import AppTrackingTransparency from "@/src/core/shared/presentation/components/app-tracking-transparency";
import { initializeTrackingServices, isTrackingAllowed } from "@/src/core/lib/tracking-utils";

const ProtectedLayout = ({ children }: { children: React.ReactNode }) => {
    const isTabletOrMobile = useMediaQuery({ query: '(max-width: 1024px)' });

    // useEffect(() => {
    //     // Initialize tracking services only if user has allowed tracking
    //     if (isTrackingAllowed()) {
    //         initializeTrackingServices();
    //     }
    // }, []);

    return (
        <div className="flex flex-col min-h-screen">
            <HeadNavbar />
            <div className="flex flex-col flex-1 overflow-hidden">
                <div className={`flex-1 overflow-y-auto mx-4 md:container ${isTabletOrMobile ? 'pb-20' : ''}`}>
                    {children}
                </div>
            </div>
            {
                isTabletOrMobile && (
                    <div className="fixed bottom-0 left-0 right-0 bg-background border-t">
                        <BottomNav />
                    </div>
                )
            }
            {/* <CookieDisclaimerModal /> */}
            {/* App Tracking Transparency component - will show modal if tracking permission hasn't been requested yet */}
            {/* <AppTrackingTransparency /> */}
        </div>
    );
};

export default ProtectedLayout;
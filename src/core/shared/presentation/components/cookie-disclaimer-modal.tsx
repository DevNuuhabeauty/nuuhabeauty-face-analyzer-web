"use client"
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { use, useEffect, useState } from "react";
import { CookieIcon } from "lucide-react";

const CookieDisclaimerModal = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [acceptAll, setAcceptAll] = useState(true);
    const [acceptEssential, setAcceptEssential] = useState(true);
    const [acceptAnalytics, setAcceptAnalytics] = useState(false);
    const [acceptMarketing, setAcceptMarketing] = useState(false);

    useEffect(() => {
        const cookieConsent = localStorage.getItem('cookieConsent');

        if (cookieConsent) {
            // Check if cookie consent has expired (7 days)
            const consentData = JSON.parse(cookieConsent);
            const consentDate = new Date(consentData.timestamp);
            const currentDate = new Date();
            const daysDifference = (currentDate.getTime() - consentDate.getTime()) / (1000 * 60 * 60 * 24);

            if (daysDifference >= 7) {
                // Cookie has expired, show modal again
                const timer = setTimeout(() => {
                    setIsOpen(true);
                }, 1500);
                return () => clearTimeout(timer);
            }
        } else {
            // No consent stored, show modal
            const timer = setTimeout(() => {
                setIsOpen(true);
            }, 1500);
            return () => clearTimeout(timer);
        }
    }, []);

    const handleAcceptAll = () => {
        setAcceptEssential(true);
        setAcceptAnalytics(true);
        setAcceptMarketing(true);

        saveCookiePreferences({
            essential: true,
            analytics: true,
            marketing: true
        });

        setIsOpen(false);
    };

    const handleSavePreferences = () => {
        saveCookiePreferences({
            essential: acceptEssential, // Essential cookies are always required
            analytics: acceptAnalytics,
            marketing: acceptMarketing
        });

        setIsOpen(false);
    };

    const saveCookiePreferences = (preferences: { essential: boolean; analytics: boolean; marketing: boolean }) => {
        // Save user preferences to localStorage
        localStorage.setItem('cookieConsent', JSON.stringify({
            ...preferences,
            timestamp: new Date().toISOString()
        }));

        // Here you would implement your actual cookie handling logic
        // e.g., enabling/disabling specific tracking scripts
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            {/* <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2">
                    <CookieIcon className="h-4 w-4" />
                    Cookie Settings
                </Button>
            </DialogTrigger> */}
            <DialogContent className="w-full max-w-[90%] md:max-w-[80%] lg:max-w-[70%] xl:max-w-[60%] px-4 md:px-6 rounded-lg">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <CookieIcon className="h-5 w-5" />
                        Cookie Preferences
                    </DialogTitle>
                    <DialogDescription>
                        We use cookies to enhance your browsing experience, serve personalized ads or content, and analyze our traffic.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-3 text-sm">
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="essential"
                                    checked={acceptEssential}
                                    disabled={true} // Essential cookies cannot be disabled
                                />
                                <label htmlFor="essential" className="font-medium">Essential Cookies</label>
                            </div>
                            <span className="text-xs bg-secondary px-2 py-0.5 rounded">Required</span>
                        </div>
                        <p className="text-xs text-muted-foreground pl-6">
                            These cookies are necessary for the website to function and cannot be disabled.
                        </p>
                    </div>

                    <div className="space-y-3">
                        <div className="flex items-center space-x-2">
                            <Checkbox
                                id="analytics"
                                checked={acceptAnalytics}
                                onCheckedChange={(checked) => setAcceptAnalytics(!!checked)}
                            />
                            <label htmlFor="analytics" className="font-medium">Analytics Cookies</label>
                        </div>
                        <p className="text-xs text-muted-foreground pl-6">
                            Help us understand how visitors interact with our website, allowing us to improve user experience.
                        </p>
                    </div>

                    <div className="space-y-3">
                        <div className="flex items-center space-x-2">
                            <Checkbox
                                id="marketing"
                                checked={acceptMarketing}
                                onCheckedChange={(checked) => setAcceptMarketing(!!checked)}
                            />
                            <label htmlFor="marketing" className="font-medium">Marketing Cookies</label>
                        </div>
                        <p className="text-xs text-muted-foreground pl-6">
                            Used to track visitors across websites to display relevant advertisements.
                        </p>
                    </div>
                </div>

                <div className="flex justify-between gap-2 pt-2">
                    <Button
                        variant="outline"
                        onClick={handleSavePreferences}
                        className="flex-1"
                    >
                        Save Preferences
                    </Button>
                    <Button
                        onClick={handleAcceptAll}
                        className="flex-1"
                    >
                        Accept All
                    </Button>
                </div>

                {/* <div className="text-xs text-center text-muted-foreground mt-3">
                    By continuing to use our site, you acknowledge our <a href="/privacy-policy" className="underline hover:text-primary">Privacy Policy</a> and <a href="/terms" className="underline hover:text-primary">Terms of Service</a>.
                </div> */}
            </DialogContent>
        </Dialog>
    );
};

export default CookieDisclaimerModal;
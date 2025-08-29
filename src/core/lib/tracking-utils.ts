// Utility for handling tracking operations according to user consent

/**
 * Check if tracking is allowed by the user
 */
export const isTrackingAllowed = (): boolean => {
    // For browser environments only
    if (typeof window === 'undefined') {
        return false;
    }

    // Check localStorage for tracking permission
    const trackingPermission = localStorage.getItem('tracking_permission');
    return trackingPermission === 'authorized';
};

/**
 * Track an event if the user has allowed tracking
 */
export const trackEvent = (eventName: string, eventData?: Record<string, any>): void => {
    if (!isTrackingAllowed()) {
        console.log('Tracking disabled - event not tracked:', eventName);
        return;
    }

    // Implement your tracking logic here
    // Example for Google Analytics
    if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', eventName, eventData);
    }

    // Example for Facebook Pixel
    if (typeof window !== 'undefined' && window.fbq) {
        window.fbq('track', eventName, eventData);
    }

    console.log('Event tracked:', eventName, eventData);
};

/**
 * Initialize tracking services based on user consent
 */
export const initializeTrackingServices = (): void => {
    if (!isTrackingAllowed()) {
        console.log('Tracking not allowed - services not initialized');
        return;
    }

    // Initialize your tracking services here
    console.log('Initializing tracking services');

    // Example: Load Google Analytics script
    // loadScript('https://www.googletagmanager.com/gtag/js?id=YOUR_GA_ID');

    // Example: Load Facebook Pixel script
    // loadScript('https://connect.facebook.net/en_US/fbevents.js');
};

/**
 * Helper function to load scripts dynamically
 */
const loadScript = (src: string): void => {
    const script = document.createElement('script');
    script.src = src;
    script.async = true;
    document.head.appendChild(script);
};

/**
 * Handle cookies for tracking purposes
 */
export const setTrackingCookies = (enabled: boolean): void => {
    if (enabled) {
        // Set tracking cookies with appropriate expiration
        document.cookie = "tracking_enabled=true; max-age=31536000; path=/";
    } else {
        // Delete tracking cookies
        document.cookie = "tracking_enabled=; max-age=0; path=/";
    }
};

// Type definition for global window object with tracking properties
declare global {
    interface Window {
        gtag?: (...args: any[]) => void;
        fbq?: (...args: any[]) => void;
    }
}
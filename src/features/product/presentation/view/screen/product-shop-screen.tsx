"use client";

import { useState } from 'react';

const ProductShopScreen = () => {
    const [isHovered, setIsHovered] = useState(false);

    const openExternalSite = () => {
        window.open('https://nuuhabeauty.com/', '_blank', 'noopener,noreferrer');
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-5 font-sans relative overflow-hidden">
            {/* Animated background elements */}
            <div className="absolute top-[10%] left-[10%] w-24 h-24 bg-white/10 rounded-full animate-bounce opacity-70" />
            <div className="absolute top-[60%] right-[15%] w-16 h-16 bg-white/10 rounded-full animate-pulse opacity-70" />
            <div className="absolute bottom-[20%] left-[20%] w-20 h-20 bg-white/5 rounded-full animate-bounce opacity-50"
                style={{ animationDelay: '1s' }} />

            {/* Main content card */}
            <div className="backdrop-blur-xl rounded-3xl px-10 py-16 text-center max-w-lg w-full shadow-2xl border relative z-10"
                style={{
                    background: 'linear-gradient(135deg, #966c3b 0%, #c8956d 100%)',
                    borderColor: 'rgba(150, 108, 59, 0.3)'
                }}>
                {/* Beauty icon */}
                <div className="w-20 h-20 bg-white/20 rounded-full mx-auto mb-8 flex items-center justify-center text-4xl text-white shadow-xl animate-pulse">
                    ✨
                </div>

                <h1 className="text-4xl font-bold text-white mb-4 tracking-tight drop-shadow-lg">
                    NuuhaBeauty Store
                </h1>

                <p className="text-lg text-white/90 mb-10 leading-relaxed">
                    Discover premium beauty products and skincare essentials.
                    <br />
                    <span className="text-base text-white/70">
                        Opens in a secure new window
                    </span>
                </p>

                <button
                    onClick={openExternalSite}
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                    className={`
                        bg-white text-amber-900 border-none rounded-full px-10 py-4 text-lg font-semibold 
                        cursor-pointer transition-all duration-300 ease-out
                        flex items-center justify-center gap-3 mx-auto relative overflow-hidden
                        active:scale-95 hover:bg-white/90 ${isHovered ? '-translate-y-1 shadow-2xl' : 'translate-y-0 shadow-xl'}
                    `}
                >
                    <span>Visit Store</span>
                    <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        className={`transition-transform duration-300 ease-out ${isHovered ? 'translate-x-1' : 'translate-x-0'
                            }`}
                    >
                        <path d="M7 17L17 7M17 7H7M17 7V17" />
                    </svg>
                </button>

                {/* Security badge */}
                <div className="mt-8 flex items-center justify-center gap-2 text-white/80 text-sm font-medium">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2L13.09 8.26L22 9L13.09 9.74L12 22L10.91 9.74L2 9L10.91 8.26L12 2Z" />
                    </svg>
                    Secure & Trusted Shopping
                </div>
            </div>

            {/* Custom CSS for additional animations */}
            <style jsx>{`
                @media (max-width: 768px) {
                    .text-4xl {
                        font-size: 1.75rem !important;
                    }
                    
                    .text-lg {
                        font-size: 1rem !important;
                    }
                    
                    .px-10 {
                        padding-left: 1.5rem !important;
                        padding-right: 1.5rem !important;
                    }
                    
                    .py-16 {
                        padding-top: 2.5rem !important;
                        padding-bottom: 2.5rem !important;
                    }
                }
            `}</style>
        </div>
    );
};

export default ProductShopScreen;
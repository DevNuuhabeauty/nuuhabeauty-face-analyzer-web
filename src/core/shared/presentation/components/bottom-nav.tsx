"use client"

import { usePathname, useRouter } from "next/navigation";
import { Camera } from "lucide-react";
import Image from "next/image";

const BottomNav = () => {
    const router = useRouter();
    const pathname = usePathname();

    const isClicked = (path: string) => {
        return pathname === path;
    }

    const icon = [

        '/images/icon/history.png',
        '/images/icon/ingredient.png',
        '/images/icon/analyzer.png',
        '/images/icon/product.png',
        '/images/icon/shop.png',
    ]

    return (
        <div className="relative flex items-end justify-between w-full px-4 pt-2 py-4 bg-white border-t border-gray-200">
            {/* Skin History */}
            <div className="flex-1 flex justify-start">
                <button
                    onClick={() => router.push('/overview')}
                    className="flex flex-col items-center justify-center gap-1 min-w-0"
                >
                    <div className="w-6 h-6 flex items-center justify-center">
                        <Image
                            src={icon[0]}
                            alt="Analyzer"
                            width={30}
                            height={30}
                            className={`${isClicked('/overview') ? 'opacity-100' : 'opacity-50'}`}
                        />
                    </div>
                    <span className={`text-[10px] leading-tight text-center whitespace-normal max-w-[50px] ${isClicked('/overview') ? 'text-primary' : 'text-gray-500'}`}>
                        Skin Analysis
                    </span>
                </button>
            </div>

            {/* Ingredient Checker */}
            <div className="flex-1 flex justify-start">
                <button
                    onClick={() => router.push('/ingredient-checker')}
                    className="flex flex-col items-center justify-center gap-1 min-w-0"
                >
                    <div className="w-6 h-6 flex items-center justify-center">
                        <Image
                            src={icon[1]}
                            alt="Ingredient"
                            width={20}
                            height={20}
                            className={`${isClicked('/ingredient-checker') ? 'opacity-100' : 'opacity-50'}`}
                        />
                    </div>
                    <span className={`text-[10px] leading-tight text-center whitespace-normal max-w-[70px] ${isClicked('/ingredient-checker') ? 'text-primary' : 'text-gray-500'}`}>
                        Ingredient Checker
                    </span>
                </button>
            </div>

            {/* Camera Button - Elevated and Centered */}
            <div className="absolute left-1/2 -translate-x-1/2 -top-6 z-10">
                <button
                    onClick={() => router.push('/face-analyzer')}
                    className="flex items-center justify-center w-16 h-16 rounded-full bg-amber-700 shadow-lg border-4 border-white hover:bg-amber-800 transition-colors duration-200"
                >
                    {/* <Camera className="w-7 h-7 text-white" /> */}
                    <div className="w-8 h-8 flex items-center justify-center text-white">
                        <Image
                            src={icon[2]}
                            alt="Face Analyzer"
                            width={40}
                            height={40}
                        // className={`${isClicked('/face-analyzer') ? 'opacity-100' : 'opacity-50'} `}
                        />
                    </div>
                </button>
            </div>

            {/* Product Scanner */}
            <div className="flex-1 flex justify-end">
                <button
                    onClick={() => router.push('/product-scanner')}
                    className="flex flex-col items-center justify-center gap-1 min-w-0"
                >
                    <div className="w-6 h-6 flex items-center justify-center">
                        <Image
                            src={icon[3]}
                            alt="Product"
                            width={20}
                            height={20}
                            className={`${isClicked('/product-scanner') ? 'opacity-100' : 'opacity-50'}`}
                        />
                    </div>
                    <span className={`text-[10px] leading-tight text-center whitespace-normal max-w-[70px] ${isClicked('/product-scanner') ? 'text-primary' : 'text-gray-500'}`}>
                        Product Scanner
                    </span>
                </button>
            </div>

            {/* Shop Products */}
            <div className="flex-1 flex justify-end">
                <button
                    onClick={() => router.push('/product-shop')}
                    className="flex flex-col items-center justify-center gap-1 min-w-0"
                >
                    <div className="w-6 h-6 flex items-center justify-center">
                        <Image
                            src={icon[4]}
                            alt="Shop"
                            width={20}
                            height={20}
                            className={`${isClicked('/product-shop') ? 'opacity-100' : 'opacity-50'}`}
                        />
                    </div>
                    <span className={`text-[10px] leading-tight text-center whitespace-normal max-w-[70px] ${isClicked('/product-shop') ? 'text-primary' : 'text-gray-500'}`}>
                        Shop's Products
                    </span>
                </button>
            </div>
        </div>
    )
}

export default BottomNav;
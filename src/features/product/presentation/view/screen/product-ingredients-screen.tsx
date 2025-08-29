'use client'

import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger
} from "@/components/ui/accordion";
import { Badge } from '@/components/ui/badge';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from '@/components/ui/table';
import { CONCERN_API_URL } from '@/src/core/constant';
import { DialogTrigger } from '@radix-ui/react-dialog';
import { Camera, Info, Search, Sparkles } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { ReactNode, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbSeparator
} from '@/components/ui/breadcrumb';
import { useSession } from "next-auth/react";
import InfoScreen from "@/src/core/shared/presentation/components/info-screen";
import CredentialDialog from "@/src/features/auth/screen/view/components/credential-dialog";
import CitationDisclaimerText from "@/src/core/shared/presentation/components/citation-disclaimer-text";
import CitationDisclaimerModal from "@/src/core/shared/presentation/components/citation-disclaimer-modal";
import DisclaimerModal from "@/src/core/shared/presentation/components/disclaimer-modal";



const ProductIngredientFinder = () => {

    const router = useRouter();

    const { data: session } = useSession();

    const [showSafetyDisclaimer, setShowSafetyDisclaimer] = useState(true);
    const [showCitationDisclaimer, setShowCitationDisclaimer] = useState(false);


    if (!session?.accessToken) {
        return (
            <InfoScreen
                title=""
                description="Please login to continue"
                src="/images/communication.png"
                widget={
                    <CredentialDialog
                        widget={
                            <Button>
                                Login
                            </Button>
                        }
                    />
                }
            />
        );
    }




    const handleSafetyDisclaimerClose = () => {
        setShowSafetyDisclaimer(false);
        setShowCitationDisclaimer(true); // Show citation disclaimer after safety disclaimer is closed
    };


    return (
        <div className='flex flex-col w-full'>
            {
                process.env.SHOW_DISCLAIMER === 'true' && (
                    <>

                        <CitationDisclaimerModal
                            isOpen={showCitationDisclaimer}
                            onClose={() => setShowCitationDisclaimer(false)}
                        />

                        <DisclaimerModal
                            isOpen={showSafetyDisclaimer}
                            onClose={handleSafetyDisclaimerClose}
                        />

                    </>
                )
            }
            <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink href="/overview">Overview</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbLink href="/product-ingredients">Ingredients</BreadcrumbLink>
                    </BreadcrumbItem>

                </BreadcrumbList>
            </Breadcrumb>


            <div className="mx-auto p-4">
                <div className=" mx-auto">
                    <CardHeader className="text-center mb-4">
                        <CardTitle className="md:text-4xl text-base font-bold text-[#966c3b] flex items-center justify-center gap-2">
                            <Sparkles className="w-4 h-4" />
                            Skincare Ingredient Analyzer
                            <Sparkles className="w-4 h-4" />
                        </CardTitle>

                    </CardHeader>

                    <div className="grid lg:grid-cols-3 gap-6">
                        {/* Camera Option */}
                        <Card
                            onClick={() => {
                                router.push('/product-ingredients/camera');
                            }}
                            className="backdrop-blur-lg bg-white/70 border-[#966c3b]/20 shadow-lg rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
                            <CardContent className="p-6 flex flex-col items-center justify-center min-h-[400px] space-y-6">
                                <div className="w-20 h-20 rounded-full bg-[#966c3b]/10 flex items-center justify-center">
                                    <Camera className="w-10 h-10 text-[#966c3b]" />
                                </div>
                                <h3 className="text-2xl font-semibold text-[#966c3b]">Scan Product</h3>
                                <p className="text-center text-gray-600">
                                    Use your camera to instantly analyze product ingredients
                                </p>
                                <Button
                                    onClick={() => {
                                        router.push('/product-ingredients/camera');
                                    }}
                                    className="cursor-not-allowed text-white w-full max-w-xs"
                                    size="lg"

                                >
                                    Start
                                </Button>
                            </CardContent>
                        </Card>

                        {/* Search Option */}
                        <Card
                            onClick={() => {
                                router.push('/product-ingredients/search');
                            }}
                            className="backdrop-blur-lg bg-white/70 border-[#966c3b]/20 shadow-lg rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
                            <CardContent className="p-6 flex flex-col items-center justify-center min-h-[400px] space-y-6">
                                <div className="w-20 h-20 rounded-full bg-[#966c3b]/10 flex items-center justify-center">
                                    <Search className="w-10 h-10 text-[#966c3b]" />
                                </div>
                                <h3 className="text-2xl font-semibold text-[#966c3b]">Search Product</h3>
                                <p className="text-center text-gray-600">
                                    Type product name to view detailed ingredient analysis
                                </p>
                                <Button
                                    className="w-full max-w-xs bg-[#966c3b] hover:bg-[#966c3b]/90 text-white flex items-center justify-center gap-2"
                                    size="lg"
                                >
                                    Search for a product
                                </Button>
                            </CardContent>
                        </Card>

                        {/* Ingredients Search Option */}
                        <Card
                            onClick={() => {
                                router.push('/product-ingredients/ingredients-search');
                            }}
                            className="backdrop-blur-lg bg-white/70 border-[#966c3b]/20 shadow-lg rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
                            <CardContent className="p-6 flex flex-col items-center justify-center min-h-[400px] space-y-6">
                                <div className="w-20 h-20 rounded-full bg-[#966c3b]/10 flex items-center justify-center">
                                    <Search className="w-10 h-10 text-[#966c3b]" />
                                </div>
                                <h3 className="text-2xl font-semibold text-[#966c3b]">Search Ingredients</h3>
                                <p className="text-center text-gray-600">
                                    Type ingredient name to view detailed information
                                </p>
                                <Button
                                    className="w-full max-w-xs bg-[#966c3b] hover:bg-[#966c3b]/90 text-white flex items-center justify-center gap-2"
                                    size="lg"
                                >
                                    Search for an ingredient
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>


        </div>

    );
};



export default ProductIngredientFinder;

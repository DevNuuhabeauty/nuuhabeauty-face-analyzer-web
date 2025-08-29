'use client'

import React, { useState, useRef, ReactNode, useCallback, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger
} from "@/components/ui/accordion";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from '@/components/ui/badge';
import { Sparkles, Search, Camera, Info, RefreshCcw, ChevronUp, ChevronDown, Check, X, FlipHorizontal, FlipVertical, SwitchCamera, SwitchCameraIcon, SearchIcon, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { DialogTrigger } from '@radix-ui/react-dialog';
import { capitalizeWords } from '@/src/core/constant/helper';
import {
    Table,
    TableHeader,
    TableBody,
    TableRow,
    TableCell,
    TableHead
} from '@/components/ui/table';
import { CONCERN_API_URL, SERVER_API_URL } from '@/src/core/constant';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbPage, BreadcrumbList, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import SkimThroughTable from '../components/skim-through-table';
import { Skeleton } from '@/components/ui/skeleton';
import { SkimThrough } from '../../../entities/skim-through';
import IngredientDetailDialog from '../components/ingredient-detail-dialog';
import { useGetResearchs } from '../../tanstack/research.tanstack';
import { ResearchEntity } from '../../../entities/research-entity';
import { ChemicalEntity, IngredientsEntity } from '../../../entities/ingredients-entity';
import { useGetChemical } from '../../tanstack/chemical.tantack';
import { useCheckNPRAProduct } from '../../tanstack/product.tanstack';
import { NPRAEntity } from '../../../entities/product-entity';
import IngredientDisclaimerModal from '@/src/core/shared/presentation/components/ingredient-disclaimer-modal';
import { useRouter } from 'next/navigation';
import ProductNotFoundDialog from '../components/product-not-found-dialog';


interface HalalAnalysisDialogProps {
    halalAnalysis: any;
    showHalalAnalysisDialog: boolean;
    setShowHalalAnalysisDialog: (value: boolean) => void;
    reactNode: ReactNode;
    isLoading: boolean;
}


// Add new interface for related products
interface RelatedProduct {
    name: string;
    url: string;
}

interface HalalAnalysis {
    status: string;
    doubtful_ingredients: HalalIngredient[];
}

interface HalalIngredient {
    name: string;
    reason: string;
}


const ProductCameraScreen = () => {

    const [selectedProduct, setSelectedProduct] = useState<string | null>(null);
    const [ingredients, setIngredients] = useState<Array<{
        name: string;
        url: string;
    }>>([]);
    const [halalAnalysis, setHalalAnalysis] = useState<HalalAnalysis | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [selectedIngredient, setSelectedIngredient] = useState<IngredientsEntity | null>(null);
    const [showIngredientDialog, setShowIngredientDialog] = useState<boolean>(false);
    const [showHalalAnalysisDialog, setShowHalalAnalysisDialog] = useState<boolean>(false);
    const [productImage, setProductImage] = useState<string>('');
    const [relatedProducts, setRelatedProducts] = useState<RelatedProduct[]>([]);
    const [activeTab, setActiveTab] = useState<'details' | 'related'>('details');

    const [showCamera, setShowCamera] = useState<boolean>(true);
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isStreamActive, setIsStreamActive] = useState(false);

    const [loadingHalalAnalysis, setLoadingHalalAnalysis] = useState(false);

    // Check if mobile and set front camera to true if mobile
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    const [isFrontCamera, setIsFrontCamera] = useState(isMobile ? false : true);

    const [seeMoreIngredients, setSeeMoreIngredients] = useState(false);

    const [isLoadingDescription, setIsLoadingDescription] = useState(false);
    const [productDescription, setProductDescription] = useState<string>('');

    const [skimThrough, setSkimThrough] = useState<SkimThrough[]>([]);
    const [isLoadingSkimThrough, setIsLoadingSkimThrough] = useState(false);
    const [skimThroughError, setSkimThroughError] = useState<string | null>(null);

    const [researchs, setResearchs] = useState<ResearchEntity[]>([]);

    const [chemical, setChemical] = useState<ChemicalEntity | null>(null);


    const [npraProduct, setNpraProduct] = useState<NPRAEntity | null>(null);
    const [isExistNPRAProduct, setIsExistNPRAProduct] = useState<boolean>(false);

    const router = useRouter();

    const [isOpenProductNotFoundDialog, setIsOpenProductNotFoundDialog] = useState<boolean>(false);


    //is mobile , ipad , android

    const toggleCamera = () => {
        if (videoRef.current && videoRef.current.srcObject instanceof MediaStream) {
            const tracks = videoRef.current.srcObject.getTracks();
            tracks.forEach(track => track.stop());
            videoRef.current.srcObject = null;
        }

        setIsFrontCamera(!isFrontCamera);

        // Restart camera with new facing mode
        startCamera();
    }

    useEffect(() => {
        startCamera();
    }, [videoRef, isFrontCamera]);

    // Simulated API calls (replace these with actual fetch calls to your backend)
    const getProductIngredients = async (productName: string) => {
        setLoading(true);
        try {
            const response = await fetch(`${CONCERN_API_URL}/api/ingredients`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ product: productName }),
                credentials: 'omit',
            });

            if (!response.ok) {
                throw new Error('Failed to fetch ingredients');
            }
            const { data } = await response.json();
            setIngredients(data.ingredients);
            setProductImage(data.image_url);
        } catch (error) {
            console.error('Error getting ingredients:', error);
            setIngredients([]);
            setProductImage('');
        } finally {
            setLoading(false);
        }
    };

    const getRelatedProducts = async (ingredientName: string) => {
        try {
            const response = await fetch(`${CONCERN_API_URL}/api/related-products`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name: ingredientName }),
                credentials: 'omit',
            });


            const { data } = await response.json();
            setRelatedProducts(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Error getting related products:', error);
            setRelatedProducts([]);
        }
    };



    const getIngredientDetails = async (ingredient: { name: string; url: string }) => {
        setLoading(true);
        setActiveTab('details');
        try {
            await Promise.all([
                fetch(`${CONCERN_API_URL}/api/ingredient-info`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ product: ingredient.name }),
                    credentials: 'omit',
                }).then(async (response) => {
                    if (!response.ok) throw new Error('Failed to fetch ingredient details');
                    const { data } = await response.json();
                    setSelectedIngredient({
                        name: data.name,
                        category: data.category,
                        also_called: data.also_called,
                        what_it_does: data.what_it_does,
                        irritancy: data.irritancy,
                        comedogenicity: data.comedogenicity,
                        functions: data.functions,
                        description: data.description,
                        image: data.image_url
                    });
                }),
                getRelatedProducts(ingredient.name),
                getListResearchs(ingredient.name),
                getChemicalData(ingredient.name)
            ]);
            setShowIngredientDialog(true);
        } catch (error) {
            console.error('Error getting ingredient details:', error);
        } finally {
            setLoading(false);
        }
    };

    const getProductDescription = async (productName: string) => {
        setIsLoadingDescription(true);
        try {
            const response = await fetch(`${CONCERN_API_URL}/api/product-description`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ product: productName }),
            });
            const { description } = await response.json();
            setProductDescription(description);
        } catch (error) {
            console.error('Error getting product description:', error);
            setProductDescription('');
        } finally {
            setIsLoadingDescription(false);
        }
    };



    // Function to start camera
    const startCamera = async () => {
        setIsStreamActive(true);
        setShowCamera(true);

        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: {
                    facingMode: isFrontCamera ? 'user' : 'environment'
                },
                audio: false,
            });

            if (videoRef.current) {
                videoRef.current.srcObject = stream;
            }
        } catch (error) {
            console.error('Error accessing camera:', error);
            toast.error('Failed to access camera');
        }
    };

    // Function to stop camera
    const stopCamera = () => {
        setIsStreamActive(false);
        setShowCamera(false);
        if (videoRef.current && videoRef.current.srcObject instanceof MediaStream) {
            const tracks = videoRef.current.srcObject.getTracks();
            tracks.forEach(track => track.stop());
            videoRef.current.srcObject = null;
            toast.success('Camera stopped');
        }
    };

    const handleCheckHalal = async () => {
        if (!ingredients) return;

        setLoadingHalalAnalysis(true);

        try {
            const response = await fetch(`${CONCERN_API_URL}/api/analyze-halal`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ingredients: ingredients.map((ingredient: any) => ingredient.name) }),
            });

            if (!response.ok) {
                throw new Error('Failed to analyze halal status');
            }

            const data = await response.json();
            setHalalAnalysis(data.analysis);

            console.log({
                data: data
            });

        } catch (error: any) {
            console.error('Error analyzing halal status:', error);
            toast.error(error.message);
        } finally {
            setLoadingHalalAnalysis(false);
            // setShowHalalAnalysisDialog(true);
        }
    };

    const handleAnalyzeProduct = async () => {
        if (videoRef.current) {
            const canvas = document.createElement('canvas');
            canvas.width = videoRef.current.videoWidth;
            canvas.height = videoRef.current.videoHeight;
            const ctx = canvas.getContext('2d');
            if (ctx) {
                ctx.drawImage(videoRef.current, 0, 0);
                const base64Image = canvas.toDataURL('image/jpeg').split(',')[1];

                setLoading(true);
                try {
                    const response = await fetch(`${CONCERN_API_URL}/api/analyze-product`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ image: base64Image }),
                    });
                    const data = await response.json();

                    if (response.status == 404) {
                        toast.error('Product not found');
                        stopCamera();
                        setLoading(false);
                        setIsOpenProductNotFoundDialog(true);
                        return;
                    }


                    console.log('data', data);

                    if (response.status == 200) {
                        setIngredients(data.ingredients.ingredients);
                        setProductImage(data.ingredients.image_url);

                        // Add these for product description and skim through
                        if (data.product_name) {

                            setSelectedProduct(data.product_name);
                            getProductDescription(data.product_name);
                            getSkimThrough(data.product_name);
                            getNPRAProduct(data.product_name);
                        }
                    }

                    stopCamera();
                    setLoading(false);
                } catch (error) {
                    console.error('Error analyzing image:', error);
                    setLoading(false);
                }
            }
        }
    }

    const getSkimThrough = async (productName: string) => {
        try {
            setIsLoadingSkimThrough(true);
            const response = await fetch(`${CONCERN_API_URL}/api/product-ingredients-categories`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ product: productName }),
            });
            const { ingredients } = await response.json();
            if (ingredients) {
                setSkimThrough(ingredients);
            } else {
                setSkimThroughError('No ingredients found');
            }
        } catch (error) {
            console.error('Error getting skim through:', error);
            setSkimThroughError('No ingredients found');
        } finally {
            setIsLoadingSkimThrough(false);
        }
    }

    const {
        mutate: getResearchs,
    } = useGetResearchs();

    const getListResearchs = (productName: string) => {
        getResearchs({ productName }, {
            onSuccess: (data) => {
                console.log('data', data.length);
                if (data) {
                    setResearchs(data);
                }
            },
            onError: (error) => {
                toast.error('Error getting research articles');
            }
        });
    }

    const {
        mutate: getChemical,
        isPending: loadingChemical
    } = useGetChemical();

    const getChemicalData = (productName: string) => {
        getChemical({ productName }, {
            onSuccess: (data) => {
                if (data) {
                    setChemical(data);
                }
            },
            onError: (error) => {
                toast.error('Error getting chemical');
            }
        });
    }

    const {
        mutate: checkNPRAProduct,
        isPending: loadingNPRAProduct
    } = useCheckNPRAProduct();


    const getNPRAProduct = (productName: string) => {
        console.log('Product Name', productName);
        checkNPRAProduct({ productName }, {
            onSuccess: (data) => {
                if (data) {
                    setIsExistNPRAProduct(true);
                    setNpraProduct(data);
                } else {
                    setIsExistNPRAProduct(false);
                    setNpraProduct(null);
                }
            },
            onError: (error) => {
                setIsExistNPRAProduct(false);
                setNpraProduct(null);
            }
        });
    }

    //go to external website
    const handleGoToNPRAProduct = (npraProduct: NPRAEntity) => {
        //open another tab
        if (npraProduct.registration_no) {
            window.open(`https://quest3plus.bpfk.gov.my/pmo2/detail.php?type=product&id=${npraProduct.registration_no}`, '_blank');
        }
    }




    const handleRefresh = () => {
        setSelectedProduct(null);
        setIngredients([]);
        setProductImage('');
    }

    const handleProductSelect = (product: string) => {
        setSelectedProduct(product);
        getProductIngredients(product);
        getProductDescription(product);
        getSkimThrough(product);
        getNPRAProduct(product);
    };

    return (
        <div className="flex flex-col items-start justify-start w-full">

            <div className="w-full bg-white/95 backdrop-blur-sm  border-gray-100 p-4 sticky top-0 z-10">
                <Breadcrumb>
                    <BreadcrumbList>
                        <BreadcrumbItem>
                            <BreadcrumbLink href="/product-scanner" className="text-gray-500 hover:text-[#966c3b] transition-colors">
                                Product Scanner
                            </BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbLink href="/product-ingredients/camera" className="font-medium text-[#966c3b]">
                                Camera
                            </BreadcrumbLink>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
            </div>

            <div className="space-y-4 mt-4 w-full">
                <div className='flex flex-row items-center justify-between'>
                    <div className='flex flex-col items-start justify-center gap-1'>
                        <h1 className="text-2xl font-bold text-gray-900">Product Scanner</h1>
                        <p className="md:text-md text-sm text-gray-600">Scan any product to check its ingredients and properties</p>
                    </div>
                    <Button
                        onClick={() => {
                            router.push('/product-search');
                        }}
                        variant='outline'
                        className='text-xs text-[#966c3b] hover:bg-[#966c3b]/10 hover:text-[#966c3b] transition-colors duration-300 rounded-lg mt-2 mr-2'>
                        <SearchIcon className="w-4 h-4" />
                        Search Product
                    </Button>
                </div>

            </div>

            {
                !selectedProduct && (
                    <div className="container mx-auto p-4 max-w-4xl">
                        <Card className="backdrop-blur-lg bg-white/80 border-[#966c3b]/20 shadow-xl rounded-2xl overflow-hidden">


                            <CardContent className="p-6 space-y-6">
                                {!loading && !productImage && ingredients.length === 0 && (
                                    <div className="space-y-6 animate-fadeIn">
                                        <div className="relative bg-gradient-to-b from-[#966c3b]/5 to-transparent rounded-2xl overflow-hidden border-2 border-[#966c3b]/20 h-[400px] md:h-[calc(100vh-40vh)]">
                                            {isStreamActive ? (
                                                //is front camera
                                                <div className={`w-full h-full object-cover ${isFrontCamera ? 'scale-x-[-1]' : ''}`}>
                                                    <video
                                                        ref={videoRef}
                                                        autoPlay
                                                        playsInline
                                                        className={`w-full h-full object-cover ${isFrontCamera ? 'scale-x-[-1]' : ''}`}
                                                    />
                                                    {isMobile && (
                                                        <Button
                                                            variant={isFrontCamera ? 'outline' : 'default'}
                                                            onClick={toggleCamera}
                                                            className="absolute top-2 right-2 text-black rounded-full p-2">
                                                            <SwitchCameraIcon className="w-4 h-4" />
                                                        </Button>
                                                    )}
                                                </div>
                                            ) : (
                                                <div className="absolute inset-0 flex items-center justify-center w-full h-full">
                                                    <Camera className="w-16 h-16 text-[#966c3b]/40" />
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex flex-row items-center justify-center gap-4">
                                            <Button

                                                onClick={isStreamActive ? stopCamera : startCamera}
                                                className={`
                                                    flex-1
                                                    px-6 py-2 rounded-full transition-all duration-300 ${isStreamActive
                                                        ? "bg-red-500 hover:bg-red-600 text-white"
                                                        : "bg-[#966c3b] hover:bg-[#966c3b]/90 text-white"
                                                    }`}
                                            >
                                                <div className="flex items-center gap-2">
                                                    {isStreamActive ? (
                                                        <X className="w-5 h-5" />
                                                    ) : (
                                                        <Camera className="w-5 h-5" />
                                                    )}
                                                    {isStreamActive ? "Stop Camera" : "Start Camera"}
                                                </div>
                                            </Button>

                                            {isStreamActive && (
                                                <Button
                                                    onClick={handleAnalyzeProduct}
                                                    className="flex-1 bg-[#966c3b] hover:bg-[#966c3b]/90 text-white px-6 py-2 rounded-full"
                                                >
                                                    <div className="flex items-center gap-2">
                                                        <Check className="w-5 h-5" />
                                                        Analyze Product
                                                    </div>
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {loading && (
                                    <div className="flex flex-col items-center justify-center py-12 space-y-4">
                                        <div className="relative">
                                            <div className="w-16 h-16 border-4 border-[#966c3b]/20 border-t-[#966c3b] rounded-full animate-spin"></div>
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <div className="w-8 h-8 border-4 border-[#966c3b]/40 border-t-[#966c3b] rounded-full animate-spin"></div>
                                            </div>
                                        </div>
                                        <p className="text-[#966c3b] font-medium">Analyzing your product...</p>
                                    </div>
                                )}

                            </CardContent>
                        </Card>

                        {/* Scanning Tips with matching width */}
                        <div className="bg-amber-50/80 border border-amber-200 rounded-2xl p-4 w-full mt-4">
                            <div className="flex items-center gap-2 mb-2">
                                <Info className="w-5 h-5 text-amber-600" />
                                <h3 className="font-medium text-amber-800">Scanning Tips</h3>
                            </div>
                            <ul className="text-sm text-amber-700 space-y-1">
                                <li>• Ensure good lighting for better recognition</li>
                                <li>• Hold the product steady within the frame</li>
                                <li>• Make sure the ingredient list is clearly visible</li>
                                <li>• Try different angles if the first scan doesn't work</li>
                            </ul>
                        </div>
                    </div>
                )
            }

            {selectedProduct && (
                <div className='flex flex-col items-start justify-center gap-6 w-full mt-6 max-w-6xl mx-auto px-6'>
                    <IngredientDisclaimerModal />

                    {/* Product Header Card */}
                    <Card className="w-full border-gray-200 shadow-lg">
                        <CardContent className="p-4 sm:p-6">
                            <div className='flex flex-col gap-4 sm:gap-6'>
                                {/* Product Image - Full width on mobile */}
                                <div className='flex items-center justify-center w-full'>
                                    <div className='w-full max-w-[280px] sm:max-w-none sm:w-auto'>
                                        <ProductImage productImage={productImage} isLoading={loading} />
                                    </div>
                                </div>

                                {/* Product Info */}
                                <div className='flex flex-col gap-3 sm:gap-4 w-full'>
                                    {/* Title and KKM Status */}
                                    <div className='flex flex-col gap-3'>
                                        <h1 className='text-lg sm:text-xl md:text-2xl font-bold text-[#966c3b] leading-tight'>
                                            {selectedProduct}
                                        </h1>

                                        {/* KKM Status - Full width on mobile */}
                                        <div className='flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-4 w-full'>
                                            <div className='flex-1 order-2 sm:order-1'>
                                                <p className='text-sm text-gray-600 leading-relaxed'>
                                                    {isLoadingDescription ? (
                                                        <div className="flex items-center gap-2">
                                                            <div className="animate-spin h-4 w-4 border-2 border-[#966c3b] border-t-transparent rounded-full"></div>
                                                            <span className="text-xs sm:text-sm">Loading description...</span>
                                                        </div>
                                                    ) : productDescription || 'No description available'}
                                                </p>
                                            </div>

                                            {/* KKM Badge - Responsive */}
                                            <div className='flex flex-col items-start sm:items-end gap-2 order-1 sm:order-2 w-full sm:w-auto'>
                                                <Badge
                                                    onClick={() => {
                                                        if (npraProduct) {
                                                            handleGoToNPRAProduct(npraProduct);
                                                        } else {
                                                            toast.error('No NPRA product found');
                                                        }
                                                    }}
                                                    className={`hover:scale-105 transition-all duration-300 text-center cursor-pointer px-2 sm:px-3 py-1 w-fit sm:w-auto ${isExistNPRAProduct ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}
                                                >
                                                    <p className='text-xs font-medium whitespace-nowrap'>
                                                        {loadingNPRAProduct ? 'Checking...' : (isExistNPRAProduct ? 'KKM NOTIFIED' : 'NO KKM NOTIFICATION')}
                                                    </p>
                                                </Badge>
                                                <p className='text-xs text-gray-500 font-mono text-left sm:text-right w-full sm:w-auto'>
                                                    {loadingNPRAProduct ? 'Verifying...' : (npraProduct?.registration_no || 'Not registered')}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Ingredients Overview Card */}
                    <Card className="w-full border-gray-200 shadow-lg">
                        <CardHeader className="border-b border-gray-100">
                            <div className='flex items-center justify-between'>
                                <div className="flex items-center gap-2">
                                    <Sparkles className="h-5 w-5 text-[#966c3b]" />
                                    <CardTitle className='text-lg text-[#966c3b]'>Ingredients Overview</CardTitle>
                                </div>
                                {loading && <div className="animate-spin rounded-full h-5 w-5 border-2 border-[#966c3b] border-t-transparent"></div>}
                            </div>
                        </CardHeader>
                        <CardContent className="p-6">
                            <div className='flex flex-wrap items-start justify-start gap-3 mb-4'>
                                {(seeMoreIngredients ? ingredients : ingredients.slice(0, 8)).map((ingredient, index) => (
                                    <IngredientItem
                                        key={index}
                                        ingredient={ingredient}
                                        index={index}
                                        onViewDetails={getIngredientDetails}
                                    />
                                ))}
                            </div>

                            {ingredients.length > 8 && (
                                <Button
                                    variant='outline'
                                    size="sm"
                                    className='text-xs text-[#966c3b] hover:bg-[#966c3b]/10 hover:text-[#966c3b] transition-colors duration-300 rounded-lg'
                                    onClick={() => setSeeMoreIngredients(!seeMoreIngredients)}>
                                    {seeMoreIngredients ? 'Show Less' : `Show All (${ingredients.length})`}
                                </Button>
                            )}
                        </CardContent>
                    </Card>

                    {/* Skim Through Card */}
                    {(skimThrough.length > 0 || isLoadingSkimThrough || skimThroughError) && (
                        <div>
                            {isLoadingSkimThrough && (
                                <div className="flex items-center gap-2 text-gray-500">
                                    <div className="animate-spin h-4 w-4 border-2 border-[#966c3b] border-t-transparent rounded-full"></div>
                                    Analyzing ingredients...
                                </div>
                            )}
                            {skimThroughError && (
                                <div className="flex items-center gap-2 p-3 bg-red-50 rounded-lg">
                                    <AlertCircle className="w-4 h-4 text-red-500" />
                                    <p className="text-sm text-red-600">{skimThroughError}</p>
                                </div>
                            )}
                            {skimThrough.length > 0 && <SkimThroughTable skimThrough={skimThrough} />}
                        </div>
                    )}

                    <IngredientDetailDialog
                        researchs={researchs}
                        relatedProducts={relatedProducts}
                        ingredient={selectedIngredient}
                        showIngredientDialog={showIngredientDialog}
                        setShowIngredientDialog={setShowIngredientDialog}
                        setSelectedProduct={(product) => {
                            handleProductSelect(product)
                        }}
                        getProductIngredients={() => { }}
                        chemicalDetailProps={{
                            chemical: chemical || undefined,
                            chemical_loading: loadingChemical
                        }}
                    />

                    {/* Halal Analysis Button */}
                    <div className='flex w-full items-center justify-center'>
                        <HalalAnalysisDialog
                            halalAnalysis={halalAnalysis}
                            showHalalAnalysisDialog={showHalalAnalysisDialog}
                            setShowHalalAnalysisDialog={() => { toast.error('Not available yet') }}
                            reactNode={
                                <Button
                                    className='w-full max-w-md text-center'
                                    variant={"destructive"}
                                    disabled>
                                    <p className='text-sm'>
                                        Non-Halal Ingredients Checker (Coming Soon)
                                    </p>
                                </Button>
                            }
                            isLoading={loadingHalalAnalysis}
                        />
                    </div>
                </div>
            )}

            <ProductNotFoundDialog
                isOpen={isOpenProductNotFoundDialog}
                onOpenChange={setIsOpenProductNotFoundDialog}
                onRetry={() => {
                    startCamera();
                }}
                onSearchAlternative={() => {
                    router.push('/product-scanner');
                }}
            />

        </div>
    );
}

const ProductImage = ({ productImage, isLoading }: { productImage: string, isLoading: boolean }) => {
    if (isLoading) {
        return (
            <Skeleton className="w-48 h-48 rounded-xl shadow-md" />
        )
    }
    return (
        <div className="relative group">
            <img
                src={productImage}
                alt="Product"
                className="object-contain w-48 h-48 rounded-xl shadow-md transition-transform duration-300 group-hover:scale-105"
            />
        </div>
    )
}

const IngredientItem = ({
    ingredient,
    index,
    onViewDetails
}: {
    ingredient: any,
    index: number,
    onViewDetails: any
}) => {
    return (
        <Button
            variant="outline"
            size="sm"
            onClick={() => onViewDetails(ingredient)}
            className="text-xs text-gray-700 hover:text-[#966c3b] hover:bg-[#966c3b]/10 hover:border-[#966c3b] transition-all duration-300 rounded-full px-3 py-1 border-gray-300"
        >
            {ingredient.name}
        </Button>
    )
}


const HalalAnalysisDialog = ({
    halalAnalysis,
    showHalalAnalysisDialog,
    setShowHalalAnalysisDialog,
    reactNode,
    isLoading
}: HalalAnalysisDialogProps) => {
    const isHalal = halalAnalysis?.status !== 'doubtful';

    const getStatusColor = (status: string) => {
        switch (status?.toLowerCase()) {
            case 'halal':
                return 'bg-green-100 text-green-800';
            case 'doubtful':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <Dialog open={showHalalAnalysisDialog} onOpenChange={setShowHalalAnalysisDialog}>
            <DialogTrigger asChild>
                <div className="inline-block">{reactNode}</div>
            </DialogTrigger>

            <DialogContent className="w-full max-w-[90%] md:max-w-[80%] lg:max-w-[70%] xl:max-w-[60%] px-4 md:px-6">
                <DialogHeader>
                    <div className="flex flex-row items-start justify-between my-4">
                        <DialogTitle className="text-2xl font-semibold">Non-Halal Ingredients Checker</DialogTitle>
                        {!isLoading && (
                            <Badge
                                className={`${getStatusColor(halalAnalysis?.status)} px-3 py-1 text-xs font-medium rounded-full`}
                            >
                                {halalAnalysis?.status?.toUpperCase() || 'N/A'}
                            </Badge>
                        )}
                    </div>
                </DialogHeader>

                {isLoading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#966c3b] border-t-transparent" />
                    </div>
                ) : (
                    <div className="space-y-4">
                        {halalAnalysis?.doubtful_ingredients?.length > 0 ? (
                            <>
                                <div className="flex items-center gap-2 p-3 bg-amber-50 rounded-lg">
                                    <Info className="w-5 h-5 text-amber-500" />
                                    <p className="text-sm text-amber-700">
                                        The following ingredients require attention due to their source or processing method.
                                    </p>
                                </div>

                                <ScrollArea className="h-[400px] rounded-md border">
                                    <Table>
                                        <TableHeader className="sticky top-0 bg-white shadow-sm">
                                            <TableRow>
                                                <TableHead className="w-1/3">Ingredient</TableHead>
                                                <TableHead>Concern</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {halalAnalysis?.doubtful_ingredients.map((ingredient: any, index: number) => (
                                                <TableRow key={index} className="hover:bg-gray-50">
                                                    <TableCell className="font-medium">{ingredient.name}</TableCell>
                                                    <TableCell className="text-gray-700">{ingredient.reason}</TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </ScrollArea>
                            </>
                        ) : (
                            <div className="flex justify-center items-center h-32">
                                <p className="text-gray-500">No doubtful ingredients found.</p>
                            </div>
                        )}
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
};

export default ProductCameraScreen;
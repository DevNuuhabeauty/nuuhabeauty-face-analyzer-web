'use client'

import React, { useState, useRef, ReactNode } from 'react';
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
import { Sparkles, Search, Camera, Info, ChevronUp, ChevronDown, TrendingUp, Package, Zap, Lightbulb } from 'lucide-react';
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
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbSeparator
} from '@/components/ui/breadcrumb';
import SkinThroughTable from '../components/skim-through-table';
import { Skeleton } from '@/components/ui/skeleton';
import DefaultAutoCompeteFields from '@/src/core/shared/presentation/components/default-auto-compete-fields';
import SkimThroughTable from '../components/skim-through-table';
import IngredientDetailDialog from '../components/ingredient-detail-dialog';
import { useGetResearchs } from '../../tanstack/research.tanstack';
import { ResearchEntity } from '../../../entities/research-entity';
import { ChemicalEntity, IngredientsEntity } from '../../../entities/ingredients-entity';
import { getChemical } from '../../../infrastructures/repositories/chemical.api.service';
import { useGetChemical } from '../../tanstack/chemical.tantack';
import { useCheckNPRAProduct, useGetListNPRAProducts } from '../../tanstack/product.tanstack';
import { useRouter } from 'next/navigation';
import { NPRAEntity } from '../../../entities/product-entity';
import IngredientDisclaimerModal from '@/src/core/shared/presentation/components/ingredient-disclaimer-modal';
import { AccordionHeader } from '@radix-ui/react-accordion';



export interface SkimThrough {
    name: string;
    functions: string[];
    irritancy: number;
    comedogenicity: number[];
    id_rating: string;
}

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


const ProductSearchScreen = () => {

    const router = useRouter();

    const [searchTerm, setSearchTerm] = useState<string>('');
    const [suggestions, setSuggestions] = useState<string[]>([]);
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
    const [isSearching, setIsSearching] = useState<boolean>(false);
    const [productImage, setProductImage] = useState<string>('');
    const [relatedProducts, setRelatedProducts] = useState<RelatedProduct[]>([]);
    const [activeTab, setActiveTab] = useState<'details' | 'related'>('details');
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [showCamera, setShowCamera] = useState<boolean>(true);
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isStreamActive, setIsStreamActive] = useState(false);
    const [showCameraComponent, setShowCameraComponent] = useState(false);


    const [loadingHalalAnalysis, setLoadingHalalAnalysis] = useState(false);

    const [isTyping, setIsTyping] = useState(false);

    const [seeMoreIngredients, setSeeMoreIngredients] = useState(true);


    const [isLoadingDescription, setIsLoadingDescription] = useState(false);
    const [productDescription, setProductDescription] = useState<string>('');

    const [skimThrough, setSkimThrough] = useState<SkimThrough[]>([]);
    const [isLoadingSkimThrough, setIsLoadingSkimThrough] = useState(false);
    const [skimThroughError, setSkimThroughError] = useState<string | null>(null);

    const [researchs, setResearchs] = useState<ResearchEntity[]>([]);

    const [chemical, setChemical] = useState<ChemicalEntity | null>(null);

    const [npraProduct, setNpraProduct] = useState<NPRAEntity | null>(null);
    const [isExistNPRAProduct, setIsExistNPRAProduct] = useState<boolean>(false);

    // Popular products for initial state
    const popularProducts = [
        'Nuuha Beauty Serum Sunscreen',
        'Nuuha Beauty Glass Skin Moisturizer',
        'Nuuha Beauty Mugwort Hydra Bright Gentle Daily Foam Cleanser',
        'Nuuha Beauty 10x Soothing Complex Hyper Relief Serum',
        'Nuuha Beauty Mulberry Hydra Bright Pro Cleansing Balm',
        'Nuuha Beauty 4x Brightening Complex Advanced Glow Serum',
        'Nuuha Beauty 4 In 1 Hydra Bright Ultimate Korean Water Mist'
    ];

    // Add debounced search function
    const debouncedSearch = React.useCallback(
        async (term: string) => {
            if (!term.trim()) {
                setSuggestions([]);
                return;
            }

            setIsSearching(true);
            try {
                const response = await fetch(`${CONCERN_API_URL}/api/search`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ product: term }),
                    credentials: 'omit',
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch suggestions');
                }
                const { data } = await response.json();
                setSuggestions(Array.isArray(data) ? data : []);
            } catch (error) {
                console.error('Error searching products:', error);
                setSuggestions([]);
            } finally {
                setIsSearching(false);
            }
        },
        []
    );

    // Add useEffect for debouncing
    React.useEffect(() => {
        const timer = setTimeout(() => {
            if (searchTerm) {
                debouncedSearch(searchTerm);
            }
        }, 300); // 300ms delay

        return () => clearTimeout(timer);
    }, [searchTerm, debouncedSearch]);

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

            if (!response.ok) {
                console.log(response);
            }
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
                    if (!response.ok) {
                        return;
                    }
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
        const response = await fetch(`${CONCERN_API_URL}/api/product-description`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ product: productName }),
        });
        const { description } = await response.json();
        setProductDescription(description);
        setIsLoadingDescription(false);
    };

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



    const handleProductSelect = (product: string) => {
        setSelectedProduct(product);
        getProductIngredients(product);
        setSuggestions([]);
        setSearchTerm('');
        getProductDescription(product);
        getSkimThrough(product);
        getNPRAProduct(product);
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

    const handleQuickSearch = (product: string) => {
        setSearchTerm(product);
        handleProductSelect(product);
    };

    const clearSearch = () => {
        setSearchTerm('');
        setSuggestions([]);
        setSelectedProduct(null);
        setIngredients([]);
        setProductImage('');
        setProductDescription('');
        setSkimThrough([]);
    };

    //is typing use effect
    React.useEffect(() => {
        if (searchTerm.trim()) {
            setIsTyping(true);
        } else {
            setIsTyping(false);
        }
    }, [searchTerm]);

    return (
        <div className="flex flex-col items-start justify-start w-full min-h-screen">

            <div className="w-full bg-white/95 backdrop-blur-sm border-b border-gray-100 p-4 sticky top-0 z-10">
                <Breadcrumb>
                    <BreadcrumbList>
                        <BreadcrumbItem>
                            <BreadcrumbLink href="/product-scanner" className="text-gray-500 hover:text-[#966c3b] transition-colors">
                                Product Scanner
                            </BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbLink href="/product-ingredients/search" className="font-medium text-[#966c3b]">
                                Product Search
                            </BreadcrumbLink>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
            </div>

            <div className='flex flex-col items-start justify-start w-full gap-6 mt-4 max-w-6xl mx-auto'>

                {/* Enhanced Search Header */}
                <div className="w-full space-y-4 ">
                    <div className='flex flex-row items-center justify-between w-full'>
                        <div className='flex flex-col items-start justify-center gap-1'>
                            <h1 className="md:text-2xl text-xl font-bold flex items-center justify-start gap-3">
                                <Package className="md:w-8 md:h-8 w-6 h-6 text-[#966c3b]" />
                                Find Your Product
                            </h1>
                            <p className="md:text-sm text-xs text-gray-600">Search for any skincare product to analyze its ingredients and properties</p>
                        </div>

                        <Button
                            onClick={() => {
                                router.push('/product-ingredients/camera');
                            }}
                            variant='outline' className='text-xs'>
                            <Camera className="w-4 h-4 text-[#966c3b]" />
                            <span>Scan Product</span>
                        </Button>
                    </div>

                    <div className="relative  w-full">
                        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                            <Search className="h-5 w-5 text-gray-400" />
                        </div>
                        <Input
                            type="text"
                            placeholder="Search for a product..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-12 pr-12 py-6 border-gray-200 focus:border-[#966c3b] focus:ring-2 focus:ring-[#966c3b]/20 rounded-full shadow-sm text-base w-full"
                        />
                        {isSearching && (
                            <div className="absolute inset-y-0 right-4 flex items-center">
                                <div className="animate-spin h-5 w-5 border-2 border-[#966c3b] border-t-transparent rounded-full"></div>
                            </div>
                        )}
                        {searchTerm && (
                            <button
                                onClick={clearSearch}
                                className="absolute inset-y-0 right-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                ×
                            </button>
                        )}
                    </div>
                </div>

                {/* Search suggestions dropdown */}
                {suggestions.length > 0 && (
                    <div className="w-full  mx-auto relative z-20 -mt-2">
                        <DefaultAutoCompeteFields
                            handleSuggestionClick={(value) => { handleProductSelect(value) }}
                            suggestions={suggestions} />
                    </div>
                )}

                {/* Empty state with popular products */}
                {!selectedProduct && !loading && suggestions.length === 0 && !searchTerm && (
                    <div className="w-full space-y-6">
                        {/* Popular Products */}

                        <div className="w-full mx-auto">
                            <div className="bg-white border border-gray-200 shadow-sm rounded-lg">
                                {/* Header */}
                                <div className="p-4 pb-4 border-b border-gray-100">
                                    <div className="flex items-center gap-2 mb-2">
                                        <TrendingUp className="h-5 w-5 text-[#966c3b]" />
                                        <h2 className="text-lg font-semibold text-gray-900">Popular Products</h2>
                                    </div>
                                    <p className="text-gray-600 text-sm">Explore frequently searched skincare products</p>
                                </div>

                                {/* Content */}
                                <div className="p-4">
                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                                        {popularProducts.map((product, index) => (
                                            <button
                                                key={index}
                                                onClick={() => handleQuickSearch(product)}
                                                className="flex items-start gap-3 p-4 text-left border border-[#966c3b]/30 rounded-lg 
                                         text-[#966c3b] hover:bg-[#966c3b]/10 hover:border-[#966c3b] 
                                         transition-all duration-200 focus:outline-none focus:ring-2 
                                         focus:ring-[#966c3b]/20 group w-full"
                                            >
                                                <Package className="w-4 h-4 text-[#966c3b] flex-shrink-0 mt-0.5" />
                                                <span className="text-sm font-medium leading-snug text-left break-words">
                                                    {product}
                                                </span>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>


                        {/* <Card className="border-gray-200 shadow-sm w-full">
                            <CardHeader className="pb-4">
                                <div className="flex items-center gap-2">
                                    <TrendingUp className="h-5 w-5 text-[#966c3b]" />
                                    <CardTitle className="text-lg">Popular Products</CardTitle>
                                </div>
                                <p className="text-gray-600 text-sm">Explore frequently searched skincare products</p>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full">
                                    {popularProducts.map((product, index) => (
                                        <Button
                                            key={index}
                                            variant="outline"
                                            onClick={() => handleQuickSearch(product)}
                                            className="justify-start text-left h-auto p-3 border-[#966c3b]/30 text-[#966c3b] hover:bg-[#966c3b]/10 hover:border-[#966c3b] transition-all duration-200 w-full min-w-0"
                                        >
                                            <div className="flex items-start gap-3 w-full min-w-0">
                                                <Package className="w-4 h-4 text-[#966c3b] flex-shrink-0 mt-0.5" />
                                                <span className="text-xs font-medium text-left leading-tight break-words min-w-0 flex-1">
                                                    {product}
                                                </span>
                                            </div>
                                        </Button>
                                    ))}
                                </div>
                            </CardContent>
                        </Card> */}

                        {/* Tips Card */}
                        <Card className="border-amber-200 bg-amber-50/50 shadow-sm">
                            <CardHeader className="pb-4">
                                <div className="flex items-center gap-2">
                                    <Lightbulb className="h-5 w-5 text-amber-600" />
                                    <CardTitle className="text-lg text-amber-800">Search Tips</CardTitle>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <ul className="space-y-2 text-amber-700">
                                    <li className="flex items-start gap-2">
                                        <span className="text-amber-500 mt-1">•</span>
                                        <span>Try searching with brand name and product type (e.g., "Nuuha Beauty Serum Sunscreen")</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-amber-500 mt-1">•</span>
                                        <span>Use partial names - our search will find similar products</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-amber-500 mt-1">•</span>
                                        <span>Browse ingredients, get KKM verification, and analyze product safety</span>
                                    </li>
                                </ul>
                            </CardContent>
                        </Card>
                    </div>
                )}

                {/* No results state */}
                {searchTerm && suggestions.length === 0 && !isSearching && !selectedProduct && (
                    <div className="w-full py-12 flex flex-col items-center justify-center">
                        <div className="text-center space-y-4 max-w-md">
                            <Search className="h-12 w-12 text-gray-300 mx-auto" />
                            <h3 className="text-lg font-medium text-gray-900">No products found</h3>
                            <p className="text-gray-500">
                                We couldn't find any products matching "{searchTerm}".
                                Try a different search term or browse our popular products.
                            </p>
                            <div className="space-y-2">
                                <p className="text-sm text-gray-400">Popular searches:</p>
                                <div className="flex flex-wrap gap-2 justify-center">
                                    {popularProducts.slice(0, 3).map((product, index) => (
                                        <Button
                                            key={index}
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handleQuickSearch(product)}
                                            className="text-xs"
                                        >
                                            {
                                                product.includes('Glass Skin') ? 'Glass Skin Moisturizer' :
                                                    product.includes('Sunscreen') ? 'Serum Sunscreen' :
                                                        product.split(' ').slice(0, 3).join(' ')}
                                        </Button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {selectedProduct && (
                    <div className='flex flex-col items-start justify-center gap-4 sm:gap-6 w-full px-2 sm:px-0'>

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
                            <div className="w-full">
                                {isLoadingSkimThrough && (
                                    <div className="flex items-center gap-2 text-gray-500 px-2 sm:px-0">
                                        <div className="animate-spin h-4 w-4 border-2 border-[#966c3b] border-t-transparent rounded-full flex-shrink-0"></div>
                                        <span className="text-sm">Analyzing ingredients...</span>
                                    </div>
                                )}
                                {skimThroughError && <p className="text-sm text-red-500 px-2 sm:px-0">{skimThroughError}</p>}
                                {skimThrough.length > 0 && (
                                    <div className="overflow-x-auto">
                                        <SkimThroughTable skimThrough={skimThrough} />
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Halal Analysis Button */}
                        <div className='flex w-full items-center justify-center px-2 sm:px-0'>
                            <HalalAnalysisDialog
                                halalAnalysis={halalAnalysis}
                                showHalalAnalysisDialog={showHalalAnalysisDialog}
                                setShowHalalAnalysisDialog={() => { toast.error('Not available yet') }}
                                reactNode={
                                    <Button
                                        className='w-full max-w-md text-center'
                                        variant={"destructive"}
                                        disabled>
                                        <p className='text-xs sm:text-sm px-2'>
                                            Non-Halal Ingredients Checker (Coming Soon)
                                        </p>
                                    </Button>
                                }
                                isLoading={loadingHalalAnalysis}
                            />
                        </div>
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

            </div>
        </div >
    )
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

export default ProductSearchScreen;
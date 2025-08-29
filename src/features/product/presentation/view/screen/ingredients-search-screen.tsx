"use client"

import React, { useState, useCallback, useEffect } from "react";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Search, ChevronRight, ArrowLeft, Info, Copy, Share2, BookmarkIcon, AlertCircle, TrendingUp, Clock, Lightbulb } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { IngredientsEntity } from "../../../entities/ingredients-entity";
import { CONCERN_API_URL } from "@/src/core/constant";
import toast from "react-hot-toast";
import DefaultAutoCompeteFields from "@/src/core/shared/presentation/components/default-auto-compete-fields";
import { ResearchEntity } from "../../../entities/research-entity";
import { getResearchs } from "../../../infrastructures/repositories/research.api.service";
import { useGetResearchs } from "../../tanstack/research.tanstack";
import ResearchCard from "../components/research-card";
import { extractJournal } from "@/src/core/constant/helper";
import { extractYear } from "@/src/core/constant/helper";
import IngredientDisclaimerModal from "@/src/core/shared/presentation/components/ingredient-disclaimer-modal";

const IngredientsSearchScreen = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [isSearching, setIsSearching] = useState(false);
    const [suggestions, setSuggestions] = useState<IngredientsEntity[]>([]);
    const [selectedIngredientLoading, setSelectedIngredientLoading] = useState(false);
    const [selectedIngredient, setSelectedIngredient] = useState<IngredientsEntity | null>(null);
    const [selectedIngredientError, setSelectedIngredientError] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState('overview');
    const [hasSearched, setHasSearched] = useState(false);

    const [researchs, setResearchs] = useState<ResearchEntity[]>([]);
    const {
        mutate: getResearchs,
    } = useGetResearchs();

    const [expandedIds, setExpandedIds] = React.useState(new Set());

    // Popular ingredients for initial state
    const popularIngredients = [
        'Hyaluronic Acid', 'Retinol', 'Niacinamide', 'Vitamin C',
        'Salicylic Acid', 'Glycolic Acid', 'Ceramides', 'Peptides'
    ];

    // Recent searches (you can implement localStorage here)
    const recentSearches = [
        'Vitamin E', 'Argan Oil', 'Tea Tree Oil'
    ];

    const toggleExpand = (id: number) => {
        setExpandedIds(prev => {
            const newSet = new Set(prev);
            if (newSet.has(id)) {
                newSet.delete(id);
            } else {
                newSet.add(id);
            }
            return newSet;
        });
    };

    // Add debounced search function
    const debouncedSearch = useCallback(
        async (term: string) => {
            if (!term.trim()) {
                setSuggestions([]);
                setHasSearched(false);
                setIsSearching(false); // Set loading to false when term is empty
                return;
            }

            setIsSearching(true);
            setHasSearched(true);
            try {
                const response = await fetch(`${CONCERN_API_URL}/api/search-ingredients`, {
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
                setSuggestions(Array.isArray(data) ? data.map((item: any) => ({
                    name: item.name,
                    description: item.description ?? 'No description available',
                    image: item.url,
                })) : []);
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
    useEffect(() => {
        const timer = setTimeout(() => {
            if (searchTerm) {
                debouncedSearch(searchTerm);
            } else {
                // Clear suggestions, set hasSearched to false, and stop loading when searchTerm is empty
                setSuggestions([]);
                setHasSearched(false);
                setIsSearching(false); // Ensure loading stops when input is cleared
            }
        }, 300); // 300ms delay

        return () => clearTimeout(timer);
    }, [searchTerm, debouncedSearch]);

    const getIngredientDetails = async (ingredient: string) => {
        setSuggestions([]);
        setSearchTerm('');
        setHasSearched(false);
        setIsSearching(false); // Stop search loading when ingredient is selected
        try {
            setSelectedIngredientLoading(true);
            const response = await fetch(`${CONCERN_API_URL}/api/ingredient-info`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ product: ingredient }),
                credentials: 'omit',
            });
            const { data } = await response.json();
            if (data) {
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
                getListResearchs(data.name);
            } else {
                setSelectedIngredientError('No data found');
            }
        } catch (e: any) {
            setSelectedIngredientError(e.message);
        } finally {
            setSelectedIngredientLoading(false);
        }
    };

    const getListResearchs = (productName: string) => {
        getResearchs({ productName }, {
            onSuccess: (data) => {
                if (data) {
                    setResearchs(data);
                }
            },
            onError: (error) => {
                toast.error('Error getting research articles');
            }
        });
    }

    const handleCopyInfo = () => {
        if (!selectedIngredient) return;

        const text = `
Name: ${selectedIngredient.name}
Description: ${selectedIngredient.description}
Also Called: ${selectedIngredient.also_called}
What it does: ${selectedIngredient.what_it_does}
    `;

        navigator.clipboard.writeText(text);
        toast.success('Ingredient info copied to clipboard');
    };

    const handleQuickSearch = (ingredient: string) => {
        setSearchTerm(ingredient);
        getIngredientDetails(ingredient);
    };

    const clearSearch = () => {
        setSearchTerm('');
        setSuggestions([]);
        setHasSearched(false);
        setSelectedIngredient(null);
        setSelectedIngredientError(null);
        setIsSearching(false); // Ensure loading stops when manually clearing
    };

    return (
        <div className="flex flex-col items-start justify-start w-full min-h-screen p-2">
            <div className="w-full  sticky top-0 z-10 backdrop-blur-sm pb-6 border-b border-gray-100">

                <div className="space-y-4">
                    <div className="text-left space-y-2">
                        <h1 className="text-2xl font-bold text-gray-900">Discover Ingredients</h1>
                        <p className="md:text-md text-sm text-gray-600">Search for any skincare ingredient to learn about its benefits and properties</p>
                    </div>

                    <div className="relative w-full">
                        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                            <Search className="h-5 w-5 text-gray-400" />
                        </div>
                        <Input
                            type="text"
                            placeholder="Search for an ingredient... (e.g., Hyaluronic Acid, Retinol)"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-12 pr-12 py-6 border-gray-200 focus:border-[#966c3b] focus:ring-2 focus:ring-[#966c3b]/20 rounded-full shadow-sm text-base"
                        />
                        {isSearching && (
                            <div className="absolute inset-y-0 right-4 flex items-center">
                                <div className="animate-spin h-5 w-5 border-2 border-[#966c3b] border-t-transparent rounded-full"></div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Search suggestions dropdown */}
            {suggestions.length > 0 && (
                <div className="w-full relative z-20 -mt-2">
                    <DefaultAutoCompeteFields
                        suggestions={suggestions.map(suggestion => suggestion.name ?? '')}
                        handleSuggestionClick={getIngredientDetails}
                    />
                </div>
            )}

            {/* Empty state with popular ingredients */}
            {!selectedIngredient && !selectedIngredientLoading && !hasSearched && (
                <div className="w-full space-y-8 py-8">
                    {/* Popular Ingredients */}
                    <Card className="border-gray-200 shadow-sm">
                        <CardHeader className="pb-4">
                            <div className="flex items-center gap-2">
                                <TrendingUp className="h-5 w-5 text-[#966c3b]" />
                                <CardTitle className="text-lg">Popular Ingredients</CardTitle>
                            </div>
                            <CardDescription>Explore the most searched skincare ingredients</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-wrap gap-2">
                                {popularIngredients.map((ingredient, index) => (
                                    <Button
                                        key={index}
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleQuickSearch(ingredient)}
                                        className="border-[#966c3b]/30 text-[#966c3b] hover:bg-[#966c3b]/10 hover:border-[#966c3b] transition-all duration-200"
                                    >
                                        {ingredient}
                                    </Button>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

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
                                    <span>Try searching for common names like "Vitamin C" or scientific names like "L-Ascorbic Acid"</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-amber-500 mt-1">•</span>
                                    <span>Use partial names - typing "hyal" will find "Hyaluronic Acid"</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-amber-500 mt-1">•</span>
                                    <span>Explore ingredient categories, benefits, and potential side effects</span>
                                </li>
                            </ul>
                        </CardContent>
                    </Card>
                </div>
            )}

            {/* No results state */}
            {hasSearched && suggestions.length === 0 && !isSearching && searchTerm && (
                <div className="w-full py-12 flex flex-col items-center justify-center">
                    <div className="text-center space-y-4 max-w-md">
                        <Search className="h-12 w-12 text-gray-300 mx-auto" />
                        <h3 className="text-lg font-medium text-gray-900">No ingredients found</h3>
                        <p className="text-gray-500">
                            We couldn't find any ingredients matching "{searchTerm}".
                            Try searching with a different term or check the spelling.
                        </p>
                        <div className="space-y-2">
                            <p className="text-sm text-gray-400">Popular searches:</p>
                            <div className="flex flex-wrap gap-2 justify-center">
                                {popularIngredients.slice(0, 4).map((ingredient, index) => (
                                    <Button
                                        key={index}
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleQuickSearch(ingredient)}
                                        className="text-xs"
                                    >
                                        {ingredient}
                                    </Button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Loading state */}
            {selectedIngredientLoading && (
                <div className="w-full py-12 flex flex-col items-center">
                    <div className="w-16 h-16 border-4 border-[#966c3b]/20 border-t-[#966c3b] rounded-full animate-spin mb-4"></div>
                    <p className="text-gray-500">Loading ingredient details...</p>
                </div>
            )}

            {/* Error state */}
            {selectedIngredientError && (
                <div className="w-full p-6 flex flex-col items-center justify-center bg-red-50 rounded-lg mt-4">
                    <AlertCircle className="h-8 w-8 text-red-500 mb-2" />
                    <p className="text-center text-red-600 font-medium">Failed to fetch ingredient details</p>
                    <p className="text-center text-red-500">{selectedIngredientError}</p>
                    <Button
                        variant="outline"
                        className="mt-4"
                        onClick={() => setSelectedIngredientError(null)}
                    >
                        Try Again
                    </Button>
                </div>
            )}

            {/* Ingredient details */}
            {selectedIngredient && !selectedIngredientLoading && (
                <div className="w-full mt-6 space-y-6">
                    <IngredientDisclaimerModal />
                    <Card className="border-gray-200 shadow-lg overflow-hidden">
                        <CardContent className="p-0">
                            <div className="grid md:grid-cols-[280px_1fr] grid-cols-1">
                                <div className="bg-gradient-to-br from-[#f8f4ee] to-[#f0e8db] p-6 flex items-start justify-center">
                                    <IngredientImage
                                        ingredientImage={selectedIngredient.image ?? ''}
                                        isLoading={selectedIngredientLoading}
                                        name={selectedIngredient.name ?? ''}
                                    />
                                </div>

                                <div className="p-6">
                                    <div className="flex items-start justify-between mb-6">
                                        <div>
                                            <h1 className="text-3xl font-bold text-gray-900 mb-2">{selectedIngredient.name}</h1>
                                            {selectedIngredient.category && (
                                                <Badge variant="outline" className="bg-[#966c3b]/10 text-[#966c3b] border-[#966c3b]/30 px-3 py-1">
                                                    {selectedIngredient.category}
                                                </Badge>
                                            )}
                                        </div>

                                        <div className="flex gap-2">
                                            <TooltipProvider>
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <Button variant="ghost" size="icon" onClick={handleCopyInfo}>
                                                            <Copy className="h-4 w-4" />
                                                        </Button>
                                                    </TooltipTrigger>
                                                    <TooltipContent>
                                                        <p>Copy ingredient info</p>
                                                    </TooltipContent>
                                                </Tooltip>
                                            </TooltipProvider>
                                        </div>
                                    </div>

                                    <Tabs defaultValue="overview" className="w-full">
                                        <TabsList className="w-full mb-4 bg-gray-100">
                                            <TabsTrigger value="overview" className="flex-1">Overview</TabsTrigger>
                                            <TabsTrigger value="properties" className="flex-1">Properties</TabsTrigger>
                                            <TabsTrigger value="uses" className="flex-1">Uses</TabsTrigger>
                                            <TabsTrigger value="research" className="flex-1">Research</TabsTrigger>
                                        </TabsList>

                                        <TabsContent value="overview" className="space-y-6">
                                            {selectedIngredient.description && (
                                                <div>
                                                    <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Description</h2>
                                                    <p className="text-gray-700 leading-relaxed text-base">{selectedIngredient.description}</p>
                                                </div>
                                            )}

                                            {selectedIngredient.also_called && (
                                                <div>
                                                    <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Also Called</h2>
                                                    <p className="text-gray-700 text-base">{selectedIngredient.also_called}</p>
                                                </div>
                                            )}

                                            {selectedIngredient.what_it_does && (
                                                <div>
                                                    <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">What It Does</h2>
                                                    <div className="space-y-4">
                                                        <div className="flex flex-wrap gap-2">
                                                            {selectedIngredient.what_it_does.map((item: string, index: number) => (
                                                                <Badge
                                                                    key={index}
                                                                    variant="outline"
                                                                    className="px-3 py-1.5 text-sm bg-[#966c3b]/10 text-[#966c3b] border-[#966c3b]/20"
                                                                >
                                                                    {item.trim()}
                                                                </Badge>
                                                            ))}
                                                        </div>
                                                        <ul className="list-disc list-inside space-y-2">
                                                            {selectedIngredient.what_it_does.map((item: string, index: number) => (
                                                                <li key={index} className="text-gray-700 text-sm leading-relaxed">
                                                                    {item.trim()}
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                </div>
                                            )}
                                        </TabsContent>

                                        <TabsContent value="properties">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                {selectedIngredient.irritancy !== undefined && (
                                                    <div className="bg-gray-50 p-6 rounded-xl">
                                                        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Irritancy</h2>
                                                        <div className="flex items-center">
                                                            <div className="flex-1 h-3 bg-gray-200 rounded-full overflow-hidden">
                                                                <div
                                                                    className="h-full bg-gradient-to-r from-green-500 to-red-500 transition-all duration-500"
                                                                    style={{ width: `${(Number(selectedIngredient.irritancy) / 5) * 100}%` }}
                                                                ></div>
                                                            </div>
                                                            <span className="ml-3 font-semibold text-lg">{selectedIngredient.irritancy}/5</span>
                                                        </div>
                                                    </div>
                                                )}

                                                {selectedIngredient.comedogenicity !== undefined && (
                                                    <div className="bg-gray-50 p-6 rounded-xl">
                                                        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Comedogenicity</h2>
                                                        <div className="flex items-center">
                                                            <div className="flex-1 h-3 bg-gray-200 rounded-full overflow-hidden">
                                                                <div
                                                                    className="h-full bg-gradient-to-r from-green-500 to-red-500 transition-all duration-500"
                                                                    style={{ width: `${(Number(selectedIngredient.comedogenicity) / 5) * 100}%` }}
                                                                ></div>
                                                            </div>
                                                            <span className="ml-3 font-semibold text-lg">{selectedIngredient.comedogenicity}/5</span>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </TabsContent>

                                        <TabsContent value="uses">
                                            {selectedIngredient.functions && selectedIngredient.functions.length > 0 ? (
                                                <div className="space-y-4">
                                                    <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Functional Properties</h2>
                                                    <div className="flex flex-wrap gap-3">
                                                        {selectedIngredient.functions.map((func, index) => (
                                                            <Badge key={index} className="bg-[#966c3b]/10 text-[#966c3b] border-[#966c3b]/20 px-4 py-2 text-sm font-medium">
                                                                {func}
                                                            </Badge>
                                                        ))}
                                                    </div>
                                                </div>
                                            ) : (
                                                <p className="text-gray-500 italic text-center py-8">No specific uses information available</p>
                                            )}
                                        </TabsContent>

                                        <TabsContent value="research" className="mt-0 p-0 w-full">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                                                {researchs?.map((research, index) => (
                                                    <ResearchCard
                                                        key={index}
                                                        research={research}
                                                        index={index}
                                                        expandedIds={expandedIds as Set<number>}
                                                        toggleExpand={toggleExpand}
                                                        extractYear={extractYear}
                                                        extractJournal={extractJournal}
                                                    />
                                                ))}
                                            </div>
                                        </TabsContent>
                                    </Tabs>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    );
};

const IngredientImage = ({ ingredientImage, isLoading, name }: { ingredientImage: string, isLoading: boolean, name?: string }) => {
    if (isLoading) {
        return <Skeleton className="w-48 h-48 rounded-xl" />;
    }

    if (!ingredientImage) {
        return (
            <div className="w-48 h-48 rounded-xl bg-[#966c3b]/10 flex flex-col items-center justify-center border border-[#966c3b]/20">
                <div className="text-6xl font-light text-[#966c3b] mb-2">{name?.substring(0, 1).toUpperCase() || 'N/A'}</div>
                <p className="text-sm text-gray-500">No image available</p>
            </div>
        );
    }

    return (
        <div className="relative group overflow-hidden rounded-xl shadow-md">
            <img src={ingredientImage} alt={name} className="object-contain w-48 h-48 transition-transform duration-300 group-hover:scale-105" />
        </div>
    );
};

export default IngredientsSearchScreen;
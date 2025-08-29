"use client"
import React, { useState, useMemo } from "react";
import { Search, Check, ChevronDown } from "lucide-react";
import { SkimThrough } from "../../../entities/skim-through";

// Import Shadcn UI components
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// Type definitions
export type IngredientRating = "beneficial" | "irritant";
export type IngredientFunction = "sunscreen" | "solvent" | "emulsifying" | "antimicrobial" | string;

export interface Ingredient {
    name: string;
    function: IngredientFunction | IngredientFunction[];
    irritation: string | number | null;
    rating: IngredientRating;
    description?: string;
}

const SkimThroughTable = ({ skimThrough }: { skimThrough: SkimThrough[] }) => {
    const [filter, setFilter] = useState<string>("all");
    const [searchQuery, setSearchQuery] = useState("");

    // Extract unique functions from skimThrough data for filter options
    const uniqueFunctions = useMemo(() => {
        if (!skimThrough || !Array.isArray(skimThrough) || skimThrough.length === 0) {
            return [];
        }

        const functionsSet = new Set<string>();
        skimThrough.filter(item => item.name !== "").forEach(item => {
            if (item.functions && Array.isArray(item.functions)) {
                item.functions.forEach(func => func && functionsSet.add(func));
            }
        });
        return Array.from(functionsSet);
    }, [skimThrough]);

    // Filter and sort ingredients - irritants first, then beneficial
    const getFilteredAndSortedIngredients = useMemo(() => {
        if (!skimThrough || !Array.isArray(skimThrough)) {
            return [];
        }

        const filtered = skimThrough.filter(item => {
            // Apply function filter
            const functionMatch = filter === "all" ||
                (item.functions && Array.isArray(item.functions) &&
                    item.functions.some(func =>
                        func && func.toLowerCase() === filter.toLowerCase()
                    ));

            // Apply search filter
            const searchMatch = !searchQuery ||
                (item.name && item.name.toLowerCase().includes(searchQuery.toLowerCase()));

            return functionMatch && searchMatch;
        });

        // Sort ingredients: irritants (not goodie) first, then beneficial
        return filtered.sort((a, b) => {
            const isGoodieA = a.id_rating?.toLowerCase() === "goodie" ||
                a.id_rating?.toLowerCase() === "superstar" ||
                a.id_rating?.toLowerCase() === "";
            const isGoodieB = b.id_rating?.toLowerCase() === "goodie" ||
                b.id_rating?.toLowerCase() === "superstar" ||
                b.id_rating?.toLowerCase() === "";

            // If A is not goodie and B is goodie, A comes first
            if (!isGoodieA && isGoodieB) return -1;
            // If A is goodie and B is not goodie, B comes first
            if (isGoodieA && !isGoodieB) return 1;
            // If both are same category, maintain original order
            return 0;
        });
    }, [skimThrough, filter, searchQuery]);

    // Helper functions
    const capitalizeFirstLetter = (string: string) => {
        if (!string) return '';
        return string.charAt(0).toUpperCase() + string.slice(1);
    };

    // Get the current filter display name
    const getFilterDisplayName = () => {
        return filter === "all" ? "All Functions" : capitalizeFirstLetter(filter);
    };

    return (
        <div className="w-full mx-auto">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                {/* Header */}
                <div className="bg-primary p-6">
                    <h1 className="text-2xl font-bold text-white">Skincare Ingredient Analysis</h1>
                    <p className="text-green-100 mt-1">Understanding what's in your skincare</p>
                </div>

                <div className="p-6 space-y-6">
                    {/* Filters and Search */}
                    <div className="flex flex-wrap items-center justify-between gap-4">
                        <div className="flex items-center flex-wrap gap-2">
                            <span className="text-sm font-medium">Filter by:</span>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="outline" className="flex items-center gap-1">
                                        {getFilterDisplayName()}
                                        <ChevronDown className="h-4 w-4 ml-1" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="start" className="w-56">
                                    <DropdownMenuItem
                                        className={`flex items-center justify-between ${filter === "all" ? "bg-primary/10" : ""}`}
                                        onClick={() => setFilter("all")}
                                    >
                                        All Functions
                                        {filter === "all" && <Check className="h-4 w-4" />}
                                    </DropdownMenuItem>
                                    {uniqueFunctions.map((option) => (
                                        <DropdownMenuItem
                                            key={option}
                                            className={`flex items-center justify-between ${filter === option ? "bg-primary/10" : ""}`}
                                            onClick={() => setFilter(option)}
                                        >
                                            {capitalizeFirstLetter(option)}
                                            {filter === option && <Check className="h-4 w-4" />}
                                        </DropdownMenuItem>
                                    ))}
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                        <div className="relative">
                            <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                            <Input
                                type="text"
                                placeholder="Search ingredients..."
                                className="pl-8 pr-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Rating Legend - SIMPLIFIED to only two types */}
                    <div className="flex flex-wrap gap-4">
                        <div className="flex items-center gap-1.5">
                            <span className="inline-block w-3 h-3 rounded-full bg-red-500"></span>
                            <span className="text-sm">Known Irritant (shown first)</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <span className="inline-block w-3 h-3 rounded-full bg-green-500"></span>
                            <span className="text-sm">Beneficial</span>
                        </div>
                    </div>

                    {/* Results Count */}
                    <div className="text-sm text-gray-600">
                        Showing {getFilteredAndSortedIngredients.filter(ingredient => ingredient.name !== "").length} ingredients
                    </div>

                    {/* Ingredient Cards Grid - All items displayed */}
                    {getFilteredAndSortedIngredients.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {getFilteredAndSortedIngredients.filter(ingredient => ingredient.name !== "").map((ingredient, index) => {
                                const isGoodie = ingredient.id_rating?.toLowerCase() === "goodie" ||
                                    ingredient.id_rating?.toLowerCase() === "superstar" ||
                                    ingredient.id_rating?.toLowerCase() === "";

                                return (
                                    <div
                                        key={index}
                                        className={`border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow ${isGoodie ? 'border-l-green-500' : 'border-l-red-500'}`}
                                        style={{
                                            borderLeftWidth: '4px',
                                        }}
                                    >
                                        <div className="p-4">
                                            <div className="flex justify-between items-start mb-2 gap-2">
                                                <h3 className="font-medium">{ingredient.name ?? "N/A"}</h3>
                                                {isGoodie ? (
                                                    <span className="text-xs px-3 py-1 rounded-full bg-green-500 text-white">
                                                        Beneficial
                                                    </span>
                                                ) : (
                                                    <span className="text-xs px-3 py-1 rounded-full bg-red-500 text-white text-center">
                                                        Known Irritant
                                                    </span>
                                                )}
                                            </div>

                                            <div className="space-y-1 text-sm">
                                                <p>
                                                    <span className="text-gray-500">Function:</span>{" "}
                                                    <span className="text-gray-700">{Array.isArray(ingredient.functions)
                                                        ? ingredient.functions.join(", ")
                                                        : ingredient.functions || "N/A"}</span>
                                                </p>
                                                <p>
                                                    <span className="text-gray-500">Irritation:</span>{" "}
                                                    <span className="text-gray-700">{ingredient.irritancy !== null && ingredient.irritancy !== undefined
                                                        ? ingredient.irritancy
                                                        : "N/A"}</span>
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="py-8 text-center">
                            <p className="text-gray-500">No ingredients found</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SkimThroughTable;
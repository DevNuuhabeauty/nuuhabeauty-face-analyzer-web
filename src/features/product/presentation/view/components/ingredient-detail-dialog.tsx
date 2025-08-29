"use client"

import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles, Share, BookmarkPlus, X, ExternalLinkIcon, BookOpenIcon, Calendar, FileText } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useGetResearchs } from "../../tanstack/research.tanstack";
import { useQueryClient } from "@tanstack/react-query";
import { ResearchEntity } from "../../../entities/research-entity";
import { CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import ResearchCard from "./research-card";
import { extractJournal } from "@/src/core/constant/helper";
import { extractYear } from "@/src/core/constant/helper";
import { Skeleton } from "@/components/ui/skeleton";
import { ChemicalEntity } from "../../../entities/ingredients-entity";


interface ChemicalDetailProps {
    chemical?: ChemicalEntity;
    chemical_loading?: boolean;
}

interface IngredientDetailProps {
    ingredient: any;
    showIngredientDialog: boolean;
    setShowIngredientDialog: (show: boolean) => void;
    loading?: boolean;
    relatedProducts?: any[];
    setSelectedProduct?: (product: any) => void;
    getProductIngredients?: () => void;
    researchs?: ResearchEntity[];
    chemicalDetailProps?: ChemicalDetailProps;
}

const IngredientDetailDialog = ({
    ingredient,
    showIngredientDialog,
    setShowIngredientDialog,
    loading = false,
    relatedProducts = [],
    setSelectedProduct,
    getProductIngredients,
    researchs,
    chemicalDetailProps
}: IngredientDetailProps) => {
    if (!ingredient) return null;

    const [activeTab, setActiveTab] = useState("details");
    const [expandedIds, setExpandedIds] = React.useState(new Set());

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


    const chemical_data = [
        {
            title: 'Chemical Formula',
            value: chemicalDetailProps?.chemical_loading ? 'Loading...' : chemicalDetailProps?.chemical?.molecular_formula ? chemicalDetailProps?.chemical?.molecular_formula : 'No Data Available'
        },
        {
            title: 'Molecular Weight',
            value: chemicalDetailProps?.chemical_loading ? 'Loading...' : chemicalDetailProps?.chemical?.molecular_weight ? chemicalDetailProps?.chemical?.molecular_weight : 'No Data Available'
        },
        {
            title: 'IUPAC Name',
            value: chemicalDetailProps?.chemical_loading ? 'Loading...' : chemicalDetailProps?.chemical?.iupac_name ? chemicalDetailProps?.chemical?.iupac_name : 'No Data Available'
        },
        {
            title: 'Inchi Key',
            value: chemicalDetailProps?.chemical_loading ? 'Loading...' : chemicalDetailProps?.chemical?.inchi_key ? chemicalDetailProps?.chemical?.inchi_key : 'No Data Available'
        },
    ]



    return (
        <Dialog open={showIngredientDialog} onOpenChange={setShowIngredientDialog}>
            <DialogContent className="w-[calc(100vw-32px)] md:max-w-[80%] lg:max-w-[70%] xl:max-w-[60%] px-0 pt-0 overflow-hidden md:h-[90vh] h-[80vh] rounded-lg">
                <DialogHeader className="p-0 m-0">
                    <DialogTitle className="sr-only">
                        {ingredient.name} Details
                    </DialogTitle>
                </DialogHeader>
                <ScrollArea className="w-full">
                    <div className="flex flex-col items-start w-full">

                        <div className="p-4 sm:p-6 border-b w-full flex justify-between items-center bg-white sticky top-0 z-10">
                            <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800 line-clamp-2">
                                {ingredient.name}
                            </h1>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setShowIngredientDialog(false)}
                                className="h-8 w-8 rounded-full hover:bg-gray-100"
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        </div>

                        <Tabs defaultValue="details" className="w-full" onValueChange={setActiveTab} value={activeTab}>
                            <div className="border-b sticky top-[60px] sm:top-[72px] z-10 bg-white">
                                <ScrollArea>
                                    <div className="min-w-max">
                                        <TabsList className="h-auto p-0 bg-transparent border-b-0 justify-start flex"
                                            defaultValue={activeTab}>
                                            <TabsTrigger
                                                value="details"
                                                className="px-3 sm:px-6 py-2 sm:py-3 rounded-none border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:shadow-none data-[state=active]:bg-transparent border-transparent whitespace-nowrap text-sm font-medium"
                                            >
                                                Details
                                            </TabsTrigger>

                                            <TabsTrigger
                                                value="products"
                                                className="px-3 sm:px-6 py-2 sm:py-3 rounded-none border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:shadow-none data-[state=active]:bg-transparent border-transparent whitespace-nowrap text-sm font-medium"
                                            >
                                                Products {relatedProducts.length > 0 && (
                                                    <Badge variant="secondary" className="ml-2 text-xs">{relatedProducts.length}</Badge>
                                                )}
                                            </TabsTrigger>

                                            <TabsTrigger
                                                value="research"
                                                className="px-3 sm:px-6 py-2 sm:py-3 rounded-none border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:shadow-none data-[state=active]:bg-transparent border-transparent whitespace-nowrap text-sm font-medium"
                                            >
                                                Research {researchs && researchs.length > 0 && (
                                                    <Badge variant="secondary" className="ml-2 text-xs">{researchs.length}</Badge>
                                                )}
                                            </TabsTrigger>

                                            <TabsTrigger
                                                value="uses"
                                                className="px-3 sm:px-6 py-2 sm:py-3 rounded-none border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:shadow-none data-[state=active]:bg-transparent border-transparent whitespace-nowrap text-sm font-medium"
                                            >
                                                Uses
                                                {ingredient.functions && ingredient.functions.length > 0 && (
                                                    <Badge variant="secondary" className="ml-2 text-xs">{ingredient.functions.length}</Badge>
                                                )}
                                            </TabsTrigger>
                                        </TabsList>
                                    </div>
                                </ScrollArea>
                            </div>

                            {loading ? (
                                <div className="flex justify-center py-8 sm:py-12">
                                    <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent"></div>
                                </div>
                            ) : (
                                <div className="h-[calc(80vh-120px)] md:h-[calc(90vh-120px)] px-4 sm:px-6 py-4 overflow-y-auto flex flex-col items-start w-full">

                                    <TabsContent value="details" className="mt-0 p-0 w-full space-y-6">
                                        {/* Ingredient image */}
                                        <div className="flex justify-center">
                                            <IngredientImage
                                                ingredientImage={chemicalDetailProps?.chemical?.image ?? ingredient.image}
                                                isLoading={chemicalDetailProps?.chemical_loading || loading}
                                                name={ingredient.name}
                                            />
                                        </div>

                                        {/* Chemical information */}
                                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                            {chemical_data.map((item, index) => {
                                                return (

                                                    <div key={index} className="flex flex-col items-start justify-start gap-1 border p-4 rounded-lg hover:bg-gray-50 transition-all duration-300 w-full">
                                                        <h2 className="text-sm font-medium text-gray-500 mb-1">{item.title}</h2>
                                                        <p className="text-gray-900 font-mono text-sm line-clamp-1 text-overflow-ellipsis">{item.value}</p>
                                                    </div>
                                                )
                                            })}
                                        </div>

                                        {/* What it does */}
                                        <div className="space-y-2">
                                            <h2 className="text-lg font-medium text-gray-900 flex items-center gap-2">
                                                <Sparkles className="h-4 w-4 text-primary" />
                                                What It Does
                                            </h2>
                                            <Separator className="bg-gray-100" />
                                            <div className="space-y-4">
                                                <div className="flex flex-wrap gap-2">
                                                    {ingredient.what_it_does.map((item: string, index: number) => (
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
                                                    {ingredient.what_it_does.map((item: string, index: number) => (
                                                        <li key={index} className="text-gray-700 text-sm leading-relaxed">
                                                            {item.trim()}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </div>

                                        {/* Also known as */}
                                        <div className="space-y-2">
                                            <h2 className="text-lg font-medium text-gray-900 flex items-center gap-2">
                                                <BookmarkPlus className="h-4 w-4 text-primary" />
                                                Also Known As
                                            </h2>
                                            <Separator className="bg-gray-100" />
                                            {ingredient.also_called ? (
                                                <div className="flex flex-wrap gap-2 py-2">
                                                    {ingredient.also_called.split(',').map((alias: string, index: number) => (
                                                        <Badge
                                                            key={index}
                                                            variant="outline"
                                                            className="px-3 py-1 rounded-full text-sm text-gray-700 border-gray-200 bg-gray-50"
                                                        >
                                                            {alias.trim()}
                                                        </Badge>
                                                    ))}
                                                </div>
                                            ) : (
                                                <div className="py-4 rounded-md bg-gray-50 flex justify-center">
                                                    <p className="text-gray-500 text-sm">No alternative names found</p>
                                                </div>
                                            )}
                                        </div>

                                        {/* Description */}
                                        <div className="space-y-2">
                                            <h2 className="text-lg font-medium text-gray-900 flex items-center gap-2">
                                                <BookOpenIcon className="h-4 w-4 text-primary" />
                                                Description
                                            </h2>
                                            <Separator className="bg-gray-100" />
                                            {ingredient.description ? (
                                                <p className="text-gray-700 text-sm leading-relaxed py-2">
                                                    {ingredient.description}
                                                </p>
                                            ) : (
                                                <div className="py-4 rounded-md bg-gray-50 flex justify-center">
                                                    <p className="text-gray-500 text-sm">No description available</p>
                                                </div>
                                            )}
                                        </div>
                                    </TabsContent>

                                    <TabsContent value="products" className="mt-0 p-0 w-full">
                                        {relatedProducts.length > 0 ? (
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 w-full items-start">
                                                {relatedProducts.map((product, index) => (
                                                    <Card
                                                        key={index}
                                                        className="p-3 sm:p-4 hover:bg-primary/5 transition-all duration-300 border-primary/20 hover:shadow-sm flex flex-row justify-between items-center"
                                                    >
                                                        <div>
                                                            <h5 className="font-medium text-sm sm:text-base">{product.name}</h5>
                                                            {product.brand && (
                                                                <p className="text-xs text-muted-foreground">{product.brand}</p>
                                                            )}
                                                        </div>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            className="text-xs sm:text-sm text-primary hover:text-primary/80 hover:bg-primary/10 transition-colors duration-300"
                                                            onClick={() => {
                                                                setShowIngredientDialog(false);
                                                                if (setSelectedProduct) setSelectedProduct(product.name);
                                                            }}
                                                        >
                                                            View
                                                        </Button>
                                                    </Card>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="flex flex-col items-center justify-center p-8 rounded-md bg-gray-50 border border-dashed">
                                                <p className="text-gray-500 text-sm text-center">No related products found with this ingredient.</p>
                                            </div>
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

                                    <TabsContent value="uses">
                                        {ingredient.functions && ingredient.functions.length > 0 ? (
                                            <div className="space-y-2">
                                                <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Functional Properties</h2>
                                                <div className="flex flex-wrap gap-2">
                                                    {ingredient.functions.map((func: string, index: number) => (
                                                        <Badge key={index} className="bg-[#966c3b]/10 text-[#966c3b] border-[#966c3b]/20 px-3 py-1">
                                                            {func}
                                                        </Badge>
                                                    ))}
                                                </div>
                                            </div>
                                        ) : (
                                            <p className="text-gray-500 italic">No specific uses information available</p>
                                        )}
                                    </TabsContent>

                                </div>
                            )}
                        </Tabs>
                    </div>
                </ScrollArea>
            </DialogContent>
        </Dialog>
    );
};


const IngredientImage = ({ ingredientImage, isLoading, name }: { ingredientImage: string, isLoading: boolean, name?: string }) => {
    if (isLoading) {
        return <Skeleton className="w-48 h-48 rounded-lg" />;
    }

    if (!ingredientImage) {
        return (
            <div className="w-48 h-48 rounded-lg bg-[#966c3b]/5 flex flex-col items-center justify-center">
                <div className="text-5xl font-light text-[#966c3b]">{name?.substring(0, 1).toUpperCase() || 'N/A'}</div>
                <p className="text-sm text-gray-500 mt-2">No image available</p>
            </div>
        );
    }

    return (
        <div className="relative group overflow-hidden rounded-lg">
            <img src={ingredientImage} alt={name} className="object-contain w-48 h-48 transition-transform duration-300 group-hover:scale-105" />
        </div>
    );
};


export default IngredientDetailDialog;
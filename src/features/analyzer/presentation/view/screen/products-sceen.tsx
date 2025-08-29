"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import ProductCard from "../components/product-card";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { useGetProducts } from "../../tanstack/product-tanstack";
import { ConcernEntity, ProductEntity } from "../../../entities/product-entity";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { ConcernBarChart } from "../components/concern-bar-chart";
import { BASE_64, sunscreenImages } from "@/src/core/constant";
import { Riple } from 'react-loading-indicators';
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { useRemoveBackground } from "../../tanstack/face-analyze-tanstack";
import InfoScreen from "@/src/core/shared/presentation/components/info-screen";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import LZString from "lz-string";
import ShinyText from "@/src/core/shared/presentation/components/shiny-text";
import ConcernChip from "../components/concern-chip";
import { capitalizeFirstLetter } from "@/src/core/constant/helper";
import { SaveIcon } from "lucide-react";
import { AnalysisEntity } from "../../../entities/analysis-entity";




const isBad = (analysis: AnalysisEntity) => {
    if (analysis.skin_condition === 'moderate' || analysis.skin_condition === 'concerning') {
        return true;
    }
    return false;
}



const ProductsScreen = () => {


    const queryClient = useQueryClient();
    const { data: analysis, isLoading, error } = useQuery<AnalysisEntity, Error>({
        queryKey: ['getProducts'],
        queryFn: async () => {
            // First try to get from query cache
            const cachedData = queryClient.getQueryData<AnalysisEntity>(['getProducts']);
            if (cachedData) {
                return cachedData;
            }

            // Then try to get from localStorage
            const savedData = localStorage.getItem('analysisData');
            if (savedData) {
                const parsedData = JSON.parse(savedData) as AnalysisEntity;
                // Update the query cache with the localStorage data
                queryClient.setQueryData<AnalysisEntity>(['getProducts'], parsedData);
                return parsedData;
            }

            throw new Error('No analysis data found. Please scan your face first.');
        },
        staleTime: Infinity,

    });


    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="flex flex-col items-center justify-center gap-4">
                    <Riple color="#32cd32" size="large" />
                    <div className="space-y-2 text-center">
                        <p className="text-lg">Loading product recommendation</p>
                        <ShinyText text="Please wait" disabled={false} speed={5} />
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center h-screen">
                <p className="text-lg text-red-500">Error: {error.message}</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-start w-full gap-4 p-4">
            <BuildHeadProduct />


            <div className="grid grid-cols-1 items-center justify-center w-full mt-4 gap-4">
                {
                    analysis && analysis.userImage && (
                        <div className="flex flex-col w-full justify-center items-center mb-4">
                            <BuildImage analysis={analysis} removeBackground={analysis.userImage} />

                            <div className="flex flex-row items-center justify-center  mt-8 w-full">
                                <div className="flex-1">
                                    <BuildDataImage
                                        title="Status Face"
                                        description={capitalizeFirstLetter(analysis.status_face ?? 'N/A')} />
                                </div>

                                <div className="w-[2px] h-20 bg-gray-200" />

                                <div className="flex-1">
                                    <BuildDataImage
                                        title="Skin Condition"
                                        description={capitalizeFirstLetter(analysis.skin_condition || 'N/A')} />
                                </div>
                            </div>

                        </div>
                    )
                }
                {
                    analysis && isBad(analysis) && (
                        <ConcernBarChart diseases={analysis?.diseases || []} />
                    )
                }
            </div>


            <div className="flex flex-col items-start justify-center gap-4 mt-4">
                <div className="flex flex-col items-start justify-center">
                    <h1 className="text-2xl font-bold">Products Recommendation</h1>
                    <p className="text-sm text-gray-500">
                        Here are the products that are recommended for you based on your face analysis result.
                    </p>
                </div>


                <div className="grid items-start justify-center grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full">
                    {analysis?.products?.map((product: ProductEntity, index: number) => (
                        <ProductCard key={product.name || index} product={product} />
                    ))}
                </div>

            </div>
        </div >
    )
}

const BuildHeadProduct = () => {
    return (
        <div className="flex flex-col items-start justify-center gap-4">
            <BuildBreadcrumb />
            <div className="flex flex-col items-start justify-center">
                <h1 className="text-2xl font-bold">Face Analysis Result</h1>
                <p className="text-sm text-gray-500">
                    Your face analysis result and personalized skincare routine is here.
                </p>
            </div>
        </div>
    )
}

const BuildBreadcrumb = () => {
    return (
        <Breadcrumb>
            <BreadcrumbList>
                <BreadcrumbItem>
                    <BreadcrumbLink href="/face-analyzer">Analyze</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                    <BreadcrumbLink href="/face-analyzer/products">Products</BreadcrumbLink>
                </BreadcrumbItem>
            </BreadcrumbList>
        </Breadcrumb>
    )
}

const BuildImage = ({ analysis, removeBackground }: { analysis: AnalysisEntity, removeBackground: string }) => {
    return (
        <div className="flex">
            <div className="relative md:w-[500px] md:h-[500px] w-[300px] h-[300px]">
                <div className="bg-[#E3F4F9]  rounded-full p-4 w-full h-full flex items-center justify-center">
                    <div className="bg-[#CFF0F5] rounded-full w-full h-full flex items-center justify-center border-[#E3F4F9] border-8">
                        <div className="w-full h-full rounded-full overflow-hidden">
                            <Image
                                // src={`data:image/jpeg;base64,${removeBackground}`}
                                src={removeBackground}
                                alt="Face Analysis Results"
                                width={600}
                                height={600}
                                className="w-full h-full object-cover hover:scale-105 transition-all duration-500 cursor-pointer"
                            />
                        </div>
                    </div>
                </div>
                <div className="absolute top-0 left-0 w-full h-full">
                    {
                        isBad(analysis) && (
                            <>
                                {analysis.diseases?.map((disease, index) => {
                                    let position = "";
                                    switch (index) {
                                        case 0:
                                            position = "top-[15%] left-[0%]";
                                            break;
                                        case 1:
                                            position = "top-[15%] right-[0%]";
                                            break;
                                        case 2:
                                            position = "bottom-[15%] left-[0%]";
                                            break;
                                        case 3:
                                            position = "bottom-[15%] right-[0%]";
                                            break;
                                        default:
                                            position = "";
                                    }
                                    if (disease?.name) {
                                        return (
                                            <div key={index} className={`absolute ${position}`}>
                                                <ConcernChip title={disease.name} value={disease.confidence_percent?.toString() || 'N/A'} />
                                            </div>
                                        );
                                    }
                                })}
                            </>
                        )
                    }

                    <div className="absolute top-[0&] left-[50%] transform -translate-x-1/2 -translate-y-1/2">
                        <ConcernChip title="Overall" value={capitalizeFirstLetter(analysis.skin_condition || 'N/A')} />
                    </div>
                </div>

            </div>
        </div>

    )
}


const BuildDataImage = ({ title, description }: { title: string, description: string }) => {
    return (
        <div className="flex flex-col items-center justify-center gap-1 w-full">
            <h1 className="text-xl font-bold">{title}</h1>
            <p className="text-md text-muted-foreground font-light">
                {description}
            </p>
        </div>
    )
}

export default ProductsScreen;
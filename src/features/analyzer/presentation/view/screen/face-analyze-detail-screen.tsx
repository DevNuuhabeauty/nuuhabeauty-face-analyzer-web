'use client'

import InfoScreen from "@/src/core/shared/presentation/components/info-screen";
import { useDeleteAnalysisMutation, useGetSingleAnalyze } from "../../tanstack/face-analyze-tanstack";
import LoadingScreen from "@/src/core/shared/presentation/view/loading-screen";
import Image from "next/image";
import toast from "react-hot-toast";
import ConcernChip from "../components/concern-chip";
import { capitalizeFirstLetter, getConfidenceColor, getSkinCondition } from "@/src/core/constant/helper";
import { ConcernEntity, GoodEntity, ProductEntity } from "../../../entities/product-entity";
import { ConcernBarChart } from "../components/concern-bar-chart";
import ProductCard from "../components/product-card";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button";
import { Loader2, SaveIcon, ShareIcon, Trash2Icon } from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { AnalysisEntity } from "../../../entities/analysis-entity";
import ProductDetailDialogCard from "../components/product-detail-dialog-card";
import { NuuhaMeter } from "../components/nuuha-meter";
import { title } from "process";
import { DefaultAlertDialog } from "@/src/core/shared/presentation/components/default-alert-dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import AnalyzeImageDialog from "../components/analyze-image-dialog";
import ConditionInfoDialog from "../components/condition-info-dialog";
import { useMediaQuery } from "react-responsive";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";
import AnalyzeDetailAnalysisScreen from "./analyze-detail-analysis-screen";
import AnalyzeDetailProductScreen from "./analyze-detail-product-screen";
import AnalyzeDetailConcernScreen from "./analyze-detail-concern-screen";
import AnalyzeDetailOverviewScreen from "./analyze-detail-overview-screen";
import CitationDisclaimerModal from "@/src/core/shared/presentation/components/citation-disclaimer-modal";
import CitationDisclaimerText from "@/src/core/shared/presentation/components/citation-disclaimer-text";


const isBad = (analysis: AnalysisEntity) => {
    if (analysis.skin_condition === 'moderate' || analysis.skin_condition === 'concerning') {
        return true;
    }
    return false;
}


const FaceAnalyzeDetailScreen = ({ analyzerId }: { analyzerId: string }) => {
    const queryClient = useQueryClient();
    const router = useRouter();
    const { data: session } = useSession();

    const [page, setPage] = useState('Analysis');
    const isMobile = useMediaQuery({ query: '(max-width: 768px)' });

    const [isCitationOpen, setIsCitationOpen] = useState(false);

    const { data, isLoading, error } = useGetSingleAnalyze(analyzerId);

    const { mutate: deleteAnalysis, isPending: isDeletePending } = useDeleteAnalysisMutation({
        shopifyId: session?.user?.shopify_id ?? ''
    });

    const [showCitationDisclaimer, setShowCitationDisclaimer] = useState(true);


    const handleDelete = () => {
        deleteAnalysis(analyzerId);
        router.push('/overview');
    }

    const handlePageChange = (page: string) => {
        setPage(page);

        if (isMobile && page === 'Products') {
            setTimeout(() => {
                const productsSection = document.querySelector('[data-value="Products"]');
                if (productsSection) {
                    productsSection.scrollIntoView({ behavior: 'smooth' });
                }
            }, 100);
        }
    }

    if (isLoading) {
        return (
            <LoadingScreen
                text="Loading..."
                subText="Please wait"
            />
        )
    }

    if (error || !data) {
        return (
            <InfoScreen
                title="Error"
                description={`Something went wrong: ${error instanceof Error ? error.message : 'Unknown error'}`}
                src="/images/communication.png"
            />
        )
    }

    const getAllConcerns = (): ConcernEntity[] => {
        return data.diseases ?? [];
    }



    return (

        <>
            <div className="flex flex-col items-start w-full gap-4 p-4" >

                {
                    process.env.SHOW_DISCLAMER === 'true' && (
                        <CitationDisclaimerModal
                            isOpen={showCitationDisclaimer}
                            onClose={() => setShowCitationDisclaimer(false)}
                        />
                    )
                }

                <Breadcrumb>
                    <BreadcrumbList>
                        <BreadcrumbItem>
                            <BreadcrumbLink href="/overview">Overview</BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbLink>Detail</BreadcrumbLink>
                        </BreadcrumbItem>

                    </BreadcrumbList>
                </Breadcrumb>

                <BuildHeadProduct
                    onDelete={handleDelete}
                    isPending={isDeletePending}
                    onHelp={() => {
                        setIsCitationOpen(true);
                    }}
                />


                <div className="flex flex-col xl:flex-row gap-8 w-full mt-6">
                    <AnalyzeDetailOverviewScreen
                        analysis={data}
                        diseases={getAllConcerns()}
                        onProductRecommendation={() => {
                            handlePageChange('Products');
                        }}
                    />

                    <Tabs
                        defaultValue={page}
                        className="flex-1"
                        value={page}
                        onValueChange={handlePageChange}
                    >
                        <TabsList className="w-full">
                            <TabsTrigger className="w-full" value="Analysis">Analysis</TabsTrigger>
                            <TabsTrigger className="w-full" value="Products">Products</TabsTrigger>
                            <TabsTrigger className="w-full" value="Concerns">Concerns</TabsTrigger>
                        </TabsList>
                        <TabsContent value="Analysis">
                            <div className="flex w-full mt-4">
                                <AnalyzeDetailAnalysisScreen
                                    products={data.products ?? []}
                                    onProductRecommendation={() => {
                                        handlePageChange('Products');
                                    }}
                                    diseases={getAllConcerns() ?? []}
                                    good={data.good ?? []} />
                            </div>
                        </TabsContent>
                        <TabsContent value="Products" data-value="Products">
                            <div className="flex w-full mt-4">
                                <AnalyzeDetailProductScreen products={data.products ?? []} />
                            </div>
                        </TabsContent>
                        <TabsContent value="Concerns" data-value="Concerns">
                            <div className="flex w-full mt-4">
                                <AnalyzeDetailConcernScreen concerns={getAllConcerns()} />
                            </div>
                        </TabsContent>
                    </Tabs>
                </div>
            </div>

            {/* <div className="w-full mt-auto">
                <CitationDisclaimerText onHelp={() => setIsCitationOpen(true)} />
            </div> */}
        </>



    )
}







const BuildHeadProduct = ({ onDelete, isPending, onHelp }: { onDelete: () => void, isPending: boolean, onHelp: () => void }) => {
    return (
        <div className="flex flex-col items-start justify-center gap-4 w-full">
            <div className="flex flex-row items-center justify-between w-full gap-4">
                <div className="flex flex-col items-start justify-center">
                    <h1 className="md:text-2xl text-xl font-bold">Face Analysis Result</h1>
                    <div className="md:text-sm text-xs text-gray-500">
                        Here is the result of your face analysis.
                    </div>
                </div>

                <div className="flex flex-row items-center justify-center gap-2">
                    <DefaultAlertDialog
                        title="  Are you sure want to delete?"
                        description="This action cannot be undone. This will permanently delete your account and remove your data from our servers."
                        onConfirm={onDelete}
                        onCancel={() => { }}
                        widget={
                            <Button disabled={isPending} size={"icon"} variant={"outline"}>
                                <Trash2Icon className="w-4 h-4" />
                            </Button>
                        }
                    />
                </div>
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
            <div className="relative md:w-[250px] md:h-[250px] w-[200px] h-[200px]">
                <div className="bg-[#E3F4F9] rounded-full p-4 w-full h-full flex items-center justify-center">
                    <div className="bg-[#CFF0F5] rounded-full w-full h-full flex items-center justify-center border-[#E3F4F9] border-8">
                        <div className="w-full h-full rounded-full overflow-hidden">
                            <Image
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
                    {isBad(analysis) && (
                        <>
                            {/* {analysis.diseases?.map((disease, index) => {
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
                                return null;
                            })} */}

                        </>
                    )}

                    <div className="absolute top-0 left-[50%] transform -translate-x-1/2 -translate-y-1/2">
                        <ConcernChip title="Overall" value={capitalizeFirstLetter(analysis.skin_condition || 'N/A')} />
                    </div>
                </div>
            </div>
        </div>
    )
}

const BuildDataImage = ({ title, description }: { title: string, description: string }) => {
    return (
        <div className="flex flex-col items-center justify-center gap-1 w-full text-center">
            <h1 className="md:text-xl text-sm font-bold">{title}</h1>
            <p className="md:text-sm text-xs text-muted-foreground font-light">
                {description}
            </p>
        </div>
    )
}

export default FaceAnalyzeDetailScreen;
"use client"

import InfoScreen from "@/src/core/shared/presentation/components/info-screen"
import Lottie, { useLottie } from "lottie-react"
import Image from "next/image"
import { removeBackground } from "@/src/features/analyzer/infrastrucuture/data_sources/remote/analyzer-api-service"
import { BASE_64 } from "@/src/core/constant"
import { Badge } from "@/components/ui/badge"
import ConcernChip from "@/src/features/analyzer/presentation/view/components/concern-chip"
import DataCard from "@/src/core/shared/presentation/components/data-card"
import { AlertTriangle, ArrowDownIcon, ArrowUpIcon, PlusIcon, ShieldX } from "lucide-react"
import { ChartLine } from "lucide-react"
import { ChartColumnDecreasing } from "lucide-react"
import { ShieldPlus } from "lucide-react"
import { OverviewLineChart } from "@/src/features/analyzer/presentation/view/components/overview-line-chart"
import AnalyzeCard from "@/src/features/analyzer/presentation/view/components/analyze-card"
import AnalyzeList from "@/src/features/analyzer/presentation/view/components/analyze-list"
import AnalyzeListDataCard from "@/src/features/analyzer/presentation/view/components/analyze-list-data-card"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { Skeleton } from "@/components/ui/skeleton"
import LoadingScreen from "@/src/core/shared/presentation/view/loading-screen"
import CredentialDialog from "@/src/features/auth/screen/view/components/credential-dialog"
import { AnalysisBarChart } from "@/src/features/analyzer/presentation/view/components/analysis-bar-chart"
import { AnalysisRadialChart } from "@/src/features/analyzer/presentation/view/components/analysis-radial-chart"
import DefaultHeader from "@/src/core/shared/presentation/components/default-header"
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import { useEffect, useState } from "react"
import { Switch } from "@/components/ui/switch"
import { useGetAllAnalyze } from "@/src/features/analyzer/presentation/tanstack/face-analyze-tanstack"
import { AnalysisEntity } from "@/src/features/analyzer/entities/analysis-entity"
import { Session } from "next-auth"
import { useMediaQuery } from "react-responsive"
import DefaultAccordian from "@/src/core/shared/presentation/components/default-accordian"
import DisclaimerModal from "@/src/core/shared/presentation/components/disclaimer-modal"
import AnalyzeListMobile from "@/src/features/analyzer/presentation/view/components/analyze-list-mobile"
import DisclaimerNavigateModal from "@/src/core/shared/presentation/components/disclaimer-navigate-modal"
import toast from "react-hot-toast"
import CitationDisclaimerModal from "@/src/core/shared/presentation/components/citation-disclaimer-modal"
import CitationDisclaimerText from "@/src/core/shared/presentation/components/citation-disclaimer-text"
import CitationCard from "@/src/core/shared/presentation/components/citation-card"
import GreetingText from "@/src/features/auth/screen/view/components/greeting_text"
import MedicalDisclaimerOverviewCard from "@/src/core/shared/presentation/components/medical-disclaimer-overview-card"
import ExploreCard from "@/src/core/shared/presentation/components/explore-card"


//January 2025 - Now 

const dates = Array.from({ length: 12 }, (_, index) => index + 1).map((month) => ({
    month,
    year: new Date().getFullYear()
}))


const OverviewPage = () => {

    const { data: session, status } = useSession();

    const { data, isLoading, error, refetch } = useGetAllAnalyze(session?.user?.shopify_id ?? '', 1, 10,);

    const isTabletOrMobile = useMediaQuery({ query: '(max-width: 1024px)' });

    const router = useRouter();

    const [uniqueDates, setUniqueDates] = useState<{ month: number, year: number }[]>([]);

    const [showMedicalCard, setShowMedicalCard] = useState(true);
    useEffect(() => {
        if (!data) return;

        // Get unique dates from analysis data
        const uniqueDatesSet = new Set(
            data.map(item => {
                const date = new Date(item.created_at ?? '');
                return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`; // Format as YYYY-MM
            })
        );

        // Convert to array of objects with month and year
        const uniqueDatesArray = Array.from(uniqueDatesSet).map(dateStr => {
            const [year, month] = dateStr.split('-').map(Number);
            return { month, year };
        });

        // Sort chronologically - newest first
        uniqueDatesArray.sort((a, b) => {
            const dateA = new Date(a.year, a.month - 1);
            const dateB = new Date(b.year, b.month - 1);
            return dateB.getTime() - dateA.getTime();
        });

        setUniqueDates(uniqueDatesArray);

    }, [data])


    const [showHighlights, setShowHighlights] = useState(true)

    const handleShowHighlights = () => {
        setShowHighlights(!showHighlights)
    }

    const [isOpen, setIsOpen] = useState(false);

    const [isCitationOpen, setIsCitationOpen] = useState(false);

    const handleOpen = () => {
        setIsOpen(true);
    }

    const handleClose = () => {
        setIsOpen(false);
    }

    const [showSafetyDisclaimer, setShowSafetyDisclaimer] = useState(true);
    const [showCitationDisclaimer, setShowCitationDisclaimer] = useState(false);

    const handleSafetyDisclaimerClose = () => {
        setShowSafetyDisclaimer(false);
        setShowCitationDisclaimer(true); // Show citation disclaimer after safety disclaimer is closed
    };

    const handleShowMedicalCard = () => {
        setShowMedicalCard(!showMedicalCard)
    }

    if (status === 'loading') {
        return <div></div>
    }

    if (!session?.user?.shopify_id) {
        return <div className="flex flex-col items-center justify-center w-full gap-6">
            <InfoScreen
                title="You are not logged in"
                description="Please connect your Shopify account to use this feature"
                src="/images/communication.png"
                widget={
                    <CredentialDialog widget={<Button variant="default">Login</Button>} />
                }
            />        </div>
    }



    return (
        <div className="flex flex-col items-center justify-center w-full gap-6 pb-4">

            <div className="flex flex-col items-start justify-center w-full gap-1">
                <GreetingText />

            </div>

            {
                process.env.SHOW_DISCLAMER === 'true' && (
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


            {
                process.env.SHOW_DISCLAMER === 'true' && (
                    <MedicalDisclaimerOverviewCard
                        showMedicalCard={showMedicalCard}
                        handleShowMedicalCard={handleShowMedicalCard}
                    />
                )
            }

            {
                isTabletOrMobile ? (
                    <>

                        <div className="flex flex-col items-start justify-start w-full gap-2">

                            <div className="w-full overflow-x-auto no-scrollbar h-full">
                                <div className="flex flex-row items-center justify-between gap-2 min-w-max">
                                    <ExploreCard
                                        color="bg-purple-50"
                                        title="Analyze"
                                        description="Scan faces for personalized insights"
                                        image="/face-scan.png"
                                        onClick={() => {
                                            router.push('/face-analyzer')
                                        }}
                                    />

                                    <ExploreCard
                                        color="bg-red-50"
                                        title="Check"
                                        description="Show recommended products"
                                        image="/skincare.png"
                                        onClick={() => {
                                            router.push('/product-ingredients')
                                        }}
                                    />

                                    <ExploreCard
                                        color="bg-yellow-50"
                                        title="Shops"
                                        description="Explore trending items"
                                        image="/retailer.png"
                                        onClick={() => {
                                            window.open('https://nuuhabeauty.com/collections/all-products', '_blank');
                                        }}
                                    />
                                    {/* 
                                    <DisclaimerNavigateModal
                                        isOpen={isOpen}
                                        onClose={handleClose}
                                        onConfirm={() => {
                                            window.open('https://nuuhabeauty.com/collections/all-products', '_blank');
                                        }}
                                    >
                                        <ExploreCard
                                            color="bg-yellow-50"
                                            title="Shops"
                                            description="Explore trending items"
                                            image="/retailer.png"
                                            onClick={() => {
                                                handleOpen();
                                            }}
                                        />
                                    </DisclaimerNavigateModal> */}

                                    <ExploreCard
                                        color="bg-blue-50"
                                        title="Profile"
                                        description="Manage your account preferences"
                                        image="/images/user.png"
                                        onClick={() => {
                                            window.open('https://nuuhabeauty.com/account', '_blank');
                                        }}
                                    />

                                    {/* <DisclaimerNavigateModal
                                        isOpen={isOpen}
                                        onClose={handleClose}
                                        onConfirm={() => {
                                            window.open('https://nuuhabeauty.com/account', '_blank');
                                        }}
                                    >
                                        <ExploreCard
                                            color="bg-blue-50"
                                            title="Profile"
                                            description="Manage your account preferences"
                                            image="/images/user.png"
                                            onClick={() => {
                                                handleOpen();
                                            }}
                                        />
                                    </DisclaimerNavigateModal> */}
                                </div>
                            </div>


                            <AnalyzeListDataCard />

                            {
                                process.env.SHOW_DISCLAMER === 'true' && (
                                    <MedicalDisclaimerOverviewCard
                                        showMedicalCard={showMedicalCard}
                                        handleShowMedicalCard={handleShowMedicalCard}
                                    />
                                )
                            }
                            <div className="flex flex-col items-start justify-start w-full mt-4">
                                <p className="text-xl font-bold mb-4">
                                    Analyzes
                                </p>


                                <AnalyzeListMobile
                                    data={data ?? []}
                                    uniqueDates={uniqueDates}
                                    isLoading={isLoading}
                                />


                            </div>


                        </div>

                    </>
                ) : (
                    <WebView
                        showHighlights={showHighlights}
                        handleShowHighlights={handleShowHighlights}
                        uniqueDates={uniqueDates}
                        data={data ?? []}
                        isLoading={isLoading}
                        session={session}
                    />
                )
            }

            {/* <CitationDisclaimerText onHelp={() => setIsCitationOpen(true)} /> */}


        </div>
    )
}

const FeatureCard = ({
    title,
    description,
    icon,
    onClick,
    subtitle
}: {
    title: string;
    description: string;
    icon: React.ReactNode;
    onClick: () => void;
    subtitle?: string;
}) => {
    return (
        <div
            onClick={onClick}
            className="flex flex-col items-center justify-center">
            <div className="p-3 bg-primary/10 rounded-full mb-2">
                {icon}
            </div>
            <p className="text-xs font-medium text-center mx-auto">{title}</p>
            <p className="text-xs font-medium text-center mx-auto">{subtitle}</p>
        </div>
    )
}



const WebView = ({
    showHighlights,
    handleShowHighlights,
    uniqueDates,
    data,
    isLoading,
    session
}: {
    showHighlights: boolean;
    handleShowHighlights: () => void;
    uniqueDates: { month: number, year: number }[];
    data: AnalysisEntity[];
    isLoading: boolean;
    session: Session;
}) => {
    return (
        <>



            <div className="flex flex-row items-center justify-between w-full gap-2">
                <DefaultHeader
                    title="Analyzes Overview"
                    description="Your analyzes are listed here. You can view the details of each analyze by clicking on the analyze."
                />
                <div className="flex flex-row items-center justify-center gap-2">
                    <p className="text-sm font-medium text-muted-foreground">
                        Highlights
                    </p>

                    <Switch
                        checked={showHighlights}
                        onCheckedChange={handleShowHighlights} />
                </div>
            </div>




            {
                session?.user?.shopify_id && <>

                    {
                        showHighlights && (
                            <AnalyzeListDataCard />
                        )
                    }

                    {
                        process.env.SHOW_DISCLAIMER === 'true' && (
                            <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3  text-sm w-full">
                                <p className="text-gray-700 flex items-center">
                                    <AlertTriangle className="text-yellow-500 w-4 h-4 mr-2" />
                                    <span className="font-medium">Important: </span>
                                    <span className="ml-1">The skin conditions identified by our analyzer require medical validation. Always consult with a dermatologist before starting any treatment based on these results.</span>
                                </p>
                            </div>


                        )
                    }
                    {
                        isLoading && (
                            <div className="flex flex-col gap-4 w-full">
                                {
                                    Array.from({ length: 10 }).map((_, index) => (
                                        <Skeleton key={`skeleton-${index}`} className="w-full h-[50px] rounded-lg" />
                                    ))
                                }
                            </div>
                        )
                    }





                    {
                        uniqueDates.map((date, index) => {

                            let analyzeList: AnalysisEntity[] = [];

                            if (!data) return [];

                            analyzeList = data?.filter((item) => {
                                const itemDate = new Date(item.created_at ?? '');
                                return itemDate >= new Date(date.year, date.month - 1, 1) && itemDate <= new Date(date.year, date.month - 1, 31);
                            });

                            return (
                                <DefaultAccordian
                                    key={`${date.month}-${date.year}`}
                                    title={new Date(date.year, date.month - 1, 1).toLocaleString('default', { month: 'long', year: 'numeric' })}
                                    children={<AnalyzeList
                                        isLoading={isLoading}
                                        data={analyzeList ?? []} />}
                                />
                            )
                        })
                    }

                </>
            }

        </>
    )
}

const AnalyzeListCard = ({
    data,
    uniqueDates,
    isLoading
}: {
    data: AnalysisEntity[];
    uniqueDates: { month: number, year: number }[];
    isLoading: boolean;
}) => {
    return (
        <>
            {
                isLoading ? (
                    <div className="flex flex-col gap-4 w-full">
                        {
                            Array.from({ length: 10 }).map((item, index) => (
                                <Skeleton key={index} className="w-full h-[50px] rounded-lg" />
                            ))
                        }
                    </div>
                ) : (
                    <div className="flex flex-col gap-4 w-full">
                        {uniqueDates.map((date, index) => {
                            let analyzeList: AnalysisEntity[] = [];

                            if (!data) return null;

                            analyzeList = data.filter((item) => {
                                const itemDate = new Date(item.created_at ?? '');
                                return itemDate >= new Date(date.year, date.month - 1, 1) && itemDate <= new Date(date.year, date.month - 1, 31);
                            });

                            return (
                                <DefaultAccordian
                                    key={`${date.month}-${date.year}`}
                                    title={new Date(date.year, date.month - 1, 1).toLocaleString('default', { month: 'long', year: 'numeric' })}
                                    children={<AnalyzeList
                                        isLoading={isLoading}
                                        data={analyzeList ?? []} />}
                                />
                            );
                        })}
                    </div>
                )
            }
        </>
    );
}







export default OverviewPage



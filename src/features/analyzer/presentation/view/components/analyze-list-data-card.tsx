"use client"


import DataCard from "@/src/core/shared/presentation/components/data-card"
import { useSession } from "next-auth/react"
import { useGetAnalysisSummary } from "../../tanstack/face-analyze-tanstack";
import { AnalysisEntity } from "../../../entities/analysis-entity";
import { AlertCircle, ArrowUpIcon, ChartPie, HeartPulse, ShieldX, TrendingUp } from "lucide-react";
import { capitalizeFirstLetterOfEachWord, getSkinCondition } from "@/src/core/constant/helper";
import { Skeleton } from "@/components/ui/skeleton";
import { useMediaQuery } from "react-responsive";

const AnalyzeListDataCard = () => {

    const { data: session, status } = useSession();

    const { data, isLoading, error } = useGetAnalysisSummary(session?.user?.shopify_id ?? '');

    const listData = [
        { title: "Total Analyze", data: data?.total_analysis ?? 0, desc: "Analyze found in your skin", icon: <HeartPulse className="w-5 h-5 text-red-500" /> },
        { title: "Total Concerns", data: data?.total_diseases ?? 0, desc: "Concerns found in your skin", icon: <ShieldX className="w-5 h-5 text-orange-500" /> },
        { title: "Recent Concern", data: data?.recent_disease ?? 'No Concern', desc: "Recent concern found in your skin", icon: <AlertCircle className="w-5 h-5 text-yellow-500" /> },
        { title: "Skin Score", data: `${data?.skin_condition ?? 0}%`, desc: "Overall skin condition found in your skin", icon: <TrendingUp className="w-5 h-5 text-orange-500" /> },

    ]

    const isMobile = useMediaQuery({ query: '(max-width: 768px)' });

    if (isMobile) {
        return (

            <div className="grid grid-cols-2 gap-4 w-full mt-6">


                {
                    listData.map((item, index) => (
                        // <DataMobileCard
                        //     key={index}
                        //     title={item.title}
                        //     value={item.data?.toString() ?? '-'}
                        //     subtitle={item.desc}
                        // />
                        <DataCard
                            key={index}
                            title={capitalizeFirstLetterOfEachWord(item.title)}
                            data={capitalizeFirstLetterOfEachWord(item.data?.toString() ?? '-')}
                            desc={item.desc}
                            icon={item.icon}
                        />
                    ))
                }

            </div>

        )
    }


    return (
        <div className="grid items-start grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 w-full">

            {
                isLoading ? (
                    Array.from({ length: 4 }).map((_, index) => (
                        <Skeleton key={index} className="h-[150px] w-full rounded-lg" />
                    ))
                ) : (
                    <>
                        {
                            listData.map((item, index) => (
                                <DataCard
                                    key={index}
                                    title={capitalizeFirstLetterOfEachWord(item.title)}
                                    data={capitalizeFirstLetterOfEachWord(item.data?.toString() ?? '-')}
                                    desc={item.desc}
                                    icon={item.icon}
                                />
                            ))
                        }</>
                )
            }
        </div>
    )
}

const DataMobileCard = ({
    title,
    value,
    subtitle

}: {
    title: string;
    value: string;
    subtitle: string;
}) => {
    return (
        <div className="p-1 rounded-lg border">
            <div className="flex flex-col items-start justify-start p-4 bg-white/5 rounded-lg">
                <p className="text-sm text-muted-foreground">{title}</p>
                <p className="text-xl font-bold mt-2">{value}</p>
                {/* <div className="flex items-center gap-1 text-xs text-green-500">
                    <ArrowUpIcon className="w-3 h-3" />
                    <span>{subtitle}</span>
                </div> */}
                <p className="text-xs text-muted-foreground">{subtitle}</p>
            </div>
        </div>
    )
}

export default AnalyzeListDataCard
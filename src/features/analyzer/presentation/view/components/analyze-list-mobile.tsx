import { AnalysisEntity } from "../../../entities/analysis-entity";
import { Skeleton } from "@/components/ui/skeleton";
import AnalyzeList from "./analyze-list";
import DefaultAccordian from "@/src/core/shared/presentation/components/default-accordian";
import { getHighConcerns, getLowConcerns, getSkinCondition } from "@/src/core/constant/helper";
import StatusChip from "@/src/core/shared/presentation/components/status-chip";
import Link from "next/link";
import DefaultList from "@/src/core/shared/presentation/components/default-list";

export interface AnalyzeListMobileProps {
    data: AnalysisEntity[];
    uniqueDates: { month: number, year: number }[];
    isLoading: boolean;
}

const AnalyzeListMobile = ({
    data,
    uniqueDates,
    isLoading
}: AnalyzeListMobileProps) => {
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
                                    children={

                                        <DefaultList
                                            data={analyzeList}
                                            content={
                                                (item) => (
                                                    <Link href={`/face-analyzer/${item.analyzeId}`} key={item.analyzeId}>
                                                        <AnalyzeMobileCard data={item} />
                                                    </Link>
                                                )
                                            }
                                        />

                                    }
                                />
                            );
                        })}
                    </div>
                )
            }
        </>
    )
}


const AnalyzeMobileCard = ({
    data
}: {
    data: AnalysisEntity;
}) => {
    return (
        <div className="border p-4 rounded-lg w-full transition-all duration-200 active:scale-95 hover:border-gray-400 hover:shadow-md">
            <div className="flex flex-col gap-4 w-full">

                <div className="flex flex-row items-center justify-between w-full">
                    <img src={data.userImage ?? 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTYrUXXRrsJEkNABDN4RiOfiY59_mnqwmASZQ&s'}
                        alt={'N/A'}
                        className="rounded-full w-8 h-8 object-cover" />

                    <div className="flex-1 text-right">
                        <p className="text-sm font-light text-gray-600 ">
                            {new Date(data.created_at ?? '').toLocaleString('default', { month: 'long', day: 'numeric', year: 'numeric', hour: 'numeric', minute: 'numeric' })}
                        </p>
                    </div>
                </div>

                <div className="flex flex-row items-center justify-between gap-2">
                    <div className="flex flex-col items-start gap-1 flex-1">
                        <p className="text-sm font-bold">
                            High Concern
                        </p>
                        <p className="text-sm font-light text-gray-600">
                            {getHighConcerns(data.diseases ?? [])}
                        </p>

                    </div>

                    <div className="flex flex-col items-end gap-1 flex-1 text-right">
                        <p className="text-sm font-bold">
                            Low Concern
                        </p>
                        <p className="text-sm font-light text-gray-600">
                            {getLowConcerns(data.diseases ?? [])}
                        </p>
                    </div>
                </div>


                <div className="flex flex-row items-center justify-between">
                    <div className="flex flex-col items-start gap-1">
                        <p className="text-sm font-bold">
                            Skin Condition
                        </p>
                        <StatusChip
                            title={getSkinCondition(data).title ?? '-'}
                            value={getSkinCondition(data).title ?? 'green'}
                            color={getSkinCondition(data).color ?? 'green'}
                        />
                    </div>

                    <div className="flex flex-col items-end gap-1">
                        <p className="text-sm font-bold">
                            Skin Score
                        </p>
                        <NuhaSlider value={getSkinCondition(data).value ?? 0} />
                    </div>
                </div>

            </div>
        </div>
    )
}


const NuhaSlider = ({ value }: { value: number }) => {
    const getColor = (value: number) => {
        if (value >= 100) return 'green';
        if (value >= 60) return '#FFBF00';
        if (value >= 25) return '#ef4444';
        return '#22c55e';
    }

    const color = getColor(value);

    return (
        <div className={`w-16 h-4 bg-white dark:bg-gray-200 dark:border-black border-gray-900 border-2 rounded-full overflow-visible flex items-center relative`}>
            <div
                className="h-full rounded-full"
                style={{
                    backgroundColor: color,
                    width: `${value}%`,
                    transition: 'width 0.3s ease-in-out'
                }}
            />
            <div
                className="absolute  w-4 h-4 rounded-full transform -translate-x-1/2 border-2 border-gray-900"
                style={{
                    backgroundColor: color,
                    left: `${value}%`,
                    transition: 'left 0.3s ease-in-out'
                }}
            />
        </div>
    );
}


export default AnalyzeListMobile;
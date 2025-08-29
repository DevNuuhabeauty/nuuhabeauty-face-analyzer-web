"use client"

import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import InfoScreen from "@/src/core/shared/presentation/components/info-screen";
import StatusChip from "@/src/core/shared/presentation/components/status-chip";
import { useRouter } from "next/navigation";
import { useMediaQuery } from "react-responsive";
import { ConcernEntity, ProductEntity } from "../../../entities/product-entity";
import { useDeleteAllAnalyzeMutation, useDeleteAnalysisMutation, useGetAllAnalyze, useGetAllAnalyzePaginationMutation } from "../../tanstack/face-analyze-tanstack";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { useEffect, useMemo, useState } from "react";
import { AnalysisEntity } from "../../../entities/analysis-entity";
import { toast } from "react-hot-toast";
import { ChevronLeftIcon, ChevronRightIcon, DeleteIcon, EyeIcon, FilterIcon, Loader2Icon, MoreHorizontalIcon, Trash2Icon } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuPortal,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { FilteringAnalyzeListDialog } from "./filtering-analyze-list-dialog";
import { NuuhaMeter } from "./nuuha-meter";
import { formatDateDayTime, getSkinCondition } from "@/src/core/constant/helper";
import { Checkbox } from "@/components/ui/checkbox";
import { DefaultAlertDialog } from "@/src/core/shared/presentation/components/default-alert-dialog";
import { Riple } from "react-loading-indicators";
import CredentialDialog from "@/src/features/auth/screen/view/components/credential-dialog";

const AnalyzeList = ({ data, isLoading }: { data: AnalysisEntity[], isLoading: boolean }) => {
    const router = useRouter();
    const { data: session, status } = useSession();

    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [showLimit, setShowLimit] = useState(10);

    const { mutate: getAllAnalyzePagination, isPending: getAllAnalyzePaginationPending } = useGetAllAnalyzePaginationMutation();
    const { mutate: deleteAllAnalyze, isPending: deleteAllAnalyzePending } = useDeleteAllAnalyzeMutation({ shopifyId: session?.user?.shopify_id ?? '' });

    const isMobile = useMediaQuery({ query: '(max-width: 768px)' });

    const { mutate: deleteAnalysis, isPending: deleteAnalysisPending } = useDeleteAnalysisMutation({ shopifyId: session?.user?.shopify_id ?? '' });

    const [filteredData, setFilteredData] = useState<AnalysisEntity[]>([]);
    const [isFiltering, setIsFiltering] = useState(false);

    const [checkList, setCheckList] = useState<string[]>([]);

    const displayData = useMemo(() => {
        const dataToUse = isFiltering ? filteredData : data;
        return dataToUse?.slice(0, showLimit) ?? [];
    }, [data, filteredData, isFiltering, showLimit]);

    const handleShowMore = () => {
        setShowLimit(prev => prev + 10);
    };

    const getHighConcerns = (diseases: ConcernEntity[]) => {
        if (!diseases || diseases.length === 0) return null;

        let maxConfidence = -Infinity;
        let highestConcern = null;

        for (const disease of diseases) {
            if (disease.confidence_percent && disease.confidence_percent > maxConfidence) {
                maxConfidence = disease.confidence_percent;
                highestConcern = disease.name;
            }
        }

        return highestConcern ?? '-';
    };

    const getLowConcerns = (diseases: ConcernEntity[]) => {
        if (!diseases || diseases.length === 0) return null;

        let minConfidence = Infinity;
        let lowestConcern = null;

        for (const disease of diseases) {
            console.log('Concern', disease)
            if (disease.confidence_percent && disease.confidence_percent < minConfidence) {
                minConfidence = disease.confidence_percent;
                lowestConcern = disease.name;
            }
        }
        return lowestConcern ?? '-';
    };

    const handleCheck = (analyzeId: string) => {
        setCheckList((prev) => [...prev, analyzeId]);
    }

    const handleUncheck = (analyzeId: string) => {
        setCheckList((prev) => prev.filter((item) => item !== analyzeId));
    }

    const handleAllCheck = () => {
        setCheckList((prev) => data?.map((item) => item.analyzeId ?? '') ?? []);
    }

    const handleAllUncheck = () => {
        setCheckList([]);
    }

    const handleDeleteAll = () => {
        const analyzes = data?.filter((item) => checkList.includes(item.analyzeId ?? ''));
        deleteAllAnalyze(analyzes ?? []);
        setCheckList([]);
    }

    const handlePrevious = () => {
        if (page > 1) {
            setPage((prev) => prev - 1);
            getAllAnalyzePagination({
                page: page - 1,
                limit: pageSize
            });
        } else {
            toast.error('No more data');
        }
    }

    const handleNext = () => {
        if (data && data.length >= pageSize) {
            setPage((prev) => prev + 1);
            getAllAnalyzePagination({
                page: page + 1,
                limit: pageSize
            });
        } else {
            toast.error('No more data');
        }
    }

    if (!session) {
        return (
            <InfoScreen
                title="Oops"
                description={`Please login to continue`}
                src="/images/communication.png"
                widget={
                    <CredentialDialog widget={<Button variant="default">Login</Button>} />
                }
            />
        )
    }

    if (getAllAnalyzePaginationPending) {
        return (
            <div className="flex flex-col gap-4 w-full">
                {
                    Array.from({ length: 10 }).map((item, index) => (
                        <Skeleton key={index} className="w-full h-[50px] rounded-lg" />
                    ))
                }
            </div>
        )
    }

    if (isLoading) {
        return (
            <div className="flex flex-col gap-4 w-full">
                {
                    Array.from({ length: 10 }).map((item, index) => (
                        <Skeleton key={index} className="w-full h-[50px] rounded-lg" />
                    ))
                }
            </div>
        )
    }

    if (data?.length === 0) {
        return (
            <div className="flex flex-col gap-4 w-full">
                <p className="text-sm text-gray-500">
                    No data found
                </p>
            </div>
        )
    }

    const TableRowComponent = ({ item, index }: { item: AnalysisEntity, index: number }) => {
        return (
            <tr

                key={index}
                className={`${!session ? 'pointer-events-none' : ''} border-b hover:bg-gray-50`}

            >
                <TableCell className="w-[40px] px-2"

                >
                    <Checkbox
                        checked={checkList.includes(item.analyzeId ?? '')}
                        onCheckedChange={() => {
                            if (checkList.includes(item.analyzeId ?? '')) {
                                handleUncheck(item.analyzeId ?? '');
                            } else {
                                handleCheck(item.analyzeId ?? '');
                            }
                        }}
                    />
                </TableCell>
                <TableCell className="w-[60px]">
                    <img
                        src={item.userImage ?? 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTYrUXXRrsJEkNABDN4RiOfiY59_mnqwmASZQ&s'}
                        alt={'N/A'}
                        className="rounded-full w-8 h-8 object-cover"
                    />
                </TableCell>
                <TableCell className="text-sm text-gray-600">
                    {getHighConcerns(item.diseases ?? []) ?? '-'}
                </TableCell>
                {!isMobile && (
                    <TableCell className="text-sm text-gray-600">
                        {getLowConcerns(item.diseases ?? [])}
                    </TableCell>
                )}
                {!isMobile && (
                    <TableCell className="text-sm text-gray-600 whitespace-nowrap">
                        {item.created_at ? formatDateDayTime(item.created_at) : '-'}
                    </TableCell>
                )}
                {!isMobile && (
                    <TableCell>
                        <StatusChip
                            title={getSkinCondition(item).title ?? '-'}
                            value={getSkinCondition(item).title ?? 'green'}
                            color={getSkinCondition(item).color ?? 'green'}
                        />
                    </TableCell>
                )}
                <TableCell className="flex items-center justify-center">
                    <NuuhaMeter value={getSkinCondition(item).value ?? 0} />
                </TableCell>
                <TableCell className="w-[40px]">
                    <MoreButton
                        onDelete={() => {
                            toast.success('Analyze deleted');

                            deleteAnalysis(item.analyzeId ?? '');
                        }}
                        onView={() => {
                            router.push(`/face-analyzer/${item.analyzeId}`)
                        }}
                    />
                </TableCell>
            </tr >
        )
    }

    return (
        <div className="w-full relative">
            {checkList.length > 0 && (
                <DefaultAlertDialog
                    title="Delete Analyze"
                    description="Are you sure you want to delete this analyze?"
                    onConfirm={handleDeleteAll}
                    onCancel={() => { }}
                    isLoading={deleteAnalysisPending}
                    widget={
                        <div className="flex items-center justify-end mb-4">
                            <Button variant="destructive">
                                <Trash2Icon className="w-4 h-4 mr-2" />
                                Delete
                            </Button>
                        </div>
                    }
                />
            )}

            {deleteAllAnalyzePending && (
                <div className="absolute inset-0 flex justify-center mt-10">
                    <Riple color="orange" size="large" />
                </div>
            )}

            <div className="flex flex-col gap-4 items-start w-full">
                <Table className={`${deleteAllAnalyzePending ? 'blur-sm' : ''} border`}>
                    <TableHeader >
                        <tr className="bg-gray-50">
                            <TableHead className="w-[40px] px-2 py-4">
                                <Checkbox
                                    checked={checkList.length === data?.length}
                                    onCheckedChange={() => {
                                        if (checkList.length === data?.length) {
                                            handleAllUncheck();
                                        } else {
                                            handleAllCheck();
                                        }
                                    }}
                                />
                            </TableHead>
                            <TableHead className="w-[60px]">User</TableHead>
                            <TableHead>High Concerns</TableHead>
                            {!isMobile && <TableHead>Low Concerns</TableHead>}
                            {!isMobile && <TableHead>Date</TableHead>}
                            {!isMobile && <TableHead>Skin Condition</TableHead>}
                            <TableHead>Score</TableHead>
                            <TableHead className="w-[40px]">
                                <FilteringAnalyzeListDialog
                                    isFiltering={isFiltering}
                                    setIsFiltering={setIsFiltering}
                                    analysis={data ?? []}
                                    setFilteredData={setFilteredData}
                                />
                            </TableHead>
                        </tr>
                    </TableHeader>

                    <TableBody

                        className={`${!session ? 'opacity-30 select-none filter grayscale' : ''}`}>
                        {displayData.map((item, index) => (
                            <TableRowComponent

                                key={index} item={item} index={index} />
                        ))}

                        {displayData.length === 0 && (
                            <tr>
                                <TableCell colSpan={8} className="text-center py-4 text-gray-500">
                                    No data found
                                </TableCell>
                            </tr>
                        )}
                    </TableBody>
                </Table>

                {showLimit < (isFiltering ? filteredData : data)?.length && (
                    <div className="flex justify-center w-full mt-4">
                        <Button onClick={handleShowMore} variant="outline">
                            Show More
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
}

const MoreButton = ({ onDelete, onView }: { onDelete: () => void, onView: () => void }) => {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <MoreHorizontalIcon className="w-4 h-4 cursor-pointer" />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuItem onClick={onView}>
                    <EyeIcon className="w-4 h-4 cursor-pointer" />
                    <p className="text-sm font-medium">View</p>
                </DropdownMenuItem>

                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                    <DefaultAlertDialog
                        title="Delete Analyze"
                        description="Are you sure you want to delete this analyze?"
                        onConfirm={onDelete}
                        onCancel={() => { }}
                        widget={
                            <div className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-md">
                                <Trash2Icon className="w-4 h-4 cursor-pointer text-red-500" />
                                <p className="text-sm font-medium text-red-500">Delete</p>
                            </div>
                        }
                    />
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

export default AnalyzeList;
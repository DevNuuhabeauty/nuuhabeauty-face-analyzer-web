import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { DialogDescription } from "@radix-ui/react-dialog";
import { CalendarIcon, FilterIcon } from "lucide-react";
import { useState } from "react";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils";
import { AnalysisEntity } from "../../../entities/analysis-entity";
import { formatDateDay } from "@/src/core/constant/helper";
import { DateRange } from "react-day-picker";

import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import toast from "react-hot-toast";



const skinConditions = ["Excellent", "Moderate", "Concerning"];


const diseases = ["Acne", "Pores", "Eczema", "Uneven skin tone", "Blemishes", "Dullness", "Sun spots", "Other"];

export const FilteringAnalyzeListDialog = ({
    analysis,
    setFilteredData,
    setIsFiltering,
    isFiltering
}: {
    analysis: AnalysisEntity[];
    setIsFiltering: (isFiltering: boolean) => void;
    setFilteredData: (data: AnalysisEntity[]) => void;
    isFiltering: boolean;
}) => {

    const [date, setDate] = useState<DateRange | undefined>(undefined);
    const [selectedSkinConditions, setSelectedSkinConditions] = useState<string | undefined>(undefined);
    const [selectedConcerns, setSelectedConcerns] = useState<string | undefined>(undefined);
    const [isOpen, setIsOpen] = useState(false);

    const [isCalendarOpen, setIsCalendarOpen] = useState(false);  // Add this state


    const filteringData = () => {
        let filtered = [...analysis];

        if (selectedSkinConditions) {
            filtered = filtered.filter((item) =>
                item.skin_condition === selectedSkinConditions.toLowerCase()
            );
        }

        if (date) {
            filtered = filtered.filter((item) => {
                const itemDate = new Date(item.created_at ?? '');
                return itemDate >= (date.from ?? new Date()) && itemDate <= (date.to ?? new Date());
            });
        }

        if (selectedConcerns) {
            filtered = filtered.filter((item) =>
                item.diseases?.some((disease) => disease.name === selectedConcerns)
            );
        }

        return filtered;
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <FilterIcon className="w-4 h-4 text-gray-500" />
            </DialogTrigger>
            <DialogContent className="w-full max-w-[90%] md:max-w-[80%] lg:max-w-[70%] xl:max-w-[60%] px-4 md:px-6">
                <DialogHeader>
                    <DialogTitle>Filter</DialogTitle>
                </DialogHeader>

                <div className="flex flex-col items-start justify-center gap-6 w-full">


                    <div className="flex flex-col items-start justify-center gap-2 w-full">
                        <div className="flex flex-row items-center justify-between w-full">
                            <p className="text-sm font-bold">
                                Date
                            </p>
                            <p className="text-xs text-gray-500 cursor-pointer" onClick={() => setDate(undefined)}>
                                Clear
                            </p>
                        </div>

                        <Button
                            variant="outline"
                            onClick={() => setIsCalendarOpen(true)}
                            className={cn(
                                "w-full pl-3 text-left font-normal",
                                !date && "text-muted-foreground"
                            )}
                        >
                            {date ? formatDateDay(date.from ?? new Date()) + ' - ' + formatDateDay(date.to ?? new Date()) : <span>Pick a date</span>}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>


                        {
                            isCalendarOpen && (
                                <Calendar
                                    className="w-full"
                                    mode="range"
                                    initialFocus
                                    selected={date}
                                    onSelect={(value) => {
                                        setDate(value);
                                        setIsCalendarOpen(false);
                                    }}
                                    disabled={(date) =>
                                        date > new Date() || date < new Date("1900-01-01")
                                    }
                                />
                            )
                        }



                        <p className="text-xs text-gray-500">
                            Please select a date to filter the analyzes.
                        </p>

                    </div>

                    {/* <Form
                        title="Date"
                        description="Please select a date to filter the analyzes."
                        onClear={() => setDate(undefined)}
                        children={
                            <Popover >
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="outline"
                                        className={cn(
                                            "w-full pl-3 text-left font-normal",
                                            !date && "text-muted-foreground"
                                        )}
                                    >
                                        {date ? formatDateDay(date.from ?? new Date()) + ' - ' + formatDateDay(date.to ?? new Date()) : <span>Pick a date</span>}
                                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                    </Button>
                                </PopoverTrigger>

                                <PopoverContent className="w-full">
                                    <Calendar
                                        className="w-full"
                                        mode="range"
                                        numberOfMonths={1}
                                        selected={date}
                                        onSelect={(value) => setDate(value)}
                                        disabled={(date) =>
                                            date > new Date() || date < new Date("1900-01-01")
                                        }
                                    />
                                </PopoverContent>
                            </Popover>
                        }
                    /> */}

                    <Form
                        title="Concerns"
                        description="Please select a disease to filter the analyzes."
                        onClear={() => setSelectedConcerns(undefined)}
                        children={
                            <Select
                                onValueChange={(value) => setSelectedConcerns(value)}
                                defaultValue={selectedConcerns}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a disease" />
                                </SelectTrigger>
                                <SelectContent>
                                    {
                                        diseases.map((disease) => (
                                            <SelectItem key={disease} value={disease}>{disease}</SelectItem>
                                        ))
                                    }
                                </SelectContent>
                            </Select>
                        }
                    />

                    <Form
                        title="Skin Condition"
                        description="Please select a skin condition to filter the analyzes."
                        onClear={() => setSelectedSkinConditions(undefined)}
                        children={
                            <div className="flex flex-wrap items-start justify-start gap-2">
                                {
                                    skinConditions.map((condition) => (
                                        <Badge
                                            onClick={() => setSelectedSkinConditions(condition)}
                                            key={condition}
                                            variant={selectedSkinConditions === condition ? "default" : "outline"}
                                            className="rounded-full px-4">
                                            {condition}
                                        </Badge>
                                    ))
                                }
                            </div>
                        }
                    />
                </div>

                <DialogFooter className="flex flex-col md:flex-row items-center justify-center gap-2">
                    <DialogClose asChild onClick={() => {
                        setIsFiltering(false);
                        setIsOpen(false);
                        setDate(undefined);
                        setSelectedConcerns(undefined);
                        setSelectedSkinConditions(undefined);
                        setFilteredData([]);
                    }}>
                        <Button
                            className="md:w-fit w-full"
                            variant="outline">
                            Reset
                        </Button>
                    </DialogClose>

                    <Button
                        className="md:w-fit w-full"
                        onClick={() => {
                            setIsFiltering(true);
                            setIsOpen(false);
                            const filteredResults = filteringData();
                            setFilteredData(filteredResults);
                        }}>
                        Apply
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}


const Form = ({
    title,
    description,
    children,
    onClear
}: {
    title: string;
    description: string;
    children: React.ReactNode;
    onClear: () => void;
}) => {
    return (

        <div className="flex flex-col items-start justify-center gap-2 w-full">
            <div className="flex flex-row items-center justify-between w-full">
                <p className="text-sm font-bold">
                    {title}
                </p>
                <p className="text-xs text-gray-500 cursor-pointer" onClick={onClear}>
                    Clear
                </p>
            </div>

            {children}
            <p className="text-xs text-gray-500">
                {description}
            </p>

        </div>
    )
}
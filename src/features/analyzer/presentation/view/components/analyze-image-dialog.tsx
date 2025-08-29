"use client"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { capitalizeFirstLetter, isBad } from "@/src/core/constant/helper";
import Image from "next/image";
import { useState } from "react";
import ConcernChip from "./concern-chip";
import { AnalysisEntity } from "../../../entities/analysis-entity";

const AnalyzeImageDialog = ({ analysis, removeBackground }: { analysis: AnalysisEntity, removeBackground: string }) => {

    const [open, setOpen] = useState(false);

    const handleOpen = () => {
        setOpen(true);
    }

    const handleClose = () => {
        setOpen(false);
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <div className="w-full justify-center items-center" onClick={handleOpen}>
                    <BuildImage analysis={analysis} removeBackground={removeBackground} />
                </div>
            </DialogTrigger>
            <DialogContent className="w-full max-w-[90%] md:max-w-[80%] lg:max-w-[70%] xl:max-w-[60%] px-4 md:px-6">
                <DialogHeader>
                    <DialogTitle className="sr-only">Analyzed Image Details</DialogTitle>
                </DialogHeader>
                <BuildImageDialog analysis={analysis} removeBackground={removeBackground} />
            </DialogContent>
        </Dialog>
    )
}


const BuildImage = ({ analysis, removeBackground }: { analysis: AnalysisEntity, removeBackground: string }) => {
    return (
        <div className="flex justify-center items-center">
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

const BuildImageDialog = ({ analysis, removeBackground }: { analysis: AnalysisEntity, removeBackground: string }) => {
    return (
        <div className="flex justify-center items-center">
            <div className="relative md:w-[400px] md:h-[400px] w-[300px] h-[300px]">
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


                    <div className="absolute top-0 left-[50%] transform -translate-x-1/2 -translate-y-1/2">
                        <ConcernChip title="Overall" value={capitalizeFirstLetter(analysis.skin_condition || 'N/A')} />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AnalyzeImageDialog;
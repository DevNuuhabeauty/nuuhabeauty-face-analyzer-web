'use client'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog";
import Image from "next/image";
import SkinFeatureCard from "./skin-feature-card";
import { capitalizeFirstLetter } from "@/src/core/constant/helper";
import { useState } from "react";
import toast from "react-hot-toast";


const AnalysisImageDialog = ({ item }: { item: any }) => {
    const [open, setOpen] = useState(false);

    const handleOpen = () => {
        setOpen(true);
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <div className="w-full justify-center items-center" onClick={() => {
                    if (item.location_image_url) {
                        setOpen(true);
                    } else {
                        toast.error('No image found for this location');
                    }
                }}>
                    <SkinFeatureCard item={item} />
                </div>
            </DialogTrigger>
            <DialogContent className="w-full max-w-[90%] md:max-w-[80%] lg:max-w-[70%] xl:max-w-[60%] px-4 md:px-6">
                <DialogHeader>
                    <DialogTitle className="sr-only">Analyzed Image Details</DialogTitle>
                </DialogHeader>
                <BuildImageDialog image={item.location_image_url} />

            </DialogContent>
        </Dialog>
    )
}


const BuildImageDialog = ({ image }: { image: string }) => {
    return (
        <div className="flex justify-center items-center">
            <div className="relative md:w-[400px] md:h-[400px] w-[300px] h-[300px]">
                <div className=" rounded-full p-4 w-full h-full flex items-center justify-center">
                    <div className="bg-[#CFF0F5] rounded-full w-full h-full flex items-center justify-center border-[#E3F4F9] border-8">
                        {image ? (
                            <div className="w-full h-full rounded-full overflow-hidden">
                                <img
                                    src={image}
                                    alt="Face Analysis Results"
                                    width={600}
                                    height={600}
                                    className="w-full h-full object-cover hover:scale-105 transition-all duration-500 cursor-pointer"
                                />
                            </div>
                        ) : (
                            <div className="text-center p-8">
                                <p className="text-gray-600 font-medium text-lg">No Location Image Available</p>
                                <p className="text-gray-500 text-sm mt-2">This condition does not have an associated location image.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}


export default AnalysisImageDialog;
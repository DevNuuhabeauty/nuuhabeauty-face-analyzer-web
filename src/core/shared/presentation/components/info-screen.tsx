import Image from "next/image"
import Lottie from "lottie-react";
import { Button } from "@/components/ui/button";
import router from "next/router";

import commonLottie from "@/public/images/communication.png"
import nuhabeautyLogo from "@/public/nuhabeauty-logo.png"


const InfoScreen = ({
    title,
    description,
    src,
    widget,
}: {
    title: string,
    description: string,
    src: string,
    widget?: React.ReactNode,
}) => {
    return (
        <div className="flex flex-col items-center justify-center h-screen gap-4">
            <Image
                src={commonLottie}
                alt={title}
                width={200}
                height={200}
            />
            {/* <Lottie
                animationData={src}
                loop={true}
                autoplay={true}
            /> */}
            <div className="flex flex-col items-center justify-center">
                <h1 className="text-sm md:text-xl font-bold">{title}</h1>
                <p className="text-xs md:text-sm text-gray-500 font-light">{description}</p>
            </div>

            {widget}
        </div>
    )
}

export default InfoScreen
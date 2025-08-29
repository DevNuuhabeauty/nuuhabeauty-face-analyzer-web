import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import ProductCard from "./product-card"
import { ProductEntity } from "../../../entities/product-entity"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { useEffect, useRef, useState } from "react"
import { capitalizeWords, removeDuplicateConcerns } from "@/src/core/constant/helper"
import { Badge } from "@/components/ui/badge"

import {
    Carousel,
    CarouselApi,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel"
import toast from "react-hot-toast"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useMediaQuery } from "react-responsive"


const ProductDetailDialogCard = ({ product }: { product: ProductEntity }) => {
    const [open, setOpen] = useState(false)

    const [activeIndex, setActiveIndex] = useState(0)

    const [carouselApi, setCarouselApi] = useState<CarouselApi | null>(null)

    const isMobile = useMediaQuery({ maxWidth: 768 })

    useEffect(() => {
        if (!carouselApi) return

        const onSelect = () => {
            // if (carouselApi.selectedScrollSnap() === (product.productImages?.length ?? 0) + 1) {
            //     carouselApi.scrollTo(0)
            //     return
            // }
            const currentIndex = carouselApi.selectedScrollSnap()
            setActiveIndex(currentIndex)
        }

        carouselApi.on("select", onSelect)
        onSelect() // Set initial index

        return () => {
            carouselApi.off("select", onSelect)
        }

    }, [carouselApi])

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <div className="w-full" onClick={() => setOpen(true)}>
                <ProductCard product={product} />
            </div>
            <DialogContent className="w-full max-w-[90%] md:max-w-[80%] lg:max-w-[70%] xl:max-w-[60%] px-4 md:px-6 rounded-lg">

                {/* className="sm:max-w-[425px]"> */}
                <DialogHeader>
                    <DialogTitle>Product Details</DialogTitle>
                    <DialogDescription>
                        View detailed information about this product.
                    </DialogDescription>
                </DialogHeader>

                {
                    !isMobile ? (
                        <div className="grid items-center justify-center grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="flex flex-col items-start justify-center gap-4">

                                <ProductImageCarousel
                                    productImages={product.productImages ?? []}
                                    activeIndex={activeIndex}
                                    setActiveIndex={setActiveIndex}
                                    setCarouselApi={setCarouselApi}
                                />

                            </div>

                            <div className="flex flex-col items-start justify-center gap-4">


                                <div className="grid items-start grid-cols-1 gap-1">
                                    <p className="text-sm font-bold">
                                        {capitalizeWords(product.name ?? "N/A")}
                                    </p>
                                    <p className="text-xs font-light">
                                        {capitalizeWords(product.frequency ?? "N/A")}
                                    </p>
                                </div>


                                <div className="flex flex-col items-start justify-center gap-1">
                                    <p className="text-sm font-bold">
                                        How to use
                                    </p>
                                    <p className="text-xs font-light">
                                        {product.how_to_use ?? "N/A"}
                                    </p>
                                </div>

                                <div className="flex flex-col items-start justify-center gap-1">
                                    <p className="text-sm font-bold">
                                        Concerns
                                    </p>

                                    <div className="flex flex-wrap gap-2">
                                        {removeDuplicateConcerns(product.diseasesDB ?? []).slice(0, 3).map((disease, index) => (
                                            <Badge
                                                variant={"outline"}
                                                key={index} className="rounded-full text-xs text-center w-fit line-clamp-1">
                                                {capitalizeWords(disease.name ?? "N/A")}
                                            </Badge>
                                        ))}

                                    </div>

                                </div>


                                <div className="flex flex-col items-start justify-center gap-1">
                                    <p className="text-sm font-bold">
                                        Steps
                                    </p>

                                    <StepTime steps={product.steps ?? []} />
                                </div>



                            </div>

                        </div>
                    ) : (

                        <ScrollArea className="h-[500px]">
                            <div className="grid items-center justify-center grid-cols-1 md:grid-cols-2 gap-4 h-screen">
                                <div className="flex flex-col items-start justify-center gap-4">

                                    <ProductImageCarousel
                                        productImages={product.productImages ?? []}
                                        activeIndex={activeIndex}
                                        setActiveIndex={setActiveIndex}
                                        setCarouselApi={setCarouselApi}
                                    />

                                </div>

                                <div className="flex flex-col items-start justify-center gap-4">


                                    <div className="grid items-start grid-cols-1 gap-1">
                                        <p className="text-sm font-bold">
                                            {capitalizeWords(product.name ?? "N/A")}
                                        </p>
                                        <p className="text-xs font-light">
                                            {capitalizeWords(product.frequency ?? "N/A")}
                                        </p>
                                    </div>


                                    <div className="flex flex-col items-start justify-center gap-1">
                                        <p className="text-sm font-bold">
                                            How to use
                                        </p>
                                        <p className="text-xs font-light">
                                            {product.how_to_use ?? "N/A"}
                                        </p>
                                    </div>

                                    <div className="flex flex-col items-start justify-center gap-1">
                                        <p className="text-sm font-bold">
                                            Concerns
                                        </p>

                                        <div className="flex flex-wrap gap-2">
                                            {removeDuplicateConcerns(product.diseasesDB ?? []).slice(0, 3).map((disease, index) => (
                                                <Badge
                                                    variant={"outline"}
                                                    key={index} className="rounded-full text-xs text-center w-fit line-clamp-1">
                                                    {capitalizeWords(disease.name ?? "N/A")}
                                                </Badge>
                                            ))}

                                        </div>

                                    </div>


                                    <div className="flex flex-col items-start justify-center gap-1">
                                        <p className="text-sm font-bold">
                                            Steps
                                        </p>

                                        <StepTime steps={product.steps ?? []} />
                                    </div>



                                </div>

                            </div>
                        </ScrollArea>

                    )
                }


                <DialogFooter>
                    <Button onClick={() => window.open(product.externalLink ?? "", "_blank")}>
                        Buy Product
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

const ProductImageCarousel = ({ productImages, activeIndex, setActiveIndex, setCarouselApi }: {
    productImages: string[];
    activeIndex: number;
    setActiveIndex: (index: number) => void;
    setCarouselApi: (api: CarouselApi) => void;
}) => {
    return (
        <div className="relative">
            <Carousel
                setApi={setCarouselApi}
            >
                <CarouselContent className="w-full h-full">

                    {productImages.map((image, index) => (
                        <CarouselItem
                            key={index}
                        >
                            <Image
                                src={image}
                                alt="Product Image"
                                width={500}
                                height={500}
                                className="rounded-lg"
                            />
                        </CarouselItem>
                    ))}
                </CarouselContent>

            </Carousel>

            <div className="absolute bottom-0 flex flex-row items-center justify-center gap-2 w-full mb-4">
                {
                    productImages.map((image, index) => {
                        const isActive = index === activeIndex;
                        return (
                            <div
                                key={index}
                                className={`w-2 h-2  rounded-full ${isActive ? "bg-primary" : "bg-black/20"}`}
                            />
                        )
                    })
                }

            </div>

        </div>
    )
}

const StepTime = ({ steps }: { steps: string[] }) => {
    return (
        <div className="flex flex-col gap-6">
            {steps.map((step, index) => (
                <div key={index} className="flex flex-row items-center gap-4">
                    <div className="relative flex items-center justify-center">
                        <div className="w-3 h-3 bg-primary rounded-full z-10" />
                        {index !== steps.length - 1 && (
                            <div className="absolute w-[2px] h-[20px] bg-primary/20 -bottom-6" />
                        )}
                    </div>
                    <div className="flex flex-col items-start justify-center gap-1">
                        <p className="text-xs font-light">{step}</p>
                    </div>
                </div>
            ))}
        </div>
    )
}

export default ProductDetailDialogCard;
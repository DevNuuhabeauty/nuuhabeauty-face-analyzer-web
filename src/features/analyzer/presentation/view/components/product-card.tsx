import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { ConcernEntity, ProductEntity } from "../../../entities/product-entity";
import Link from "next/link";
import { capitalizeWords, removeDuplicateConcerns } from "@/src/core/constant/helper";
import { LinkIcon } from "lucide-react";



const ProductCard = ({
    product
}: {
    product: ProductEntity
}) => {




    return (
        <div className="flex flex-col items-start justify-center border shadow-md rounded-lg hover:shadow-lg transition-all duration-500 cursor-pointer w-full">


            <div className="relative">
                <Link href={product.externalLink ?? ""} target="_blank">
                    <Button
                        size={"icon"}
                        variant={"outline"}
                        className="absolute top-2 right-2 rounded-full m-2">
                        <LinkIcon className="w-4 h-4" />
                    </Button>
                </Link>

                <Image
                    src={product.productImages?.[0] ?? ""}
                    alt="Face Analyzer Result"
                    width={1000}
                    height={1000}
                    className="rounded-tr-lg rounded-tl-lg "
                />
            </div>

            <div className="space-y-3 m-4">
                <div className="flex flex-col items-start justify-center gap-1">
                    <p className="text-md font-bold">
                        {capitalizeWords(product.name ?? "N/A")}
                    </p>
                    <p className="text-xs font-light">
                        {product.frequency ?? "N/A"}
                    </p>
                </div>

                <div className="flex flex-wrap gap-2">
                    {removeDuplicateConcerns(product.diseasesDB ?? []).slice(0, 3).map((disease, index) => (
                        <Badge
                            variant={"outline"}
                            key={index} className="rounded-full text-xs text-center w-fit line-clamp-1">
                            {capitalizeWords(disease.name ?? "N/A")}
                        </Badge>
                    ))}
                </div>

                <div className="flex flex-col items-start justify-center gap-1">
                    <p className="text-sm font-bold">
                        How to use
                    </p>
                    <p className="text-xs font-light line-clamp-2 overflow-ellipsis">
                        {product.how_to_use ?? "N/A"}
                    </p>
                </div>



            </div>




        </div >
    )
}

export default ProductCard;
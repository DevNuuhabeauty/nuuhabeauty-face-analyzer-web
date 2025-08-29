"use client"
import ProductIngredientFinder from "@/src/features/product/presentation/view/screen/product-ingredients-screen"
import DisclaimerModal from "@/src/core/shared/presentation/components/disclaimer-modal";
import { useState } from "react";
import CitationDisclaimerModal from "@/src/core/shared/presentation/components/citation-disclaimer-modal";

const ProductIngredientsPage = () => {
    const [isDisclaimerOpen, setIsDisclaimerOpen] = useState(false);

    return (
        <>
            <ProductIngredientFinder />
            {
                process.env.SHOW_DISCLAIMER === 'true' && (
                    <CitationDisclaimerModal
                        isOpen={isDisclaimerOpen}
                        onClose={() => setIsDisclaimerOpen(false)}
                    />
                )
            }
        </>
    )
}

export default ProductIngredientsPage
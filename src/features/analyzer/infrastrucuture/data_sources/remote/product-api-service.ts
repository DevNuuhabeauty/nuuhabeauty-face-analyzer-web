import axios from "axios";
import { GoodEntity, ProductEntity } from "../../../entities/product-entity";
import { brighteningSerumImages, cleanserImages, CONCERN_API_URL, faceMistImages, moisturizerImages, soothingSerumImages, sunscreenImages } from "@/src/core/constant";
import { AnalysisEntity } from "../../../entities/analysis-entity";




export const getProducts = async (imageData: string): Promise<AnalysisEntity> => {
    try {
        const response = await axios.post(`${CONCERN_API_URL}/api/analyze-skin`, {
            image: imageData
        }, {
            headers: {
                'Content-Type': 'application/json',
            }
        });

        const data = response.data.data;

        console.log("Data", response.data);

        const analysis = new AnalysisEntity({
            // good: data.analysis.positive_features.map((good: any) => GoodEntity.fromJson(good)),
            good: [],
            status_face: data.analysis.status_face,
            skin_condition: data.analysis.skin_condition,
            products: data.analysis.products.map((product: any) => ProductEntity.fromJsonPy(product)),

        });

        console.log("Analysis", analysis);

        return analysis;

        // eturn new AnalysisEntity({
        //     status_face: data.analysis.status_face,
        //     skin_condition: data.analysis.skin_condition,
        //     products: data.analysis.products.map((product: any) => ProductEntity.fromJsonPy(product)),
        //     analyzeId: data.analysis_id,
        // });



    } catch (error) {
        console.log('Failed to fetch products', error);
        throw Error(error as string);
    }
}





export const getProductImage = (product: ProductEntity): string[] => {
    if (product.name === 'NUUHA BEAUTY MUGWORT HYDRA BRIGHT GENTLE DAILY FOAM CLEANSER') {
        return cleanserImages;
    }
    if (product.name === 'NUUHA BEAUTY 4 IN 1 HYDRA BRIGHT ULTIMATE KOREAN WATER MIST') {
        return faceMistImages;
    }
    if (product.name === 'NUUHA BEAUTY 10X SOOTHING COMPLEX HYPER RELIEF SERUM') {
        return soothingSerumImages;
    }
    if (product.name === 'NUUHA BEAUTY 10X BRIGHTENING COMPLEX HYPER RELIEF SERUM' || product.name === 'NUUHA BEAUTY 4X BRIGHTENING COMPLEX ADVANCED GLOW SERUM') {
        return brighteningSerumImages;
    }
    if (product.name === 'NUUHA BEAUTY 7X PEPTIDE ULTIMATE GLASS SKIN MOISTURISER') {
        return moisturizerImages;
    }
    if (product.name === 'NUUHA BEAUTY ULTRA GLOW BRIGHTENING SERUM SUNSCREEN SPF50+ PA++++') {
        return sunscreenImages;
    }

    return [];

}

export const getProductExternalLink = (product: ProductEntity): string => {
    if (product.name === 'NUUHA BEAUTY MUGWORT HYDRA BRIGHT GENTLE DAILY FOAM CLEANSER') {
        return 'https://nuuhabeauty.com/collections/homepage/products/nuuha-beauty-mugwort-hydra-bright-gentle-daily-foam-cleanser-1?variant=51685029609840';
    }
    if (product.name === 'NUUHA BEAUTY 4 IN 1 HYDRA BRIGHT ULTIMATE KOREAN WATER MIST') {
        return 'https://nuuhabeauty.com/collections/you-may-also-like/products/nuuha-beauty-4-in-1-hydra-bright-ultimate-korean-water-mist-1?variant=51685030199664';
    }
    if (product.name === 'NUUHA BEAUTY 10X SOOTHING COMPLEX HYPER RELIEF SERUM') {
        return 'https://nuuhabeauty.com/collections/you-may-also-like/products/nuuha-beauty-4x-brightening-complex-advanced-glow-serum-3?variant=51685030003056';
    }
    if (product.name === 'NUUHA BEAUTY 10X BRIGHTENING COMPLEX HYPER RELIEF SERUM' || product.name === 'NUUHA BEAUTY 4X BRIGHTENING COMPLEX ADVANCED GLOW SERUM') {
        return 'https://nuuhabeauty.com/collections/homepage/products/nuuha-beauty-ultra-glow-brightening-serum-sunscreen-spf50-pa-1?variant=51685030035824';
    }
    if (product.name === 'NUUHA BEAUTY 7X PEPTIDE ULTIMATE GLASS SKIN MOISTURISER') {
        return 'https://nuuhabeauty.com/collections/homepage/products/nuuha-beauty-7x-peptide-ultimate-glass-skin-moisturiser-1?variant=51685029511536';
    }
    if (product.name === 'NUUHA BEAUTY ULTRA GLOW BRIGHTENING SERUM SUNSCREEN SPF50+ PA++++') {
        return 'https://nuuhabeauty.com/collections/homepage/products/nuuha-beauty-ultra-glow-brightening-serum-sunscreen-spf50-pa-1?variant=51685030035824';
    }

    return '';
}
//https://nuuhabeauty.com/collections/homepage/products/nuuha-beauty-7x-peptide-ultimate-glass-skin-moisturiser-1?variant=51685029511536
import { AnalysisEntity } from "../../entities/analysis-entity";
import { ProductEntity } from "../../entities/product-entity";
import { getProductExternalLink, getProductImage, getProducts } from "../data_sources/remote/product-api-service";
import { removeBackgroundRepo, saveAnalysisRepo } from "./analyzer-repo";

export const getProductsRepo = async ({ imageData, user_id }: { imageData: string, user_id: string }): Promise<AnalysisEntity> => {
    try {
        const response = await getProducts(imageData);

        if (!response) {
            throw new Error('No data found');
        }

        // Process products in parallel
        const products = response.products ? await Promise.all(
            response.products.map(async (product: ProductEntity) => {
                const [productImages, externalLink] = await Promise.all([
                    getProductImage(product),
                    getProductExternalLink(product)
                ]);
                return {
                    ...product,
                    productImages,
                    externalLink
                };
            })
        ) : [];

        const removeBackground = await removeBackgroundRepo(imageData);

        return {
            ...response,
            products,
            userImage: removeBackground,
        };

    } catch (error) {
        console.error(error);
        throw error;
    }
}
import { getServerSession } from "next-auth/next";
import { deleteAllAnalyze, deleteAnalyze, getAllAnalyze, getAnalysisSummary, getDiseaseLocationImage, getFilePath, getSingleAnalyze, removeBackground, saveAnalyze } from "../data_sources/remote/analyzer-api-service";
import { getProductExternalLink, getProductImage } from "../data_sources/remote/product-api-service";
import { DEFAULT_IMAGE } from "@/src/core/constant";
import { AnalysisEntity } from "../../entities/analysis-entity";
import { AnalysisSummaryEntity } from "../../entities/analysis-summary-entity";

export const removeBackgroundRepo = async (imageData: string): Promise<string> => {
    try {
        const response = await removeBackground(imageData);
        return response;
    } catch (error) {
        throw error;
    }
}


export const getAllAnalyzeRepo = async (shopifyId: string, accessToken: string, page?: number, limit?: number): Promise<AnalysisEntity[]> => {
    try {

        const response = await getAllAnalyze(shopifyId, accessToken, page, limit);

        await Promise.all(response.map(async (analysis) => {
            // const userImage = await removeBackgroundRepo(analysis.userImage ?? '');
            // analysis.userImage = userImage;



            if (analysis.products?.length) {
                const products = await Promise.all(analysis.products.map(async (product) => {
                    const [productImages, externalLink] = await Promise.all([
                        getProductImage(product),
                        getProductExternalLink(product)
                    ]);
                    return { ...product, productImages, externalLink };
                }));
                analysis.products = products;
            }
        }));

        return response;
    } catch (error) {
        throw error;
    }
}



export const getSingleAnalyzeRepo = async (analyzeId: string, accessToken: string): Promise<AnalysisEntity> => {
    try {
        // Get the analysis first
        const analysis = await getSingleAnalyze(analyzeId, accessToken);

        // // Then get the background removed image
        // const userImage = await removeBackgroundRepo(analysis.userImage ?? '');

        if (analysis.products?.length) {
            const products = await Promise.all(analysis.products.map(async (product) => {
                const [productImages, externalLink] = await Promise.all([
                    getProductImage(product),
                    getProductExternalLink(product)
                ]);
                return { ...product, productImages, externalLink };
            }));
            return { ...analysis, products };
        }

        return { ...analysis };
    } catch (error) {
        throw error;
    }
}

export const saveAnalysisRepo = async (analysis: AnalysisEntity, accessToken: string): Promise<AnalysisEntity> => {
    try {
        const response = await saveAnalyze(analysis, accessToken);
        return response;
    } catch (error) {
        throw error;
    }
}

export const deleteAnalyzeRepo = async (analysisId: string, accessToken: string): Promise<AnalysisEntity> => {
    try {
        const response = await deleteAnalyze(analysisId, accessToken);
        return response;
    } catch (error) {
        throw error;
    }
}


export const deleteAllAnalyzeRepo = async (analyzes: AnalysisEntity[], accessToken: string): Promise<void> => {
    try {
        await deleteAllAnalyze(analyzes, accessToken);
    } catch (error) {
        throw error;
    }
}


export const getAnalysisSummaryRepo = async (shopifyId: string, accessToken: string): Promise<AnalysisSummaryEntity> => {
    try {
        const response = await getAnalysisSummary(shopifyId, accessToken);
        console.log("Response", response);
        return response;
    } catch (error) {
        throw error;
    }
}

export const getDiseaseLocationImageRepo = async (location: string): Promise<string> => {
    try {
        const response = await getDiseaseLocationImage(location);
        return response;
    } catch (error) {
        throw error;
    }
}
import { BASE_64, CONCERN_API_URL, SERVER_API_URL } from "@/src/core/constant";
import axios from "axios";
import { ConcernEntity, ProductEntity } from "../../../entities/product-entity";
import { AnalysisEntity } from "../../../entities/analysis-entity";
import toast from "react-hot-toast";
import { AnalysisSummaryEntity } from "../../../entities/analysis-summary-entity";





export const removeBackground = async (imageData: string): Promise<string> => {
    try {
        const response = await axios.post(`${CONCERN_API_URL}/api/remove-background`, {
            image: imageData
        }, {
            headers: {
                'Content-Type': 'application/json',
            }
        });

        if (response.status !== 200) {
            throw new Error('Failed to remove background with status code ' + response.status);
        } else {
            return response.data.data;
        }
    } catch (error) {
        throw new Error('Failed to remove background' + error);
    }
}


export const getAllAnalyze = async (shopifyId: string, accessToken: string, page?: number, limit?: number): Promise<AnalysisEntity[]> => {


    try {

        const response = await axios.get(`${SERVER_API_URL}/api/analyzes`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `${accessToken}`
            },
            params: {
                shopify_id: shopifyId,
                page: page,
                limit: limit
            }
        });

        if (response.status !== 200) {
            throw new Error('Failed to get all analyze with status code ' + response.status);
        }

        const analysis = response.data.data.analysis;

        if (analysis.length === 0 || !analysis) {
            return [];
        }

        return analysis.map((item: any) => {
            return new AnalysisEntity(
                {
                    analyzeId: item.id,
                    userImage: item.image_url,
                    products: item.products,
                    skin_condition: item.skin_condition,
                    status_face: item.skin_status,
                    created_at: new Date(item.created_at),
                    diseases: item.diseases.map((disease: any) => {
                        return new ConcernEntity({
                            name: disease.name,
                            confidence_percent: disease.confidence_percentage
                        })
                    })
                }
            )
        });

    } catch (error: any) {
        if (error.response.status === 401) {
            throw new Error("You are not authorized to access this feature");
        }
        throw new Error('Server Error');
    }
}


export const getAnalysisSummary = async (shopifyId: string, accessToken: string): Promise<AnalysisSummaryEntity> => {
    try {
        const response = await axios.get(`${SERVER_API_URL}/api/analyzes/summary`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `${accessToken}`
            },
            params: {
                shopify_id: shopifyId,
                type: 'summary'
            }
        });


        if (response.status !== 200) {
            throw new Error('Failed to get analysis summary with status code ' + response.status);
        }

        const data = response.data.data;

        if (!data) {
            throw new Error('No data found');
        }

        return AnalysisSummaryEntity.fromJson(data);

    } catch (error: any) {
        if (error.response.status === 401) {
            throw new Error("You are not authorized to access this feature");
        }
        throw new Error('Failed to get analysis summary' + error)
    }
}



export const getSingleAnalyze = async (analyzeId: string, accessToken: string): Promise<AnalysisEntity> => {
    try {
        const response = await axios.get(`${SERVER_API_URL}/api/analyzes/${analyzeId}`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `${accessToken}`
            }
        });

        if (response.status !== 200) {
            throw new Error(`Failed to get analysis with status code ${response.status}`);
        }

        console.log("Response", response.data.data);


        const data = response.data.data;
        const analysis = AnalysisEntity.fromJsonDB(data);
        console.log("Analysis", analysis);
        return analysis;

    } catch (error: any) {
        if (error.response.status === 401) {
            throw new Error("You are not authorized to access this feature");
        }
        throw new Error('Failed to get analysis' + error)
    }
}



export const getFilePath = async (analysisId: string): Promise<string> => {
    try {
        const response = await axios.get(`${CONCERN_API_URL}/api/file-path/${analysisId}/image.png`);
        if (response.status !== 200) {
            throw new Error('Failed to get file path with status code ' + response.status);
        }
        return response.data.image;
    } catch (error) {
        throw new Error('Failed to get file path' + error);
    }
}



export const saveAnalyze = async (analysis: AnalysisEntity, accessToken: string): Promise<AnalysisEntity> => {

    // Get treatments for each disease
    const treatments = await getSkinProblemsTreatment(
        (analysis.products?.map(product => product.diseases?.name).filter((name): name is string => name !== undefined) || [])
    );

    console.log("Treatments", treatments);

    const toJson = {
        "user_id": analysis.user_id,
        "image_url": analysis.userImage,
        "skin_status": analysis.status_face,
        "skin_condition": analysis.skin_condition,
        "ai_recommend": analysis.ai_recommendation,
        // "good": analysis.good?.map((good) => ({
        //     name: good.name,
        //     confidence_percentage: good.confidence_percent,
        //     ai_recommend: good.ai_comment,
        //     location: good.location
        // })),
        "products_disease": analysis.products?.map((product: any) => ({
            name: product.name,
            diseaseFromAnalyze: product.diseases ? {
                name: product.diseases.name,
                how_to_use: treatments[product.diseases.name], // Map treatment to how_to_use
                confidence_percentage: product.diseases.confidence_percent,
                ai_recommend: product.diseases.ai_comment,
                location: product.diseases.location
            } : undefined
        }))
    }

    console.log("To Json", toJson);

    const response = await axios.post(`${SERVER_API_URL}/api/analyzes`, toJson,
        {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `${accessToken}`
            }
        });

    return AnalysisEntity.fromJsonDB(response.data.data);

}


export const deleteAnalyze = async (analysisId: string, accessToken: string): Promise<AnalysisEntity> => {
    const response = await axios.delete(`${SERVER_API_URL}/api/analyzes/${analysisId}`, {
        headers: {
            'Authorization': `${accessToken}`,
            'Content-Type': 'application/json'
        }
    });
    return AnalysisEntity.fromJsonDB(response.data.data);
}



export const deleteAllAnalyze = async (analyzes: AnalysisEntity[], accessToken: string): Promise<void> => {
    const response = await axios.delete(`${SERVER_API_URL}/api/analyzes/delete-all`, {
        headers: {
            'Authorization': `${accessToken}`,
            'Content-Type': 'application/json'
        },
        data: analyzes.map((analyze) => ({
            id: analyze.analyzeId,
        }))
    });

    return response.data.data;
}


export const getSkinProblemsTreatment = async (skinProblems: string[]): Promise<Record<string, string>> => {
    const response = await axios.post(`${CONCERN_API_URL}/api/skin-problems-treatments`, {
        problems: skinProblems
    });
    return response.data.treatments;
}


export const getDiseaseLocationImage = async (location: string): Promise<string> => {
    const response = await axios.get(`${SERVER_API_URL}/api/diseases/location-image/${location}`);
    if (response.status !== 200) {
        throw new Error('Failed to get disease location image with status code ' + response.status);
    }
    return response.data.data.image;
}



// https://api.nuuhabeauty.com/api/file-path/55c36497-585e-4694-8eed-bcedfac476ad/image.png
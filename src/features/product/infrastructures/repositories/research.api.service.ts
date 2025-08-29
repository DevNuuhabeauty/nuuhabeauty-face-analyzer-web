import { CONCERN_API_URL } from "@/src/core/constant";
import axios from "axios";
import { ResearchEntity } from "../../entities/research-entity";

// http://127.0.0.1:8000/pubmed-articles?query=nacl nanoparticles

export const getResearchs = async (productName: string): Promise<ResearchEntity[]> => {
    try {
        const response = await axios.get(`${CONCERN_API_URL}/pubmed-articles`, {
            params: {
                query: productName
            },
            timeout: 10000 // 10 second timeout
        });

        const articles = response.data.data.articles;
        return articles as ResearchEntity[];
    } catch (error) {
        if (axios.isAxiosError(error)) {
            if (error.code === 'ERR_NETWORK') {
                console.log('error', error.cause);
                console.error('Network error occurred while getting research articles');
                return []; // Return empty array on network error
            }
            console.error('Error getting research articles:', error.message, 'Status:', error.response?.status);
        } else {
            console.error('Unexpected error getting research articles:', error);
        }
        return []; // Return empty array on any error
    }
}
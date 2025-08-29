import { CONCERN_API_URL } from "@/src/core/constant";

import axios, { AxiosError } from "axios";
import { NPRAEntity } from "../../entities/product-entity";


export const getListNPRAProducts = async (productName: string): Promise<NPRAEntity[]> => {
    try {
        //not params but request body
        const response = await axios.get(`${CONCERN_API_URL}/npra-product-data`, {
            params: {
                query: productName
            }
        });
        const data = response.data.data;
        if (data instanceof Array) {
            return data.map((item: any) => ({
                ...item,
                product_name: item.product_name.toLowerCase(),
                registration_no: item.registration_no
            }));
        } else {
            return [];
        }
    } catch (error) {
        if (error instanceof AxiosError) {
            if (error.code === 'ERR_NETWORK') {
                console.error('Network error occurred:', error.message);
                throw new Error('Network connection error. Please check your internet connection.');
            }
            console.error('API error occurred:', error.message);
            throw new Error('Error communicating with NPRA API');
        }
        console.error('Unexpected error getting NPRA products:', error);
        throw new Error('Unexpected error while getting NPRA products');
    }
}

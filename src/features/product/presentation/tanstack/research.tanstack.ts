import { useMutation, useQuery } from "@tanstack/react-query";
import { getResearchs } from "../../infrastructures/repositories/research.api.service";


//USE MUTATION
export const useGetResearchs = () => {
    return useMutation({
        mutationFn: ({ productName }: { productName: string }) => {
            console.log('productName', productName);
            return getResearchs(productName);
        }
    });
}
import { useMutation } from "@tanstack/react-query";
import { getChemical } from "../../infrastructures/repositories/chemical.api.service";
import toast from "react-hot-toast";

//USE MUTATION
export const useGetChemical = () => {
    return useMutation({
        mutationFn: async ({
            productName
        }: {
            productName: string;
        }) => {
            try {
                const chemical = await getChemical(productName);
                console.log('chemical', chemical);
                return chemical;
            } catch (error) {
                console.error('Error getting chemical:', error);
            }
        },
        onError: (error) => {
            console.error('Error getting chemical:', error);
        }
    });
}
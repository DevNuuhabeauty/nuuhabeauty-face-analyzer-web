import { useMutation, useQuery } from "@tanstack/react-query";
import { getProductsRepo } from "../../infrastrucuture/repositories/product-repo";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";

const key = 'products';


export const useGetProducts = (imageData: string | null) => {
    return useQuery({
        queryKey: [key],

        queryFn: async () => {
            try {
                if (!imageData) {
                    throw new Error('Image data is required');
                }

                const response = await getProductsRepo({ imageData, user_id: "test" });
                console.log("Response", response);

                return response;
            } catch (error) {
                console.log("Error", error);
                throw error;
            }
        },

    },);
}


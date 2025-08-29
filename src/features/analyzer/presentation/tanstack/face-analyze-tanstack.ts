import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { deleteAllAnalyzeRepo, deleteAnalyzeRepo, getAllAnalyzeRepo, getAnalysisSummaryRepo, getDiseaseLocationImageRepo, getSingleAnalyzeRepo, removeBackgroundRepo, saveAnalysisRepo } from "../../infrastrucuture/repositories/analyzer-repo";
import { getProductsRepo } from "../../infrastrucuture/repositories/product-repo";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { AnalysisEntity } from "../../entities/analysis-entity";
import { useSession } from "next-auth/react";
import { AnalysisSummaryEntity } from "../../entities/analysis-summary-entity";



export const useRemoveBackground = (imageData: string | null) => {

    return useQuery({
        queryKey: ['removeBackground'],
        queryFn: async () => {
            try {
                if (!imageData) {
                    throw new Error('Image data is required');
                }
                const response = await removeBackgroundRepo(imageData);
                return response;
            } catch (error) {
                throw error;
            }
        }

    });
}

export const useGetAllAnalyze = (shopifyId: string, page?: number, limit?: number, date?: Date) => {


    const { data: session } = useSession();
    const accessToken = session?.accessToken;

    return useQuery({
        queryKey: ['getAllAnalyze', shopifyId],
        queryFn: async () => {

            let response: AnalysisEntity[] = [];

            if (!shopifyId || !accessToken) {
                throw new Error('Shopify ID or Access Token is required');
            }

            response = await getAllAnalyzeRepo(shopifyId, accessToken, undefined, undefined);

            if (!response) {
                throw new Error('No response from getAllAnalyzeRepo');
            }

            if (date) {
                response = response.filter((item) => {
                    const itemDate = new Date(item.created_at ?? '');
                    return itemDate >= date && itemDate <= new Date(date.getFullYear(), date.getMonth() + 1, 0);
                });
            }

            return response;
        },
        // enabled: !!shopifyId && !!accessToken // Only run query if both shopifyId and session exist
    });
}

export const useGetAllAnalyzePaginationMutation = () => {

    const { data: session } = useSession();
    const accessToken = session?.accessToken;
    const shopifyId = session?.user?.shopify_id;

    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: ['getAllAnalyzePagination'],
        mutationFn: async ({ page, limit }: { page: number, limit: number }) => {
            if (!accessToken || !shopifyId) {
                throw new Error('Access Token or Shopify ID is required');
            }
            const response = await getAllAnalyzeRepo(shopifyId, accessToken, page, limit);
            return response;
        },
        onSuccess: (response) => {
            queryClient.setQueryData(['getAllAnalyze', shopifyId], response);
        },
        onError: (error: AxiosError) => {
            toast.error(error.message);
        }
    });
}


export const useGetAnalysisSummary = (shopifyId: string) => {
    const { data: session } = useSession();
    const accessToken = session?.accessToken;
    return useQuery({
        queryKey: ['getAnalysisSummary', shopifyId],
        queryFn: async () => {
            if (!accessToken) {
                throw new Error('Access Token is required');
            }
            const response = await getAnalysisSummaryRepo(shopifyId, accessToken);
            return response;
        }
    });
}


export const useGetSingleAnalyze = (analyzeId: string) => {
    const { data: session } = useSession();
    const accessToken = session?.accessToken;
    return useQuery({
        queryKey: ['getSingleAnalyze', analyzeId],
        queryFn: async () => {
            if (!accessToken) {
                throw new Error('Access Token is required');
            }
            const response = await getSingleAnalyzeRepo(analyzeId, accessToken);
            if (response) {
                const locations = response.diseases?.map((disease) => disease.location);
                if (locations && locations.length > 0) {
                    for (const location of locations) {
                        if (location) {
                            const locationImage = await getDiseaseLocationImageRepo(location);
                            response.diseases?.forEach((disease) => {
                                if (disease.location === location) {
                                    disease.location_image_url = locationImage;
                                }
                            });
                        }
                    }
                }
            }
            return response;
        }
    });
}



export const useAnalyzeSkinMutation = () => {

    const { data: session } = useSession();
    const accessToken = session?.accessToken;
    const userId = session?.user.id

    const shopifyId = session?.user?.shopify_id;

    return useMutation({
        mutationKey: ['analyzeSkin'],
        mutationFn: async ({ imageData, }: { imageData: string }) => {
            try {

                if (!accessToken || !shopifyId) {
                    throw new Error('Access Token or Shopify ID is required');
                }

                const response = await getProductsRepo({
                    imageData,
                    user_id: shopifyId,
                });

                console.log("Response Products", response.products);

                //Test
                const analysis = new AnalysisEntity({
                    skin_condition: response.skin_condition,
                    status_face: response.status_face,
                    products: response.products,
                    user_id: userId,
                    userImage: response.userImage,
                    ai_recommendation: "test",
                    // good: response.good,
                });


                const savedAnalysis = await saveAnalysisRepo(analysis, accessToken);

                console.log('Response Tanstack', savedAnalysis);

                return savedAnalysis;
            } catch (error) {
                throw error;
            }
        },
    });
}


// export const useSaveAnalysisMutation = ({ shopifyId }: { shopifyId: string }) => {
//     const queryClient = useQueryClient();
//     const router = useRouter();

//     const { data: session } = useSession();
//     const accessToken = session?.accessToken;

//     return useMutation({
//         mutationKey: ['saveAnalysis'],
//         mutationFn: async ({
//             analysis,

//         }: {
//             analysis: AnalysisEntity;

//         }) => {
//             if (!accessToken) {
//                 throw new Error('Access Token is required');
//             }
//             const response = await saveAnalysisRepo(analysis, accessToken);

//             return response;
//         },
//         onSuccess: (response) => {
//             toast.success('Successfully Saved');
//             router.push(`/overview`);
//             queryClient.setQueryData(['getAllAnalyze', shopifyId], (oldData: AnalysisEntity[] | undefined) => {
//                 if (!oldData) return [response];
//                 return [...oldData, response];
//             });
//         },
//         onError: (error: AxiosError) => {
//             toast.error(error.message);
//         }
//     });
// }


export const useDeleteAnalysisMutation = ({ shopifyId }: { shopifyId: string }) => {
    const queryClient = useQueryClient();
    const { data: session } = useSession();
    const accessToken = session?.accessToken;

    const { data: analysisSummary, refetch } = useGetAnalysisSummary(shopifyId);
    return useMutation({
        mutationKey: ['deleteAnalysis'],
        mutationFn: async (analysisId: string) => {
            if (!accessToken) {
                throw new Error('Access Token is required');
            }
            const response = await deleteAnalyzeRepo(analysisId, accessToken);
            return response;
        },
        onSuccess: (response) => {
            toast.success('Successfully Deleted');
            queryClient.setQueryData(['getAllAnalyze', shopifyId], (oldData: AnalysisEntity[] | undefined) => {
                if (!oldData) return [];
                return oldData.filter(item => item.analyzeId !== response.analyzeId);
            });
            refetch();
        },
        onError: (error: AxiosError) => {
            toast.error(error.message);
        }
    });
}


export const useDeleteAllAnalyzeMutation = ({ shopifyId }: { shopifyId: string }) => {
    const queryClient = useQueryClient();
    const { data: session } = useSession();
    const accessToken = session?.accessToken;

    const { data: analysisSummary, refetch } = useGetAnalysisSummary(shopifyId);
    return useMutation({
        mutationKey: ['deleteAllAnalyze'],
        mutationFn: async (analyzes: AnalysisEntity[]) => {
            if (!accessToken) {
                throw new Error('Access Token is required');
            }
            const response = await deleteAllAnalyzeRepo(analyzes, accessToken);
            return response;
        },
        onSuccess: (response) => {
            toast.success('Successfully Deleted');
            queryClient.invalidateQueries({
                queryKey: ['getAllAnalyze', shopifyId],
                refetchType: 'active',
                exact: true
            });
            refetch();
        },
        onError: (error: AxiosError) => {
            toast.error(error.message);
        }
    });
}






// const useGetProductsMutation = useMutation({
//     mutationKey: ['getProducts'],
//     mutationFn: async (imageData: string) => {
//         try {
//             const response = await getProductsRepo(imageData);
//             const image = await removeBackgroundRepo(imageData);
//             response.userImage = image;
//             return response;
//         } catch (error) {
//             throw error;
//         }
//     },
//     onSuccess: (response) => {
//         queryClient.setQueryData<AnalysisEntity>(['getProducts'], response);
//         localStorage.setItem('analysisData', JSON.stringify(response));
//         toast.success('Successfully Scanned');
//         // router.push(`/face-analyzer/products`);
//         toast.success('Analysis ID: ' + response.analyzeId);
//         router.push(`/face-analyzer/${response.analyzeId}`);
//         return response;
//     },
//     onError: (error: AxiosError) => {
//         console.log('ERROR', error)
//         toast.error('Error:' + error.message);
//         localStorage.clear();
//     }
// })



// queryClient.setQueryData(['getAllAnalyze', shopifyId], (oldData: AnalysisEntity[] | undefined) => {
//     if (!oldData) return [];
//     // Filter out items that exist in either the response or oldData
//     const filteredData = oldData.filter(oldItem =>
//         !response.some(deletedItem => deletedItem.analyzeId === oldItem.analyzeId)
//     );
//     // Combine filtered old data with new response data
//     return [...filteredData, ...response];
// });

import { useQuery } from "@tanstack/react-query";
import { getDiseaseLocationImageRepo } from "../../infrastrucuture/repositories/analyzer-repo";

export const useGetDiseaseLocationImage = (location: string) => {
    return useQuery({
        queryKey: ['diseaseLocationImage', location],
        queryFn: () => getDiseaseLocationImageRepo(location),
        enabled: !!location,
    });
}
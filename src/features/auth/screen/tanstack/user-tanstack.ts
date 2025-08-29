import { useMutation } from "@tanstack/react-query";

import { useQueryClient } from "@tanstack/react-query";
import { disableUser } from "../../infrastructures/data_sources/remote/user-api-service";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { signOut, useSession } from "next-auth/react";

export const useUserDisable = () => {
    const queryClient = useQueryClient();
    const router = useRouter();
    const { data: session } = useSession();


    return useMutation({
        mutationFn: async () => {
            const userId = session?.user?.id;

            if (!userId) {
                throw new Error('Please try again later, Sign in again');
            }
            return await disableUser(userId);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['user'] });
            signOut({
                callbackUrl: '/overview',
            });
        },
        onError: (error) => {
            toast.error(error.message);
        },
    });
}
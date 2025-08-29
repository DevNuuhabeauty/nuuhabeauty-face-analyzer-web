// 2. Create custom hooks with TanStack Query
// hooks/useShopifyAuth.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { signIn, signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { recoverCustomerRepo, signUpRepo } from '../../infrastructures/repositories/auth-repo';

export function useShopifyAuth() {
    const { data: session, status } = useSession();
    const queryClient = useQueryClient();

    const router = useRouter();


    const loginMutation = useMutation({
        mutationFn: async ({ email, password }: { email: string; password: string }) => {
            const result = await signIn('credentials', {
                email,
                password,
                redirect: false
            });


            if (result?.error) {
                throw new Error(result.error);
            }

            return result;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['customer'] });
            toast.success('Login successful');
            router.push('/overview');
        },
        onError: (error) => {
            toast.error(error.message);
        }
    });


    const signUpMutation = useMutation({
        mutationFn: async ({ email, password }: { email: string; password: string }) => {
            const result = await signUpRepo(email, password);
            return result;
        },
        onSuccess: () => {
            toast.success('Sign up successful, Please login to your account', {
                duration: 10000,
            });
            router.push('/overview');
        },
        onError: (error) => {
            const message = error.message;
            if (message.includes("We have sent an email to")) {
                toast.success(message, {
                    duration: 10000,
                });
            } else {
                toast.error(message);
            }
        }
    });


    const logoutMutation = useMutation({
        mutationFn: async () => {
            await signOut({ redirect: false });
        },
        onSuccess: () => {
            queryClient.clear();
        }
    });

    const recoverCustomerMutation = useMutation({
        mutationFn: async (email: string) => {



            await recoverCustomerRepo(email);
        },
        onSuccess: () => {
            toast.success('Customer recovered successfully, Please check your email for the recovery link', {
                duration: 10000,

            });
        },
        onError: (error) => {
            toast.error(error.message);
        }
    });

    return {
        loginMutation: loginMutation,
        logoutMutation: logoutMutation,
        signUpMutation: signUpMutation,
        recoverCustomerMutation: recoverCustomerMutation
    };
}
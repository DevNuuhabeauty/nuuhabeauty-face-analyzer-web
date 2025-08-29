import { NEXTAUTH_SECRET } from "@/src/core/constant";
import { UserEntity } from "@/src/features/auth/entities/user-entity";
import { getCustomerProfile } from "@/src/features/auth/infrastructures/data_sources/remote/auth-api-service";
import { getCustomerProfileRepo, signInRepo } from "@/src/features/auth/infrastructures/repositories/auth-repo";
import { getUserByEmailRepo } from "@/src/features/auth/infrastructures/repositories/user-repo";
import NextAuth, { NextAuthOptions, getServerSession } from "next-auth";
import { JWT } from "next-auth/jwt";
import CredentialsProvider from "next-auth/providers/credentials";

// Extend the User type to include accessToken
declare module "next-auth" {
    interface User {
        accessToken: string;
        expiresAt: string;
        user: UserEntity;

    }
    interface Session {
        accessToken: string;
        expiresAt: string;
        user: UserEntity;

    }
}

const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: 'Shopify',
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials): Promise<any> {
                if (!credentials?.email || !credentials?.password) return null;

                try {

                    const response = await signInRepo(credentials.email, credentials.password);
                    if (response.customerUserErrors.length > 0) {
                        throw new Error(response.customerUserErrors[0].message);
                    }

                    console.log('response', response);

                    const customerProfile = await getCustomerProfileRepo(response.accessToken);

                    const user = await getUserByEmailRepo(credentials.email, response.accessToken, customerProfile.shopify_id);


                    console.log('user', user);

                    if (!user) {
                        throw new Error('User not found');
                    }

                    return {
                        accessToken: response.accessToken,
                        expiresAt: response.expiresAt,
                        user: {
                            ...user,
                            first_name: customerProfile.first_name,
                            last_name: customerProfile.last_name
                        }
                    }
                } catch (error: any) {
                    if (error.message === 'Request failed with status code 401') {
                        throw new Error('Invalid credentials or account disabled, Please try again later and Contact support if the issue persists');
                    }
                    console.error('Auth error:', error);
                    throw new Error(error.message);
                }
            }
        })
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                // Properly merge user data into token
                return {
                    ...token,
                    accessToken: user.accessToken,
                    expiresAt: user.expiresAt,
                    user: user.user
                };
            }
            return token;
        },
        async session({ session, token }: { session: any, token: any }) {
            // Properly set session data from token
            session.accessToken = token.accessToken;
            session.expiresAt = token.expiresAt;
            session.user = token.user;
            return session;
        }
    },
    secret: NEXTAUTH_SECRET,
    pages: {
        signIn: '/sign-in',
        signOut: '/sign-in'
    },
    session: {
        strategy: 'jwt'
    }
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST }
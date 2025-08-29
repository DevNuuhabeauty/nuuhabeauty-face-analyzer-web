export interface ResponseSignInEntity {
    accessToken: string;
    expiresAt: string;
    customerUserErrors: {
        code: string;
        message: string;
    }[];
}
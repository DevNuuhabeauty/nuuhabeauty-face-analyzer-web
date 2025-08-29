import { ResponseSignInEntity } from "../../entities/auth-entity";
import { UserEntity } from "../../entities/user-entity";
import { getCustomerProfile, recoverCustomer, signIn, signUp } from "../data_sources/remote/auth-api-service";
import { getUserByEmailRepo } from "./user-repo";

export const signInRepo = async (email: string, password: string): Promise<ResponseSignInEntity> => {
    try {
        const response = await signIn(email, password);
        return response;
    } catch (error) {
        throw error;
    }
}


export const recoverCustomerRepo = async (email: string,): Promise<void> => {
    try {
        const response = await recoverCustomer({ email });
        return response;
    } catch (error) {
        throw error;
    }
}

export const getCustomerProfileRepo = async (accessToken: string): Promise<UserEntity> => {
    try {
        const response = await getCustomerProfile(accessToken);
        return response;
    } catch (error) {
        throw error;
    }
}

export const signUpRepo = async (email: string, password: string): Promise<UserEntity> => {
    try {
        const response = await signUp(email, password);
        return response;
    } catch (error) {
        throw error;
    }
}
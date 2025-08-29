import { SERVER_API_URL } from "@/src/core/constant";
import axios, { AxiosError } from "axios";
import { UserEntity } from "../../../entities/user-entity";
import { getCustomerProfile } from "./auth-api-service";

export const getUserByEmail = async (email: string, accessToken: string, shopifyId?: string): Promise<UserEntity> => {
    try {
        const response = await axios.get(`${SERVER_API_URL}/api/users/email/${email}`, {
            headers: {
                'Content-Type': 'application/json',
            },
            params: {
                shopify_id: shopifyId
            }
        });

        return response.data.data as UserEntity;
    } catch (e: any) {

        throw new Error(e.message);
    }
}

const createUser = async (user: UserEntity): Promise<UserEntity> => {
    try {
        const response = await axios.post(`${SERVER_API_URL}/api/users`, user);

        if (response.status !== 201) {
            throw new Error('Failed to create user with status code ' + response.status);
        }

        return response.data.data as UserEntity;
    } catch (e) {
        throw new Error('Failed to create user');
    }
}

export const disableUser = async (userId: string): Promise<UserEntity> => {
    try {
        const response = await axios.patch(`${SERVER_API_URL}/api/users/delete-account/${userId}`);

        if (response.status !== 200) {
            throw new Error('Failed to disable user with status code ' + response.status);
        }
        return response.data.data as UserEntity;
    } catch (e) {
        throw new Error('Failed to disable user');
    }
}
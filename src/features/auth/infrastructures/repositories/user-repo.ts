import { UserEntity } from "../../entities/user-entity";
import { getUserByEmail } from "../data_sources/remote/user-api-service";

export const getUserByEmailRepo = async (email: string, accessToken: string, shopifyId?: string): Promise<UserEntity> => {
    try {
        const response = await getUserByEmail(email, accessToken, shopifyId);
        return response;
    } catch (error) {
        throw error;
    }
}

export const createUserRepo = async (user: UserEntity): Promise<UserEntity> => {
    try {
        const response = await createUserRepo(user);
        return response;
    } catch (error) {
        throw error;
    }
}
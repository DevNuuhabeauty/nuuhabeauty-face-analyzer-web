import axios, { AxiosError } from "axios";
import { SHOPIFY_STORE_URL, SHOPIFY_ACCESS_TOKEN, SERVER_API_URL } from "@/src/core/constant";
import { ResponseSignInEntity } from "@/src/features/auth/entities/auth-entity";
import { UserEntity } from "../../../entities/user-entity";


export const signIn = async (email: string, password: string): Promise<ResponseSignInEntity> => {
    try {
        const response = await axios.post(
            `${SHOPIFY_STORE_URL}/api/graphql`,
            {
                query: `
                    mutation customerLogin($email: String!, $password: String!) {
                        customerAccessTokenCreate(input: {
                            email: $email,
                            password: $password
                        }) {
                            customerAccessToken {
                                accessToken
                                expiresAt
                            }
                            customerUserErrors {
                                code
                                message
                            }
                        }
                    }
                `,
                variables: {
                    email,
                    password
                }
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'X-Shopify-Storefront-Access-Token': SHOPIFY_ACCESS_TOKEN
                }
            }
        );


        if (response.data.errors) {
            throw new Error(response.data.errors[0].message);
        }

        if (response.status !== 200) {
            throw new Error('Wrong email or password');
        }

        if (response.data.data.customerAccessTokenCreate.customerAccessToken === null) {
            throw new Error('Wrong email or password');
        }

        const { customerAccessToken, customerUserErrors } = response.data.data.customerAccessTokenCreate;

        return {
            accessToken: customerAccessToken?.accessToken,
            expiresAt: customerAccessToken?.expiresAt,
            customerUserErrors: customerUserErrors
        };
    } catch (e: any) {
        throw new Error(e.message);
    }
}


export const getCustomerProfile = async (accessToken: string): Promise<UserEntity> => {
    try {
        const response = await axios.post(`${SHOPIFY_STORE_URL}/api/graphql`, {
            query: `
                query { customer(customerAccessToken: "${accessToken}") { id firstName lastName acceptsMarketing email phone } }
            `
        }, {
            headers: {
                'Content-Type': 'application/json',
                'X-Shopify-Storefront-Access-Token': SHOPIFY_ACCESS_TOKEN
            }
        });

        if (response.status !== 200) {
            throw new Error('Failed to get customer profile with status code ' + response.status);
        }


        const { id, firstName, lastName, acceptsMarketing, email, phone } = response.data.data.customer;

        const user: UserEntity = {
            shopify_id: id,
            email: email,
            created_at: '',
            updated_at: '',
            id: '',
            first_name: firstName,
            last_name: lastName,
        }

        return user;
    } catch (e: any) {
        console.log('e', e);
        throw new Error(e.message);
    }
}

export const signUp = async (email: string, password: string): Promise<UserEntity> => {
    try {
        const response = await axios.post(`${SERVER_API_URL}/api/users`, { email, password });

        if (response.status !== 201) {
            throw new Error('Failed to sign up with status code ' + response.status);
        }

        return response.data.data as UserEntity;
    } catch (e: any) {
        throw new Error(e.response.data.message);
    }
}



// response
// :
// config
// :
// { transitional: {… }, adapter: Array(3), transformRequest: Array(1), transformResponse: Array(1), timeout: 0, … }
// data
// :
// error
// :
// "Bad Request"
// message
// :
// "User already exists"
// statusCode
// :
// 400
// [[Prototype]]
// :
// Object



export const recoverCustomer = async ({
    email
}: {
    email: string
}): Promise<void> => {

    try {
        const response = await axios.post(
            `${SHOPIFY_STORE_URL}/api/graphql`,
            {
                query: `
                    mutation customerRecover($email: String!) {
                        customerRecover(email: $email) {
                            customerUserErrors {
                                code
                                message
                            }
                        }
                    }
                `,
                variables: {
                    email
                }
            }
            , {
                headers: {
                    'Content-Type': 'application/json',
                    'X-Shopify-Storefront-Access-Token': SHOPIFY_ACCESS_TOKEN
                }
            },

        );

        if (response.data.errors) {
            throw new Error(response.data.errors[0].message);
        }

        if (response.status !== 200) {
            throw new Error('Failed to recover customer');
        }

        if (response.data.data.customerRecover.customerUserErrors.length > 0) {
            throw new Error(response.data.data.customerRecover.customerUserErrors[0].message);
        }

        console.log('Successfully recovered customer');
    } catch (e: any) {
        throw new Error(e.message);
    }

}

// { "data": { "customerRecover": { "customerUserErrors": [{ "field": ["email"], "message": "Could not find customer" }], "userErrors": [{ "field": ["email"], "message": "Could not find customer" }] } } }


// {
//     "query": "mutation customerRecover($email: String!) { customerRecover(email: $email) { customerUserErrors { field message } userErrors { field message } } }",
//         "variables": {
//         "email": "211604@student.upm.edu.my"
//     }
// }



// https://nuuhabeauty.com/api/graphql

// mutation customerLogin($email: String!, $password: String!) {
//     customerAccessTokenCreate(input: {
//         email: $email,
//         password: $password
//     }) {
//     customerAccessToken {
//             accessToken
//             expiresAt
//         }
//     customerUserErrors {
//             code
//             message
//         }
//     }
// }


// {
//     "query": "query getProducts($first : Int) {products(first: $first) {edges{cursor node {id, title, handle, updatedAt}}}}",
//         "variables": {
//         "first": 10
//     }
// }



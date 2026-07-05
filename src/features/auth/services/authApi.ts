import type { LoginInput, RegisterInput } from "../types/auth";
import { apiClient, authClient } from "../../../api/apiClient";


export const authApi = {

    login : async (data: LoginInput) => {
        const response = await apiClient.post('/auth/login', data)

        console.log(response.data)

        return response.data;
    },
    register : async (data: RegisterInput) => {
        const response = await apiClient.post('/auth/register', data)
        return response.data
    },

    refreshToken : async (refreshToken: string) => {
        const response = await authClient.post('/auth/refresh', { refreshToken })
        return response.data
    }
};
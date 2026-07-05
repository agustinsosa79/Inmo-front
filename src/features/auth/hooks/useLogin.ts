import { useNavigate } from "react-router";
import { useAsync } from "../../../hooks/useAsync";
import { useAuthStore } from "../../../store/useAuthStore";
import { authApi } from "../services/authApi";
import type { LoginInput } from "../types/auth";

export const useLogin = () => {

    const { run, loading, error, clearError } = useAsync();
    const setAuth = useAuthStore((state) => state.setAuth)
    const navigate = useNavigate()


    const loginUser = async (data: LoginInput) => {
    const responseData = await run(() => authApi.login(data));

    if (
        responseData &&
        responseData.accessToken &&
        responseData.refreshToken &&
        responseData.user
    ) {
        setAuth(
            responseData.user,
            responseData.accessToken,
            responseData.refreshToken
        );

        navigate("/dashboard");
    }
}

    return {loginUser, error, loading, clearError}
}
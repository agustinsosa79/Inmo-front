import { useNavigate } from "react-router"
import { useAsync } from "../../../hooks/useAsync"
import { useAuthStore } from "../../../store/useAuthStore"
import { authApi } from "../services/authApi"
import type { RegisterInput } from "../types/auth"


export const useRegister = () => {
    const {error, run, loading} = useAsync()
    const setAuth = useAuthStore((state) => state.setAuth)
    const navigate = useNavigate()


    const registerUser = async (data: RegisterInput) => {
        try {
            // Ejecutamos la petición de manera normal
            const responseData = await run(() => authApi.register(data))

            console.log("Respuesta Exitosa del Servidor:", responseData);
            
            if (responseData) {
                setAuth(responseData.user, responseData.access_token, responseData.refreshToken)
                 navigate("/login"); // 👈 ACÁ LA REDIRECCIÓN
            }
        } catch (err: unknown) {
                // ACÁ LE EXPRIMIMOS EL ERROR REAL A AXIOS
                console.error("ERROR 400 DETALLADO DESDE EL BACKEND:");
                const axiosErr = err as { response?: { data?: unknown } };
                console.log(axiosErr.response?.data);
                // Esto te va a imprimir el array exacto de NestJS diciéndote qué campo falta
            }
    }


    return {registerUser, error, loading}
}
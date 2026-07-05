import { useCallback, useState } from "react";



export const useAsync = () => {
const [loading, setLoading] = useState(false);
const [error, setError] = useState<string | null>(null);


    const run = useCallback(async <T>(asyncFunction: () => Promise<T>): Promise<T | undefined> => {
        setLoading(true);
        setError(null);


        try {
            const result = await asyncFunction();
            return result;
        } catch (err: unknown) {
  const axiosErr = err as {
    response?: { data?: { message?: string; error?: string } | string };
    message?: string;
  };

  const backendMessage =
    (typeof axiosErr?.response?.data === "object" && axiosErr.response.data !== null
      ? axiosErr.response.data.message || axiosErr.response.data.error
      : undefined) ||
    axiosErr?.message ||
    "An error occurred";

  setError(
    Array.isArray(backendMessage)
      ? backendMessage.join(", ")
      : backendMessage
  );

  return undefined;

        } finally {
            setLoading(false);
        }
    }, [])

    const clearError = () => {
      setError(null)
    }


    return { loading, error, run, clearError };
}
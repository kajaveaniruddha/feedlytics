import axios, { AxiosError } from "axios";

export const apiClient = axios.create({
  headers: {
    "Content-Type": "application/json",
  },
});

// Response interceptor for consistent error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<{ message?: string; success?: boolean }>) => {
    const message =
      error.response?.data?.message ||
      error.message ||
      "An unexpected error occurred";
    return Promise.reject(new Error(message));
  }
);

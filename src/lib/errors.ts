import axios from "axios";

interface ApiErrorBody {
  error?: string;
}

export const getErrorMessage = (
  error: unknown,
  fallback = "Something went wrong. Please try again.",
): string => {
  if (axios.isAxiosError(error)) {
    const body = error.response?.data as ApiErrorBody | undefined;
    if (body?.error) return body.error;
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  return fallback;
};
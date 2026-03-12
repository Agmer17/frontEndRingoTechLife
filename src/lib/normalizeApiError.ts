import { AxiosError } from "axios";
import { type ApiError  } from "../types/api";

export const normalizeApiError = (error: unknown): ApiError => {
  const axiosError = error as AxiosError<any>;

  if (!axiosError.response) {
    return {
      type: "general",
      message: "Network error",
      status: 500,
    };
  }

  const { status, data } = axiosError.response;

  if (typeof data.error === "string") {
    return {
      type: "general",
      message: data.error,
      status,
    };
  }

  if (typeof data.error === "object") {
    return {
      type: "validation",
      fieldErrors: data.error,
      status,
    };
  }

  return {
    type: "general",
    message: "Unexpected error",
    status,
  };
};
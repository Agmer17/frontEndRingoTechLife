export interface GeneralApiError {
  type: "general";
  message: string;
  status: number;
}

export interface ValidationApiError {
  type: "validation";
  fieldErrors: Record<string, string>;
  status: number;
}

export interface SuccessResponse {
  message: string,
  data: Object,
}

export interface SuccessResponseToUi {
  message: string,
  data: Object,
  success: boolean
}

export type ApiError = GeneralApiError | ValidationApiError; 
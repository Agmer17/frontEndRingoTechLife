// src/hooks/useLogin.ts

import { useDispatch } from "react-redux";
import { setCredentials } from "./../../store/slieces/authslice";
import axiosInstance from "../../lib/axios";
import { handleApiError } from "../../utils/errorUtils";
export const useLogin = () => {
  const dispatch = useDispatch();

  const login = async (emailOrPhone: string, password: string) => {
    try {
      const response = await axiosInstance.post("/auth/login", {
        email_or_phone: emailOrPhone,
        password: password,
      });

      const { message, data } = response.data;
      dispatch(
        setCredentials({
          accessToken: data.access_token,
          id: data.id,
          role: data.role,
        })
      );


      return { success: true as const, message: message };
    } catch (error: any) {
      return handleApiError(error)

    }
  };

  return { login };
};
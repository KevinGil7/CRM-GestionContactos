import api from "@app/lib/Api";
import { ErrorResponse } from "react-router-dom";
import { ForgotPasswordRequest } from "../types/ForgotPasswordRequest";
import { VerifyCodeRequest } from "../types/VerifyCodeRequest";
import { ResetPasswordRequest } from "../types/ResetPasswordRequest";

export interface ServiceResponse<T> {
    success: boolean;
    data?: T;
    error?: ErrorResponse;
  }

  export const forgotPassword = async (email: ForgotPasswordRequest): Promise<ServiceResponse<boolean>> => {
    try {
        const { data } = await api.post<boolean>(`/PasswordRecovery/forgot-password`, email);

        return {
            success: true,
            data: data
        };
    }
    catch (error) {
        return {
            success: false,
            error: error as ErrorResponse
        };
    }
  }

  export const verifyCode = async (email: VerifyCodeRequest): Promise<ServiceResponse<boolean>> => {
    try {
        const { data } = await api.post<boolean>(`/PasswordRecovery/verify-code`, email);
        return {
            success: true,
            data: data
        };
    }
    catch (error) {
        return {
            success: false,
            error: error as ErrorResponse
        };
    }
  }

  export const resetPassword = async (email: ResetPasswordRequest): Promise<ServiceResponse<boolean>> => {
    try {
        const { data } = await api.post<boolean>(`/PasswordRecovery/reset-password`, email);
        return {
            success: true,
            data: data
        };
    } catch (error) {
        return {
            success: false,
            error: error as ErrorResponse
        };
    }
  
  }
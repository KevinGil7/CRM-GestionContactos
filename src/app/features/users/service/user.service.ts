import { ErrorResponse } from "react-router-dom";
import { User } from "../types/user";
import api from "@app/lib/Api";
import { RegisterUser, RegisterUserResponse, UpdateUser } from "../types/register";
import { Role } from "../types/role";

export interface ServiceResponse<T> {
    success: boolean;
    data?: T;
    error?: ErrorResponse;
  }

  export const getAllUsers = async (): Promise<ServiceResponse<User[]>> => {
    try {
        const { data } = await api.get<User[]>(`/auth/Users`);
        return {
            success: true,
            data: data as User[]
        };
    }
    catch (error) {
        return {
            success: false,
            error: error as ErrorResponse
        };
    }
  }

  export const getUserById = async (id: string): Promise<ServiceResponse<User>> => {
    try {
        const { data } = await api.get<User>(`/auth/Users/${id}`);
        return {
            success: true,
            data: data as User
        };
    }
    catch (error) {
        return {
            success: false,
            error: error as ErrorResponse
        };
    }
  }


  export const registerUser = async (user: RegisterUser): Promise<ServiceResponse<RegisterUserResponse>> => {
    try {
        const { data } = await api.post<RegisterUserResponse>(`/auth/register`, user);
        return {
            success: true,
            data: data as RegisterUserResponse
        };
    }
    catch (error) {
        return {
            success: false,
            error: error as ErrorResponse
        };
    }
  }

  export const GetAllRoles = async (): Promise<ServiceResponse<Role[]>> => {
    try {
        const { data } = await api.get<Role[]>(`/auth/Roles`);
        return {
            success: true,
            data: data as Role[]
        };
    }
    catch (error) {
        return {
            success: false,
            error: error as ErrorResponse
        };
    }
  }

  export const UpdateUsers = async (id: string, user: UpdateUser): Promise<ServiceResponse<User>> => {
    try {
        const { data } = await api.put<User>(`/auth/Users/${id}`, user);
        return {
            success: true,
            data: data as User
        };
    }
    catch (error) {
        return {
            success: false,
            error: error as ErrorResponse
        };
    }
  }

  export const DeleteUser = async (id: string): Promise<ServiceResponse<boolean>> => {
    try {
        const { data } = await api.delete<boolean>(`/auth/Users/${id}`);
        return {
            success: true,
            data: data as boolean
        };
    }
    catch (error) {
        return {
            success: false,
            error: error as ErrorResponse
        };
    }
  }
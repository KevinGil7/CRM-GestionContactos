import { ErrorResponse } from "react-router-dom";
import { interaccionAll } from "../types/interaccionAll";
import api from "@app/lib/Api";
import { interaccion } from "../types/interaccion";
import { createInteracion, updateInteracion } from "../types/createInteracion";

export interface ServiceResponse<T> {
    success: boolean;
    data?: T;
    error?: ErrorResponse;
  }

  export const getInteracionAll = async (): Promise<ServiceResponse<interaccionAll[]>> => {
    try {
        const { data } = await api.get<interaccionAll[]>(`/Interacion`);
        
        return {
            success: true,
            data: data
        };
    } catch (error) {
        // El error ya viene estructurado desde el interceptor
        return {
            success: false,
            error: error as ErrorResponse
        };
    }
};

export const getInteracionById = async (IdInteraccion: string): Promise<ServiceResponse<interaccion>> => {
    try {
        const { data } = await api.get<interaccion>(`/Interacion/${IdInteraccion}`);
        
        return {
            success: true,
            data: data
        };
    } catch (error) {
        // El error ya viene estructurado desde el interceptor
        return {
            success: false,
            error: error as ErrorResponse
        };
    }
};

export const getInteracionByIdContacto = async (IdContacto: string): Promise<ServiceResponse<interaccion>> => {
    try {
        const { data } = await api.get<interaccion>(`/Interacion/${IdContacto}`);
        
        return {
            success: true,
            data: data
        };
    } catch (error) {
        // El error ya viene estructurado desde el interceptor
        return {
            success: false,
            error: error as ErrorResponse
        };
    }
};

export const createInteracionContacto = async (Interaccion: createInteracion): Promise<ServiceResponse<interaccion>> => {
    try {
        const { data } = await api.post<interaccion>(`/Interacion`, Interaccion);
        
        return {
            success: true,
            data: data
        };
    } catch (error) {
        // El error ya viene estructurado desde el interceptor
        return {
            success: false,
            error: error as ErrorResponse
        };
    }
};

export const updateInteracionContacto = async (IdInteraccion: string, Interaccion: updateInteracion): Promise<ServiceResponse<interaccion>> => {
    try {
        const { data } = await api.put<interaccion>(`/Interacion/${IdInteraccion}`, Interaccion);
        
        return {
            success: true,
            data: data
        };
    } catch (error) {
        // El error ya viene estructurado desde el interceptor
        return {
            success: false,
            error: error as ErrorResponse
        };
    }
};  

export const deleteInteracionContacto = async (IdInteraccion: string): Promise<ServiceResponse<interaccion>> => {
    try {
        const { data } = await api.delete<interaccion>(`/Interacion/${IdInteraccion}`);
        
        return {
            success: true,
            data: data
        };
    } catch (error) {
        // El error ya viene estructurado desde el interceptor
        return {
            success: false,
            error: error as ErrorResponse
        };
    }
};
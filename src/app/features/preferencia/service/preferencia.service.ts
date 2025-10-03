import { PerfilSocialAll } from "@app/features/perfilessocial/types/perfilsocialAll";
import api, { ErrorResponse } from "../../../lib/Api";
import { preferencia } from "../types/preferencia";
import { preferenciaAll } from "../types/preferenciaAll";
import { createPreferencia, updatePreferencia } from "../types/createPreferencia";

export interface ServiceResponse<T> {
    success: boolean;
    data?: T;
    error?: ErrorResponse;
  }

  export const getPreferenciasAll = async (): Promise<ServiceResponse<preferenciaAll[]>> => {
    try {
        const { data } = await api.get<preferenciaAll[]>(`/Preferencia`);
        
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

export const getPreferenciab = async (IdContacto: string): Promise<ServiceResponse<preferencia>> => {
    try {
        const { data } = await api.get<preferencia>(`/Preferencia/${IdContacto}`);
        
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

export const PostPerfilContacto = async (CreatePreferencia: createPreferencia): Promise<ServiceResponse<preferencia>> => {
    try {
        const { data } = await api.post<preferencia>(`/Preferencia`, CreatePreferencia);
        
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

export const UpdatePerfilContacto = async (Idpreferencia: string, UpdatePreferencia: updatePreferencia): Promise<ServiceResponse<preferencia>> => {
    try {
        const { data } = await api.put<preferencia>(`/Preferencia/${Idpreferencia}`, UpdatePreferencia);
        
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

export const DeletePerfilContacto = async (Idpreferencia: string): Promise<ServiceResponse<preferencia>> => {
    try {
        const { data } = await api.delete<preferencia>(`/Preferencia/${Idpreferencia}`);
        
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
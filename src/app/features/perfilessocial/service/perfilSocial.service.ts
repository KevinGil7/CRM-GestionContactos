import api, { ErrorResponse } from "../../../lib/Api";
import { CreatePerfilSocial, UpdatePerfilSocial } from "../types/createPerfilSocial";
import { PerfilSocial } from "../types/perfilsocial";
import { PerfilSocialAll } from "../types/perfilsocialAll";





export interface ServiceResponse<T> {
    success: boolean;
    data?: T;
    error?: ErrorResponse;
  }


export const getPerfilContacto = async (IdContacto: string): Promise<ServiceResponse<PerfilSocialAll[]>> => {
    try {
        const { data } = await api.get<PerfilSocialAll[]>(`/PerfilSocial/${IdContacto}`);
        
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

export const PostPerfilContacto = async (CreatePerfilSocial: CreatePerfilSocial): Promise<ServiceResponse<PerfilSocial>> => {
    try {
        const { data } = await api.post<PerfilSocial>(`/PerfilSocial`, CreatePerfilSocial);
        
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

export const UpdatePerfilContacto = async (IdPerfilSocial: string, UpdatePerfilSocial: UpdatePerfilSocial): Promise<ServiceResponse<PerfilSocial>> => {
    try {
        const { data } = await api.put<PerfilSocial>(`/PerfilSocial/${IdPerfilSocial}`, UpdatePerfilSocial);
        
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

export const DeletePerfilContacto = async (IdPerfilSocial: string): Promise<ServiceResponse<PerfilSocial>> => {
    try {
        const { data } = await api.delete<PerfilSocial>(`/PerfilSocial/${IdPerfilSocial}`);
        
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

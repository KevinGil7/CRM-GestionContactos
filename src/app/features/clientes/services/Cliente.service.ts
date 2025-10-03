import api, { ErrorResponse } from "../../../lib/Api";
import { ClienteEmpresa } from "../types/ClienteEmpresa";
import { ClienteBy } from "../types/ClienteBy";
import { CreateCliente, UpdateCliente } from "../types/CreateCliente";
import { ClienteCompleto } from "../types/ClienteCompleto";

// Interfaz para respuestas del servicio
export interface ServiceResponse<T> {
  success: boolean;
  data?: T;
  error?: ErrorResponse;
}

export const getClientes = async (): Promise<ServiceResponse<ClienteEmpresa[]>> => {
    try {
        const { data } = await api.get<ClienteEmpresa[]>(`/Cliente`);
        
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

export const getClienteById = async (IdCliente: string): Promise<ServiceResponse<ClienteBy>> => {
    try {
        const { data } = await api.get<ClienteBy>(`/Cliente/${IdCliente}`);
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
};

export const createCliente = async (cliente: CreateCliente): Promise<ServiceResponse<ClienteEmpresa>> => {
    try {
        const { data } = await api.post<ClienteEmpresa>(`/Cliente`, cliente);
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
};

export const updateCliente = async ( cliente: Partial<UpdateCliente>): Promise<ServiceResponse<ClienteCompleto>> => {
    try {
        const { data } = await api.put<ClienteCompleto>(`/Cliente`, cliente);
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
};

export const deleteCliente = async (id: string): Promise<ServiceResponse<ClienteEmpresa>> => {
    try {
        const { data } = await api.delete(`/Cliente/${id}`);
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
};
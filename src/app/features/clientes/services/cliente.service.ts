import { ErrorResponse } from "react-router-dom";
import { Cliente } from "../types/cliente";
import api from "@app/lib/Api";
import { CreateCliente, UpdateCliente } from "../types/createCliente";

export interface ServiceResponse<T> {
    success: boolean;
    data?: T;
    error?: ErrorResponse;
  }

  export const getclientesAll = async (): Promise<ServiceResponse<Cliente[]>> => {
    try {
        const { data } = await api.get<Cliente[]>(`/Cliente`);
        return {
            success: true,
            data: data as Cliente[]
        };
    } catch (error) {
        return {
            success: false,
            error: error as ErrorResponse
        };
    }
};

export const getClienteById = async (id: string): Promise<ServiceResponse<Cliente>> => {
    try {
        const  {data}  = await api.get<Cliente>(`/Cliente/${id}`);
        return {
            success: true,
            data: data as Cliente
        };
    } catch (error) {
        return {
            success: false,
            error: error as ErrorResponse
        };
    }
}

export const createCliente = async (cliente: CreateCliente): Promise<ServiceResponse<Cliente>> => {
    try {
        const { data } = await api.post<Cliente>(`/Cliente`, cliente);
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

export const updateCliente = async (IdCliente: string, cliente: UpdateCliente): Promise<ServiceResponse<Cliente>> => {
    try {
        const { data } = await api.put<Cliente>(`/Cliente/${IdCliente}`, cliente);
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

export const deleteCliente = async (IdCliente: string): Promise<ServiceResponse<Cliente>> => {
    try {
        const { data } = await api.delete<Cliente>(`/Cliente/${IdCliente}`);
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
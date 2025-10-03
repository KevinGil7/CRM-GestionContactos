import api, { ErrorResponse } from "../../../lib/Api";
import { ContactoBy } from "../types/ContactoBy";
import { CreateContacto, UpdateContacto } from "../types/CreateContacto";
import { Contacto } from "../types/Contacto";
import { ContactoCompleto } from "../types/ContactoCompleto";

// Interfaz para respuestas del servicio
export interface ServiceResponse<T> {
  success: boolean;
  data?: T;
  error?: ErrorResponse;
}

export const getContactos = async (): Promise<ServiceResponse<Contacto[]>> => {
    try {
        const { data } = await api.get<Contacto[]>(`/Contacto`);
        
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

export const getContactoById = async (IdContacto: string): Promise<ServiceResponse<ContactoBy>> => {
    try {
        const { data } = await api.get<ContactoBy>(`/Contacto/${IdContacto}`);
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

export const createContacto = async (contacto: CreateContacto): Promise<ServiceResponse<Contacto>> => {
    try {
        const { data } = await api.post<Contacto>(`/Contacto`, contacto);
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

export const updateContacto = async ( contacto: Partial<UpdateContacto>): Promise<ServiceResponse<ContactoCompleto>> => {
    try {
        const { data } = await api.put<ContactoCompleto>(`/Contacto`, contacto);
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

export const deleteContacto = async (id: string): Promise<ServiceResponse<Contacto>> => {
    try {
        const { data } = await api.delete(`/Contacto/${id}`);
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
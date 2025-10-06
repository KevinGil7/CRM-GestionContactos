import { ErrorResponse } from "react-router-dom";
import { Calendary } from "../types/calendary";
import api from "@app/lib/Api";


export interface ServiceResponse<T> {
    success: boolean;
    data?: T;
    error?: ErrorResponse;
  }

  export const getCalendarioAll = async (): Promise<ServiceResponse<Calendary[]>> => {
    try {
        const { data } = await api.get<Calendary[]>(`/Contacto/Calendario`);
        
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
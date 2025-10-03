import api, { ErrorResponse } from "../../../lib/Api";
import { CreateProveedor } from "../types/CreateProveedor";
import { Proveedor } from "../types/Proveedor";
import { ProveedorBy } from "../types/ProveedorBy";

export interface ServiceResponse<T> {
    success: boolean;
    data?: T;
    error?: ErrorResponse;
  }
  
  export const getProveedores = async (): Promise<ServiceResponse<Proveedor[]>> => {
      try {
          const { data } = await api.get<Proveedor[]>(`/Proveedor`);
          return {
              success: true,
              data: data as Proveedor[]
          };
      } catch (error) {
          return {
              success: false,
              error: error as ErrorResponse
          };
      }
  };

  export const getProveedorBy = async (IdProveedor: string): Promise<ServiceResponse<ProveedorBy>> => {
      try {
          const  {data}  = await api.get<ProveedorBy>(`/Proveedor/${IdProveedor}`);
          return {
              success: true,
              data: data as ProveedorBy
          };
      } catch (error) {
          return {
              success: false,
              error: error as ErrorResponse
          };
      }
  };

  export const createProveedor = async (proveedor: CreateProveedor): Promise<ServiceResponse<Proveedor>> => {
    try {
        const { data } = await api.post<Proveedor>(`/Proveedor`, proveedor);
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

export const updateProveedor = async ( IdProveedor: string, proveedor: CreateProveedor): Promise<ServiceResponse<Proveedor>> => {
   console.log(proveedor);
    try {
        const { data } = await api.put<Proveedor>(`/Proveedor/${IdProveedor}`, proveedor);
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

export const deleteProveedor = async (idProveedor: string): Promise<ServiceResponse<Proveedor>> => {
    try {
        const { data } = await api.delete(`/Proveedor/${idProveedor}`);
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
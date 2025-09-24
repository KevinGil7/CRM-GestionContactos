import api, { ErrorResponse } from "../../../lib/Api";
import { CreateEmpresa } from "../types/CreateEmpresa";
import { Empresa } from "../types/Empresa";
import { EmpresaBy } from "../types/EmpresaBy";

export interface ServiceResponse<T> {
    success: boolean;
    data?: T;
    error?: ErrorResponse;
  }
  
  export const getEmpresas = async (): Promise<ServiceResponse<Empresa[]>> => {
      try {
          const { data } = await api.get<Empresa[]>(`/Empresa`);
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

  export const getEmpresaBy = async (IdEmpresa: string): Promise<ServiceResponse<EmpresaBy>> => {
      try {
          const  {data}  = await api.get<EmpresaBy>(`/Empresa/${IdEmpresa}`);
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

  export const createEmpresa = async (empresa: CreateEmpresa): Promise<ServiceResponse<Empresa>> => {
    try {
        const { data } = await api.post<Empresa>(`/Empresa`, empresa);
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

export const updateEmpresa = async ( IdEmpresa: string, empresa: CreateEmpresa): Promise<ServiceResponse<Empresa>> => {
   console.log(empresa);
    try {
        const { data } = await api.put<Empresa>(`/Empresa/${IdEmpresa}`, empresa);
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

export const deleteEmpresa = async (id: string): Promise<ServiceResponse<Empresa>> => {
    try {
        const { data } = await api.delete(`/Empresa/${id}`);
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
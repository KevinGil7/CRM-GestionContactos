import { EmpresaBy } from "@app/features/empresas/types/ProveedorBy";

export interface ClienteBy{
    id : string;
     primerNombre: string;
     segundoNombre: string;
     primerApellido: string;
     segundoApellido: string;
     dpi : number;
     nit : number;
     telefono: string;
     correo: string;
     estado:boolean;
     direccion: string;
     empresaId : EmpresaBy
}
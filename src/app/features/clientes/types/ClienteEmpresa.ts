import { EmpresaC } from "app/features/empresas/types/EmpresaC";

export interface ClienteEmpresa{
     id : string;
     name : string;
     dpi : number;
     nit : number;
     direccion : string;
     telefono : string;
     correo :string;
     estado : boolean;
     EmpresaDto: EmpresaC
}
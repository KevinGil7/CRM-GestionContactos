import { EmpresaC } from "@app/features/empresas/types/ProveedorC";

export interface ClienteCompleto{
    id : string;
    primerNombre: string;
    segundoNombre: string;
    primerApellido: string;
    segundoApellido: string;
     dpi : number;
     nit : number;
     direccion : string;
     telefono : string;
     correo :string;
     estado : boolean;
     EmpresaDto: EmpresaC
}
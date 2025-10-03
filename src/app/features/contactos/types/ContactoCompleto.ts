import { ProveedorC } from "@app/features/provedores/types/ProveedorC";

export interface ContactoCompleto{
    id : string;
    primerNombre: string;
    segundoNombre: string;
    primerApellido: string;
    segundoApellido: string;
     dpi : number;
     direccion : string;
     telefono : string;
     correo :string;
     estado : boolean;
     fecha_Nacimiento: Date;
     empresaDto : ProveedorC
}
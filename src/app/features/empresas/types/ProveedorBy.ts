import { Contacto } from "@app/features/clientes/types/Contacto";


export interface ProveedorBy{
    id:string;
    name :string;
     email :string;
     phone :string;
     ContactoPrincipalDto? : Contacto;
}
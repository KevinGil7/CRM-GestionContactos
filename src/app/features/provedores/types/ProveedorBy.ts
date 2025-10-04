import { Contacto } from "@app/features/contactos/types/Contacto";


export interface ProveedorBy{
    id:string;
    name :string;
     email :string;
     phone :string;
     contactoPrincipalDto? : Contacto;
}
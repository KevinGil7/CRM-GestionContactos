import { Contacto } from "@app/features/clientes/types/Contacto";

export interface Proveedor{
    id :string;
     name :string;
     email :string;
     phone :string;
     isActive :boolean;
     ContactoPrincipalDto: Contacto
}
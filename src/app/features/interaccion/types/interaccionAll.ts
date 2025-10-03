import { Contacto } from "@app/features/contactos/types/Contacto";

export interface interaccionAll{
    id : string;
    contacto : Contacto;
    usuarioId : string;
    tipo : string;
    asunto : string;
    notas : string;
    createdAt : Date;
    updatedAt : Date;
}
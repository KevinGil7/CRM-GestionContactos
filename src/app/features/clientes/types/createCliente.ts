import { CreateContacto, UpdateContacto } from "@app/features/contactos/types/CreateContacto";

export interface CreateCliente{
    contactoId? : string;
    contacto ?: CreateContacto;
    nit : number;
}

export interface UpdateCliente{
    contacto : UpdateContacto;
    nit : number;
}
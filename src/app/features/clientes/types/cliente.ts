import { Contacto } from "@app/features/contactos/types/Contacto";

export interface Cliente{
    id: string;
    fecha_Alta : Date;
    categoriaCliente : CategoriaCliente;
    nit : number;
    estado : boolean;
    contactoId :Contacto;
}

export enum CategoriaCliente
{ 
    Bronce,
    Plata,
    Oro,
    Dimante
}
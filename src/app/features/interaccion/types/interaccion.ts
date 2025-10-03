export interface interaccion{
    id : string;
    contactoId : string;
    usuarioId : string;
    tipo : string;
    asunto : string;
    notas : string;
    createdAt : Date;
    updatedAt : Date;
    isActive : boolean;
}
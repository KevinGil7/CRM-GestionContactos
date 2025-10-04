import { createPreferencia } from "@app/features/preferencia/types/createPreferencia";
import { CreatePerfilSocial } from "@app/features/perfilessocial/types/createPerfilSocial";
import { createInteracion } from "@app/features/interaccion/types/createInteracion";

export interface CreateContacto {
     primerNombre: string;
     segundoNombre: string;
     primerApellido: string;
     segundoApellido: string;
     dpi : number;
     telefono: string;
     direccion: string;
     correo: string;
     fecha_Nacimiento: string;
     preferencia ?: createPreferencia;
     perfilSocial ?: CreatePerfilSocial[];
     interacciones ?: createInteracion;
}

export interface UpdateContacto{
     id : string;
     primerNombre: string;
     segundoNombre: string;
     primerApellido: string;
     segundoApellido: string;
     dpi : number;
     telefono: string;
     direccion: string;
     correo: string;
     fecha_Nacimiento: Date;
}
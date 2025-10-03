import { interaccionAll } from "@app/features/interaccion/types/interaccionAll";
import { PerfilSocialAll } from "@app/features/perfilessocial/types/perfilsocialAll";
import { preferenciaAll } from "@app/features/preferencia/types/preferenciaAll";
import { ProveedorBy } from "@app/features/provedores/types/ProveedorBy";

export interface ContactoBy{
    id : string;
     primerNombre: string;
     segundoNombre: string;
     primerApellido: string;
     segundoApellido: string;
     dpi : number;
     telefono: string;
     correo: string;
     estado:boolean;
     direccion: string;
     fecha_Nacimiento: Date;
     proveedorId : ProveedorBy;
     preferencia : preferenciaAll;
     perfilesSociales : PerfilSocialAll[];
     interacciones : interaccionAll[];
}
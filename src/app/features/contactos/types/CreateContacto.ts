export interface CreateContacto {
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
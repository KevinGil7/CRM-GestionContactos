export interface CreateCliente {
     primerNombre: string;
     segundoNombre: string;
     primerApellido: string;
     segundoApellido: string;
     dpi : number;
     nit : number;
     telefono: string;
     direccion: string;
     correo: string;
     empresaId ? :string | null;
}

export interface UpdateCliente{
     id : string;
     primerNombre: string;
     segundoNombre: string;
     primerApellido: string;
     segundoApellido: string;
     dpi : number;
     nit : number;
     telefono: string;
     direccion: string;
     correo: string;
     empresaId?:string | null;
}
export interface RegisterUser {
    nombre : string;
    apellidos : string;
    email : string;
    username : string;
    password : string;
    rol : string;
}

export interface RegisterUserResponse {
    userId : string;
    username : string;
    email : string;
    token : string;
}

export interface UpdateUser {
    nombre : string;
    apellidos : string;
    email : string;
    username : string;
    rol: string;
}

import { Cliente } from "app/features/clientes/types/Cliente";


export interface EmpresaBy{
    id:string;
    name :string;
     email :string;
     phone :string;
     clientePrincipalDto? : Cliente;
}
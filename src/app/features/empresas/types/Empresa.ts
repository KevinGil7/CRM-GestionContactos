import { Cliente } from "@app/features/clientes/types/Cliente";

export interface Empresa{
    id :string;
     name :string;
     email :string;
     phone :string;
     isActive :boolean;
     ClientePrincipalDto: Cliente
}
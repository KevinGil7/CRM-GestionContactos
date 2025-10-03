export interface createPreferencia{
    ContactoId ?: string;
    MetodoPreferido : string;
    HorarioDe : Date;
    Horarioa : Date;
    NoContactar : boolean;
}

export interface updatePreferencia{
    MetodoPreferido : string;
    HorarioDe : Date;
    Horarioa : Date;
    NoContactar : boolean;
}
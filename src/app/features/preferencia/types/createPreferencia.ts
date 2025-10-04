// Interfaz para el frontend (usa Date)
export interface createPreferencia{
    contactoId ?: string;
    metodoPreferido : string;
    horarioDe : string ;
    horarioa : string ;
    noContactar : boolean;
}

export interface updatePreferencia{
    metodoPreferido : string;
    horarioDe : string;
    horarioa : string;
    noContactar : boolean;
}
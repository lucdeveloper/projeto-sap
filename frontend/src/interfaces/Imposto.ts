export interface ImpostoDTO {
    codigo: string,
    nome: string,
    taxa: string
}

export interface FiltrosImposto {
    codigos: string[];
    nomes: string[];
}
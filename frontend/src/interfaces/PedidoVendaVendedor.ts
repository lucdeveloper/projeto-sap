export interface PedidoVendaVendedorDTO {
    codigo: number,
    nome: string,
    observacao: string
}

export interface PedidoVendaValoresComissionaveisDTO {
    nome: string,
    porcentagemComissao: string,
    valorComissao: number
}

export interface FiltrosPedidoVendaVendedor {
    codigos: number[];
    nomes: string[];
}
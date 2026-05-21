export interface ItemPedidoVendaDTO {
    numero: string;
    descricao: string;
    quantidade: number;
    grupo: string;
}

export interface FiltrosItemPedidoVenda {
    numeros: string[];
    grupos: number[];
}
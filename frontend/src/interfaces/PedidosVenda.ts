export interface PedidosVendaDTO {
    documentoEntrada?: number;
    numeroDocumento: number;
    codigoCliente: string;
    nomeCliente: string;
    numeroReferenciaCliente: string;
    dataLancamento: Date;
    dataEntrega: Date;
    totalDocumento: number;
    status: string;
};

export interface FiltrosPedidosVenda{
    clientes: string[],
    status: string[]
}

export interface ItemPedido {
  item: string;
  quantidade: number;
  imposto: string;
  preco: number;
}

export interface PedidoVenda {
  cliente: string;
  dataEntrega: string;
  empresa: number;
  pessoaContato: number | null;
  numeroReferenciaCliente: string;
  itens: ItemPedido[];
}

export interface ItemPedidoRetornoDTO {
  linha: number;
  codigo: string;
  descricao: string;
  quantidade: number;
  imposto: string;
  preco: number;
}

export interface PedidoVendaRetornoDTO {
  documentoEntrada?: number;
  documento: string;
  codigoCliente: string;
  cliente: string;
  numeroReferenciaCliente: string;
  valorTotalPedido: number;
  dataLancamento: string;
  dataEntrega: string;
  dataDocumento: string;
  codigoPessoaContato: number;
  pessoaContato: string;
  emailContato: string;
  empresa: number;
  itens: ItemPedidoRetornoDTO[];
}

export interface ItemPedidoEdicao {
  linha?: number;
  item: string;
  quantidade: number;
  imposto: string;
  preco: number;
  excluir?: boolean
}

export interface PedidoVendaEdicao {
  pessoaContato: number | null;
  numeroReferenciaCliente: string;
  dataEntrega: string;
  itens: ItemPedidoEdicao[];
}
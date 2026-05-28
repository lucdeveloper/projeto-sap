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
    status: string[],
    documentos: number[],
}

export interface ItemPedido {
  item: string;
  quantidade: number;
  imposto: string;
  preco: number;
}

export interface AnexoPedido {
  linha?: number;
  codigo?: number;
  caminhoDestino: string;
  nomeArquivo: string;
  extensaoArquivo: string;
  tamanhoArquivo: number;
}


export interface PedidoVenda {
  cliente: string;
  dataEntrega: string;
  empresa: number;
  pessoaContato: number | null;
  numeroReferenciaCliente: string;
  itens: ItemPedido[];
  anexos: AnexoPedido[];
}

export interface ItemPedidoRetornoDTO {
  linha: number;
  codigo: string;
  descricao: string;
  quantidade: number;
  imposto: string;
  preco: number;
}

export interface ItemPedidoRetornoDTO {
  linha: number;
  codigo: string;
  descricao: string;
  quantidade: number;
  imposto: string;
  preco: number;
}

export interface AnexoPedidoRetornoDTO {
  codigo: number;
  linha: number;
  caminhoDestino: string;
  nomeArquivo: string;
  extensaoArquivo: string;
  tamanho: number;
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
  codigoAnexo?: number;
  itens: ItemPedidoRetornoDTO[];
  anexos: AnexoPedidoRetornoDTO[];
}

export interface ItemPedidoEdicao {
  linha?: number;
  item: string;
  quantidade: number;
  imposto: string;
  preco: number;
  excluir?: boolean
}

export interface AnexoPedidoEdicao {
  linha?: number;
  caminhoDestino: string;
  nomeArquivo: string;
  extensaoArquivo: string;
  tamanhoArquivo: number;
}

export interface PedidoVendaEdicao {
  pessoaContato: number | null;
  numeroReferenciaCliente: string;
  dataEntrega: string;
  codigoAnexo?: number;
  itens: ItemPedidoEdicao[];
  anexos: AnexoPedidoEdicao[];
}
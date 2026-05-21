export interface PessoaContatoDTO{
    codigoPessoaContato: number
    nome: string,
    posicao: string,
    telefone: string
}

export interface PessoaContatoFiltro{
    cliente: string,
    codigos: string[],
    nomes: string[]
}
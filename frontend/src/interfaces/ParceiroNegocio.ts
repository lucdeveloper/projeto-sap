 export interface ParceiroNegocioDTO {
    codigoCliente: string,
    nomeCliente: string,
    saldoTotal: string,
    moeda: string,
    saldo: string,
    celular: string,
    email: string,
    grupo: string,
    codigoPessoaContato: number;
    emailContato: string,
    pessoaContato: string       
}

export interface FiltrosParceiroNegocio {
    codigos: string[],
    nomes: string[]
}
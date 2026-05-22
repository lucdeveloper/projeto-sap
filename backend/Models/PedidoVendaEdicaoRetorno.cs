namespace sap.Models;

public class PedidoVendaEdicaoRetorno
{
    public int DocumentoEntrada { get; set; }
    public int Documento { get; set; }
    public string CodigoCliente { get; set; } = string.Empty;
    public string Cliente { get; set; } = string.Empty;
    public string NumeroReferenciaCliente { get; set; } = string.Empty;
    public decimal ValorTotalPedido { get; set; }
    public int? CodigoAnexo { get; set; }
    public DateTime DataEntrega { get; set; }
    public DateTime DataLancamento { get; set; }
    public DateTime DataDocumento { get; set; }
    public int? CodigoPessoaContato { get; set; }
    public string PessoaContato { get; set; } = string.Empty;
    public string EmailContato { get; set; } = string.Empty;
    public int Linha { get; set; }
    public string CodigoItem { get; set; } = string.Empty;
    public string DescricaoItem { get; set; } = string.Empty;
    public decimal Quantidade { get; set; } 
    public decimal PrecoUnitario { get; set; } 
    public decimal TotalLinha { get; set; }
    public string Imposto { get; set; } = string.Empty;
}

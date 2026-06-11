namespace B1Plus.Api.DTO;

public class PedidoVendaRetornoDTO
{
    public int DocumentoEntrada { get; set; }
    public int Documento { get; set; }
    public string CodigoCliente { get; set; } = string.Empty;
    public string Cliente { get; set; } = string.Empty;
    public string NumeroReferenciaCliente { get; set; } = string.Empty;
    public string ValorTotalPedido { get; set; } = string.Empty;
    public int? CodigoAnexo { get; set; }
    public DateTime DataLancamento { get; set; }
    public DateTime DataEntrega { get; set; } 
    public DateTime DataDocumento { get; set; }
    public int? CodigoPessoaContato { get; set; }
    public int? CodigoVendedores { get; set; }
    public string PessoaContato { get; set; } = string.Empty;
    public string EmailContato { get; set; } = string.Empty;
    public int Empresa { get; set; }
    public List<ItemPedidoRetornoDTO> Itens { get; set; } = [];
    public List<AnexoPedidoRetornoDTO> Anexos { get; set; } = [];
    public List<VendedorPedidoDTO> Vendedores { get; set; } = [];
}
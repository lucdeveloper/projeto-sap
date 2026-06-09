using B1Plus.Api.DTO;

namespace sap.DTO;

public class PedidoVendaEdicaoDTO
{
    public int? PessoaContato { get; set; }
    public string NumeroReferenciaCliente { get; set; } = string.Empty;
    public required string DataEntrega { get; set; }
    public int? CodigoAnexo { get; set; }
    public int? CodigoVendedores { get; set; }
    public List<ItemPedidoEdicaoDTO>? Itens { get; set; } = [];
    public List<AnexoPedidoEdicaoDTO> Anexos { get; set; } = [];
    public List<VendedorPedidoEdicaoDTO> Vendedores { get; set; } = [];
}
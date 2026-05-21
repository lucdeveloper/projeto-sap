namespace sap.DTO;

public class PedidoVendaDTO
{
    public required string Cliente { get; set; }
    public required string DataEntrega { get; set; }
    public int Empresa { get; set; }
    public int PessoaContato { get; set; }
    public string NumeroReferenciaCliente { get; set; } = string.Empty;
    public required List<ItemPedidoDTO> Itens { get; set; }
}
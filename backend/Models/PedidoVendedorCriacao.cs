namespace B1Plus.Api.Models;

public class PedidoVendedorCriacao
{
    public int U_DocEntryPedido { get; set; }
    public List<PedidoVendedorLinhasCriacao> LGDPEDIDOVENDEDORCollection { get; set; } = [];
}

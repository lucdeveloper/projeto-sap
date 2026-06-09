using sap.Models;

namespace B1Plus.Api.Models;

public class PedidoVendedorRetorno
{
    public int U_DocEntryPedido { get; set; }
    public List<VendedorLinhaRetorno> LGDPEDIDOVENDEDORCollection { get; set; } = [];
}
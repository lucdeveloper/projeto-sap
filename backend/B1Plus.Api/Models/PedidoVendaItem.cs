namespace B1Plus.Api.Models;

public class PedidoVendaItem
{
    public required string ItemCode { get; set; }
    public int Quantity { get; set; }
    public required string TaxCode { get; set; }
    public  decimal UnitPrice { get; set; }
}

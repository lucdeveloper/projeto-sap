namespace B1Plus.Api.Models
{
    public class PedidoVendaItemRetorno
    {
        public int LineNum { get; set; }
        public required string ItemCode { get; set; }
        public required string ItemDescription { get; set; }
        public decimal Quantity { get; set; }
        public required string TaxCode { get; set; }
        public decimal UnitPrice { get; set; }
    }
}
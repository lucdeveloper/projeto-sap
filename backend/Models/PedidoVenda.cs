namespace sap.Models;

public class PedidoVenda
{
    public required string CardCode { get; set; }
    public required string DocDueDate { get; set; }
    public required int BPL_IDAssignedToInvoice { get; set; }
    public required int ContactPersonCode { get; set; }
    public string NumAtCard { get; set; } = string.Empty;
    public required List<PedidoVendaItem> DocumentLines { get; set; }
}
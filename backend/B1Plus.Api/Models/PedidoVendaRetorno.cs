namespace B1Plus.Api.Models;

public class PedidoVendaRetorno
{
    public int DocEntry { get; set; }
    public int DocNum { get; set; }
    public string CardCode { get; set; } = string.Empty;
    public string CardName { get; set; } = string.Empty; 
    public string NumAtCard { get; set; } = string.Empty;
    public DateTime DocDate { get; set; }
    public DateTime DocDueDate { get; set; } 
    public DateTime TaxDate { get; set; }
    public int ContactPersonCode { get; set; }
    public double DocTotal { get; set; }
    public int BPL_IDAssignedToInvoice { get; set; }
    public int? attachmentEntry { get; set; }
    public List<PedidoVendaItemRetorno> DocumentLines { get; set; } = [];
    
}
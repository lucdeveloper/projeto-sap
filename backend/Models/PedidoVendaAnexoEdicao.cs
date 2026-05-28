namespace sap.Models;

public class PedidoVendaAnexoEdicao
{
    public required string DocDueDate { get; set; }
    public required int? ContactPersonCode { get; set; }
    public string NumAtCard { get; set; } = string.Empty;
    public int? AttachmentEntry { get; set; }
    public required List<PedidoVendaItemEdicao>? DocumentLines { get; set; }
}

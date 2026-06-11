using Newtonsoft.Json;

namespace B1Plus.Api.Models;

public class PedidoVendaEdicao
{
    public required string DocDueDate { get; set; }
    public required int? ContactPersonCode { get; set; }
    public string NumAtCard { get; set; } = string.Empty;
    public required List<PedidoVendaItemEdicao>? DocumentLines { get; set; }
}

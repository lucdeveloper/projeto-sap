using Newtonsoft.Json;

namespace sap.Models;

public class PedidoVendaItemEdicao
{
    [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
    public int? LineNum { get; set; } = null;

    [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
    public  string? ItemCode { get; set; }

    [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
    public int? Quantity { get; set; }

    [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
    public  string? TaxCode { get; set; }

    [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
    public decimal? UnitPrice { get; set; }

    [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
    public string? LineStatus { get; set; }
}

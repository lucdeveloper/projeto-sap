namespace B1Plus.Api.DTO;

public class ValorComissionavelPedidoDTO
{
    public string Nome { get; set; } = string.Empty;
    public string PorcentagemComissao { get; set; } = string.Empty;
    public decimal ValorComissao { get; set; }
}
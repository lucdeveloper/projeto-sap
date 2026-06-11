namespace B1Plus.Api.DTO;

public class ItemPedidoRetornoDTO
{
    public int Linha { get; set; }
    public string Codigo { get; set; } = string.Empty;
    public string Descricao { get; set; } = string.Empty;
    public decimal Quantidade { get; set; }
    public decimal Preco { get; set; }
    public string Imposto { get; set; } = string.Empty;
}

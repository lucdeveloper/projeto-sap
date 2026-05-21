namespace sap.DTO;

public class ItemPedidoDTO
{
    public string Item { get; set; } = string.Empty;
    public int Quantidade { get; set; }
    public string Imposto { get; set; } = string.Empty;
    public decimal Preco { get; set; }
}

namespace sap.DTO;

public class ItemPedidoEdicaoDTO
{
    public int? Linha { get; set; }
    public string? Item { get; set; }
    public int Quantidade { get; set; }
    public string Imposto { get; set; } = string.Empty;
    public decimal Preco { get; set; }
    public bool Excluir { get; set; }
}

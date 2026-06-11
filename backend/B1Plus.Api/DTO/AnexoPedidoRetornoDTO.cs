namespace B1Plus.Api.DTO;

public class AnexoPedidoRetornoDTO
{
    public int Codigo { get; set; }
    public int Linha { get; set; }
    public string CaminhoDestino { get; set; } = string.Empty;
    public string NomeArquivo { get; set; } = string.Empty;
    public string ExtensaoArquivo { get; set; } = string.Empty;
    public int? Tamanho { get; set; }
}
namespace B1Plus.Api.DTO;

public class AnexoPedidoEdicaoDTO
{
    public int Linha { get; set; }
    public string CaminhoDestino { get; set; } = string.Empty;
    public string NomeArquivo { get; set; } = string.Empty;
    public string ExtensaoArquivo { get; set; } = string.Empty;
    public int TamanhoArquivo { get; set; }
}
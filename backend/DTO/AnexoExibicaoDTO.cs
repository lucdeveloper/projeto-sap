namespace B1Plus.Api.DTO;

public class AnexoExibicaoDTO
{
    public int Codigo { get; set; }
    public int Linha { get; set; }
    public string NomeArquivo { get; set; } = string.Empty;
    public string TipoArquivo { get; set; } = string.Empty;
    public string Url { get; set; } = string.Empty;
}
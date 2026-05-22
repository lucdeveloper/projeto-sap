namespace sap.DTO;

public class AnexoPedidoRetornoDTO
{
    public int Linha { get; set; }
    public string CaminhoDestino { get; set; } = string.Empty;
    public string CaminhoSubPasta { get; set; } = string.Empty;
    public string NomeArquivo { get; set; } = string.Empty;
    public string ExtensaoArquivo { get; set; } = string.Empty;
}
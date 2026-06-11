namespace B1Plus.Api.DTO
{
    public class AnexoPedidoDTO
    {
        public required string NomeArquivo { get; set; }
        public required string ExtensaoArquivo { get; set; }
        public required string CaminhoDestino { get; set; }
        public  int TamanhoArquivo { get; set; }
    }
}
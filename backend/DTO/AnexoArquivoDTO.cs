namespace sap.DTO
{
    public class AnexoArquivoDTO
    {
        public byte[] Bytes { get; set; } = [];
        public string ContentType { get; set; } = string.Empty;
        public string NomeArquivo { get; set; } = string.Empty;
    }
}

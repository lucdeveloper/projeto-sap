namespace sap.Models
{
    public class AnexoLinhaEdicao
    {
        public int? LineNum { get; set; }
        public required string FileExtension { get; set; }
        public required string FileName { get; set; }
        public required string SourcePath { get; set; }
        public int FileSize { get; set; }
        public int UserID { get; set; }
    }
}

namespace sap.Models;

public class AnexoLinhaCriacao
{
    public  required string FileExtension { get; set; }
    public required string FileName { get; set; }
    public required string SourcePath { get; set; }
    public int FileSize { get; set; }
    public int UserID { get; set; }
}
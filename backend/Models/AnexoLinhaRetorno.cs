namespace B1Plus.Api.Models;

public class AnexoLinhaRetorno
{
    public int AbsoluteEntry { get; set; }
    public int LineNum { get; set; }
    public string FileName { get; set; } = string.Empty;
    public string SourcePath { get; set; } = string.Empty;
    public string FileExtension { get; set; } = string.Empty;
    public int FileSize { get; set; }
}
namespace B1Plus.Api.Models;

public class AnexoRetorno
{
    public int AbsoluteEntry { get; set; }
    public List<AnexoLinhaRetorno> Attachments2_Lines { get; set; } = [];
}
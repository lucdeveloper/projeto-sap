namespace B1Plus.Api.DTO;

public class VendedorFiltroConsultaDTO
{
    public List<int> Codigos { get; set; }
    public List<string> Nomes { get; set; }
   

    public VendedorFiltroConsultaDTO()
    {
        Codigos = [];
        Nomes = [];
    }
}
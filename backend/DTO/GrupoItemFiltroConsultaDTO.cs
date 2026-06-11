namespace B1Plus.Api.DTO;

public class GrupoItemFiltroConsultaDTO
{
    public List<int> Numeros { get; set; }
    public List<string> Nomes { get; set; }

    public GrupoItemFiltroConsultaDTO()
    {
        Numeros = [];
        Nomes = [];
    }
}
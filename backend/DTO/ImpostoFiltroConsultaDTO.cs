namespace sap.DTO;

public class ImpostoFiltroConsultaDTO
{
    public List<string> Codigos { get; set; }
    public List<string> Nomes { get; set; }

    public ImpostoFiltroConsultaDTO()
    {
        Codigos = [];
        Nomes = [];
    }
}

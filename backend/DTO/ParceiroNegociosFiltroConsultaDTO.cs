namespace B1Plus.Api.DTO;

public class ParceiroNegociosFiltroConsultaDTO
{
    public List<string> Codigos { get; set; }
    public List<string> Nomes { get; set; }

    public ParceiroNegociosFiltroConsultaDTO()
    {
        Codigos = [];
        Nomes = [];
    }
}

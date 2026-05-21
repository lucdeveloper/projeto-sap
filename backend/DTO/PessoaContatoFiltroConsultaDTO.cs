namespace sap.DTO;

public class PessoaContatoFiltroConsultaDTO
{
    public required string Cliente { get; set; }
    public List<string> Codigos { get; set; }
    public List<string> Nomes { get; set; }

    public PessoaContatoFiltroConsultaDTO()
    {
        Codigos = [];
        Nomes = [];
    }
}
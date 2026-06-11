namespace B1Plus.Api.DTO;

public class PedidoVendasFiltroConsultaDTO
{
    public List<int> Documentos { get; set; }
    public List<string> Clientes { get; set; }
    public List<string> Status { get; set; }
    public string DataEntrega { get; set; }

    public PedidoVendasFiltroConsultaDTO()
    {
        Documentos = [];
        Clientes = [];
        Status = [];
        DataEntrega = string.Empty;
    }
}

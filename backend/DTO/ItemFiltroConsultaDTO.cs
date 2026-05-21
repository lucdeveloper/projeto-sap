using static System.Runtime.InteropServices.JavaScript.JSType;

namespace sap.DTO;

public class ItemFiltroConsultaDTO
{
    public List<string> Numeros { get; set; }
    public List<int> Grupos { get; set; }

    public ItemFiltroConsultaDTO()
    {
        Numeros = [];
        Grupos = [];
    }
}
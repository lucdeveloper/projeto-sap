namespace B1Plus.Api.DTO
{
    public class ItemConsultaDTO
    {
        public string Numero { get; set; } = string.Empty;
        public string Descricao { get; set; } = string.Empty;
        public decimal Quantidade { get; set; }
        public string Grupo { get; set; } = string.Empty;
    }
}
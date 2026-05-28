namespace sap.DTO
{
    public class PedidoVendaConsultaDTO
    {
        public int Documento { get; set; }
        public int NumeroDocumento { get; set; }
        public string CodigoCliente { get; set; } = string.Empty;
        public string NomeCliente { get; set; } = string.Empty;
        public string NumeroReferenciaCliente { get; set; } = string.Empty;
        public string DataLancamento { get; set; } = string.Empty;
        public string DataEntrega { get; set; } = string.Empty;
        public Decimal TotalDocumento { get; set; }
        public string Status { get; set; } = string.Empty;
    }
}

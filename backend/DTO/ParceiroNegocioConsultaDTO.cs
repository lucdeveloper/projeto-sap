namespace sap.DTO;

public class ParceiroNegocioConsultaDTO
{
    public string CodigoCliente { get; set; } = string.Empty;
    public string NomeCliente { get; set; } = string.Empty;
    public string SaldoTotal { get; set; } = string.Empty;
    public string Moeda { get; set; } = string.Empty;
    public string Saldo { get; set; } = string.Empty;
    public string Celular { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Grupo { get; set; } = string.Empty;
    public int? CodigoPessoaContato { get; set; }
    public string PessoaContato { get; set; } = string.Empty;
    public string EmailContato { get; set; } = string.Empty;
}
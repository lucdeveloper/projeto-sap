using B1Plus.Api.DTO;
using B1Plus.Api.Extensions;
using B1Plus.Api.Servicos.Base;
using System.Data.Odbc;
using System.Text;

namespace B1Plus.Api.Servicos.SAP;

public class ParceiroNegocioService(SAPBase sapBase)
{
    private readonly SAPBase _sapBase = sapBase;

    public async Task<ParceiroNegocioConsultaDTO?> BuscarPorCodigo(string codigo)
    {
        var query = MontarQuerySingle();

        var parceiroNegocio = await _sapBase.QuerySingle(query, new OdbcParameter{Value = codigo},
                r => new ParceiroNegocioConsultaDTO
                {
                    CodigoCliente = r.GetString(0),
                    NomeCliente = r.IsDBNull(1) ? string.Empty : r.GetString(1),
                    Grupo = r.GetString(2),
                    Saldo = r.GetDecimal(3).ConverterMoedaBR(),
                    Moeda = r.GetString(4),
                    Celular = r.IsDBNull(5) ? string.Empty : r.GetString(5),
                    Email = r.IsDBNull(6) ? string.Empty : r.GetString(6),
                });

        return parceiroNegocio;
    }

    public async Task<List<ParceiroNegocioConsultaDTO>> BuscarTodos(ParceiroNegociosFiltroConsultaDTO filtros)
    {
        var dadosConsulta = MontarQueryParam(filtros);

        var lista = await _sapBase.QueryParam(dadosConsulta.Item1, dadosConsulta.Item2,
                r => new ParceiroNegocioConsultaDTO
                {
                    CodigoCliente = r.GetString(0),
                    NomeCliente = r.IsDBNull(1) ? string.Empty : r.GetString(1),
                    SaldoTotal = r.GetDecimal(2).ConverterMoedaBR(),
                    Moeda = r.GetString(3),
                    CodigoPessoaContato = r.IsDBNull(6) ? null : r.GetInt32(6),
                    PessoaContato = r.IsDBNull(7) ? string.Empty : r.GetString(7),
                    EmailContato = r.IsDBNull(8) ? string.Empty : r.GetString(8), 
                });

        return lista;
    }

    public async Task<List<PessoaContatoConsultaDTO>> RetornarPessoasContato(PessoaContatoFiltroConsultaDTO filtros)
    {
        var dadosConsulta = MontarQueryPessoaContato(filtros);

        var pessoasContato = await _sapBase.QueryParam(dadosConsulta.Item1, dadosConsulta.Item2,
                r => new PessoaContatoConsultaDTO
                {
                    CodigoPessoaContato = r.GetInt32(0),
                    Nome = r.IsDBNull(1) ? string.Empty : r.GetString(1),
                    Posicao = r.IsDBNull(2) ? string.Empty : r.GetString(2),
                    Telefone = r.IsDBNull(3) ? string.Empty : r.GetString(3)
                });

        return pessoasContato;
    }

    public async Task<PessoaContatoConsultaDTO> RetornarPessoasContatoPorCodigo(int codigoContato)
    {
        var dadosConsulta = MontarQueryPessoaContatoPorCodigo(codigoContato);
        var pessoaContato = await _sapBase.QuerySingle(dadosConsulta.Item1, dadosConsulta.Item2,
            r => new PessoaContatoConsultaDTO
            {
                Nome = r.GetString(0),
                EmailContato = r.IsDBNull(1) ? string.Empty : r.GetString(1)
            });
        return pessoaContato is null ? new PessoaContatoConsultaDTO() : pessoaContato;
    }

    private (string, OdbcParameter) MontarQueryPessoaContatoPorCodigo(int codigoContato)
    {
        var query = new StringBuilder(@"
                          SELECT              
                             ""Name"" AS ""Nome"",
                             ""E_MailL"" AS ""Email""
                          FROM                
                              OCPR            
                          WHERE               
                              ""CntctCode"" = ? ");

        var parametro = new OdbcParameter("CntctCode", OdbcType.Int) { Value = codigoContato };

        return (query.ToString(), parametro);
    }

    private (string, List<OdbcParameter>) MontarQueryPessoaContato(PessoaContatoFiltroConsultaDTO filtros)
    {
        var query = new StringBuilder(@"
                          SELECT 
	                          ""CntctCode"" AS ""CodigoPessoaContato"",
	                          ""Name"" AS Nome,
	                          ""Position"" AS ""Posicao"",
	                          ""Cellolar"" AS ""Telefone""
                          FROM
	                          OCPR
                          WHERE
	                          ""CardCode"" = ? ");

        var parametros = new List<OdbcParameter>
        {
            new("CardCode", filtros.Cliente)
        };

        CriarFiltro(query, "CntctCode", filtros.Codigos, parametros);
        CriarFiltro(query, "Name", filtros.Nomes, parametros);

        query.Append(@" ORDER BY ""CntctCode""");

        return (query.ToString(), parametros);
    }

    private string MontarQuerySingle()
    {
        return @"SELECT
                    rd.""CardCode"" AS ""CodigoCliente"",
                    rd.""CardName"" AS ""NomeCliente"",
                    rg.""GroupName"" AS ""Grupo"",
                    rd.""Balance"" AS ""Saldo"",
                    rd.""Currency"" AS ""Moeda"",
                    rd.""Cellular"" AS ""Celular"",
                    rd.""E_Mail"" AS ""Email""
                FROM OCRD rd
                INNER JOIN OCRG rg 
                    ON rd.""GroupCode"" = rg.""GroupCode""
                WHERE rd.""CardCode"" = ?";
    }

    private (string, List<OdbcParameter>) MontarQueryParam(ParceiroNegociosFiltroConsultaDTO filtros)
    {
        var query = new StringBuilder(@"
                          SELECT
                              T0.""CardCode"" AS ""CodigoCliente"",
                              T0.""CardName"" AS ""NomeCliente"",
                              T0.""OrdersBal"" AS ""SaldoTotal"",
                              T0.""Currency"" AS ""Moeda"",
                              T0.""E_Mail"" AS ""Email"",
                              T0.""CntctPrsn"" AS ""ContatoPadraoNoCadastro"",
                              T1.""CntctCode"" AS ""CodigoPessoaContato"",
                              T1.""Name"" AS ""PessoaContato"",
                              T1.""E_MailL"" AS ""EmailContato""
                          FROM OCRD T0
                          LEFT JOIN LATERAL (
                               SELECT TOP 1 ""Name"", ""E_MailL"",""CntctCode"" 
                               FROM OCPR 
                               WHERE ""CardCode"" = T0.""CardCode""
                               ORDER BY 
                                   (CASE WHEN ""Name"" = T0.""CntctPrsn"" THEN 0 ELSE 1 END) ASC, ""CntctCode"" ASC) T1 ON 1 = 1
                          WHERE 1 = 1");

        var parametros = new List<OdbcParameter>();

        CriarFiltro(query, "CardCode", filtros.Codigos, parametros);
        CriarFiltro(query, "CardName", filtros.Nomes, parametros);

        query.Append(@" ORDER BY T0.""CardCode""");

        return (query.ToString(), parametros);
    }

    private void CriarFiltro<T>(StringBuilder query, string nomeColuna, List<T> valores, List<OdbcParameter> parametros)
    {
        if (valores == null || valores.Count == 0)
            return;

        var filtros = string.Join(",", valores.Select(_ => "?"));

        query.Append($@" AND ""{nomeColuna}"" IN ({filtros})");

        valores.ForEach(valor => parametros.Add(new OdbcParameter { Value = valor }));
    }
}

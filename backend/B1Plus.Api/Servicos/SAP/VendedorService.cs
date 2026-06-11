using B1Plus.Api.DTO;
using B1Plus.Api.Servicos.Base;
using System.Data.Odbc;
using System.Text;

namespace B1Plus.Api.Servicos.SAP;

public class VendedorService(SAPBase sapBase)
{
    private readonly SAPBase _sapBase = sapBase;

    public async Task<List<VendedorConsultaDTO>> Buscar(VendedorFiltroConsultaDTO filtros)
    {
        var dadosConsulta = MontarQuery(filtros);

        var filiais = await _sapBase.QueryParam(dadosConsulta.Item1, dadosConsulta.Item2,
                r => new VendedorConsultaDTO
                {
                    Codigo = r.GetInt32(0),
                    Nome = r.GetString(1),
                    Observacao = r.IsDBNull(2) ? string.Empty : r.GetString(2),
                });

        return filiais;
    }

    public async Task<VendedorConsultaDTO> BuscarPorCodigo(int codigo)
    {
        var query = new StringBuilder(@"SELECT
	                                        OP.""SlpCode"" AS ""Codigo"",
	                                        OP.""SlpName"" AS ""Nome"",
	                                        OP.""Commission"" AS ""Comissao"",
	                                        OG.""GroupName"" AS ""Grupo""
                                        FROM
	                                        OSLP OP
                                        INNER JOIN OCOG OG ON
	                                        OP.""GroupCode"" = OG.""GroupCode""
                                        WHERE OP.""SlpCode"" = ? ");

        var parametro = new OdbcParameter { Value = codigo };

        var vendedor = await _sapBase.QuerySingle(query.ToString(), parametro,
               r => new VendedorConsultaDTO
               {
                   Codigo = r.GetInt32(0),
                   Nome = r.GetString(1),
                   Comissao = r.GetDecimal(2),
                   Grupo = r.GetString(3),
               });

        return vendedor is null ? new VendedorConsultaDTO() : vendedor;
    }

    public async Task<List<ValorComissionavelPedidoDTO>> ObterValoresComissionavel(int documentoEntrada)
    {
        var query = new StringBuilder(@"SELECT                                          	
                                            T2.""SlpName"" AS ""Nome"",
                                            T2.""Commission"" ""AS ValorComissao""
                                        FROM ""@LGODPEDIDOVENDA"" T0
                                        LEFT JOIN ""@LGOLDPEDIDOVENDEDOR"" T1
                                            ON T0.""DocEntry"" = T1.""DocEntry""
                                        LEFT JOIN OSLP T2
                                            ON T1.""U_VendedorCode"" = T2.""SlpCode""
                                        WHERE T0.""U_DocEntryPedido"" = ?
                                        ORDER BY T1.""LineId"" ");

        var parametros = new List<OdbcParameter> { new() { Value = documentoEntrada } };

        var valoTotalPedido = await RetornarValorTotalItens(documentoEntrada);

        var valoresComissionaveis = await _sapBase.QueryParam(query.ToString(), parametros,
                r =>
                {
                    var porcentagem = r.GetDecimal(1);

                    return new ValorComissionavelPedidoDTO
                    {
                        Nome = r.GetString(0),
                        PorcentagemComissao = $"{porcentagem:N0}%",
                        ValorComissao = Math.Round(valoTotalPedido * (porcentagem / 100m), 2, MidpointRounding.AwayFromZero)
                    };
                }
        );

        return valoresComissionaveis;
    }

    private (string, List<OdbcParameter>) MontarQuery(VendedorFiltroConsultaDTO filtros)
    {
        var query = new StringBuilder(@"SELECT
	                                        ""SlpCode"" AS ""Codigo"",
	                                        ""SlpName"" AS ""Nome"",
                                            ""Memo"" AS ""Observacao"",
	                                        ""Active"" AS ""Ativo""
                                        FROM
	                                        OSLP
                                        WHERE
	                                        ""Active"" = 'Y'
	                                        AND ""SlpCode"" != -1 ");

        var parametros = new List<OdbcParameter>();

        CriarFiltro(query, "SlpCode", filtros.Codigos, parametros);

        if (filtros.Nomes.Count > 0)
        {
            query.Append($" AND ({string.Join(" OR ", filtros.Nomes.Select(_ => @"""SlpName"" LIKE ?"))})");

            parametros.AddRange(
                filtros.Nomes.Select(nome =>
                    new OdbcParameter { Value = $"%{nome}%" }));
        }

        query.Append($@" ORDER BY ""SlpCode""");

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

    private async Task<Decimal> RetornarValorTotalItens(int documentoEntrada)
    {
        var query = @"SELECT ""Price"" FROM RDR1 WHERE ""DocEntry"" = ? AND ""LineStatus"" = 'O' ";
        var parametros = new List<OdbcParameter> { new() { Value = documentoEntrada } };
        var precos = await _sapBase.QueryParam<decimal>(query, parametros, r => r.GetDecimal(0));
        return precos.Sum();
    }
}

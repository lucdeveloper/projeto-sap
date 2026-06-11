using B1Plus.Api.DTO;
using B1Plus.Api.Servicos.Base;
using System.Data.Odbc;
using System.Text;

namespace B1Plus.Api.Servicos.SAP;

public class ItemService(SAPBase sapBase)
{
    private readonly SAPBase _sapBase = sapBase;

    public async Task<ItemConsultaDTO> BuscarPorCodigo(string codigo)
    {
        var query = MontarQuerySingle();

        var parceiroNegocio = await _sapBase.QuerySingle(query, new OdbcParameter { Value = codigo },
                r => new ItemConsultaDTO
                {
                    Numero = r.GetString(0),
                    Descricao = r.GetString(1),
                    Grupo = r.GetString(2)
                });

        return parceiroNegocio is null ? new ItemConsultaDTO() : parceiroNegocio;
    }


    public async Task<List<ItemConsultaDTO>> BuscarTodos(ItemFiltroConsultaDTO filtros)
    {
        var dadosConsulta = MontarQueryParam(filtros);

        var itens = await _sapBase.QueryParam(dadosConsulta.Item1, dadosConsulta.Item2,
                r => new ItemConsultaDTO
                {
                    Numero = r.GetString(0),
                    Descricao = r.GetString(1),
                    Quantidade = r.GetDecimal(2),
                    Grupo = r.GetString(3),
                });

        return itens;
    }


    private string MontarQuerySingle()
    {
        return @"SELECT
	                 tm.""ItemCode"" AS ""Numero"",
	                 tm.""ItemName"" AS ""Descricao"",
	                 tb.""ItmsGrpNam"" AS Grupo
                 FROM
	                 OITM tm
                 INNER JOIN OITB tb ON
	                 tm.""ItmsGrpCod"" = tb.""ItmsGrpCod""
                 WHERE tm.""ItemCode"" = ?";
    }

    private (string, List<OdbcParameter>) MontarQueryParam(ItemFiltroConsultaDTO filtros)
    {
        var query = new StringBuilder(@"
                          SELECT
	                          tm.""ItemCode"" AS ""Numero"",
	                          tm.""ItemName"" AS ""Descricao"",
	                          tm.""OnHand"" AS ""Quantidade"",
	                          tb.""ItmsGrpNam"" AS Grupo
                          FROM
	                          OITM tm
                          INNER JOIN OITB tb ON
	                          tm.""ItmsGrpCod"" = tb.""ItmsGrpCod"" 
                          WHERE 1 = 1 ");

        var parametros = new List<OdbcParameter>();

        CriarFiltro(query, @"tm.""ItemCode""", filtros.Numeros, parametros);
        CriarFiltro(query, @"tm.""ItmsGrpCod""", filtros.Grupos, parametros);

        query.Append($@" ORDER BY tm.""ItemCode""");

        return (query.ToString(), parametros);
    }

    private void CriarFiltro<T>(StringBuilder query, string nomeColuna, List<T> valores, List<OdbcParameter> parametros)
    {
        if (valores == null || valores.Count == 0)
            return;

        var filtros = string.Join(",", valores.Select(_ => "?"));

        query.Append($@" AND {nomeColuna} IN ({filtros})");

        valores.ForEach(valor => parametros.Add(new OdbcParameter { Value = valor }));
    }
}

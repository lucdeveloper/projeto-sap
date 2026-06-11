using B1Plus.Api.DTO;
using B1Plus.Api.Servicos.Base;
using System.Data.Odbc;
using System.Text;

namespace B1Plus.Api.Servicos.SAP;

public class GrupoItemService(SAPBase sapBase)
{
    private readonly SAPBase _sapBase = sapBase;

    public async Task<List<GrupoItemConsultaDTO>> BuscarTodos(GrupoItemFiltroConsultaDTO filtros)
    {
        var dadosConsulta = MontarQuery(filtros);

        var grupos = await _sapBase.QueryParam(dadosConsulta.Item1, dadosConsulta.Item2,
                r => new GrupoItemConsultaDTO
                {
                    Numero = r.GetInt32(0),
                    Nome = r.GetString(1)
                });

        return grupos;
    }

    private (string, List<OdbcParameter>) MontarQuery(GrupoItemFiltroConsultaDTO filtros)
    {
        var query = new StringBuilder(@"SELECT
	                                        ""ItmsGrpCod"" AS ""Numero"",
                                            ""ItmsGrpNam"" AS ""Nome""
                                        FROM
                                            OITB
                                        WHERE 1 = 1");

        var parametros = new List<OdbcParameter>();

        CriarFiltro(query, "ItmsGrpCod", filtros.Numeros, parametros);
        CriarFiltro(query, "ItmsGrpNam", filtros.Nomes, parametros);

        query.Append($@" ORDER BY ""ItmsGrpCod""");

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
using sap.DTO;
using sap.Servicos.Base;
using System.Data.Odbc;
using System.Text;

namespace sap.Servicos.SAP;

public class ImpostoService(SAPBase sapBase)
{
    private readonly SAPBase _sapBase = sapBase;

    public async Task<List<ImpostoConsultaDTO>> BuscarTodos(ImpostoFiltroConsultaDTO filtros)
    {
        var dadosConsulta = MontarQueryParam(filtros);

        var impostos = await _sapBase.QueryParam(dadosConsulta.Item1, dadosConsulta.Item2,
                r => new ImpostoConsultaDTO
                {
                    Codigo = r.GetString(0),
                    Nome = r.GetString(1),
                    Taxa = r.GetString(2)
                });

        return impostos;
    }
    private (string, List<OdbcParameter>) MontarQueryParam(ImpostoFiltroConsultaDTO filtros)
    {
        var query = new StringBuilder(@"
                          SELECT
	                          ""Code"" AS ""Codigo"",
	                          ""Name"" AS ""Nome"",
	                          TO_VARCHAR(TO_DECIMAL(""Rate"", 10, 2)) || '%' AS ""Taxa""
                          FROM
	                          OSTC
                          WHERE 1 = 1 ");

        var parametros = new List<OdbcParameter>();

        CriarFiltro(query, "Code", filtros.Codigos, parametros);
        CriarFiltro(query, "Name", filtros.Nomes, parametros);

        query.Append($@" ORDER BY ""Code""");
        
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
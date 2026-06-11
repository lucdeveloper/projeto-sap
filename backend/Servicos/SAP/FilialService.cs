using B1Plus.Api.DTO;
using B1Plus.Api.Servicos.Base;

namespace B1Plus.Api.Servicos.SAP;

public class FilialService(SAPBase sapBase)
{
    private readonly SAPBase _sapBase = sapBase;

    public async Task<List<FilialConsultaDTO>> BuscarAtivos()
    {
        var query = MontarQuery();

        var filiais = await _sapBase.QueryParam(query,null,
                r => new FilialConsultaDTO
                {
                    Codigo = r.GetInt32(0),
                    Nome = r.GetString(1),
                });

        return filiais;
    }

    private string MontarQuery()
    {
        var query = @"SELECT
	                      ""BPLId"" AS ""Codigo"",
	                      ""BPLName"" AS ""Nome""
                      FROM
	                      OBPL
                      WHERE ""Disabled"" = 'N'";
                          
        return query;
    }
}
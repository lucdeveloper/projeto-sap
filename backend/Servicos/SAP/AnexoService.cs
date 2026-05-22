using sap.DTO;
using sap.Servicos.Base;

namespace sap.Servicos.SAP;

public class AnexoService(SAPBase sapBase)
{
    private readonly SAPBase _sapBase = sapBase;

    public async Task<AnexoConsultaDTO> BuscarAtivos()
    {
        var query = MontarQuery();

        var dadosAnexo = await _sapBase.QuerySingle(query, null,
                r => new AnexoConsultaDTO
                {
                    CaminhoPastaAnexo = r.GetString(0)
                });

        return dadosAnexo is null ? new AnexoConsultaDTO() : dadosAnexo;
    }

    private string MontarQuery()
    {
        var query = @"SELECT ""AttachPath"" AS ""CaminhoAnexo"" FROM OADP o ";
        return query;
    }
}
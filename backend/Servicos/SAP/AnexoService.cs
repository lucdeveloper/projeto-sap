using sap.Configuracoes;
using sap.DTO;
using sap.Models;
using sap.Servicos.Base;
using System.Data.Odbc;

namespace sap.Servicos.SAP;

public class AnexoService(SAPBase sapBase)
{
    private readonly SAPBase _sapBase = sapBase;

    public async Task<AnexoConsultaDTO> BuscarAnexos()
    {
        var query = MontarQuery();

        var dadosAnexo = await _sapBase.QuerySingle(query, null,
                r => new AnexoConsultaDTO
                {
                    CaminhoPastaAnexo = r.GetString(0)
                });

        return dadosAnexo is null ? new AnexoConsultaDTO() : dadosAnexo;
    }

    public async Task<AnexoArquivoDTO> MontarExibicaoAnexo(int codigo, int numeroLinha)
    {
        var dadosConsulta = MontarQueryAnexo(codigo, numeroLinha);
        var dadosAnexo = await _sapBase.QueryFirstOrDefault(dadosConsulta.Item1, dadosConsulta.Item2,
            r => new AnexoPedidoRetornoDTO
            {
                Codigo = r.GetInt32(0),
                Linha = r.GetInt32(1),
                CaminhoDestino = r.GetString(2),
                NomeArquivo = r.GetString(3),
                ExtensaoArquivo = r.GetString(4),
            }) 
            ?? throw new FileNotFoundException("Anexo não encontrado na base de dados.");

        var caminho = Path.Combine(dadosAnexo.CaminhoDestino, $"{dadosAnexo.NomeArquivo}.{dadosAnexo.ExtensaoArquivo}");

        if (!File.Exists(caminho))
            throw new FileNotFoundException($"Arquivo físico não encontrado. Caminho: {caminho}");
        
        var bytes = await File.ReadAllBytesAsync(caminho);

        return new AnexoArquivoDTO
        {
            Bytes = bytes,
            NomeArquivo = dadosAnexo.NomeArquivo,
            ContentType = RetornarContentType(dadosAnexo.ExtensaoArquivo)
        };
    }
    
    public async Task<AnexoRetorno> Criar(List<AnexoPedidoDTO> anexos)
    {
        var anexoSap = MapearParaSap(anexos);
        var retornoSap = await _sapBase.CriarRegistro<AnexoRetorno>(SAPRotas.Anexo, anexoSap);
        return retornoSap;
    }
    
    public async Task<AnexoConsultaDTO> Editar(AnexoConsultaDTO anexo)
    {
        var query = MontarQuery();

        var dadosAnexo = await _sapBase.QuerySingle(query, null,
                r => new AnexoConsultaDTO
                {
                    CaminhoPastaAnexo = r.GetString(0)
                });

        return dadosAnexo is null ? new AnexoConsultaDTO() : dadosAnexo;
    }

    public async Task<List<AnexoPedidoRetornoDTO>> ObterAnexos(int codigoAnexo)
    {
        var query = @"SELECT 
                           T0.""AbsEntry"" AS ""Codigo"",	                       
                           T0.""Line"" AS ""LinhaAnexo"",
	                       T0.""srcPath"" AS ""CaminhoDestino"",
	                       T0.""FileName"" AS ""NomeArquivo"",
	                       T0.""FileExt"" AS ""ExtensaoArquivo"",
                           T0.""FileSize"" AS ""Tamanho""
                      FROM
	                      ATC1 T0
                      WHERE
	                      T0.""AbsEntry"" = ?";

        var parametros = new List<OdbcParameter> { new() { Value = codigoAnexo } };

        var anexos = await _sapBase.QueryParam(query, parametros,
            r => new AnexoPedidoRetornoDTO
            {
                Codigo = r.GetInt32(0),
                Linha = r.GetInt32(1),
                CaminhoDestino = r.GetString(2),
                NomeArquivo = r.GetString(3),
                ExtensaoArquivo = r.GetString(4),
                Tamanho = r.IsDBNull(5) ? null : r.GetInt32(5)
            });

        return anexos;
    }

    private string MontarQuery()
    {
        var query = @"SELECT ""AttachPath"" AS ""CaminhoAnexo"" FROM OADP o ";
        return query;
    }

    private (string, List<OdbcParameter>) MontarQueryAnexo(int codigo, int numeroLinha)
    {
        var query = @"SELECT
	                      ""AbsEntry"" AS ""Codigo"",
	                      ""Line"" AS ""Linha"",
	                      ""srcPath"" AS ""CaminhoDestino"",
	                      ""FileName"" AS ""NomeArquivo"",
	                      ""FileExt"" AS ""Extensao""
                      FROM ATC1
                      WHERE ""AbsEntry"" = ?
                      AND ""Line"" = ?";

        var parametros = new List<OdbcParameter>
        {
            new("AbsEntry", codigo),
            new("Line", numeroLinha),
        };

        return (query.ToString(), parametros);
    }

    private string RetornarContentType(string extensao)
    {
        return extensao.ToLower() switch
        {
            "png" => "image/png",
            "jpg" or "jpeg" => "image/jpeg",
            "pdf" => "application/pdf",
            "txt" => "text/plain",
            "doc" => "application/msword",
            "csv" => "text/csv",
            _ => "application/octet-stream"
        };
    }

    private AnexoCriacao MapearParaSap(List<AnexoPedidoDTO> anexos)
    {
        var anexo = new AnexoCriacao
        {
            Attachments2_Lines = [.. anexos.Select(anexo =>
                new Anexo
                {
                    FileName = anexo.NomeArquivo,
                    FileExtension = anexo.ExtensaoArquivo,
                    SourcePath = anexo.CaminhoDestino,
                    FileSize =  anexo.TamanhoArquivo,
                    UserID = 1
                }
            )]
        };

        return anexo;
    }
}
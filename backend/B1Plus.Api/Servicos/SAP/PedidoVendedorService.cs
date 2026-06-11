using B1Plus.Api.Configuracoes;
using B1Plus.Api.DTO;
using B1Plus.Api.Models;
using B1Plus.Api.Servicos.Base;
using System.Data.Odbc;
using System.Text;

namespace B1Plus.Api.Servicos.SAP;

public class PedidoVendedorService(SAPBase sapBase)
{
    private readonly SAPBase _sapBase = sapBase;

    public async Task<List<VendedorPedidoDTO>> ObterVendedoresPorDocumentoEntrada(int documentoEntrada)
    {
        var query = new StringBuilder(@"SELECT
                                            T1.""DocEntry"" AS ""DocumentoEntrada"", 
	                                        T1.""LineId"" AS ""Linha"",
                                            T2.""SlpCode"" AS ""Codigo"",
                                            T2.""SlpName"" AS ""Nome"",
                                            T2.""Memo"" AS ""Observacao""
                                        FROM ""@LGODPEDIDOVENDA"" T0
                                        INNER JOIN ""@LGOLDPEDIDOVENDEDOR"" T1
                                            ON T0.""DocEntry"" = T1.""DocEntry""
                                        INNER JOIN OSLP T2
                                            ON T1.""U_VendedorCode"" = T2.""SlpCode""
                                        WHERE T0.""U_DocEntryPedido"" = ?
                                        ORDER BY T1.""LineId""");

        var parametros = new List<OdbcParameter> { new() { Value = documentoEntrada } };

        var vendedores = await _sapBase.QueryParam(query.ToString(), parametros,
            r => new VendedorPedidoDTO
            {
                DocumentoEntrada = r.GetInt32(0),
                Linha =  r.GetInt32(1),
                Codigo = r.GetInt32(2),
                Nome = r.GetString(3),
                Observacao = r.IsDBNull(4) ? string.Empty : r.GetString(4),
            }
        );

        return vendedores is null ? [] : vendedores;
    }

    public async Task<PedidoVendedorRetorno> Criar(List<int> vendedores, int documentoEntrada)
    {
        var vendedoresSap = MapearParaSap(vendedores, documentoEntrada);
        var retornoSap = await _sapBase.CriarRegistro<PedidoVendedorRetorno>(SAPRotas.VendedorPedidoVenda, vendedoresSap);
        return retornoSap;
    }

    public async Task<List<VendedorPedidoDTO>> Editar(int documentoEntrada, int? codigoVendedores, List<VendedorPedidoEdicaoDTO> vendedores)
    {
        var vendedoresSap = MapearParaSapEdicao(vendedores);

        if (codigoVendedores.HasValue && vendedores.Count > 0)
        {
            await _sapBase.AtualizarRegistro($"{SAPRotas.VendedorPedidoVenda}({codigoVendedores})", vendedoresSap, true);
        }
        else if (codigoVendedores.HasValue && vendedores.Count == 0)
        {
            await _sapBase.AtualizarRegistro($"{SAPRotas.VendedorPedidoVenda}({codigoVendedores})", vendedoresSap, true);
            await _sapBase.DeletarRegistro($"{SAPRotas.VendedorPedidoVenda}({codigoVendedores})");
            return [];
        }
        else if (!codigoVendedores.HasValue && vendedores.Count > 0)
        {
            var listaVendedores = vendedores.Select(x => x.Codigo).ToList();
            await Criar(listaVendedores, documentoEntrada);
        }

        return await ObterVendedoresPorDocumentoEntrada(documentoEntrada);
    }

    private static PedidoVendedorCriacao MapearParaSap(IEnumerable<int> vendedores, int documentoEntrada)
    {
        return new PedidoVendedorCriacao
        {
            U_DocEntryPedido = documentoEntrada,
            LGOLDPEDIDOVENDEDORCollection = [ .. vendedores.Select(vendedor =>  new PedidoVendedorLinhasCriacao { U_VendedorCode = vendedor })]
        };
    }

    private static PedidoVendedorEdicao MapearParaSapEdicao(List<VendedorPedidoEdicaoDTO> vendedores)
    {
        return new PedidoVendedorEdicao
        {
            LGOLDPEDIDOVENDEDORCollection = [.. vendedores.Select(vendedor => new PedidoVendedorLinhasEdicao
        {
            LineId = vendedor.Linha,
            U_VendedorCode = vendedor.Codigo
        })]
        };
    }
}
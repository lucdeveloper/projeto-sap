using Microsoft.AspNetCore.Mvc;
using sap.Configuracoes;
using sap.DTO;
using sap.Models;
using sap.Servicos.Base;
using System.Data;
using System.Data.Odbc;
using System.Globalization;
using System.Text;

namespace sap.Servicos.SAP;

public class PedidoVendaService(SAPBase sapBase, ParceiroNegocioService parceiroNegocioService, AnexoService anexoService)
{
    private readonly SAPBase _sapBase = sapBase;
    private readonly ParceiroNegocioService _parceiroNegocioService = parceiroNegocioService;
    private readonly AnexoService _anexoService = anexoService;

    public async Task<int> ObterProximoCodigo()
    {
        var query = MontarQueryProximoPedidoVenda();
        return await _sapBase.Query<int>(query, r => r.GetInt32(0));
    }

    public async Task<List<PedidoVendaConsultaDTO>> Buscar(PedidoVendasFiltroConsultaDTO filtros)
    {
        var dadosConsulta = MontarQuery(filtros);
        var lista = await _sapBase.QueryParam(dadosConsulta.Item1, dadosConsulta.Item2,
                r => new PedidoVendaConsultaDTO
                {
                    Documento = r.GetInt32(0),
                    NumeroDocumento = r.GetInt32(1),
                    CodigoCliente = r.GetString(2),
                    NomeCliente = r.GetString(3),
                    NumeroReferenciaCliente = r.IsDBNull(4) ? string.Empty : r.GetString(4),
                    DataLancamento = r.GetDateTime(5).ToString("dd/MM/yyyy"),
                    DataEntrega = r.GetDateTime(6).ToString("dd/MM/yyyy"),
                    Status = r.GetString(7) == "O" ? "Aberto" : "Fechado"
                });

        lista.ForEach(async (pedido) => pedido.TotalDocumento = await RetornarValorTotalItens(pedido.NumeroDocumento));
        return lista;
    }

    public async Task<PedidoVendaRetornoDTO> ObterPorDocumentoEntrada(int documentoEntrada)
        => await ObterPedidoVendaPorCodigo(documentoEntrada);

    public async Task<PedidoVendaRetornoDTO> Criar(PedidoVendaDTO pedidoVendaDTO)
    {
        var anexoRetorno = new AnexoRetorno();
        if (pedidoVendaDTO.Anexos.Count > 0)
        {
            anexoRetorno = await _anexoService.Criar(pedidoVendaDTO.Anexos);
            pedidoVendaDTO.CodigoAnexo = anexoRetorno.AbsoluteEntry;
        }
            
        var pedidoSap = MapearParaSap(pedidoVendaDTO);
        var retornoSap = await _sapBase.CriarRegistro<PedidoVendaRetorno>(SAPRotas.PedidoVendas, pedidoSap);
        return await MapearParaDTO(retornoSap, anexoRetorno);
    }

    public async Task<PedidoVendaRetornoDTO> Editar(int codigo, PedidoVendaEdicaoDTO pedidoVendaEdicaoDTO)
    {
        if(pedidoVendaEdicaoDTO.CodigoAnexo.HasValue && pedidoVendaEdicaoDTO.Anexos.Count > 0)
        {
            await _anexoService.Editar(pedidoVendaEdicaoDTO.Anexos, (int)pedidoVendaEdicaoDTO.CodigoAnexo);
        }
        else if(pedidoVendaEdicaoDTO.CodigoAnexo.HasValue && pedidoVendaEdicaoDTO.Anexos.Count == 0)
        {
            await _anexoService.Editar(pedidoVendaEdicaoDTO.Anexos, pedidoVendaEdicaoDTO.CodigoAnexo.Value);
            await _sapBase.AtualizarRegistro($"{SAPRotas.PedidoVendas}({codigo})", new { AttachmentEntry = (int?)null }, false, true);
        }
        else if (!pedidoVendaEdicaoDTO.CodigoAnexo.HasValue && pedidoVendaEdicaoDTO.Anexos.Count > 0)
        {
            var anexos = pedidoVendaEdicaoDTO.Anexos.Select((anexo) => new AnexoPedidoDTO
            {
                CaminhoDestino = anexo.CaminhoDestino,
                ExtensaoArquivo = anexo.ExtensaoArquivo,
                NomeArquivo = anexo.NomeArquivo,
                TamanhoArquivo = anexo.TamanhoArquivo
            }).ToList();

            var anexo = await _anexoService.Criar(anexos);
            pedidoVendaEdicaoDTO.CodigoAnexo = anexo.AbsoluteEntry;
        }
        
        object pedidoSap = pedidoVendaEdicaoDTO.Anexos.Count > 0 ? MapearParaEdicaoAnexoSap(pedidoVendaEdicaoDTO): MapearParaEdicaoSap(pedidoVendaEdicaoDTO);
        
        /// <summary>
        /// Atualiza um Pedido de Venda no SAP Business One via Service Layer.
        /// </summary>
        /// <param name="codigo">Código do pedido de venda (DocEntry).</param>
        /// <param name="pedidoSap">Objeto com os dados do pedido a serem atualizados.</param>
        /// <param name="replaceCollections">
        /// Define se as coleções (DocumentLines) devem ser substituídas completamente.
        /// Quando <c>true</c>, linhas não enviadas serão removidas no SAP.
        /// </param>
        /// <returns>Task assíncrona.</returns>
        /// <remarks>
        /// Utiliza o header:
        /// <c>B1S-ReplaceCollectionsOnPatch: true</c> (quando replaceCollections = true)
        ///
        /// Regras importantes:
        /// - LineNum preenchido → atualiza linha existente
        /// - LineNum nulo/ausente → adiciona nova linha
        /// - Linha não enviada → será removida do SAP
        ///
        /// Esse comportamento altera o PATCH padrão para substituição de coleção.
        /// </remarks>
        await _sapBase.AtualizarRegistro($"{SAPRotas.PedidoVendas}({codigo})", pedidoSap, true);

        var pedidoAtualizado = await ObterPedidoVendaPorCodigo(codigo);
        
        return pedidoAtualizado;
    }

    private PedidoVenda MapearParaSap(PedidoVendaDTO pedidoVendaDTO)
    {
        return new PedidoVenda
        {
            CardCode = pedidoVendaDTO.Cliente,
            DocDueDate = pedidoVendaDTO.DataEntrega,
            BPL_IDAssignedToInvoice = pedidoVendaDTO.Empresa,
            ContactPersonCode = pedidoVendaDTO.PessoaContato,
            NumAtCard = pedidoVendaDTO.NumeroReferenciaCliente,
            AttachmentEntry = pedidoVendaDTO.CodigoAnexo,
            DocumentLines = [.. pedidoVendaDTO.Itens.Select(item => new PedidoVendaItem
            {
                ItemCode = item.Item,
                Quantity = item.Quantidade,
                UnitPrice = item.Preco,
                TaxCode = item.Imposto
            })]
        };
    }

    private PedidoVendaEdicao MapearParaEdicaoSap(PedidoVendaEdicaoDTO pedidoVendaEdicaoDTO)
    {
        return new PedidoVendaEdicao
        {
            DocDueDate = pedidoVendaEdicaoDTO.DataEntrega,
            ContactPersonCode = pedidoVendaEdicaoDTO.PessoaContato,
            NumAtCard = pedidoVendaEdicaoDTO.NumeroReferenciaCliente,
            DocumentLines = pedidoVendaEdicaoDTO.Itens?.Select(item => 
            new PedidoVendaItemEdicao
            {
                ItemCode = item.Item,
                LineNum = item.Linha,
                Quantity = item.Quantidade,
                UnitPrice = item.Preco,
                TaxCode = item.Imposto
            })
            .ToList()
        };
    }

    private PedidoVendaAnexoEdicao MapearParaEdicaoAnexoSap(PedidoVendaEdicaoDTO pedidoVendaEdicaoDTO)
    {
        return new PedidoVendaAnexoEdicao
        {
            DocDueDate = pedidoVendaEdicaoDTO.DataEntrega,
            ContactPersonCode = pedidoVendaEdicaoDTO.PessoaContato,
            NumAtCard = pedidoVendaEdicaoDTO.NumeroReferenciaCliente,
            AttachmentEntry = pedidoVendaEdicaoDTO.CodigoAnexo,
            DocumentLines = pedidoVendaEdicaoDTO.Itens?.Select(item =>
            new PedidoVendaItemEdicao
            {
                ItemCode = item.Item,
                LineNum = item.Linha,
                Quantity = item.Quantidade,
                UnitPrice = item.Preco,
                TaxCode = item.Imposto
            })
            .ToList()
        };
    }

    private async Task<PedidoVendaRetornoDTO> MapearParaDTO(PedidoVendaRetorno pedidoVendaRetorno, AnexoRetorno? anexoRetorno)
    {
        var retornarDadosContato = await _parceiroNegocioService.RetornarPessoasContatoPorCodigo(pedidoVendaRetorno.ContactPersonCode);

        var anexos = anexoRetorno?.Attachments2_Lines?.Select(anexo => new AnexoPedidoRetornoDTO
        {
            Codigo = anexo.AbsoluteEntry,
            Linha = anexo.LineNum,
            NomeArquivo = anexo.FileName,
            CaminhoDestino = anexo.SourcePath,
            ExtensaoArquivo = anexo.FileExtension,
            Tamanho = anexo.FileSize
        })
        .ToList();

        var pedidoVenda = new PedidoVendaRetornoDTO
        {
            Cliente = pedidoVendaRetorno.CardName,
            CodigoCliente = pedidoVendaRetorno.CardCode,
            DocumentoEntrada = pedidoVendaRetorno.DocEntry,
            Documento = pedidoVendaRetorno.DocNum,
            NumeroReferenciaCliente = pedidoVendaRetorno.NumAtCard,
            ValorTotalPedido = pedidoVendaRetorno.DocTotal.ToString("C", new CultureInfo("pt-BR")),
            DataEntrega = pedidoVendaRetorno.DocDueDate,
            DataLancamento = pedidoVendaRetorno.DocDate,
            DataDocumento = pedidoVendaRetorno.TaxDate,
            Empresa = pedidoVendaRetorno.BPL_IDAssignedToInvoice,
            CodigoPessoaContato = pedidoVendaRetorno.ContactPersonCode,
            PessoaContato = retornarDadosContato.Nome,
            EmailContato = retornarDadosContato.EmailContato,
            Itens = [.. pedidoVendaRetorno.DocumentLines.Select(documento => new ItemPedidoRetornoDTO
            {
                Linha = documento.LineNum,
                Codigo = documento.ItemCode,
                Descricao = documento.ItemDescription,
                Imposto = documento.TaxCode,
                Preco = documento.UnitPrice,
                Quantidade = documento.Quantity
            })],
            Anexos = anexos ?? []
        };

        return pedidoVenda;
    }

    private async Task<PedidoVendaRetornoDTO> ObterPedidoVendaPorCodigo(int codigo)
    {
        var dadosConsulta = MontarQueryPedidoVenda(codigo);
        var dadosPedidoVenda = await _sapBase.QueryParam(dadosConsulta.Item1, dadosConsulta.Item2,
           r => new PedidoVendaEdicaoRetorno
           {
               DocumentoEntrada = r.GetInt32(0),
               Documento = r.GetInt32(1),
               DataEntrega = r.GetDateTime(2),
               DataLancamento = r.GetDateTime(3),
               DataDocumento = r.GetDateTime(4),
               NumeroReferenciaCliente = r.IsDBNull(5) ? string.Empty : r.GetString(5),
               ValorTotalPedido = r.GetDecimal(6),
               CodigoAnexo = r.IsDBNull(7) ? null : r.GetInt32(7),
               CodigoCliente = r.GetString(8),
               Cliente = r.GetString(9),
               Linha = r.GetInt32(10),
               CodigoItem = r.GetString(11),
               DescricaoItem = r.GetString(12),
               Quantidade = r.GetDecimal(13),
               PrecoUnitario = r.GetDecimal(14),
               Imposto = r.GetString(15),
               CodigoPessoaContato = r.IsDBNull(16) ? null : r.GetInt32(16),
               PessoaContato = r.IsDBNull(17) ? string.Empty : r.GetString(17),
               EmailContato = r.IsDBNull(18) ? string.Empty : r.GetString(18)
           });

        var pedidoVenda = dadosPedidoVenda.GroupBy(x => x.Documento)
                                          .Select((pedido) => new PedidoVendaRetornoDTO
                                          {
                                              Documento = pedido.Key,
                                              DocumentoEntrada = pedido.First().DocumentoEntrada,
                                              CodigoCliente = pedido.First().CodigoCliente,
                                              Cliente = pedido.First().Cliente,
                                              ValorTotalPedido = pedido.First().ValorTotalPedido.ToString("C", new CultureInfo("pt-BR")),
                                              CodigoAnexo = pedido.First().CodigoAnexo,
                                              DataEntrega = pedido.First().DataEntrega,
                                              DataDocumento = pedido.First().DataDocumento,
                                              DataLancamento = pedido.First().DataLancamento,
                                              NumeroReferenciaCliente = pedido.First().NumeroReferenciaCliente,
                                              CodigoPessoaContato = pedido.First().CodigoPessoaContato,
                                              PessoaContato = pedido.First().PessoaContato,
                                              EmailContato = pedido.First().EmailContato,
                                              Itens = [.. pedido.Select((item) => new ItemPedidoRetornoDTO
                                              {
                                                  Linha = item.Linha,
                                                  Codigo = item.CodigoItem,
                                                  Descricao = item.DescricaoItem,
                                                  Quantidade = item.Quantidade,
                                                  Preco = item.PrecoUnitario,
                                                  Imposto = item.Imposto
                                              })]
                                          })
                                          .FirstOrDefault();

        if(pedidoVenda?.CodigoAnexo is not null)
            pedidoVenda.Anexos = await _anexoService.ObterAnexos((int)pedidoVenda.CodigoAnexo);

        return pedidoVenda is null ? new PedidoVendaRetornoDTO() : pedidoVenda;
    }

    private string MontarQueryProximoPedidoVenda()
    {
        var query = @" SELECT
	                       IFNULL(MAX(""DocNum""), 0) + 1 AS ""ProximoCodigo""
                       FROM
                           ORDR";
        return query;
    }

    private (string, List<OdbcParameter>) MontarQuery(PedidoVendasFiltroConsultaDTO filtros)
    {
        var query = new StringBuilder(@"
                          SELECT
                              ""DocNum"" AS ""Documento"",	                          
                              ""DocEntry"" AS ""NumeroDocumento"",
	                          ""CardCode"" AS ""CodigoCLiente"",
	                          ""CardName"" AS ""NomeCliente"",
	                          ""NumAtCard"" AS ""NumeroReferenciaCliente"",
	                          ""DocDate"" AS ""DataLancamento"",
	                          ""DocDueDate"" AS ""DataEntrega"",
	                          ""DocTotal"" AS ""TotalDocumento"",
	                          ""DocStatus"" AS ""Status""
                          FROM
	                          ORDR
                          WHERE 1 = 1");

        var parametros = new List<OdbcParameter>();

        CriarFiltro(query, "DocNum", filtros.Documentos, parametros);
        CriarFiltro(query, "CardCode", filtros.Clientes, parametros);
        CriarFiltro(query, "DocStatus", filtros.Status, parametros);

        if (!string.IsNullOrEmpty(filtros.DataEntrega))
        {
            var data = DateTime.ParseExact(filtros.DataEntrega, "dd/MM/yyyy", CultureInfo.InvariantCulture);
            query.Append(@" AND ""DocDueDate"" = ?");
            parametros.Add(new OdbcParameter { Value = data });
        }
        
        query.Append($@" ORDER BY ""DocNum"" DESC LIMIT 20");

        return (query.ToString(), parametros);

    }

    private (string, List<OdbcParameter>) MontarQueryPedidoVenda(int codigo)
    {
        var query = new StringBuilder(@"SELECT
	                                        -- Dados do Pedido (Cabeçalho)
                                            T0.""DocEntry"" AS ""DocumentoEntrada"",
	                                        T0.""DocNum"" AS ""Documento"",
	                                        T0.""DocDueDate"" AS ""DataEntrega"",
                                            T0.""DocDate"" AS ""DataLancamento"",
	                                        T0.""TaxDate"" AS ""DataDocumento"",
	                                        T0.""NumAtCard"" AS ""ReferenciaCliente"",
                                            T0.""DocTotal"" AS ""ValorTotalPedido"",
                                            T0.""AtcEntry"" AS ""CodigoAnexo"",
	                                        -- Dados do Cliente (Cadastro)
	                                        T1.""CardCode"" AS ""CodigoCliente"",
	                                        T1.""CardName"" AS ""Cliente"",
	                                        -- Dados dos Itens (Linhas)
	                                        T2.""LineNum"" AS ""Linha"",
	                                        T2.""ItemCode"" AS ""CodigoItem"",
	                                        T2.""Dscription"" AS ""DescricaoItem"",
	                                        T2.""Quantity"" AS ""Quantidade"",
	                                        T2.""Price"" AS ""PrecoUnitario"",
                                            T2.""TaxCode"" AS ""Imposto"",
	                                        T3.""CntctCode"" AS ""CodigoPessoaContato"",
	                                        T3.""Name"" AS ""NomeContato"",
	                                        T3.""E_MailL"" AS ""EmailContato""
	                                        -- E-mail específico do contato
                                        FROM
	                                        ORDR T0
                                        INNER JOIN OCRD T1 ON
	                                        T0.""CardCode"" = T1.""CardCode""
                                        INNER JOIN RDR1 T2 ON
	                                        T0.""DocEntry"" = T2.""DocEntry""
                                        LEFT JOIN OCPR T3 ON
	                                        T0.""CntctCode"" = T3.""CntctCode""
                                        WHERE
	                                        T0.""DocEntry"" = ?
                                            AND T0.""CANCELED"" = 'N'   
                                            AND T2.""LineStatus"" = 'O' 
                                        ORDER BY
	                                        T2.""LineNum"" ASC");

        var parametros = new List<OdbcParameter> { new() { Value = codigo } };
        return (query.ToString(), parametros);
    }

    private async Task<Decimal> RetornarValorTotalItens(int documentoEntrada)
    {
        var query = @"SELECT ""Price"" FROM RDR1 WHERE ""DocEntry"" = ? AND ""LineStatus"" = 'O' ";
        var parametros = new List<OdbcParameter> { new() { Value = documentoEntrada } };
        var precos = await _sapBase.QueryParam<decimal>(query, parametros, r => r.GetDecimal(0));
        return precos.Sum();
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
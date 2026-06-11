using B1Plus.Api.DTO;
using B1Plus.Api.Helper;
using B1Plus.Api.Servicos.ApiResponse;
using B1Plus.Api.Servicos.SAP;
using Microsoft.AspNetCore.Mvc;

namespace B1Plus.Api.Controllers;

[ApiController]
[Route("[controller]")]
public class PedidoVendaController(PedidoVendaService pedidoVendaService) : ControllerBase
{
    private readonly PedidoVendaService _pedidoVendaService = pedidoVendaService;

    [HttpGet("retornarProximoCodigo")]
    public async Task<IActionResult> ObterProximoCodigo()
    {
        var pedido = await _pedidoVendaService.ObterProximoCodigo();
        return Ok(pedido);
    }


    [HttpGet("{documentoEntrada}")]
    public async Task<IActionResult> ObterPorDocumentoEntrada(int documentoEntrada)
    {
        var pedido = await _pedidoVendaService.ObterPorDocumentoEntrada(documentoEntrada);
        return Ok(pedido);
    }
    
    [HttpPost]
    public async Task<IActionResult> Buscar(PedidoVendasFiltroConsultaDTO filtros)
    {
        var pedido = await _pedidoVendaService.Buscar(filtros);
        return Ok(pedido);
    }

    [HttpPost("criar")]
    public async Task<ApiResponse<PedidoVendaRetornoDTO>> Criar(PedidoVendaDTO pedidoVendaDto)
    {
        try
        {
            var pedido = await _pedidoVendaService.Criar(pedidoVendaDto);
            return ApiResponseHelper.Ok(pedido, "Operação concluída com sucesso");
        }
        catch (Exception ex)
        {
            var sapError = SapErrorParser.Parse(ex.Message);

            return ApiResponseHelper.Fail<PedidoVendaRetornoDTO>(
                sapError.Code,
                sapError.Message
            );
        }
    }

    [HttpPatch("editar/{codigo}")]
    public async Task<ApiResponse<PedidoVendaRetornoDTO>> Editar(int codigo, [FromBody] PedidoVendaEdicaoDTO pedidoVendaEdicaoDTO)
    {
        try
        {
            var pedido = await _pedidoVendaService.Editar(codigo, pedidoVendaEdicaoDTO);
            return ApiResponseHelper.Ok(pedido, "Operação concluída com sucesso");
        }
        catch (Exception ex)
        {
            var sapError = SapErrorParser.Parse(ex.Message);

            return ApiResponseHelper.Fail<PedidoVendaRetornoDTO>(
                sapError.Code,
                sapError.Message
            );
        }  
    }
}
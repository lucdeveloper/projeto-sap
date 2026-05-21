using Microsoft.AspNetCore.Mvc;
using sap.DTO;
using sap.Servicos.SAP;

namespace sap.Controllers;

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
    public async Task<IActionResult> Criar(PedidoVendaDTO pedidoVendaDto)
    {
        var pedido = await _pedidoVendaService.Criar(pedidoVendaDto);
        return Ok(pedido);
    }

    [HttpPatch("editar/{codigo}")]
    public async Task<IActionResult> Editar(int codigo, [FromBody] PedidoVendaEdicaoDTO pedidoVendaEdicaoDTO)
    {
        var pedido = await _pedidoVendaService.Editar(codigo, pedidoVendaEdicaoDTO);
        return Ok(pedido);
    }
}
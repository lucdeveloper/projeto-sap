using B1Plus.Api.DTO;
using B1Plus.Api.Servicos.SAP;
using Microsoft.AspNetCore.Mvc;

namespace B1Plus.Api.Controllers;

[ApiController]
[Route("[controller]")]
public class VendedorController(VendedorService vendedorService) : Controller
{
    private readonly VendedorService _vendedorService = vendedorService;

    [HttpPost]
    public async Task<IActionResult> Buscar(VendedorFiltroConsultaDTO filtros)
    {
        var vendedores = await _vendedorService.Buscar(filtros);
        return Ok(vendedores);
    }

    [HttpGet("obterValorComissionavel/{documentoEntrada}")]
    public async Task<IActionResult> ObterValorComissionavelPedidoVenda(int documentoEntrada)
    {
        var valoresComissionaveis = await _vendedorService.ObterValoresComissionavel(documentoEntrada);
        return Ok(valoresComissionaveis);
    }
}
using B1Plus.Api.DTO;
using B1Plus.Api.Servicos.SAP;
using Microsoft.AspNetCore.Mvc;

namespace B1Plus.Api.Controllers;

[ApiController]
[Route("[controller]")]
public class ImpostoController(ImpostoService impostoService) : Controller
{
    private readonly ImpostoService _impostoService = impostoService;

    [HttpPost]
    public async Task<IActionResult> BuscarTodos(ImpostoFiltroConsultaDTO filtros)
    {
        var parceirosNegocio = await _impostoService.BuscarTodos(filtros);
        return Ok(parceirosNegocio);
    }
}

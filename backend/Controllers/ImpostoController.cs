using Microsoft.AspNetCore.Mvc;
using sap.DTO;
using sap.Servicos.SAP;

namespace sap.Controllers;

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

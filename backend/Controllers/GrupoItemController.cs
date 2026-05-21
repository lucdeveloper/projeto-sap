using Microsoft.AspNetCore.Mvc;
using sap.DTO;
using sap.Servicos.SAP;

namespace sap.Controllers;

[ApiController]
[Route("[controller]")]
public class GrupoItemController(GrupoItemService grupoItemService) : ControllerBase
{
    private readonly GrupoItemService _grupoItemService = grupoItemService;

    [HttpPost]
    public async Task<IActionResult> BuscarTodos(GrupoItemFiltroConsultaDTO filtros)
    {
        var grupos = await _grupoItemService.BuscarTodos(filtros);
        return Ok(grupos);
    }
}
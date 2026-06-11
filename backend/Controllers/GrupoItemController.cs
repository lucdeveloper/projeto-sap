using B1Plus.Api.DTO;
using B1Plus.Api.Servicos.SAP;
using Microsoft.AspNetCore.Mvc;

namespace B1Plus.Api.Controllers;

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
using B1Plus.Api.DTO;
using B1Plus.Api.Servicos.SAP;
using Microsoft.AspNetCore.Mvc;

namespace B1Plus.Api.Controllers;

[ApiController]
[Route("[controller]")]
public class ItemController(ItemService itemService) : ControllerBase
{
    private readonly ItemService _itemService = itemService;

    [HttpGet("{codigo}")]
    public async Task<IActionResult> BuscarPorCodigo(string codigo)
    {
        var item = await _itemService.BuscarPorCodigo(codigo);
        return Ok(item);
    }


    [HttpPost]
    public async Task<IActionResult> BuscarTodos(ItemFiltroConsultaDTO filtros)
    {
        var parceirosNegocio = await _itemService.BuscarTodos(filtros);
        return Ok(parceirosNegocio);
    }
}

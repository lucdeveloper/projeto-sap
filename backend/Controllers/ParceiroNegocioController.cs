using Microsoft.AspNetCore.Mvc;
using sap.DTO;
using sap.Servicos.SAP;

namespace sap.Controllers;

[ApiController]
[Route("[controller]")]
public class ParceiroNegocioController(ParceiroNegocioService parceiroNegocioService) : ControllerBase
{
    private readonly ParceiroNegocioService _parceiroNegocioService = parceiroNegocioService;


    [HttpGet("{codigo}")]
    public async Task<IActionResult> BuscarPorCodigo(string codigo)
    {
        var parceiroNegocio = await _parceiroNegocioService.BuscarPorCodigo(codigo);
        return Ok(parceiroNegocio);
    }


    [HttpPost]
    public async Task<IActionResult> BuscarTodos(ParceiroNegociosFiltroConsultaDTO filtros)
    {
        var parceirosNegocio = await _parceiroNegocioService.BuscarTodos(filtros);
        return Ok(parceirosNegocio);
    }

    [HttpPost("pessoas-contato")]
    public async Task<IActionResult> RetornarPessoasContato(PessoaContatoFiltroConsultaDTO filtros)
    {
        var parceirosNegocio = await _parceiroNegocioService.RetornarPessoasContato(filtros);
        return Ok(parceirosNegocio);
    }
}

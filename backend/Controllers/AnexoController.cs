using Microsoft.AspNetCore.Mvc;
using sap.DTO;
using sap.Servicos.SAP;

namespace sap.Controllers;

[ApiController]
[Route("[controller]")]
public class AnexoController(AnexoService anexoService) : Controller
{
    private readonly AnexoService _anexoService = anexoService;

    [HttpGet]
    public async Task<IActionResult> ObterPastas()
    {
        var dadosAnexo = await _anexoService.BuscarAtivos();
        return Ok(dadosAnexo);
    }

    [HttpPost]
    public async Task<IActionResult> Editar(AnexoConsultaDTO anexo)
    {
        var dadosAnexo = await _anexoService.Editar(anexo);
        return Ok(dadosAnexo);
    }
}

using B1Plus.Api.Servicos.SAP;
using Microsoft.AspNetCore.Mvc;

namespace B1Plus.Api.Controllers;

[ApiController]
[Route("[controller]")]
public class AnexoController(AnexoService anexoService) : Controller
{
    private readonly AnexoService _anexoService = anexoService;

    [HttpGet]
    public async Task<IActionResult> BuscarAnexos()
    {
        var dadosAnexo = await _anexoService.BuscarAnexos();
        return Ok(dadosAnexo);
    }

    [HttpGet("buscar")]
    public async Task<IActionResult> MontarExibicaoAnexo([FromQuery] int codigo, [FromQuery] int numeroLinha)
    {
        try
        {
            var anexo = await _anexoService.MontarExibicaoAnexo(codigo, numeroLinha);
            return File(anexo.Bytes, anexo.ContentType);
        }
        catch (FileNotFoundException ex)
        {
            return NotFound(new { mensagem = ex.Message });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new
            {
                mensagem = "Erro ao montar exibição do anexo.",
                detalhe = ex.Message
            });
        }
    }
}
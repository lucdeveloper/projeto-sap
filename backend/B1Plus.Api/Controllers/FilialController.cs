using B1Plus.Api.Servicos.SAP;
using Microsoft.AspNetCore.Mvc;

namespace B1Plus.Api.Controllers;

[ApiController]
[Route("[controller]")]
public class FilialController(FilialService filialService) : Controller
{
    private readonly FilialService _filialService = filialService;

    [HttpGet]
    public async Task<IActionResult> BuscarAtivos()
    {
        var filiais = await _filialService.BuscarAtivos();
        return Ok(filiais);
    }
}
using Microsoft.AspNetCore.Mvc;

using sap.Servicos.SAP;

namespace sap.Controllers;

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
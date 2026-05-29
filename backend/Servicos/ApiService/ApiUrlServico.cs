namespace sap.Servicos.ApiService;

public class ApiUrlServico(IHttpContextAccessor httpContextAccessor) : IApiUrlServico
{
    private readonly IHttpContextAccessor _httpContextAccessor = httpContextAccessor;

    public string BaseUrl
    {
        get
        {
            var request = _httpContextAccessor.HttpContext?.Request;

            if (request == null)
                return string.Empty;

            return $"{request.Scheme}://{request.Host}";
        }
    }
}
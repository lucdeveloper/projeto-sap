namespace B1Plus.Api.Servicos.ApiResponse;

public class ApiResponse<T>
{
    public bool Success { get; set; }
    public int Code { get; set; }
    public string Message { get; set; } = string.Empty;
    public T? Data { get; set; }
}

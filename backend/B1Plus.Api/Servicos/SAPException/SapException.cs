namespace B1Plus.Api.Servicos.SAPException;

public class SapException(int code, string message) : Exception(message)
{
    public int Code { get; } = code;
}
using System.Text.RegularExpressions;
using B1Plus.Api.Servicos.SAPException;

namespace B1Plus.Api.Helper;

public static class SapErrorParser
{
    public static SapError Parse(string sapMessage)
    {
        if (string.IsNullOrWhiteSpace(sapMessage))
        {
            return new SapError { Code = 0, Message = "Erro desconhecido" };
        }

        int code = 0;
        string message = sapMessage;

        try
        {
            message = Regex.Unescape(message);
            var start = message.IndexOf('(');
            var end = message.IndexOf(')');

            if (start >= 0 && end > start)
            {
                var codeStr = message.Substring(start + 1, end - start - 1);
                int.TryParse(codeStr, out code);

                message = message.Substring(end + 1);
            }

            message = message
                .Replace("\"", "")
                .Replace("{", "")
                .Replace("}", "")
                .Replace("\\", "")
                .Replace("\n", " ")
                .Replace("\r", " ")
                .Trim();

            while (message.Contains("  "))
                message = message.Replace("  ", " ");

            if (string.IsNullOrWhiteSpace(message))
                message = "Erro ao processar mensagem do SAP";
        }
        catch
        {
            return new SapError
            {
                Code = 0,
                Message = "Erro ao interpretar mensagem do SAP"
            };
        }

        string mensagemFormatada = code > 0 ? $"({code}) {message}" : message;

        return new SapError
        {
            Code = code,
            Message = mensagemFormatada
        };
    }
}
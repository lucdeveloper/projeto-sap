using System.Globalization;

namespace B1Plus.Api.Extensions;

public static class MoedaExtensions
{
    private static readonly CultureInfo CulturaBR = new("pt-BR");

    public static string ConverterMoedaBR(this decimal valor)
        => valor.ToString("C", CulturaBR);
}

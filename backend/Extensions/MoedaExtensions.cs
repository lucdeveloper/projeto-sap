using System.Globalization;

namespace sap.Extensions;

public static class MoedaExtensions
{
    private static readonly CultureInfo CulturaBR = new("pt-BR");

    public static string ConverterMoedaBR(this decimal valor)
        => valor.ToString("C", CulturaBR);
}

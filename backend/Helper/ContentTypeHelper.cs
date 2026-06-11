namespace B1Plus.Api.Helper;

public static class ContentTypeHelper
{
    public static string Retornar(string extensao)
    {
        extensao = extensao.ToLower();

        return extensao switch
        {
            // Imagens
            "jpg" => "image/jpeg",
            "jpeg" => "image/jpeg",
            "png" => "image/png",
            "gif" => "image/gif",
            "bmp" => "image/bmp",
            "webp" => "image/webp",

            // PDF
            "pdf" => "application/pdf",

            // Texto
            "txt" => "text/plain",

            // Word
            "doc" =>
                "application/msword",

            "docx" =>
                "application/vnd.openxmlformats-officedocument.wordprocessingml.document",

            // Excel
            "xls" =>
                "application/vnd.ms-excel",

            "xlsx" =>
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",

            // PowerPoint
            "ppt" =>
                "application/vnd.ms-powerpoint",

            "pptx" =>
                "application/vnd.openxmlformats-officedocument.presentationml.presentation",

            // Compactados
            "zip" => "application/zip",
            "rar" => "application/vnd.rar",

            // CSV
            "csv" => "text/csv",

            // JSON/XML
            "json" => "application/json",
            "xml" => "application/xml",

            _ => "application/octet-stream"
        };
    }
}
export class AnexoIconeHelper {

    static obterIcone(extensao: string): string {

        switch (extensao.toLowerCase()) {

            case "pdf":
                return "pdf-attachment";

            case "png":
            case "jpg":
            case "jpeg":
                return "card";

            case "doc":
            case "docx":
            case "txt":
                return "document-text";

            case "xls":
            case "xlsx":
                return "excel-attachment";

            case "zip":
                return "attachment-zip-file";

            default:
                return "attachment";
        }
    }
}
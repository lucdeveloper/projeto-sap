import { useState } from "react";
import { ApiResponse } from "../interfaces/ApiResponse";
import { useToast } from "../providers/ToastProvider";
import { useMessageBox } from "../providers/MessageBoxProvider";

export function useApi() {
    const toast = useToast();
    const messageBox = useMessageBox();
    const [loading, setLoading] = useState(false);

    const execute = async <T>(promisse: () => Promise<ApiResponse<T>>): Promise<T | null> => {
        setLoading(true);

        try {
            const response = await promisse();

            if (!response) {
                messageBox.showError("Resposta inválida do servidor");
                return null;
            }

            if (!response.success) {
                messageBox.showError(response.message);
                return null;
            }

            toast.show(response.message || "Operação realizada com sucesso");
            return response.data;

        } catch (error: any) {
            messageBox.showError(error?.message || "Erro inesperado");
            return null;

        } finally {
            setLoading(false);
        }
    };

    return { execute, loading };
}
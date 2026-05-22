import { useState } from "react";
import { AnexoDTO } from "../interfaces/Anexo";
import { anexoService } from "../services/anexoService";

export function useAnexo() {
    const [anexo, setAnexo] = useState<AnexoDTO>();
    const [loading, setLoading] = useState(false);
    
    const carregarAnexo = async () => {
        setLoading(true);

        try {
            const data = await anexoService.listar();
            setAnexo(data);
        } catch (error) {
            console.error("Erro ao carrega anexo:", error);
        } finally {
            setLoading(false);
        }
    };

    return { anexo, loading, carregarAnexo };
}
import { useState } from 'react';
import { filialService } from '../services/filialService.ts';
import { FilialDTO } from '../interfaces/Filial.ts';

export function useFilialSearch() {
    const [filial, setFilial] = useState<FilialDTO[]>([]);
    const [loading, setLoading] = useState(false);
    
    const carregarFiliais = async () => {
        setLoading(true);

        try {
            const data = await filialService.listar();
            setFilial(data);
        } catch (error) {
            console.error("Erro ao carregar filiais:", error);
        } finally {
            setLoading(false);
        }
    };

    return { filial, loading, carregarFiliais };
}
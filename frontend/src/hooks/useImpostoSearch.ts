import { useState } from 'react';
import { FiltrosImposto, ImpostoDTO } from '../interfaces/Imposto';
import { impostoService } from '../services/impostoService';

export function useImpostoSearch() {
    const [impostos, setImpostos] = useState<ImpostoDTO[]>([]);
    const [loading, setLoading] = useState(false);
    
    const [filtrosSalvos, setFiltrosSalvos] = useState<FiltrosImposto>({ 
        codigos: [], 
        nomes: [] 
    });

    const [inputCodigo, setInputCodigo] = useState("");
    const [inputNome, setInputNome] = useState("");

    const carregarImpostos = async (override?: FiltrosImposto) => {
        setLoading(true);

        let finalCodigos: string[];
        let finalNomes: string[];

        if (override) {
            finalCodigos = override.codigos;
            finalNomes = override.nomes;
        } else {
            const pendenteCodigo = inputCodigo.trim();
            const pendenteNomes = inputNome.trim();

            finalCodigos = [...new Set([...filtrosSalvos.codigos, ...(pendenteCodigo ? [pendenteCodigo] : [])])];
            finalNomes = [...new Set([...filtrosSalvos.nomes, ...(pendenteNomes ? [pendenteNomes] : [])])];
        }

        try {
            const data = await impostoService.listar({ 
                codigos: finalCodigos, 
                nomes: finalNomes 
            });
            setImpostos(data);
        } catch (error) {
            console.error("Erro ao carregar impostos:", error);
        } finally {
            setLoading(false);
        }
    };

    const resetBuscaImposto = () => {
        setImpostos([]);
        setFiltrosSalvos({ codigos: [], nomes: [] });
        setInputCodigo("");
        setInputNome("");
    };

    return { 
        impostos, 
        loading, 
        filtrosSalvos, 
        setFiltrosSalvos, 
        inputCodigo, 
        setInputCodigo, 
        inputNome, 
        setInputNome, 
        carregarImpostos, 
        resetBuscaImposto,
        setImpostos 
    };
}
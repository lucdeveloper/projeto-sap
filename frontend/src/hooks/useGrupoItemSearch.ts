import { useState } from 'react';
import { grupoItemServico } from '../services/grupoItemServico';
import { FiltrosGrupoItem, GruposItemDTO } from '../interfaces/GruposItem';

export function useGrupoItemSearch() {
    const [grupos, setGrupos] = useState<GruposItemDTO[]>([]);
    const [loading, setLoading] = useState(false);
    const [filtrosSalvos, setFiltrosSalvos] = useState<FiltrosGrupoItem>({ nomes: [], numeros: [] });

    const [inputNomes, setInputNomes] = useState("");
    const [inputNumeros, setInputNumeros] = useState("");

    const carregarGrupos = async (override?: FiltrosGrupoItem) => {
        setLoading(true);

        let finalNomes: string[];
        let finalNumeros: string[];

        if (override) {
            finalNomes = override.nomes;
            finalNumeros = override.numeros;
        } else {
            const pendenteNomes = inputNomes.trim();
            const pendenteNumeros = inputNumeros.trim();

            finalNomes = [...new Set([...filtrosSalvos.nomes, ...(pendenteNomes ? [pendenteNomes] : [])])];
            finalNumeros = [...new Set([...filtrosSalvos.numeros, ...(pendenteNumeros ? [pendenteNumeros] : [])])];
        }

        try {
            const data = await grupoItemServico.listar({ nomes: finalNomes, numeros: finalNumeros });
            setGrupos(data);
        } catch (error) {
            console.error("Erro ao carregar grupos:", error);
        } finally {
            setLoading(false);
        }
    };

    const resetBuscaGrupos = () => {
        setGrupos([]);
        setFiltrosSalvos({ nomes: [], numeros: [] });
        setInputNomes("");
        setInputNumeros("");
    };

    return { 
        grupos, 
        loading, 
        filtrosSalvos, 
        setFiltrosSalvos, 
        inputNomes, 
        setInputNomes, 
        inputNumeros, 
        setInputNumeros, 
        carregarGrupos, 
        resetBuscaGrupos,
        setGrupos 
    };
}
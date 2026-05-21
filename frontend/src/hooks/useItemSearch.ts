import { useState } from 'react';
import { itemService } from '../services/itemService';
import {  FiltrosItemPedidoVenda, ItemPedidoVendaDTO } from '../interfaces/PedidoVendaItem';

export function useItemSearch() {
    const [itens, setItens] = useState<ItemPedidoVendaDTO[]>([]);
    const [loading, setLoading] = useState(false);
    
    const [filtrosSalvos, setFiltrosSalvos] = useState<FiltrosItemPedidoVenda>({ 
        numeros: [], 
        grupos: [] 
    });

    const [inputNumero, setInputNumero] = useState("");
    const [inputGrupo, setInputGrupo] = useState("");

    const carregarItens = async (override?: FiltrosItemPedidoVenda) => {
        setLoading(true);

        let finalNumeros: string[];
        let finalGrupos: number[];

        if (override) {
            finalNumeros = override.numeros;
            finalGrupos = override.grupos;
        } else {
            const pendenteNumero = inputNumero.trim();
            const pendenteGrupo = Number(inputGrupo.trim());

            finalNumeros = [...new Set([...filtrosSalvos.numeros, ...(pendenteNumero ? [pendenteNumero] : [])])];
            finalGrupos = [...new Set([...filtrosSalvos.grupos, ...(pendenteGrupo ? [pendenteGrupo] : [])])];
        }

        try {
            const data = await itemService.listar({ 
                numeros: finalNumeros, 
                grupos: finalGrupos 
            });
            setItens(data);
        } catch (error) {
            console.error("Erro ao carregar itens:", error);
        } finally {
            setLoading(false);
        }
    };

    const resetBuscaItens = () => {
        setItens([]);
        setFiltrosSalvos({ numeros: [], grupos: [] });
        setInputNumero("");
        setInputGrupo("");
    };

    return { 
        itens, 
        loading, 
        filtrosSalvos, 
        setFiltrosSalvos, 
        inputNumero, 
        setInputNumero, 
        inputGrupo, 
        setInputGrupo, 
        carregarItens, 
        resetBuscaItens,
        setItens 
    };
}
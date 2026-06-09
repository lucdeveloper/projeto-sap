import { useState } from "react";
import { FiltrosPedidoVendaVendedor, PedidoVendaValoresComissionaveisDTO, PedidoVendaVendedorDTO } from "../interfaces/PedidoVendaVendedor";
import { pedidoVendaVendedorService } from "../services/pedidoVendaVendedorService";

export function usePedidoVendaVendedor() {
    const [pedidoVendaVendedor, setPedidoVendaVendedor] = useState<PedidoVendaVendedorDTO[]>([]);
    const [valoresComissionaveis, setValoresComissionaveis] = useState<PedidoVendaValoresComissionaveisDTO[]>([]);
    const [loading, setLoading] = useState(false);
    
    const [filtrosSalvos, setFiltrosSalvos] = useState<FiltrosPedidoVendaVendedor>({ 
        codigos: [], 
        nomes: [] 
    });

    const [inputCodigo, setInputCodigo] = useState("");
    const [inputNome, setInputNome] = useState("");

    const carregarPedidosVendaVendedor = async (override?: FiltrosPedidoVendaVendedor) => {
        setLoading(true);

        let finalCodigos: number[];
        let finalNomes: string[];

        if (override) {
            finalCodigos = override.codigos;
            finalNomes = override.nomes;
        } else {
            const pendenteCodigo = Number(inputCodigo.trim());
            const pendenteNomes = inputNome.trim();

            finalCodigos = [...new Set([...filtrosSalvos.codigos, ...(pendenteCodigo ? [pendenteCodigo] : [])])];
            finalNomes = [...new Set([...filtrosSalvos.nomes, ...(pendenteNomes ? [pendenteNomes] : [])])];
        }

        try {
            const data = await pedidoVendaVendedorService.listar({ 
                codigos: finalCodigos, 
                nomes: finalNomes 
            });
            setPedidoVendaVendedor(data);
        } catch (error) {
            console.error("Erro ao carregar vendedores:", error);
        } finally {
            setLoading(false);
        }
    };

    const carregarValoresComissionaveis = async (documentoEntrada: number ) => {
        setLoading(true);

        try {
            const data = await pedidoVendaVendedorService.obterValorComissionavel(documentoEntrada)
            setValoresComissionaveis(data);
        } catch (error) {
            console.error("Erro ao carregar valores comissionaveis:", error);
        } finally {
            setLoading(false);
        }
    };

    const resetBuscaPedidoVendaVendedor = () => {
        setPedidoVendaVendedor([]);
        setFiltrosSalvos({ codigos: [], nomes: [] });
        setInputCodigo("");
        setInputNome("");
    };

    return { 
        pedidoVendaVendedor, 
        loading, 
        filtrosSalvos, 
        setFiltrosSalvos, 
        inputCodigo, 
        setInputCodigo, 
        inputNome, 
        setInputNome, 
        carregarPedidosVendaVendedor, 
        resetBuscaPedidoVendaVendedor,
        setPedidoVendaVendedor,
        carregarValoresComissionaveis,
        valoresComissionaveis 
    };
}
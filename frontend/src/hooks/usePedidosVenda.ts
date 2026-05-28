import { useState } from "react";
import { pedidoVendaService } from "../services/pedidoVendaService.ts";
import { FiltrosPedidosVenda, PedidosVendaDTO, PedidoVenda, PedidoVendaEdicao, PedidoVendaRetornoDTO } from "../interfaces/PedidosVenda.ts";

export function usePedidosVenda() {
    const [proximoCodigo, setProximoCodigo] = useState<number | null>(null);
    const [loadings, setLoadings] = useState({ pedidos: false, proximoCodigo: false, criar: false, editar: false})
    const [pedidos, setPedidos] = useState<PedidosVendaDTO[]>([]);
    const [pedido, setPedido] = useState<PedidosVendaDTO>();
    const [pedidoEdicao, setPedidoEdicao] = useState<PedidoVendaRetornoDTO>();
    const [filtrosSalvos, setFiltrosSalvos] = useState<FiltrosPedidosVenda>({ clientes: [], status: [], documentos:[] });
    const [inputCliente, setInputCliente] = useState("");
    const [inputDocumento, setInputDocumento] = useState("");

    const carregarProximoCodigo = async () => {
        setLoadings(prev => ({ ...prev, proximoCodigo: true }));
        try {
            const codigo = await pedidoVendaService.retornarProximoCodigo();
            setProximoCodigo(codigo);
        } catch (err) {
            console.error("Erro ao carregar código");
        } finally {
            setLoadings(prev => ({ ...prev, proximoCodigo: false }));
        }
    };

    const carregarPorDocumentoEntrada = async (documentoEntrada: number) => {
        
        setLoadings(prev => ({ ...prev, editar: true }));
    
        try {
             const data = await pedidoVendaService.retornarPorDocumentoEntrada(documentoEntrada);
             setPedidoEdicao(data);
             return data;
        } catch (error) {
            console.error("Erro ao carregar pedidos de venda:", error);
        } finally {
            setLoadings(prev => ({ ...prev, pedidos: false }));
        }      
    };

    const carregarPedidosVenda = async (filtros?: FiltrosPedidosVenda) => {
        
        setLoadings(prev => ({ ...prev, pedidos: true }));
    
        let finalClientes: string[];
        let finalDocumentos: number[];
        let statusBusca = filtros?.status ?? filtrosSalvos.status
    
        if (filtros) {
            finalClientes = filtros.clientes;
            finalDocumentos = filtros.documentos;
        } else {
            const pendenteCliente = inputCliente.trim();
            finalClientes = [...new Set([...filtrosSalvos.clientes, ...(pendenteCliente ? [pendenteCliente] : [])])];
             const pendenteDocumentos = Number(inputDocumento.trim());
            finalDocumentos = [...new Set([...filtrosSalvos.documentos, ...(pendenteDocumentos ? [pendenteDocumentos] : [])])];
        }
    
        try {
            const data = await pedidoVendaService.listar({ clientes: finalClientes, status: statusBusca, documentos: finalDocumentos });
            setPedidos(data);
        } catch (error) {
            console.error("Erro ao carregar pedidos de venda:", error);
        } finally {
            setLoadings(prev => ({ ...prev, pedidos: false }));
        }      
    };

    const criarPedidoVenda = async (pedidoVenda: PedidoVenda) => {
        setLoadings(prev => ({ ...prev, criar: true }));

        try {
            const data = await pedidoVendaService.criar(pedidoVenda);
            setPedido(data);
            return data;
        } catch (error) {
            console.error("Erro ao criar pedido de venda:", error);
        } finally {
            setLoadings(prev => ({ ...prev, criar: false }));
        } 
    }

    const atualizarPedidoVenda = async (numeroDocumento: number ,pedidoVenda: PedidoVendaEdicao) => {
        setLoadings(prev => ({ ...prev, editar: true }));

        try {
            const data = await pedidoVendaService.editar(numeroDocumento, pedidoVenda);
            setPedidoEdicao(data);
            return data;
        } catch (error) {
            console.error("Erro ao atualizar pedido de venda:", error);
        } finally {
            setLoadings(prev => ({ ...prev, editar: false }));
        } 
    }

    const resetBuscaPedidos = () => {
        setPedidos([]);
        setFiltrosSalvos({ clientes: [], status: [], documentos:[] });
        setInputCliente("");
    };

    return { 
        proximoCodigo, 
        loadings, 
        carregarProximoCodigo, 
        pedidos, 
        resetBuscaPedidos, 
        carregarPedidosVenda,
        filtrosSalvos, 
        setFiltrosSalvos,
        inputCliente, 
        setInputCliente,
        inputDocumento,
        setInputDocumento,
        criarPedidoVenda,
        pedido,
        setProximoCodigo,
        pedidoEdicao,
        atualizarPedidoVenda,
        carregarPorDocumentoEntrada
    };
}
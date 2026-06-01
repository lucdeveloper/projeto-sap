import api from './api.ts';
import 
{ 
    FiltrosPedidosVenda, 
    PedidosVendaDTO, 
    PedidoVenda, 
    PedidoVendaEdicao, 
    PedidoVendaRetornoDTO
} from '../interfaces/PedidosVenda.ts';
import { ApiResponse } from '../interfaces/ApiResponse.ts';

const urlBase = '/PedidoVenda/';

export const pedidoVendaService = {
    retornarProximoCodigo: async (): Promise<number> => {
        const response = await api.get(urlBase + 'retornarProximoCodigo');
        return response.data;
    },
    retornarPorDocumentoEntrada: async (documentoEntrada: number): Promise<PedidoVendaRetornoDTO> => {
        const response = await api.get(`${urlBase}${documentoEntrada}`);
        return response.data;
    },
    listar: async(filtros: FiltrosPedidosVenda ): Promise<PedidosVendaDTO[]> => {
        const response = await api.post(urlBase, filtros);
        return response.data;
    },
    criar: async (pedidoVendaDTO: PedidoVenda): Promise<ApiResponse<PedidosVendaDTO>> => {
        const response = await api.post(urlBase + 'criar', pedidoVendaDTO);
        return response.data;
    },
    editar: async (numeroDocumento: number, pedidoVendaEdicao: PedidoVendaEdicao): Promise<ApiResponse<PedidoVendaRetornoDTO>> => {
        const response = await api.patch(urlBase + `editar/${numeroDocumento}`, pedidoVendaEdicao);
        return response.data;
    }
};
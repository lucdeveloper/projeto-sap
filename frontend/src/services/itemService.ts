import { ItemDTO } from '../interfaces/Item.ts';
import { FiltrosItemPedidoVenda, ItemPedidoVendaDTO } from '../interfaces/PedidoVendaItem.ts';
import api from './api';

export const itemService = {
    listar: async (filtros: FiltrosItemPedidoVenda): Promise<ItemPedidoVendaDTO[]> => {
        const response = await api.post('/Item', filtros);
        return response.data;
    },
    listarPorCodigo: async (codigo: string ): Promise<ItemDTO> => {
        const response = await api.get(`/Item/${codigo}`);
        return response.data;
    },
};
import { FiltrosPedidoVendaVendedor, PedidoVendaValoresComissionaveisDTO, PedidoVendaVendedorDTO } from "../interfaces/PedidoVendaVendedor";
import api from "./api";

export const pedidoVendaVendedorService = {
    listar: async (filtros: FiltrosPedidoVendaVendedor): Promise<PedidoVendaVendedorDTO[]> => {
        const response = await api.post('/Vendedor', filtros);
        return response.data;
    },
    obterValorComissionavel: async (documentoEntrada: number): Promise<PedidoVendaValoresComissionaveisDTO[]> => {
        const response = await api.get(`/Vendedor/obterValorComissionavel/${documentoEntrada}`);
        return response.data;
    },
};
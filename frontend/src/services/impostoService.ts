import { ImpostoDTO, FiltrosImposto } from '../interfaces/Imposto.ts';
import api from './api';

export const impostoService = {
    listar: async (filtros: FiltrosImposto): Promise<ImpostoDTO[]> => {
        const response = await api.post('/Imposto', filtros);
        return response.data;
    },
};
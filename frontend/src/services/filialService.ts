import { FilialDTO } from '../interfaces/Filial.ts';
import api from './api.ts';

export const filialService = {
    listar: async (): Promise<FilialDTO[]> => {
        const response = await api.get('/Filial');
        return response.data;
    },
};
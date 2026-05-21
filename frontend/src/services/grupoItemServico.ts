import api from './api';
import {GruposItemDTO, FiltrosGrupoItem } from '../interfaces/GruposItem.ts';

export const grupoItemServico = {
    listar: async (filtros: FiltrosGrupoItem): Promise<GruposItemDTO[]> => {
        const response = await api.post('/GrupoItem', filtros);
        return response.data;
    },
};
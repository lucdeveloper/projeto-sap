import api from './api.ts';
import { ParceiroNegocioDTO, FiltrosParceiroNegocio } from '../interfaces/ParceiroNegocio.ts';
import { PessoaContatoDTO, PessoaContatoFiltro } from '../interfaces/PessoaContato.ts';

export const parceiroNegocioService = {
    listar: async (filtros: FiltrosParceiroNegocio): Promise<ParceiroNegocioDTO[]> => {
        const response = await api.post('/ParceiroNegocio', filtros);
        return response.data;
    },
    listarPorCodigo: async (codigo: string): Promise<ParceiroNegocioDTO> => {
         const response = await api.get(`/ParceiroNegocio/${codigo}`);
         return response.data;
    },
    listarPessoasContato: async (filtros: PessoaContatoFiltro): Promise<PessoaContatoDTO[]> => {
         const response = await api.post(`/ParceiroNegocio/pessoas-contato`, filtros);
         return response.data;
    }
};
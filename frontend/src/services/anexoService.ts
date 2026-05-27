import { AnexoDTO } from "../interfaces/Anexo";
import api from "./api";

export const anexoService = {
    listar: async (): Promise<AnexoDTO> => {
        const response = await api.get('/Anexo');
        return response.data;
    },
    consultar: async ( codigo: number, numeroLinha: number ): Promise<string> => {
        const response = await api.get('/Anexo/buscar', {
            params: { codigo, numeroLinha },
            responseType: 'blob'
        });

        return URL.createObjectURL(response.data);
    },
};

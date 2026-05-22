import { AnexoDTO } from "../interfaces/Anexo";
import api from "./api";

export const anexoService = {
    listar: async (): Promise<AnexoDTO> => {
        const response = await api.get('/Anexo');
        return response.data;
    },
};
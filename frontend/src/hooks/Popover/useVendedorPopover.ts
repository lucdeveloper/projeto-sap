import { useState } from "react";
import { PopoverItem } from "../../interfaces/PopoverItem";
import { usePopover } from "./usePopover";
import { VendedorDTO } from "../../interfaces/PedidoVendaVendedor";
import { pedidoVendaVendedorService } from "../../services/pedidoVendaVendedorService";

const montarExibicaoPopover = (vendedor: VendedorDTO): PopoverItem[] => {
    return [
        { label: "Código", value: vendedor.codigo },
        { label: "Nome", value: vendedor.nome },
        { label: "Comissão", value: `${vendedor.comissao}%`},
        { label: "Grupo", value: vendedor.grupo }
    ];
};

export function useVendedorPopover() {
    const { data, anchor, isOpen, open, close } = usePopover<PopoverItem[]>();
    const [loading, setLoading] = useState(false);

    const abrirVendedor = async (evento: HTMLElement | string | null | undefined , codigo: number) => {
        open(evento, []);
        setLoading(true);
        try {
            const resposta = await pedidoVendaVendedorService.listarPorCodigo(codigo);
            const conteudoPopover = montarExibicaoPopover(resposta); 
            open(evento, conteudoPopover);
        } finally {
            setLoading(false);
        }
    };

   return { 
        abrirVendedor, 
        popoverProps: { 
            data: data || [], 
            opener: anchor, 
            open: isOpen, 
            onClose: close, 
            loading 
        } 
    };
}
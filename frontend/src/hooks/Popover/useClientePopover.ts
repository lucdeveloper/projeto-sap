import { useState } from "react";
import { usePopover } from "./usePopover.ts";
import { parceiroNegocioService } from "../../services/parceiroNegocioService.ts";
import { PopoverItem } from "../../interfaces/PopoverItem.ts";
import { ParceiroNegocioDTO } from "../../interfaces/ParceiroNegocio.ts";

const montarExibicaoPopover = (cliente: ParceiroNegocioDTO): PopoverItem[] => {
    return [
        { label: "Código do PN", value: cliente.codigoCliente },
        { label: "Nome do PN", value: cliente.nomeCliente },
        { label: "Grupo", value: cliente.grupo },
        { label: "Saldo", value: cliente.saldo },
        { label: "Moeda", value: cliente.moeda },
        { label: "Celular", value: cliente.celular },
        { label: "Email", value: cliente.email }
    ];
};

export function useClientePopover() {
    const { data, anchor, isOpen, open, close,  } = usePopover<PopoverItem[]>();
    const [loading, setLoading] = useState(false);

    const abrirCliente = async (evento: HTMLElement | null, codigo: string) => {
        open(evento, []);
        setLoading(true);
        try {
            const resposta = await parceiroNegocioService.listarPorCodigo(codigo);
            const conteudoPopover = montarExibicaoPopover(resposta); 
            open(evento, conteudoPopover);
        } finally {
            setLoading(false);
        }
    };

   return { 
        abrirCliente, 
        popoverProps: { 
            data: data || [], 
            opener: anchor, 
            open: isOpen, 
            onClose: close, 
            loading 
        } 
    };
}
import { useState } from "react";
import { PopoverItem } from "../../interfaces/PopoverItem";
import { usePopover } from "./usePopover";
import { ItemDTO } from "../../interfaces/Item";
import { itemService } from "../../services/itemService";

const montarExibicaoPopover = (item: ItemDTO): PopoverItem[] => {
    return [
        { label: "Nº do Item", value: item.numero },
        { label: "Descrição do item", value: item.descricao },
        { label: "Grupo de itens", value: item.grupo }
    ];
};

export function useItemPopover() {
    const { data, anchor, isOpen, open, close } = usePopover<PopoverItem[]>();
    const [loading, setLoading] = useState(false);

    const abrirItem = async (evento: HTMLElement | string | null | undefined , codigo: string) => {
        open(evento, []);
        setLoading(true);
        try {
            const resposta = await itemService.listarPorCodigo(codigo);
            const conteudoPopover = montarExibicaoPopover(resposta); 
            open(evento, conteudoPopover);
        } finally {
            setLoading(false);
        }
    };

   return { 
        abrirItem, 
        popoverProps: { 
            data: data || [], 
            opener: anchor, 
            open: isOpen, 
            onClose: close, 
            loading 
        } 
    };
}
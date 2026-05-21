import { useState } from "react";

export function usePopover<T>() {
    const [data, setData] = useState<T | null>(null);
    const [anchor, setAnchor] = useState<HTMLElement | string | null | undefined>(null);
    const [isOpen, setIsOpen] = useState(false);

    const open = (evento: HTMLElement | string | null | undefined, conteudo: T) => {
        /*  console.log(evento) */
        
        setAnchor(evento);
        setData(conteudo);
        setIsOpen(true);
    };

    const close = () => setIsOpen(false);

    return { data, anchor, isOpen, open, close };
}
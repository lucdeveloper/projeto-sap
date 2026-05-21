import { useState } from 'react';
import { parceiroNegocioService } from '../services/parceiroNegocioService.ts';
import { FiltrosParceiroNegocio, ParceiroNegocioDTO } from '../interfaces/ParceiroNegocio';
import { PessoaContatoDTO, PessoaContatoFiltro } from '../interfaces/PessoaContato.ts';

export function useParceiroNegocioSearch() {
    const [parceirosNegocio, setParceirosNegocio] = useState<ParceiroNegocioDTO[]>([]);
    const [pessoasContato, setPessoasContato] = useState<PessoaContatoDTO[]>([]);
    const [loadings, setLoadings] = useState({ parceiroNegocio: false, pessoasContato: false})
    const [filtrosSalvos, setFiltrosSalvos] = useState<FiltrosParceiroNegocio>({ codigos: [], nomes: [] });
    const [filtrosPessoaContatoSalvo, setFiltrosPessoaContatoSalvo] = useState<PessoaContatoFiltro>({cliente: "", codigos: [], nomes: [] });
    const [inputCodigo, setInputCodigo] = useState("");
    const [inputNome, setInputNome] = useState("");
    const [inputCodigoPessoaContato, setInputCodigoPessoaContato] = useState("");
    const [inputNomePessoaContato, setInputNomePessoaContato] = useState("");

    const carregarParceirosNegocio = async (filtros?: FiltrosParceiroNegocio) => {
       setLoadings(prev => ({ ...prev, parceiroNegocio: true }));

        let finalCodigo: string[];
        let finalNome: string[];

        if (filtros) {
            finalCodigo = filtros.codigos;
            finalNome = filtros.nomes;
        } else {
            const pendenteCodigo = inputCodigo.trim();
            const pendenteNome = inputNome.trim();

            finalCodigo = [...new Set([...filtrosSalvos.codigos, ...(pendenteCodigo ? [pendenteCodigo] : [])])];
            finalNome = [...new Set([...filtrosSalvos.nomes, ...(pendenteNome ? [pendenteNome] : [])])];
        }

        try {
            const data = await parceiroNegocioService.listar({ 
                codigos: finalCodigo, 
                nomes: finalNome 
            });
            setParceirosNegocio(data);
        } catch (error) {
            console.error("Erro ao carregar parceiros de negócio:", error);
        } finally {
           setLoadings(prev => ({ ...prev, parceiroNegocio: false }));
        }
    };

    const carregarPessoasContato = async (filtros?: PessoaContatoFiltro) => {
       setLoadings(prev => ({ ...prev, pessoasContato: true }));

        const cardCodeAtual = filtros?.cliente || filtrosPessoaContatoSalvo.cliente; 
        let finalCodigo: string[];
        let finalNome: string[];

        if (filtros) {
            finalCodigo = filtros.codigos;
            finalNome = filtros.nomes;
        } else {
            const pendenteCodigo = inputCodigoPessoaContato.trim();
            const pendenteNome = inputNomePessoaContato.trim();

            finalCodigo = [...new Set([...filtrosPessoaContatoSalvo.codigos, ...(pendenteCodigo ? [pendenteCodigo] : [])])];
            finalNome = [...new Set([...filtrosPessoaContatoSalvo.nomes, ...(pendenteNome ? [pendenteNome] : [])])];
        }

        try {
            const data = await parceiroNegocioService.listarPessoasContato({ 
                cliente: cardCodeAtual,
                codigos: finalCodigo, 
                nomes: finalNome 
            });

            setPessoasContato(data);
        } catch (error) {
            console.error("Erro ao carregar parceiros de negócio:", error);
        } finally {
            setLoadings(prev => ({ ...prev, pessoasContato: false }));
        }
    };

    const resetBuscaParceiroNegocio = () => {
        setParceirosNegocio([]);
        setFiltrosSalvos({ codigos: [], nomes: [] });
        setInputCodigo("");
        setInputNome("");
    };

     const resetBuscaPessoaContato= () => {
        setPessoasContato([]);
        setFiltrosPessoaContatoSalvo({cliente: "", codigos: [], nomes: [] });
        setInputCodigoPessoaContato("");
        setInputNomePessoaContato("");
    };

    return { 
        parceirosNegocio, 
        loadings, 
        filtrosSalvos, 
        setFiltrosSalvos, 
        inputCodigo, 
        setInputCodigo, 
        inputNome, 
        setInputNome, 
        carregarParceirosNegocio, 
        resetBuscaParceiroNegocio,
        setParceirosNegocio,
        carregarPessoasContato,
        pessoasContato,
        setPessoasContato,
        setInputCodigoPessoaContato,
        setInputNomePessoaContato,
        filtrosPessoaContatoSalvo,
        setFiltrosPessoaContatoSalvo,
        resetBuscaPessoaContato,
        inputCodigoPessoaContato,
        inputNomePessoaContato
    };
}
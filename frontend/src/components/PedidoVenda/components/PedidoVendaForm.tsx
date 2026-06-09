import { FiltrosItemPedidoVenda, ItemPedidoVendaDTO } from '../../../interfaces/PedidoVendaItem.ts';
import { useItemSearch } from '../../../hooks/useItemSearch.ts';
import { useGrupoItemSearch } from '../../../hooks/useGrupoItemSearch.ts';
import { useFilialSearch } from '../../../hooks/useFilialSearch.ts';
import { FiltrosImposto, ImpostoDTO } from '../../../interfaces/Imposto.ts';
import { useImpostoSearch } from '../../../hooks/useImpostoSearch.ts';
import { FiltrosGrupoItem, GruposItemDTO } from '../../../interfaces/GruposItem.ts';
import { FiltrosParceiroNegocio, ParceiroNegocioDTO } from '../../../interfaces/ParceiroNegocio.ts';
import { useEffect, useMemo, useRef, useState } from 'react';
import { DialogSelecao } from '../../DialogSelecao.tsx';
import { PopoverView } from '../../PopoverView.tsx';
import { useParceiroNegocioSearch } from '../../../hooks/useParceiroNegocioSearch.ts';
import { usePedidosVenda } from '../../../hooks/usePedidosVenda.ts';
import { useClientePopover } from '../../../hooks/Popover/useClientePopover.ts';
import { AnexoPedido, AnexoPedidoEdicao, AnexoPedidoRetornoDTO, ItemPedido, ItemPedidoEdicao, ItemPedidoRetornoDTO, PedidoVenda, PedidoVendaEdicao, PedidoVendaRetornoDTO, VendedorPedidoEdicao, VendedorPedidoRetornoDTO } from '../../../interfaces/PedidosVenda.ts';
import { PessoaContatoFiltro } from '../../../interfaces/PessoaContato.ts';
import { 
    Link, 
    Bar, 
    BusyIndicator, 
    Button, 
    ComboBox, 
    ComboBoxItem, 
    DatePicker, 
    FlexBox, 
    Form, 
    FormGroup, 
    FormItem, 
    Icon, 
    Input, 
    Label, 
    MultiInput, 
    ObjectPage, 
    ObjectPageHeader, 
    ObjectPageSection, 
    ObjectPageTitle, 
    ProgressIndicator, 
    Table, 
    TableCell, 
    TableHeaderCell, 
    TableHeaderRow, 
    TableRow, 
    TableSelectionMulti, 
    TextAlign, 
    FilterGroupItem, 
    Token, 
    Toast, 
    AnalyticalTable,
    FileUploader,
    Text
} from '@ui5/webcomponents-react';
import { formatarDataISO } from '../../../utils/dateUtils.ts';
import { useAnexoContext } from '../../../contexts/anexoContext.tsx';
import { AnexoIconeHelper } from '../../../utils/anexoHelper.ts';
import { usePedidoVendaVendedor } from '../../../hooks/usePedidoVendaVendedor.ts';
import { FiltrosPedidoVendaVendedor, PedidoVendaVendedorDTO } from '../../../interfaces/PedidoVendaVendedor.ts';

type LinhaItemPedido = ItemPedido & {
  IdLinha?: number;
  id: number;
  descricao: string;
};

type LinhaVendedorPedido = {
  IdLinha?: number;
  id: number;
  codigo: number | undefined;
  nome: string;
  observacao: string;
};

interface PedidoVendaFormProps {
  onSucesso: (dadosDoPedido: any) => void;
  onCancelar?: () => void; 
  dadosEdicao?: PedidoVendaRetornoDTO | null;
  ehEdicao: boolean;
}

export function PedidoVendaForm({ onSucesso, onCancelar, dadosEdicao, ehEdicao }: PedidoVendaFormProps) { 
    
    const isEdicao = ehEdicao || !!dadosEdicao;
    
    /* Componentes de itens */
    const { 
        itens, 
        loading: loadingItens, 
        inputNumero, 
        setInputNumero, 
        inputGrupo, 
        setInputGrupo, 
        setFiltrosSalvos: setFiltrosSalvosItens, 
        filtrosSalvos: filtrosSalvosItens,
        carregarItens, 
        resetBuscaItens 
    } = useItemSearch();

    const {
        pedidoVendaVendedor, 
        loading: loadingVendedor, 
        filtrosSalvos: filtrosSalvosVendedor , 
        setFiltrosSalvos: setFiltrosSalvosVendedor, 
        inputCodigo: inputCodigoVendedor, 
        setInputCodigo: setInputCodigoVendedor, 
        inputNome : inputNomeVendedor, 
        setInputNome: setInputNomeVendedor, 
        carregarPedidosVendaVendedor, 
        resetBuscaPedidoVendaVendedor,
    } = usePedidoVendaVendedor();

    const [openItem, setOpenItem] = useState(false);
    const [itensParaAdicionar, setItensParaAdicionar] = useState<ItemPedidoVendaDTO[]>([]);
    const [idsMarcadosParaExcluir, setIdsMarcadosParaExcluir] = useState<number[]>([]);
    const [linhas, setLinhas] = useState<LinhaItemPedido[]>([]);
    const [indexLinhaAtiva, setIndexLinhaAtiva] = useState<number | null>(null);
    const {uploadAnexo, arquivosUpload, setArquivosUpload, removerAnexos } = useAnexoContext();
    const [anexosSelecionadas, setAnexosSelecionadas] = useState<number[]>([]);
    const [openVendedores, setOpenVendedores] = useState(false);
    const [indexLinhaAtivaVendedores, setIndexLinhaAtivaVendedores] = useState<number | null>(null);
    const [vendedoresParaAdicionar, setVendedoresParaAdicionar] = useState<PedidoVendaVendedorDTO[]>([]);
    const [linhasVendedores, setLinhasVendedores] = useState<LinhaVendedorPedido[]>([]);
    const [idsMarcadosParaExcluirVendedores, setIdsMarcadosParaExcluirVendedores] = useState<number[]>([]);
    const [selectedRowIds, setSelectedRowIds] = useState<Record<string, boolean>>({});
  
    /* Componentes de impostos */
    const { 
        impostos, 
        loading: loadingImposto, 
        inputCodigo, 
        setInputCodigo, 
        inputNome, 
        setInputNome, 
        setFiltrosSalvos: setFiltrosSalvosImposto, 
        filtrosSalvos: filtrosSalvosImposto,
        carregarImpostos, 
        resetBuscaImposto 
    } = useImpostoSearch();

    const [impostoSelecionado, setImpostoSelecionado] = useState<number | null>(null);
    const [openImposto, setOpenImposto] = useState(false);

    /* Componentes de filiais */
    const {filial, loading: loadingFiliais, carregarFiliais} = useFilialSearch(); 
    
    /* Componentes de Grupo de itens */
    const {
        grupos, 
        loading: loadingGrupo, 
        setFiltrosSalvos: setFiltrosSalvosGrupo, 
        filtrosSalvos: filtrosSalvosGrupo,
        inputNomes: inputNomesGrupo, 
        setInputNomes: setInputNomesGrupo, 
        inputNumeros: inputNumeroGrupo, 
        setInputNumeros: setInputNumeroGrupo, 
        carregarGrupos, 
        resetBuscaGrupos,
    } = useGrupoItemSearch();

    const [grupoSelecionado, setGrupoSelecionado] = useState<GruposItemDTO[]>([]);
    const [openGrupo, setOpenGrupo] = useState(false);
       
    /* Componentes de parceiros de negocio */
    const [openCliente, setOpenCliente] = useState(false);
    const [parceiroNegocioSelecionado, setParceiroNegocioSelecionado] = useState<ParceiroNegocioDTO | undefined>();
    
    const {
        parceirosNegocio, 
        loadings: loadingParceiroNegocio, 
        setFiltrosSalvos: setFiltrosSalvosParceiroNegocio, 
        filtrosSalvos: filtrosSalvosParceiroNegocio,
        inputCodigo: inputCodigoParceiroNegocio, 
        setInputCodigo: setInputCodigoParceiroNegocio, 
        inputNome: inputNomeParceiroNegocio, 
        setInputNome: setInputNomeParceiroNegocio, 
        carregarParceirosNegocio, 
        resetBuscaParceiroNegocio,
        carregarPessoasContato,
        pessoasContato,
        setInputCodigoPessoaContato,
        setInputNomePessoaContato,
        setFiltrosPessoaContatoSalvo,
        filtrosPessoaContatoSalvo,
        resetBuscaPessoaContato,
        inputCodigoPessoaContato,
        inputNomePessoaContato
    } = useParceiroNegocioSearch();

    /* Componentes de pedido de venda */
    const {proximoCodigo, loadings, carregarProximoCodigo, criarPedidoVenda, setProximoCodigo, atualizarPedidoVenda,loading: lodingPedidoVenda} = usePedidosVenda()
    const [openToast, setOpenToast] = useState(false);

    /*Popover cliente */
    const { abrirCliente, popoverProps } = useClientePopover();
    
    const selectionRef = useRef<any>(null);
    const vendedoresReferencia = useRef<any>(null);
    const anexoReferencia = useRef<any>(null);
    
    const [dadosForm, setDadosForm] = useState<PedidoVenda>({
        cliente: "",
        dataEntrega: "",
        pessoaContato: null,
        numeroReferenciaCliente: "",
        empresa: 0,
        itens: [],
        anexos:[],
        vendedores:[]
    });

    const tabelaClientes =  [
        { Header: "Código do PN", accessor: "codigoCliente" },
        { Header: "Nome do PN", accessor: "nomeCliente" },
        { Header: "Saldo do parceiro de negócios", accessor: "saldoTotal" },
        { Header: "Moeda", accessor: "moeda" }
    ]

    /*Pessoa de contato */
    const [openParceiroContato, setOpenParceiroContato] = useState(false);

    const tabelaPessoaContato = [
        { Header: "Código", accessor: "codigoPessoaContato" },
        { Header: "Nome", accessor: "nome" },
        { Header: "Posição", accessor: "posicao" },
        { Header: "Telefone", accessor: "telefone" }
    ]
    
    const tabelaItem = [
        { Header: "Nº do item", accessor: "numero" },
        { Header: "Descrição do item", accessor: "descricao" },
        { Header: "Em estoque", accessor: "quantidade" },
        { Header: "Grupo do item", accessor: "grupo" }
    ]

    const tabelaVendedores = [
        { Header: "Código do vendedor", accessor: "codigo" },
        { Header: "Nome do vendedor", accessor: "nome" },
        { Header: "Observação", accessor: "observacao" },
    ]

    const tabelaImposto = [
        { Header: "Código", accessor: "codigo" },
        { Header: "Nome", accessor: "nome" },
        { Header: "Taxa", accessor: "taxa", hAlign: TextAlign.End },
    ]

    const tabelaGrupo = [
        { Header: "Número", accessor: "numero" },
        { Header: "Nome", accessor: "nome" }
    ]

    const handleSelecionarCliente = (item: ParceiroNegocioDTO) => {
        setParceiroNegocioSelecionado(item);

        setLinhas([{
            id: 1,
            item: "",
            quantidade: 0,
            imposto: "",
            preco: 0,
            descricao: ""
        }]);

        setLinhasVendedores([{
            id: 1,
            codigo: undefined,
            nome: "",
            observacao: ""
        }])

        atualizarFormulario({ 
            cliente: item.codigoCliente, 
            pessoaContato: item.codigoPessoaContato 
        });

        setOpenCliente(false);
    };

   const atualizarFormulario = (updates: Partial<typeof dadosForm>) => {
        setDadosForm((prev) => ({
            ...prev,
            ...updates
        }));
    };

    const handleSelecionarImposto = (selected: ImpostoDTO) => {
        if (impostoSelecionado === null) return;

        setLinhas(prev => {
            const atualizadas = prev.map((linha) =>
            linha.id === impostoSelecionado
                ? { ...linha, imposto: selected.codigo }
                : linha
            );

            return normalizeLinhas(atualizadas);
        });

        setOpenImposto(false);
        setImpostoSelecionado(null);
    };

    const handleSelectionChange = () => {
        const selection = selectionRef.current;
        if (!selection) return;

        const ids = Array.from(selection.getSelectedAsSet())
                         .map((key) =>{
                            const stringKey = key as string;
                            if (stringKey.includes('-')) {
                                return Number(stringKey.split('-')[1]);
                            }
                            return Number(stringKey);
                         })
                         .filter(id => {
                            const linha = linhas.find(l => l.id === id);
                            return linha && (linha.item || linha.imposto);
                         });

        setIdsMarcadosParaExcluir(ids);
    };

    const handleSelectionChangeVendedores = () => {
        const selection = vendedoresReferencia.current;
        if (!selection) return;

        const ids = Array.from(selection.getSelectedAsSet())
                        .map((key) => {
                            const stringKey = key as string;
                            if (stringKey.includes('-')) {
                                return Number(stringKey.split('-')[1]);
                            }
                            return Number(stringKey);
                        })
                        .filter(id => {
                            return !isNaN(id) && linhasVendedores.some(l => l.id === id);
                        });

        setIdsMarcadosParaExcluirVendedores(ids);
    };

    const selecionarAnexos = () => {

        const selection = anexoReferencia.current;

        if (!selection) return;

        const ids = Array.from(selection.getSelectedAsSet())
                         .map((key) => Number(key as string));

        setAnexosSelecionadas(ids);
    };

    const normalizeLinhas = (linhasAtuais: LinhaItemPedido[]) => {
        const preenchidas = linhasAtuais.filter(l => l.item || l.imposto);

        const reindexadas = preenchidas.map((linha, index) => ({
            ...linha,
            id: index + 1
        }));

        return [
            ...reindexadas,
            {
            id: reindexadas.length + 1,
            idLinha: undefined,
            item: "",
            quantidade: 0,
            imposto: "",
            preco: 0,
            descricao: ""
            }
        ];
    };

    const normalizeLinhasVendedores = (linhasAtuais: LinhaVendedorPedido[]) => {
        const preenchidas = linhasAtuais.filter(l => l.codigo !== undefined && l.codigo !== null);

        const reindexadas = preenchidas.map((linha, index) => ({
            ...linha,
            id: index + 1
        }));

        return [
            ...reindexadas,
            {
                id: reindexadas.length + 1,
                documentoEntrada: undefined,
                IdLinha: undefined,
                codigo: undefined,
                nome: "",
                observacao: ""
            }
        ];
    };

    const removerSelecionados = () => {
        setLinhas(prev => { const novasLinhas = prev.filter(linha => !idsMarcadosParaExcluir.includes(linha.id) );
            return normalizeLinhas(novasLinhas);
        });

        setIdsMarcadosParaExcluir([]);

        if (selectionRef.current && typeof selectionRef.current.setAttribute === 'function') {
            selectionRef.current.setAttribute('selected', '');
        }
    };

     const removerVendedoresSelecionados = () => {
        setLinhasVendedores(prev => { const novasLinhas = prev.filter(linha => !idsMarcadosParaExcluirVendedores.includes(linha.id) );
            return normalizeLinhasVendedores(novasLinhas);
        });

        setIdsMarcadosParaExcluirVendedores([]);
        if (vendedoresReferencia.current && typeof vendedoresReferencia.current.setAttribute === 'function') {
            vendedoresReferencia.current.setAttribute('selected', '');
        }
    };

    const totalPedido = useMemo(() => {
        return linhas.reduce((total, linha) => {
            return total + (linha.quantidade * linha.preco);
        }, 0);
    }, [linhas]);
 
    useEffect(() => {
        const itensValidos = linhas.filter(l => l.item && l.quantidade > 0)
                                   .map(l => ({
                                        item: l.item,
                                        quantidade: l.quantidade,
                                        imposto: l.imposto,
                                        preco: l.preco
                                    }));

        setDadosForm(prev => ({ ...prev, itens: itensValidos  }));
           
    }, [linhas]);

    useEffect(() => {
        const codigosVendedoresValidos = linhasVendedores.filter(l => l.codigo !== undefined && l.codigo !== null)
                                                         .map(l => Number(l.codigo));
        setDadosForm(prev => ({ 
            ...prev, 
            vendedores: codigosVendedoresValidos 
        }));
        
    }, [linhasVendedores]);

    const atualizarLinha = (
        id: number,
        campo: "quantidade" | "preco",
        valor: string
        ) => {
        const numero = parseFloat(valor.replace(",", ".")) || 0;

        setLinhas(prev =>
            prev.map(l =>
            l.id === id
                ? { ...l, [campo]: numero }
                : l
            )
        );
    };

    const podeAdicionar = useMemo(() => {
        return (
            !!dadosForm.cliente &&
            !!dadosForm.dataEntrega &&
            dadosForm.empresa !== 0 &&
            dadosForm.itens.length > 0
        );
    }, [dadosForm]);

    const tratarCancelar = () => {
        const temAlteracao =
            dadosForm.cliente ||
            dadosForm.dataEntrega ||
            dadosForm.empresa !== 0 ||
            dadosForm.itens.length > 0 ||
            linhas.some(l => l.item || l.quantidade > 0 || l.preco > 0) || linhasVendedores.some(l => l.codigo);

        if (temAlteracao) {
            const confirmou = window.confirm("Esta página contém dados não gravados. Sair da página?");
            if (!confirmou) return;
        }

        onCancelar?.(); 
    };

    useEffect(() => {
        if (openItem) {
            const filtrosIniciais: FiltrosItemPedidoVenda = { numeros: [], grupos: [] };
            carregarItens(filtrosIniciais);
        }
    }, [openItem]);

    useEffect(() => {
        if (openImposto) {
            const filtrosIniciais: FiltrosImposto = { codigos: [], nomes: [] };
            carregarImpostos(filtrosIniciais);
        }
    }, [openImposto]);

    useEffect(() => {
        if (openGrupo) {
            const filtrosIniciais: FiltrosGrupoItem = { numeros: [], nomes: [] };
            carregarGrupos(filtrosIniciais);
        }
    }, [openGrupo]);

    useEffect(() => {
        if (openCliente) {
            const filtrosIniciais: FiltrosParceiroNegocio = { codigos: [], nomes: [] };
            carregarParceirosNegocio(filtrosIniciais);
        }
    }, [openCliente]);

    useEffect(() => {
        if (openVendedores) {
            const filtrosIniciais: FiltrosPedidoVendaVendedor = { codigos: [], nomes: [] };
            carregarPedidosVendaVendedor(filtrosIniciais);
        }
    }, [openVendedores])

    useEffect(() => {
        if (openParceiroContato && parceiroNegocioSelecionado?.codigoCliente) {
            const filtrosIniciais: PessoaContatoFiltro = { cliente: parceiroNegocioSelecionado?.codigoCliente, codigos: [], nomes: [] };
            carregarPessoasContato(filtrosIniciais);
        }
    }, [openParceiroContato, parceiroNegocioSelecionado]);

   useEffect(() => {
        if (!isEdicao) {
            carregarProximoCodigo();
        } else {
            carregarFiliais();
            setProximoCodigo(Number(dadosEdicao?.documento));
        }
    }, [isEdicao, dadosEdicao]);

    useEffect(() => {

        if (!dadosEdicao) {
            setLinhas([]);
            setArquivosUpload([]);
            return;
        }

        setParceiroNegocioSelecionado({
            codigoCliente: dadosEdicao.codigoCliente,
            nomeCliente: dadosEdicao.cliente,
            pessoaContato: dadosEdicao.pessoaContato,
            emailContato: dadosEdicao.emailContato
        } as ParceiroNegocioDTO);

        setDadosForm({
            cliente: dadosEdicao.codigoCliente,
            numeroReferenciaCliente: dadosEdicao.numeroReferenciaCliente || "",
            dataEntrega: formatarDataISO(dadosEdicao.dataEntrega),
            empresa: dadosEdicao.empresa,
            pessoaContato: dadosEdicao.codigoPessoaContato,
            itens: [],
            anexos: [],
            vendedores:[]
        });

        const linhasVindasDoBanco = dadosEdicao.itens.map((item: ItemPedidoRetornoDTO) => ({
            id: item.linha,
            IdLinha: item.linha,
            item: item.codigo,
            descricao: item.descricao,
            quantidade: item.quantidade,
            preco: item.preco,
            imposto: item.imposto
        }));

        setLinhas(normalizeLinhas(linhasVindasDoBanco));

        const vendedoresBanco = dadosEdicao.vendedores.map((vendedor: VendedorPedidoRetornoDTO ) => ({
            id: vendedor.linha,
            IdLinha: vendedor.linha,
            codigo: vendedor.codigo,
            documentoEntrada: vendedor.documentoEntrada,
            nome: vendedor.nome,
            observacao: vendedor.observacao
        }));

        setLinhasVendedores(normalizeLinhasVendedores(vendedoresBanco));

        if (arquivosUpload.length === 0) {

            const anexosBanco: AnexoPedido[] = dadosEdicao.anexos.map(
                (anexo: AnexoPedidoRetornoDTO) => ({
                    codigo: anexo.codigo,
                    linha: anexo.linha,
                    caminhoDestino: anexo.caminhoDestino ?? "",
                    nomeArquivo: anexo.nomeArquivo ?? "",
                    extensaoArquivo: anexo.extensaoArquivo ?? "",
                    tamanhoArquivo: anexo.tamanho,
                })
            );

            setArquivosUpload(anexosBanco);
        }

    }, [dadosEdicao]);

    const handleAdicionar = async () => {
       const resultado = await criarPedidoVenda({ ...dadosForm, anexos: arquivosUpload });
        if (!resultado) return;
        onSucesso(resultado);
    };

    const handleAtualizar = async () => {
        const corpoRequisicao: PedidoVendaEdicao = {
            dataEntrega: dadosForm.dataEntrega,
            pessoaContato: dadosForm?.pessoaContato,
            numeroReferenciaCliente: dadosForm.numeroReferenciaCliente,
            codigoAnexo: dadosEdicao?.codigoAnexo,
            codigoVendedores: Number(dadosEdicao?.codigoVendedores),
            itens: linhas.filter(l => l.item !== "")
                         .map((item): ItemPedidoEdicao => ({
                            linha: item.IdLinha,
                            item: item.item,
                            quantidade: item.quantidade,
                            preco: item.preco,
                            imposto: item.imposto
            })),
            anexos: arquivosUpload.map((anexo): AnexoPedidoEdicao => ({
                linha: anexo.linha,
                caminhoDestino: anexo.caminhoDestino,
                extensaoArquivo: anexo.extensaoArquivo,
                nomeArquivo: anexo.nomeArquivo,
                tamanhoArquivo: anexo.tamanhoArquivo
            })),
            vendedores: linhasVendedores.filter(l => l.codigo != undefined).map((vendedor): VendedorPedidoEdicao => ({
                linha: vendedor.IdLinha,
                codigo: Number(vendedor.codigo),  
            }))
        }

        const resultado = await atualizarPedidoVenda(Number(dadosEdicao?.documentoEntrada), corpoRequisicao);
        if (!resultado) return;
        onSucesso(resultado);
    }
    

  if (proximoCodigo === null || loadings.proximoCodigo) return <BusyIndicator/>
  return (
    <BusyIndicator 
        active={lodingPedidoVenda} 
        size="M" 
        style={{ 
            display: 'flex',
            flexDirection: 'column',
            width: '100%', 
            height: '100%',
            alignItems: 'stretch'
        }}>
        
        <div style={{ 
            width: '100%', 
            height: '100%', 
            display: 'flex', 
            flexDirection: 'column', 
            overflow: 'hidden',
            flex: 1
        }}>
        
            {/* Dialog Seleção Clientes */}
            <DialogSelecao
                open={openCliente}
                onClose={() => { 
                    setOpenCliente(false);
                    resetBuscaParceiroNegocio();
                }}
                textoDialog="Parceiros de negócios"
                onGo={() => carregarParceirosNegocio()}
                filters={
                    <>
                        <FilterGroupItem label="Código do PN" filterKey="codigo">
                            <MultiInput
                                showValueHelpIcon
                                value={inputCodigoParceiroNegocio}
                                tokens={filtrosSalvosParceiroNegocio.codigos.map((codigo) => (
                                    <Token key={codigo} text={codigo} />
                                ))}
                                onInput={(e: any) => setInputCodigoParceiroNegocio(e.target.value)}
                                onKeyDown={(e: any) => {
                                    if (e.key === "Enter") {
                                        const value = inputCodigoParceiroNegocio.trim();
                                        if (!value) return;
                    
                                        setFiltrosSalvosParceiroNegocio(prev => ({
                                            ...prev,
                                            codigos: [...prev.codigos, value]
                                        }));
                                        setInputCodigoParceiroNegocio("");
                                    }
                                }}
                                onTokenDelete={(e: any) => {
                                    const tokensRemovidos = e.detail.tokens;
                                    setFiltrosSalvosParceiroNegocio(prev => ({
                                        ...prev,
                                        codigos: prev.codigos.filter((c) => !tokensRemovidos.some((t: any) => t.text === c))  
                                    }));
                                }}
                            />
                        </FilterGroupItem>

                        <FilterGroupItem label="Nome do PN" filterKey="nome">
                            <MultiInput
                                showValueHelpIcon
                                value={inputNomeParceiroNegocio}
                                tokens={filtrosSalvosParceiroNegocio.nomes.map((nome) => (
                                    <Token key={nome} text={nome} />
                                ))}
                                onInput={(e: any) => setInputNomeParceiroNegocio(e.target.value)}
                                onKeyDown={(e: any) => {
                                    if (e.key === "Enter") {
                                        const value = inputNomeParceiroNegocio.trim();
                                        if (!value) return;
                    
                                        setFiltrosSalvosParceiroNegocio(prev => ({
                                            ...prev,
                                            nomes: [...prev.nomes, value]
                                        }));
                                        setInputNomeParceiroNegocio("");
                                    }
                                }}
                                onTokenDelete={(e: any) => {
                                    const tokensRemovidos = e.detail.tokens;
                                    setFiltrosSalvosParceiroNegocio(prev => ({
                                        ...prev,
                                        nomes: prev.nomes.filter((c) => !tokensRemovidos.some((t: any) => t.text === c))  
                                    }));
                                }}
                            />
                        </FilterGroupItem>
                    </>   
                }
            >
                <AnalyticalTable
                    sortable
                    visibleRows={10}
                    columns={tabelaClientes}
                    data={parceirosNegocio}
                    loading={loadingParceiroNegocio.parceiroNegocio}
                    selectionMode="Single"
                    onRowSelect={(e: any) => {
                        const rowIndex = Object.keys(e.detail.selectedRowIds)
                                            .find((key) => e.detail.selectedRowIds[key]);

                        if (rowIndex !== undefined) {
                            const item = parceirosNegocio[Number(rowIndex)];
                            handleSelecionarCliente(item);
                            resetBuscaParceiroNegocio(); 
                        }
                    }}
                />
            </DialogSelecao>

            {/* Dialog Seleção Impostos */}
            <DialogSelecao  
                open={openImposto}
                onClose={() => {
                    setOpenImposto(false);
                    resetBuscaImposto();
                }} 
                textoDialog="Códigos de imposto"
                onGo={() => carregarImpostos()}
                filters={
                    <>
                    <FilterGroupItem label="Código" filterKey="codigo">
                        <MultiInput
                            showValueHelpIcon
                            value={inputCodigo}
                            tokens={filtrosSalvosImposto.codigos.map((codigo) => (
                                <Token key={codigo} text={codigo} />
                            ))}
                            onInput={(e: any) => setInputCodigo(e.target.value)}
                            onKeyDown={(e: any) => {
                                if (e.key === "Enter" && inputCodigo.trim()) {
                                    setFiltrosSalvosImposto(prev => ({
                                        ...prev,
                                        codigos: [...prev.codigos, inputCodigo.trim()]
                                    }));
                                    setInputCodigo("");
                                }
                            }}
                            onTokenDelete={(e: any) => {
                                const textos = e.detail.tokens.map((t: any) => t.text);
                                setFiltrosSalvosImposto(prev => ({
                                    ...prev,
                                    codigos: prev.codigos.filter(n => !textos.includes(n))
                                }));
                            }}
                        />
                    </FilterGroupItem>

                    <FilterGroupItem label="Nome" filterKey="nome">
                        <MultiInput
                            showValueHelpIcon
                            value={inputNome}
                            tokens={filtrosSalvosImposto.nomes.map((nome) => (
                            <Token key={nome} text={nome} />
                            ))}
                            onInput={(e: any) => setInputNome(e.target.value)}
                            onKeyDown={(e: any) => {
                                if (e.key === "Enter") {
                                    const value = inputNome.trim();
                                    if (!value) return;
                
                                    setFiltrosSalvosImposto(prev => ({
                                        ...prev,
                                        nomes: [...prev.nomes, value]
                                    }));
                                    setInputNome("");
                                }
                            }}
                        />
                    </FilterGroupItem>
                    </>   
                }
            >
                <AnalyticalTable
                    sortable
                    visibleRows={10}
                    columns={tabelaImposto}
                    data={impostos}
                    loading={loadingImposto}
                    selectionMode="Single"
                    onRowSelect={(e: any) => {
                        const selectedIds = e.detail.selectedRowIds;
                        const rowIndex = Object.keys(selectedIds).find((key) => selectedIds[key]);

                        if (rowIndex !== undefined) {
                            const item = impostos[Number(rowIndex)];
                            handleSelecionarImposto(item);
                            resetBuscaImposto(); 
                        }
                    }}
                />
            </DialogSelecao>

            {/* Dialog Seleção Grupos */}
            <DialogSelecao
                textoDialog="Selecionar Grupo"
                open={openGrupo}
                onClose={() => {
                    setOpenGrupo(false);
                    resetBuscaGrupos();
                }}
                onGo={() => carregarGrupos()}
                filters={
                    <>
                    <FilterGroupItem label="Número" filterKey="numero">
                        <MultiInput
                            showValueHelpIcon
                            value={inputNumeroGrupo}
                            tokens={filtrosSalvosGrupo.numeros.map((numero) => (
                                <Token key={numero} text={numero} />
                            ))}
                            onInput={(e: any) => setInputNumeroGrupo(e.target.value)}
                            onKeyDown={(e: any) => {
                                if (e.key === "Enter" && inputNumeroGrupo.trim()) {
                                    setFiltrosSalvosGrupo(prev => ({
                                        ...prev,
                                        numeros: [...prev.numeros, inputNumeroGrupo.trim()]
                                    }));
                                    setInputNumeroGrupo("");
                                }
                            }}
                            onTokenDelete={(e: any) => {
                                const numeros = e.detail.tokens.map((t: any) => t.text);
                                setFiltrosSalvosGrupo(prev => ({
                                    ...prev,
                                    numeros: prev.numeros.filter(n => !numeros.includes(n))
                                }));
                            }}  
                        />
                    </FilterGroupItem>

                    <FilterGroupItem label="Nome" filterKey="nome">
                        <MultiInput
                            showValueHelpIcon
                            value={inputNomesGrupo}
                            tokens={filtrosSalvosGrupo.nomes.map((nome) => (
                                <Token key={nome} text={nome} />
                            ))}
                            onInput={(e: any) => setInputNomesGrupo(e.target.value)}
                            onKeyDown={(e: any) => {
                                if (e.key === "Enter") {
                                    const value = inputNomesGrupo.trim();
                                    if (!value) return;
                
                                    setFiltrosSalvosGrupo(prev => ({
                                        ...prev,
                                        nomes: [...prev.nomes, value]
                                    }));
                                    setInputNomesGrupo("");
                                }
                            }}
                            onTokenDelete={(e: any) => {
                                const nomes = e.detail.tokens.map((t: any) => t.text);
                                setFiltrosSalvosGrupo(prev => ({
                                    ...prev,
                                    nomes: prev.nomes.filter(n => !nomes.includes(n))
                                }));
                            }} 
                        />
                    </FilterGroupItem>
                    </>
                }
                onConfirm={() => {
                    if (grupoSelecionado.length === 0){
                        setOpenGrupo(false);
                        return;
                    }

                    const novosCodigos = grupoSelecionado.map((g) => g.numero);
                    setFiltrosSalvosItens(prev => ({
                        ...prev,
                        grupos: [...new Set([...prev.grupos, ...novosCodigos])]
                    }));      

                    setGrupoSelecionado([]);
                    setOpenGrupo(false);
                    resetBuscaGrupos();
                }}
            >
                <AnalyticalTable
                    visibleRows={10}
                    columns={tabelaGrupo}
                    data={grupos}
                    loading={loadingGrupo}
                    selectionMode="Multiple"
                    onRowSelect={(e) => {
                        const selectedIds = e.detail.selectedRowIds;
                        const rowsSelecionadas = Object.keys(selectedIds)
                                                    .filter((key) => selectedIds[key])
                                                    .map((key) => grupos[Number(key)]);
                        setGrupoSelecionado(rowsSelecionadas);
                    }}
                />
            </DialogSelecao>

            {/* Dialog Seleção Itens */}
            <DialogSelecao 
                open={openItem}
                onClose={() => {
                    setOpenItem(false);
                    setIndexLinhaAtiva(null);
                    resetBuscaItens();
                }}   
                textoDialog="Lista de itens"
                onGo={() => carregarItens()}
                filters={
                    <>
                    <FilterGroupItem label="Número" filterKey="numero">
                        <MultiInput
                            showValueHelpIcon
                            value={inputNumero}
                            tokens={filtrosSalvosItens.numeros.map((numero) => (
                                <Token key={numero} text={numero} />
                            ))}
                            onInput={(e: any) => setInputNumero(e.target.value)}
                            onKeyDown={(e: any) => {
                                if (e.key === "Enter" && inputNumero.trim()) {
                                    setFiltrosSalvosItens(prev => ({
                                        ...prev,
                                        numeros: [...prev.numeros, inputNumero.trim()]
                                    }));
                                    setInputNumero("");
                                }
                            }}
                            onTokenDelete={(e: any) => {
                                const textos = e.detail.tokens.map((t: any) => t.text);
                                setFiltrosSalvosItens(prev => ({
                                    ...prev,
                                    numeros: prev.numeros.filter(n => !textos.includes(n))
                                }));
                            }}
                        />
                    </FilterGroupItem>

                    <FilterGroupItem label="Grupo" filterKey="grupo">
                        <MultiInput
                            showValueHelpIcon
                            value={inputGrupo}
                            onValueHelpTrigger={() => setOpenGrupo(true)}
                            tokens={filtrosSalvosItens.grupos.map((grupo) => (
                                <Token key={grupo} text={grupo.toString()} />
                            ))}
                            onInput={(e: any) => setInputGrupo(e.target.value)}
                            onKeyDown={(e: any) => {
                                if (e.key === "Enter" && inputGrupo.trim()) {
                                    const novos = grupoSelecionado.map((c) => Number(c.numero));
                                    setFiltrosSalvosItens(prev => ({
                                        ...prev,
                                        grupos: [...new Set<number>([...prev.grupos, ...novos])]
                                    }));
                                    setInputGrupo("");
                                }
                            }} 
                            onTokenDelete={(e: any) => {
                                const codigos = e.detail.tokens.map((t: any) => Number(t.text));
                                setFiltrosSalvosItens(prev => ({
                                    ...prev,
                                    grupos: prev.grupos.filter(n => !codigos.includes(n))
                                }));
                            }}     
                        />       
                    </FilterGroupItem>
                    </>   
                }
                onConfirm={() => {
                    if (itensParaAdicionar.length === 0) {
                        setOpenItem(false);
                        setIndexLinhaAtiva(null);
                        return;
                    }

                    setLinhas(prev => {
                        let novasLinhas = [...prev];
                        let itensRestantes = [...itensParaAdicionar];

                        if (indexLinhaAtiva !== null && indexLinhaAtiva >= 0) {
                            const primeiroItem = itensRestantes.shift();

                            if (primeiroItem) {
                                novasLinhas[indexLinhaAtiva] = {
                                    ...novasLinhas[indexLinhaAtiva],
                                    item: primeiroItem.numero,
                                    descricao: primeiroItem.descricao,
                                    quantidade: 1, 
                                    preco: 0,
                                    imposto: ""
                                };
                            }
                        }

                        if (itensRestantes.length > 0) {
                            const novosMapeados: LinhaItemPedido[] = itensRestantes.map((item) => ({
                                id: 0,
                                item: item.numero,
                                descricao: item.descricao,
                                quantidade: 1,
                                imposto: "",
                                preco: 0,
                            }));

                            const preenchidas = novasLinhas.filter(l => l.item || l.imposto);
                            novasLinhas = [...preenchidas, ...novosMapeados];
                        }

                        return normalizeLinhas(novasLinhas);
                    });

                    setItensParaAdicionar([]); 
                    setIndexLinhaAtiva(null); 
                    setOpenItem(false);
                    resetBuscaItens();
                }}
            >
                <AnalyticalTable
                    sortable
                    visibleRows={10}
                    columns={tabelaItem}
                    data={itens}
                    loading={loadingItens}
                    selectionMode="Multiple"
                    onRowSelect={(e) => {
                        if (!e.detail || !e.detail.selectedRowIds) return;
                        
                        const selectedIds = e.detail.selectedRowIds;
                        const rowsSelecionadas = Object.keys(selectedIds)
                                                       .filter((key) => selectedIds[key] === true)
                                                       .map((key) => itens[Number(key)])
                                                       .filter(Boolean); 
                            
                        setItensParaAdicionar(rowsSelecionadas);
                    }}
                />
            </DialogSelecao>

            {/* Dialog Seleção Vendedores */}
            <DialogSelecao 
                open={openVendedores}
                onClose={() => {
                    setOpenVendedores(false);
                    setIndexLinhaAtivaVendedores(null);
                    resetBuscaPedidoVendaVendedor();
                }}   
                textoDialog="Lista de vendedores"
                onGo={() => carregarPedidosVendaVendedor()}
                filters={
                    <>
                    <FilterGroupItem label="Códigos" filterKey="codigos">
                        <MultiInput
                            showValueHelpIcon
                            value={inputCodigoVendedor}
                            tokens={filtrosSalvosVendedor.codigos.map((codigo) => (
                                <Token key={codigo} text={codigo.toString()} />
                            ))}
                            onInput={(e: any) => setInputCodigoVendedor(e.target.value)}
                            onKeyDown={(e: any) => {
                                if (e.key === "Enter" && inputCodigoVendedor.trim()) {
                                    setFiltrosSalvosVendedor(prev => ({
                                        ...prev,
                                        codigos: [...prev.codigos, Number(inputCodigoVendedor.trim())]
                                    }));
                                    setInputCodigoVendedor("");
                                }
                            }}
                            onTokenDelete={(e: any) => {
                                const textos = e.detail.tokens.map((t: any) => Number(t.text));
                                setFiltrosSalvosVendedor(prev => ({
                                    ...prev,
                                    codigos: prev.codigos.filter(n => !textos.includes(n))
                                }));
                            }}
                        />
                    </FilterGroupItem>

                    <FilterGroupItem label="Nomes" filterKey="nomes">
                        <MultiInput
                            showValueHelpIcon
                            value={inputNomeVendedor}
                            tokens={filtrosSalvosVendedor.nomes.map((nome) => (
                                <Token key={nome} text={nome} />
                            ))}
                            onInput={(e: any) => setInputNomeVendedor(e.target.value)}
                            onKeyDown={(e: any) => {
                                if (e.key === "Enter" && inputNomeVendedor.trim()) {
                                    setFiltrosSalvosVendedor(prev => ({
                                        ...prev,
                                        nomes: [...prev.nomes, inputNomeVendedor.trim()]
                                    }));
                                    setInputNomeVendedor("");
                                }
                            }}
                            onTokenDelete={(e: any) => {
                                const textos = e.detail.tokens.map((t: any) => t.text);
                                setFiltrosSalvosVendedor(prev => ({
                                    ...prev,
                                    nomes: prev.nomes.filter(n => !textos.includes(n))
                                }));
                            }}
                        />       
                    </FilterGroupItem>
                    </>   
                }
                onConfirm={() => {
                    if (vendedoresParaAdicionar.length === 0) {
                        setOpenVendedores(false);
                        setIndexLinhaAtivaVendedores(null);
                        return;
                    }

                    setLinhasVendedores(prev => {
                        let novasLinhas = [...prev];
                        let vendedoresRestantes = [...vendedoresParaAdicionar];

                        if (indexLinhaAtivaVendedores !== null && indexLinhaAtivaVendedores >= 0) {
                            const primeiroItem = vendedoresRestantes.shift();

                            if (primeiroItem) {
                                novasLinhas[indexLinhaAtivaVendedores] = {
                                    ...novasLinhas[indexLinhaAtivaVendedores],
                                    codigo: primeiroItem.codigo,
                                    nome: primeiroItem.nome,
                                    observacao: primeiroItem.observacao
                                };
                            }
                        }

                        if (vendedoresRestantes.length > 0) {
                            const novosMapeados: LinhaVendedorPedido[] = vendedoresRestantes.map((vendedor) => ({
                                id: 0,
                                documentoEntrada: undefined,
                                codigo: vendedor.codigo,
                                nome: vendedor.nome,
                                observacao: vendedor.observacao,
                            }));

                            const preenchidas = novasLinhas.filter(l => l.codigo);
                            novasLinhas = [...preenchidas, ...novosMapeados];
                        }

                        return normalizeLinhasVendedores(novasLinhas);
                    });

                    setVendedoresParaAdicionar([]); 
                    setIndexLinhaAtivaVendedores(null); 
                    setOpenVendedores(false);
                    resetBuscaPedidoVendaVendedor();
                }}
            >
                <AnalyticalTable
                    sortable
                    visibleRows={10}
                    columns={tabelaVendedores}
                    data={pedidoVendaVendedor}
                    loading={loadingVendedor}
                    selectionMode="Multiple"
                    selectedRowIds={selectedRowIds}
                    onRowSelect={(e) => {
                        if (!e.detail?.selectedRowIds) return;

                        const novoSelectedIds = { ...e.detail.selectedRowIds };

                        Object.keys(novoSelectedIds).forEach((key) => {
                            const vendedor = pedidoVendaVendedor[Number(key)];
                            const jaExiste = linhasVendedores.some((linha) => linha.codigo === vendedor.codigo);
                               
                            if (jaExiste) delete novoSelectedIds[key];
                        });

                        setSelectedRowIds(novoSelectedIds);

                        const rowsSelecionadas = Object.keys(novoSelectedIds)
                                                       .filter((key) => novoSelectedIds[key])
                                                       .map((key) => pedidoVendaVendedor[Number(key)]);

                        setVendedoresParaAdicionar(rowsSelecionadas);
                    }}
                />
            </DialogSelecao>

            {/* Dialog Seleção Pessoa Contato */}
            <DialogSelecao 
                open={openParceiroContato}
                onClose={() => {
                    setOpenParceiroContato(false);
                    resetBuscaPessoaContato();
                }}   
                textoDialog="Pessoas de contato"
                onGo={() =>{
                    setFiltrosPessoaContatoSalvo(prev => ({
                        ...prev,
                        cliente: parceiroNegocioSelecionado?.codigoCliente as string
                    }));
                    carregarPessoasContato();
                } }
                filters={
                    <>
                    <FilterGroupItem label="Código" filterKey="codigo">
                        <MultiInput
                            showValueHelpIcon
                            value={inputCodigoPessoaContato}
                            tokens={filtrosPessoaContatoSalvo.codigos.map((codigo) => (
                                <Token key={codigo} text={codigo} />
                            ))}
                            onInput={(e: any) => setInputCodigoPessoaContato(e.target.value)}
                            onKeyDown={(e: any) => {
                                if (e.key === "Enter" && inputCodigoPessoaContato.trim()) {
                                    setFiltrosPessoaContatoSalvo(prev => ({
                                        ...prev,
                                        codigos: [...prev.codigos, inputCodigoPessoaContato.trim()]
                                    }));
                                    setInputCodigoPessoaContato("");
                                }
                            }}
                            onTokenDelete={(e: any) => {
                                const textos = e.detail.tokens.map((t: any) => t.text);
                                setFiltrosPessoaContatoSalvo(prev => ({
                                    ...prev,
                                    codigos: prev.codigos.filter(n => !textos.includes(n))
                                }));
                            }}
                        />
                    </FilterGroupItem>

                    <FilterGroupItem label="Nome" filterKey="nome">
                        <MultiInput
                            showValueHelpIcon
                            value={inputNomePessoaContato}
                            tokens={filtrosPessoaContatoSalvo.nomes.map((nome) => (
                                <Token key={nome} text={nome} />
                            ))}
                            onInput={(e: any) => setInputNomePessoaContato(e.target.value)}
                            onKeyDown={(e: any) => {
                                if (e.key === "Enter" && inputNomePessoaContato.trim()) {
                                    setFiltrosPessoaContatoSalvo(prev => ({
                                        ...prev,
                                        nomes: [...prev.nomes, inputNomePessoaContato.trim()]
                                    }));
                                    setInputNomePessoaContato("");
                                }
                            }}
                            onTokenDelete={(e: any) => {
                                const textos = e.detail.tokens.map((t: any) => t.text);
                                setFiltrosPessoaContatoSalvo(prev => ({
                                    ...prev,
                                    nomes: prev.nomes.filter(n => !textos.includes(n))
                                }));
                            }}
                    />    
                    </FilterGroupItem>
                    </>   
                }
            >
                <AnalyticalTable
                    sortable
                    visibleRows={10}
                    columns={tabelaPessoaContato}
                    data={pessoasContato}
                    loading={loadingParceiroNegocio.pessoasContato}
                    selectionMode="Single"
                    onRowSelect={(e: any) => {
                        const contatoSelecionado = e.detail.row?.original;
                        if(contatoSelecionado){
                            atualizarFormulario({ pessoaContato: contatoSelecionado.codigoPessoaContato });
                            if (parceiroNegocioSelecionado) parceiroNegocioSelecionado.pessoaContato = contatoSelecionado.nome;
                            setOpenParceiroContato(false);
                        }
                        resetBuscaPessoaContato();
                    }}
                />
            </DialogSelecao>

            <div style={{ 
                flex: 1, 
                display: 'flex', 
                flexDirection: 'column', 
                overflow: 'hidden',
                minHeight: 0
            }}>
                <ObjectPage
                    style={{ 
                        height: '100%',
                    }}
                    footerArea={
                    <Bar
                        design="FloatingFooter"
                        endContent={
                        <>
                            {isEdicao ? (
                                <Button
                                    design="Emphasized"
                                    onClick={handleAtualizar}
                                >
                                    Atualização
                                </Button>
                            ) : (
                                <Button
                                    design="Emphasized"
                                    disabled={!podeAdicionar}
                                    onClick={handleAdicionar}
                                >
                                    Adicionar
                                </Button>
                            )}
                            <Button onClick={tratarCancelar}>Cancelar</Button>
                        </>
                        }
                    />
                    }
                    mode="IconTabBar"
                    headerPinned
                    hidePinButton 
                    selectedSectionId="geral" 
                    headerArea={
                        <ObjectPageHeader>
                            <div
                                style={{
                                    display: "grid",
                                    gridTemplateColumns: "repeat(4, max-content)",
                                    justifyContent: "start",
                                    gap: "30px",
                                    width: "100%"
                                }}
                            >
                                <FlexBox direction="Column" style={{ gap: "2px", alignItems: "flex-start" }}>
                                    <Label>Cliente</Label>
                                    {parceiroNegocioSelecionado && (
                                        <FlexBox direction="Column" style={{ gap: "2px", alignItems: "flex-start" }}>
                                            <FlexBox alignItems="Center">
                                                <Icon name="feeder-arrow" style={{ color: "#ff9306" }} />
                                                <Link onClick={(evento) => abrirCliente(evento.target, parceiroNegocioSelecionado.codigoCliente)}>
                                                    {parceiroNegocioSelecionado.codigoCliente}
                                                </Link>
                                            </FlexBox>
                                            <Label>{parceiroNegocioSelecionado.nomeCliente}</Label>
                                        </FlexBox>
                                    )}
                                </FlexBox>

                                <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                                    <Label>Total</Label>
                                    <Label>
                                        {totalPedido.toLocaleString("pt-BR", {
                                            style: "currency",
                                            currency: "BRL"
                                        })}
                                    </Label>
                                </div>

                                <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                                    <Label>Status</Label>
                                    <Label style={{ color: "#107e3e" }}>Abrir</Label>
                                </div>

                                <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                                    <Label>Utilização do limite de crédito</Label>
                                    <ProgressIndicator value={0} valueState="Positive" />
                                </div>
                            </div>
                        </ObjectPageHeader>
                    }
                    titleArea={ 
                        <ObjectPageTitle header={`Pedido de venda ${proximoCodigo}`} />
                    }
                >
                    <ObjectPageSection id="geral" titleText="Geral"> 
                        <Form layout="S1 M2 L2 XL2" labelSpan="S12 M12 L12 XL12">
                            <FormGroup headerText="Detalhes do cliente">
                                {!isEdicao && (
                                    <>
                                        <FormItem labelContent={<Label required>Cliente:</Label>}>
                                            <MultiInput
                                                onValueHelpTrigger={() => setOpenCliente(true)}
                                                showValueHelpIcon
                                                value={parceiroNegocioSelecionado?.codigoCliente || ""}
                                            />
                                        </FormItem>

                                        <FormItem labelContent={<Label>Nome:</Label>}>
                                            <Input type="Text" readonly value={parceiroNegocioSelecionado?.nomeCliente || ""} />
                                        </FormItem>
                                    </>
                                )}
                                
                                <FormItem labelContent={<Label>Pessoa de contato:</Label>}>
                                {parceiroNegocioSelecionado?.codigoCliente && (
                                        <MultiInput
                                            showValueHelpIcon
                                            onValueHelpTrigger={() => setOpenParceiroContato(true)}
                                            value={parceiroNegocioSelecionado?.pessoaContato || ""}  
                                        />
                                )}
                                </FormItem>
                                
                                <FormItem labelContent={<Label>Nº de referência do cliente:</Label>}>
                                    <Input 
                                        type="Text" 
                                        value={dadosForm.numeroReferenciaCliente}
                                        onInput={(e: any) => {
                                            const numeroReferencia = e.target.value;
                                            atualizarFormulario({ numeroReferenciaCliente: numeroReferencia });
                                        }}
                                    />
                                </FormItem>
                                
                                <FormItem labelContent={<Label>E-mail:</Label>}>
                                    <Input type="Text" readonly value={parceiroNegocioSelecionado?.emailContato || ""}/>
                                </FormItem>
                            </FormGroup>

                            <FormGroup headerText="Detalhes do documento">
                                <FormItem labelContent={<Label required>Data entrega:</Label>}>
                                    <DatePicker
                                        primaryCalendarType="Gregorian"
                                        value={dadosForm.dataEntrega || ""}
                                        valueState="None"
                                        placeholder='dd/MM/yyyy'
                                        onChange={(event) => atualizarFormulario({"dataEntrega": event.target.value})}
                                    />
                                </FormItem>
                                
                                {!isEdicao && (
                                    <FormItem labelContent={<Label required>Filial:</Label>}>
                                        <ComboBox 
                                            valueState="None" 
                                            loading={loadingFiliais} 
                                            onOpen={carregarFiliais}
                                            value={filial.find(f => f.codigo === dadosForm.empresa)?.nome || ""}
                                            onSelectionChange={(event: any) =>{
                                                const filialSelecionada = event.detail.item;
                                                if(filialSelecionada)
                                                    atualizarFormulario({"empresa": Number(filialSelecionada.value)});      
                                            }} 
                                        >
                                            {filial.map((item) => (
                                                <ComboBoxItem 
                                                    key={item.codigo} 
                                                    text={item.nome} 
                                                    value={item.codigo.toString()} 
                                                />
                                            ))}
                                        </ComboBox>
                                    </FormItem>
                                )}
                            </FormGroup>
                        </Form>
                    </ObjectPageSection>

                    <ObjectPageSection id="conteudo" titleText="Conteúdo"> 
                        <FlexBox direction="Column">
                            <Bar
                                design="Header"
                                startContent={<Label style={{ color: "#0a6ed1", fontWeight: "bold" }}>Produto</Label>}
                                endContent={
                                    <Button
                                        icon="delete"
                                        disabled={idsMarcadosParaExcluir.length === 0}
                                        design="Transparent"
                                        onClick={removerSelecionados}
                                    />
                                }
                            /> 
                        
                            <Table 
                                id="table-itens"
                                overflowMode="Scroll"
                                features={
                                    <TableSelectionMulti
                                        ref={selectionRef}
                                        behavior="RowSelector" 
                                        onChange={handleSelectionChange}
                                    />
                                }
                                headerRow={
                                    <TableHeaderRow sticky>
                                        <TableHeaderCell minWidth="50px" width="50px"><span>#</span></TableHeaderCell>
                                        <TableHeaderCell minWidth="200px"><span>Nº do item</span></TableHeaderCell>
                                        <TableHeaderCell minWidth="200px"><span>Descrição do item</span></TableHeaderCell>
                                        <TableHeaderCell minWidth="100px"><span>Quantidade</span></TableHeaderCell>
                                        <TableHeaderCell minWidth="100px"><span>Preço unitário</span></TableHeaderCell>
                                        <TableHeaderCell minWidth="200px"><span>Código de imposto</span></TableHeaderCell>
                                    </TableHeaderRow>
                                }
                            >
                                    {linhas.map((linha, index) => (
                                            <TableRow key={`item-${linha.id}`} rowKey={`item-${linha.id}`}>
                                                <TableCell>{index + 1}</TableCell>
                                                <TableCell>
                                                    <MultiInput
                                                        required
                                                        value={linha.item}
                                                        showValueHelpIcon
                                                        onValueHelpTrigger={() => {
                                                            setIndexLinhaAtiva(index);
                                                            setOpenItem(true);
                                                        }}
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <Input readonly value={linha.descricao} />
                                                </TableCell>
                                                <TableCell>
                                                    {linha.item && (
                                                        <Input
                                                            type='Number' 
                                                            value={linha.quantidade.toString()}
                                                            onInput={(e: any) => atualizarLinha(linha.id, "quantidade", e.target.value)} 
                                                        />
                                                    )}
                                                </TableCell>
                                                <TableCell>
                                                    {linha.item && (
                                                        <Input 
                                                            type='Number' 
                                                            onInput={(e: any) => atualizarLinha(linha.id, "preco", e.target.value)} 
                                                            value={linha.preco.toString()}
                                                        />
                                                    )}
                                                </TableCell>
                                                <TableCell>
                                                    {linha.item && (
                                                        <MultiInput
                                                            required
                                                            value={linha.imposto}
                                                            showValueHelpIcon
                                                            onValueHelpTrigger={() => {
                                                                setImpostoSelecionado(linha.id);
                                                                setOpenImposto(true);
                                                            }}
                                                        />
                                                    )}
                                                </TableCell>
                                            </TableRow>
                                    ))}
                            </Table>
                        </FlexBox>
                    </ObjectPageSection>

                    <ObjectPageSection id="vendedores" titleText="Vendedores"> 
                        <FlexBox direction="Column">
                            <Bar
                                design="Header"
                                startContent={<Label style={{ color: "#0a6ed1", fontWeight: "bold" }}>Vendedores</Label>}
                                endContent={
                                    <Button
                                        icon="delete"
                                        disabled={idsMarcadosParaExcluirVendedores.length === 0}
                                        design="Transparent"
                                        onClick={removerVendedoresSelecionados}
                                    />
                                }
                            /> 
                        
                            <Table 
                                id="table-vendedores"
                                overflowMode="Scroll"
                                features={
                                    <TableSelectionMulti
                                        ref={vendedoresReferencia}
                                        behavior="RowSelector" 
                                        onChange={handleSelectionChangeVendedores}
                                    />
                                }
                                headerRow={
                                    <TableHeaderRow sticky>
                                        <TableHeaderCell minWidth="50px" width="50px"><span>#</span></TableHeaderCell>
                                        <TableHeaderCell minWidth="200px"><span>Código do vendedor</span></TableHeaderCell>
                                        <TableHeaderCell minWidth="200px"><span>Nome do vendedor</span></TableHeaderCell>
                                        <TableHeaderCell minWidth="100px"><span>Observação</span></TableHeaderCell>
                                    </TableHeaderRow>
                                }
                            >
                                    {linhasVendedores.map((linha, index) => (
                                            <TableRow key={`vendedor-${linha.id}`} rowKey={`vendedor-${linha.id}`}>
                                                <TableCell>{index + 1}</TableCell>
                                                <TableCell>
                                                    <MultiInput
                                                        required
                                                        value={linha.codigo?.toString() ?? ""}
                                                        showValueHelpIcon
                                                        onValueHelpTrigger={() => {
                                                            setIndexLinhaAtivaVendedores(index);
                                                            setOpenVendedores(true);
                                                        }}
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <Input readonly value={linha.nome || ""} />
                                                </TableCell>
                                                <TableCell>
                                                    <Input readonly value={linha.observacao || ""} />
                                                </TableCell>
                                            </TableRow>
                                    ))}
                            </Table>
                        </FlexBox>
                    </ObjectPageSection>

                    <ObjectPageSection id="anexo" titleText="Anexos"> 
                        <FlexBox direction="Column">
                            <Bar
                                design="Header"
                                startContent={<Label style={{ color: "#0a6ed1", fontWeight: "bold" }}>Anexo</Label>}
                                endContent={
                                    <>
                                        <FileUploader
                                            hideInput
                                            multiple
                                            onChange={(e) => {
                                                const arquivos = Array.from(e.target.files ?? []);
                                                if (arquivos.length > 0) uploadAnexo(arquivos);
                                            }}
                                            valueState="None"
                                            >
                                            <Button design="Transparent">
                                                Carregar
                                            </Button>
                                        </FileUploader>

                                        <Button
                                            icon="delete"
                                            disabled={anexosSelecionadas.length === 0}
                                            design="Transparent"
                                            onClick={() =>{
                                                removerAnexos(anexosSelecionadas);
                                                setAnexosSelecionadas([])
                                            } }    
                                        />
                                    </>
                                }
                            /> 
                        
                            <Table 
                                id="table-anexos"
                                overflowMode="Scroll"
                                features={
                                    <TableSelectionMulti
                                        ref={anexoReferencia}
                                        behavior="RowSelector"
                                        onChange={selecionarAnexos} 
                                    />
                                }
                                headerRow={
                                    <TableHeaderRow sticky>
                                        <TableHeaderCell minWidth="200px"><span>Caminho de destino</span></TableHeaderCell>
                                        <TableHeaderCell minWidth="100px"><span>Nome do arquivo</span></TableHeaderCell>
                                        <TableHeaderCell minWidth="100px"><span>Extensão do arquivo</span></TableHeaderCell>
                                        <TableHeaderCell minWidth="100px"><span>Tamanho do arquivo</span></TableHeaderCell>
                                    </TableHeaderRow>
                                }
                            >
                                    {arquivosUpload.map((anexo, index) => (
                                            <TableRow key={index} rowKey={index.toString()}>
                                                <TableCell>
                                                    <Text>{anexo.caminhoDestino}</Text>
                                                </TableCell>
                                                <TableCell>
                                                    <Button 
                                                        design='Transparent'
                                                        icon={AnexoIconeHelper.obterIcone(anexo.extensaoArquivo)}  
                                                        >
                                                            {anexo.nomeArquivo}
                                                    </Button>
                                                </TableCell>
                                                <TableCell>
                                                    <Text>{anexo.extensaoArquivo}</Text>
                                                </TableCell>
                                            <TableCell>
                                                    <Text>{anexo.tamanhoArquivo.toString()} KB</Text>
                                                </TableCell>
                                            </TableRow>
                                    ))}
                            </Table>
                        </FlexBox>
                    </ObjectPageSection>
                </ObjectPage>
            </div>

            <PopoverView texto={"Parceiro de negócios"} {...popoverProps} />

            <Toast 
                open={openToast} 
                onClose={() => setOpenToast(false)} 
                placement="BottomCenter"
                style={{
                    "background": "white",
                    "color": "black",
                    "border": "1px solid #d9d9d9",
                    "boxShadow": "0 4px 10px rgba(0,0,0,0.1)"
                }}
            >
                Operação concluída com sucesso!
            </Toast>

        </div>
    </BusyIndicator>
  );
}
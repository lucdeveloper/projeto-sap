import { 
    Link, 
    Bar,
    FlexBox, 
    Form, 
    FormGroup, 
    FormItem, 
    Icon, Label, 
    ObjectPage, 
    ObjectPageHeader, 
    ObjectPageSection, 
    ObjectPageTitle, 
    ProgressIndicator, 
    Table, 
    TableHeaderCell, 
    TableHeaderRow, 
    Text,
    TableCell,
    TableRow,
    Toolbar,
    ToolbarButton,
    Button,
    BusyIndicator
} from '@ui5/webcomponents-react';
import { PedidoVendaRetornoDTO } from '../../../interfaces/PedidosVenda.ts';
import { useClientePopover } from '../../../hooks/Popover/useClientePopover.ts';
import { PopoverView } from '../../PopoverView.tsx';
import { formatarDataBR } from '../../../utils/dateUtils.ts'
import { formatarMoedaBR } from '../../../utils/currencyUtils.ts';
import { useItemPopover } from '../../../hooks/Popover/useItemPopover.ts';
import { useMemo } from 'react';
import { DialogMensagem } from '../../DialogMensagem.tsx';
import { AnexoIconeHelper } from '../../../utils/anexoHelper.ts';
import { useAnexoContext } from '../../../contexts/anexoContext.tsx';

interface PedidoVendaViewProps {
    dados?: PedidoVendaRetornoDTO | null; 
    onNovoPedido?: () => void;
    onEditar?: () => void;
}

export function PedidoVendaView({ dados, onNovoPedido, onEditar }: PedidoVendaViewProps ) {
    const { abrirCliente, popoverProps: clienteProps } = useClientePopover();
    const { abrirItem, popoverProps: itemProps } = useItemPopover();
    const {mensagem, setMensagem, loading: loadinAnexo, exibirAnexo } = useAnexoContext();
       
    if (!dados) return null;

    const totalPedido = useMemo(() => {
        return (dados?.itens || []).reduce((total, linha) => {
            const qtd = linha.quantidade || 0;
            const preco = linha.preco || 0;
            return total + (qtd * preco);
        }, 0);
    }, [dados?.itens]);

return (
    <>
        <ObjectPage
            mode= "IconTabBar"
            headerPinned
            hidePinButton 
            selectedSectionId="geral"
            titleArea={
                <ObjectPageTitle
                    header={`Pedido de venda ${dados?.documento}`}   
                    actionsBar={
                        <Toolbar design="Transparent" style={{height: 'auto'}}>
                            <ToolbarButton design="Emphasized" text="Processar" onClick={onEditar}/>
                            <ToolbarButton design="Transparent" text="Novo" onClick={onNovoPedido}/>
                        </Toolbar>
                    } 
                />
            } 
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

                            <FlexBox direction="Column" style={{ gap: "2px", alignItems: "flex-start" }}>
                            
                            <FlexBox alignItems="Center">
                                <Icon name="feeder-arrow" style={{ color: "#ff9306" }} />
                                <Link onClick={(evento) => abrirCliente(evento.target, dados?.codigoCliente as string)}>
                                    {dados?.codigoCliente}
                                </Link>
                            </FlexBox>

                            <Label>{dados?.cliente}</Label>
                            
                            </FlexBox>

                    </FlexBox>

                    <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                        <Label>Total</Label>
                        <Label>
                            {totalPedido.toLocaleString("pt-BR", {style: "currency",currency: "BRL" })}
                        </Label>
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                        <Label>Status</Label>
                        <Label style={{ color: "#107e3e" }}>Abrir</Label>
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                        <Label>Utilização do limite de crédito</Label>
                        <ProgressIndicator
                            value={0}
                            valueState="Positive"
                        />
                    </div>
                </div>
            </ObjectPageHeader>}
        >

        <ObjectPageSection id="geral" titleText="Geral"> 
        
            <Form  layout="S1 M2 L2 XL2" labelSpan="S12 M12 L12 XL12">
    
            <FormGroup headerText="Detalhes do cliente">
                <FormItem labelContent={<Label>Pessoa de contato:</Label>}>
                    <Text>{dados?.pessoaContato}</Text> 
                </FormItem>
                <FormItem labelContent={<Label>Nº de referência do cliente:</Label>}>
                    <Text>{dados?.numeroReferenciaCliente}</Text> 
                </FormItem>
                <FormItem labelContent={<Label>E-mail:</Label>}>
                    <Text>{dados?.emailContato}</Text> 
                </FormItem>
            </FormGroup>

            <FormGroup headerText="Detalhes do documento">
                <FormItem labelContent={<Label>Data de lançamento:</Label>}>
                    <Text>{formatarDataBR(dados?.dataLancamento)}</Text> 
                </FormItem>
                <FormItem labelContent={<Label required>Data de entrega:</Label>}>
                        <Text>{formatarDataBR(dados?.dataEntrega)}</Text> 
                </FormItem>
                <FormItem labelContent={<Label> Data do documento:</Label>}>
                        <Text>{formatarDataBR(dados?.dataDocumento)}</Text> 
                </FormItem>
                
            </FormGroup>
                    
            </Form>
        
        </ObjectPageSection>

        <ObjectPageSection id="conteudo" titleText="Conteúdo"> 
        
            <FlexBox direction="Column">
                <Bar
                    design="Header"
                    startContent={<Label style={{ color: "#0a6ed1", fontWeight: "bold" }}>Produto</Label>}
                /> 
            
                <Table id="table"
                    overflowMode="Scroll"
                    headerRow=
                    {<TableHeaderRow sticky>
                        <TableHeaderCell minWidth="200px" width="200px"><span>#</span></TableHeaderCell>
                        <TableHeaderCell minWidth="200px"><span>Nº do item</span></TableHeaderCell>
                        <TableHeaderCell minWidth="200px"><span>Descrição do item</span></TableHeaderCell>
                        <TableHeaderCell minWidth="100px"><span>Quantidade</span></TableHeaderCell>
                        <TableHeaderCell minWidth="100px"><span>Preço unitário</span></TableHeaderCell>
                        <TableHeaderCell minWidth="200px"><span>Código de imposto</span></TableHeaderCell>
                    </TableHeaderRow>}
                        >
                            {dados?.itens?.map((item, index) => (
                                <TableRow  key={`${item.codigo}-${index}`} rowKey={item.codigo.toString()}>

                                    <TableCell>
                                        {index + 1}
                                    </TableCell>

                                    <TableCell>
                                            <FlexBox alignItems="Center" style={{ gap: "0.25rem" }}>
                                            <Icon name="feeder-arrow" style={{ color: "#ff9306" }} />
                                            <Link wrappingType="None" onClick={(e) => abrirItem(e.target, item.codigo)}>{item.codigo}</Link>
                                        </FlexBox>
                                    </TableCell>

                                    <TableCell>
                                        <Text>{item.descricao}</Text>
                                    </TableCell>

                                    <TableCell>
                                            <Text>{item.quantidade}</Text>
                                    </TableCell>

                                    <TableCell>
                                            <Text>{formatarMoedaBR(item.preco)}</Text>
                                    </TableCell>

                                    <TableCell>
                                        <Text>{item.imposto}</Text>
                                    </TableCell>
                                </TableRow>
                        ))} 
                </Table>
            </FlexBox>

        </ObjectPageSection>

        <ObjectPageSection id="anexo" titleText="Anexo"> 
        
            <FlexBox direction="Column">
                <Bar
                    design="Header"
                    startContent={<Label style={{ color: "#0a6ed1", fontWeight: "bold" }}>Anexo</Label>}
                /> 
            
                <Table id="table"
                    overflowMode="Scroll"
                    headerRow=
                    {<TableHeaderRow sticky>
                        <TableHeaderCell minWidth="200px"><span>Caminho de destino</span></TableHeaderCell>
                        <TableHeaderCell minWidth="100px"><span>Nome do arquivo</span></TableHeaderCell>
                        <TableHeaderCell minWidth="100px"><span>Extensão do arquivo</span></TableHeaderCell>
                        <TableHeaderCell minWidth="100px"><span>Tamanho do arquivo</span></TableHeaderCell>
                    </TableHeaderRow>}
                        >
                            {dados?.anexos?.map((item, index) => (
                                <TableRow  key={`${item.linha}-${index}`} rowKey={item.linha.toString()}>

                                    <TableCell>
                                        <Text>{item.caminhoDestino}</Text>
                                    </TableCell>

                                    <TableCell>
                                            <Button 
                                                design='Transparent'
                                                icon={AnexoIconeHelper.obterIcone(item.extensaoArquivo)}  
                                                onClick={() => 
                                                    exibirAnexo(item.codigo, item.linha)
                                                }>
                                                    {item.nomeArquivo}
                                            </Button>
                                    </TableCell>

                                    <TableCell>
                                        <Text>{item.extensaoArquivo}</Text>
                                    </TableCell>

                                    <TableCell>
                                        <Text>{item.tamanho} KB</Text>
                                    </TableCell>
                                </TableRow>
                        ))} 
                </Table>
            </FlexBox>
            
        </ObjectPageSection>

        </ObjectPage>
        
        <PopoverView
            texto={"Parceiro de negócios"}
            {...clienteProps}
        >
        </PopoverView>

       <PopoverView
            texto={"Item"}
            {...itemProps}
        >
        </PopoverView>

        { loadinAnexo && ( <BusyIndicator /> )  }
                  
        {
            mensagem && (
                <DialogMensagem
                    open={!!mensagem}
                    titulo="Erro"
                    mensagem={mensagem}
                    tipo="Critical"
                    onClose={() => setMensagem(undefined)}
                />
            )
        }
    </>
  );
}
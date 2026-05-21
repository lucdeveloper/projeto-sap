import {
  AnalyticalTable,
  Title,
  FlexBox,
  FilterBar,
  FilterGroupItem,
  DynamicPage,
  DynamicPageHeader,
  DynamicPageTitle,
  VariantManagement,
  VariantItem,
  MultiInput,
  Token,
  MultiComboBox,
  MultiComboBoxItem,
  Button,
  TextAlign,
  Link
} from "@ui5/webcomponents-react";

import { Icon } from "@ui5/webcomponents-react/Icon";
import { useEffect, useMemo, useState } from "react";
import { PopoverView } from "../../PopoverView.tsx";
import { useNavigate } from "react-router-dom";
import { DialogSelecao } from "../../DialogSelecao.tsx";
import { useClientePopover } from "../../../hooks/Popover/useClientePopover.ts";
import { FiltrosParceiroNegocio} from "../../../interfaces/ParceiroNegocio.ts";
import { useParceiroNegocioSearch } from "../../../hooks/useParceiroNegocioSearch.ts";
import { usePedidosVenda } from "../../../hooks/usePedidosVenda.ts";
import { FiltrosPedidosVenda } from "../../../interfaces/PedidosVenda.ts";
import { STATUS_PEDIDO_OPTIONS } from "../../../constants/pedidoVenda.ts";

export function ConsultaPedidoVenda() {
  const navigate = useNavigate();
  const { abrirCliente, popoverProps } = useClientePopover();
  const {pedidos, loadings, carregarPedidosVenda, filtrosSalvos, setFiltrosSalvos, inputCliente, setInputCliente, carregarPorDocumentoEntrada } = usePedidosVenda();

  const tabelaPedidosVenda = useMemo(() => [
      { Header: "Nº Documento",  accessor: "numeroDocumento" },
      {
        Header: "Código Cliente",
        accessor: "codigoCliente",
        Cell: (instance: any) => {
          const value = instance.cell.value;
          return (
            <FlexBox alignItems="Center" style={{ gap: "0.25rem" }}>
              <Icon name="feeder-arrow" style={{ color: "#ff9306" }} />
              <Link
                wrappingType="None"
                onClick={(evento: any) => {
                  evento.stopPropagation();
                  const alvoNativo = evento.detail?.targetRef || evento.currentTarget;
                  abrirCliente(alvoNativo, value);
                }}
              >
                {value}
              </Link>            
            </FlexBox>
          );
        }
      },
      { Header: "Nome Cliente",accessor: "nomeCliente" },
      { Header: "Referência", accessor: "numeroReferenciaCliente" },
      { Header: "Data Lançamento",  accessor: "dataLancamento",  hAlign: TextAlign.End },
      { Header: "Data Entrega",  accessor: "dataEntrega", hAlign: TextAlign.End },
      {
        Header: "Total",
        accessor: "totalDocumento",
        hAlign: TextAlign.End,
        Cell: (instance: any) => {
          const value = instance.cell.value;
          return value?.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL"
          });
        }
      },
      { Header: "Status", accessor: "status" }
           
  ], []);
    
  const tabelaClientes = [
    { Header: "Código do PN", accessor: "codigoCliente" },
    { Header: "Nome do PN", accessor: "nomeCliente" },
    { Header: "Saldo do parceiro de negócios", accessor: "saldoTotal" },
    { Header: "Moeda", accessor: "moeda" }
  ]

  /* Componentes de parceiros de negocio */
  const [openCliente, setOpenCliente] = useState(false);
  const [selectedClientes, setSelectedClientes] = useState<any[]>([]);
      
  const {
    parceirosNegocio, 
    loadings: loadingParceiroNegocio, 
    filtrosSalvos: filtrosSalvosParceiroNegocio, 
    setFiltrosSalvos: setFiltrosSalvosParceiroNegocio, 
    inputCodigo: inputCodigoParceiroNegocio, 
    setInputCodigo: setInputCodigoParceiroNegocio, 
    inputNome: inputNomeParceiroNegocio, 
    setInputNome: setInputNomeParceiroNegocio, 
    carregarParceirosNegocio, 
    resetBuscaParceiroNegocio,
  } = useParceiroNegocioSearch();

  useEffect(() => {
    if (openCliente) {
      const filtrosIniciais: FiltrosParceiroNegocio = { codigos: [], nomes: [] };
      carregarParceirosNegocio(filtrosIniciais);
    }
  }, [openCliente]);

  /* Componentes de pedidos de venda */
  const totalPedidos = useMemo(() => { 
    return pedidos.reduce((acc, item) => acc + Number(item.totalDocumento || 0), 0)
  },[pedidos]);

  useEffect(() => {
    const filtrosIniciais: FiltrosPedidosVenda = { clientes: [], status: [] };
    carregarPedidosVenda(filtrosIniciais);
  }, []);

  const atualizarFiltro = (key: string, value: any) => {
    setFiltrosSalvos((prev) => ({
      ...prev,
      [key]: value
    }));
  }; 

  const enviarPedidoAtualizacao = async (numeroDocumento: number) => {
    try{
        const pedido = await carregarPorDocumentoEntrada(numeroDocumento);
        navigate(`/pedido-venda/${numeroDocumento}`, {
          state: {
          pedido: pedido,
          modoVisualizacao: true
          }
        });
      }catch (error){
        console.error("Erro ao carregar pedido para visualização:", error);
      }         
  }

  return (
    <>
      <DialogSelecao  
            open={openCliente} 
            onClose={() => {
              setOpenCliente(false);
              resetBuscaParceiroNegocio();
            }}  
            textoDialog="Selecionar clientes"
            onGo={() => carregarParceirosNegocio()}
            onConfirm={() => {
              if (selectedClientes.length === 0) setOpenCliente(false);

              const novosCodigos = selectedClientes.map((c) => c.codigoCliente);

              const listaAtualizada = Array.from(
                new Set([...filtrosSalvos.clientes, ...novosCodigos])
              );

              atualizarFiltro("clientes", listaAtualizada);
              setSelectedClientes([]);
              setOpenCliente(false);
              resetBuscaParceiroNegocio();
            }}
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
                  visibleRows={10}
                  sortable
                  columns={tabelaClientes}
                  data={parceirosNegocio}
                  loading={loadingParceiroNegocio.parceiroNegocio}
                  selectionMode="Multiple"
                  onRowSelect={(e) => {
                    const linhasSelecionadas = Object.keys(e.detail.selectedRowIds)
                                                     .filter((key) => e.detail.selectedRowIds[key])
                                                     .map((key) => parceirosNegocio[Number(key)]);

                    setSelectedClientes(linhasSelecionadas);
                  }}
               />

      </DialogSelecao>
        
      <DynamicPage
        style={{
          height: "100vh",
          overflow: "hidden",
          background: "var(--sapBackgroundColor)"
        }}
        hidePinButton
        headerArea={
          <DynamicPageHeader>
            <FilterBar
              filterContainerWidth="13.125rem" 
              header={<Title level="H2" size="H4">FilterBar</Title>} 
              hideToolbar 
              showGoOnFB 
              hideFilterConfiguration 
              onGo={() => carregarPedidosVenda()}
            >
              <FilterGroupItem filterKey="clientes" label="Cliente">
                <MultiInput
                  showValueHelpIcon
                  value={inputCliente}
                  tokens={filtrosSalvos.clientes.map((codigo) => (
                    <Token key={codigo} text={codigo} />
                  ))}
                  onInput={(e: any) => setInputCliente(e.target.value)}
                  onKeyDown={(e: any) => {
                    if (e.key === "Enter") {
                      const value = inputCliente.trim();
                      if (!value) return;
                      if (!filtrosSalvos.clientes.includes(value)) {
                        atualizarFiltro("clientes", [...filtrosSalvos.clientes, value]);
                      }
                      setInputCliente("");
                    }
                  }}
                  onTokenDelete={(e: any) => {
                    const tokensRemovidos = e.detail.tokens;
                    const novaLista = filtrosSalvos.clientes.filter((cliente) => !tokensRemovidos.some((t: any) => t.text === cliente));
                    atualizarFiltro("clientes", novaLista);         
                  }}
                  onValueHelpTrigger={() => setOpenCliente(true)}
                />
              </FilterGroupItem>

              <FilterGroupItem filterKey="status" label="Status">
                <MultiComboBox
                  onSelectionChange={(e: any) => {
                    const valores = e.detail.items.map( (i: any) => i.dataset.key );
                    atualizarFiltro("status", valores);
                  }}
                >
                  {STATUS_PEDIDO_OPTIONS.map((s) => (
                    <MultiComboBoxItem
                      key={s.value}
                      text={s.label}
                      data-key={s.value}
                    />
                  ))}
                </MultiComboBox>
              </FilterGroupItem>
            </FilterBar>
          </DynamicPageHeader>
        }
        titleArea={
          <DynamicPageTitle
            heading={
              <VariantManagement>
                <VariantItem selected>
                  Meus pedidos de venda
                </VariantItem>
              </VariantManagement>
            }
          />
        }
      >
        <div style={{ padding: "1rem" }}>
          <div
            style={{
              background: "var(--sapGroup_ContentBackground)",
              padding: "1rem",
              borderRadius: "8px",
            }}
          >
            <FlexBox justifyContent="SpaceBetween">
            <Title level="H5">
              Pedidos de vendas
            </Title>
            <Button
              design="Transparent"
              onClick={() => navigate("/pedido-venda")}
            >
            Criar
             </Button>
            </FlexBox>

            <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>

            <AnalyticalTable
                sortable
                visibleRows={10}
                selectionBehavior="RowSelector"
                loading={loadings.pedidos}
                columns={tabelaPedidosVenda}
                data={pedidos}
                onRowClick={(e: any) => {
                  if(e.target.dataset.selectionCell === 'true') return;
                  const pedido = e.detail.row.original;
                    if (pedido && pedido.numeroDocumento) {
                      enviarPedidoAtualizacao(pedido.numeroDocumento);
                    }
                }}
              />

            </div>

            <FlexBox justifyContent="End" style={{ marginTop: "1rem" }}>
              <Title level="H5">
                Total:{" "}
                {totalPedidos.toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL"
                })}
              </Title>
            </FlexBox>
          </div>
        </div>
      </DynamicPage>

      <PopoverView
        texto={"Parceiro de negócios"}
        {...popoverProps}
      >
      </PopoverView>
    </>
  );
}
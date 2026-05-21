import { useLocation, useNavigate } from "react-router-dom";
import { PedidoVendaRetornoDTO } from "../../../interfaces/PedidosVenda";
import { StatusTelaPedido } from "../types";
import { useEffect, useState } from "react";

export function usePedidoVendaState() {
  const navigate = useNavigate();
  const location = useLocation();
  const [pedido, setPedido] = useState<PedidoVendaRetornoDTO | null>(null);
  const [statusTela, setStatusTela] = useState<StatusTelaPedido>(StatusTelaPedido.CRIANDO);

  useEffect(() => {
    const pedidoState = location.state?.pedido ?? null;
    const modoVisualizacao = location.state?.modoVisualizacao ?? false;

    if (pedidoState) {
      setPedido(pedidoState);
      setStatusTela(modoVisualizacao ? StatusTelaPedido.VISUALIZANDO : StatusTelaPedido.EDITANDO);
    } else {
      setPedido(null);
      setStatusTela(StatusTelaPedido.CRIANDO);
    }
  }, [location.state]);

  const ações = {
    aoSalvarComSucesso: (dadosDoBanco: PedidoVendaRetornoDTO) => {
      setPedido(dadosDoBanco);
      setStatusTela(StatusTelaPedido.VISUALIZANDO);
      navigate(location.pathname, {
        replace: true,
        state: { pedido: dadosDoBanco, modoVisualizacao: true }
      });
    },

    irParaNovoPedido: () => {
      setPedido(null);
      setStatusTela(StatusTelaPedido.CRIANDO);
      navigate("/pedido-venda", { replace: true, state: {} });
    },

    irParaEdicao: () => {
      if (!pedido) return;
      setStatusTela(StatusTelaPedido.EDITANDO);
    },

    cancelar: () => {
      navigate("/");
    }
  };

  return {
    pedido,
    statusTela,
    ações
  };
}
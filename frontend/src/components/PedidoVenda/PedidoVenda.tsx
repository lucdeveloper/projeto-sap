import { PedidoVendaView } from "./components/PedidoVendaView";
import { PedidoVendaForm } from "./components/PedidoVendaForm";
import { usePedidoVendaState } from "./hooks/usePedidoVendaState";
import { StatusTelaPedido } from "./types";


export function PedidoVenda() {
  const { pedido, statusTela, ações } = usePedidoVendaState();

  switch (statusTela) {
    case StatusTelaPedido.VISUALIZANDO:
      return (
        <PedidoVendaView
          dados={pedido}
          onNovoPedido={ações.irParaNovoPedido}
          onEditar={ações.irParaEdicao}
        />
      );

    case StatusTelaPedido.EDITANDO:
    case StatusTelaPedido.CRIANDO:
    default:
      return (
        <PedidoVendaForm
          onSucesso={ações.aoSalvarComSucesso}
          onCancelar={ações.cancelar}
          dadosEdicao={pedido}
          ehEdicao={statusTela === StatusTelaPedido.EDITANDO}
        />
      );
  }
}
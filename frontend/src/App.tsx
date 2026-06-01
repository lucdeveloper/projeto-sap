import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ConsultaPedidoVenda } from "./components/PedidoVenda/components/ConsultaPedidoVenda.tsx";
import { PedidoVenda } from "./components/PedidoVenda/PedidoVenda.tsx";
import { Anexo } from "./components/Anexo/Anexo.tsx";
import { AnexoProvider } from "./contexts/anexoContext.tsx";
import { Navegacao } from "./components/Navegacao.tsx";
import { ToastProvider } from "./providers/ToastProvider.tsx";
import { MessageBoxProvider } from "./providers/MessageBoxProvider.tsx"; // 1. Importa o novo Provider

function App() {
  return (
    <ToastProvider>
      <MessageBoxProvider>
        <AnexoProvider>
          <BrowserRouter>
            <Routes>
              <Route element={<Navegacao />}>
                <Route index element={<ConsultaPedidoVenda />} />
                <Route path="/anexo" element={<Anexo />} />
                <Route path="/pedido-venda" element={<PedidoVenda />} />
                <Route path="/pedido-venda/:id" element={<PedidoVenda />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </AnexoProvider>
      </MessageBoxProvider>
    </ToastProvider>
  );
}

export default App;
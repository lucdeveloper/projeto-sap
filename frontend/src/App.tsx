import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ConsultaPedidoVenda } from "./components/PedidoVenda/components/ConsultaPedidoVenda.tsx";
import { PedidoVenda } from "./components/PedidoVenda/PedidoVenda.tsx";
import { AppLayout } from "./layouts/AppLayout/AppLayout.tsx";
import { Anexo } from "./components/Anexo/Anexo.tsx";
import { AnexoProvider } from "./contexts/anexoContext.tsx";

function App() {
  return (
     <AnexoProvider>
    <BrowserRouter>
      <Routes>
         <Route element={<AppLayout />}>
            <Route index element={<ConsultaPedidoVenda />} />
            <Route path="/anexo" element={<Anexo />} />
         </Route>
          <Route path="/pedido-venda" element={<PedidoVenda />} />
          <Route path="/pedido-venda/:id" element={<PedidoVenda />} />
      </Routes>
    </BrowserRouter> 
    </AnexoProvider> 
  );
}

export default App;
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ConsultaPedidoVenda } from "./components/PedidoVenda/components/ConsultaPedidoVenda.tsx";
import { PedidoVenda } from "./components/PedidoVenda/PedidoVenda.tsx";
import { AppLayout } from "./layouts/AppLayout/AppLayout.tsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
         <Route element={<AppLayout />}>
            <Route path="/" element={<ConsultaPedidoVenda />} />
         </Route>
          <Route path="/pedido-venda" element={<PedidoVenda />} />
          <Route path="/pedido-venda/:id" element={<PedidoVenda />} />
      </Routes>
    </BrowserRouter>  
  );
}

export default App;
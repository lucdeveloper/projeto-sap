import { Outlet } from "react-router-dom";
import { BarraNavegacao } from "../../components/BarraNavegacao";
import "./AppLayout.css";

export function AppLayout() {
  return (
    <div className="app-shell">
      <BarraNavegacao />

      <div className="app-content">
        <Outlet />
      </div>
    </div>
  );
}
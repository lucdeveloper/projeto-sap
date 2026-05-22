import { Outlet } from "react-router-dom";
import "./AppLayout.css";
import { Navegacao } from "../../components/Navegacao";

export function AppLayout() {
  return (
    <div className="app-shell">
      <Navegacao />

      <div className="app-content">
        <Outlet />
      </div>
    </div>
  );
}
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ThemeProvider } from "@ui5/webcomponents-react";
import App from "./App.tsx";
import "./index.css";

// UI5
import "@ui5/webcomponents/dist/Assets.js";
import "@ui5/webcomponents-react/dist/Assets.js";

// Fiori
import "@ui5/webcomponents-fiori/dist/Assets.js";

// Localization
import "@ui5/webcomponents-localization/dist/Assets.js";

// Calendar
import "@ui5/webcomponents-localization/dist/features/calendar/Gregorian.js";

// Icons
import "@ui5/webcomponents-icons/dist/AllIcons.js";

// Theme
import { setTheme } from "@ui5/webcomponents-base/dist/config/Theme.js";

// Language
import { setLanguage } from "@ui5/webcomponents-base/dist/config/Language.js";

// Localization
import "@ui5/webcomponents-localization/dist/Assets.js";


// Calendar
import "@ui5/webcomponents-localization/dist/features/calendar/Gregorian.js";

setTheme("sap_horizon");
setLanguage("pt-BR");


createRoot(document.getElementById("root") as HTMLElement).render(
  <StrictMode>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </StrictMode>
);
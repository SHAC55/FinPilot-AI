
import { createRoot } from "react-dom/client";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import { AppProvider } from "./context/appContext.jsx";
import { WalletProvider } from "./context/WalletContext.jsx";
import { LedgerProvider } from "./context/LedgerContext.jsx";
import { SplitBillProvider } from "./context/SplitBillContext.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <AppProvider>
      <WalletProvider>
        <LedgerProvider>
          <SplitBillProvider>
            <AuthProvider>
            <App />
            </AuthProvider>
          </SplitBillProvider>
        </LedgerProvider>
      </WalletProvider>
    </AppProvider>
  </BrowserRouter>,
);

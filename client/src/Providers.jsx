// src/context/Providers.js

import { AuthProvider } from "./AuthContext";
import { CreditProvider } from "./CreditContext";
import { DebitProvider } from "./DebitContext";
import { BillProvider } from "./BillContext";
import { SplitProvider } from "./SplitContext";

// 🔥 Clean Wrapper
const AppProviders = ({ children }) => {
  return (
    <AuthProvider>
      <CreditProvider>
        <DebitProvider>
          <BillProvider>
            <SplitProvider>{children}</SplitProvider>
          </BillProvider>
        </DebitProvider>
      </CreditProvider>
    </AuthProvider>
  );
};

export default AppProviders;
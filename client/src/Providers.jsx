// src/context/Providers.js

import { AuthProvider } from "./AuthContext";
import { CreditProvider } from "./CreditContext";
import { DebitProvider } from "./DebitContext";
import { SplitProvider } from "./SplitContext";

//  Clean Wrapper
const AppProviders = ({ children }) => {
  return (
    <AuthProvider>
      <CreditProvider>
        <DebitProvider>
        
            <SplitProvider>{children}</SplitProvider>
          
        </DebitProvider>
      </CreditProvider>
    </AuthProvider>
  );
};

export default AppProviders;
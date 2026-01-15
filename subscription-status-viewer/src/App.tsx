

import { BrowserRouter } from "react-router-dom";
import { Routes, Route } from "react-router";
import Dashboard from "./pages/Dashboard";
import { Authenticator } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";

function App() {
  return (
    <Authenticator>
      {({ signOut }) => (
        <BrowserRouter>
          <div style={{ padding: 20 }}>
            <button onClick={signOut}>Sign out</button>

            <Routes>
              <Route path="/" element={<Dashboard />} />
            
            </Routes>
          </div>
        </BrowserRouter>
      )}
    </Authenticator>
  );
}

export default App;


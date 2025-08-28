import React from "react";
import ReactDOM from "react-dom/client";
  import { AuthProvider } from "./context/AuthContext.jsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import App from "./App.jsx";
import "bootstrap/dist/css/bootstrap.min.css";         
import "bootstrap/dist/js/bootstrap.bundle.min.js";     
 import "./index.css";                            

 
const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </AuthProvider>
  </React.StrictMode>
);

 import { createContext, useState } from "react";

const AuthContext = createContext(null);
export default AuthContext;

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState(() => {
    const raw = localStorage.getItem("auth") || sessionStorage.getItem("auth");
    return raw ? JSON.parse(raw) : { isAuthenticated: false, user: null, token: null };
  });

   const login = (payload) => {
    const state = { isAuthenticated: true, user: payload.user, token: payload.token };
    setAuth(state);
    localStorage.setItem("auth", JSON.stringify(state));    
    sessionStorage.removeItem("auth");                
  };

  const logout = () => {
    setAuth({ isAuthenticated: false, user: null, token: null });
    localStorage.removeItem("auth");
    sessionStorage.removeItem("auth");
      window.history.pushState(null, "Login", window.location.href);
        window.location.href = "/login";
  };

  return (
    <AuthContext.Provider value={{ ...auth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

 import { useContext } from "react";
 import Sidebar from "./Sidebar";
import AuthContext from "../context/AuthContext";
 
export default function PrivateLayout({ children }) {
  const { isAuthenticated } = useContext(AuthContext);

  if (!isAuthenticated) {
    window.location.assign("/login");
    return null;
  }

  return (
    <div className="d-flex" style={{ minHeight: "100vh" }}>
      <Sidebar />
      <main className="flex-grow-1">{children}</main>
    </div>
  );
}

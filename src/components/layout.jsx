import { useContext } from "react";
import { navigate, useRouter } from "../components/customRouter/router";
import AuthContext from "../context/AuthContext";
  
 export default function Layout({ children }) {
  const { path } = useRouter();
  const { logout } = useContext(AuthContext);

  const NavItem = ({ to, icon, label }) => (
    <button
      type="button"
      className={`side-link ${path === to ? "active" : ""}`}
      onClick={() => navigate(to)}
    >
      <span className="icon" aria-hidden>{icon}</span>
      <span className="label">{label}</span>
    </button>
  );

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 3 2 12h3v9h6v-6h2v6h6v-9h3z" />
          </svg>
          <span>PMS</span>
        </div>

        <nav className="nav-block">
          <NavItem to="/"                icon="🏠" label="Home" />
          <NavItem to="/projects/manage" icon="📁" label="Projects" />
        </nav>

        <div className="sidebar-footer">
          <button className="btn btn-outline-plum w-100" onClick={logout}>
            Logout
          </button>
        </div>
      </aside>

      <main className="main">
         <div className="page-container py-4">
          {children}
        </div>
      </main>
    </div>
  );
}

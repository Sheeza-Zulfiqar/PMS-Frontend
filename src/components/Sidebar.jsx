import { useContext } from "react";
import AuthContext from "../context/AuthContext";

export default function Sidebar({ navigate }) {
  const { logout, user } = useContext(AuthContext);

  return (
    <aside className="d-flex flex-column p-3 border-end"
           style={{ width: 80, minHeight: "100vh", background: "#f8fafc" }}>
      <button className="btn btn-link text-decoration-none mb-3" title="Home"
              onClick={() => navigate("/")}>
        <span className="fs-4">🏠</span>
      </button>

      <div className="mt-auto">
        <div className="small text-muted text-center mb-2" title={user?.username || ""}>
          {user?.username?.[0]?.toUpperCase?.() || "👤"}
        </div>
        <button className="btn btn-outline-danger btn-sm w-100"
                onClick={() => { logout(); window.location.assign("/login"); }}>
          Logout
        </button>
      </div>
    </aside>
  );
}

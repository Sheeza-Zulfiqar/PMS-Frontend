 
import { navigate } from "../customRouter/router";

 
export default function Home() {
  return (
    <div className="p-4">
      <h2 className="text-center mb-4">My Workspace</h2>

       <div className="row justify-content-center g-4 home-grid">
         <div className="col-12 col-lg-6">
          <div className="card shadow-sm home-card h-100">
            <div className="card-body text-center py-5">
              <div
                className="mb-3 rounded-circle d-inline-flex align-items-center justify-content-center"
                style={{ width: 72, height: 72, background: "rgba(61,34,54,.1)" }}
              >
                <span style={{ fontSize: 36, color: "var(--brand)" }}>⚙️</span>
              </div>
              <h4 className="card-title mt-2 mb-2">Manage Projects</h4>
              <p className="text-muted mb-4">Review, edit, or delete your projects.</p>
              <button
                className="btn btn-primary px-4"
                onClick={() => navigate("/projects/manage")}
              >
                Open
              </button>
            </div>
          </div>
        </div>

         <div className="col-12 col-lg-6">
          <div className="card shadow-sm home-card h-100">
            <div className="card-body text-center py-5">
              <div
                className="mb-3 rounded-circle d-inline-flex align-items-center justify-content-center"
                style={{ width: 72, height: 72, background: "rgba(217,172,99,.15)" }}
              >
                <span style={{ fontSize: 36, color: "var(--accent)" }}>➕</span>
              </div>
              <h4 className="card-title mt-2 mb-2">Add Project</h4>
              <p className="text-muted mb-4">Create a new project.</p>
              <button
                className="btn btn-accent px-4"
                onClick={() => navigate("/projects/new")}
              >
                Create
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

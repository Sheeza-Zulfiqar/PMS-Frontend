import { useEffect, useState } from "react";
import { listProjects ,deleteProject} from "../../utils/apis";
import { navigate } from "../customRouter/router";
 
 export default function ProjectsList() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  async function load() {
    setErr(""); setLoading(true);
    try {
      const data = await listProjects();
      setRows(Array.isArray(data) ? data : data?.items ?? []);
    } catch (e) {
      setErr(e?.response?.data?.message || e.message || "Failed to load projects.");
    } finally { setLoading(false); }
  }
  useEffect(() => { load(); }, []);

  return (
    <div className=" py-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3 className="mb-0">My Projects</h3>
        <button className="btn btn-accent" onClick={() => navigate("/projects/new")}>+ New</button>
      </div>

      {err && <div className="alert alert-danger">{err}</div>}
      {loading ? <div>Loading…</div> : (
        rows.length === 0 ? <div className="text-muted">No projects yet.</div> : (
          <div className="table-card">
            <table className="table align-middle mb-0">
              <thead className="projects-thead">
                <tr>
                  <th style={{width: 80}}>#</th>
                  <th>Name</th>
                  <th>Description</th>
                  <th style={{width: 170}} className="text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((p, i) => (
                  <tr key={p.id}>
                    <td>
                       <button
                        type="button"
                        className="btn btn-link p-0 link-plain"
                        onClick={() => navigate(`/projects/${p.id}/tasks`)}
                        title="View tasks"
                      >
                        {p.id}
                      </button>
                    </td>
                    <td className="fw-semibold">{p.name}</td>
                    <td className="text-muted">{p.description}</td>
                    <td className="text-end">
                      <button
                        className="btn btn-sm btn-outline-primary me-2"
                        onClick={() => navigate(`/projects/${p.id}/edit`)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={async () => {
                          if (!confirm(`Delete "${p.name}"?`)) return;
                          await deleteProject(p.id);
                          await load();
                        }}
                      >
                        Delete
                      </button>
                      <button
                       type="button"
                        className="btn btn-link p-0 link-plain"
                        onClick={() => navigate(`/projects/${p.id}/tasks`)}
                        title="View tasks"
                      >
                        ViewTasks
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      )}
    </div>
  );
}


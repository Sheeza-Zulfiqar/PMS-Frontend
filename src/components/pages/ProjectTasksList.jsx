import { useEffect, useMemo, useState } from "react";
import {
  listProjectTasks, deleteTask
} from "../../utils/apis";
import { useRouter, navigate } from "../../components/customRouter/router";
import StatusBadge from "../StatusBadge";
 
export default function ProjectTasksList() {
  const { params } = useRouter();
  const projectId = params?.id;

  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  const title = useMemo(() => "Project Tasks", []);

  async function load() {
    setErr(""); setLoading(true);
    try {
      const data = await listProjectTasks(projectId);
      setRows(Array.isArray(data) ? data : data?.items ?? []);
    } catch (e) {
      setErr(e?.response?.data?.message || e.message || "Failed to load tasks.");
    } finally { setLoading(false); }
  }
  useEffect(() => { load(); }, [projectId]);

  return (
    <div className="page-container py-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3 className="mb-0">{title}</h3>
        <button className="btn btn-accent" onClick={() => navigate(`/projects/${projectId}/tasks/new`)}>+ New Task</button>
      </div>

      {err && <div className="alert alert-danger">{err}</div>}
      {loading ? <div>Loading…</div> : (
        rows.length === 0 ? <div className="text-muted">No tasks yet.</div> : (
          <div className="table-card">
            <table className="table align-middle mb-0">
              <thead className="projects-thead">
                <tr>
                  <th style={{width: 70}}>#</th>
                  <th>Title</th>
                  <th style={{width: 160}}>Status</th>
                  <th style={{width: 110}}>Duration</th>
                  <th style={{width: 160}}>Start</th>
                  <th style={{width: 160}}>Finish</th>
                  <th style={{width: 170}} className="text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((t, i) => (
                  <tr key={t.id}>
                    <td>{i + 1}</td>
                    <td className="fw-semibold">{t.title}</td>
                    <td> <StatusBadge label={t.statusText || t.status} /></td>
                    <td>{t.duration ?? "-"}</td>
                    <td>{t.start ? new Date(t.start).toLocaleDateString() : "-"}</td>
                    <td>{t.finish ? new Date(t.finish).toLocaleDateString() : "-"}</td>
                    <td className="text-end">
                      <button
                        className="btn btn-sm btn-outline-primary me-2"
                        onClick={() => navigate(`/projects/${projectId}/tasks/${t.id}/edit`)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={async () => {
                          if (!confirm(`Delete task "${t.title}"?`)) return;
                          await deleteTask(projectId, t.id);
                          await load();
                        }}
                      >
                        Delete
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

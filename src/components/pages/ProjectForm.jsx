 import { useEffect, useState } from "react";
import { createProject, getProject, updateProject } from "../../utils/apis";
import { useRouter, navigate } from "../../components/customRouter/router";

 
export default function ProjectForm() {
   const { params } = useRouter();
  const projectId = params?.id;
  const isEdit = Boolean(projectId);

  const [model, setModel] = useState({ name: "", description: "" });
  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(isEdit);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!isEdit) return;
    (async () => {
      try {
        const p = await getProject(projectId);
        setModel({
          name: p?.name ?? p?.Name ?? "",
          description: p?.description ?? p?.Description ?? "",
        });
      } catch (e) {
        setErrors([
          e?.response?.data?.message || e.message || "Failed to load project.",
        ]);
      } finally {
        setLoading(false);
      }
    })();
  }, [isEdit, projectId]);

  const onChange = (key) => (e) =>
    setModel((m) => ({ ...m, [key]: e.target.value }));

  async function onSubmit(e) {
    e.preventDefault();
    setErrors([]);
    const name = model.name.trim();
    const description = (model.description || "").trim() || null;

    if (!name) {
      setErrors(["Name is required."]);
      return;
    }

    setSubmitting(true);
    try {
      const payload = { name, description };
      if (isEdit) await updateProject(projectId, payload);
      else await createProject(payload);
      navigate("/projects/manage");
    } catch (e) {
      const api = e?.response?.data;
      if (Array.isArray(api)) {
        setErrors(api.map((x) => x.error || x.message || JSON.stringify(x)));
      } else {
        setErrors([
          api?.message || api?.error || e.message || "Failed to save project.",
        ]);
      }
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) return <div className="page-container py-4">Loading…</div>;

  return (
    <div className="page-container py-4">
      <div className="form-card card shadow-sm p-4 p-md-5">
        <div className="d-flex align-items-center justify-content-between mb-3">
          <h2 className="h4 m-0">{isEdit ? "Edit Project" : "Create Project"}</h2>
        </div>

        {errors.length > 0 && (
          <div className="alert alert-danger mb-4">
            <ul className="mb-0">
              {errors.map((m, i) => (
                <li key={i}>{m}</li>
              ))}
            </ul>
          </div>
        )}

        <form onSubmit={onSubmit} noValidate>
          <div className="form-floating mb-3">
            <input
              id="name"
              type="text"
              className="form-control"
              placeholder=" "
              value={model.name}
              onChange={onChange("name")}
              autoFocus
              required
            />
            <label htmlFor="name">Name</label>
          </div>

          <div className="form-floating mb-4">
            <textarea
              id="description"
              className="form-control"
              placeholder=" "
              value={model.description}
              onChange={onChange("description")}
              rows={5}
              style={{ height: "140px" }}
            />
            <label htmlFor="description">Description (optional)</label>
          </div>

          <div className="d-flex gap-2">
            <button className="btn btn-primary px-4" disabled={submitting}>
              {submitting ? (isEdit ? "Updating…" : "Creating…") : "Save"}
            </button>
            <button
              type="button"
              className="btn btn-outline-secondary px-4"
              onClick={() => navigate("/projects/manage")}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

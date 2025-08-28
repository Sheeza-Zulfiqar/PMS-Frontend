import { useEffect, useState } from "react";
import { useRouter, navigate } from "../../components/customRouter/router";
import { createTask, getTask, updateTask } from "../../utils/apis";

 const toISODate = (d) => (d ? new Date(d).toISOString().slice(0, 10) : "");
const addDays = (yyyyMmDd, days) => {
  const dt = new Date(yyyyMmDd);
  dt.setDate(dt.getDate() + days);
  return toISODate(dt);
};

 const STATUS_OPTIONS = [
  { value: 0, label: "Pending" },
  { value: 1, label: "To Do" },
  { value: 2, label: "In Progress" },
  { value: 3, label: "In Review" },
  { value: 4, label: "Done" },
];
const labelToValue = (label) =>
  STATUS_OPTIONS.find((s) => s.label === label)?.value;

export default function TaskForm() {
  const { params } = useRouter();
   const projectId = params?.projectId || params?.id;
  const taskId = params?.taskId;
  const isEdit = !!taskId;

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [duration, setDuration] = useState("");  
  const [start, setStart] = useState("");        
  const [finish, setFinish] = useState("");      
  const [status, setStatus] = useState(0);       

  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(isEdit);
  const [submitting, setSubmitting] = useState(false);

   useEffect(() => {
    if (!isEdit) return;
    (async () => {
      try {
        const t = await getTask(projectId, taskId);
        setTitle(t?.title ?? "");
        setDescription(t?.description ?? "");
        setDuration(String(t?.duration ?? ""));
        setStart(toISODate(t?.start));
        setFinish(toISODate(t?.finish));

         const s =
          typeof t?.status === "number"
            ? t.status
            : labelToValue(t?.statusText) ?? 0;
        setStatus(s);
      } catch (e) {
        setErrors([e?.response?.data?.message || e.message || "Failed to load task."]);
      } finally {
        setLoading(false);
      }
    })();
  }, [isEdit, projectId, taskId]);

   useEffect(() => {
    const d = parseInt(duration, 10);
    if (!start || !d || d <= 0) { setFinish(""); return; }
    setFinish(addDays(start, d - 1));
  }, [start, duration]);

  async function onSubmit(e) {
    e.preventDefault();

    const errs = [];
    if (!title.trim()) errs.push("Title is required.");
    const d = parseInt(duration, 10);
    if (!(d > 0)) errs.push("Duration (days) is required.");
    if (!start) errs.push("Start date is required.");
    if (errs.length) { setErrors(errs); return; }

    setErrors([]); setSubmitting(true);
    try {
      const payload = {
        title: title.trim(),
        description: (description || "").trim() || null,
        duration: d,
        start: new Date(start).toISOString(),
        finish: finish ? new Date(finish).toISOString() : null,
      };

      if (isEdit) {
         payload.status = Number(status);
        await updateTask(projectId, taskId, payload);
      } else {
        await createTask(projectId, payload);
      }

      navigate(`/projects/${projectId}/tasks`);
    } catch (e) {
      const api = e?.response?.data;
      setErrors(
        Array.isArray(api)
          ? api.map((x) => x.error || x.message || JSON.stringify(x))
          : [api?.message || api?.error || e.message || "Failed to save task."]
      );
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) return <div className="page-container py-4">Loading…</div>;

  return (
    <div className="page-container py-4">
      <div className="form-card card shadow-sm p-4 p-md-5">
        <div className="d-flex align-items-center justify-content-between mb-3">
          <h2 className="h4 m-0">{isEdit ? "Edit Task" : "Create Task"}</h2>
        </div>

        {errors.length > 0 && (
          <div className="alert alert-danger mb-4">
            <ul className="mb-0">{errors.map((m, i) => <li key={i}>{m}</li>)}</ul>
          </div>
        )}

        <form onSubmit={onSubmit} noValidate>
           <div className="form-floating mb-3">
            <input
              id="tTitle"
              type="text"
              className="form-control"
              placeholder=" "
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              autoFocus
            />
            <label htmlFor="tTitle">Title *</label>
          </div>

           <div className="form-floating mb-4">
            <textarea
              id="tDesc"
              className="form-control"
              placeholder=" "
              rows={5}
              style={{ height: "140px" }}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <label htmlFor="tDesc">Description (optional)</label>
          </div>

          <div className="row g-3 mb-4">
             <div className="col-md-4">
              <div className="form-floating">
                <input
                  id="tDur"
                  type="number"
                  min="1"
                  step="1"
                  className="form-control"
                  placeholder=" "
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  required
                />
                <label htmlFor="tDur">Duration (days) *</label>
              </div>
            </div>

             <div className="col-md-4">
              <div className="form-floating">
                <input
                  id="tStart"
                  type="date"
                  className="form-control"
                  placeholder=" "
                  value={start}
                  onChange={(e) => setStart(e.target.value)}
                  required
                />
                <label htmlFor="tStart">Start *</label>
              </div>
            </div>

             <div className="col-md-4">
              <div className="form-floating">
                <input
                  id="tFinish"
                  type="date"
                  className="form-control"
                  placeholder=" "
                  value={finish}
                  disabled
                  readOnly
                />
                <label htmlFor="tFinish">Finish</label>
              </div>
            </div>
          </div>

          {/* Status (EDIT ONLY) */}
          {isEdit && (
            <div className="row g-3 mb-4">
              <div className="col-md-4">
                <div className="form-floating">
                  <select
                    id="tStatus"
                    className="form-select"
                    value={String(status)}
                    onChange={(e) => setStatus(Number(e.target.value))}
                  >
                    {STATUS_OPTIONS.map((s) => (
                      <option key={s.value} value={s.value}>{s.label}</option>
                    ))}
                  </select>
                  <label htmlFor="tStatus">Status</label>
                </div>
              </div>
            </div>
          )}

          <div className="d-flex gap-2">
            <button className="btn btn-primary px-4" disabled={submitting}>
              {submitting ? "Saving…" : "Save"}
            </button>
            <button
              type="button"
              className="btn btn-outline-secondary px-4"
              onClick={() => navigate(`/projects/${projectId}/tasks`)}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

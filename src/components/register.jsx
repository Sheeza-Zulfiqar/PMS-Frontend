import { useState } from "react";
import { registerRequest } from "../utils/apis";
 
export default function Register() {
  const [form, setForm] = useState({
    firstname: "",
    lastname: "",
    username: "",
    email: "",
    mobileNumber: "",
    password: "",
    confirm: "",
  });
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState({ type: "", text: "" });
  const [fieldErrors, setFieldErrors] = useState({});  

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
     if (fieldErrors[name]) {
      setFieldErrors((s) => {
        const next = { ...s };
        delete next[name];
        return next;
      });
    }
  };

  const canSubmit =
    form.firstname.trim() &&
    form.lastname.trim() &&
    form.username.trim() &&
    form.email.trim() &&
    form.password.length >= 8 &&
    form.password === form.confirm;

  const hasErr = (name) => !!fieldErrors[name];
  const errText = (name) => fieldErrors[name]?.join(" ");

  async function onSubmit(e) {
    e.preventDefault();
    setMsg({ type: "", text: "" });
    setFieldErrors({});
    setBusy(true);

    try {
      await registerRequest({
        firstname: form.firstname.trim(),
        lastname: form.lastname.trim(),
        username: form.username.trim(),
        email: form.email.trim(),
        password: form.password,
        mobileNumber: form.mobileNumber.trim() || null,
      });
      setMsg({ type: "success", text: "Account created. Redirecting to login…" });
      setTimeout(() => (window.location.href = "/login"), 900);
    } catch (err) {
       const map = {};
      (err.errors || []).forEach(({ propertyName, error }) => {
        const key = (propertyName || "_").trim();
        map[key] = map[key] ? [...map[key], error] : [error];
      });
      setFieldErrors(map);
      setMsg({ type: "danger", text: "Please fix the errors below." });
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="auth-wrap d-flex align-items-center justify-content-center py-5" style={{ minHeight: "100vh" }}>
      <div className="auth-card card shadow-lg">
        <div className="card-body p-4 p-md-5">
          <h1 className="h3 text-center mb-4 text-dark">Create Account</h1>

          {msg.text && <div className={`alert alert-${msg.type}`}>{msg.text}</div>}

          <form onSubmit={onSubmit}>
            <div className="row g-3">
               <div className="col-md-6">
                <div className="form-floating">
                  <input
                    className={`form-control ${hasErr("firstname") ? "is-invalid" : ""}`}
                    id="firstname"
                    name="firstname"
                    placeholder="First name"
                    value={form.firstname}
                    onChange={onChange}
                    required
                  />
                  <label htmlFor="firstname">First name</label>
                  {hasErr("firstname") && <div className="invalid-feedback">{errText("firstname")}</div>}
                </div>
              </div>

              <div className="col-md-6">
                <div className="form-floating">
                  <input
                    className={`form-control ${hasErr("lastname") ? "is-invalid" : ""}`}
                    id="lastname"
                    name="lastname"
                    placeholder="Last name"
                    value={form.lastname}
                    onChange={onChange}
                    required
                  />
                  <label htmlFor="lastname">Last name</label>
                  {hasErr("lastname") && <div className="invalid-feedback">{errText("lastname")}</div>}
                </div>
              </div>

               <div className="col-md-6">
                <div className="form-floating">
                  <input
                    className={`form-control ${hasErr("username") ? "is-invalid" : ""}`}
                    id="username"
                    name="username"
                    placeholder="Username"
                    autoComplete="username"
                    value={form.username}
                    onChange={onChange}
                    required
                  />
                  <label htmlFor="username">Username</label>
                  {hasErr("username") && <div className="invalid-feedback">{errText("username")}</div>}
                </div>
              </div>

              <div className="col-md-6">
                <div className="form-floating">
                  <input
                    className={`form-control ${hasErr("email") ? "is-invalid" : ""}`}
                    id="email"
                    name="email"
                    type="email"
                    placeholder="name@example.com"
                    autoComplete="email"
                    value={form.email}
                    onChange={onChange}
                    required
                  />
                  <label htmlFor="email">Email</label>
                  {hasErr("email") && <div className="invalid-feedback">{errText("email")}</div>}
                </div>
              </div>

               <div className="col-12">
                <div className="form-floating">
                  <input
                    className={`form-control ${hasErr("mobileNumber") ? "is-invalid" : ""}`}
                    id="mobileNumber"
                    name="mobileNumber"
                    placeholder="Mobile"
                    value={form.mobileNumber}
                    onChange={onChange}
                  />
                  <label htmlFor="mobileNumber">Mobile (optional)</label>
                  {hasErr("mobileNumber") && <div className="invalid-feedback">{errText("mobileNumber")}</div>}
                </div>
              </div>

               <div className="col-md-6">
                <div className="form-floating">
                  <input
                    className={`form-control ${hasErr("password") ? "is-invalid" : ""}`}
                    id="password"
                    name="password"
                    type="password"
                    placeholder="Password"
                    autoComplete="new-password"
                    value={form.password}
                    onChange={onChange}
                    minLength={8}
                    required
                  />
                  <label htmlFor="password">Password</label>
                  <div className={`form-text ${hasErr("password") ? "text-danger" : ""}`}>Use at least 8 characters.</div>
                  {hasErr("password") && <div className="invalid-feedback d-block">{errText("password")}</div>}
                </div>
              </div>

              <div className="col-md-6">
                <div className="form-floating">
                  <input
                    className={`form-control ${
                      form.confirm && form.confirm !== form.password ? "is-invalid" : ""
                    }`}
                    id="confirm"
                    name="confirm"
                    type="password"
                    placeholder="Confirm"
                    autoComplete="new-password"
                    value={form.confirm}
                    onChange={onChange}
                    minLength={8}
                    required
                  />
                  <label htmlFor="confirm">Confirm password</label>
                  {form.confirm && form.password !== form.confirm && (
                    <div className="invalid-feedback">Passwords do not match.</div>
                  )}
                </div>
              </div>

               <div className="col-12">
                <button className="btn btn-primary w-100 mb-3" disabled={busy || !canSubmit}>
                  {busy ? "Creating…" : "Create Account"}
                </button>
                <a href="/login" className="btn btn-outline-secondary w-100">
                  Back to Login
                </a>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

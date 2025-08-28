import { useContext, useState } from "react";
 import { loginRequest } from "../utils/apis";
import AuthContext from "../context/AuthContext";
 
export default function Login() {
  const { login } = useContext(AuthContext);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});

  const hasErr = (n) => !!fieldErrors[n];
  const errText = (n) => fieldErrors[n]?.join(" ");

  const onUserChange = (e) => {
    setUsername(e.target.value);
    if (fieldErrors.username) setFieldErrors(({ username, ...rest }) => rest);
  };
  const onPassChange = (e) => {
    setPassword(e.target.value);
    if (fieldErrors.password) setFieldErrors(({ password, ...rest }) => rest);
  };

  async function onSubmit(e) {
    e.preventDefault();
    setError("");
    setFieldErrors({});
    setSubmitting(true);

    try {
      const data = await loginRequest(username.trim(), password);

      const payload = {
        user:  data?.user  ?? data?.User  ?? null,
        token: data?.token ?? data?.Token ?? null,
      };
      if (!payload.user || !payload.token) throw { message: "Unexpected login response.", errors: [] };

      login(payload);                  
      window.location.assign("/");
    } catch (err) {
      const map = {};
      (err.errors || []).forEach(({ propertyName, error }) => {
        const key = (propertyName || "_").trim();
        map[key] = map[key] ? [...map[key], error] : [error];
      });
      setFieldErrors(map);
      setError(err?.message || map._?.join(" ") || "Login failed. Check your credentials and try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="auth-wrap d-flex align-items-center justify-content-center py-5" style={{ minHeight: "100vh" }}>
      <div className="card shadow-lg" style={{ width: "100%", maxWidth: 480 }}>
        <div className="card-body p-4 p-md-5">
          <h1 className="h3 text-center mb-4 text-dark">Login</h1>

          {error && <div className="alert alert-danger py-2">{error}</div>}

          <form onSubmit={onSubmit} noValidate>
            <div className="mb-3">
              <label htmlFor="username" className="form-label">Username</label>
              <input
                id="username"
                type="text"
                className={`form-control ${hasErr("username") ? "is-invalid" : ""}`}
                placeholder="Enter Username"
                value={username}
                onChange={onUserChange}
                autoComplete="username"
                required
              />
              {hasErr("username") && <div className="invalid-feedback">{errText("username")}</div>}
            </div>

            <div className="mb-3">
              <label htmlFor="password" className="form-label mb-0">Password</label>
              <div className="input-group">
                <input
                  id="password"
                  type={showPw ? "text" : "password"}
                  className={`form-control ${hasErr("password") ? "is-invalid" : ""}`}
                  placeholder="••••••••"
                  value={password}
                  onChange={onPassChange}
                  autoComplete="current-password"
                  required
                />
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={() => setShowPw((v) => !v)}
                  aria-label={showPw ? "Hide password" : "Show password"}
                >
                  {showPw ? "Hide" : "Show"}
                </button>
              </div>
              {hasErr("password") && <div className="invalid-feedback d-block">{errText("password")}</div>}
              <div className="form-text">Use at least 8 characters.</div>
            </div>

            <button type="submit" className="btn btn-primary w-100" disabled={submitting}>
              {submitting ? "Logging in..." : "Login"}
            </button>

            <div className="text-center mt-3">
              <a href="/register" className="btn btn-outline-secondary w-100">Create Account</a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

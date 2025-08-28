 import { createContext, useContext, useEffect, useMemo, useState } from "react";

 let subs = new Set();
const getPath = () => window.location.pathname;
const notify = () => subs.forEach(fn => fn(getPath()));

window.addEventListener("popstate", notify);

export function navigate(to, { replace = false } = {}) {
  if (to === getPath()) return;
  const fn = replace ? "replaceState" : "pushState";
  window.history[fn]({}, "", to);
  notify();
  window.scrollTo({ top: 0, behavior: "instant" });
}

function useLocation() {
  const [path, setPath] = useState(getPath());
  useEffect(() => {
    const cb = (p) => setPath(p);
    subs.add(cb);
    return () => subs.delete(cb);
  }, []);
  return path;
}

 function matchPath(pattern, pathname) {
   const clean = (s) => s.replace(/\/+$/, "");
  const pSeg = clean(pattern).split("/").filter(Boolean);
  const aSeg = clean(pathname).split("/").filter(Boolean);

  if (pSeg.length !== aSeg.length) return { ok: false, params: {} };

  const params = {};
  for (let i = 0; i < pSeg.length; i++) {
    const p = pSeg[i];
    const a = aSeg[i];
    if (p.startsWith(":")) {
      params[p.slice(1)] = decodeURIComponent(a);
    } else if (p !== a) {
      return { ok: false, params: {} };
    }
  }
  return { ok: true, params };
}

 const RouterCtx = createContext({ path: "/", params: {}, navigate });

export function useRouter() {
  return useContext(RouterCtx);
}

 export default function Route({ path: pattern, children }) {
  const path = useLocation();

  const { ok, params } = useMemo(
    () => matchPath(pattern, path),
    [pattern, path]
  );

  if (!ok) return null;

  return (
    <RouterCtx.Provider value={{ path, params, navigate }}>
      {children}
    </RouterCtx.Provider>
  );
}

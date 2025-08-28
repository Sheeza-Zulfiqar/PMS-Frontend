import { useContext, useEffect } from "react";
import "./App.css";
import Route, { useRouter, navigate } from "./components/customRouter/router";

import AuthContext from "./context/AuthContext";

import Login from "./components/Login";
import Register from "./components/register";
import Layout from "./components/layout";

import Home from "./components/pages/Home";
import ProjectsList from "./components/pages/ProjectList";
import ProjectForm from "./components/pages/ProjectForm";
import ProjectTasksList from "./components/pages/ProjectTasksList";
import TaskForm from "./components/pages/TaskForm";

 function RequireAuth({ children }) {
  const { isAuthenticated } = useContext(AuthContext);
  const { path } = useRouter();

  useEffect(() => {
    if (!isAuthenticated) navigate("/login");
  }, [isAuthenticated, path]);

  return isAuthenticated ? children : null;
}

function RedirectIfAuthed({ children }) {
  const { isAuthenticated } = useContext(AuthContext);
  const { path } = useRouter();

  useEffect(() => {
    if (isAuthenticated) navigate("/");
  }, [isAuthenticated, path]);

  return isAuthenticated ? null : children;
}
 
export default function App() {
  return (
    <>
       <Route path="/login">
        <RedirectIfAuthed>
          <Login />
        </RedirectIfAuthed>
      </Route>

      <Route path="/register">
        <RedirectIfAuthed>
          <Register />
        </RedirectIfAuthed>
      </Route>

       <Route path="/">
        <RequireAuth>
          <Layout>
            <Home />
          </Layout>
        </RequireAuth>
      </Route>

      <Route path="/projects/manage">
        <RequireAuth>
          <Layout>
            <ProjectsList />
          </Layout>
        </RequireAuth>
      </Route>

      <Route path="/projects/new">
        <RequireAuth>
          <Layout>
            <ProjectForm />
          </Layout>
        </RequireAuth>
      </Route>

      <Route path="/projects/:id/edit">
        <RequireAuth>
          <Layout>
            <ProjectForm />
          </Layout>
        </RequireAuth>
      </Route>

      <Route path="/projects/:id/tasks">
        <RequireAuth>
          <Layout>
            <ProjectTasksList />
          </Layout>
        </RequireAuth>
      </Route>

      <Route path="/projects/:id/tasks/new">
        <RequireAuth>
          <Layout>
            <TaskForm />
          </Layout>
        </RequireAuth>
      </Route>

      <Route path="/projects/:id/tasks/:taskId/edit">
        <RequireAuth>
          <Layout>
            <TaskForm />
          </Layout>
        </RequireAuth>
      </Route>
    </>
  );
}

import { useEffect, useState } from "react";
import { apiClient } from "../clients/api";
import { Link } from "react-router-dom";
import type { Project } from "../types";
import ProjectForm from "../components/ProjectForm";

function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [editingProject, setEditingProject] = useState<Project | null>(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        setError("");
        const res = await apiClient.get("/api/projects");
        console.log(res.data);
        setProjects(res.data);
      } catch (error: any) {
        console.log(error);
        const message =
          error.response?.data?.message || error.message || "Error loading projects";
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      setError("");
      setLoading(true);
      await apiClient.delete(`/api/projects/${id}`);
      setProjects(prev => prev.filter(project => project._id !== id));
      if (editingProject?._id === id) {
        setEditingProject(null);
      }
    } catch (error: any) {
      console.error(error);
      const message =
        error.response?.data?.message || error.message || "Error deleting project";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  if (loading && projects.length === 0) {
    return <div className="text-3xl text-white">Loading...</div>;
  }

  return (
    <div className="text-white">
      <h1 className="text-4xl font-bold text-white">Projects</h1>

      <ProjectForm
        project={editingProject ?? undefined}
        submitLabel={editingProject ? "Update Project" : "Create Project"}
        onSuccess={(savedProject) => {
          setProjects(prev => {
            const exists = prev.some(p => p._id === savedProject._id);
            return exists
              ? prev.map(p => (p._id === savedProject._id ? savedProject : p))
              : [...prev, savedProject];
          });
          setEditingProject(null);
        }}
      />

      {error && <div className="mt-4 text-red-400">{error}</div>}

      <div className="w-full flex gap-5 mt-10 flex-wrap">
        {projects.length > 0 ? (
          projects.map((project) => (
            <div
              key={project._id}
              className="text-white w-50 flex flex-col h-50 border border-red-500 p-2 text-center rounded"
            >
              <div className="font-bold">{project.name}</div>
              <div>{project.description}</div>

              <div className="mt-auto flex flex-col gap-2">
                <Link
                  to={`/projects/${project._id}`}   
                  className="bg-sky-500 rounded py-1"
                >
                  See Project
                </Link>

                <button
                  type="button"
                  className="bg-yellow-500 rounded py-1"
                  onClick={() => setEditingProject(project)}
                >
                  Edit
                </button>

                <button
                  type="button"
                  className="bg-pink-500 rounded py-1"
                  onClick={() => handleDelete(project._id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        ) : (
          <div>no projects</div>
        )}
      </div>
    </div>
  );
}

export default ProjectsPage;
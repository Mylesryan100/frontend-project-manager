import { useEffect, useState } from "react";
import { apiClient } from "../clients/api";
import { useParams } from "react-router-dom";
import type { Project } from "../types";
import TaskList from "../components/TaskList";

function ProjectDetailsPage() {
  const { projectId } = useParams<{ projectId: string }>();

  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProjectDetails = async () => {
      if (!projectId) return;

      try {
        setLoading(true);
        setError("");
        const res = await apiClient.get(`/api/projects/${projectId}`);
        console.log("Project details:", res.data);
        setProject(res.data);
      } catch (err: any) {
        console.error(err);
        const message =
          err.response?.data?.message || err.message || "Error loading project";
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    fetchProjectDetails();
  }, [projectId]);

  if (loading && !project) {
    return <div className="text-3xl text-white">Loading...</div>;
  }

  if (error && !project) {
    return (
      <div className="text-3xl text-red-400">
        Error loading project: {error}
      </div>
    );
  }

  if (!project) {
    return (
      <div className="text-3xl text-white">
        Project not found.
      </div>
    );
  }

  return (
    <div className="text-white max-w-3xl mx-auto">
      <h1 className="text-4xl mb-4">Project Details</h1>

      <div className="mt-4 mb-10">
        <div className="text-3xl font-semibold">{project.name}</div>
        <div className="text-xl text-gray-300">{project.description}</div>
      </div>

      {/* This section handles the tasks are entirely handled by the TaskList*/}
      {projectId && <TaskList projectId={projectId} />}
    </div>
  );
}

export default ProjectDetailsPage;
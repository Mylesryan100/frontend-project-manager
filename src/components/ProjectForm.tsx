import { useState } from "react";
import { apiClient } from "../clients/api";
import type { Project } from "../types";

interface ProjectFormProps {
  project?: Project;
  onSuccess?: (project: Project) => void;
  submitLabel?: string;
}

function ProjectForm({ project, onSuccess, submitLabel }: ProjectFormProps) {
  const [name, setName] = useState(project?.name ?? "");
  const [description, setDescription] = useState(project?.description ?? "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const isEditMode = Boolean(project?._id);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!name.trim()) {
      setError("Project name is required.");
      return;
    }

    try {
      setLoading(true);

      let res;
      if (isEditMode && project?._id) {
        res = await apiClient.put(`/api/projects/${project._id}`, {
          name,
          description,
        });
      } else {
        res = await apiClient.post("/api/projects", {
          name,
          description,
        });
      }

      const savedProject: Project = res.data;


      onSuccess?.(savedProject);

      // Clear form only in create mode
      if (!isEditMode) {
        setName("");
        setDescription("");
      }
    } catch (err: any) {
      console.error(err);
      const message =
        err.response?.data?.message || err.message || "Error saving project.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="border p-4 mt-10 flex flex-col gap-3 rounded bg-zinc-800"
    >
      <h2 className="text-xl font-semibold text-white">
        {isEditMode ? "Edit Project" : "Create Project"}
      </h2>

      {error && <div className="text-red-400 text-sm">{error}</div>}

      <label className="text-sm text-gray-200">
        Project Name
        <input
          type="text"
          className="mt-1 w-full border border-zinc-600 rounded p-2 bg-zinc-900 text-white"
          value={name}
          onChange={e => setName(e.target.value)}
        />
      </label>

      <label className="text-sm text-gray-200">
        Project Description
        <input
          type="text"
          className="mt-1 w-full border border-zinc-600 rounded p-2 bg-zinc-900 text-white"
          value={description}
          onChange={e => setDescription(e.target.value)}
        />
      </label>

      <button
        type="submit"
        disabled={loading}
        className="mt-2 self-start bg-sky-500 hover:bg-sky-600 disabled:opacity-60 text-white px-4 py-2 rounded"
      >
        {loading
          ? isEditMode
            ? "Saving..."
            : "Creating..."
          : submitLabel || (isEditMode ? "Save Changes" : "Create Project")}
      </button>
    </form>
  );
}

export default ProjectForm;
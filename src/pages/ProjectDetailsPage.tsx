import { useEffect, useState } from "react";
import { apiClient } from "../clients/api";
import { useParams, Link } from "react-router-dom";
import type { Project } from "../types";

type TaskStatus = "todo" | "in-progress" | "done";

interface Task {
  _id: string;
  title: string;
  description?: string;
  status: TaskStatus;
}

function ProjectDetailsPage() {
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [tasks, setTasks] = useState<Task[]>([]);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<TaskStatus>("todo");

  const { projectId } = useParams();

  useEffect(() => {
    const fetchProjectDetails = async () => {
      try {
        setLoading(true);
        const res = await apiClient.get(`/api/projects/${projectId}`);
        console.log(res.data);
        setProject(res.data);
        setTasks(res.data);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        console.log(error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProjectDetails();
  }, [projectId]);

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectId || !title.trim()) return;

    try {
      const res = await apiClient.post(`/api/projects/${projectId}/tasks`, {
        title,
        description,
        status,
      });

      setTasks((prev) => [...prev, res.data]);
      setTitle("");
      setDescription("");
      setStatus("todo");
    } catch (err: any) {
      console.error(err);
      const message =
        err.response?.data?.message || err.message || "Error creating task";
      setError(message);
    }
  };

  const handleUpdateStatus = async (taskId: string, newStatus: TaskStatus) => {
    if (!projectId) return;

    try {
      const res = await apiClient.put(
        `/api/projects/${projectId}/tasks/${taskId}`,
        { status: newStatus }
      );

      setTasks((prev) => prev.map((t) => (t._id === taskId ? res.data : t)));
    } catch (err: any) {
      console.error(err);
      const message =
        err.response?.data?.message || err.message || "Error updating task";
      setError(message);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    if (!projectId) return;

    try {
      await apiClient.delete(`/api/projects/${projectId}/tasks/${taskId}`);
      setTasks((prev) => prev.filter((t) => t._id !== taskId));
    } catch (err: any) {
      console.error(err);
      const message =
        err.response?.data?.message || err.message || "Error deleting task";
      setError(message);
    }

    const [projectRes, tasksRes] = await Promise.all([
      apiClient.get(`/api/projects/${projectId}`),
      apiClient.get(`/api/projects/${projectId}/tasks`),
    ]);
    setProject(projectRes.data);
    setTasks(tasksRes.data);
  };

  if (loading) {
    return <div className="text-3xl text-white">Loading...</div>;
  }

  if (error) {
    return (
      <div className="text-3xl text-red-400">
        Error: {error || "Error loading project"}
      </div>
    );
  }

  if (!project) {
    return <div className="text-3xl text-white">Project not found.</div>;
  }

  // if (loading) return <div className="text-3xl text-white">Loading...</div>;

  // if (error) return <div className="text-3xl text-white">Error loading Project</div>;

  return (
    <div className="text-white max-w-3xl mx-auto">
      <Link to="/projects" className="text-blue-400 hover:underline">
        ← Back to Projects
      </Link>

      <h1 className="text-4xl mt-4 mb-2">Project Details</h1>

      <div className="mt-4 mb-8">
        <div className="text-3xl font-semibold">{project.name}</div>
        <div className="text-xl text-gray-300">{project.description}</div>
      </div>

      {/* New Task Form */}
      <section className="mb-8">
        <h2 className="text-2xl mb-2">Add Task</h2>
        <form
          onSubmit={handleCreateTask}
          className="space-y-3 bg-slate-800 p-4 rounded"
        >
          <div>
            <label className="block text-sm mb-1">Title</label>
            <input
              className="w-full p-2 rounded bg-slate-900 border border-slate-700"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Description</label>
            <textarea
              className="w-full p-2 rounded bg-slate-900 border border-slate-700"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Status</label>
            <select
              className="w-full p-2 rounded bg-slate-900 border border-slate-700"
              value={status}
              onChange={(e) => setStatus(e.target.value as TaskStatus)}
            >
              <option value="todo">To Do</option>
              <option value="in-progress">In Progress</option>
              <option value="done">Done</option>
            </select>
          </div>

          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded"
          >
            Create Task
          </button>
        </form>
      </section>

      {/* Task List */}
      <section>
        <h2 className="text-2xl mb-2">Tasks</h2>
        {tasks.length === 0 ? (
          <p className="text-gray-400">No tasks yet. Add one above.</p>
        ) : (
          <ul className="space-y-3">
            {tasks.map((task) => (
              <li
                key={task._id}
                className="bg-slate-800 p-4 rounded flex flex-col gap-2"
              >
                <div className="flex justify-between items-center">
                  <span className="font-semibold">{task.title}</span>
                  <span className="text-sm text-gray-300">{task.status}</span>
                </div>
                {task.description && (
                  <p className="text-gray-300 text-sm">{task.description}</p>
                )}
                <div className="flex flex-wrap gap-2 mt-2">
                  <button
                    className="px-2 py-1 text-xs bg-slate-700 rounded"
                    onClick={() => handleUpdateStatus(task._id, "todo")}
                  >
                    To Do
                  </button>
                  <button
                    className="px-2 py-1 text-xs bg-slate-700 rounded"
                    onClick={() => handleUpdateStatus(task._id, "in-progress")}
                  >
                    In Progress
                  </button>
                  <button
                    className="px-2 py-1 text-xs bg-slate-700 rounded"
                    onClick={() => handleUpdateStatus(task._id, "done")}
                  >
                    Done
                  </button>
                  <button
                    className="px-2 py-1 text-xs bg-red-600 rounded"
                    onClick={() => handleDeleteTask(task._id)}
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

export default ProjectDetailsPage;

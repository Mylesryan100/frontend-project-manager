import { useState } from "react";
import { apiClient } from "../clients/api";

type TaskStatus = "todo" | "in-progress" | "done";

export interface Task {
  _id: string;
  title: string;
  description?: string;
  status: TaskStatus;
}

interface TaskFormProps {
  projectId: string;
  // If task is provided edit mode, otherwise create mode
  task?: Task;
  // Called with the created/updated task
  onSuccess?: (task: Task) => void;
  // Optional override for button text
  submitLabel?: string;
}

function TaskForm({ projectId, task, onSuccess, submitLabel }: TaskFormProps) {
  const [title, setTitle] = useState(task?.title ?? "");
  const [description, setDescription] = useState(task?.description ?? "");
  const [status, setStatus] = useState<TaskStatus>(task?.status ?? "todo");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const isEditMode = Boolean(task?._id);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!title.trim()) {
      setError("Task title is required.");
      return;
    }

    try {
      setLoading(true);

      let res;
      if (isEditMode && task?._id) {

        // UPDATE existing task
        res = await apiClient.put(
          `/api/projects/${projectId}/tasks/${task._id}`,
          { title, description, status }
        );
      } else {
        
        // CREATE new task
        res = await apiClient.post(`/api/projects/${projectId}/tasks`, {
          title,
          description,
          status,
        });
      }

      const savedTask: Task = res.data;
      onSuccess?.(savedTask);

      // Only clear form for create mode
      if (!isEditMode) {
        setTitle("");
        setDescription("");
        setStatus("todo");
      }
    } catch (err: any) {
      console.error(err);
      const message =
        err.response?.data?.message || err.message || "Error saving task.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-3 bg-slate-800 p-4 rounded mt-6"
    >
      <h2 className="text-2xl mb-2 text-white">
        {isEditMode ? "Edit Task" : "Add Task"}
      </h2>

      {error && <div className="text-red-400 text-sm">{error}</div>}

      <div>
        <label className="block text-sm mb-1 text-gray-200">Title</label>
        <input
          className="w-full p-2 rounded bg-slate-900 border border-slate-700 text-white"
          value={title}
          onChange={e => setTitle(e.target.value)}
          required
        />
      </div>

      <div>
        <label className="block text-sm mb-1 text-gray-200">Description</label>
        <textarea
          className="w-full p-2 rounded bg-slate-900 border border-slate-700 text-white"
          value={description}
          onChange={e => setDescription(e.target.value)}
        />
      </div>

      <div>
        <label className="block text-sm mb-1 text-gray-200">Status</label>
        <select
          className="w-full p-2 rounded bg-slate-900 border border-slate-700 text-white"
          value={status}
          onChange={e => setStatus(e.target.value as TaskStatus)}
        >
          <option value="todo">To Do</option>
          <option value="in-progress">In Progress</option>
          <option value="done">Done</option>
        </select>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded text-white disabled:opacity-60"
      >
        {loading
          ? isEditMode
            ? "Saving..."
            : "Creating..."
          : submitLabel || (isEditMode ? "Save Task" : "Create Task")}
      </button>
    </form>
  );
}

export default TaskForm;
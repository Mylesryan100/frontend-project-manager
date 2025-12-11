import { useState, useEffect } from "react";
import { apiClient } from "../clients/api";


// Allowed status values. These match your Mongoose enum: "todo" | "in-progress" | "done"
type TaskStatus = "todo" | "in-progress" | "done";

// Shape of a Task object coming from the backend
interface Task {
  _id: string;
  title: string;
  description?: string;
  status: TaskStatus;
}

// Props expected by this component: it needs to know which project it belongs to
interface TaskListProps {
  projectId: string;
}

// Map raw status values to user-friendly labels
const STATUS_LABELS: Record<TaskStatus, string> = {
  "todo": "To Do",
  "in-progress": "In Progress",
  "done": "Done",
};

function TaskList({ projectId }: TaskListProps) {
  // State for tasks + loading + errors
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // State for "Add Task" form
  const [showAddTask, setShowAddTask] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskDescription, setNewTaskDescription] = useState("");
  const [newTaskStatus, setNewTaskStatus] = useState<TaskStatus>("todo");

  // State for "Edit Task" mode
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [editedTaskTitle, setEditedTaskTitle] = useState("");
  const [editedTaskDescription, setEditedTaskDescription] = useState("");
  const [editedTaskStatus, setEditedTaskStatus] = useState<TaskStatus>("todo");


  // useEffect: fetch all tasks for this project when component mounts
  // or when projectId changes
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setLoading(true);
        setError("");
        // GET /api/projects/:projectId/tasks
        const res = await apiClient.get(`/api/projects/${projectId}/tasks`);
        console.log("Tasks:", res.data);
        setTasks(res.data);
      } catch (err: any) {
        console.error(err);
        const message =
          err.response?.data?.message ||
          err.message ||
          "Failed to load tasks";
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    if (projectId) {
      fetchTasks();
    }
  }, [projectId]);

  // Create a new task (POST)
  const handleAddTask = async () => {
    // Basic validation: title is required
    if (!newTaskTitle.trim()) {
      alert("Task title is required");
      return;
    }

    try {
      setLoading(true);
      setError("");
      // POST /api/projects/:projectId/tasks
      const res = await apiClient.post(`/api/projects/${projectId}/tasks`, {
        title: newTaskTitle,
        description: newTaskDescription,
        status: newTaskStatus,
      });

      console.log("Created task:", res.data);
      // Add the new task to the bottom of the list
      setTasks(prev => [...prev, res.data]);
      // Reset form fields
      setNewTaskTitle("");
      setNewTaskDescription("");
      setNewTaskStatus("todo");
      // Close the "Add Task" form
      setShowAddTask(false);
    } catch (err: any) {
      console.error(err);
      const message =
        err.response?.data?.message ||
        err.message ||
        "Failed to create task";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  // Start editing an existing task
  const handleEditTask = (task: Task) => {
    // Turn on "edit mode" for a specific task id
    setEditingTaskId(task._id);
    // Pre-fill inputs with existing task data
    setEditedTaskTitle(task.title);
    setEditedTaskDescription(task.description || "");
    setEditedTaskStatus(task.status ?? "todo");
  };


  // Cancel editing and reset edit form state
  const handleCancelTaskEdit = () => {
    setEditingTaskId(null);
    setEditedTaskTitle("");
    setEditedTaskDescription("");
    setEditedTaskStatus("todo");
  };

  // Save edits to a task (PUT)
  const handleSaveTaskEdit = async (taskId: string) => {
    // Simple validation
    if (!editedTaskTitle.trim()) {
      alert("Task title is required");
      return;
    }

    try {
      setLoading(true);
      setError("");
      // PUT /api/projects/:projectId/tasks/:taskId
      const res = await apiClient.put(
        `/api/projects/${projectId}/tasks/${taskId}`,
        {
          title: editedTaskTitle,
          description: editedTaskDescription,
          status: editedTaskStatus,
        }
      );

      console.log("Updated task:", res.data);
      // Replace the old version of this task in state with the updated one
      setTasks(prev => prev.map(t => (t._id === taskId ? res.data : t)));
      // Exit edit mode
      setEditingTaskId(null);
    } catch (err: any) {
      console.error(err);
      const message =
        err.response?.data?.message ||
        err.message ||
        "Failed to update task";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  //
  // Delete a task (DELETE)
  //
  const handleDeleteTask = async (taskId: string) => {
    try {
      setLoading(true);
      setError("");
      // DELETE /api/projects/:projectId/tasks/:taskId
      await apiClient.delete(`/api/projects/${projectId}/tasks/${taskId}`);
      // Remove the deleted task from state
      setTasks(prev => prev.filter(t => t._id !== taskId));
    } catch (err: any) {
      console.error(err);
      const message =
        err.response?.data?.message ||
        err.message ||
        "Failed to delete task";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  
  //This section shows the JSX
  return (
    <div className="mt-10 border-t border-slate-700 pt-6">
      {/* Header row: title + "Add Task" toggle button */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-3xl text-slate-50">Tasks</h2>
        <button
          className="bg-emerald-500 hover:bg-emerald-600 text-slate-950 px-4 py-2 rounded-lg transition font-medium"
          // Toggles the Add Task form open/closed
          onClick={() => setShowAddTask(prev => !prev)}
        >
          {showAddTask ? "Cancel" : "+ Add Task"}
        </button>
      </div>

      {/* Error message from API or other failures */}
      {error && (
        <div className="text-rose-400 mb-4 bg-rose-950/40 border border-rose-700 rounded px-3 py-2 text-sm">
          {error}
        </div>
      )}

      {/* Add Task Form – only visible when showAddTask is true */}
      {showAddTask && (
        <div className="bg-slate-900 p-4 rounded-xl mb-4 border border-slate-700 shadow-md shadow-slate-900/40">
          {/* Task Title Input */}
          <input
            className="text-slate-50 border border-slate-600 focus:border-indigo-400 focus:outline-none p-2 rounded-lg w-full mb-3 bg-slate-950 placeholder:text-slate-400"
            type="text"
            value={newTaskTitle}
            onChange={e => setNewTaskTitle(e.target.value)}
            placeholder="Task title"
            autoFocus
          />

          {/* Task Status Select */}
          <select
            className="text-slate-50 border border-slate-600 focus:border-indigo-400 focus:outline-none p-2 rounded-lg w-full mb-3 bg-slate-950"
            value={newTaskStatus}
            onChange={e => setNewTaskStatus(e.target.value as TaskStatus)}
          >
            <option value="todo">To Do</option>
            <option value="in-progress">In Progress</option>
            <option value="done">Done</option>
          </select>

          {/* Task Description Textarea */}
          <textarea
            className="text-slate-50 border border-slate-600 focus:border-indigo-400 focus:outline-none p-2 rounded-lg w-full mb-3 min-h-[80px] bg-slate-950 placeholder:text-slate-400"
            value={newTaskDescription}
            onChange={e => setNewTaskDescription(e.target.value)}
            placeholder="Task description (optional)"
          />

          {/* Buttons for submit/cancel create */}
          <div className="flex gap-2">
            <button
              className="bg-indigo-500 hover:bg-indigo-600 text-slate-50 px-4 py-2 rounded-lg transition font-medium"
              onClick={handleAddTask}
              disabled={loading}
            >
              {loading ? "Creating..." : "Create Task"}
            </button>
            <button
              className="bg-slate-700 hover:bg-slate-600 text-slate-100 px-4 py-2 rounded-lg transition"
              onClick={() => setShowAddTask(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Main list area – handles loading, empty state, and list of tasks */}
      {loading && tasks.length === 0 ? (
        // Loading state when we haven't loaded any tasks yet
        <div className="text-xl text-slate-400">Loading tasks...</div>
      ) : tasks.length === 0 ? (
        // Empty state if there are no tasks
        <div className="text-slate-400 text-center py-8 italic">
          No tasks yet. Click &quot;+ Add Task&quot; to create one.
        </div>
      ) : (
        // Render the list of tasks
        <div className="space-y-3">
          {tasks.map(task => (
            <div
              key={task._id}
              className="bg-slate-900 p-4 rounded-xl border border-slate-700 hover:bg-slate-800 transition shadow-sm shadow-slate-900/40"
            >
              {/* If this task is in edit mode, show edit inputs */}
              {editingTaskId === task._id ? (
                <div>
                  {/* Edit Title */}
                  <input
                    className="text-slate-50 border border-slate-600 focus:border-indigo-400 focus:outline-none p-2 rounded-lg w-full mb-2 bg-slate-950 placeholder:text-slate-400"
                    type="text"
                    value={editedTaskTitle}
                    onChange={e => setEditedTaskTitle(e.target.value)}
                    placeholder="Task title"
                  />

                  {/* Edit Status */}
                  <select
                    className="text-slate-50 border border-slate-600 focus:border-indigo-400 focus:outline-none p-2 rounded-lg w-full mb-2 bg-slate-950"
                    value={editedTaskStatus}
                    onChange={e =>
                      setEditedTaskStatus(e.target.value as TaskStatus)
                    }
                  >
                    <option value="todo">To Do</option>
                    <option value="in-progress">In Progress</option>
                    <option value="done">Done</option>
                  </select>

                  {/* Edit Description */}
                  <textarea
                    className="text-slate-50 border border-slate-600 focus:border-indigo-400 focus:outline-none p-2 rounded-lg w-full mb-3 min-h-[80px] bg-slate-950 placeholder:text-slate-400"
                    value={editedTaskDescription}
                    onChange={e => setEditedTaskDescription(e.target.value)}
                    placeholder="Task description"
                  />

                  {/* Buttons to save/cancel edit */}
                  <div className="flex gap-2">
                    <button
                      className="bg-emerald-500 hover:bg-emerald-600 text-slate-950 px-4 py-2 rounded-lg text-sm transition font-medium"
                      onClick={() => handleSaveTaskEdit(task._id)}
                      disabled={loading}
                    >
                      {loading ? "Saving..." : "Save"}
                    </button>
                    <button
                      className="bg-slate-700 hover:bg-slate-600 text-slate-100 px-4 py-2 rounded-lg text-sm transition"
                      onClick={handleCancelTaskEdit}
                      disabled={loading}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                // View mode: show task info + Edit/Delete buttons
                <div className="flex justify-between items-start gap-4">
                  <div className="text-slate-50 flex-1">
                    {/* Task title */}
                    <h3 className="text-xl font-semibold mb-1">
                      {task.title}
                    </h3>

                    {/* Status pill */}
                    <span className="text-xs px-2 py-1 rounded-full bg-amber-500/15 border border-amber-500/60 text-amber-300 inline-flex items-center gap-1 mb-2">
                      <span className="h-2 w-2 rounded-full bg-amber-400" />
                      {STATUS_LABELS[task.status] ?? task.status}
                    </span>

                    {/* Optional description */}
                    {task.description && (
                      <p className="text-slate-300 text-sm whitespace-pre-wrap mt-1">
                        {task.description}
                      </p>
                    )}
                  </div>

                  {/* Edit / Delete buttons */}
                  <div className="flex flex-col gap-2">
                    <button
                      className="bg-indigo-500 hover:bg-indigo-600 text-slate-50 px-3 py-1 rounded-lg text-sm transition"
                      onClick={() => handleEditTask(task)}
                    >
                      Edit
                    </button>
                    <button
                      className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-lg text-sm transition"
                      onClick={() => handleDeleteTask(task._id)}
                      disabled={loading}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default TaskList;
